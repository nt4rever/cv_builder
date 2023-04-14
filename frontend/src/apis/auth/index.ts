import { UserResponse } from './../../utils/types/index';
import axiosClient from '../../utils/axiosClient';

/* A constant object that contains the endpoints for the social login. */
const END_POINT = {
    GOOGLE_LOGIN: '/auth/google',
    FACEBOOK_LOGIN: '/auth/facebook',
    CURRENT_USER: '/auth/me',
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/signin',
    LOG_OUT: '/auth/logout',
    UPDATE: '/auth/update',
    FORGOT_PASSWORD: '/auth/reset-password',
    DELETE: '/auth/delete',
    ME: "auth/me",
};

export const apiAuthEndPoint = END_POINT;

export interface SocialLoginPayload {
    access_token: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user: UserResponse;
}

interface AccountLogin {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

interface UserRequest {
    firstName: string;
    lastName: string;
    oldPassword: string | null;
    newPassword: string | null;
    access_token: string;
}

export const googleLogin = (payload: SocialLoginPayload) => {
    return axiosClient.post<LoginResponse>(
        END_POINT.GOOGLE_LOGIN,
        {},
        {
            headers: { Authorization: `Bearer ${payload.access_token}` },
        },
    );
};

export const facebookLogin = (payload: SocialLoginPayload) => {
    return axiosClient.post<LoginResponse>(
        END_POINT.FACEBOOK_LOGIN,
        {},
        {
            headers: { Authorization: `Bearer ${payload.access_token}` },
        },
    );
};

export const currentUser = (payload: SocialLoginPayload) => {
    return axiosClient.get(END_POINT.CURRENT_USER, {
        headers: { Authorization: `Bearer ${payload.access_token}` },
    });
};

export const signupAccount = (payload: AccountLogin) => {
    return axiosClient.post<{ message: string }>(END_POINT.SIGNUP, {
        email: payload.email,
        password: payload.password,
        firstName: payload.firstName,
        lastName: payload.lastName,
    });
};

export const loginAccount = (payload: AccountLogin) => {
    return axiosClient.post<LoginResponse>(END_POINT.LOGIN, {
        email: payload.email,
        password: payload.password,
    });
};

export const logoutAccount = (payload: SocialLoginPayload) => {
    return axiosClient.get(END_POINT.LOG_OUT, {
        headers: { Authorization: `Bearer ${payload.access_token}` },
    });
};

export const updateAccount = (payload: UserRequest) => {
    return axiosClient.post(END_POINT.UPDATE, payload, {
        headers: { Authorization: `Bearer ${payload.access_token}` },
    });
};

export const forgotPassword = (payload: { email: string }) => {
    return axiosClient.post<{ message: string }>(END_POINT.FORGOT_PASSWORD, payload);
};

export const deleteAccount = (access_token: string) => {
    return axiosClient.delete(END_POINT.DELETE, {
        headers: { Authorization: `Bearer ${access_token}` },
    });
};

export const getMe = (access_token: string) => {
    return axiosClient.get(END_POINT.ME, {
        headers: { Authorization: `Bearer ${access_token}` },
    });
};
