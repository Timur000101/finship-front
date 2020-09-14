import router from "../router"

const json_type = 'application/json; charset=UTF-8';
let http = {};

function build_query_params(params) {
    return '?' + Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined
}

async function check_cookies(url, multipart) {
    let header;
    if (multipart) {
        header = {}
    } else {
        header = {"Content-Type": json_type};
    }
    let csrf_token = getCookie('csrftoken');
    if (csrf_token) {
        header["X-CSRFToken"] = csrf_token;
        return header;
    } else {
        if (url.startsWith('/api/')) {
            let result = await http.get('/api/get-info/');
            csrf_token = getCookie('csrftoken');
            if (csrf_token) {
                header["X-CSRFToken"] = csrf_token;
                return header;
            } else {
                return null;
            }
        } else {
            return header;
        }
    }
}

async function create_response_data_object(response) {
    if (response.status == 200 || response.status == 201 || response.status == 204) {
        if (response.status == 204) {
            return {"status": "ok"}
        }
        let response_data = await response.json();
        if (typeof response_data == "object") {
            response_data["status"] = response.status;
        } else {
            response_data = {"status": response.status, "data": response_data}
        }
        return response_data
    } else {
        if (response.status == 403 || response.status == 401) {
            let api_path = window.location.protocol + "//" + window.location.hostname + "/api/logout/";
            console.log("Status: ",api_path,response);
            if (response.url != api_path) {
                await router.push('/logout/');
            } else {
                await router.push('/logoutfront/');
            }
            return null;
        } else {
            if (response.status == 400) {
                let response_data = await response.json();
                if (typeof response_data == "object") {
                    if (!response_data["error"]) {
                        response_data = {"status": response.status, "error": response_data}
                        if (!response_data["error_code"]) {
                            response_data["error_code"] = 1;
                        }
                    } else {
                        response_data["status"] = response.status;
                    }
                } else {
                    response_data = {"status": response.status, "error": response_data}
                }
                throw response_data
            } else {
                throw {"error": "Ошибка сервера", "error_code": 1}
            }
        }
    }
}

async function post_method(url, data, multipart) {
    let header = await check_cookies(url, multipart);
    let config = {
        method: 'POST',
        headers: header,
    };
    if (data) {
        if (multipart) {
            config.body = data;
        } else {
            config.body = JSON.stringify(data);
        }
    }
    const response = await fetch(url, config);
    let response_data = await create_response_data_object(response);
    return response_data
}

async function get_resource(url) {
    const response = await fetch(url, {
        method: 'GET',
    });
    return await response.text();
}

async function get_method(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {"Content-Type": json_type}
    });
    let response_data = await create_response_data_object(response);
    return response_data
}

async function put_method(url, data, multipart) {
    let header = await check_cookies(url, multipart);
    let config = {
        method: 'PUT',
        headers: header,
    };
    if (data) {
        if (multipart) {
            config.body = data;
        } else {
            config.body = JSON.stringify(data);
        }
    }
    const response = await fetch(url, config);
    let response_data = await create_response_data_object(response);
    return response_data
}

async function delete_method(url) {
    let header = await check_cookies(url);
    let config = {
        method: 'DELETE',
        headers: header,
    };
    const response = await fetch(url, config);
    let response_data = await create_response_data_object(response);
    return response_data
}

http.post = post_method;
http.get = get_method;
http.put = put_method;
http.delete = delete_method;
http.build_query_params = build_query_params;
http.get_resource = get_resource;
http.getCookie = getCookie;
export default http;