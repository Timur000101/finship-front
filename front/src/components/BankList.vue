<template>
    <b-overlay :show="show_overlay" class="col-12">
        <modalconfirm :action_text="action_text" :action_success="action_success"
                      :action_title="action_title"></modalconfirm>
        <b-row class="py-4">
            <b-col cols="12">
                <b-row class="justify-content-between mb-4">
                    <b-col class="d-flex justify-content-start align-items-center px-0 mb-2 mb-xl-0 mb-lg-0 mb-md-3 mb-2">
                        <h3>
                            Список банковских счетов
                        </h3>
                    </b-col>
                    <b-col class="d-flex justify-content-xl-end justify-content-lg-end justify-content-md-start align-items-center
                               px-0 mb-0 mb-xl-0 mb-lg-0 mb-md-3 mb-2">
                        <b-button class="d-flex align-items-center
                                         py-3 px-5 bg-white text-dark font-weight-bolder" style="border-color: #DFE0EB;"
                                  @click="addRow">
                            <template v-if="fiz_type">
                                <i class="fa fa-plus mr-3" style="font-size: 18px;"></i>
                                Добавить счет
                            </template>
                            <template v-else>
                                <i class="fa fa-plus mr-3" style="font-size: 18px;"></i>
                                Добавить счет
                            </template>
                        </b-button>
                    </b-col>
                </b-row>
                <b-row>
                    <b-table hover :items="data_list" :key="accStatus" :fields="fields">
                        <template v-slot:cell(action)="row">
                            <b-row class="justify-content-around">
                                <button @click="editRow(row.index)" class="disablestyle">
                                    <i class="fas fa-edit fa-2x"></i>
                                </button>
                                <button
                                        @click="blockRow(row.index)"
                                        class="disablestyle">
                                    <i v-if="data_list.length>0&&data_list[row.index]['accStatus']=='Block'"
                                       class="fas fa-lock-open fa-2x"></i>
                                    <i v-else class="fas fa-lock fa-2x"></i>
                                </button>
                                <button @click="deleteRow(row.index)" class="disablestyle">
                                    <i class="fas fa-trash fa-2x"></i>
                                </button>
                                <button
                                        @click="selectId(row.index)"
                                        class="disablestyle"
                                        :disabled="checkSelect(row.index)"
                                >
                                    <i class="fas fa-check-circle" :class="checkActiveIndex(row.index)"></i>
                                </button>
                            </b-row>

                        </template>
                    </b-table>
                </b-row>
                <b-row>
                </b-row>
            </b-col>

        </b-row>
    </b-overlay>
</template>
<script>
    import Vue from "vue";
    import {create_formdata, set_item} from "../store/storage";
    import ModalConfirm from "./ModalConfirm";

    export default {
        name: "BankList",
        props: ['fiz_type', 'face_id', 'idAcc', 'verify'],
        data() {
            return {
                data_list: [],
                fields: [
                    {
                        key: 'accStatus',
                        label: 'Статус',
                        sortable: true
                    },
                    {
                        key: 'accName',
                        label: 'Название счета',
                        sortable: true
                    },
                    {
                        key: 'rs',
                        label: 'P/C',
                        sortable: true
                    },
                    {
                        key: 'ks',
                        label: 'K/C',
                        sortable: true
                    },
                    {
                        key: 'bic',
                        label: 'БИК',
                        sortable: true
                    },
                    {
                        key: 'bankName',
                        label: 'Название банка',
                    },
                    {
                        key: 'action',
                        label: 'Действия',
                    },
                ],
                show_overlay: false,
                server_error_code: null,
                server_error_message: null,
                fiz_type: null,
                active_index: null,
                accidset: true,
                action_success: null,
                action_text: '',
                action_title: '',

            }
        },
        components: {
            "modalconfirm": ModalConfirm,
        },
        watch: {
            $route(to, from) {
                this.checkPath();
            },
            idAcc: function (value) {
                this.checkidAcc(value);
            },
            data_list: function (value) {
                this.checkidAcc(value);
            },
        },
        mounted() {
            this.checkPath();
        },
        methods: {
            getidAcc() {
                return this.idAcc;
            },
            checkidAcc(value) {
                let self = this;
                if (self.idAcc && self.data_list.length > 0 && self.accidset) {
                    for (let i = 0; i < self.data_list.length; i++) {
                        if (self.data_list[i].accId == self.idAcc) {
                            self.active_index = i;
                            self.accidset = false;
                            break
                        }
                    }
                }
            },
            checkActiveIndex(index) {
                if (index != null && index == this.active_index) {
                    return 'text-success';
                } else {
                    return '';
                }
            },
            selectId(index) {
                if (index != null) {
                    this.active_index = index;
                    this.idAcc = this.data_list[index].accId;
                    this.sendaccId();
                }
            },
            checkRow(index) {
                if (index != null && this.data_list[index].accStatus == "Block") {
                    return true;
                } else {
                    return false;
                }
            },
            checkSelect(index) {
                if (index != null && (this.data_list[index].accStatus == "Block" || (this.active_index && index == this.active_index))) {
                    return true;
                } else {
                    return false;
                }
            },
            checkPath() {
                if ((this.$route.path.startsWith("/fiz/") && this.$route.path !== "/fiz/create/") ||
                    (this.$route.path.startsWith("/laws/") && this.$route.path !== "/laws/create/")) {
                    this.getList();
                }
            },
            sendaccId() {
                let self = this;
                this.verify.onConfirm(6, function () {
                    let data = {
                        id: self.face_id,
                        idAcc: self.idAcc
                    };
                    let type;
                    if (self.fiz_type) {
                        type = "fiz/put";
                    } else {
                        type = "laws/put";
                    }
                    self.$store.dispatch({
                        type: type,
                        data: create_formdata(data),
                    });
                });
            },
            sendStatus(index, stat) {
                let data = {
                    id: this.data_list[index].accId,
                    accStatus: stat
                };
                let type = 'bank/put';
                let self = this;
                this.stat = stat;
                this.$store.dispatch({
                    type: type,
                    data: data
                }).then(result => {
                        if (result && !result.error) {
                            if (self.stat == "Del") {
                                self.data_list.splice(index, 1);
                            } else {
                                let ob = self.data_list[index];
                                ob.accStatus = self.stat;
                                Vue.set(self.data_list, index, ob);
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
            addRow() {
                set_item("BANK_ID_STORAGE_KEY", {"face_id": this.face_id, "fiz_type": this.fiz_type});
                this.$router.push('/bank/create/');
            },
            editRow(index) {
                let ob = this.data_list[index];
                set_item("BANK_ID_STORAGE_KEY", {"face_id": this.face_id, "fiz_type": this.fiz_type});
                this.$router.push({path: `/bank/${ob.accId}`});
            },
            deleteRow(index) {
                this.action_title = "Удалить";
                this.action_text = "Удалить счет";
                let self = this;
                this.action_success = function () {
                    self.onConfirmStatus(index, "Del");
                };
                this.$bvModal.show('modal-confirm');
            },
            blockRow(index) {
                if (this.data_list[index]['accStatus'] == 'Block') {
                    this.onConfirmStatus(index, "New");
                } else {
                    this.onConfirmStatus(index, "Block");
                }
            },
            onConfirm(type_confirmation, method_function) {
                let type = type_confirmation;
                let method = method_function;
                this.verify.onConfirm(type, method);
            },
            onConfirmStatus(param_index, params_status) {
                let self = this;
                let index = param_index;
                let status = params_status;
                this.verify.onConfirm(6, function () {
                    self.sendStatus(index, status)
                });
            },
            getList() {
                this.show_overlay = true;
                let self = this;
                this.$store.dispatch({
                    type: 'bank/list',
                    id: this.face_id
                }).then(result => {
                        self.show_overlay = false;
                        if (result && !result.error) {
                            if (result.result) {
                                self.data_list = result.result;
                            } else {
                                self.data_list = [];
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
            }
        }
    }
</script>
<style>
    .disablestyle {
        background: none;
        border: none;
    }
</style>