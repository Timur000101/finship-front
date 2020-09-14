<template>
    <windows>
        <b-overlay :show="show_overlay" class="col-12">
            <modalconfirm :action_text="action_text" :action_success="action_success"
                          :action_title="action_title"></modalconfirm>
            <b-row class="py-4">
                <b-col cols="12" class="col-xl-10 col-lg-10 col-md-12 col-sm-12">
                    <b-row>
                        <b-table hover :items="data_list" :fields="fields" class="posttable">
                            <template v-slot:cell(action)="row">
                                <b-row class="justify-content-around">
                                    <button @click="deleteRow(row.index)" class="disablestyle">
                                        <i class="fas fa-trash" style="color: red;"></i>
                                    </button>
                                </b-row>

                            </template>
                        </b-table>
                    </b-row>
                    <b-row>
                        <b-button variant="primary" @click="addRow" class="py-3 px-5 mb-4 font-weight-bold button">
                            Добавить
                        </b-button>
                    </b-row>
                </b-col>

            </b-row>
        </b-overlay>
    </windows>
</template>
<script>
    import Windows from "./Windows";
    import ModalConfirm from "./ModalConfirm";
    import {bus} from "../main";

    export default {
        name: "PostRussiaList",
        data() {
            return {
                data_list: [],
                show_overlay: false,
                server_error_code: null,
                server_error_message: null,
                fields: [
                    {
                        key: 'active',
                        label: 'Статус',
                        sortable: true
                    },
                    {
                        key: 'accesstoken',
                        label: 'AccessToken',
                        sortable: true
                    },
                    {
                        key: 'orgname',
                        label: 'Организация',
                        sortable: true
                    },
                    {
                        key: 'orginn',
                        label: 'ИНН',
                        sortable: true
                    },
                    {
                        key: 'active',
                        label: 'Статус',
                        sortable: true
                    },
                    {
                        key: 'action',
                        label: '',
                    },
                ],
                action_success: null,
                action_text: '',
                action_title: ''
            }
        },
        components: {
            "windows": Windows,
            "modalconfirm": ModalConfirm
        },
        mounted() {
            this.getList();
            bus.$emit("namechange", "Доступ по API")
        },
        methods: {
            addRow() {
                this.$router.push({path: `/postrussia/create/`});
            },
            deleteRow(index) {
                this.action_title = "Удалить";
                this.action_text = "Удалить счет";
                let self = this;
                this.action_success = function () {
                    self.$store.dispatch({
                        type: 'postrussia/delete',
                        id: self.data_list[index].accesstoken
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
                };
                this.$bvModal.show('modal-confirm');
            },
            getList() {
                let self = this;
                this.$store.dispatch({
                    type: 'postrussia/list',
                }).then(result => {
                        if (result && !result.error) {
                            self.data_list = result.result;
                            console.log("print", result.result);
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
</style>