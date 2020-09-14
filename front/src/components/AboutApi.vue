<template>
    <windows>
        <b-modal
                id="modal-success"
                title="Действие"
                ok-only
        >
            <p class="my-4">{{action_text}}</p>
        </b-modal>
        <b-overlay :show="show_overlay" class="col-12">
            <b-row class="py-4">
                <b-col cols="12">
                    <b-row>
                        <h3>Настройки API</h3>
                    </b-row>
                    <b-row class="my-4">
                        <b-link href="/userapi/docs">
                            Документация по Апи
                        </b-link>
                    </b-row>
                    <b-row>
                        API токен для интеграции
                    </b-row>
                    <b-row>
                        <b-link href="https://api.finship.ru/shipping/">
                            https://api.finship.ru/shipping/
                        </b-link>
                    </b-row>

                </b-col>
                <b-col class="d-flex flex-xl-row flex-lg-column flex-md-column flex-sm-column flex-column justify-content-between mt-4 pr-0"
                       cols="12" xl="7" lg="9" md="12" sm="12">
                    <b-row class="col-xl-8 px-0 mr-1">
                        <div class="b-token">
                            <p class="b-token-text">
                                <template v-if="accesstoken">
                                    {{accesstoken}}
                                </template>
                                <template v-else>
                                    Сгенерируйте новый токен
                                </template>
                            </p>
                        </div>
                    </b-row>

                    <b-row class="col-xl-4 d-flex flex-row flex-xl-column flex-lg-row
                                    justify-content-xl-start justify-content-between px-0">
                        <b-button variant="link" @click="onCopy" class="p-0 m-0 text-left"><i
                                class="fas fa-copy mr-2"></i>Скопировать
                        </b-button>
                        <input type="hidden" id="accesstoken" :value="accesstoken">
                        <b-button variant="link" @click="onGenerate" class="p-0 m-0 text-left"><i
                                class="fas fa-redo-alt mr-2"></i>Сгенерировать новый
                        </b-button>
                    </b-row>
                </b-col>
                <b-col cols="12" class="mt-4">
                    <b-row>
                        <p>API Онлайн-сервиса позволяет взаимодействовать вашим приложениям с сервисом
                            посредством REST запросов</p>
                    </b-row>
                    <b-row class="mt-4">
                        <p>
                            Онлайн-сервис базируется на открытом
                            <b-link>OpenAPI</b-link>
                            стандарет на основе
                            <b-link>JSON</b-link>
                        </p>
                    </b-row>
                </b-col>
            </b-row>
        </b-overlay>
    </windows>
</template>

<script>
    import Windows from "./Windows";
    import {bus} from "../main";

    export default {
        name: "AboutApi",
        data() {
            return {
                server_error_code: null,
                server_error_message: null,
                show_overlay: false,
                action_text: '',
                accesstoken: null,
            }
        },
        components: {
            "windows": Windows,
        },
        mounted() {
            bus.$emit("namechange", "Доступ по API")


            this.accesstoken = this.$store.getters['auth/accesstoken'];
            if (!this.accesstoken) {
                let self = this;
                this.show_overlay = true;
                this.$store.dispatch({
                    type: 'auth/gettoken',
                }).then(result => {
                        this.show_overlay = false;
                        if (result && !result.error) {
                            self.accesstoken = result.result.accesstoken;
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
            }
        },
        methods: {
            onGenerate() {
                let self = this;
                this.show_overlay = true;
                this.$store.dispatch({
                    type: 'auth/updatetoken',
                }).then(result => {
                        this.show_overlay = false;
                        if (result && !result.error) {
                            self.accesstoken = result.result.accesstoken;
                            self.action_text = "Новый токен сгенерирован";
                            self.$bvModal.show('modal-success');
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
            },
            onCopy() {
                let testingCodeToCopy = document.querySelector('#accesstoken');
                testingCodeToCopy.setAttribute('type', 'text');
                testingCodeToCopy.select();
                try {
                    let successful = document.execCommand('copy');
                    this.action_text = "Токен скопирован в буфер обмена";
                } catch (err) {
                    this.action_text = "Токен не скопирован в буфер обмена";
                }
                this.$bvModal.show('modal-success');
                testingCodeToCopy.setAttribute('type', 'hidden');
                window.getSelection().removeAllRanges();
            },
        },
    }
</script>


<style lang="scss">
    @import "./src/assets/scss/styles.scss";

    .b-token {
        display: flex;
        justify-content: flex-start;
        align-items: center !important;
        padding-left: 20px;
        margin-bottom: 20px;
        width: 100%;
        height: 50px;
        background: #C8C8C8;
        border-bottom: 2px solid #5D5D5D;
        overflow: hidden;
    }

    .b-token-text {
        color: #000000;
        opacity: .6;
        margin: 0 20px 0 0;
    }
</style>