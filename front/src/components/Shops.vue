<template>
    <windows>
        <optionsbar></optionsbar>
        <b-overlay :show="show_overlay" class="col-12">
            <modalinfo :action_success="actionSuccess" :action_text="action_text"
                       :action_title="action_title"></modalinfo>
            <verifyevent ref="verify"></verifyevent>
            <b-row class="py-4">
                <b-col cols="12" class="col-xl-8">
                    <b-row>
                        <h3>
                            <template v-if="id">
                                Изменить магазин
                            </template>
                            <template v-else>
                                <div class="">
                                    <h3>Добавление магазина</h3>
                                    <p style="font-size: 16px;">Вы можете зарегистрировать неограниченное количество
                                        магазинов внутри главного аккаунта (мультиаккаунта). К каждому магазину вы
                                        можете привязать неограниченное количество юридических или физических лиц.
                                        Каждый магазин будет иметь свои индивидуальные настройки. Можно разделить или
                                        объединить балансы.
                                        Авторизация в сервисе будет осуществляться через учетные записи главного
                                        аккаунта (мультиаккаунта) или доверенных лиц.</p>
                                </div>
                            </template>
                        </h3>
                    </b-row>
                </b-col>
                <b-form @submit.stop.prevent="onSubmit" class="col-12 col-lg-8 col-xl-6">
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-1"
                                type="text"
                                :state="validateState('name')"
                                v-model.trim="$v.form.name.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                required
                                aria-describedby="input-1-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-1" class="b-input-label" :class="customNameClass">Название магазина</label>
                        <span class="small-text-gray" style="font-size: 12px;">Данное название будет использоваться системой</span>
                        <b-form-invalid-feedback id="input-1-live-feedback">
                            <template v-if="!$v.form.name.required">
                                Обязательное поле
                            </template>
                            <template v-else-if="server_error_message&&!server_error_message['url']">
                                {{server_error_message}}
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-2"
                                type="text"
                                :state="validateState('url')"
                                v-model.trim="$v.form.url.$model"
                                @input="clearInput"
                                required
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-2-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-2" class="b-input-label" :class="customURLClass">URL</label>
                        <span class="small-text-gray" style="font-size: 12px;">Адрес сайта или группы в социальной сети через который ведутся продажи</span>
                        <b-form-invalid-feedback id="input-2-live-feedback">
                            <template v-if="!$v.form.url.required">
                                Обязательное поле
                            </template>
                            <template v-else-if="server_error_message&&server_error_message['url']">
                                Неправильный url
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="form-group pb-3">
                        <label for="input-3" class="font-weight-bold" style="font-size: 12px;">Основное юридическое лицо
                            магазина</label>
                        <b-form-select
                                v-model="form.id_1c_laws"
                                :options="laws_options"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        >
                        </b-form-select>
                        <span class="small-text-gray" style="font-size: 12px;">Выбранное юридическое лицо по умолчанию подставляется в расчётах и операциях.
                            Но вы всегда можете указать другое юридическое лицо</span>
                    </b-row>
                    <b-row class="pb-3">
                        <label for="input-3" class="font-weight-bold" style="font-size: 12px;">Основное физическое лицо
                            магазина</label>
                        <b-form-select
                                v-model="form.id_1c_fiz"
                                :options="fiz_options"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        >
                        </b-form-select>
                        <span class="small-text-gray" style="font-size: 12px;">
                            Выбранное физическое лицо по умолчанию подставляется в расчётах и операциях.
                                Но вы всегда можете указать другое физическое лицо
                        </span>
                    </b-row>
                    <b-row cols="12" class="px-0 col-xl-5">
                        <b-button type="submit" variant="primary" block class="py-xl-3 py-lg-3 my-xl-4 my-lg-4 button">
                            <template v-if="id">
                                Обновить данные магазина
                            </template>
                            <template v-else>
                                Добавить магазин
                            </template>
                        </b-button>
                    </b-row>
                </b-form>
            </b-row>
        </b-overlay>
    </windows>
</template>

<script>
    import {bus} from "../main"
    import {validationMixin} from "vuelidate";
    import validateStateMixin from "../mixins/validationState";
    import Windows from "./Windows";
    import OptionsBar from "./OptionsBar";
    import {required} from "vuelidate/lib/validators";
    import ModalInfo from "./ModalInfo";
    import VerifyEvent from "./VerifyEvent";

    export default {
        name: "Shops",
        data() {
            return {
                form: {
                    name: null,
                    url: null,
                    id_1c_laws: null,
                    id_1c_fiz: null,
                },

                server_error_code: null,
                server_error_message: null,
                id: null,
                show_overlay: false,
                action_text: '',
                action_title: 'Действие',
                fiz_options: [
                    {value: null, text: 'ФИО'},
                    {value: null, text: 'asdasdasd'}
                ],
                laws_options: [
                    {value: null, text: 'Название Юр. лица + ИНН (необязательно)'},
                    {value: null, text: 'asdasd'},
                ],
            }
        },
        mixins: [validationMixin, validateStateMixin],
        components: {
            "windows": Windows,
            "optionsbar": OptionsBar,
            "modalinfo": ModalInfo,
            "verifyevent": VerifyEvent
        },
         computed: {
            customNameClass() {
                return {custom_b_input_label: this.form.name}
            },
            customURLClass() {
                return {custom_b_input_label: this.form.url}
            }
        },
        mounted() {
            bus.$emit("createshops", true);
            let params = this.$route.params;
            if (params && params.id) {
                this.getListAll();
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
                name: {
                    required,
                    server_error: function (value) {
                        if (this.server_error_code && !this.server_error_message['url']) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
                url: {
                    required,
                    server_error: function (value) {
                        if (this.server_error_code && this.server_error_message['url']) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
            }
        },
        methods: {
            actionSuccess() {
                this.$router.push('/shops/');
            },
            setData(data) {
                if (data.name) {
                    this.form.name = data.name;
                }
                if (data.url) {
                    this.form.url = data.url;
                }
                if (data.id_1c_fiz) {
                    this.form.id_1c_fiz = data.id_1c_fiz;
                }
                if (data.id_1c_laws) {
                    this.form.id_1c_laws = data.id_1c_laws;
                }
            },
            getObject() {
                this.show_overlay = true;
                let self = this;
                this.$store.dispatch({
                    type: 'shops/get',
                    id: self.id,
                }).then(result => {
                        this.show_overlay = false;
                        if (result && !result.error) {
                            this.setData(result);
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
            getListAll() {
                let self = this;
                let countget = 0;
                this.$store.dispatch({
                    type: 'laws/list',
                }).then(result => {
                        countget += 1;
                        if (result && !result.error) {
                            if (result.result && result.result.length > 0) {
                                for (let k in result.result) {
                                    result.result[k]["value"] = result.result[k]["id"];
                                    result.result[k]["text"] = result.result[k]["comName"] + result.result[k]["INN"];
                                }
                                self.laws_options = result.result;
                            }
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
                    type: 'fiz/list',
                }).then(result => {
                        countget += 1;
                        if (result && !result.error) {
                            if (result.result && result.result.length > 0) {
                                for (let k in result.result) {
                                    result.result[k]["value"] = result.result[k]["id"];
                                    result.result[k]["text"] = result.result[k]["firstName"] + " " + result.result[k]["lastName"] + " " + result.result[k]["patronymic"];
                                }
                                self.fiz_options = result.result;
                            }
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
                this.$refs.verify.onConfirm(3, self.sendSubmit);
            },
            sendSubmit() {
                this.show_overlay = true;
                this.server_error_code = null;
                this.server_error_message = null;
                let payload;
                let self = this;
                let data;
                let type = 'shops/post';
                let url = this.form.url;
                if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
                    url = "https://" + url;
                }
                if (this.id) {
                    type = 'shops/put';
                    data = {
                        url: url,
                    };
                    if (this.form.name) {
                        data.name = this.form.name;
                    }
                    if (this.form.id_1c_fiz) {
                        data.id_1c_fiz = this.form.id_1c_fiz;
                    }
                    if (this.form.id_1c_laws) {
                        data.id_1c_laws = this.form.id_1c_laws;
                    }
                    payload = {
                        type: type,
                        data: data,
                        id: this.id,
                    };
                    this.action_text = "Магазин успешно отредактирован";
                } else {
                    data = {
                        id: this.face_id,
                        name: this.$v.form.name.$model,
                        url: url,
                    };
                    if (this.form.id_1c_fiz) {
                        data.id_1c_fiz = this.form.id_1c_fiz;
                    }
                    if (this.form.id_1c_laws) {
                        data.id_1c_laws = this.form.id_1c_laws;
                    }
                    payload = {
                        type: type,
                        data: data,
                    };
                    this.action_text = "Магазин успешно создан";
                }
                this.$store.dispatch(payload).then(result => {
                        this.show_overlay = false;
                        if (result && !result.error) {
                            self.$bvModal.show('modal-success');
                        } else {
                            console.log("print", result);
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
    .custom_b_input_label {
        top: 5px !important;
        color: #6202ee !important;
        font-size: 12px !important;
    }
</style>