<template>
    <windows>
        <optionsbar></optionsbar>
        <b-overlay :show="show_overlay" class="col-12">
            <modalconfirm :action_text="action_text" :action_success="action_success"
                          :action_title="action_title"></modalconfirm>
            <verifyevent ref="verify"></verifyevent>
            <b-row class="py-4">
                <b-col cols="12">
                    <b-row class="flex-xl-row flex-lg-row flex-md-column flex-sm-column flex-column justify-content-xl-between justify-content-lg-between flex-wrap mb-2">
                        <b-col class="d-flex justify-content-start align-items-center px-0 mb-2 mb-xl-0 mb-lg-0 mb-md-3 mb-2">
                            <h3>Доверенные лица</h3>
                        </b-col>
                        <b-col class="d-flex justify-content-xl-end justify-content-lg-end justify-content-md-start align-items-center
                               px-0 mb-0 mb-xl-0 mb-lg-0 mb-md-3 mb-2">
                            <b-button class="d-flex align-items-center
                                         py-3 px-4 bg-white text-dark font-weight-bolder" style="border-color: #DFE0EB;"
                                      @click="addRow">
                                <i class="fa fa-plus mr-3" style="font-size: 18px;"></i>
                                Добавить Доверенное лицо
                            </b-button>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-table hover :items="data_list" :fields="fields" class="permission_table">
                            <template v-slot:cell(action)="row">
                                <b-row class="justify-content-around">
                                    <button
                                            @click="blockRow(row.index)"
                                            class="disablestyle">
                                        <template v-if="data_list[row.index]['stat']==='Block'">
                                            <i class="fas fa-lock-open mr-2" style="color: #6BBF59;"></i>
                                            <span class="button-title font-weight-bold" style="color: #6BBF59;">Разблокировать</span>
                                        </template>
                                        <template v-else>
                                            <i class="fas fa-lock mr-2" style="color: #99A6B7;"></i>
                                            <span сlass="button-title font-weight-bold" style="color: #99A6B7">Заблокировать</span>
                                        </template>
                                    </button>
                                    <button @click="editRow(row.index)" class="disablestyle">
                                        <i class="fas fa-pencil-alt mr-2" style="color: #1976D2;"></i>
                                        <span class="button-title font-weight-bold" style="color: #1976D2;">Редактировать</span>
                                    </button>
                                    <button @click="deleteRow(row.index)" class="disablestyle">
                                        <i class="fas fa-trash mr-2" style="color: red;"></i>
                                        <span class="button-title font-weight-bold" style="color: red;">Удалить</span>
                                    </button>
                                </b-row>

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
    import Vue from "vue";
    import ModalConfirm from "./ModalConfirm";
    import VerifyEvent from "./VerifyEvent";

    export default {
        name: "PermissionList",
        data() {
            return {
                data_list: [],
                show_overlay: false,
                server_error_code: null,
                server_error_message: null,
                action_success: null,
                action_text: null,
                action_title: '',
                fields: [
                    {
                        key: "stat",
                        label: 'Статус',
                        sortable: true
                    },
                    {
                        key: 'fio',
                        label: 'ФИО',
                        sortable: true
                    },
                    {
                        key: 'comment',
                        label: 'Описание',
                        sortable: true
                    },
                    {
                        key: 'action',
                        label: 'Действия',
                    },
                ],
            }
        },
        components: {
            "windows": Windows,
            "optionsbar": OptionsBar,
            "modalconfirm": ModalConfirm,
            "verifyevent": VerifyEvent
        },
        mounted() {
            bus.$emit("namechange", "Магазины");
            this.getList();
        },
        methods: {
            sendStatus(index, stat) {
                let data = {
                    stat: stat
                };
                let self = this;
                this.stat = stat;
                this.$store.dispatch({
                    type: 'permission/put',
                    data: data,
                    id: this.data_list[index].id,
                }).then(result => {
                        if (result && !result.error) {
                            if (self.stat == "Del") {
                                self.data_list.splice(index, 1);
                            } else {
                                let ob = self.data_list[index];
                                ob.stat = self.stat;
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
                this.$router.push('/permission/create/');
            },
            editRow(index) {
                let ob = this.data_list[index];
                this.$router.push({path: `/permission/${ob.id}`});
            },
            deleteRow(index) {
                this.action_text = "Удалить лицо";
                this.action_title = "Удалить";
                let self = this;
                this.action_success = function () {
                    self.onConfirm(index, "Del");
                };
                this.$bvModal.show('modal-confirm');
            },
            blockRow(index) {
                if (this.data_list[index]['stat'] == 'Block') {
                    this.onConfirm(index, "New");
                } else {
                    this.onConfirm(index, "Block");
                }
            },
            onConfirm(param_index, params_status) {
                let self = this;
                let index = param_index;
                let status = params_status;
                this.$refs.verify.onConfirm(2, function () {
                    self.sendStatus(index, status)
                });
            },
            getList() {
                this.show_overlay = true;
                let self = this;
                this.$store.dispatch({
                    type: 'permission/list',
                }).then(result => {
                        this.show_overlay = false;
                        if (result && !result.error) {
                            for (let k = 0; k < result.result.length; k++) {
                                result.result[k]['fio'] = result.result[k]["firstName"] + " " + result.result[k]["lastName"] + " " + result.result[k]["patronymic"];
                            }
                            self.data_list = result.result;
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