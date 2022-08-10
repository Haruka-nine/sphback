<template>
  <div>
    <el-form :inline="true"  class="demo-form-inline" >
      <el-form-item label="一级分类">
        <!--el-select可以用v-model收集数据，收集的是option的value-->
        <el-select placeholder="请选择" v-model="cForm.category1Id" @change="handler1" :disabled="show">
          <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handler2" :disabled="show">
          <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handler3" :disabled="show">
          <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in list3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props:['show'],
  data(){
    return{
      //一级分类的数组
      list1:[],
      //二级分类的数组
      list2:[],
      //三级分类的数据
      list3:[],
      //收集响应的一级二级三级分类的id
      cForm:{
        category1Id:'',
        category2Id:'',
        category3Id:''
      }
    }
  },
  mounted() {
    this.getCategory1List()
  },
  methods:{
    //获取一级分类数据
    getCategory1List(){
      this.$API.attr.reqCategory1List().then(res=>{
        this.list1 = res.data
      })
    },
    //当一级分类改变时，获取二级分类数据
    handler1(){
      //清除二级和三级分类的数据
      //这是由于el的bug,在list改变后，选项并不会改变，需要改变绑定值才会改变
      this.list2=[]
      this.list3=[]
      this.cForm.category2Id=''
      this.cForm.category3Id=''
      //结构出一级分类的id
      const {category1Id}= this.cForm
      this.$emit('getCategoryId', { categoryId:category1Id ,level:1})
      this.$API.attr.reqCategory2List(category1Id).then(res=>{
        this.list2=res.data
      })
    },
    //当二级分类改变时，获取三级分类数据
    handler2(){
      //清除三级分类的数据
      this.cForm.category3Id=''
      //结构出一级分类的id
      const {category2Id}= this.cForm
      this.$emit('getCategoryId',{ categoryId:category2Id ,level:2})
      this.$API.attr.reqCategory3List(category2Id).then(res=>{
        this.list3=res.data
      })
    },
    //三级分类改变的事件回调
    handler3(){
      const {category3Id}= this.cForm
      this.$emit('getCategoryId',{ categoryId:category3Id ,level:3})
    }
  }
}
</script>

<style scoped>

</style>
