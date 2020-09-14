import APIConstructorOther from "../api/api-other"
import APIConstructor from "../api/api";
import {
    INITIALIZE_CARD,
    POST_CARD_SUCCESS,
    POST_CARD_FAILURE,
    LIST_CARD_SUCCESS,
    LIST_CARD_FAILURE,
    GET_CARD_SUCCESS,
    GET_CARD_FAILURE,
    PUT_CARD_SUCCESS,
    PUT_CARD_FAILURE,
    DELETE_CARD_SUCCESS,
    DELETE_CARD_FAILURE,
} from './types';


const initialState = {
    error: false,
};
const getters = {};
const card_post = new APIConstructorOther('payments/innovate/tokenization');
const card = new APIConstructor('cards');
const actions = {
    delete({commit}, {id}) {
        return card.delete(id)
            .then((data) => {
                commit(DELETE_CARD_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(DELETE_CARD_FAILURE);
                return data;
            });
    },
    put({commit}, {data}) {
        return card.put(data)
            .then((data) => {
                commit(PUT_CARD_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(PUT_CARD_FAILURE);
                return data;
            });
    },
    get({commit}, {id}) {
        return card.get(id)
            .then((data) => {
                commit(GET_CARD_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(GET_CARD_FAILURE);
                return data;
            });
    },
    list({commit},{id}) {
        return card.list_id(id)
            .then((data) => {
                commit(LIST_CARD_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(LIST_CARD_FAILURE);
                return data;
            });
    },
    post({commit}, {data}) {
        return card_post.post(data)
            .then((data) => {
                commit(POST_CARD_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(POST_CARD_FAILURE);
                return data;
            });
    },
    initialize({commit}) {
        commit(INITIALIZE_CARD);
    },
};

const mutations = {
    [INITIALIZE_CARD](state) {
        state.error = false;
    },
    [POST_CARD_SUCCESS](state) {
        state.error = false;
    },
    [POST_CARD_FAILURE](state) {
        state.error = true;
    },
    [LIST_CARD_SUCCESS](state) {
        state.error = false;
    },
    [LIST_CARD_FAILURE](state) {
        state.error = true;
    },
    [GET_CARD_SUCCESS](state) {
        state.error = false;
    },
    [GET_CARD_FAILURE](state) {
        state.error = true;
    },
    [PUT_CARD_SUCCESS](state) {
        state.error = false;
    },
    [PUT_CARD_FAILURE](state) {
        state.error = true;
    },
    [DELETE_CARD_SUCCESS](state) {
        state.error = false;
    },
    [DELETE_CARD_FAILURE](state) {
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
