import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router';

function UserRoute() {
    const currentAccount = useSelector((state: any) => state?.user?.currentUser);
    const location = useLocation();
    return !!currentAccount ? <Outlet /> : <Navigate to="/" replace state={{ from: location }} />;
}

export default UserRoute;
