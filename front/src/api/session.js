import http from './http'

let session = {};

function login(data) {
    return http.post(
        '/api/login/',
        data
    )
}

function logout() {
    return http.post('/api/logout/')
}

function registration(data) {
    return http.post(
        '/api/register/',
        data,
    )
}

function resetpassword(data) {
    return http.post(
        '/api/send-reset-password-link/',
        data
    )
}

function changepassword(data) {
    return http.post(
        '/api/reset-password/',
        data,
    )
}

function profile(data) {
    return http.get(
        '/api/profile/',
        data,
    )
}

function verify_registration(data) {
    return http.post(
        '/api/verify-registration/',
        data,
    )
}

function send_email_verify() {
    return http.get(
        '/api/send-email-verify/',
    )
}

function authenticator_verify(data) {
    return http.post(
        `/api/totp-login/`,
        data
    )
}

function authenticator_create() {
    return http.get(
        '/api/totp-create/',
    )
}

function phone_verify(data) {
    return http.post(
        `/api/phone-verify/`,
        data
    )
}

function phone_check(data) {
    return http.post(
        `/api/phone-check/`,
        data
    )
}

function getSession() {
    if (http.getCookie("sessionid")) {
        return true;
    } else {
        return false;
    }
}

function updatetoken() {
    return http.put(
        `/api-async/update-token/`,
    )
}

function gettoken() {
    return http.get(
        `/api-async/get-token/`,
    )
}

function change_password(data) {
    return http.post(
        `/api/change-password/`,
        data
    )
}

function change_phone(data) {
    return http.post(
        `/api/change-phone/`,
        data
    )
}

function create_confirm(data) {
    return http.post(
        `/api/create-confirm/`,
        data
    )
}

function check_confirm(data) {
    return http.post(
        `/api/check-confirm/`,
        data
    )
}

session.login = login;
session.logout = logout;
session.registration = registration;
session.resetpassword = resetpassword;
session.changepassword = changepassword;
session.change_password = change_password;
session.change_phone = change_phone;
session.create_confirm = create_confirm;
session.check_confirm = check_confirm;
session.profile = profile;
session.verify_registration = verify_registration;
session.send_email_verify = send_email_verify;
session.authenticator_verify = authenticator_verify;
session.authenticator_create = authenticator_create;
session.phone_verify = phone_verify;
session.phone_check = phone_check;
session.getSession = getSession;
session.updatetoken = updatetoken;
session.gettoken = gettoken;
export default session;
