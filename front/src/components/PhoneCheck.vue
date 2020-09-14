<template>
    <b-row class="justify-content-center py-3 px-3 mx-0 h-auto overflow-auto back" style="min-height: 100vh;">
        <b-col cols="12" md="8" lg="7" xl="4"
               class="d-flex flex-column align-items-center my-auto px-xl-2 px-lg-5 px-md-5 px-sm-5 py-5 bg-white b-card-radius">
            <b-row class="justify-content-center mb-3 px-3">
                <h3 class="font-weight-normal text-center">Подтверждение номера телефона</h3>
            </b-row>
            <b-row class="justify-content-center px-xl-5">
                <b-form class="col-12 mx-auto">
                    <b-row class="form-group">
                        <b-form-input
                                id="input-7"
                                type="text"
                                v-model.trim="$v.form.phone.$model"
                                :state="validateState('phone')"
                                :disabled="checked"
                                aria-describedby="input-7-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 mb-3 b-input"
                        ></b-form-input>
                        <label for="input-7" class="b-input-label">Телефон</label>
                        <b-form-invalid-feedback id="input-7-live-feedback" class="mb-3">
                            <template
                                    v-if="!$v.form.phone.minLength||!$v.form.phone.maxLength||!$v.form.phone.numbercheck">
                                Телефон не верный, необходимо 11 символов, чтобы начиналось с 8 или +7
                            </template>
                            <template v-else-if="server_error_message">
                                {{server_error_message}}
                            </template>
                        </b-form-invalid-feedback>
                        <b-form-checkbox v-model="checked" name="check-button" size="lg" switch
                                         @change="onPhoneWindow">
                            <p class="small-text m-0 mt-1">Подтвердить</p>
                        </b-form-checkbox>
                    </b-row>
                    <b-row class="d-flex justify-content-center align-items-center flex-column flex-xl-row flex-lg-row flex-md-row flex-sm-row">
                        <b-col class="d-flex flex-column justify-content-center mt-4 mr-xl-3 mr-lg-3 mr-md-3 mr-sm-3 mr-0 p-0">
                            <b-form-group>
                                <b-form-input
                                        id="input-1"
                                        type="text"
                                        v-model.trim="$v.modal_form_phone.code.$model"
                                        :state="validateStateFormName('code','modal_form_phone')"
                                        aria-describedby="modal-input-2-feedback"
                                        @input="onSubmitPhone"
                                        required
                                        class="border-left-0 border-top-0 border-right-0 b-input"
                                ></b-form-input>
                                <label for="input-1" class="font-weight-bold b-input-label">Код из СМС</label>
                                <b-form-invalid-feedback id="modal-input-2-feedback">
                                    <template
                                            v-if="!$v.modal_form_phone.code.required||!$v.modal_form_phone.code.minLength||!$v.modal_form_phone.code.maxLength">
                                        Неправильный код
                                    </template>
                                    <template v-else-if="server_error_code==1">
                                        Код неверный
                                    </template>
                                </b-form-invalid-feedback>
                            </b-form-group>
                        </b-col>
                        <b-col class="d-flex flex-column justify-content-center text-center px-0 text-xl-left text-lg-left text-md-left text-sm-left">
                            <b-link @click="sendNewSms" :disabled="timers.sms_timer.isRunning">Отправить смс заново
                            </b-link>
                            <template>
                                <p class="m-0 p-0 small-text-gray">
                                    Через {{timer_seconds}} секунд
                                </p>
                            </template>
                        </b-col>
                    </b-row>
                </b-form>
                <bar></bar>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import {validationMixin} from "vuelidate";
    import validateStateMixin from "../mixins/validationState";
    import {maxLength, minLength, required} from "vuelidate/lib/validators";
    import {mixin as VueTimers} from 'vue-timers';
    import validationPhone from "../mixins/validationPhone";

    export default {
        name: "PhoneCheck",
        data() {
            return {
                form: {
                    'phone': null,
                },
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
                checked: false,
                freeze: false,
            }
        },
        timers: {
            sms_timer: {repeat: true, time: 1000}
        },
        mixins: [validationMixin, validateStateMixin, VueTimers, validationPhone],
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
                    server_error: function (value) {
                        if (this.server_error_code) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
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
            let phone = this.$store.getters['auth/phone'];
            this.form.phone = this.preparePhone(phone);
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
                this.freeze = true;
                this.server_error_code = null;
                this.server_error_message = null;
                let self = this;
                let data = {
                    "phone": this.checkPhoneNumber(this.$v.form.phone.$model),
                };
                this.$store.dispatch({
                    type: 'auth/phone_verify',
                    data: data
                }).then(result => {
                        this.freeze = false;
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
                        //self.$bvModal.show('modal_phone');
                    }
                )
            },
            onPhoneWindow(value) {
                if (value) {
                    this.$v.form.$touch();
                    if (this.$v.form.$anyError && !this.freeze) {
                        return;
                    }
                    this.sendNewSms();
                }
            },
            onSubmitPhone() {
                let self = this;
                this.server_error_code = null;
                this.server_error_message = null;
                this.$v.modal_form_phone.$touch();
                if (this.$v.modal_form_phone.$anyError && !this.freeze) {
                    return;
                }
                this.freeze = true;
                let data = {
                    "code": this.$v.modal_form_phone.code.$model,
                };
                this.$store.dispatch({
                    type: 'auth/phone_check',
                    data: data
                }).then(result => {
                        this.freeze = false;
                        if (result && !result.error) {
                            self.$router.push("/");
                        } else {
                            if (result && result.error_code) {
                                self.server_error_code = result.error_code;
                            }
                            if (result && result.error) {
                                self.server_error_message = result.error;
                            }
                            this.$v.modal_form_phone.$touch();
                        }
                    }
                )
            },
        }
    }
</script>

<style lang="scss">
    @import "./src/assets/scss/styles.scss";

    @media (max-width: 576px) {
        .back {
            background: none;
        }
    }
</style>
