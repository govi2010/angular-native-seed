
import { LoginComponent, LoginWithOtpComponent, LoginWithEmailComponent, LoginTwoWayComponent, ForgotComponent, SignUpComponent } from "./components";
import { LinkedInLoginComponent } from "./components/linkedin-login/linkedin-login.component";

export const LoginRoutes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'login-with-otp',
        component: LoginWithOtpComponent
    },
    {
        path: 'login-with-email',
        component: LoginWithEmailComponent
    },
    {
        path: 'login-two-way',
        component: LoginTwoWayComponent
    },
    {
        path: 'forgot-password',
        component: ForgotComponent
    // }, {
    //     path: 'linkedin-login',
    //     component: LinkedInLoginComponent
    },
    {
        path: 'signup',
        component: SignUpComponent
    }
];
