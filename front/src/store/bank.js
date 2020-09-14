import APIConstructor from "../api/api"
import {
    INITIALIZE_BANK,
    POST_BANK_SUCCESS,
    POST_BANK_FAILURE,
    LIST_BANK_SUCCESS,
    LIST_BANK_FAILURE,
    GET_BANK_SUCCESS,
    GET_BANK_FAILURE,
    PUT_BANK_SUCCESS,
    PUT_BANK_FAILURE,
    DELETE_BANK_SUCCESS,
    DELETE_BANK_FAILURE,
} from './types';


const initialState = {
    error: false,
};
const getters = {};
const bank = new APIConstructor('bank');
const actions = {
    delete({commit}, {id}) {
        return bank.delete(id)
            .then((data) => {
                commit(DELETE_BANK_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(DELETE_BANK_FAILURE);
                return data;
            });
    },
    put({commit}, {data}) {
        return bank.put(data)
            .then((data) => {
                commit(PUT_BANK_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(PUT_BANK_FAILURE);
                return data;
            });
    },
    get({commit}, {id}) {
        return bank.get(id)
            .then((data) => {
                commit(GET_BANK_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(GET_BANK_FAILURE);
                return data;
            });
    },
    list({commit}, {id}) {
        return bank.list_id(id)
            .then((data) => {
                commit(LIST_BANK_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(LIST_BANK_FAILURE);
                return data;
            });
    },
    post({commit}, {data}) {
        return bank.post(data)
            .then((data) => {
                commit(POST_BANK_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(POST_BANK_FAILURE);
                return data;
            });
    },
    initialize({commit}) {
        commit(INITIALIZE_BANK);
    },
};

const mutations = {
    [INITIALIZE_BANK](state) {
        state.error = false;
    },
    [POST_BANK_SUCCESS](state) {
        state.error = false;
    },
    [POST_BANK_FAILURE](state) {
        state.error = true;
    },
    [LIST_BANK_SUCCESS](state) {
        state.error = false;
    },
    [LIST_BANK_FAILURE](state) {
        state.error = true;
    },
    [GET_BANK_SUCCESS](state) {
        state.error = false;
    },
    [GET_BANK_FAILURE](state) {
        state.error = true;
    },
    [PUT_BANK_SUCCESS](state) {
        state.error = false;
    },
    [PUT_BANK_FAILURE](state) {
        state.error = true;
    },
    [DELETE_BANK_SUCCESS](state) {
        state.error = false;
    },
    [DELETE_BANK_FAILURE](state) {
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
