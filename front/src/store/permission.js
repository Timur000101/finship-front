import APIConstructor from "../api/api"
import {
    INITIALIZE_PERMISSION,
    POST_PERMISSION_SUCCESS,
    POST_PERMISSION_FAILURE,
    LIST_PERMISSION_SUCCESS,
    LIST_PERMISSION_FAILURE,
    GET_PERMISSION_SUCCESS,
    GET_PERMISSION_FAILURE,
    PUT_PERMISSION_SUCCESS,
    PUT_PERMISSION_FAILURE,
    DELETE_PERMISSION_SUCCESS,
    DELETE_PERMISSION_FAILURE,
} from './types';


const initialState = {
    error: false,
};
const getters = {};
const permission = new APIConstructor('permission', true);
const actions = {
    delete({commit}, {id}) {
        return permission.delete(id)
            .then((data) => {
                commit(DELETE_PERMISSION_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(DELETE_PERMISSION_FAILURE);
                return data;
            });
    },
    put({commit}, {data, id}) {
        return permission.put_id(data, id)
            .then((data) => {
                commit(PUT_PERMISSION_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(PUT_PERMISSION_FAILURE);
                return data;
            });
    },
    get({commit}, {id}) {
        return permission.get(id)
            .then((data) => {
                commit(GET_PERMISSION_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(GET_PERMISSION_FAILURE);
                return data;
            });
    },
    list({commit}) {
        return permission.list()
            .then((data) => {
                commit(LIST_PERMISSION_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(LIST_PERMISSION_FAILURE);
                return data;
            });
    },
    post({commit}, {data}) {
        return permission.post(data)
            .then((data) => {
                commit(POST_PERMISSION_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(POST_PERMISSION_FAILURE);
                return data;
            });
    },
    initialize({commit}) {
        commit(INITIALIZE_PERMISSION);
    },
};

const mutations = {
    [INITIALIZE_PERMISSION](state) {
        state.error = false;
    },
    [POST_PERMISSION_SUCCESS](state) {
        state.error = false;
    },
    [POST_PERMISSION_FAILURE](state) {
        state.error = true;
    },
    [LIST_PERMISSION_SUCCESS](state) {
        state.error = false;
    },
    [LIST_PERMISSION_FAILURE](state) {
        state.error = true;
    },
    [GET_PERMISSION_SUCCESS](state) {
        state.error = false;
    },
    [GET_PERMISSION_FAILURE](state) {
        state.error = true;
    },
    [PUT_PERMISSION_SUCCESS](state) {
        state.error = false;
    },
    [PUT_PERMISSION_FAILURE](state) {
        state.error = true;
    },
    [DELETE_PERMISSION_SUCCESS](state) {
        state.error = false;
    },
    [DELETE_PERMISSION_FAILURE](state) {
        state.error = true;
    },
};

export default {
    namespaced: true,
    state: initialState,
    getters,
    actions,
    mutations,
};
