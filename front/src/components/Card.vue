<template>
    <windows>
        <optionsbar></optionsbar>
        <b-overlay :show="show_overlay" class="col-12">
            <b-modal
                    id="modal_iframe"
                    class="modal"
                    centered
                    size="lg"
                    title="Добавление карты"
                    ok-only
                    @ok="actionSuccess"
            >
                        <iframe :src="cardurl" ref="cardiframe" width="700" height="250"></iframe>
            </b-modal>
            <modalinfo :action_success="actionSuccess" :action_text="action_text"
                       :action_title="action_title"></modalinfo>
            <verifyevent ref="verify"></verifyevent>
            <b-row class="py-4">
                <b-col cols="12">
                    <b-row>
                        <h3>
                            <template v-if="id">
                                Изменить карточный счет
                            </template>
                            <template v-else>
                                Создать карточный счет
                            </template>
                        </h3>
                    </b-row>
                </b-col>
                <b-form @submit.stop.prevent="onSubmit" class="col-12 col-lg-10 col-xl-8">
                    <b-row class="pb-3">
                        <label for="input-1">Название:</label>
                        <b-form-input
                                id="input-1"
                                type="text"
                                placeholder="Название"
                                :state="validateState('name')"
                                v-model.trim="$v.form.name.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-1-live-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-1-live-feedback">
                            <template v-if="!$v.form.name.required">
                                Обязательное поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="pb-3">
                        <label for="input-2">Дневной лимит вывода средств:</label>
                        <b-form-input
                                id="input-2"
                                type="text"
                                placeholder="Дневной лимит"
                                :state="validateState('dailyLimit')"
                                v-model.trim="$v.form.dailyLimit.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-2-live-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-2-live-feedback">
                            <template v-if="!$v.form.dailyLimit.required">
                                Обязательное поле
                            </template>
                            <template v-else-if="!$v.form.dailyLimit.numeric">
                                Требуется число
                            </template>
                            <template v-else-if="!$v.form.monthlyLimit.between">
                                Минимум 100 Максимум 100000000
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="pb-3">
                        <label for="input-3">Ежемесячный лимит вывода средств:</label>
                        <b-form-input
                                id="input-3"
                                type="text"
                                placeholder="Ежемесячный лимит"
                                :state="validateState('monthlyLimit')"
                                v-model.trim="$v.form.monthlyLimit.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-3-live-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-3-live-feedback">
                            <template v-if="!$v.form.monthlyLimit.required">
                                Обязательное поле
                            </template>
                            <template v-else-if="!$v.form.monthlyLimit.numeric">
                                Только цифры
                            </template>
                            <template v-else-if="!$v.form.monthlyLimit.between">
                                Минимум 100 Максимум 100000000
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row>
                        <b-button type="submit" variant="primary" block class="my-4">
                            <template v-if="id">
                                Обновить данные карточного счета
                            </template>
                            <template v-else>
                                Создать карточный счет
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
    import {numeric, required, minLength, maxLength,between} from "vuelidate/lib/validators";
    import {get_item} from "../store/storage";
    import ModalInfo from "./ModalInfo";
    import VerifyEvent from "./VerifyEvent";

    export default {
        name: "Card",
        data() {
            return {
                form: {
                    dailyLimit: null,
                    monthlyLimit: null,
                    name: null,
                },
                server_error_code: null,
                server_error_message: null,
                id: null,
                show_overlay: false,
                action_text: '',
                action_title: 'Действие',
                face_id: null,
                testtext: '',
                cardurl: null,
                user_id: null,

            }
        },
        mixins: [validationMixin, validateStateMixin],
        components: {
            "windows": Windows,
            "optionsbar": OptionsBar,
            "modalinfo": ModalInfo,
            "verifyevent": VerifyEvent,
        },
        mounted() {
            let params = this.$route.params;
            this.user_id = this.$store.getters['auth/user_id'];
            if (params && params.id) {
                let ob = get_item("CARD_ID_STORAGE_KEY");
                if (ob) {
                    this.face_id = ob.face_id;
                }
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
                name: {required},
                dailyLimit: {
                    required,
                    numeric,
                    between: between(100,100000000),
                },
                monthlyLimit: {
                    required,
                    numeric,
                    between: between(100,100000000),
                },
            }
        },
        methods: {
            actionSuccess() {
                let path = '/fiz/';
                path += this.face_id + "/";
                this.$router.push(path);
            },
            setData(data) {
                if (data.name) {
                    this.form.name = data.name;
                }
                if (data.dailyLimit) {
                    this.form.dailyLimit = data.dailyLimit;
                }
                if (data.monthlyLimit) {
                    this.form.monthlyLimit = data.monthlyLimit;
                }
                this.face_id = data.face_id;
            },
            getObject() {
                this.show_overlay = true;
                let self = this;
                this.$store.dispatch({
                    type: 'card/get',
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
                this.$refs.verify.onConfirm(9, self.sendSubmit);
            },
            sendSubmit() {
                this.show_overlay = true;
                this.server_error_code = null;
                this.server_error_message = null;
                let self = this;
                let data;
                let type = 'card/post';
                if (this.id) {
                    type = 'card/put';
                    data = {
                        ind_id_1c: this.id,
                        description: "Update card",
                        user_id: this.user_id
                    };
                    if (this.form.name) {
                        data.name = this.form.name;
                    }
                    if (this.form.dailyLimit) {
                        data.dailyLimit = this.form.dailyLimit;
                    }
                    if (this.form.monthlyLimit) {
                        data.monthlyLimit = this.form.monthlyLimit;
                    }
                    this.action_text = "Карточный счет успешно отредактирован";
                } else {
                    data = {
                        ind_id_1c: this.face_id,
                        name: this.$v.form.name.$model,
                        dailyLimit: this.$v.form.dailyLimit.$model,
                        monthlyLimit: this.$v.form.monthlyLimit.$model,
                        description: "Add card",
                        user_id: this.user_id
                    };
                    this.action_text = "Карточный счет успешно создан, счет появится через 10 минут";
                }

                this.$store.dispatch({
                    type: type,
                    data: data,
                }).then(result => {
                        this.show_overlay = false;
                        if (result && !result.error) {
                            self.cardurl = result.url;
                            self.$bvModal.show('modal_iframe');
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
</style>

