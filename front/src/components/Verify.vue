<template>
    <b-row class="justify-content-center vh-100 px-3 back">
        <b-col cols="12" sm="12" md="11" lg="7" xl="7" class="my-auto py-5 px-5 bg-white b-card-radius">
            <template v-if="!checkFlag">
                <b-row class="justify-content-center text-center">
                    <h4>Выполняется активация аккаунта!</h4>
                </b-row>
                <b-row class="justify-content-center">
                    <b-spinner variant="success"></b-spinner>
                </b-row>
            </template>
            <template>
                <b-row class="justify-content-center text-center pt-4 mb-2">
                    <h4>
                        <template v-if="server_error_message">
                            Ошибка: {{server_error_message}}
                        </template>
                        <template v-else>
                            Вы успешно подтвердили почтовый ящик, указанный в качестве логина.
                            Теперь вы можете начать пользоваться сервисом
                        </template>

                    </h4>
                </b-row>
                <b-row class="justify-content-center text-center pb-4">
                    <h4>
                        <b-link href="/login/" class="small-text">Вход</b-link>
                    </h4>
                </b-row>
            </template>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        name: "Verify",
        data() {
            return {
                checkFlag: false,
                server_error_code: null,
                server_error_message: null,
            }
        },
        created() {
            if (this.$route.query.user_id && this.$route.query.timestamp && this.$route.query.signature) {
                let data = {
                    user_id: this.$route.query.user_id,
                    timestamp: this.$route.query.timestamp,
                    signature: this.$route.query.signature,
                };
                let self = this;
                this.$store.dispatch({
                    type: 'auth/verify_registration',
                    data: data,
                }).then(result => {
                        this.checkFlag = true;
                        if (result && result.error) {
                            self.server_error_message = result.error;
                            self.server_error_code = result.error_code
                        }
                    }
                );
            } else {
                this.$router.push("/login");
            }
        },
    }
</script>

<style lang="scss">
    @import "./src/assets/scss/styles.scss";
</style>