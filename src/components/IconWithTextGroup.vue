<template>
  <ul class="types w-100 justify-between flex flex-wrap">
    <template v-for="kind in types">
      <li class="type flex align-center" :key="`icon-${kind.id}`">
            <span
                class="icon d-inline-block bg-center bg-no-repeat bg-size-100"
                v-lazy:background-image="require(`../assets/images/${url}/${kind.icon}.png`)"
            ></span>
        <span class="font-12 m-l-5 font-regular font-400">{{ kind.name }}</span>
      </li>
    </template>

  </ul>
</template>

<script>
export default {
    name: 'IconWithTextGroup',
    props: {
        types: {
            type: Array,
            default: () => []
        },
        url: {
            type: String,
            default: 'score/icons'
        }
    }
}
</script>

<style lang="scss" scoped>
.types {
  color: #999;
  margin: 0 auto;
  .type {
    margin-bottom: 15px;
  }
  .icon {
    width: 15px;
    height: 15px;
  }
}
</style>
