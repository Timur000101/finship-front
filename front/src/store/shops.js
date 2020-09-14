import APIConstructor from "../api/api"
import {
    INITIALIZE_SHOPS,
    POST_SHOPS_SUCCESS,
    POST_SHOPS_FAILURE,
    LIST_SHOPS_SUCCESS,
    LIST_SHOPS_FAILURE,
    GET_SHOPS_SUCCESS,
    GET_SHOPS_FAILURE,
    PUT_SHOPS_SUCCESS,
    PUT_SHOPS_FAILURE,
    DELETE_SHOPS_SUCCESS,
    DELETE_SHOPS_FAILURE,
} from './types';


const initialState = {
    error: false,
};
const getters = {};
const shops = new APIConstructor('shops', true);
const actions = {
    delete({commit}, {id}) {
        return shops.delete(id)
            .then((data) => {
                commit(DELETE_SHOPS_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(DELETE_SHOPS_FAILURE);
                return data;
            });
    },
    put({commit}, {data, id}) {
        return shops.put_id(data, id)
            .then((data) => {
                commit(PUT_SHOPS_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(PUT_SHOPS_FAILURE);
                return data;
            });
    },
    get({commit}, {id}) {
        return shops.get(id)
            .then((data) => {
                commit(GET_SHOPS_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(GET_SHOPS_FAILURE);
                return data;
            });
    },
    list({commit}) {
        return shops.list()
            .then((data) => {
                commit(LIST_SHOPS_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(LIST_SHOPS_FAILURE);
                return data;
            });
    },
    post({commit}, {data}) {
        return shops.post(data)
            .then((data) => {
                commit(POST_SHOPS_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(POST_SHOPS_FAILURE);
                return data;
            });
    },
    initialize({commit}) {
        commit(INITIALIZE_SHOPS);
    },
};

const mutations = {
    [INITIALIZE_SHOPS](state) {
        state.error = false;
    },
    [POST_SHOPS_SUCCESS](state) {
        state.error = false;
    },
    [POST_SHOPS_FAILURE](state) {
        state.error = true;
    },
    [LIST_SHOPS_SUCCESS](state) {
        state.error = false;
    },
    [LIST_SHOPS_FAILURE](state) {
        state.error = true;
    },
    [GET_SHOPS_SUCCESS](state) {
        state.error = false;
    },
    [GET_SHOPS_FAILURE](state) {
        state.error = true;
    },
    [PUT_SHOPS_SUCCESS](state) {
        state.error = false;
    },
    [PUT_SHOPS_FAILURE](state) {
        state.error = true;
    },
    [DELETE_SHOPS_SUCCESS](state) {
        state.error = false;
    },
    [DELETE_SHOPS_FAILURE](state) {
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
