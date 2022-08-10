<template>
  <div>
    <!--表格-->
    <el-table border style="width: 100%" :data="records" v-loading="loading">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column label="名称" prop="skuName"></el-table-column>
      <el-table-column label="描述" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片" width="110">
        <template v-slot="{row,$index}">
          <img v-lazy="row.skuDefaultImg" alt="" style="width: 80px;height: 80px">
        </template>
      </el-table-column>
      <el-table-column label="重量" width="80" prop="weight"></el-table-column>
      <el-table-column label="价格" width="80" prop="price"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row,$index}">
          <el-button type="info" icon="el-icon-download" size="mini" v-if="row.isSale===0" @click="onSale(row)"></el-button>
          <el-button type="success" icon="el-icon-upload2" size="mini" v-else @click="cancelSale(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :page-sizes="[3,5,10]"
      :page-size="limit"
      :total="total"
      layout='prev,pager,next,jumper,->,sizes,total'
      style="margin-top: 20px;text-align: center"
      @current-change="changePage"
      @size-change="changeSize"
    >

    </el-pagination>
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :show-close="false"
      size="50%"
    >
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag type="success" v-for="(attr,index) in skuInfo.skuAttrValueList" :key="attr.id" style="margin: 2px 5px">{{attr.valueName}}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="12">
          <el-carousel height="400px">
            <el-carousel-item v-for="(image,index) in skuInfo.skuImageList" :key="image.id">
              <img :src="image.imgUrl" alt="" style="width: 100%">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data(){
    return{
      page:1,  //代表当前第几页
      limit:3, //代表当前页面有几条数据
      records:[],  //储存SKU列表的数据
      total :0,   //储存分页器一共展示的数据
      loading:false,
      skuInfo:{},  //sku详情信息
      drawer: false,
      direction: 'rtl',
    }
  },
  mounted() {
    this.loading = true
    this.getSkuList()
  },
  methods:{
    //获取列表数据
    getSkuList(){
      const {page,limit} = this
      this.$API.sku.reqSkuList(page,limit).then(res=>{
        this.total = res.data.total
        this.records = res.data.records
        this.loading = false
      })
    },
    //分页器换页
    changePage(page){
      this.page = page
      this.loading = true
      this.getSkuList()
    },
    //分页器更换每页显示条数
    changeSize(size){
      this.limit = size
      this.page = 1
      this.loading = true
      this.getSkuList()
    },
    //上架
    onSale(row){
      this.$API.sku.reqOnSale(row.id).then(res=>{
        this.$message({type:'success',message:'上架成功'})
        row.isSale = 1
      })
    },
    //下架
    cancelSale(row){
      this.$API.sku.reqCancelSale(row.id).then(res=>{
        this.$message({type:'success',message:'下架成功'})
        row.isSale = 0
      })
    },
    //编辑
    edit(){
      this.$message({type:'info',message:'正在开发中'})
    },
    //获取sku详情
    getSkuInfo(row){
      this.$API.sku.reqSkuById(row.id).then(res=>{
        this.skuInfo = res.data
        this.drawer = true
      })
    },

  }
}
</script>

<style scoped>
.el-col-5{
  font-size: 18px;
  text-align: right;
}
.el-col{
  margin: 10px 10px;
}
</style>
<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #ffffff;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #ffffff;
}
.el-carousel__button{
  width: 20px;
}
</style>
