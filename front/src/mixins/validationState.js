export default {
    methods: {
        validateState(name) {
            const {$dirty, $error} = this.$v.form[name];
            return $dirty ? !$error : null;
        },
        validateStateFormName(name, FormName) {
            const {$dirty, $error} = this.$v[FormName][name];
            return $dirty ? !$error : null;
        },
        clearInput() {
            if (this.server_error_code || this.server_error_message) {
                this.server_error_code = null;
                this.server_error_message = null;
            }
        },
    }
}