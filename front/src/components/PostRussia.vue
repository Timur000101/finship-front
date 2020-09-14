<template>
    <windows>
        <b-overlay :show="show_overlay" class="col-12">
            <modalinfo :action_success="actionSuccess" :action_text="action_text"
                       :action_title="action_title"></modalinfo>
            <b-row class="py-0 py-xl-4 py-lg-4 py-md-4 py-sm-3 px-2 px-xl-0 px-lg-0 px-md-0 px-sm-0">
                <b-col cols="12" class="col-xl-8">
                    <b-row>
                        <h3>
                            <template v-if="id">
                                Изменить подключение к почте России
                            </template>
                            <template v-else>
                                Подключение к Почте России
                            </template>
                        </h3>
                    </b-row>
                    <b-row>
                        <p>
                            Вы можете предоставить доступ к вашему API Онлайн-сервиса «Отправка» Почты Росси и тогда мы
                            сможем предоставлять вам детальную аналитику по всем вашим текущим отправлениям.
                        </p>
                    </b-row>
                </b-col>
                <b-form @submit.stop.prevent="onSubmit" class="col-12 col-lg-10 col-xl-5">
                    <b-row class="form-group pb-3">
                        <b-form-input
                                d="input-1"
                                type="text"
                                required
                                :state="validateState('login')"
                                v-model.trim="$v.form.login.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-1-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-1" class="b-input-label">Логин</label>
                        <span class="small-text-gray" style="font-size: 12px;">Логин для доступа к API Онлайн-сервиса «Отправка»</span>
                        <b-form-invalid-feedback id="input-1-live-feedback">
                            <template v-if="!$v.form.login.required">
                                Обязательное поле
                            </template>
                            <template v-else-if="server_error_message">
                                {{server_error_message}}
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-2"
                                type="password"
                                required
                                :state="validateState('password')"
                                v-model="$v.form.password.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-2-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-2" class="b-input-label">Пароль</label>
                        <span class="small-text-gray" style="font-size: 12px;">Пароль для доступа к API Онлайн-сервиса «Отправка»</span>
                        <b-form-invalid-feedback id="input-2-live-feedback">
                            <template v-if="!$v.form.password.required">
                                Пароль обязателен.
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="form-group pb-3">
                        <b-form-input
                                id="input-3"
                                type="text"
                                required
                                :state="validateState('accesstoken')"
                                v-model.trim="$v.form.accesstoken.$model"
                                @input="clearInput"
                                readonly
                                onfocus="this.removeAttribute('readonly')"
                                aria-describedby="input-3-live-feedback"
                                class="border-left-0 border-top-0 border-right-0 b-input"
                        ></b-form-input>
                        <label for="input-3" class="b-input-label">Access Token</label>
                        <span class="small-text-gray" style="font-size: 12px;">Токен авторизации приложения</span>
                        <b-form-invalid-feedback id="input-3-live-feedback">
                            <template v-if="!$v.form.accesstoken.required">
                                Обязательное поле
                            </template>
                        </b-form-invalid-feedback>
                    </b-row>
                    <b-row class="col-xl-5 col-lg-5 col-md-5 col-sm-6 col-8 px-0">
                        <b-button type="submit" block class="py-3 mb-4 font-weight-bold button">
                            <template v-if="id">
                                Обновить подключение к почте России
                            </template>
                            <template v-else>
                                Добавить
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
    import {minLength, required, maxLength} from "vuelidate/lib/validators";
    import ModalInfo from "./ModalInfo";

    export default {
        name: "PostRussia",
        data() {
            return {
                form: {
                    login: null,
                    password: null,
                    accesstoken: null,
                },
                server_error_code: null,
                server_error_message: null,
                contains_number: false,
                contains_uppercase: false,
                contains_lowercase: false,
                id: null,
                show_overlay: false,
                action_text: '',
                action_title: 'Действие',
            }
        },
        mixins: [validationMixin, validateStateMixin],
        components: {
            "windows": Windows,
            "modalinfo": ModalInfo
        },
        created() {
            let params = this.$route.params;
            if (params && params.id) {
                if (params.id != "create") {
                    this.$router.push("/");
                }
            } else {
                this.$router.push("/");
            }
        },
        validations: {
            form: {
                login: {
                    required,
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
                },
                accesstoken: {
                    required,
                },
            }
        },
        methods: {
            actionSuccess() {
                this.$router.push('/postrussia/');
            },
            onSubmit() {
                this.show_overlay = true;
                this.server_error_code = null;
                this.server_error_message = null;
                let self = this;
                let data;
                let type = 'postrussia/post';
                this.$v.form.$touch();
                if (this.$v.form.$anyError) {
                    this.show_overlay = false;
                    return;
                }
                data = {
                    login: this.$v.form.login.$model,
                    password: this.$v.form.password.$model,
                    accesstoken: this.$v.form.accesstoken.$model,
                };
                this.action_text = "Подключение успешно создано";
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

<style lang="scss">
    @import "./src/assets/scss/styles.scss";
</style>