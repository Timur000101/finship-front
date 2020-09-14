import http from './http';

class APIConstructor {
    constructor(model, sync) {
        this.model = model;
        if (sync) {
            this.suffix = 'api';
        } else {
            this.suffix = 'api-async';
        }
    }

    post(data, multipart) {
        return http.post(
            `/${this.model}/`,
            data,
            multipart
        )
    }

    list() {
        return http.get(
            `/${this.model}/`
        )
    }

    get(id) {
        return http.get(
            `/${this.model}/${id}/`
        )
    }

    put(data, multipart) {
        return http.put(
            `/${this.model}/`,
            data,
            multipart
        )
    }

    put_id(data, id, multipart) {
        return http.put(
            `/${this.model}/${id}/`,
            data,
            multipart
        )
    }

    delete(id) {
        return http.delete(
            `/${this.model}/${id}/`
        )
    }
}

export default APIConstructor;