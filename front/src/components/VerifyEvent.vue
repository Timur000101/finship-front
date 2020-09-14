<template>
    <b-modal
            id="modal_confirm"
            :title="title"
            hide-footer
            no-close-on-backdrop
    >
        <b-overlay :show="show_overlay" class="col-12">
            <b-row>
                <b-form class="col-12">
                    <template v-if="show_google">
                        <b-row v-if="show_qr" class="pb-3">
                            <b-form-checkbox v-model="key_qrcode" switch class="my-5" @input="checkChange">
                                <template v-if="!key_qrcode">
                                    Вы выбрали QRCODE ! Выбрать выбрать использовать ключ ?
                                </template>
                                <template v-else>
                                    Вы выбрали ключ ? Выбрать QRCODE ?
                                </template>
                            </b-form-checkbox>
                            <h4>
                                <template v-if="!key_qrcode">
                                    Просканируйте QRCODE&nbsp;
                                </template>
                                <template v-else>
                                    Введите ключ&nbsp;
                                </template>
                                в программе Google Authenticator на Android или IOS, затем вставьте код
                                в поле ниже, "ВНИМАНИЕ ДЛЯ КОРРЕКТНОЙ РАБОТЫ ПРИЛОЖЕНИЯ Google Authenticator
                                СИНХРОНИЗИРУЙТЕ
                                ДАТУ И ВРЕМЯ С СЕТЬЮ, ЗАЙДИТЕ В НАСТРОЙКИ ВАШЕГО ТЕЛЕФОНА И ПОСТАВЬТЕ ГАЛОЧКИ
                            </h4>
                            <template v-if="!key_qrcode">
                                <qrcode v-if="qrcode" :value="qrcode" :options="{ width: 200 }"></qrcode>
                            </template>
                            <template v-else>
                                <div>Ключ: {{key}}</div>
                            </template>
                        </b-row>
                        <b-row>
                            FINSHIP.RU ({{email}})
                        </b-row>
                        <b-row class="pb-3">
                            <label for="modal-input-1">Введите код:</label>
                            <b-form-input
                                    id="modal-input-1"
                                    type="text"
                                    placeholder="Введите код"
                                    v-model="$v.modal_form_google.token.$model"
                                    :state="validateStateFormName('token','modal_form_google')"
                                    @input="onSubmitGoogle"
                                    aria-describedby="modal-input-1-feedback"
                            ></b-form-input>
                            <b-form-invalid-feedback id="modal-input-1-feedback">
                                <template
                                        v-if="!$v.modal_form_google.token.minLength||!$v.modal_form_google.token.maxLength||!$v.modal_form_google.token.integer||!$v.modal_form_google.token.required">
                                    Неправильный код
                                </template>
                                <template v-if="server_error_code==1">
                                    Код неверный
                                </template>
                            </b-form-invalid-feedback>
                        </b-row>
                    </template>
                    <template v-else>
                        <b-row class="pb-3">
                            <label for="modal-input-2">Введите код:</label>
                            <b-form-input
                                    id="modal-input-2"
                                    type="text"
                                    placeholder="Введите код"
                                    v-model="$v.modal_form_phone.code.$model"
                                    :state="validateStateFormName('code','modal_form_phone')"
                                    readonly
                                    onfocus="this.removeAttribute('readonly')"
                                    @input="onSubmitPhone"
                                    aria-describedby="modal-input-2-feedback"
                            ></b-form-input>
                            <b-form-invalid-feedback id="modal-input-2-feedback">
                                <template
                                        v-if="!$v.modal_form_phone.code.integer||!$v.modal_form_phone.code.required||!$v.modal_form_phone.code.minLength||!$v.modal_form_phone.code.maxLength">
                                    Неправильный код
                                </template>
                                <template v-else-if="server_error_code==1">
                                    Код неверный
                                </template>
                            </b-form-invalid-feedback>
                        </b-row>
                        <b-row class="py-3">
                            <b-button block variant="warning" @click="sendNewSms"
                                      :disabled="timers.sms_timer.isRunning">
                                <template v-if="timers.sms_timer.isRunning">
                                    Выслать новое sms можно через {{timer_seconds}} секунд
                                </template>
                                <template v-else>
                                    Выслать новое sms с кодом
                                </template>
                            </b-button>
                        </b-row>
                    </template>
                    <b-row>
                        <b-button block @click="$bvModal.hide('modal_confirm')">Закрыть</b-button>
                    </b-row>
                </b-form>
            </b-row>
        </b-overlay>
    </b-modal>
</template>

<script>
    import {validationMixin} from "vuelidate";
    import validateStateMixin from "../mixins/validationState";
    import {integer, maxLength, minLength, required} from "vuelidate/lib/validators";
    import {mixin as VueTimers} from 'vue-timers';
    import VueQrcode from '@chenfengyuan/vue-qrcode';

    export default {
        name: "VerifyEvent",
        //props: ['type_confirmation', 'method_confirm'],
        data() {
            return {
                modal_form_phone: {
                    "code": null,
                    server_error: function (value) {
                        if (this.server_error_code) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
                timer_seconds: 60,
                end_date: null,
                start_date: null,
                server_error_code: null,
                server_error_message: null,
                show_overlay: false,
                modal_form_google: {
                    'token': null,
                },
                qrcode: null,
                key: null,
                key_qrcode: false,
                show_google: false,
                title: '',
                show_qr: true,
            }
        },

        timers: {
            sms_timer: {repeat: true, time: 1000}
        },
        components: {
            "qrcode": VueQrcode,
        },
        mixins: [validationMixin, validateStateMixin, VueTimers],
        validations: {
            modal_form_google: {
                token: {
                    required,
                    integer,
                    minLength: minLength(6),
                    maxLength: maxLength(6),
                    server_error: function (value) {
                        if (this.server_error_code) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
            },
            modal_form_phone: {
                code: {
                    required,
                    minLength: minLength(4),
                    maxLength: maxLength(4),
                    server_error: function (value) {
                        if (this.server_error_code) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
            },
        },
        mounted() {
            this.email = this.$store.getters['auth/email'];
        },
        methods: {
            dateAdd(date, interval, units) {
                if (!(date instanceof Date))
                    return undefined;
                var ret = new Date(date); //don't change original date
                var checkRollover = function () {
                    if (ret.getDate() != date.getDate()) ret.setDate(0);
                };
                switch (String(interval).toLowerCase()) {
                    case 'year'   :
                        ret.setFullYear(ret.getFullYear() + units);
                        checkRollover();
                        break;
                    case 'quarter':
                        ret.setMonth(ret.getMonth() + 3 * units);
                        checkRollover();
                        break;
                    case 'month'  :
                        ret.setMonth(ret.getMonth() + units);
                        checkRollover();
                        break;
                    case 'week'   :
                        ret.setDate(ret.getDate() + 7 * units);
                        break;
                    case 'day'    :
                        ret.setDate(ret.getDate() + units);
                        break;
                    case 'hour'   :
                        ret.setTime(ret.getTime() + units * 3600000);
                        break;
                    case 'minute' :
                        ret.setTime(ret.getTime() + units * 60000);
                        break;
                    case 'second' :
                        ret.setTime(ret.getTime() + units * 1000);
                        break;
                    default       :
                        ret = undefined;
                        break;
                }
                return ret;
            },
            sms_timer() {
                this.start_date = new Date();
                if (this.end_date >= this.start_date) {
                    this.timer_seconds = Math.floor((this.end_date.getTime() - this.start_date.getTime()) / 1000);
                } else {
                    this.$timer.stop('sms_timer');
                    this.start_date = null;
                    this.end_date = null;
                    this.timer_seconds = 60;
                }
            },
            sendNewSms() {
                this.server_error_code = null;
                this.server_error_message = null;
                this.show_google = false;
                let self = this;
                let payload = {};
                let data = {};
                if (this.type_confirmation && this.type_confirmation > 0) {
                    data.type_confirmation = this.type_confirmation;
                    payload.type = 'auth/create_confirm';
                } else {
                    payload.type = 'auth/phone_verify';
                    data.phone = this.phone;
                }
                payload.data = data;
                this.title = "Подтверждение через смс";
                this.freeze = true;
                self.$bvModal.show('modal_confirm');
                this.$store.dispatch(payload).then(result => {
                        self.freeze = false;
                        if (result.error && result.seconds) {
                            self.end_date = self.dateAdd(new Date(), 'second', Math.floor(result.seconds));
                        }
                        if (!self.timers.sms_timer.isRunning) {
                            if (self.end_date == null) {
                                self.start_date = new Date();
                                if (!self.end_date) {
                                    self.end_date = self.dateAdd(self.start_date, 'minute', 1);
                                }
                            }
                            self.$timer.start("sms_timer");
                        }
                        self.$bvModal.show('modal_confirm');
                    }
                )
            },
            onSubmitPhone() {
                this.server_error_code = null;
                this.server_error_message = null;
                this.$v.modal_form_phone.$touch();
                if (this.$v.modal_form_phone.$anyError && !this.freeze) {
                    return;
                }
                let self = this;
                let payload = {};
                let data = {
                    "code": this.$v.modal_form_phone.code.$model,
                };
                if (this.type_confirmation && this.type_confirmation > 0) {
                    data.type_confirmation = this.type_confirmation;
                    payload.type = 'auth/check_confirm';
                } else {
                    payload.type = 'auth/phone_check';
                }
                payload.data = data;
                this.freeze = true;
                this.$store.dispatch(payload).then(result => {
                        self.freeze = false;
                        self.modal_form_phone.code = null;
                        if (result && !result.error) {
                            self.$bvModal.hide('modal_confirm');
                            self.method_confirm();
                        } else {
                            if (result && result.error_code) {
                                self.server_error_code = result.error_code;
                            }
                            if (result && result.error) {
                                self.server_error_message = result.error;
                            }
                            self.$v.modal_form_phone.$touch();
                        }
                    }
                )
            },
            getSecret() {
                const regex = /secret=(\w+)/g;
                let m;
                while ((m = regex.exec(this.qrcode)) !== null) {
                    // This is necessary to avoid infinite loops with zero-width matches
                    if (m.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }
                    this.key = m[1];
                }
            },
            checkChange() {
                if (this.key_qrcode) {
                    this.getSecret();
                }
            },

            onConnectGoogle() {
                this.show_google = true;
                this.server_error_code = null;
                this.server_error_message = null;
                let self = this;
                let payload = {};
                this.title = "Подтверждение в Google Authenticator";
                if (this.type_confirmation && this.type_confirmation > 0) {
                    payload.data = {
                        type_confirmation: this.type_confirmation,
                    };
                    payload.type = 'auth/create_confirm';
                } else {
                    payload.type = 'auth/authenticator_create';
                }
                this.show_overlay = true;
                self.$bvModal.show('modal_confirm');
                this.$store.dispatch(payload).then(result => {
                        self.show_overlay = false;
                        if (result && !result.error) {
                            if (self.show_qr) {
                                self.qrcode = result.data;
                                if (self.key_qrcode) {
                                    self.getSecret();
                                }
                            }
                        }
                    }
                )
            },
            onConfirm(type_confirmation, method_confirm, phone) {
                if (type_confirmation) {
                    let confirmation = type_confirmation;
                    this.type_confirmation = confirmation;
                }
                if (method_confirm) {
                    this.method_confirm = method_confirm;
                }
                if (phone) {
                    let phonenew = phone;
                    this.phone = phonenew;
                }
                let status_registration = this.$store.getters['auth/status_registration'];
                if (this.type_confirmation) {
                    if (status_registration === 3) {
                        this.show_qr = false;
                        this.onConnectGoogle();
                    } else {
                        this.sendNewSms();
                    }
                } else {
                    if (!phone) {
                        this.type_confirmation = 7;
                        this.show_qr = true;
                        let self = this;
                        let method = method_confirm;
                        this.method_confirm = function () {
                            self.type_confirmation = null;
                            self.method_confirm = method;
                            self.onConnectGoogle();
                        };
                    }
                    this.sendNewSms();
                }

            },
            onSubmitGoogle() {
                let self = this;

                this.server_error_code = null;
                this.server_error_message = null;
                this.$v.modal_form_google.$touch();
                if (this.$v.modal_form_google.$anyError) {
                    return;
                }
                let payload = {};
                let data = {
                    token: this.$v.modal_form_google.token.$model,
                };
                if (this.type_confirmation && this.type_confirmation > 0) {
                    data.type_confirmation = this.type_confirmation;
                    payload.type = 'auth/check_confirm';
                } else {
                    payload.type = 'auth/authenticator_verify';

                }
                payload.data = data;
                this.show_overlay = true;
                this.$store.dispatch(payload).then(result => {
                        self.show_overlay = false;
                        self.modal_form_google.token = null;
                        if (result && !result.error) {
                            self.$bvModal.hide('modal_confirm');
                            self.method_confirm();
                        } else {
                            self.server_error_code = result.error_code;
                            self.$v.modal_form_google.$touch();
                        }
                    }
                );

            },
        }
    }
</script>