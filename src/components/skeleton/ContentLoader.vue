<template>
    <div class="box w-100">
        <div class="w-100 item bg-white m-t-10" v-for="i in 6" :key="i">
            <content-loader :width="980" :height="80" viewBox="0 0 980 80">
                <rect x="25" y="25" rx="5" ry="5" width="20" height="20" />
                <rect x="60" y="20" rx="5" ry="5" width="60" height="16" />
                <rect x="60" y="40" rx="5" ry="5" width="110" height="16" />
                <rect x="240" y="40" rx="5" ry="5" width="150" height="16" />
                <circle cx="410" cy="50" r="15" />
                <rect x="466" y="15" rx="5" ry="5" width="45" height="16" />
                <rect x="455" y="35" rx="5" ry="5" width="65" height="27" />
                <circle cx="570" cy="50" r="15" />
                <rect x="590" y="40" rx="5" ry="5" width="150" height="16" />
                <rect x="850" y="25" rx="5" ry="5" width="65" height="30" />
            </content-loader>
        </div>
    </div>
</template>

<script>
import { ContentLoader } from 'vue-content-loader'
export default {
    components: {
        ContentLoader
    }
}
</script>
