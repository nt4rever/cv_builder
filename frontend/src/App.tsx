import { Route, Routes } from 'react-router';
import Home from './pages/Home/index';
import LoginPage from './pages/Login';
import SignUpPage from './pages/Signup';
import ForgotPage from './pages/ForgotPass';
import NewUser from 'pages/NewUser';
import NotFound from 'pages/NotFound';
import TemplatePageCv from './components/TemplatePage/TemplatePage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import Account from 'pages/Account/Account';
import AddCV from 'pages/AddCV/AddCV';
import DesignCV from 'pages/DesignCV';
import { SnackBarNotification } from 'components/SnackBar';
import UserRoute from 'components/Router/UserRoute';
import GuestRoute from 'components/Router/GuestRoute';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
import EditCVPage from 'pages/EditCVPage';
import View from 'pages/View';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { update } from 'redux/userSlice';
import { getMe } from 'apis/auth';

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        const currentUser = localStorage.getItem('currentUser');
        if (!access_token) return;
        if (!currentUser) return;
        getMe(access_token)
            .then((response) => {
                dispatch(
                    update({
                        user: { ...response.data },
                        access_token: response.data.access_token,
                        refresh_token: response.data.refresh_token,
                    }),
                );
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <>
            <ScrollToTop />
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/template" element={<TemplatePageCv />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/add-cv" element={<AddCV />} />
                    <Route path="/404" element={<NotFound />} />
                    <Route path=":id/view" element={<View></View>}></Route>

                    <Route element={<UserRoute />}>
                        <Route path="/template" element={<TemplatePageCv />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/design-cv" element={<DesignCV />} />
                        <Route path="/edit-cv" element={<EditCVPage />} />
                        <Route path="/add-cv" element={<AddCV />} />
                        <Route path="/account" element={<Account />} />
                    </Route>
                    <Route element={<GuestRoute />}>
                        <Route path="/template" element={<TemplatePageCv />} />
                        <Route path="/new-user" element={<NewUser />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/forgot" element={<ForgotPage />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <SnackBarNotification />
            </div>
        </>
    );
}

export default App;
