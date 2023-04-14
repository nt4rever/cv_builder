import { signupAccount } from 'apis/auth';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { snackBarAction } from 'redux/SnackBar/slice';
import { forgotPassword as forgotPasswordApi } from 'apis/auth';
interface SignUpProps {
    data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    };
    successFn?: () => void;
    errorFn?: () => void;
}

interface ForgotPasswordProps {
    data: {
        email: string;
    };
    successFn?: () => void;
    errorFn?: () => void;
}

interface ErrorResponse {
    statusCode: number;
    message?: string | string[];
    error?: string;
}

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const signUp = ({ data, successFn, errorFn }: SignUpProps) => {
        setIsLoading(true);
        signupAccount(data)
            .then((res) => {
                const message = res.data.message;
                setIsLoading(false);
                dispatch(
                    snackBarAction.open({
                        message,
                        type: 'success',
                        duration: 3000,
                    }),
                );
                if (successFn) successFn();
            })
            .catch((error: AxiosError<ErrorResponse>) => {
                setIsLoading(false);
                if (errorFn) errorFn();
            });
    };

    const forgotPassword = ({ data, successFn, errorFn }: ForgotPasswordProps) => {
        setIsLoading(true);
        forgotPasswordApi(data)
            .then((res) => {
                const message = res.data.message;
                setIsLoading(false);
                dispatch(
                    snackBarAction.open({
                        message,
                        type: 'success',
                        duration: 3000,
                    }),
                );
                if (successFn) successFn();
            })
            .catch((error: AxiosError<ErrorResponse>) => {
                setIsLoading(false);
                if (errorFn) errorFn();
            });
    };

    return { isLoading, signUp, forgotPassword };
};
