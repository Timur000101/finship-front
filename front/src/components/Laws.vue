<template>
    <windows>
        <optionsbar></optionsbar>
        <b-overlay :show="show_overlay" class="col-12">
            <modalinfo :action_success="actionSuccess" :action_text="action_text"
                       :action_title="action_title"></modalinfo>
            <verifyevent ref="verify"></verifyevent>
            <b-row class="py-4">
                <b-col cols="12">
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
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-1"
                                type="text"
                                :state="validateState('comName')"
                                v-model.trim="$v.form.comName.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-1-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-1" class="b-input-label" :class="customCompNameClass">Название юридического лица</label>
                        <b-form-invalid-feedback id="input-1-live-feedback">
                            <template v-if="!$v.form.comName.required">
                                Обязательное поле
                            </template>
                            <template v-else-if="server_error_message">
                                {{server_error_message}}
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="pb-3">
                        <b-form-select
                                v-model.trim="$v.form.comType.$model"
                                :options="comTypeOptions"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        >
                        </b-form-select>
                        <span class="small-text-gray" style="font-size: 12px;">Выберите из предложенных вариантов</span>
                    </b-row>
                    <b-row class="form-group">
                        <b-form-input
                                id="input-3"
                                type="text"
                                :state="validateState('legalAddr')"
                                v-model.trim="$v.form.legalAddr.$model"
                                @input="AddInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-3-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-3" class="b-input-label" :class="customLegalAddrClass">Юридический адрес</label>
                        <b-form-invalid-feedback id="input-3-live-feedback">
                            <template v-if="!$v.form.legalAddr.required">
                                Обязательное поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="mb-4">
                        <b-form-checkbox v-model="form.law_adress_is_fact" @change="changeCheck">
                            <span class="font-weight-bolder">Юридический адрес совпадает с фактическим</span>
                        </b-form-checkbox>
                    </b-row>
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-4"
                                type="text"
                                :state="validateState('comAddr')"
                                v-model.trim="$v.form.comAddr.$model"
                                :disabled="form.law_adress_is_fact"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-4-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-4" class="b-input-label compAddr" :class="customCompAddrClass">Фактический адрес</label>
                        <b-form-invalid-feedback id="input-4-live-feedback">
                            <template v-if="!$v.form.comAddr.required">
                                Обязательное поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-5"
                                type="text"
                                :state="validateState('OGRN')"
                                v-model.trim="$v.form.OGRN.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-5-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-5" class="b-input-label" :class="customOGRNClass">ОГРН</label>
                        <b-form-invalid-feedback id="input-5-live-feedback">
                            <template v-if="!$v.form.OGRN.required">
                                Обязательное поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-6"
                                type="text"
                                :state="validateState('INN')"
                                v-model.trim="$v.form.INN.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-6-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-6" class="b-input-label" :class="customINNClass">ИНН</label>
                        <b-form-invalid-feedback id="input-6-live-feedback">
                            <template v-if="!$v.form.INN.required">
                                Обязательное поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-7"
                                type="text"
                                :state="validateState('KPP')"
                                v-model.trim="$v.form.KPP.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-7-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-7" class="b-input-label" :class="customKPPClass">КПП</label>
                        <b-form-invalid-feedback id="input-7-live-feedback">
                            <template v-if="!$v.form.KPP.required">
                                Обязательное поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-8"
                                type="text"
                                :state="validateState('director')"
                                v-model.trim="$v.form.director.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-8-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-8" class="b-input-label" :class="customDirectorClass">Генеральный директор</label>
                        <b-form-invalid-feedback id="input-8-live-feedback">
                            <template v-if="!$v.form.director.required">
                                Обязательное поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-9"
                                type="text"
                                :state="validateState('accountant')"
                                v-model="$v.form.accountant.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-9-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-9" class="b-input-label" :class="customAccountantClass">Бухгалтер</label>
                        <b-form-invalid-feedback id="input-9-live-feedback">
                            <template v-if="!$v.form.accountant.required">
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
                        <b-col cols="5" v-if="uploaded_files.decision">
                            <b-row class="align-items-center h-100">
                                <a download :href="uploaded_files.decision" class="pr-4 d-block">
                                    Файл
                                    загружен /
                                    Скачать файл
                                </a>
                            </b-row>
                        </b-col>
                        <b-col :cols="returnNumberCols(uploaded_files.decision)">
                            <b-row class="align-items-center h-100">
                                <b-form-file
                                        id="input-10"
                                        v-model="form.decision"
                                        :accept="mime"
                                        placeholder="Решение о создании юридического лица"
                                        class="inputpassport"
                                ></b-form-file>
                            </b-row>
                        </b-col>
                    </b-row>
                    <b-row class="pb-3">
                        <b-col cols="5" v-if="uploaded_files.egrul">
                            <b-row class="align-items-center h-100">
                                <a download :href="uploaded_files.egrul" class="pr-4 d-block">
                                    Файл
                                    загружен /
                                    Скачать файл
                                </a>
                            </b-row>
                        </b-col>
                        <b-col :cols="returnNumberCols(uploaded_files.egrul)">
                            <b-row class="align-items-center h-100">
                                <b-form-file
                                        id="input-11"
                                        v-model="form.egrul"
                                        :accept="mime"
                                        placeholder="Свидетельство о государственной регистрации, либо лист записи ЕГРЮЛ"
                                        class="inputpassport"
                                ></b-form-file>
                            </b-row>
                        </b-col>
                    </b-row>
                    <b-row class="pb-3">
                        <b-col cols="5" v-if="uploaded_files.inn">
                            <b-row class="align-items-center h-100">
                                <a download :href="uploaded_files.inn" class="pr-4 d-block">
                                    Файл
                                    загружен /
                                    Скачать файл
                                </a>
                            </b-row>
                        </b-col>
                        <b-col :cols="returnNumberCols(uploaded_files.inn)">
                            <b-row class="align-items-center h-100">
                                <b-form-file
                                        id="input-12"
                                        v-model="form.inn"
                                        :accept="mime"
                                        placeholder="Свидетельство о постановке на учёт в налоговом органе (ИНН)"
                                        class="inputpassport"
                                ></b-form-file>
                            </b-row>
                        </b-col>

                    </b-row>
                    <b-row class="pb-3">
                        <b-col cols="5" v-if="uploaded_files.svidusn">
                            <b-row class="align-items-center h-100">
                                <a download :href="uploaded_files.svidusn" class="pr-4 d-block">
                                    Файл
                                    загружен /
                                    Скачать файл
                                </a>
                            </b-row>
                        </b-col>
                        <b-col :cols="returnNumberCols(uploaded_files.svidusn)">
                            <b-row class="align-items-center h-100">
                                <b-form-file
                                        id="input-13"
                                        v-model="form.svidusn"
                                        :accept="mime"
                                        placeholder="Уведомление о применении УСН"
                                        class="inputpassport"
                                ></b-form-file>
                            </b-row>
                        </b-col>
                    </b-row>
                    <b-row class="pb-3">
                        <b-col cols="5" v-if="uploaded_files.ustav">
                            <b-row class="align-items-center h-100">
                                <a download :href="uploaded_files.ustav" class="pr-4 d-block">
                                    Файл
                                    загружен /
                                    Скачать файл
                                </a>
                            </b-row>
                        </b-col>
                        <b-col :cols="returnNumberCols(uploaded_files.ustav)">
                            <b-row class="align-items-center h-100">
                                <b-form-file
                                        id="input-14"
                                        v-model="form.ustav"
                                        :accept="mime"
                                        placeholder="Устав (все страницы) с отметкой регистрирующего органа"
                                        class="inputpassport"
                                ></b-form-file>
                            </b-row>
                        </b-col>
                    </b-row>
                    <b-row class="pb-3">
                        <b-col cols="5" v-if="uploaded_files.rukdoc">
                            <b-row class="align-items-center h-100">
                                <a download :href="uploaded_files.rukdoc" class="pr-4 d-block">
                                    Файл
                                    загружен /
                                    Скачать файл
                                </a>
                            </b-row>
                        </b-col>
                        <b-col :cols="returnNumberCols(uploaded_files.rukdoc)">
                            <b-row class="align-items-center h-100">
                                <b-form-file
                                        id="input-15"
                                        v-model="form.rukdoc"
                                        :accept="mime"
                                        placeholder="Документ, подтверждающий полномочия руководителя"
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
                                        id="input-16"
                                        v-model="form.dovdog"
                                        :accept="mime"
                                        placeholder="Доверенность, если договор подписывается представителем на её основании"
                                        class="inputpassport"
                                ></b-form-file>
                            </b-row>
                        </b-col>
                    </b-row>
                    <hr class="px-0 mx-0">
                    <b-row>
                        <h4>Контактная информация юридического лица</h4>
                    </b-row>
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-17"
                                type="text"
                                v-model="$v.form.phone.$model"
                                :state="validateState('phone')"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                @input="clearInput"
                                aria-describedby="input-11-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-17" class="b-input-label" :class="customPhoneClass">Телефон</label>
                        <b-form-invalid-feedback id="input-11-live-feedback">
                            <template
                                    v-if="!$v.form.phone.minLength||!$v.form.phone.maxLength||!$v.form.phone.numbercheck">
                                Телефон не верный, необходимо 11 символов, чтобы начиналось с 8 или +7
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-18"
                                type="email"
                                v-model="$v.form.email.$model"
                                :state="validateState('email')"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-12-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-18" class="b-input-label" :class="customEmailClass">Email</label>
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
                        <b-button type="submit" variant="primary" block class="button font-weight-bold py-2 my-4">
                            <template v-if="id">
                                Обновить данные юридического лица
                            </template>
                            <template v-else>
                                Создать юридическое лицо
                            </template>
                        </b-button>
                    </b-row>
                </b-form>
            </b-row>
        </b-overlay>
        <banklist :fiz_type="false" v-bind:face_id="id" :idAcc="idAcc" v-if="id" ref="bank"
                  :verify="$refs.verify"></banklist>
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
    import VerifyEvent from "./VerifyEvent";

    export default {
        name: "Fiz",
        data() {
            return {
                comTypeOptions: [
                    {value: 'PAO', text: 'РАО'},
                    {value: 'OOO', text: 'OOO'},
                    {value: 'ZAO', text: 'ЗАО'},
                    {value: 'IP', text: 'ИП'},
                ],
                form: {
                    law_adress_is_fact: false,
                    phone: null,
                    email: null,
                    comName: null,
                    comType: 'OOO',
                    legalAddr: null,
                    comAddr: null,
                    OGRN: null,
                    INN: null,
                    KPP: null,
                    director: null,
                    accountant: null,
                    rukdoc: null,
                    dovdog: null,
                    ustav: null,
                    svidusn: null,
                    inn: null,
                    egrul: null,
                    decision: null,
                },
                uploaded_files: {
                    rukdoc: null,
                    dovdog: null,
                    ustav: null,
                    svidusn: null,
                    inn: null,
                    egrul: null,
                    decision: null,
                },
                server_error_code: null,
                server_error_message: null,
                id: null,
                mime: settings.mime,
                show_overlay: false,
                action_text: '',
                action_title: 'Действие',
                idAcc: null,
            }
        },
        mixins: [validationMixin, validateStateMixin, validationPhone],
        components: {
            "windows": Windows,
            "optionsbar": OptionsBar,
            "banklist": BankList,
            "modalinfo": ModalInfo,
            "verifyevent": VerifyEvent
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
                comName: {
                    required,
                    server_error: function (value) {
                        if (this.server_error_code) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
                comType: {required},
                legalAddr: {required},
                comAddr: {required},
                OGRN: {
                    required,
                    numeric,
                    minLength: minLength(13),
                    maxLength: maxLength(13),
                },
                INN: {
                    required,
                    numeric,
                    minLength: minLength(10),
                    maxLength: maxLength(10),
                },
                KPP: {
                    required,
                    numeric,
                    minLength: minLength(9),
                    maxLength: maxLength(9),
                },
                director: {required},
                accountant: {required},
            }
        },
        computed: {
            customCompNameClass() {
                return {custom_b_input_label: this.form.comName}
            },
            customLegalAddrClass() {
                return {custom_b_input_label: this.form.legalAddr}
            },
            customCompAddrClass() {
                return {custom_b_input_label: this.form.comAddr}
            },
            customOGRNClass() {
                return {custom_b_input_label: this.form.OGRN}
            },
            customINNClass() {
                return {custom_b_input_label: this.form.INN}
            },
            customKPPClass() {
                return {custom_b_input_label: this.form.KPP}
            },
            customDirectorClass() {
                return {custom_b_input_label: this.form.director}
            },
            customAccountantClass() {
                return {custom_b_input_label: this.form.accountant}
            },
            customPhoneClass() {
                return {custom_b_input_label: this.form.phone}
            },
            customEmailClass() {
                return {custom_b_input_label: this.form.email}
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
            AddInput() {
                if (this.server_error_code || this.server_error_message) {
                    this.server_error_code = null;
                    this.server_error_message = null;
                }
                if (this.form.law_adress_is_fact) {
                    this.form.comAddr = this.form.legalAddr;
                }
            },
            changeCheck(value) {
                if (value) {
                    this.form.comAddr = this.form.legalAddr;
                }
                let inputValue = document.querySelector('.compAddr')
                if (this.form.comAddr.length > 1)
                    inputValue.classList.add("custom_b_input_label")
                else
                    inputValue.classList.remove("custom_b_input_label")
            },
            actionSuccess() {
                this.$router.push('/laws/');
            },
            setData(data) {
                if (data.comName) {
                    this.form.comName = data.comName;
                }
                if (data.comType) {
                    this.form.comType = data.comType;
                }
                if (data.legalAddr) {
                    this.form.legalAddr = data.legalAddr;
                }
                if (data.legalAddr && data.comAddr && data.legalAddr == data.comAddr) {
                    this.form.law_adress_is_fact = true;
                }
                if (data.comAddr) {
                    this.form.comAddr = data.comAddr;
                }
                if (data.OGRN) {
                    this.form.OGRN = data.OGRN;
                }
                if (data.INN) {
                    this.form.INN = data.INN;
                }
                if (data.KPP) {
                    this.form.KPP = data.KPP;
                }
                if (data.director) {
                    this.form.director = data.director;
                }
                if (data.accountant) {
                    this.form.accountant = data.accountant;
                }
                if (data.phone) {
                    this.form.phone = this.preparePhone(data.phone);
                }
                if (data.email) {
                    this.form.email = data.email;
                }
                if (data.rukdoc) {
                    this.form.rukdoc = data.rukdoc;
                }
                if (data.dovdog) {
                    this.form.dovdog = data.dovdog;
                }
                if (data.ustav) {
                    this.form.ustav = data.ustav;
                }
                if (data.svidusn) {
                    this.form.svidusn = data.svidusn;
                }
                if (data.inn) {
                    this.form.inn = data.inn;
                }
                if (data.egrul) {
                    this.form.egrul = data.egrul;
                }
                if (data.decision) {
                    this.form.decision = data.decision;
                }
                if (data.idAcc) {
                    this.idAcc = data.idAcc;
                }
            },
            getObject() {
                this.show_overlay = true;
                let self = this;
                this.$store.dispatch({
                    type: 'laws/get',
                    id: self.id,
                }).then(result => {
                        this.show_overlay = false;
                        if (result && !result.error) {
                            this.setData(result.result)
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
                );
                this.$store.dispatch({
                    type: 'files/get_laws_files',
                    id: self.id,
                }).then(result => {
                        if (result && !result.error) {
                            if (result.result.length > 0) {
                                let keys = Object.keys(self.uploaded_files);
                                for (let k in keys) {
                                    for (let kk in result.result) {
                                        console.log(kk, k,);
                                        if (result.result[kk].type === keys[k]) {
                                            self.uploaded_files[keys[k]] = result.result[kk].url;
                                            break
                                        }
                                    }
                                }
                                console.log("keys", keys, result.result, self.uploaded_files);
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
                this.$refs.verify.onConfirm(5, self.sendSubmit);
            },
            sendSubmit() {
                this.show_overlay = true;
                this.server_error_code = null;
                this.server_error_message = null;
                let self = this;
                let data;
                let type = 'laws/post';
                if (this.id) {
                    type = 'laws/put';
                    data = {
                        id: this.id
                    };
                    if (this.form.comName) {
                        data.comName = this.form.comName;
                    }
                    if (this.form.comType) {
                        data.comType = this.form.comType;
                    }
                    if (this.form.legalAddr) {
                        data.legalAddr = this.form.legalAddr;
                    }
                    if (this.form.comAddr) {
                        data.comAddr = this.form.comAddr;
                    }
                    if (this.form.OGRN) {
                        data.OGRN = this.form.OGRN;
                    }
                    if (this.form.INN) {
                        data.INN = this.form.INN;
                    }
                    if (this.form.KPP) {
                        data.KPP = this.form.KPP;
                    }
                    if (this.form.director) {
                        data.director = this.form.director;
                    }
                    if (this.form.accountant) {
                        data.accountant = this.form.accountant;
                    }
                    if (this.form.phone) {
                        data.phone = this.checkPhoneNumber(this.form.phone);
                    }
                    if (this.form.email) {
                        data.email = this.form.email;
                    }
                    let idAcc = this.$refs.bank.getidAcc();
                    console.log("DATA", idAcc, this.idAcc);
                    if (idAcc) {
                        data.idAcc = idAcc;
                    }
                    this.action_text = "Юридическое лицо успешно отредактирован";
                } else {
                    data = {
                        comName: this.$v.form.comName.$model,
                        comType: this.$v.form.comType.$model,
                        legalAddr: this.$v.form.legalAddr.$model,
                        comAddr: this.$v.form.comAddr.$model,
                        OGRN: this.$v.form.OGRN.$model,
                        KPP: this.$v.form.KPP.$model,
                        INN: this.$v.form.INN.$model,
                        director: this.$v.form.director.$model,
                        accountant: this.$v.form.accountant.$model,
                        phone: this.checkPhoneNumber(this.$v.form.phone.$model),
                        email: this.$v.form.email.$model,
                    };
                    this.action_text = "Юридическое лицо успешно создано";
                }
                if (this.form.rukdoc) {
                    data.rukdoc = this.form.rukdoc;
                }
                if (this.form.dovdog) {
                    data.dovdog = this.form.dovdog;
                }
                if (this.form.ustav) {
                    data.ustav = this.form.ustav;
                }
                if (this.form.svidusn) {
                    data.svidusn = this.form.svidusn;
                }
                if (this.form.inn) {
                    data.inn = this.form.inn;
                }
                if (this.form.egrul) {
                    data.egrul = this.form.egrul;
                }
                if (this.form.decision) {
                    data.decision = this.form.decision;
                }
                this.$store.dispatch({
                    type: type,
                    data: create_formdata(data),
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
        right: 10px !important;
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