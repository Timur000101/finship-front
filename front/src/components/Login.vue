<template>
    <b-row class="justify-content-center overflow-auto py-0 py-sm-3  h-auto mx-0 back" style="min-height: 100vh;">
        <b-col cols="12" md="10" lg="8" xl="8" sm="11"
               class="d-flex justify-content-between flex-column-reverse flex-xl-row flex-lg-row flex-md-row flex-sm-row
               px-0 my-xl-auto my-lg-auto my-md-auto my-sm-auto bg-white shadow b-card-radius"
        >
            <b-col xl="5" lg="4" md="4" sm="4" class="back2 radius py-3">
                <b-row class="justify-content-center align-items-center flex-column h-100">
                    <b-img class="w-50 mb-4 d-none d-sm-block d-md-block d-lg-block d-xl-block"
                           :src="comp_logo"></b-img>
                    <b-row class="justify-content-center">
                        <h4 class="text-white text-center">Нет аккаунта?</h4>
                    </b-row>
                    <b-row class="justify-content-center">
                        <b-link href="/register/" style="color: #1976D2;">
                            Зарегистрироваться
                        </b-link>
                    </b-row>
                </b-row>
            </b-col>
            <b-col xl="7" lg="8" md="8" sm="8" class="d-flex flex-column justify-content-center my-xl-5 my-lg-5 my-md-5 my-sm-4 my-0
                py-xl-5 py-lg-5 py-md-5 py-sm-5 py-5">
                <b-row class="justify-content-start d-block d-sm-none px-3 mb-3 mt-5">
                    <b-img class="w-50 pl-3" :src="comp_logo_dark"></b-img>
                </b-row>
                <b-row class="d-flex justify-content-center align-items-center">
                    <b-row class="justify-content-center mx-auto px-3 px-xl-5 px-lg-5 px-md-5">
                        <h3 class="mb-4 font-weight-normal text-left px-3">Войдите в ваш личный кабинет</h3>
                        <b-form @submit.stop.prevent="onSubmit" class="col-xl-10 col-lg-12 col-md-12">
                            <b-form-group class="form-group">
                                <b-form-input
                                        id="input-1"
                                        type="text"
                                        required
                                        v-model.trim="$v.form.email.$model"
                                        :state="validateState('email')"
                                        @input="clearInput"
                                        aria-describedby="input-1-live-feedback"
                                        class="border-left-0 border-top-0 border-right-0 b-input"
                                ></b-form-input>
                                <label for="input-1" id="label" class="b-input-label login-autocomp-label">Логин</label>
                                <b-form-invalid-feedback id="input-1-live-feedback">
                                    <template v-if="!$v.form.email.required">
                                        Почта обязательна.
                                    </template>
                                    <template v-else-if="!$v.form.email.email">
                                        Введите правильный email.
                                    </template>
                                    <template v-else-if="server_error_code==2">
                                        Неправильный Логин или Пароль.
                                    </template>
                                </b-form-invalid-feedback>
                            </b-form-group>
                            <b-form-group class="form-group">
                                <b-col cols="12">
                                    <b-row>
                                        <b-col
                                                cols="12"
                                                class="position-absolute h-100">
                                            <b-row class="h-100 justify-content-end">
                                            <span class="row no-gutters align-items-center pr-4">
                                                <i class="fas to_top" @click="showPassword" :class="iconpass"></i>
                                            </span>
                                            </b-row>
                                        </b-col>
                                        <b-form-input
                                                id="input-2"
                                                v-model="$v.form.password.$model"
                                                :type="type_password"
                                                required
                                                :state="validateState('password')"
                                                aria-describedby="input-2-live-feedback"
                                                class="border-bottom-3 border-left-0 border-top-0 border-right-0 to_top1 b-input"
                                                @input="clearInput"
                                        >
                                        </b-form-input>
                                        <label class="b-input-label password-autocomp-label"
                                               for="input-2">Пароль</label>
                                    </b-row>
                                </b-col>
                                <b-form-invalid-feedback id="input-2-live-feedback"
                                                         :class="[showPasswordError() ? 'd-block':'']">
                                    <template v-if="!$v.form.password.required">
                                        Пароль обязателен
                                    </template>
                                    <template v-else-if="!$v.form.password.minLength">
                                        Минимум 8 символов
                                    </template>
                                    <template v-else-if="server_error_code==3">
                                        Неправильный Логин или Пароль.
                                    </template>
                                </b-form-invalid-feedback>
                            </b-form-group>
                            <b-form-group class="px-3">
                                <b-row class="mt-xl-2 mb-xl-3">
                                    <b-form-checkbox-group v-model="form.checked" id="checkboxes-4">
                                        <b-form-checkbox class="font-weight-bold" value="me">Запомнить меня
                                        </b-form-checkbox>
                                    </b-form-checkbox-group>
                                </b-row>
                                <b-row class="py-2 mt-3">
                                    <b-col class="px-0 mr-3">
                                        <b-button type="submit" class="py-2 w-75 font-weight-bold button" block>Войти
                                        </b-button>
                                    </b-col>
                                    <b-col class="d-flex justify-content-center align-items-center px-0">
                                        <b-link class="text-center" href="/reset-password/">Забыли пароль ?</b-link>
                                    </b-col>
                                </b-row>
                            </b-form-group>
                        </b-form>
                    </b-row>
                </b-row>
            </b-col>
        </b-col>
    </b-row>

</template>

<script>
    import {email, minLength, required} from "vuelidate/lib/validators";
    import {validationMixin} from "vuelidate";
    import validateStateMixin from '../mixins/validationState';

    export default {
        name: 'Login',
        data() {
            return {
                form: {
                    'email': '',
                    'password': null
                },
                server_error_code: null,
                server_error_message: null,
                show_password: true,
                iconpass: "fa-eye",
                comp_logo: require("../../static/comp_logo.svg"),
                comp_logo_dark: require("../../static/comp_logo_dark.svg"),
                type_password: "password",
                showError: false,
            }
        },
        mixins: [validationMixin, validateStateMixin],
        validations: {
            form: {
                password: {
                    required,
                    minLength: minLength(8),
                    server_error: function (value) {
                        if (this.server_error_code) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
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
            },
        },
        methods: {
            showPasswordError() {
                if (this.$v.form.$anyError) {
                    return true;
                } else {
                    return false;
                }
            },
            showPassword() {
                if (this.show_password) {
                    this.show_password = false;
                    this.iconpass = "fa-eye-slash";
                    this.type_password = "text";
                } else {
                    this.show_password = true;
                    this.type_password = "password";
                    this.iconpass = "fa-eye";
                }
            },
            onSubmit() {
                this.server_error_code = null;
                this.$v.form.$touch();
                if (this.$v.form.$anyError) {
                    return;
                }
                let data = {
                    "email": this.$v.form.email.$model,
                    "password": this.$v.form.password.$model,
                };
                let self = this;
                this.$store.dispatch({
                    type: 'auth/login',
                    data: data,
                }).then(result => {
                    if (result && !result.error) {
                        this.$router.push('/');
                    } else {
                        if (result && result.error_code) {
                            self.server_error_code = result.error_code;
                        }
                        if (result && result.error) {
                            self.server_error_message = result.error;
                        }
                        this.$v.form.$touch();
                    }
                })
            },
            registration() {
                this.$router.push('/register/');
            }
        }
    }
</script>
<style lang="scss">
    @import "./../assets/scss/styles.scss";

    .to_top {
        width: 22px;
        height: 22px;
        z-index: 100;
    }

    .to_top1 {
        z-index: 80;
    }

    .custom_b_input_label {
        top: 5px !important;
        color: #6202ee !important;
        font-size: 12px !important;
    }
</style>

