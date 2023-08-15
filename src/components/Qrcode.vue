<template>
<div class="qrcode w-100 h-100 bg-center bg-no-repeat bg-size-cover">
    <QR class="my-code" :url="url" />
</div>
</template>

<script>
import QR from '@/views/Layout/QR'
export default {
    name: 'Qrcode',
    props: {
        url: {
            type: String,
            default: ''
        }
    },
    components: {
        QR
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.qrcode {
    background-color: $text-white;
    .code {
        background-color: #eee;
    }
    .my-code{
        width: 100% !important;
        height: 100% !important
    }
}

</style>
