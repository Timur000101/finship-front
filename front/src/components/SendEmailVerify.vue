<template>
    <b-row class="justify-content-center vh-100 mx-0 px-3 back">
        <b-col cols="12" sm="11" md="10" lg="8" xl="8" class="my-auto py-5 px-xl-5 px-lg-5 px-md-p px-sm-5
               shadow-none shadow-sm shadow-md shadow-lg shadow-xl bg-white b-card-radius">
            <template v-if="server_error_message">
                Ошибка {{server_error_message}}
            </template>
            <template v-else>
                <template v-if="checkFlag">
                    <b-row class="justify-content-center text-center">Письмо для подтверждения почты отправлено на вашу
                        почту, пройдите
                        по ссылке в письме
                    </b-row>
                </template>
                <template v-else>
                    <b-row class="justify-content-center pt-3 mb-3 text-center">
                        <h4>На почтовый ящик, указанный в качестве логина, было отправлено письмо подтверждения Вашей почты
                            Зайдите, пожалуйста, в ваш почтовый ящик и перейдите по ссылке, указанной в письме</h4>
                    </b-row>
                    <b-row class="justify-content-center text-center mb-3">
                        <b-link href="/api/send-verify-email/" class="small-text" @click.prevent="send()">Отправить авторизационное письмо
                            повторно?
                        </b-link>
                    </b-row>
                </template>
            </template>

            <b-row class="justify-content-center text-center pb-3">
                <h4>
                    <b-link href="/logout/" class="small-text">Вход</b-link>
                </h4>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import session from "../api/session";

    export default {
        name: "SendEmailVerify",
        data() {
            return {
                checkFlag: false,
                server_error_code: null,
                server_error_message: null,
            }
        },
        methods: {
            send() {
                let email = this.$store.getters['auth/email'];
                let self = this;
                if (email) {
                    session.send_email_verify().then(result => {
                        if (result && !result.error) {
                            this.checkFlag = true;
                        } else {
                            self.server_error_message = result.error;
                            self.server_error_code = result.error_code;
                        }
                    })
                }
            },
        }
    }
</script>

<style lang="scss">
    @import "./src/assets/scss/styles.scss";
    @media (max-width: 576px) {
        .back {
            background: none;
        }
    }
</style>