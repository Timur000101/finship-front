<template>
    <windows>
        <optionsbar></optionsbar>
        <b-overlay :show="show_overlay" class="col-12">
            <modalinfo :action_success="actionSuccess" :action_text="action_text"
                       :action_title="action_title"></modalinfo>
            <verifyevent ref="verify"></verifyevent>
            <b-modal
                    id="modal_terms"
                    title="Условия использования сервиса"
                    scrollable
                    ok-only
            >
                {{terms}}
            </b-modal>
            <b-row class="py-4">
                <b-col cols="12">
                    <b-row>
                        <h3>
                            <template v-if="id">
                                Изменить Доверенное лицо
                            </template>
                            <template v-else>
                                Добавление / редактирование
                            </template>
                        </h3>
                    </b-row>
                </b-col>
                <b-form @submit.stop.prevent="onSubmit" class="col-12 col-lg-10 col-xl-5 mt-3">
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-1"
                                type="email"
                                v-model.trim="$v.form.email.$model"
                                :state="validateState('email')"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-1-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-1" class="b-input-label" :class="customEmailClass">Электронная почта</label>
                        <b-form-invalid-feedback id="input-1-live-feedback">
                            <template v-if="!$v.form.email.required">
                                Почта обязательна
                            </template>
                            <template v-else-if="!$v.form.email.email">
                                Введите правильный email
                            </template>
                            <template v-else-if="server_error_code==2">
                                {{server_error_message}}
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="form-group pb-3">
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
                        <label for="input-2" class="b-input-label" :class="customPasswordClass">Пароль</label>
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
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-3"
                                v-model="$v.form.repeatPassword.$model"
                                type="password"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                :state="validateState('repeatPassword')"
                                aria-describedby="input-3-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-3" class="b-input-label" :class="customRepeatPasswordClass">Повторить пароль</label>
                        <b-form-invalid-feedback id="input-3-live-feedback">
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
                    </b-row>
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-5"
                                type="text"
                                :state="validateState('lastName')"
                                v-model.trim="$v.form.lastName.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-5-live-feedback"
                                class="border-top-0 border-left-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-5" class="b-input-label" :class="customLastNameClass">Фамилия</label>
                        <b-form-invalid-feedback id="input-5-live-feedback">
                            <template v-if="!$v.form.lastName.required">
                                Обязательное поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-4"
                                type="text"
                                :state="validateState('firstName')"
                                v-model.trim="$v.form.firstName.$model"
                                @input="clearInput"
                                readonly
                                required
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-4-live-feedback"
                                class="border-top-0 border-left-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-4" class="b-input-label" :class="customFirstNameClass">Имя</label>
                        <b-form-invalid-feedback id="input-4-live-feedback">
                            <template v-if="!$v.form.firstName.required">
                                Обязательное поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>

                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-6"
                                type="text"
                                v-model.trim="form.patronymic"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-6-live-feedback"
                                class="border-top-0 border-left-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-6" class="b-input-label" :class="customPatronymicClass">Отчество</label>
                    </b-row>
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-7"
                                type="text"
                                :state="validateState('passId')"
                                v-model.trim="$v.form.passId.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-7-live-feedback"
                                class="border-top-0 border-left-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-7" class="b-input-label" :class="customPassportNumberClass">Серия и номер паспорта</label>
                        <b-form-invalid-feedback id="input-7-live-feedback">
                            <template v-if="!$v.form.passId.required">
                                Обязательное поле
                            </template>
                            <template v-else-if="!$v.form.passId.maxLength||!$v.form.passId.minLength">
                                Ошибка в поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-8"
                                type="text"
                                :state="validateState('Issued')"
                                v-model.trim="$v.form.Issued.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-8-live-feedback"
                                class="border-top-0 border-left-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-8" class="b-input-label" :class="customIssuedClass">Кем выдан</label>
                        <b-form-invalid-feedback id="input-8-live-feedback">
                            <template v-if="!$v.form.Issued.required">
                                Обязательное поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-col class="d-flex flex-column flex-xl-row flex-lg-row flex-md-row flex-sm-row justify-content-between col-12 px-0 mx-0">
                        <b-row class="col-xl-6 form-group px-0">
                            <b-form-input
                                    id="input-9"
                                    type="text"
                                    :state="validateState('DivisionCode')"
                                    v-model.trim="$v.form.DivisionCode.$model"
                                    readonly
                                    onfocus="this.removeAttribute('readonly')"
                                    @input="clearInput"
                                    aria-describedby="input-9-live-feedback"
                                    class="border-left-0 border-top-0 border-right-0 b-input"
                            ></b-form-input>
                            <label for="input-9" class="b-input-label" :class="customDepCodeClass">Код подразделения</label>
                            <b-form-invalid-feedback id="input-9-live-feedback">
                                <template v-if="!$v.form.DivisionCode.required">
                                    Обязательное поле
                                </template>
                            </b-form-invalid-feedback>
                        </b-row>
                        <b-row class="col-xl-6 form-group mb-3 px-0">
                            <b-form-input
                                    id="input-10"
                                    type="date"
                                    :state="validateState('issueDate')"
                                    v-model="$v.form.issueDate.$model"
                                    :max="maxDate"
                                    readonly
                                    autofocus
                                    onfocus="this.removeAttribute('readonly')"
                                    @input="clearInput"
                                    aria-describedby="input-10-live-feedback"
                                    class="border-left-0 border-top-0 border-right-0 b-input"
                            ></b-form-input>
                            <label for="input-10" class="b-input-label" :class="customDateOfIssueClass">Дата выдачи</label>
                            <b-form-invalid-feedback id="input-10-live-feedback">
                                <template v-if="!$v.form.issueDate.required">
                                    Обязательное поле
                                </template>
                            </b-form-invalid-feedback>
                        </b-row>
                    </b-col>
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-11"
                                type="text"
                                :state="validateState('addr')"
                                v-model.trim="$v.form.addr.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-11-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-11" class="b-input-label" :class="customRegAddrClass">Адрес регистрации</label>
                        <b-form-invalid-feedback id="input-11-live-feedback">
                            <template v-if="!$v.form.addr.required">
                                Обязательное поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <hr>
                    <b-row class="mb-3 mt-5">
                        <h4>Контактная информация</h4>
                    </b-row>
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-12"
                                type="text"
                                v-model.trim="$v.form.phone.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                :state="validateState('phone')"
                                aria-describedby="input-12-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-12" class="b-input-label" :class="customPhoneClass">Телефон</label>
                        <b-form-invalid-feedback id="input-12-live-feedback">
                            <template
                                    v-if="!$v.form.phone.minLength||!$v.form.phone.maxLength||!$v.form.phone.numbercheck">
                                Телефон не верный, необходимо 11 символов, чтобы начиналось с 8 или +7
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <hr>
                    <b-row class="pb-3">
                        <b-form-checkbox
                                v-model="form.addUser"
                        >
                            Может управлять другими пользователями
                        </b-form-checkbox>
                    </b-row>
                    <b-row class="pb-3">
                        <b-form-textarea
                                id="input-14"
                                type="text"
                                placeholder="Описание"
                                v-model="form.comment"
                                @input="clearInput"
                                readonly
                                rows="5"
                                max-rows="5"
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-14-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-textarea>
                        <b-form-invalid-feedback id="input-14-live-feedback">
                            <template v-if="!$v.form.addr.required">
                                Обязательное поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="pb-3" v-if="!id">
                        <b-form-checkbox
                                v-model="$v.form.terms.$model"
                                :state="validateState('terms')"
                                aria-describedby="checkbox-2-live-feedback">
                            Лицо, которому вы предоставляете доступ, будет иметь доступ к управлению услугами и
                            просмотру данных учетной записи.
                            Вы соглашаетесь с
                            <b-link href="/static/terms.txt" @click.prevent="showTerms('/static/terms.txt')">
                                условиями
                                использования сервиса
                            </b-link>
                        </b-form-checkbox>
                        <b-form-invalid-feedback id="checkbox-2-live-feedback">
                            Обязательный параметр для регистрации
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="col-xl-6 col-lg-8 px-0">
                        <b-button type="submit" block class="button font-weight-bold py-3 my-3">
                            <template v-if="id">
                                Обновить данные доверенного лица
                            </template>
                            <template v-else>
                                Далее
                            </template>

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
    import {email, required, minLength, maxLength, sameAs} from "vuelidate/lib/validators";
    import http from "../api/http";
    import ModalInfo from "./ModalInfo";
    import VerifyEvent from "./VerifyEvent";
    import validationPhone from "../mixins/validationPhone";

    export default {
        name: "Permission",
        data() {
            return {
                form: {
                    firstName: null,
                    lastName: null,
                    patronymic: null,
                    Issued: null,
                    addr: null,
                    password: null,
                    repeatPassword: null,
                    issueDate: null,
                    DivisionCode: null,
                    passId: null,
                    phone: null,
                    email: null,
                    terms: null,
                    addUser: false,
                    comment: null,
                },
                server_error_code: null,
                server_error_message: null,
                id: null,
                show_overlay: false,
                action_text: '',
                contains_number: false,
                contains_uppercase: false,
                contains_lowercase: false,
                action_title: 'Действие',
                maxDate: new Date().toISOString().split("T")[0],
            }
        },
        mixins: [validationMixin, validateStateMixin, validationPhone],
        components: {
            "windows": Windows,
            "optionsbar": OptionsBar,
            "modalinfo": ModalInfo,
            "verifyevent": VerifyEvent
        },
        mounted() {
            let params = this.$route.params;
            if (params && params.id) {
                if (params.id != "create") {
                    this.id = params.id;
                    this.getObject();
                }
            } else {
                this.$router.push("/");
            }
        },
        computed: {
            customLastNameClass() {
                return {custom_b_input_label: this.form.lastName}
            },
            customFirstNameClass() {
                return {custom_b_input_label: this.form.firstName}
            },
            customPatronymicClass() {
                return {custom_b_input_label: this.form.patronymic}
            },
            customPassportNumberClass() {
                return {custom_b_input_label: this.form.passId}
            },
            customIssuedClass() {
                return {custom_b_input_label: this.form.Issued}
            },
            customDepCodeClass() {
                return {custom_b_input_label: this.form.DivisionCode}
            },
            customDateOfIssueClass() {
                return {custom_b_input_label: this.form.issueDate}
            },
            customRegAddrClass() {
                return {custom_b_input_label: this.form.addr}
            },
            customINNClass() {
                return {custom_b_input_label: this.form.INN}
            },
            customPhoneClass() {
                return {custom_b_input_label: this.form.phone}
            },
            customEmailClass() {
                return {custom_b_input_label: this.form.email}
            },
            customPasswordClass() {
                return {custom_b_input_label: this.form.password}
            },
            customRepeatPasswordClass() {
                return {custom_b_input_label: this.form.repeatPassword}
            }
        },
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
                firstName: {
                    required,
                },
                lastName: {required},
                Issued: {required},
                addr: {required},
                issueDate: {required},
                DivisionCode: {required},
                passId: {
                    required,
                    minLength: minLength(10),
                    maxLength: maxLength(11),
                },
                terms: {
                    sameAs: sameAs(() => true)
                },
            }
        },
        methods: {
            actionSuccess() {
                this.$router.push('/permission/');
            },
            setData(data) {
                if (data.firstName) {
                    this.form.firstName = data.firstName;
                }
                if (data.lastName) {
                    this.form.lastName = data.lastName;
                }
                if (data.patronymic) {
                    this.form.patronymic = data.patronymic;
                }
                if (data.Issued) {
                    this.form.Issued = data.Issued;
                }
                if (data.addr) {
                    this.form.addr = data.addr;
                }
                if (data.issueDate) {
                    this.form.issueDate = data.issueDate;
                }
                if (data.DivisionCode) {
                    this.form.DivisionCode = data.DivisionCode;
                }
                if (data.passId) {
                    this.form.passId = data.passId;
                }
                if (data.phone) {
                    this.form.phone = this.preparePhone(data.phone);
                }
                if (data.email) {
                    this.form.email = data.email;
                }
                if (data.comment) {
                    this.form.comment = data.comment;
                }
                if (data.addUser) {
                    this.form.addUser = data.addUser;
                }
            },
            getObject() {
                this.show_overlay = true;
                let self = this;
                this.$store.dispatch({
                    type: 'permission/get',
                    id: self.id,
                }).then(result => {
                        self.show_overlay = false;
                        if (result && !result.error) {
                            self.setData(result.result)
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
            onSubmit() {
                let self = this;
                if (!this.id) {
                    this.$v.form.$touch();
                    if (this.$v.form.$anyError) {
                        this.show_overlay = false;
                        return;
                    }
                }
                this.$refs.verify.onConfirm(2, self.sendSubmit);
            },
            sendSubmit() {
                this.show_overlay = true;
                this.server_error_code = null;
                this.server_error_message = null;
                let self = this;
                let data;
                let type = 'permission/post';
                let payload;
                if (this.id) {
                    type = 'permission/put';
                    data = {};
                    if (this.form.firstName) {
                        data.firstName = this.form.firstName;
                    }
                    if (this.form.lastName) {
                        data.lastName = this.form.lastName;
                    }
                    if (this.form.patronymic) {
                        data.patronymic = this.form.patronymic;
                    }
                    if (this.form.INN) {
                        data.INN = this.form.INN;
                    }
                    if (this.form.Issued) {
                        data.Issued = this.form.Issued;
                    }
                    if (this.form.addr) {
                        data.addr = this.form.addr;
                    }
                    if (this.form.issueDate) {
                        data.issueDate = this.form.issueDate;
                    }
                    if (this.form.DivisionCode) {
                        data.DivisionCode = this.form.DivisionCode;
                    }
                    if (this.form.passId) {
                        data.passId = this.form.passId;
                    }
                    if (this.form.phone) {
                        data.phone = this.checkPhoneNumber(this.form.phone);
                    }
                    if (this.form.email) {
                        data.email = this.form.email;
                    }
                    if (this.form.comment) {
                        data.comment = this.form.comment;
                    }
                    if (this.form.addUser) {
                        data.addUser = this.form.addUser;
                    }
                    this.action_text = "Доверенное лицо успешно отредактировано";
                    payload = {
                        type: type,
                        data: data,
                        id: this.id,
                    };
                } else {
                    data = {
                        firstName: this.$v.form.firstName.$model,
                        lastName: this.$v.form.lastName.$model,
                        Issued: this.$v.form.Issued.$model,
                        addr: this.$v.form.addr.$model,
                        issueDate: this.$v.form.issueDate.$model,
                        DivisionCode: this.$v.form.DivisionCode.$model,
                        passId: this.$v.form.passId.$model,
                        phone: this.checkPhoneNumber(this.$v.form.phone.$model),
                        email: this.$v.form.email.$model,
                        password: this.$v.form.password.$model,
                        password_confirm: this.$v.form.repeatPassword.$model,
                        terms: this.$v.form.terms.$model,
                        addUser: this.form.addUser,
                    };
                    if (this.form.comment) {
                        data["comment"] = this.form.comment;
                    }
                    if (this.form.patronymic) {
                        data["patronymic"] = this.form.patronymic;
                    }
                    this.action_text = "Доверенное лицо успешно создано";
                    payload = {
                        type: type,
                        data: data,
                    };
                }
                this.$store.dispatch(payload).then(result => {
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
        },
    }
</script>

<style lang="scss">
    @import "./src/assets/scss/styles.scss";
</style>