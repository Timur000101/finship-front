<template>
    <b-row class="justify-content-center overflow-auto h-auto p-3 back" style="min-height: 100vh;">
        <b-col cols="12" md="10" lg="6" xl="5"
               class="my-auto px-xl-5 px-lg-5 px-md-5 px-sm-5 py-5 bg-white b-card-radius">
            <template v-if="showVerifyInfo">
                <b-row class="flex-column align-items-center justify-content-center text-center mb-3">
                    <b-row class="mb-3">
                        <h3>Проверьте ваш email</h3>
                    </b-row>
                    <b-row class="col-xl-8 col-lg-9 col-md-9 col-sm-10">
                        <p class="text-style">Мы направили письмо со ссылкой для сброса пароля на вашу почту.
                            Перейтидте по ссылке, чтобы подтвердить сброс пароля. Сссылка для
                            подтверждения действительна для одноразового использования и
                            истекает после использования
                        </p>
                    </b-row>
                </b-row>
                <b-row class="flex-column align-items-center justify-content-center text-center">
                    <b-row class="col-xl-6 col-lg-7 col-md-7 col-sm-8 mb-2">
                        <p class="text-style font-weight-bold">Мы отправим инструкцию
                            по сбросу пароля на ваш email
                        </p>
                    </b-row>
                    <b-row>
                        <b-link href="/login/">Войти</b-link>
                    </b-row>
                </b-row>
            </template>
            <template v-else>
                <b-row class="justify-content-center text-center mt-4">
                    <h3 class="font-weight-normal">Сброс вашего пароля</h3>
                </b-row>
                <b-row class="justify-content-center">
                    <b-row class="px-3 my-3">
                        <p class="text-center" style="font-size: 20px; font-weight: 500;">Если вы не помните ваш пароль, сбросьте его,
                            следуя нашим инструкциям</p>
                    </b-row>
                    <b-form @submit.stop.prevent="onSubmit" class="col-12 col-xl-9 col-lg-10 col-md-10 col-sm-10 mb-5">
                        <b-row class="pb-3 form-group">
                            <b-form-input
                                    id="input-1"
                                    type="text"
                                    required
                                    readonly
                                    onfocus="this.removeAttribute('readonly')"
                                    v-model="$v.form.email.$model"
                                    :state="validateState('email')"
                                    @input="clearInput"
                                    aria-describedby="input-1-live-feedback"
                                    class="border-bottom-3 border-left-0 border-top-0 border-right-0 b-input"
                                    style="padding-left: 13px;"
                            ></b-form-input>
                            <label for="input-1" class="b-input-label">E-mail или номер телефона:</label>
                            <b-form-invalid-feedback class="mt-0" id="input-1-live-feedback">
                                <template v-if="!$v.form.email.required">
                                    Почта обязательна
                                </template>
                                <template v-else-if="!$v.form.email.email">
                                    Введите правильный email
                                </template>
                                <template v-else-if="server_error_message">
                                    {{server_error_message}}
                                </template>
                            </b-form-invalid-feedback>
                        </b-row>
                        <b-row class="px-xl-5 px-lg-0 mx-xl-3">
                            <h5 class="text-center text-style">Мы отправим инструкцию
                                по сбросу пароля на ваш email</h5>
                        </b-row>
                        <b-row class="d-flex justify-content-center my-3">
                            <b-col class="col-xl-5 offset-2">
                                <b-button type="submit" variant="primary" class="py-2 font-weight-bold button" block>Далее</b-button>
                            </b-col>
                            <b-col class="d-flex justify-content-center align-items-center col-xl-5">
                                <b-link type="button" variant="primary" block @click="back">Войти</b-link>
                            </b-col>
                        </b-row>
                    </b-form>
                </b-row>
            </template>
        </b-col>
    </b-row>
</template>

<script>
    import {validationMixin} from "vuelidate";
    import validateStateMixin from "../mixins/validationState";
    import {email, required} from "vuelidate/lib/validators";

    export default {
        name: "ResetPassword",
        data() {
            return {
                form: {
                    'email': null,
                },
                showVerifyInfo: false,
                server_error_code: null,
                server_error_message: null,
            }
        },
        mixins: [validationMixin, validateStateMixin],
        validations: {
            form: {
                email: {
                    required,
                    email,
                    server_error: function (value) {
                        if (this.server_error_code) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
            }
        },
        methods: {
            back() {
                this.$router.push("/login");
            },
            onSubmit() {
                let self = this;
                this.server_error_code = null;
                this.server_error_message = null;
                this.$v.form.$touch();
                if (this.$v.form.$anyError) {
                    return;
                }
                this.$store.dispatch({
                    type: 'auth/resetpassword',
                    data: {"email": this.$v.form["email"].$model}
                }).then(result => {
                        if (result && !result.error) {
                            this.showVerifyInfo = true;
                        } else {
                            self.server_error_message = result.error;
                            self.server_error_code = result.error_code;
                            this.$v.form.$touch();
                        }
                    }
                )
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "./../assets/scss/styles.scss";
    /* Фон сраницы */
    .back {
        background-image: url(../../static/register_background.svg);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 0 0;
    }
</style>