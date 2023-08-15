<template>
<div class="description wrap-1450 p-t-20" :key="updateKey">
    <div class="header bg-white p-20 font-20 font-medium font-500">
        {{ headerTitle }}
    </div>
    <div class="bg-white p-20 description-section">
        <component :is="isComponent" />
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import Protocols from '@/views/Descriptions/Components/Protocols'
import Policy from '@/views/Descriptions/Components/Policy'
import Disclaimer from '@/views/Descriptions/Components/Disclaimer'
export default {
    name: 'Description',
    components: {
        Protocols,
        Policy,
        Disclaimer
    },
    props: ['id'],
    data () {
        return {
            updateKey: +new Date().getTime() + this.id
        }
    },
    computed: {
        ...mapState('commonData', ['descriptions']),
        headerTitle () {
            return this.descriptions && this.descriptions.find(x => x.id === this.id * 1).text
        },
        isComponent () {
            return (this.descriptions && this.descriptions.find(x => x.id === this.id * 1).com) || 'Protocols'
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.header {
    border-bottom: 1px solid $border-color1;
}
.description-section{
    line-height: 20px;
}
</style>
