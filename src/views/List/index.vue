<template>
    <div>
        <p>List</p>
        <empty-router-view />
    </div>
</template>
<script>
import EmptyRouterView from '../Layout/EmptyRouterView'
export default {
    name: 'List',
    components: {
        EmptyRouterView
    }
}
</script>
