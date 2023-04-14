import { URLSearchParamsInit, createSearchParams, useNavigate } from 'react-router-dom';

const useNavigateParams = () => {
    const navigate = useNavigate();

    return (pathname: string, params?: URLSearchParamsInit) => {
        const path = {
            pathname,
            search: createSearchParams(params).toString(),
        };
        navigate(path);
    };
};

export default useNavigateParams;
