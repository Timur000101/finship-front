<template>
    <b-modal
            id="modal-confirm"
            class="modal"
            centered
            hide-header
            size="lg"
            :title="action_title"
            @ok="action_success"
    >
        <div class="modal-body">
            <p class="my-4">{{action_text}}</p>
        </div>
    </b-modal>
</template>

<script>
    export default {
        name: "ModalConfirm",
        props:['action_text','action_success','action_title'],
    }
</script>

<style lang="scss" scoped>
    .modal-body {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    p {
        font-size: 30px;
    }
</style>