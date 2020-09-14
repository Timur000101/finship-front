<template>
    <windows>
        <b-col cols="12">
            <b-row class="justify-content-center px-3">
                Почта ems
            </b-row>
        </b-col>

    </windows>
</template>

<script>
    import {validationMixin} from "vuelidate";
    import validateStateMixin from "../mixins/validationState";
    import Windows from "./Windows";
    import OptionsBar from "./OptionsBar";

    export default {
        name: "EMS",
        data() {
            return {}
        },
        mixins: [validationMixin, validateStateMixin],
        components: {
            "windows": Windows,
        },
    }
</script>

<style scoped>

</style>