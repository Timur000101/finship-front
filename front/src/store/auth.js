import session from '../api/session';
import {get_item, set_item, del_item,} from './storage';
import {
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    REGISTRATION_FAILURE,
    REGISTRATION_SUCCESS,
    RESETPASSWORD_FAILURE,
    RESETPASSWORD_SUCCESS,
    CHANGEPASSWORD_FAILURE,
    CHANGEPASSWORD_SUCCESS,
    VERIFY_REGISTRATION_SUCCESS,
    VERIFY_REGISTRATION_FAILURE,
    AUTHENTICATOR_CREATE_SUCCESS,
    AUTHENTICATOR_CREATE_FAILURE,
    AUTHENTICATOR_VERIFY_SUCCESS,
    AUTHENTICATOR_VERIFY_FAILURE,
    PHONE_VERIFY_SUCCESS,
    PHONE_VERIFY_FAILURE,
    PHONE_CHECK_SUCCESS,
    PHONE_CHECK_FAILURE,
    UPDATE_TOKEN_SUCCESS,
    UPDATE_TOKEN_FAILURE,
    GET_TOKEN_SUCCESS,
    GET_TOKEN_FAILURE,
    CREATE_CONFIRM_SUCCESS,
    CREATE_CONFIRM_FAILURE,
    CHECK_CONFIRM_SUCCESS,
    CHECK_CONFIRM_FAILURE,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILURE,
    CHANGE_PHONE_SUCCESS,
    CHANGE_PHONE_FAILURE,
    LOGOUT,
    INITIALIZE,
} from './types';

const UID_STORAGE_KEY = 'UID_STORAGE_KEY';
const EMAIL_STORAGE_KEY = 'EMAIL_STORAGE_KEY';
const PHONE_STORAGE_KEY = 'PHONE_STORAGE_KEY';
const FIRST_NAME_STORAGE_KEY = 'FIRST_NAME_STORAGE_KEY';
const LAST_NAME_STORAGE_KEY = 'LAST_NAME_STORAGE_KEY';
const MIDDLE_NAME_STORAGE_KEY = 'MIDDLE_NAME_STORAGE_KEY';
const STATUS_REGISTRATION_STORAGE_KEY = 'STATUS_REGISTRATION_STORAGE_KEY';
const ACCESSTOKEN_STORAGE_KEY = 'ACCESSTOKEN_STORAGE_KEY';
const LOGOUT_METHOD_STORAGE_KEY = 'LOGOUT_METHOD_STORAGE_KEY';
const initialState = {
    is_authenticated: false,
    initialize_method: false,
    logout_method: false,
    error: false,
    accesstoken: null,
    user_id: null,
    email: null,
    phone: null,
    firstName: '',
    lastName: '',
    patronymic: '',
    status_registration: null,
};

const getters = {
    isAuthenticated: state => state.is_authenticated,
    initialize_method: state => state.initialize_method,
    logout_method: state => state.logout_method,
    user_id: state => state.user_id,
    email: state => state.email,
    phone: state => state.phone,
    firstName: state => state.firstName,
    lastName: state => state.lastName,
    patronymic: state => state.patronymic,
    status_registration: state => state.status_registration,
    accesstoken: state => state.accesstoken,
};

const actions = {
    login({commit}, {data}) {
        return session.login(data)
            .then((data) => {
                commit(LOGIN_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(LOGIN_FAILURE);
                return data;
            });
    },

    logout({commit}) {
        return session.logout()
            .then(() => commit(LOGOUT))
            .catch(() => commit(LOGOUT))
    },
    logoutfront({commit}) {
        commit(LOGOUT);
        return null;
    },
    registration({commit}, {data}) {
        return session.registration(data)
            .then((data) => {
                commit(REGISTRATION_SUCCESS);
                return data;
            })
            .catch((data) => {
                commit(REGISTRATION_FAILURE);
                return data;
            });
    },
    resetpassword({commit}, {data}) {
        return session.resetpassword(data)
            .then((data) => {
                commit(RESETPASSWORD_SUCCESS);
                return data;
            })
            .catch((data) => {
                commit(RESETPASSWORD_FAILURE);
                return data;
            });
    },
    changepassword({commit}, {data}) {
        return session.changepassword(data)
            .then(() => {
                commit(CHANGEPASSWORD_SUCCESS);
                return data;
            })
            .catch((data) => {
                commit(CHANGEPASSWORD_FAILURE);
                return data;
            });
    },
    verify_registration({commit}, {data}) {
        return session.verify_registration(data)
            .then((data) => {
                commit(VERIFY_REGISTRATION_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(VERIFY_REGISTRATION_FAILURE);
                return data;
            });
    },
    authenticator_create({commit}) {
        return session.authenticator_create()
            .then((data) => {
                commit(AUTHENTICATOR_CREATE_SUCCESS);
                return data;
            })
            .catch((data) => {
                commit(AUTHENTICATOR_CREATE_FAILURE);
                return data;
            });
    },
    authenticator_verify({commit}, {data}) {
        return session.authenticator_verify(data)
            .then((data) => {
                commit(AUTHENTICATOR_VERIFY_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(AUTHENTICATOR_VERIFY_FAILURE);
                return data;
            });
    },
    phone_verify({commit}, {data}) {
        return session.phone_verify(data)
            .then((data) => {
                commit(PHONE_VERIFY_SUCCESS);
                return data;
            })
            .catch((data) => {
                commit(PHONE_VERIFY_FAILURE);
                return data;
            });
    },
    phone_check({commit}, {data}) {
        return session.phone_check(data)
            .then((data) => {
                commit(PHONE_CHECK_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(PHONE_CHECK_FAILURE);
                return data;
            });
    },
    updatetoken({commit}) {
        return session.updatetoken()
            .then((data) => {
                commit(UPDATE_TOKEN_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(UPDATE_TOKEN_FAILURE);
                return data;
            });
    },
    gettoken({commit}) {
        return session.gettoken()
            .then((data) => {
                commit(GET_TOKEN_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(GET_TOKEN_FAILURE);
                return data;
            });
    },
    create_confirm({commit},{data}) {
        return session.create_confirm(data)
            .then((data) => {
                commit(CREATE_CONFIRM_SUCCESS);
                return data;
            })
            .catch((data) => {
                commit(CREATE_CONFIRM_FAILURE);
                return data;
            });
    },
    check_confirm({commit},{data}) {
        return session.check_confirm(data)
            .then((data) => {
                commit(CHECK_CONFIRM_SUCCESS);
                return data;
            })
            .catch((data) => {
                commit(CHECK_CONFIRM_FAILURE);
                return data;
            });
    },
    change_password({commit},{data}){
        return session.change_password(data)
            .then((data) => {
                commit(CHANGE_PASSWORD_SUCCESS);
                return data;
            })
            .catch((data) => {
                commit(CHANGE_PASSWORD_FAILURE);
                return data;
            });
    },
    change_phone({commit},{data}){
        return session.change_phone(data)
            .then((data) => {
                commit(CHANGE_PHONE_SUCCESS);
                return data;
            })
            .catch((data) => {
                commit(CHANGE_PHONE_FAILURE);
                return data;
            });
    },
    initialize({commit}) {
        commit(INITIALIZE);
    },
};

const mutations = {
    [LOGIN_FAILURE](state) {
        state.error = true;
    },
    [REGISTRATION_FAILURE](state) {
        state.error = true;
    },
    [REGISTRATION_SUCCESS](state) {
        state.error = false;
    },
    [RESETPASSWORD_FAILURE](state) {
        state.error = true;
    },
    [RESETPASSWORD_SUCCESS](state) {
        state.error = false;
    },
    [CHANGEPASSWORD_FAILURE](state) {
        state.error = true;
    },
    [CHANGEPASSWORD_SUCCESS](state) {
        state.error = false;
    },
    [CHANGE_PASSWORD_FAILURE](state) {
        state.error = true;
    },
    [CHANGE_PASSWORD_SUCCESS](state) {
        state.error = false;
    },
    [CHANGE_PHONE_FAILURE](state) {
        state.error = true;
    },
    [CHANGE_PHONE_SUCCESS](state) {
        state.error = false;
    },
    [CHECK_CONFIRM_FAILURE](state) {
        state.error = true;
    },
    [CHECK_CONFIRM_SUCCESS](state) {
        state.error = false;
    },
    [CREATE_CONFIRM_FAILURE](state) {
        state.error = true;
    },
    [CREATE_CONFIRM_SUCCESS](state) {
        state.error = false;
    },
    [VERIFY_REGISTRATION_FAILURE](state) {
        state.error = true;
    },
    [VERIFY_REGISTRATION_SUCCESS](state, data) {
        state.error = false;
        if (state.is_authenticated) {
            if (data && data.status_registration != null) {
                set_item(STATUS_REGISTRATION_STORAGE_KEY, data.status_registration);
                state.status_registration = data.status_registration;
            }
        } else {
            set_item(LOGOUT_METHOD_STORAGE_KEY, true);
            state.logout_method = true;
        }
    },
    [AUTHENTICATOR_CREATE_FAILURE](state) {
        state.error = true;
    },
    [AUTHENTICATOR_CREATE_SUCCESS](state) {
        state.error = false;
    },
    [AUTHENTICATOR_VERIFY_FAILURE](state) {
        state.error = true;
    },
    [AUTHENTICATOR_VERIFY_SUCCESS](state, data) {
        state.error = false;
        if (data && data.status_registration) {
            set_item(STATUS_REGISTRATION_STORAGE_KEY, data.status_registration);
            state.status_registration = data.status_registration;
        }
    },
    [PHONE_VERIFY_FAILURE](state) {
        state.error = true;
    },
    [PHONE_VERIFY_SUCCESS](state) {
        state.error = false;
    },
    [GET_TOKEN_FAILURE](state) {
        state.error = true;
    },
    [GET_TOKEN_SUCCESS](state, data) {
        if (data && data.accesstoken) {
            set_item(ACCESSTOKEN_STORAGE_KEY, data.accesstoken);
            state.accesstoken = data.accesstoken;
        }
        state.error = false;
    },
    [UPDATE_TOKEN_FAILURE](state) {
        state.error = true;
    },
    [UPDATE_TOKEN_SUCCESS](state, data) {
        if (data && data.accesstoken) {
            set_item(ACCESSTOKEN_STORAGE_KEY, data.accesstoken);
            state.accesstoken = data.accesstoken;
        }
        state.error = false;
    },
    [PHONE_CHECK_FAILURE](state) {
        state.error = true;
    },
    [PHONE_CHECK_SUCCESS](state, data) {
        state.error = false;
        if (data && data.status_registration) {
            set_item(STATUS_REGISTRATION_STORAGE_KEY, data.status_registration);
            state.status_registration = data.status_registration;
        }
    },
    [LOGIN_SUCCESS](state, data) {
        if (session.getSession()) {
            state.is_authenticated = true;
        }
        state.logout_method = false;
        set_item(LOGOUT_METHOD_STORAGE_KEY, false);
        if (data) {
            if (data.user_id != null) {
                set_item(UID_STORAGE_KEY, data.user_id);
                state.user_id = data.user_id;
            }
            if (data.email != null) {
                set_item(EMAIL_STORAGE_KEY, data.email);
                state.email = data.email;
            }
            if (data.phone != null) {
                set_item(PHONE_STORAGE_KEY, data.phone);
                state.phone = data.phone;
            }
            if (data.firstName != null) {
                set_item(FIRST_NAME_STORAGE_KEY, data.firstName);
                state.firstName = data.firstName;
            }
            if (data.lastName != null) {
                set_item(LAST_NAME_STORAGE_KEY, data.lastName);
                state.lastName = data.lastName;
            }
            if (data.patronymic != null) {
                set_item(MIDDLE_NAME_STORAGE_KEY, data.patronymic);
                state.patronymic = data.patronymic;
            }
            if (data.status_registration != null) {
                set_item(STATUS_REGISTRATION_STORAGE_KEY, data.status_registration);
                state.status_registration = data.status_registration;
            }
        }

    },
    [INITIALIZE](state) {
        if (!state.initialize_method) {
            state.logout_method = get_item(LOGOUT_METHOD_STORAGE_KEY);
            if (!state.logout_method && session.getSession()) {
                state.is_authenticated = true;
            }
            console.log("auth", state.is_authenticated);
            const data = {
                user_id: get_item(UID_STORAGE_KEY),
                email: get_item(EMAIL_STORAGE_KEY),
                phone: get_item(PHONE_STORAGE_KEY),
                firstName: get_item(FIRST_NAME_STORAGE_KEY),
                lastName: get_item(LAST_NAME_STORAGE_KEY),
                patronymic: get_item(MIDDLE_NAME_STORAGE_KEY),
                status_registration: get_item(STATUS_REGISTRATION_STORAGE_KEY),
                accesstoken: get_item(ACCESSTOKEN_STORAGE_KEY),
            };
            state.initialize_method = true;
            if (data.user_id != null) {
                state.user_id = data.user_id;
            }
            if (data.email != null) {
                state.email = data.email;
            }
            if (data.phone != null) {
                state.phone = data.phone;
            }
            if (data.firstName != null) {
                state.firstName = data.firstName;
            }
            if (data.lastName != null) {
                state.lastName = data.lastName;
            }
            if (data.patronymic != null) {
                state.patronymic = data.patronymic;
            }
            if (data.status_registration != null) {
                state.status_registration = data.status_registration;
            }
        }
    },
    [LOGOUT](state) {
        del_item(UID_STORAGE_KEY);
        del_item(EMAIL_STORAGE_KEY);
        del_item(PHONE_STORAGE_KEY);
        del_item(FIRST_NAME_STORAGE_KEY);
        del_item(LAST_NAME_STORAGE_KEY);
        del_item(MIDDLE_NAME_STORAGE_KEY);
        del_item(STATUS_REGISTRATION_STORAGE_KEY);
        set_item(LOGOUT_METHOD_STORAGE_KEY, true);
        state.logout_method = true;
        state.is_authenticated = false;
        state.initialize_method = false;
        state.error = false;
        state.user_id = null;
        state.email = null;
        state.phone = null;
        state.firstName = '';
        state.lastName = '';
        state.patronymic = '';
        state.status_registration = null;
    }
};

export default {
    namespaced: true,
    state: initialState,
    getters,
    actions,
    mutations,
};
