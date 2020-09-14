<template>
    <b-modal
            id="modal-success"
            :title="action_title"
            ok-only
            @hidden="action_success"
            @ok="action_success"
    >
        <p class="my-4">{{action_text}}</p>
    </b-modal>
</template>

<script>
    export default {
        name: "ModalInfo",
        props: ['action_text', 'action_success', 'action_title'],
    }
</script>