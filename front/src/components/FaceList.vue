<template>
    <windows>
        <optionsbar></optionsbar>
        <b-overlay :show="show_overlay" class="col-12">
            <modalconfirm :action_text="action_text" :action_success="action_success"
                          :action_title="action_title"></modalconfirm>
            <verifyevent ref="verify"></verifyevent>
            <b-row class="py-4">
                <b-col cols="12">
                    <b-row class="jflex-xl-row flex-lg-row flex-md-column flex-sm-column flex-column justify-content-xl-between justify-content-lg-between flex-wrap mb-2">
                        <b-col class="d-flex justify-content-start align-items-center px-0 mb-2 mb-xl-0 mb-lg-0 mb-md-3 mb-2">
                            <h3>
                                <template v-if="fiz_type">
                                    Информация о физических лицах
                                </template>
                                <template v-else>
                                    Информация о юридических лицах
                                </template>
                            </h3>
                        </b-col>
                        <b-col class="d-flex justify-content-xl-end justify-content-lg-end justify-content-md-start align-items-center
                               px-0 mb-0 mb-xl-0 mb-lg-0 mb-md-3 mb-2">
                            <b-button class="d-flex align-items-center
                                         py-3 px-4 bg-white text-dark font-weight-bolder" style="border-color: #DFE0EB;"
                                      @click="addRow">
                                <template v-if="fiz_type">
                                    <i class="fa fa-plus mr-3" style="font-size: 18px;"></i>
                                    Добавить физ.лицо
                                </template>
                                <template v-else>
                                    <i class="fa fa-plus mr-3" style="font-size: 18px;"></i>
                                    Добавить юр.лицо
                                </template>
                            </b-button>
                        </b-col>

                    </b-row>
                    <b-row>
                        <b-table responsive hover :items="data_list" :fields="fields" class="fiztable">
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
    import {create_formdata, set_item} from "../store/storage";
    import Windows from "./Windows";
    import OptionsBar from "./OptionsBar";
    import {bus} from "../main";
    import Vue from 'vue';
    import ModalConfirm from "./ModalConfirm";
    import VerifyEvent from "./VerifyEvent";

    export default {
        name: "FizList",
        data() {
            return {
                data_list: [],
                fields: [],
                show_overlay: false,
                server_error_code: null,
                server_error_message: null,
                fiz_type: null,
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
        watch: {
            $route(to, from) {
                this.checkPath();
            }
        },
        created() {
            this.checkPath();
            window.addEventListener('resize', this.onResize)
        },
        mounted() {
            bus.$emit("namechange", "Настройка")
        },
        methods: {
            checkRow(index) {
                if (this.data_list[index].stat == "Block") {
                    return true;
                } else {
                    return false;
                }
            },
            addBank(index) {
                set_item("BANK_ID_STORAGE_KEY", {"face_id": this.data_list[index].id, "fiz_type": this.fiz_type});
                this.$router.push('/bank/create/');
            },
            checkPath() {
                if (this.$route.path == "/fiz/") {
                    this.fiz_type = true;
                    this.getList();
                    this.fields = [
                        {
                            key: 'stat',
                            label: 'Статус',
                            sortable: true
                        },
                        {
                            key: 'fio',
                            label: 'ФИО',
                            sortable: true
                        },
                        {
                            key: 'INN',
                            label: 'ИНН',
                            sortable: true
                        },
                        {
                            key: 'action',
                            label: '',
                        },
                    ];
                } else {
                    if (this.$route.path == "/laws/") {
                        this.fiz_type = false;
                        this.getList();
                        this.fields = [
                            {
                                key: 'stat',
                                label: 'Статус',
                                sortable: true
                            },
                            {
                                key: 'comName',
                                label: 'Организация',
                                sortable: true
                            },
                            {
                                key: 'INN',
                                label: 'ИНН',
                                sortable: true
                            },
                            {
                                key: 'action',
                                label: 'Действия',
                            },
                        ];
                    }
                }
            },
            sendStatus(index, stat) {
                let type;
                let keystatus;
                if (this.fiz_type) {
                    type = 'fiz/put';
                    keystatus = "natStatus";

                } else {
                    type = 'laws/put';
                    keystatus = "comStatus";
                }
                let data = {
                    id: this.data_list[index].id
                };
                data[keystatus] = stat;
                let self = this;
                this.stat = stat;
                this.$store.dispatch({
                    type: type,
                    data: create_formdata(data)
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
                if (this.fiz_type) {
                    this.$router.push('/fiz/create/');
                } else {
                    this.$router.push('/laws/create/');
                }
            },
            editRow(index) {
                let ob = this.data_list[index];
                if (this.fiz_type) {
                    this.$router.push({path: `/fiz/${ob.id}`});
                } else {
                    this.$router.push({path: `/laws/${ob.id}`});
                }

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
                let type_confirmation = 5;
                if (this.fiz_type) {
                    type_confirmation = 4;
                }
                this.$refs.verify.onConfirm(4, function () {
                    self.sendStatus(index, status)
                });
            },
            getList() {
                this.show_overlay = true;
                let type;
                if (this.fiz_type) {
                    type = 'fiz/list';
                } else {
                    type = 'laws/list';
                }
                let self = this;
                this.$store.dispatch({
                    type: type,
                }).then(result => {
                        this.show_overlay = false;
                        if (result && !result.error) {
                            if (self.fiz_type) {
                                for (let k = 0; k < result.result.length; k++) {
                                    result.result[k]['fio'] = result.result[k]["firstName"] + " " + result.result[k]["lastName"] + " " + result.result[k]["patronymic"];
                                }
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
            },
            initials(str) {
                if(str === undefined)
                    return '';
                else
                    return str.split(/\s+/).map((w,i) => i ? w.substring(0,1).toUpperCase() + '.' : w).join(' ');
            },
            onResize() {
                let count = 0
                let d = document.querySelectorAll("td[aria-colindex='2']");
                if (window.innerWidth < 800) {
                    d.forEach((i) => {
                        let a = this.initials(i.innerText)
                        i.innerText = a
                    })
                }
            }
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResize)
        },
    }
</script>
<style lang="scss">
    .disablestyle {
        background: none;
        border: none;
    }
</style>