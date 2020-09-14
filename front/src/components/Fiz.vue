<template>
    <windows>
        <optionsbar></optionsbar>
        <b-overlay :show="show_overlay" class="col-12">
            <modalinfo :action_success="actionSuccess" :action_text="action_text"
                       :action_title="action_title"></modalinfo>
            <verifyevent ref="verify"></verifyevent>
            <b-row class="py-4">
                <b-col cols="12" class="mb-2">
                    <b-row>
                        <h3>
                            <template v-if="id">
                                Редактирование
                            </template>
                            <template v-else>
                                Добавление
                            </template>
                        </h3>
                    </b-row>
                </b-col>
                <b-form @submit.stop.prevent="onSubmit" class="col-12 col-lg-10 col-xl-5">
                    <h5 style="margin-left: -15px;" class="mb-4">Основная информация</h5>
                    <b-row class="form-group">
                        <b-form-input
                                id="input-1"
                                type="text"
                                :state="validateState('lastName')"
                                v-model.trim="$v.form.lastName.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-1-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-1" class="b-input-label" :class="customLastNameClass">Фамилия</label>
                        <b-form-invalid-feedback id="input-1-live-feedback">
                            <template v-if="!$v.form.lastName.required">
                                Обязательное поле
                            </template>
                            <template v-else-if="server_error_message">
                                {{server_error_message}}
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="form-group">
                        <b-form-input
                                id="input-2"
                                type="text"
                                :state="validateState('firstName')"
                                v-model.trim="$v.form.firstName.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-2-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-2" class="b-input-label" :class="customFirstNameClass">Имя</label>
                        <b-form-invalid-feedback id="input-2-live-feedback">
                            <template v-if="!$v.form.firstName.required">
                                Обязательное поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="form-group">
                        <b-form-input
                                id="input-3"
                                type="text"
                                v-model.trim="form.patronymic"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-3" class="b-input-label" :class="customPatronymicClass">Отчество</label>
                    </b-row>
                    <b-row class="form-group">
                        <b-form-input
                                id="input-4"
                                type="text"
                                :state="validateState('passId')"
                                v-model.trim="$v.form.passId.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-4-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-4" class="b-input-label" :class="customPassportNumberClass">Серия и номер
                            паспорта</label>
                        <b-form-invalid-feedback id="input-4-live-feedback">
                            <template v-if="!$v.form.passId.required">
                                Обязательное поле
                            </template>
                            <template v-else-if="!$v.form.passId.maxLength||!$v.form.passId.minLength">
                                Ошибка в поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="form-group">
                        <b-form-input
                                id="input-5"
                                type="text"
                                :state="validateState('Issued')"
                                v-model.trim="$v.form.Issued.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-5-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-5" class="b-input-label" :class="customIssuedClass">Кем выдан</label>
                        <b-form-invalid-feedback id="input-5-live-feedback">
                            <template v-if="!$v.form.Issued.required">
                                Обязательное поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-col class="d-flex flex-column flex-xl-row flex-lg-row flex-md-row flex-sm-row justify-content-between col-12 px-0 mx-0">
                        <b-row class="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 form-group px-0">
                            <b-form-input
                                    id="input-6"
                                    type="text"
                                    :state="validateState('DivisionCode')"
                                    v-model.trim="$v.form.DivisionCode.$model"
                                    readonly
                                    onfocus="this.removeAttribute('readonly')"
                                    @input="clearInput"
                                    aria-describedby="input-6-live-feedback"
                                    class="border-left-0 border-top-0 border-right-0 b-input"
                            ></b-form-input>
                            <label for="input-6" class="b-input-label" :class="customDepCodeClass">Код
                                подразделения</label>
                            <b-form-invalid-feedback id="input-6-live-feedback">
                                <template v-if="!$v.form.DivisionCode.required">
                                    Обязательное поле
                                </template>
                            </b-form-invalid-feedback>
                        </b-row>
                        <b-row class="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 form-group mb-3 px-0">
                            <b-form-input
                                    id="input-7"
                                    type="date"
                                    :state="validateState('issueDate')"
                                    v-model="$v.form.issueDate.$model"
                                    :max="maxDate"
                                    readonly
                                    onfocus="this.removeAttribute('readonly')"
                                    @input="clearInput"
                                    aria-describedby="input-7-live-feedback"
                                    class="border-left-0 border-top-0 border-right-0 b-input"
                            ></b-form-input>
                            <label for="input-7" class="b-input-label" :class="customDateOfIssueClass">Дата
                                выдачи:</label>
                            <b-form-invalid-feedback id="input-7-live-feedback">
                                <template v-if="!$v.form.issueDate.required">
                                    Обязательное поле
                                </template>
                            </b-form-invalid-feedback>
                        </b-row>
                    </b-col>
                    <b-row class="form-group">
                        <b-form-input
                                id="input-7"
                                type="text"
                                :state="validateState('addr')"
                                v-model.trim="$v.form.addr.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-7-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-7" class="b-input-label" :class="customRegAddrClass">Адрес регистрации</label>
                        <b-form-invalid-feedback id="input-7-live-feedback">
                            <template v-if="!$v.form.addr.required">
                                Обязательное поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="form-group">
                        <b-form-input
                                d="input-8"
                                type="text"
                                :state="validateState('INN')"
                                v-model.trim="$v.form.INN.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-8-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-8" class="b-input-label" :class="customINNClass">ИНН</label>
                        <b-form-invalid-feedback id="input-8-live-feedback">
                            <template v-if="!$v.form.INN.required">
                                Обязательное поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <hr class="px-0 mx-0">
                    <b-row class="flex-column">
                        <h4>Прикрепите документы</h4>
                        <p class="font-weight-bold">Файл в формате: .jpeg, .png, .pdf, .doc, .docx, .rar,.zip.</p>
                    </b-row>
                    <b-row class="pb-3">
                        <b-col cols="5" v-if="uploaded_files.pasport">
                            <b-row class="align-items-center h-100">
                                <a download :href="uploaded_files.pasport" class="pr-4 d-block">
                                    Файл
                                    загружен /
                                    Скачать файл
                                </a>
                            </b-row>
                        </b-col>
                        <b-col :cols="returnNumberCols(uploaded_files.pasport)">
                            <b-row class="align-items-center h-100">
                                <b-form-file
                                        id="input-9"
                                        v-model="form.pasport"
                                        :accept="mime"
                                        browse-text=" "
                                        placeholder="Паспорт первая страница и регистрация"
                                        class="inputpassport"
                                ></b-form-file>
                            </b-row>
                        </b-col>
                    </b-row>
                    <b-row class="pb-3">
                        <b-col cols="5" v-if="uploaded_files.dovdog">
                            <b-row class="align-items-center h-100">
                                <a download :href="uploaded_files.dovdog" class="pr-4 d-block">
                                    Файл
                                    загружен /
                                    Скачать файл
                                </a>
                            </b-row>
                        </b-col>
                        <b-col :cols="returnNumberCols(uploaded_files.dovdog)">
                            <b-row class="align-items-center h-100">
                                <b-form-file
                                        id="input-10"
                                        v-model="form.dovdog"
                                        class="inputpassport"
                                        :accept="mime"
                                        placeholder="Доверенность, если договор подписывается представителем на её основании"
                                ></b-form-file>
                            </b-row>
                        </b-col>
                    </b-row>
                    <b-row class="form-group">
                        <b-form-input
                                id="input-11"
                                type="text"
                                v-model.trim="$v.form.phone.$model"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                @input="clearInput"
                                :state="validateState('phone')"
                                aria-describedby="input-11-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-11" class="b-input-label" :class="customPhoneClass">Телефон</label>
                        <b-form-invalid-feedback id="input-11-live-feedback">
                            <template
                                    v-if="!$v.form.phone.minLength||!$v.form.phone.maxLength||!$v.form.phone.numbercheck">
                                Телефон не верный, необходимо 11 символов, чтобы начиналось с 8 или +7
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="form-group">
                        <b-form-input
                                id="input-12"
                                type="text"
                                v-model.trim="$v.form.email.$model"
                                :state="validateState('email')"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-12-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input hello"
                        ></b-form-input>
                        <label for="input-12" class="b-input-label" :class="customEmailClass">Электронная почта</label>
                        <b-form-invalid-feedback id="input-12-live-feedback">
                            <template v-if="!$v.form.email.required">
                                Почта обязательна
                            </template>
                            <template v-if="!$v.form.email.email">
                                Введите правильный email
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="col-xl-9 col-lg-8 col-md-8 col-sm-10 col-12 px-0">
                        <b-button type="submit" block class="py-2 my-4 button">
                            <template v-if="id">
                                Обновить данные физического лица
                            </template>
                            <template v-else>
                                Создать физическое лицо
                            </template>

                        </b-button>
                    </b-row>
                </b-form>
            </b-row>
        </b-overlay>
        <hr>
        <b-row class="col-12">
            <banklist :fiz_type="true" :face_id="id" v-bind:idAcc="idAcc" v-if="id" ref="bank"
                      :verify="$refs.verify"></banklist>
        </b-row>
        <b-row class="col-12">
            <cardlist :face_id="id" v-bind:idAcc="idAcc" v-if="id" ref="card"
                      :verify="$refs.verify"></cardlist>
        </b-row>
    </windows>
</template>

<script>
    import {validationMixin} from "vuelidate";
    import validateStateMixin from "../mixins/validationState";
    import Windows from "./Windows";
    import OptionsBar from "./OptionsBar";
    import settings from "../api/settings";
    import {email, numeric, required, minLength, maxLength} from "vuelidate/lib/validators";
    import {create_formdata} from "../store/storage";
    import BankList from "./BankList";
    import ModalInfo from "./ModalInfo";
    import validationPhone from "../mixins/validationPhone";
    import Vue from "vue";
    import VerifyEvent from "./VerifyEvent";
    import CardList from "./CardList";

    export default {
        name: "Fiz",
        data() {
            return {
                form: {
                    firstName: null,
                    lastName: null,
                    patronymic: null,
                    INN: null,
                    Issued: null,
                    addr: null,
                    issueDate: null,
                    DivisionCode: null,
                    passId: null,
                    phone: null,
                    email: null,
                    pasport: null,
                    dovdog: null,
                },
                uploaded_files: {
                    pasport: null,
                    dovdog: null,
                },
                server_error_code: null,
                server_error_message: null,
                id: null,
                mime: settings.mime,
                show_overlay: false,
                action_text: '',
                action_title: 'Действие',
                idAcc: null,
                maxDate: new Date().toISOString().split("T")[0],
            }
        },
        mixins: [validationMixin, validateStateMixin, validationPhone],
        components: {
            "windows": Windows,
            "optionsbar": OptionsBar,
            "banklist": BankList,
            "modalinfo": ModalInfo,
            "verifyevent": VerifyEvent,
            "cardlist": CardList
        },
        created() {
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
            }

        },
        validations: {
            form: {
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
                    email
                },
                firstName: {
                    required,
                    server_error: function (value) {
                        if (this.server_error_code) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
                lastName: {required},
                INN: {
                    required,
                    numeric,
                    minLength: minLength(12),
                    maxLength: maxLength(12),
                },
                Issued: {required},
                addr: {required},
                issueDate: {required},
                DivisionCode: {required},
                passId: {
                    required,
                    //numeric,
                    minLength: minLength(10),
                    maxLength: maxLength(11),
                },
            }
        },
        methods: {
            returnNumberCols(model) {
                if (model) {
                    return 7;
                } else {
                    return 12;
                }
            },
            actionSuccess() {
                this.$router.push('/fiz/');
            },
            formatNames(files) {
                if (files.length === 1) {
                    return files[0].name;
                } else {
                    return `${files.length} files selected`;
                }
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
                if (data.INN) {
                    this.form.INN = data.INN;
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
                if (data.pasport) {
                    this.form.pasport = data.pasport;
                }
                if (data.dovdog) {
                    this.form.dovdog = data.dovdog;
                }
                if (data.idAcc) {
                    this.idAcc = data.idAcc;
                }
            },
            getObject() {
                this.show_overlay = true;
                let self = this;
                this.$store.dispatch({
                    type: 'fiz/get',
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
                        }
                    }
                );
                this.$store.dispatch({
                    type: 'files/get_fiz_files',
                    id: self.id,
                }).then(result => {
                        if (result && !result.error) {
                            if (result.result.length > 0) {
                                let keys = Object.keys(self.uploaded_files);
                                for (let k in keys) {
                                    for (let kk in result.result) {
                                        if (result.result[kk].type === keys[k]) {
                                            self.uploaded_files[keys[k]] = result.result[kk].url;
                                            break
                                        }
                                    }
                                }
                            }
                        } else {
                            if (result && result.error_code) {
                                self.server_error_code = result.error_code;
                            }
                            if (result && result.error) {
                                self.server_error_message = result.error;
                            }
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
                this.$refs.verify.onConfirm(4, self.sendSubmit);
            },
            sendSubmit() {
                this.show_overlay = true;
                this.server_error_code = null;
                this.server_error_message = null;
                let self = this;
                let data;
                let type = 'fiz/post';

                if (this.id) {
                    type = 'fiz/put';
                    data = {
                        id: this.id
                    };
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
                    if (this.form.pasport) {
                        data.pasport = this.form.pasport;
                    }
                    let idAcc = this.$refs.bank.getidAcc();
                    if (idAcc) {
                        data.idAcc = idAcc;
                    }
                    this.action_text = "Физическое лицо успешно отредактирован";
                } else {
                    data = {
                        firstName: this.$v.form.firstName.$model,
                        lastName: this.$v.form.lastName.$model,
                        INN: this.$v.form.INN.$model,
                        Issued: this.$v.form.Issued.$model,
                        addr: this.$v.form.addr.$model,
                        issueDate: this.$v.form.issueDate.$model,
                        DivisionCode: this.$v.form.DivisionCode.$model,
                        passId: this.$v.form.passId.$model,
                        phone: this.checkPhoneNumber(this.$v.form.phone.$model),
                        email: this.$v.form.email.$model,
                    };
                    this.action_text = "Физическое лицо успешно создано";
                }
                if (this.form.pasport) {
                    data["pasport"] = this.form.pasport;
                }
                if (this.form.dovdog) {
                    data["dovdog"] = this.form.dovdog;
                }
                if (this.form.patronymic) {
                    data["patronymic"] = this.form.patronymic;
                }
                this.$store.dispatch({
                    type: type,
                    data: create_formdata(data),
                }).then(result => {
                        self.show_overlay = false;
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
            }
        },
    }
</script>

<style lang="scss">
    @import "./src/assets/scss/styles.scss";

    .inputpassport {
        margin-bottom: 20px;
    }

    .inputpassport input {
        height: auto;
        min-height: 55px;
    }

    .inputpassport label::after {
        background: #fff;
        border: none;
        content: "" !important;
        background: url("https://img.icons8.com/offices/30/000000/attach.png") no-repeat center;
        background-size: 25px;
        top: 50%;
        transform: translateY(-50%);
        right: 5px;
    }

    .inputpassport label {
        height: auto;
        min-height: 55px;
        display: flex;
        align-items: center;
        padding-right: 30px;
    }

    .custom_b_input_label {
        top: 5px !important;
        color: #6202ee !important;
        font-size: 12px !important;
    }
</style>