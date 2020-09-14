import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth';
import fiz from './fiz';
import laws from './laws';
import bank from './bank';
import shops from './shops';
import permission from "./permission";
import postrussia from "./postrussia";
import info from "./info";
import files from "./files";
import card from "./card";
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        auth,
        fiz,
        laws,
        bank,
        shops,
        permission,
        postrussia,
        info,
        files,
        card
    }
})
