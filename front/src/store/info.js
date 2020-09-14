import http from '../api/http';
import {
    GET_BIK_SUCCESS,
    GET_BIK_FAILURE,
} from './types';


const initialState = {
    error: false,
};
const getters = {};
const actions = {
    get_bik({commit}, {bic}) {
        return http.get(`/api-async/get-bik/${bic}/`)
            .then((data) => {
                commit(GET_BIK_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(GET_BIK_FAILURE);
                return data;
            });
    },
};

const mutations = {
    [GET_BIK_SUCCESS](state) {
        state.error = false;
    },
    [GET_BIK_FAILURE](state) {
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
