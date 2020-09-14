<template>
    <windows>
        <optionsbar></optionsbar>
        <b-overlay :show="show_overlay" class="col-12 col-lg-10 col-xl-8 pb-5">
            <modalinfo :action_success="actionSuccess" :action_text="action_text"
                       :action_title="action_title"></modalinfo>
            <verifyevent ref="verify"></verifyevent>
            <b-row>
                <h3>
                    Профиль: {{lastName}} {{firstName}} {{patronymic}}
                </h3>
            </b-row>
            <b-row class="py-4">
                <b-form @submit.stop.prevent="onSubmitChangePassword" class="col-xl-7 col-lg-8">
                    <b-row class="pb-3">
                        <h3>Смена пароля</h3>
                    </b-row>
                    <b-row class="pb-3 form-group">
                        <b-form-input
                                id="input-1"
                                v-model="$v.form.oldpassword.$model"
                                type="password"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                :state="validateState('oldpassword')"
                                aria-describedby="input-1-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-1" class="b-input-label">Текущий пароль</label>
                        <b-form-invalid-feedback id="input-1-live-feedback">
                            <template v-if="!$v.form.oldpassword.required">
                                Пароль обязателен.
                            </template>
                            <template v-else-if="!$v.form.oldpassword.minLength">
                                Минимум 8 символов.
                            </template>
                            <template v-else-if="server_error_message">
                                Старый пароль не верен
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="pb-3 form-group">
                        <b-form-input
                                id="input-2"
                                v-model="$v.form.password.$model"
                                type="password"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                :state="validateState('password')"
                                aria-describedby="input-2-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-2" class="b-input-label">Новый Пароль</label>
                        <span class="small-text-gray" style="font-size: 12px;">Пароль не меньше 8 знаков, должен состоять из цифр и символов, включать большую и маленькую букву</span>
                        <b-form-invalid-feedback id="input-2-live-feedback">
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
                    </b-row>
                    <b-row class="pb-3 form-group">
                        <b-form-input
                                id="input-3"
                                v-model="$v.form.password_confirm.$model"
                                type="password"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                :state="validateState('password_confirm')"
                                aria-describedby="input-3-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-3" class="b-input-label">Новый пароль ещё раз</label>
                        <b-form-invalid-feedback id="input-3-live-feedback">
                            <template v-if="!$v.form.password_confirm.required">
                                Пароль обязателен.
                            </template>
                            <template v-else-if="!$v.form.password_confirm.minLength">
                                Минимум 8 символов.
                            </template>
                            <template v-else-if="!$v.form.password_confirm.sameAsPassword">
                                Пароли не совпадают.
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row>
                        <b-button type="submit" variant="primary" block class="button font-weight-bold"
                                  style="width: 246px;">Изменить пароль
                        </b-button>
                    </b-row>
                </b-form>
            </b-row>
            <b-row class="d-flex flex-column mt-3">
                <h3 class="mb-2">Контактные данные</h3>
                <p style="font-size: 16px;">Подключите двухфакторную <br>
                    авторизацию <span class="font-weight-bold">Google Authenticator</span></p>
            </b-row>
            <b-row>
                <b-button @click="onSubmitAuthenticator" class="button px-5 font-weight-bold"
                          :disabled="status_registration==3">Подключить
                </b-button>
            </b-row>
            <b-row class="justify-content-center">
                <h2>Подтверждение телефона</h2>
            </b-row>
            <b-row class="mt-4">
                <b-form @submit.stop.prevent="changePhone" class="col-xl-7 col-lg-8">
                    <b-row class="form-group">
                        <b-form-input
                                id="input-7"
                                type="text"
                                v-model="$v.form_phone.phone.$model"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                :state="validateStateFormName('phone','form_phone')"
                                aria-describedby="input-7-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-7" class="b-input-label">Телефон</label>
                        <b-form-invalid-feedback id="input-7-live-feedback">
                            <template
                                    v-if="!$v.form_phone.phone.minLength||!$v.form_phone.phone.maxLength||!$v.form_phone.phone.numbercheck">
                                Телефон не верный, необходимо 11 символов, чтобы начиналось с 8 или +7
                            </template>
                            <template v-else-if="server_error_message">
                                {{server_error_message}}
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row>
                        <b-button type="submit" class="button px-4 py-2 font-weight-bold" style="width: 246px;" block>
                            Изменить телефон
                        </b-button>
                    </b-row>
                </b-form>
            </b-row>
        </b-overlay>
    </windows>
</template>

<script>
    import {validationMixin} from "vuelidate";
    import validateStateMixin from "../mixins/validationState";
    import Windows from "./Windows";
    import OptionsBar from "./OptionsBar";
    import {email, numeric, required, minLength, maxLength, sameAs} from "vuelidate/lib/validators";
    import VerifyEvent from "./VerifyEvent";
    import ModalInfo from "./ModalInfo";
    import validationPhone from "../mixins/validationPhone";

    export default {
        name: "Profile",
        data() {
            return {
                form: {
                    // firstName: null,
                    // lastName: null,
                    // patronymic: null,
                    oldpassword: null,
                    password: null,
                    password_confirm: null,
                },
                form_phone: {
                    phone: null,
                },
                server_error_code: null,
                server_error_message: null,
                show_overlay: false,
                titlegoogle: null,
                contains_number: false,
                contains_uppercase: false,
                contains_lowercase: false,
                method_confirm: null,
                phone: null,
                action_text: '',
                action_title: 'Действие',
                status_registration: 0,

            }
        },
        mixins: [validationMixin, validateStateMixin, validationPhone],
        components: {
            "windows": Windows,
            "optionsbar": OptionsBar,
            "modalinfo": ModalInfo,
            "verifyevent": VerifyEvent
        },
        validations: {
            form: {
                oldpassword: {
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
                password: {
                    required,
                    minLength: minLength(8),
                    sameAsPassword: sameAs('password_confirm'),
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
                password_confirm: {
                    required,
                    minLength: minLength(8),
                    sameAsPassword: sameAs('password'),
                },
            },
            form_phone: {
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
        mounted() {
            this.status_registration = this.$store.getters['auth/status_registration'];
        },
        methods: {
            actionSuccess() {

            },
            changePhone() {
                this.$v.form_phone.$touch();
                if (this.$v.form_phone.$anyError) {
                    return;
                }
                let self = this;
                this.action_text = "Вы успешно изменили номер телефона";
                let func = function () {
                    self.$bvModal.hide('modal-success');
                };
                let phone = this.checkPhoneNumber(this.$v.form_phone.phone.$model);
                this.$refs.verify.onConfirm(8, func, phone);
            },
            changePassword() {
                let self = this;
                let data = {
                    old_password: this.$v.form.oldpassword.$model,
                    password: this.$v.form.password.$model,
                    password_confirm: this.$v.form.password_confirm.$model,
                };
                this.action_text = "Пароль успешно изменен";
                this.$store.dispatch({
                    type: 'auth/change_password',
                    data: data,
                }).then(result => {
                        this.show_overlay = false;
                        if (result && !result.error) {
                            self.$bvModal.show('modal-success');
                        } else {
                            if (result && result.error_code) {
                                self.server_error_code = result.error_code;
                            }
                            if (result && result.error) {
                                self.server_error_message = result.error;
                            }
                            self.$v.form.$touch();
                        }
                    }
                )
            },
            onSubmitChangePassword() {
                let self = this;
                this.$refs.verify.onConfirm(1, self.changePassword);
            },
            onSubmitAuthenticator() {
                this.action_text = "Вы успешно подключили google authenticator";
                let self = this;
                let func = function () {
                    self.status_registration = 3;
                    self.$bvModal.hide('modal-success');
                };
                this.$refs.verify.onConfirm(null, func);
            },
        },
    }
</script>

<style lang="scss">
    @import "./src/assets/scss/styles.scss";
</style>