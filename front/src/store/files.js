import http from '../api/http';
import {
    GET_LAWS_FILES_SUCCESS,
    GET_LAWS_FILES_FAILURE,
    GET_FIZ_FILES_SUCCESS,
    GET_FIZ_FILES_FAILURE,
} from './types';


const initialState = {
    error: false,
};
const getters = {};
const actions = {
    get_laws_files({commit}, {id}) {
        return http.get(`/api-async/laws-form/files/${id}/`)
            .then((data) => {
                commit(GET_LAWS_FILES_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(GET_LAWS_FILES_FAILURE);
                return data;
            });
    },
    get_fiz_files({commit}, {id}) {
        return http.get(`/api-async/fiz-form/files/${id}/`)
            .then((data) => {
                commit(GET_FIZ_FILES_SUCCESS, data);
                return data;
            })
            .catch((data) => {
                commit(GET_FIZ_FILES_FAILURE);
                return data;
            });
    },
};

const mutations = {
    [GET_FIZ_FILES_SUCCESS](state) {
        state.error = false;
    },
    [GET_FIZ_FILES_FAILURE](state) {
        state.error = true;
    },
    [GET_LAWS_FILES_SUCCESS](state) {
        state.error = false;
    },
    [GET_LAWS_FILES_FAILURE](state) {
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
