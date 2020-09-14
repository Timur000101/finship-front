<template>
    <windows>
        <optionsbar></optionsbar>
        <b-overlay :show="show_overlay" class="col-12">
            <modalconfirm :action_text="action_text" :action_success="action_success"
                          :action_title="action_title"></modalconfirm>
            <verifyevent ref="verify"></verifyevent>
            <b-row class="py-4">
                <b-col cols="12" class="pr-0 pr-xl-3 pr-lg-3 pr-md-3 pr-sm-2">
                    <b-row class="flex-xl-row flex-lg-row flex-md-column flex-sm-column flex-column justify-content-xl-between justify-content-lg-between flex-wrap
                            mb-2">
                        <b-col class="d-flex justify-content-start align-items-center px-0 mb-2 mb-xl-0 mb-lg-0 mb-md-3 mb-2">
                            <h3 class="m-0">Информация о ваших магазинах</h3>
                        </b-col>
                        <b-col class="d-flex justify-content-xl-end justify-content-lg-end justify-content-md-start align-items-center
                               px-0 mb-0 mb-xl-0 mb-lg-0 mb-md-3 mb-2">
                            <b-button class="d-flex align-items-center
                                         py-3 px-4 bg-white text-dark font-weight-bolder" style="border-color: #DFE0EB;"
                                      @click="addRow">
                                <i class="fa fa-plus mr-3" style="font-size: 18px;"></i>
                                Добавить магазин
                            </b-button>
                        </b-col>
                    </b-row>
                    <b-row class="col-xl-9 col-lg-9 col-md-11 col-sm-12 px-0">
                        <b-table class="shopstable" hover :items="data_list" :fields="fields" head-variant="light"
                                 @row-clicked="(item, index, event)=>myHandler(item)">
                            <template v-slot:cell(action)="row">
                                <b-row class="justify-content-around">
                                    <button @click="editRow(row.index)" class="disablestyle" style="color: #1976D2;">
                                        <i class="fas fa-pencil-alt mr-2" style="color: #1976D2;"></i>
                                        <span class="button-title">Редактировать</span>
                                    </button>
                                    <button @click="deleteRow(row.index)" class="disablestyle" style="color: red;">
                                        <i class="fas fa-trash mr-2" style="color: red;"></i>
                                        <span class="button-title">Удалить</span>
                                    </button>
                                </b-row>
                            </template>
                            <template v-slot:row-details="row">
                                <b-col class="p-0">
                                    <div>
                                        <div class="drp_title">
                                            Юридические лица магазина
                                        </div>
                                        <div class="form-group">
                                            <b-form-select
                                                    v-model="form.id_1c_laws"
                                                    :options="laws_options"
                                                    class="border-left-0 border-top-0 border-right-0 b-input"
                                            ></b-form-select>
                                            <i class="fas fa-sort-down"
                                               style="position:absolute; top: 20px; right: 20px;"></i>
                                        </div>
                                    </div>
                                    <div class="mt-3">
                                        <div class="drp_title">Физические лица магазина</div>
                                        <div class="form-group">
                                            <b-form-select
                                                    v-model="form.id_1c_fiz"
                                                    :options="fiz_options"
                                                    class="border-left-0 border-top-0 border-right-0 b-input"
                                            ></b-form-select>
                                            <i class="fas fa-sort-down"
                                               style="position:absolute; top: 20px; right: 20px;"></i>
                                        </div>
                                    </div>
                                </b-col>
                            </template>
                        </b-table>
                    </b-row>
                </b-col>
            </b-row>
        </b-overlay>
    </windows>
</template>
<script>
    import {bus} from "../main"
    import Windows from "./Windows";
    import OptionsBar from "./OptionsBar";
    import ModalConfirm from "./ModalConfirm";
    import VerifyEvent from "./VerifyEvent";
    import {set_item, get_item} from "../store/storage";

    export default {
        name: "ShopsList",
        data() {
            return {
                data_list: [],
                fields: [
                    {
                        key: 'name',
                        label: 'Название',
                        sortable: true,
                    },
                    {
                        key: 'url',
                        label: 'URL',
                        sortable: true
                    },
                    {
                        key: 'action',
                        label: '',
                    },
                ],
                /////////////////////
                fiz_options: [
                ],
                laws_options: [
                ],
                form: {
                    id_1c_laws: null,
                    id_1c_fiz: null,
                },
                /////////////////////////
                show_overlay: false,
                server_error_code: null,
                server_error_message: null,
                action_success: null,
                action_text: '',
                action_title: '',
            }
        },
        components: {
            "windows": Windows,
            "optionsbar": OptionsBar,
            "modalconfirm": ModalConfirm,
            "verifyevent": VerifyEvent
        },
        created() {
            this.getList();
        },
        mounted() {
            bus.$emit("namechange", "Настройка");
            let status_registration = this.$store.getters['auth/status_registration'];
            let google = get_item("GOOGLE_AUTHENTICATOR_WINDOW");
            if (status_registration != 3 && !google) {
                let self = this;
                this.action_text = "Подключить Google Authenticator";
                this.action_title = "Google Authenticator";
                set_item("GOOGLE_AUTHENTICATOR_WINDOW", true);
                this.action_success = function () {
                    self.$refs.verify.onConfirm(null, function () {
                        console.log("Activate Google");
                    });

                };
                this.$bvModal.show('modal-confirm');
            }
        },
        methods: {
            myHandler(id) {
                id._showDetails = !id._showDetails
            },
            addRow() {
                this.$store.commit('shops/sethidden', true)
                this.$router.push('/shops/create/');
                // localStorage.setItem("hidden", false)
            },
            editRow(index) {
                let id = this.data_list[index].id;
                this.$router.push({path: `/shops/${id}`});
            },
            deleteRow(index) {
                this.action_text = "Удалить магазин";
                this.action_title = "Удалить";
                let self = this;
                this.action_success = function () {
                    self.$refs.verify.onConfirm(3, function () {
                        self.$store.dispatch({
                            type: 'shops/delete',
                            id: self.data_list[index].id
                        }).then(result => {
                                if (result && !result.error) {
                                    self.data_list.splice(index, 1);
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
                    });

                };
                this.$bvModal.show('modal-confirm');
            },
            getList() {
                let self = this;
                this.$store.dispatch({
                    type: 'shops/list',
                    id: this.face_id
                }).then(result => {
                        if (result && !result.error) {
                            self.data_list = result;
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
        }
    }
</script>
<style lang="scss">
    @import "./src/assets/scss/styles.scss";

    .disablestyle {
        background: none;
        border: none;
    }

    .drp_title {
        padding: 0 0 5px 5px;
    }

    .drp {
        width: 100%;
    }

    .drp button {
        text-align: left;
    }

    .drp button:after {
        text-align: right;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 10px;
    }
</style>