<template>
  <div class="home">
    <ExtName />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ExtName from '../components/ExtName.vue'

export default defineComponent({
  name: 'Home',
  components: {
    ExtName,
  },
})
</script>
