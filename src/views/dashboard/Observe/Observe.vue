<template>
  <el-row :gutter="20">
    <el-col :span="12">
        <Search></Search>
    </el-col>
    <el-col :span="12">
      <Category></Category>
    </el-col>
  </el-row>
</template>

<script>
import Category from '@/views/dashboard/Observe/Category/Category'
import Search from '@/views/dashboard/Observe/Search/Search'
export default {
  name: 'Observe',
  components: { Search, Category }
}
</script>

<style scoped>

</style>
