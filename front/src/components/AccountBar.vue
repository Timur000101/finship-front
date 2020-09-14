<template>
    <b-row class="justify-content-end align-items-center mt-xl-4 mt-lg-4 mt-md-4 mt-sm-4 mt-5">
<!--        <span>Вы вошли как: {{email}}</span>-->
        <b-link type="button" variant="primary" class="my-2" @click="logout">Выход</b-link>
    </b-row>
</template>

<script>
    export default {
        name: "AccountBar",
        data() {
            return {
                email: null,
            }
        },
        created() {
            this.email = this.$store.getters['auth/email'];
        },
        methods: {
            logout() {
                this.$router.push("/logout/")
            },
        }
    }
</script>