<template>
    <b-row class="justify-content-center h-auto px-3 mx-0 back" style="min-height: 100vh;">
        <b-col cols="12" md="8" lg="6" xl="4"
               class="my-auto px-xl-5 px-lg-5 px-md-5 px-sm-5 py-5 bg-white b-card-radius">
            <template v-if="showVerifyInfo">
                <b-row class="justify-content-center text-center mb-3">
                    <h3>Ваш пароль успешно изменен</h3>
                </b-row>
                <b-row class="justify-content-center text-center">
                    <b-link href="/login/" class="small-text">Ввойдите с новым паролем</b-link>
                </b-row>
            </template>
            <template v-else>
                <b-row class="justify-content-center">
                    <h3>Задайте новый пароль</h3>
                </b-row>
                <b-row class="px-0 px-xl-5 px-lg-5 px-md-5 px-sm-4 mt-4">
                    <b-form @submit.stop.prevent="onSubmit" class="col-12">
                        <b-row class="pb-3 form-group">
                            <b-col
                                    cols="12"
                                    class="position-absolute h-100">
                                <b-row class="d-flex h-100 align-items-center justify-content-end">
                                    <span class="row no-gutters align-items-center pr-3 mr-3 mb-3">
                                        <i class="fas to_top" @click="showPassword" :class="iconpass"></i>
                                    </span>
                                </b-row>
                            </b-col>
                            <b-form-input
                                    id="input-2"
                                    v-model="$v.form.password.$model"
                                    :type="type_password"
                                    readonly
                                    onfocus="this.removeAttribute('readonly')"
                                    @input="clearInput"
                                    required
                                    :state="validateState('password')"
                                    aria-describedby="input-2-live-feedback"
                                    class="border-left-0 border-top-0 border-right-0 to_top1 b-input"
                            ></b-form-input>
                            <label for="input-2" class="b-input-label">Пароль</label>
                            <b-form-invalid-feedback id="input-2-live-feedback"
                                                     :class="[showPasswordError() ? 'd-block':'']">
                                <template v-if="!$v.form.password.required">
                                    Пароль обязателен.
                                </template>
                                <template v-else-if="!$v.form.password.minLength">
                                    Минимум 8 символов.
                                </template>
                                <template v-else-if="!$v.form.password.sameAsPassword">
                                    Пароли не совпадают.
                                </template>
                                <template v-else-if="!contains_number">
                                    Пароль должен содержать числа.
                                </template>
                                <template v-else-if="!contains_uppercase">
                                    Пароль должен содержать символы верхнего регистра, латиница.
                                </template>
                                <template v-else-if="!contains_lowercase">
                                    Пароль должен содержать символы нижнего регистра, латиница.
                                </template>
                                <template v-else-if="server_error_message">
                                    {{server_error_message}}
                                </template>
                            </b-form-invalid-feedback>
                        </b-row>
                        <b-row class="pb-3 mb-3 form-group">
                            <b-col
                                    cols="12"
                                    class="position-absolute h-100">
                                <b-row class="h-100 justify-content-end">
                                    <span class="row no-gutters align-items-center pr-3 mr-3 mb-3">
                                        <i class="fas to_top" @click="showPassword" :class="iconpass"></i>
                                    </span>
                                </b-row>
                            </b-col>
                            <b-form-input
                                    id="input-3"
                                    v-model="$v.form.repeatPassword.$model"
                                    :type="type_password"
                                    readonly
                                    onfocus="this.removeAttribute('readonly')"
                                    @input="clearInput"
                                    :state="validateState('repeatPassword')"
                                    aria-describedby="input-3-live-feedback"
                                    class="border-left-0 border-top-0 border-right-0 to_top1 b-input"
                            ></b-form-input>
                            <label for="input-3" class="b-input-label">Повторить пароль</label>
                            <b-form-invalid-feedback id="input-3-live-feedback" :class="[showPasswordError() ? 'd-block':'']">
                                <template v-if="!$v.form.repeatPassword.required">
                                    Пароль обязателен.
                                </template>
                                <template v-else-if="!$v.form.repeatPassword.minLength">
                                    Минимум 8 символов.
                                </template>
                                <template v-else-if="!$v.form.repeatPassword.sameAsPassword">
                                    Пароли не совпадают.
                                </template>
                            </b-form-invalid-feedback>
                        </b-row>
                        <b-row class="d-flex justify-content-center col-12">
                            <b-col class="px-0 col-xl-6 col-lg-5 col-md-6 col-sm-7 col-8 offset-lg-2 offset-xl-2">
                                <b-button type="submit" variant="primary" class="py-2 font-weight-bold button" block>Готово</b-button>
                            </b-col>
                            <b-col class="d-flex justify-content-center align-items-center col-xl-4 col-lg-5 col-md-6 col-sm-5  col-4">
                                <b-link>Далее</b-link>
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
    import {minLength, required, sameAs} from "vuelidate/lib/validators";

    export default {
        name: "ChangePassword",
        data() {
            return {
                form: {
                    'password': null,
                    'repeatPassword': null,
                },
                showVerifyInfo: false,
                server_error_code: null,
                server_error_message: null,
                contains_number: false,
                contains_uppercase: false,
                contains_lowercase: false,
                type_password: "password",
                iconpass: "fa-eye",
            }
        },
        created() {
            if (!(this.$route.query.user_id && this.$route.query.timestamp && this.$route.query.signature)) {
                this.$router.push("/login");
            }
        },
        mixins: [validationMixin, validateStateMixin],
        validations: {
            form: {
                password: {
                    required,
                    minLength: minLength(8),
                    sameAsPassword: sameAs('repeatPassword'),
                    checkPassword: function (value) {
                        this.contains_number = /\d/.test(value);
                        this.contains_uppercase = /[A-Z]/.test(value);
                        this.contains_lowercase = /[a-z]/.test(value);
                        if (this.contains_uppercase === true &&
                            this.contains_number === true) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    server_error: function (value) {
                        if (this.server_error_code) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
                repeatPassword: {
                    required,
                    minLength: minLength(8),
                    sameAsPassword: sameAs('password'),
                },
            }
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
                this.$v.form.$touch();
                if (this.$v.form.$anyError) {
                    return;
                }
                let self = this;
                let data = {
                    "user_id": this.$route.query.user_id,
                    "timestamp": this.$route.query.timestamp,
                    "signature": this.$route.query.signature,
                    "password": this.$v.form.password.$model,
                };
                this.$store.dispatch({
                    type: 'auth/changepassword',
                    data: data
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
<style lang="scss">
    @import "./src/assets/scss/styles.scss";
    .to_top {
        z-index: 100;
    }
    .to_top1 {
        z-index: 80;
    }
</style>