<template>
    <v-btn color="primary" @click="handleClick">{{ text }}</v-btn>
</template>
  
<script>
export default {
    props: {
        total: {
            type: Number,
            required: true
        },
        visible: {
            type: Number,
            required: true
        },
        increment: {
            type: Number,
            default: 5
        }
    },
    computed: {
        text() {
            return this.visible < this.total ? '더 보기' : '접기';
        }
    },
    methods: {
        handleClick() {
            this.$emit('click', this.increment);
        }
    }
};
</script>
  