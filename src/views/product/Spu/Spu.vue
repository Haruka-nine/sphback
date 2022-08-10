<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShow"/>
    </el-card>
    <el-card>
      <!--底部这里是有三部分-->
      <div v-show="scene===0">
        <!--展示spu列表的结构-->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table border :data="records">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description"></el-table-column>
          <el-table-column label="SPU操作">
            <template v-slot="{row,$index}">
              <hit-button type="success" icon="el-icon-plus"   size="mini" title="添加sku" @click="addSku(row)"></hit-button>
              <hit-button type="warning" icon="el-icon-edit"   size="mini" title="修改spu" @click="updateSpu(row)"></hit-button>
              <hit-button type="info"    icon="el-icon-info"   size="mini" title="查看当前spu全部sku列表" @click="handler(row)"></hit-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row.id)"
              >
                <hit-button type="danger"  icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></hit-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="page"
          :total="total"
          :page-size="limit"
          :page-count="7"
          :page-sizes="[3,5,10]"
          style="margin-top: 20px;text-align: center"
          layout='prev,pager,next,jumper,->,sizes,total'
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <SpuForm v-show="scene===1" @changeScene="changeScene" ref="spu">
      </SpuForm>
      <SkuForm v-show="scene===2" @changeScene="changeScene" ref="sku">
      </SkuForm>
    </el-card>
    <el-dialog :title="spu.spuName" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table :data="gridData" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="150"></el-table-column>
        <el-table-column prop="price" label="价格" width="200"></el-table-column>
        <el-table-column prop="weight" label="重量"></el-table-column>
        <el-table-column>
          <template v-slot="{row,$index}">
            <img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
//引入子组件
import SkuForm from '@/views/product/Spu/SkuForm/SkuForm'
import SpuForm from '@/views/product/Spu/SpuForm/SpuForm'
export default {
  name: 'Spu',
  components:{SpuForm,SkuForm},
  data(){
    return{
      category1Id:'',
      category2Id:'',
      category3Id:'',
      //控制三级联动的可操作性
      isShow:true,
      //分页器页数
      page:1,
      //每一页数据个数
      limit:3,
      //spu列表的数据
      records:[],
      //数据的总条数
      total:0,
      //代表展示SPU列表数据
      scene:0,
      dialogTableVisible: false,
      //spu
      spu:{},
      //sku数据列表
      gridData:[],
      loading:true
    }
  },
  methods:{
    //三级联动的自定义事件，可以把子组件的相应的id传送给父组件
    getCategoryId({ categoryId,level }){
      //categoryId是获取到一、二、三级分类的id
      //level是区分是几级id
      if (level===1){
        this.category2Id=''
        this.category3Id=''
        this.records=[]
        this.category1Id=categoryId
      }else if (level===2){
        this.category3Id=''
        this.records=[]
        this.category2Id=categoryId
      }else {
        //代表三级分类的id有了
        this.category3Id=categoryId
        this.getSpuList()
      }

    },
    //获取spu列表数据的方法
    getSpuList(){
      //携带三个参数:page limit 三级分类的id
      this.$API.spu.reqGetSpuList(this.page,this.limit,this.category3Id).then(res=>{
        this.records=res.data.records
        this.total=res.data.total
      })
    },
    //分页器换页
    handleCurrentChange(page){
      this.page = page
      this.getSpuList()
    },
    //分页器每一页显示的数据条数改变
    handleSizeChange(limit){
      this.limit=limit
      this.page=1
      this.getSpuList()
    },
    //添加Spu
    addSpu(){
      this.scene=1
      this.isShow=false
      this.$refs.spu.clearSpuData(this.category3Id)
    },
    //修改Spu
    updateSpu(row){
      this.scene=1
      this.isShow=false
      //获取子组件SpuForm组件
      this.$refs.spu.initSpuDate(row)
    },
    //更改场景
    changeScene({ scene,flag }){
      this.scene=scene
      this.isShow = true
      if (flag==='添加'){
        this.page=1
      }
      this.getSpuList()
    },
    //删除spu
    deleteSpu(id){
      this.$API.spu.reqDeleteSpu(id).then(res=>{
        this.$message({type:'success',message:'删除成功'})
        if (this.records.length===1){
          this.page=this.page-1
        }
        this.getSpuList()
      })
    },
    //添加Sku
    addSku(row){
      this.scene=2
      this.isShow=false
      this.$refs.sku.getData(this.category1Id,this.category2Id,row)
    },
    //查看sku列表的回调
    handler(row){
      this.dialogTableVisible = true
      this.spu = row
      this.$API.spu.reqSkuList(row.id).then(res=>{
        this.gridData = res.data
        //loding隐藏
        this.loading = false
      })
    },
    //关闭对话框的回调
    close(done){
      this.loading = true
      this.gridData = []
      done()
    }
  }
}
</script>

<style scoped>

</style>
