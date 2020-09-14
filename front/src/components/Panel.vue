<template>
    <windows>
        <b-col cols="12">
            <b-row class="justify-content-center">
            </b-row>
        </b-col>
    </windows>
</template>

<script>
    import {validationMixin} from "vuelidate";
    import validateStateMixin from "../mixins/validationState";
    import Windows from "./Windows";
    import {bus} from "../main"

    export default {
        name: "Panel",
        components: {
            "windows": Windows,
        },
        data() {
            return {}
        },
        mounted() {
            bus.$emit("namechange", "Панель управления")
        },
        mixins: [validationMixin, validateStateMixin],
    }
</script>

<style scoped>

</style>