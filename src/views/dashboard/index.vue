<template>
  <div class="dashboard-container">
    <Card></Card>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Card from '@/views/dashboard/Card/Card'
import Sale from '@/views/dashboard/Sale/Sale'
import Observe from '@/views/dashboard/Observe/Observe'
export default {
  name: 'Dashboard',
  components:{ Observe, Sale, Card},
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    this.$store.dispatch('home/getData')
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
