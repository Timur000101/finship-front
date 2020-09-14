import APIConstructor from "../api/api"
import {
    INITIALIZE_FIZ,
    POST_FIZ_SUCCESS,
    POST_FIZ_FAILURE,
    LIST_FIZ_SUCCESS,
    LIST_FIZ_FAILURE,
    GET_FIZ_SUCCESS,
    GET_FIZ_FAILURE,
    PUT_FIZ_SUCCESS,
    PUT_FIZ_FAILURE,
    DELETE_FIZ_SUCCESS,
    DELETE_FIZ_FAILURE,
} from './types';


const initialState = {
    error: false,
};
const getters = {};
const fiz = new APIConstructor('fiz-form');
const actions = {
    delete({commit}, {id}) {
        return fiz.delete(id)
            .then((data) => {
                commit(DELETE_FIZ_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(DELETE_FIZ_FAILURE);
                return data;
            });
    },
    put({commit}, {data}) {
        return fiz.put(data,true)
            .then((data) => {
                commit(PUT_FIZ_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(PUT_FIZ_FAILURE);
                return data;
            });
    },
    get({commit}, {id}) {
        return fiz.get(id)
            .then((data) => {
                commit(GET_FIZ_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(GET_FIZ_FAILURE);
                return data;
            });
    },
    list({commit}) {
        return fiz.list()
            .then((data) => {
                commit(LIST_FIZ_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(LIST_FIZ_FAILURE);
                return data;
            });
    },
    post({commit}, {data}) {
        return fiz.post(data,true)
            .then((data) => {
                commit(POST_FIZ_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(POST_FIZ_FAILURE);
                return data;
            });
    },
    initialize({commit}) {
        commit(INITIALIZE_FIZ);
    },
};

const mutations = {
    [INITIALIZE_FIZ](state) {
        state.error = false;
    },
    [POST_FIZ_SUCCESS](state) {
        state.error = false;
    },
    [POST_FIZ_FAILURE](state) {
        state.error = true;
    },
    [LIST_FIZ_SUCCESS](state) {
        state.error = false;
    },
    [LIST_FIZ_FAILURE](state) {
        state.error = true;
    },
    [GET_FIZ_SUCCESS](state) {
        state.error = false;
    },
    [GET_FIZ_FAILURE](state) {
        state.error = true;
    },
    [PUT_FIZ_SUCCESS](state) {
        state.error = false;
    },
    [PUT_FIZ_FAILURE](state) {
        state.error = true;
    },
    [DELETE_FIZ_SUCCESS](state) {
        state.error = false;
    },
    [DELETE_FIZ_FAILURE](state) {
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
