import Vue from 'vue'
import VueRouter from 'vue-router'
import Profile from '../components/Profile.vue'
import Login from '../components/Login.vue'
import ResetPassword from '../components/ResetPassword.vue'
import Registration from '../components/Registration.vue'
import ChangePassword from "../components/ChangePassword.vue";
import Verify from "../components/Verify.vue";
import store from '../store';
import SendEmailVerify from "../components/SendEmailVerify.vue";
import PhoneCheck from "../components/PhoneCheck";
import Shops from "../components/Shops";
import Laws from "../components/Laws";
import Fiz from "../components/Fiz";
import Permission from "../components/Permission";
import Panel from "../components/Panel";
import Reports from "../components/Reports";
import Services from "../components/Services";
import EMS from "../components/EMS";
import AboutApi from "../components/AboutApi";
import Referal from "../components/Referal";
import Support from "../components/Support";
import Sended from "../components/Sended";
import FaceList from "../components/FaceList";
import Bank from "../components/Bank";
import ShopsList from "../components/ShopsList";
import PostRussia from "../components/PostRussia";
import PermissionList from "../components/PermissionList";
import PostRussiaList from "../components/PostRussiaList";
// import Payments from "../components/Payments";
// import PaymentsContragent from "../components/PaymentsContragent";
// import PaymentsAutoPayment from "../components/PaymentsAutoPayment";
// import PaymentsManualPayment from "../components/PaymentsManualPayment";
import Card from "../components/Card";

function four_level(next) {
    next();
    if (!store.getters['auth/isAuthenticated']) {
        next('/login/');
    } else {
        let status_registration = store.getters['auth/status_registration'];
        switch (status_registration) {
            case 0:
                next('/send-email-verify/');
                break;
            case 1:
                next('/confirmation/');
                break;
        }
    }
}

function four_level_redirect(next) {
    next();
    if (!store.getters['auth/isAuthenticated']) {
        next('/login/');
    } else {
        let status_registration = store.getters['auth/status_registration'];
        switch (status_registration) {
            case 0:
                next('/send-email-verify/');
                break;
            case 1:
                next('/confirmation/');
                break;
            default:
                next('/shops/');
                break;
        }
    }
}

function level_1(next) {
    next();
    if (!store.getters['auth/isAuthenticated']) {
        next('/login/');
    } else {
        let status_registration = store.getters['auth/status_registration'];
        if (status_registration < 1) {
            next('/');
        }
    }
}

function level_4(next) {
    next();
    if (!store.getters['auth/isAuthenticated']) {
        next('/login/');
    } else {
        let status_registration = store.getters['auth/status_registration'];
        if (status_registration < 4) {
            next('/');
        }
    }
}

function level_5(next) {
    next();
    if (!store.getters['auth/isAuthenticated']) {
        next('/login/');
    } else {
        let status_registration = store.getters['auth/status_registration'];
        if (status_registration < 5) {
            next('/');
        }
    }
}

function authenticated(next) {
    next();
    if (!store.getters['auth/isAuthenticated']) {
        next('/login/');
    }
}

function unauthenticated(next) {
    next();
    if (store.getters['auth/isAuthenticated']) {
        next('/');
    }
}

function checkInitialize(action, next) {
    if (store.getters['auth/initialize_method']) {
        action(next);
    } else {
        store.dispatch('auth/initialize')
            .then(() => {
                action(next);
            });
    }
}

const require_four_level = (to, from, next) => {
    checkInitialize(four_level, next);
};
const require_four_level_redirect = (to, from, next) => {
    checkInitialize(four_level_redirect, next);
};
const verify_level_1 = (to, from, next) => {
    checkInitialize(level_1, next);
};
const verify_level_4 = (to, from, next) => {
    checkInitialize(level_4, next);
};
const verify_level_5 = (to, from, next) => {
    checkInitialize(level_5, next);
};
const requireAuthenticated = (to, from, next) => {
    checkInitialize(authenticated, next);
};

const requireUnauthenticated = (to, from, next) => {
    checkInitialize(unauthenticated, next);
};

const redirectLogout = (to, from, next) => {
    store.dispatch('auth/logout').then(() => {
        next();
        next('/login/');
    });
};

const redirectLogoutFront = (to, from, next) => {
    store.dispatch('auth/logoutfront').then(() => {
        next();
        next('/login/');
    });
};

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    saveScrollPosition: true,
    routes: [
        {
            path: '/login/',
            component: Login,
            beforeEnter: requireUnauthenticated,
        },
        {
            path: '/register/',
            component: Registration,
            beforeEnter: requireUnauthenticated,
        },
        {
            path: '/logout/',
            beforeEnter: redirectLogout,
        },
        {
            path: '/logoutfront/',
            beforeEnter: redirectLogoutFront,
        },
        {
            path: '/reset-password/',
            component: ResetPassword,
            beforeEnter: requireUnauthenticated,
        },
        {
            path: '/change-password/',
            component: ChangePassword,
            beforeEnter: requireUnauthenticated,
        },
        {
            path: '/verify-registration/',
            component: Verify,
        },
        {
            path: '/send-email-verify/',
            component: SendEmailVerify,
            beforeEnter: requireAuthenticated,
        },
        {
            path: '/confirmation/',
            component: PhoneCheck,
            beforeEnter: verify_level_1,
        },
        {
            path: '/',
            beforeEnter: require_four_level_redirect,
        },
        {
            path: '/shops/',
            component: ShopsList,
            beforeEnter: require_four_level,
        },
        {
            path: '/shops/:id?/',
            component: Shops,
            beforeEnter: require_four_level,
        },
        {
            path: '/profile/',
            component: Profile,
            beforeEnter: require_four_level,
        },
        {
            path: '/laws/',
            component: FaceList,
            beforeEnter: require_four_level,
        },
        {
            path: '/laws/:id?',
            component: Laws,
            beforeEnter: require_four_level,
        },
        {
            path: '/fiz/',
            component: FaceList,
            beforeEnter: require_four_level,
        },
        {
            path: '/fiz/:id?/',
            component: Fiz,
            beforeEnter: require_four_level,
        },
        {
            path: '/bank/:id?/',
            component: Bank,
            beforeEnter: require_four_level,
        },
        {
            path: '/permission/',
            component: PermissionList,
            beforeEnter: require_four_level,
        },
        {
            path: '/permission/:id?/',
            component: Permission,
            beforeEnter: require_four_level,
        },
        {
            path: '/panel/',
            component: Panel,
            beforeEnter: require_four_level,
        },
        {
            path: '/sended/',
            component: Sended,
            beforeEnter: require_four_level,
        },
        // {
        //     path: '/finansepayments/:id?/',
        //     component: Payments,
        //     beforeEnter: require_four_level,
        // },
        // {
        //     path: '/finansepaymentscontragent/:id?/',
        //     component: PaymentsContragent,
        //     beforeEnter: require_four_level,
        // },
        // {
        //     path: '/finanseautopayment/',
        //     component: PaymentsAutoPayment,
        //     beforeEnter: require_four_level,
        // },
        // {
        //     path: '/finansemanualpayment/',
        //     component: PaymentsManualPayment,
        //     beforeEnter: require_four_level,
        // },
        {
            path: '/cards/:id?/',
            component: Card,
            beforeEnter: require_four_level,
        },
        {
            path: '/reports/',
            component: Reports,
            beforeEnter: require_four_level,
        },
        {
            path: '/services/',
            component: Services,
            beforeEnter: require_four_level,
        },
        {
            path: '/ems/',
            component: EMS,
            beforeEnter: require_four_level,
        },
        {
            path: '/aboutapi/',
            component: AboutApi,
            beforeEnter: require_four_level,
        },
        {
            path: '/postrussia/',
            component: PostRussiaList,
            beforeEnter: require_four_level,
        },
        {
            path: '/postrussia/:id?/',
            component: PostRussia,
            beforeEnter: require_four_level,
        },
        {
            path: '/referal/',
            component: Referal,
            beforeEnter: require_four_level,
        },
        {
            path: '/support/',
            component: Support,
            beforeEnter: require_four_level,
        },
    ]
})
