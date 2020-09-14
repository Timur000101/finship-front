<template>
    <b-row class="d-flex align-items-center overflow-auto mx-0 back h-auto" style="min-height: 100vh;">
        <b-col cols="12" sm="10" md="9" lg="7" xl="7"
               class="justify-content-center p-lg-5 p-sm-3 py-md-3 my-md-5 my-lg-5 my-xl-5 mx-auto bg-white b-card-radius"
        >
            <template v-if="showVerifyInfo">
                <b-row class="px-4 text-center">
                    <h4 class="my-3 main-title">На почтовый ящик, указанный в качестве логина, было отправлено письмо
                        подтверждения вашей почты,зайдите пожалуйста, в ваш почтовый ящик и перейдите по ссылке,
                        указанной в письме.</h4>
                </b-row>
                <b-row class="justify-content-center text-center">
                    <h4>
                        <b-link href="/login/" class="small-text">Продолжить регистрацию</b-link>
                    </h4>
                </b-row>
            </template>
            <template v-else>
                <b-modal
                        id="modal_terms"
                        title="Условия использования сервиса"
                        scrollable
                        ok-only
                >
                    {{terms}}
                </b-modal>
                <b-row class="justify-content-center d-flex text-center mb-2 px-md-5 px-sm-5 px-3 mt-3">
                    <h3 class="font-weight-normal px-0 px-xl-5">Пройдите регистрацию и начните пользоваться сервисом
                        прямо сейчас</h3>
                </b-row>
                <b-row class="my-4 px-lg-5 px-md-5">
                    <b-form @submit.stop.prevent="onSubmit" class="form mx-auto">
                        <b-form-group class="form-group">
                            <b-form-input
                                    id="input-1"
                                    type="text"
                                    required
                                    v-model.trim="$v.form.email.$model"
                                    :state="validateState('email')"
                                    @input="clearInput"
                                    readonly
                                    onfocus="this.removeAttribute('readonly')"
                                    aria-describedby="input-1-live-feedback"
                                    class="border-left-0 border-top-0 border-right-0 b-input"
                            ></b-form-input>
                            <label for="input-1" id="label" class="b-input-label">Логин</label>
                            <b-form-invalid-feedback id="input-1-live-feedback">
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
                        </b-form-group>
                        <b-form-group class="form-group">
                            <b-col cols="12">
                                <b-row>
                                    <b-col
                                            cols="12"
                                            class="position-absolute h-100">
                                        <b-row class="h-100 justify-content-end">
                                    <span class="row no-gutters align-items-center pr-3 mr-3">
                                        <i class="fas to_top" @click="showPassword" :class="iconpass"></i>
                                    </span>
                                        </b-row>
                                    </b-col>
                                    <b-form-input
                                            id="input-2"
                                            v-model="$v.form.password.$model"
                                            :type="type_password"
                                            required
                                            readonly
                                            onfocus="this.removeAttribute('readonly')"
                                            @input="clearInput"
                                            :state="validateState('password')"
                                            aria-describedby="input-2-live-feedback"
                                            class="border-left-0 border-top-0 border-right-0 b-input to_top1"
                                    ></b-form-input>
                                    <label for="input-2" class="b-input-label">Пароль</label>
                                </b-row>
                            </b-col>
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
                            </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group class="form-group">
                            <b-col cols="12">
                                <b-row>
                                    <b-col
                                            cols="12"
                                            class="position-absolute h-100">
                                        <b-row class="h-100 justify-content-end">
                                    <span class="row no-gutters align-items-center pr-3 mr-3">
                                        <i class="fas to_top" @click="showPassword" :class="iconpass"></i>
                                    </span>
                                        </b-row>
                                    </b-col>
                                    <b-form-input
                                            id="input-3"
                                            v-model="$v.form.repeatPassword.$model"
                                            :type="type_password"
                                            required
                                            readonly
                                            onfocus="this.removeAttribute('readonly')"
                                            @input="clearInput"
                                            :state="validateState('repeatPassword')"
                                            aria-describedby="input-3-live-feedback"
                                            class="border-left-0 border-top-0 border-right-0 b-input to_top1"
                                    ></b-form-input>
                                    <label for="input-3" class="b-input-label">Повторить пароль</label>
                                </b-row>
                            </b-col>
                            <b-form-invalid-feedback id="input-3-live-feedback"
                                                     :class="[showPasswordError() ? 'd-block':'']">
                                <template v-if="!$v.form.repeatPassword.required">
                                    Пароль обязателен.
                                </template>
                                <template v-else-if="!$v.form.repeatPassword.minLength">
                                    Минимум 8 символов.
                                </template>
                                <template v-else-if="!$v.form.repeatPassword.sameAsPassword">
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
                            </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group class="form-group">
                            <b-form-input
                                    id="input-4"
                                    type="text"
                                    required
                                    readonly
                                    onfocus="this.removeAttribute('readonly')"
                                    @input="clearInput"
                                    v-model.trim="$v.form.lastName.$model"
                                    :state="validateState('lastName')"
                                    aria-describedby="input-4-live-feedback"
                                    class="border-left-0 border-top-0 border-right-0 b-input"
                            ></b-form-input>
                            <label for="input-4" class="b-input-label">Фамилия</label>
                            <b-form-invalid-feedback id="input-4-live-feedback">
                                <template v-if="!$v.form.lastName.required">
                                    Обязательное поле
                                </template>
                            </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group class="form-group">
                            <b-form-input
                                    id="input-5"
                                    type="text"
                                    required
                                    readonly
                                    onfocus="this.removeAttribute('readonly')"
                                    @input="clearInput"
                                    v-model.trim="$v.form.firstName.$model"
                                    :state="validateState('firstName')"
                                    aria-describedby="input-5-live-feedback"
                                    class="border-left-0 border-top-0 border-right-0 b-input"
                            ></b-form-input>
                            <label for="input-5" class="b-input-label">Имя</label>
                            <b-form-invalid-feedback id="input-5-live-feedback">
                                <template v-if="!$v.form.firstName.required">
                                    Обязательное поле
                                </template>
                            </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group class="form-group">
                            <b-form-input
                                    id="input-6"
                                    type="text"
                                    readonly
                                    onfocus="this.removeAttribute('readonly')"
                                    @input="clearInput"
                                    v-model.trim="form.patronymic"
                                    class="border-left-0 border-top-0 border-right-0 b-input"
                            ></b-form-input>
                            <label for="input-6" class="b-input-label">Отчество</label>
                        </b-form-group>
                        <b-form-group class="form-group">
                            <b-form-input
                                    id="input-7"
                                    type="text"
                                    readonly
                                    onfocus="this.removeAttribute('readonly')"
                                    @input="clearInput"
                                    v-model="$v.form.phone.$model"
                                    :state="validateState('phone')"
                                    aria-describedby="input-7-live-feedback"
                                    class="border-left-0 border-top-0 border-right-0 b-input"
                            ></b-form-input>
                            <label for="input-7" class="b-input-label">Телефон</label>
                            <b-form-invalid-feedback id="input-7-live-feedback">
                                <template
                                    v-if="!$v.form.phone.minLength||!$v.form.phone.maxLength||!$v.form.phone.numbercheck">
                                Телефон не верный, необходимо 11 символов, чтобы начиналось с 8 или +7
                            </template>
                            </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group class="form-group">
                            <b-form-checkbox
                                    v-model="$v.form.terms.$model"
                                    :state="validateState('terms')"
                                    aria-describedby="checkbox-1-live-feedback">
                                Вы соглашаетесь с
                                <b-link href="/static/terms.txt" @click.prevent="showTerms('/static/terms.txt')">
                                    условиями
                                    использования сервиса
                                </b-link>
                            </b-form-checkbox>
                            <b-form-invalid-feedback id="checkbox-1-live-feedback">
                                Обязательный параметр для регистрации
                            </b-form-invalid-feedback>
                        </b-form-group>
                        <b-row class="justify-content-center">
                            <b-button type="submit" block class="my-4 w-75 py-2 font-weight-bold button"
                            >Зарегистрироваться
                            </b-button>
                        </b-row>
                    </b-form>
                </b-row>
            </template>
        </b-col>
    </b-row>
</template>

<script>
    import {required, minLength, email, integer, maxLength, sameAs} from 'vuelidate/lib/validators';
    import {validationMixin} from "vuelidate";
    import validateStateMixin from '../mixins/validationState';
    import http from "../api/http";
    import validationPhone from "../mixins/validationPhone";

    export default {
        name: 'Registration',
        data() {
            return {
                form: {
                    'password': null,
                    'repeatPassword': null,
                    'email': null,
                    'firstName': null,
                    'lastName': null,
                    'patronymic': null,
                    'phone': null,
                    'fiz': false,
                    'terms': null
                },
                showVerifyInfo: null,
                terms: '',
                server_error_code: null,
                server_error_message: null,
                contains_number: false,
                contains_uppercase: false,
                contains_lowercase: false,
                type_password: "password",
                iconpass: "fa-eye",
            }
        },
        mixins: [validationMixin, validateStateMixin, validationPhone],
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
                            this.contains_number === true && this.contains_lowercase) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                },
                repeatPassword: {
                    required,
                    minLength: minLength(8),
                    sameAsPassword: sameAs('password'),
                },
                firstName: {
                    required
                },
                lastName: {
                    required
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
                phone: {
                    required,
                    minLength: minLength(11),
                    maxLength: maxLength(12),
                    numbercheck: function (value) {
                        if (value && (value.startsWith("8") && value.length == 11 || value.startsWith("+7") && value.length == 12)) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                },
                terms: {
                    sameAs: sameAs(() => true)
                },
            },
        },
        methods: {
            onSubmit() {
                this.server_error_code = null;
                this.$v.form.$touch();
                if (this.$v.form.$anyError) {
                    return;
                }
                let self = this;
                let data = {
                    "email": this.$v.form.email.$model,
                    "password": this.$v.form.password.$model,
                    "password_confirm": this.$v.form.repeatPassword.$model,
                    "phone": this.checkPhoneNumber(this.$v.form.phone.$model),
                    "firstName": this.$v.form.firstName.$model,
                    "lastName": this.$v.form.lastName.$model,

                };
                if (this.form.patronymic) {
                    data["patronymic"] = this.form.patronymic;
                }
                this.$store.dispatch({
                    type: 'auth/registration',
                    data: data,
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
            showTerms(url) {
                let self = this;
                this.$store.dispatch({
                    type: 'auth/get_resource',
                    data: url,
                }).then(result => {
                        if (result && !result.error) {
                            self.terms = data;
                            self.$bvModal.show('modal_terms');
                        }
                    }
                );
                http.get_resource(url).then(function (data) {
                        self.terms = data;
                        self.$bvModal.show('modal_terms');
                    }
                )
            },
        }
    }
</script>

<style lang="scss">
    @import "./../assets/scss/styles.scss";
    // /* Медиа запрос *//
    @media (max-width: 576px) {
        .back {
            background: none !important;
        }
    }

    .to_top {
        z-index: 100;
    }

    .to_top1 {
        z-index: 80;
    }
</style>