export default {
    methods: {
        checkPhoneNumber(phone) {
            if (phone) {
                if (phone.length > 11) {
                    return phone.substr(2, phone.length);
                } else {
                    return phone.substr(1, phone.length);
                }
            } else {
                return phone;
            }

        },
        preparePhone(phone) {
            if (phone && phone.length < 11) {
                let number = "+7" + phone;
                return number;
            } else {
                return phone;
            }
        }
    }
}