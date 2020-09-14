<template>
    <b-container fluid class="m-0 p-0">
        <router-view/>
    </b-container>
</template>
<script>
    import Vue from 'vue';
    import BootstrapVue from 'bootstrap-vue';

    Vue.use(BootstrapVue);
    export default {
        name: 'App',
        created() {
            localStorage.setItem("hidden", false)
        }
    }
</script>
<style lang="scss">
    * {
        user-select: none;
        -khtml-user-select: none;
        -o-user-select: none;
        -moz-user-select: -moz-none;
        -webkit-user-select: none;
    }

    input, input:before, input:after {
        -webkit-user-select: initial;
        -khtml-user-select: initial;
        -moz-user-select: initial;
        -ms-user-select: initial;
        user-select: initial;
    }

    @import '../node_modules/bootstrap/scss/bootstrap';
    @import '../node_modules/bootstrap-vue/src/index.scss';
</style>
