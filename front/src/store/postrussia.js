import APIConstructor from "../api/api"
import {
    INITIALIZE_POSTRUSSIA,
    POST_POSTRUSSIA_SUCCESS,
    POST_POSTRUSSIA_FAILURE,
    LIST_POSTRUSSIA_SUCCESS,
    LIST_POSTRUSSIA_FAILURE,
    GET_POSTRUSSIA_SUCCESS,
    GET_POSTRUSSIA_FAILURE,
    PUT_POSTRUSSIA_SUCCESS,
    PUT_POSTRUSSIA_FAILURE,
    DELETE_POSTRUSSIA_SUCCESS,
    DELETE_POSTRUSSIA_FAILURE,
} from './types';


const initialState = {
    error: false,
};
const getters = {};
const postrussia = new APIConstructor('postrussia');
const actions = {
    delete({commit}, {id}) {
        return postrussia.delete(id)
            .then((data) => {
                commit(DELETE_POSTRUSSIA_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(DELETE_POSTRUSSIA_FAILURE);
                return data;
            });
    },
    put({commit}, {data, id}) {
        return postrussia.put_id(data, id)
            .then((data) => {
                commit(PUT_POSTRUSSIA_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(PUT_POSTRUSSIA_FAILURE);
                return data;
            });
    },
    get({commit}, {id}) {
        return postrussia.get(id)
            .then((data) => {
                commit(GET_POSTRUSSIA_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(GET_POSTRUSSIA_FAILURE);
                return data;
            });
    },
    list({commit}) {
        return postrussia.list()
            .then((data) => {
                commit(LIST_POSTRUSSIA_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(LIST_POSTRUSSIA_FAILURE);
                return data;
            });
    },
    post({commit}, {data}) {
        return postrussia.post(data)
            .then((data) => {
                commit(POST_POSTRUSSIA_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(POST_POSTRUSSIA_FAILURE);
                return data;
            });
    },
    initialize({commit}) {
        commit(INITIALIZE_POSTRUSSIA);
    },
};

const mutations = {
    [INITIALIZE_POSTRUSSIA](state) {
        state.error = false;
    },
    [POST_POSTRUSSIA_SUCCESS](state) {
        state.error = false;
    },
    [POST_POSTRUSSIA_FAILURE](state) {
        state.error = true;
    },
    [LIST_POSTRUSSIA_SUCCESS](state) {
        state.error = false;
    },
    [LIST_POSTRUSSIA_FAILURE](state) {
        state.error = true;
    },
    [GET_POSTRUSSIA_SUCCESS](state) {
        state.error = false;
    },
    [GET_POSTRUSSIA_FAILURE](state) {
        state.error = true;
    },
    [PUT_POSTRUSSIA_SUCCESS](state) {
        state.error = false;
    },
    [PUT_POSTRUSSIA_FAILURE](state) {
        state.error = true;
    },
    [DELETE_POSTRUSSIA_SUCCESS](state) {
        state.error = false;
    },
    [DELETE_POSTRUSSIA_FAILURE](state) {
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
