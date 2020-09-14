import APIConstructor from "../api/api"
import {
    INITIALIZE_LAWS,
    POST_LAWS_SUCCESS,
    POST_LAWS_FAILURE,
    LIST_LAWS_SUCCESS,
    LIST_LAWS_FAILURE,
    GET_LAWS_SUCCESS,
    GET_LAWS_FAILURE,
    PUT_LAWS_SUCCESS,
    PUT_LAWS_FAILURE,
    DELETE_LAWS_SUCCESS,
    DELETE_LAWS_FAILURE,
} from './types';


const initialState = {
    error: false,
};
const getters = {};
const laws = new APIConstructor('laws-form');
const actions = {
    delete({commit}, {id}) {
        return laws.delete(id)
            .then((data) => {
                commit(DELETE_LAWS_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(DELETE_LAWS_FAILURE);
                return data;
            });
    },
    put({commit}, {data}) {
        return laws.put(data,true)
            .then((data) => {
                commit(PUT_LAWS_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(PUT_LAWS_FAILURE);
                return data;
            });
    },
    get({commit}, {id}) {
        return laws.get(id)
            .then((data) => {
                commit(GET_LAWS_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(GET_LAWS_FAILURE);
                return data;
            });
    },
    list({commit}) {
        return laws.list()
            .then((data) => {
                commit(LIST_LAWS_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(LIST_LAWS_FAILURE);
                return data;
            });
    },
    post({commit}, {data}) {
        return laws.post(data,true)
            .then((data) => {
                commit(POST_LAWS_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(POST_LAWS_FAILURE);
                return data;
            });
    },
    initialize({commit}) {
        commit(INITIALIZE_LAWS);
    },
};

const mutations = {
    [INITIALIZE_LAWS](state) {
        state.error = false;
    },
    [POST_LAWS_SUCCESS](state) {
        state.error = false;
    },
    [POST_LAWS_FAILURE](state) {
        state.error = true;
    },
    [LIST_LAWS_SUCCESS](state) {
        state.error = false;
    },
    [LIST_LAWS_FAILURE](state) {
        state.error = true;
    },
    [GET_LAWS_SUCCESS](state) {
        state.error = false;
    },
    [GET_LAWS_FAILURE](state) {
        state.error = true;
    },
    [PUT_LAWS_SUCCESS](state) {
        state.error = false;
    },
    [PUT_LAWS_FAILURE](state) {
        state.error = true;
    },
    [DELETE_LAWS_SUCCESS](state) {
        state.error = false;
    },
    [DELETE_LAWS_FAILURE](state) {
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
