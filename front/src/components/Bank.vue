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
                                Изменить счет банка
                            </template>
                            <template v-else>
                                Создать банковский счет
                            </template>
                        </h3>
                    </b-row>
                </b-col>
                <b-form @submit.stop.prevent="onSubmit" class="col-12 col-lg-10 col-xl-8">
                    <b-row class="pb-3">
                        <label for="input-1">Название счета (метка/пояснение):</label>
                        <b-form-input
                                d="input-1"
                                type="text"
                                placeholder="Название счета (метка/пояснение)"
                                required
                                :state="validateState('accName')"
                                v-model.trim="$v.form.accName.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-1-live-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-1-live-feedback">
                            <template v-if="!$v.form.accName.required">
                                Обязательное поле
                            </template>
                            <template v-else-if="!$v.form.accName.numeric">
                                Только цифры
                            </template>
                            <template v-else-if="server_error_message">
                                {{server_error_message}}
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="pb-3">
                        <label for="input-2">Расчетный счета:</label>
                        <b-form-input
                                id="input-2"
                                type="text"
                                placeholder="Введите Имя"
                                required
                                :state="validateState('rs')"
                                v-model.trim="$v.form.rs.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-2-live-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-2-live-feedback">
                            <template v-if="!$v.form.rs.required">
                                Обязательное поле
                            </template>
                            <template v-else-if="!$v.form.rs.numeric">
                                Только цифры
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="pb-3">
                        <label for="input-4">БИК:</label>
                        <b-form-input
                                id="input-4"
                                type="text"
                                placeholder="БИК"
                                required
                                :state="validateState('bic')"
                                v-model.trim="$v.form.bic.$model"
                                @input="checkbik"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-4-live-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-4-live-feedback">
                            <template v-if="!$v.form.bic.required">
                                Обязательное поле
                            </template>
                            <template v-else-if="!$v.form.bic.numeric||!$v.form.bic.minLength||!$v.form.bic.maxLength">
                                Неправильный бик
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="pb-3">
                        <label for="input-3">Кореспондетский счет:</label>
                        <b-form-input
                                id="input-3"
                                type="text"
                                placeholder="Кореспондетский счет"
                                required
                                :state="validateState('ks')"
                                v-model.trim="$v.form.ks.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-3-live-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-3-live-feedback">
                            <template v-if="!$v.form.ks.required">
                                Обязательное поле
                            </template>
                            <template v-else-if="!$v.form.ks.numeric">
                                Только цифры
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="pb-3">
                        <label for="input-5">Название банка:</label>
                        <b-form-input
                                id="input-5"
                                type="text"
                                placeholder="Название банка"
                                required
                                :state="validateState('bankName')"
                                v-model.trim="$v.form.bankName.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-5-live-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-5-live-feedback">
                            <template v-if="!$v.form.bankName.required">
                                Обязательное поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row>
                        <b-button type="submit" variant="primary" block class="my-4">
                            <template v-if="id">
                                Обновить данные банковского счета
                            </template>
                            <template v-else>
                                Создать банковский счет
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
    import {numeric, required, minLength, maxLength} from "vuelidate/lib/validators";
    import {get_item} from "../store/storage";
    import ModalInfo from "./ModalInfo";
    import VerifyEvent from "./VerifyEvent";

    export default {
        name: "Bank",
        data() {
            return {
                form: {
                    rs: null,
                    ks: null,
                    bic: null,
                    bankName: null,
                    accName: null,
                },
                server_error_code: null,
                server_error_message: null,
                id: null,
                show_overlay: false,
                action_text: '',
                fiz_type: null,
                action_title: 'Действие',
                face_id: null,
            }
        },
        mixins: [validationMixin, validateStateMixin],
        components: {
            "windows": Windows,
            "optionsbar": OptionsBar,
            "modalinfo": ModalInfo,
            "verifyevent": VerifyEvent
        },
        created() {
            let params = this.$route.params;
            if (params && params.id) {
                let ob = get_item("BANK_ID_STORAGE_KEY");
                this.fiz_type = ob.fiz_type;
                this.face_id = ob.face_id;
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
                rs: {
                    required,
                    numeric
                },
                ks: {
                    required,
                    numeric
                },
                bic: {
                    required,
                    numeric,
                    minLength: minLength(9),
                    maxLength: maxLength(9),
                },
                bankName: {
                    required,
                },
                accName: {
                    required,
                }
            }
        },
        methods: {
            checkbik() {
                if (this.server_error_code || this.server_error_message) {
                    this.server_error_code = null;
                    this.server_error_message = null;
                }
                if (!this.$v.form.bic.$anyError) {
                    let self = this;
                    this.$store.dispatch({
                        type: 'info/get_bik',
                        bic: this.$v.form.bic.$model,
                    }).then(result => {
                            if (result && !result.error) {
                                self.form.ks = result.result["ks"];
                                self.form.bankName = result.result["bankName"].replace(/&quot;/g, '\\"');
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
                }
            },
            actionSuccess() {
                let path = '';
                if (this.fiz_type) {
                    path += '/fiz/';
                } else {
                    path += '/laws/';
                }
                path += this.face_id + "/";
                this.$router.push(path);
            },
            setData(data) {
                if (data.rs) {
                    this.form.rs = data.rs;
                }
                if (data.ks) {
                    this.form.ks = data.ks;
                }
                if (data.bic) {
                    this.form.bic = data.bic;
                }
                if (data.accName) {
                    this.form.accName = data.accName;
                }
                if (data.bankName) {
                    this.form.bankName = data.bankName;
                }
                this.face_id = data.face_id;
                this.fiz_type = data.fiz_type;
            },
            getObject() {
                this.show_overlay = true;
                let self = this;
                this.$store.dispatch({
                    type: 'bank/get',
                    id: self.id,
                }).then(result => {
                        this.show_overlay = false;
                        if (result && !result.error) {
                            this.setData(result.result);
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
                this.$refs.verify.onConfirm(6, self.sendSubmit);
            },
            sendSubmit() {
                this.show_overlay = true;
                this.server_error_code = null;
                this.server_error_message = null;
                let self = this;
                let data;
                let type = 'bank/post';
                if (this.id) {
                    type = 'bank/put';
                    data = {
                        id: this.id
                    };
                    if (this.form.rs) {
                        data.rs = this.form.rs;
                    }
                    if (this.form.ks) {
                        data.ks = this.form.ks;
                    }
                    if (this.form.bic) {
                        data.bic = this.form.bic;
                    }
                    if (this.form.accName) {
                        data.accName = this.form.accName;
                    }
                    if (this.form.bankName) {
                        data.bankName = this.form.bankName;
                    }
                    this.action_text = "Банковский счет успешно отредактирован";
                } else {
                    data = {
                        id: this.face_id,
                        rs: this.$v.form.rs.$model,
                        ks: this.$v.form.ks.$model,
                        bic: this.$v.form.bic.$model,
                        accName: this.$v.form.accName.$model,
                        bankName: this.$v.form.bankName.$model,
                    };
                    this.action_text = "Банковский счет успешно создан";
                }
                this.$store.dispatch({
                    type: type,
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
            }
        },
    }
</script>