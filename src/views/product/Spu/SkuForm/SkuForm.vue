<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        {{spu.spuName}}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px" >
          <el-form-item :label="attr.attrName" value="" v-for="(attr,index) in attrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option :value="`${value.attrId}:${value.id}`" :label="value.valueName" v-for="(value,index) in attr.attrValueList" :key="value.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId"  >
              <el-option :value="`${saleAttr.id}:${value.id}`" :label="value.saleAttrValueName" v-for="(value,index) in saleAttr.spuSaleAttrValueList" :key="value.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table border style="width: 100%" :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column width="80" type="selection"></el-table-column>
          <el-table-column label="图片">
            <template v-slot="{row,$index}">
              <img :src="row.imgUrl" alt="" style="width: 100px;height: 100px">
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="{row,$index}">
              <el-button type="primary" v-if="row.isDefault===0" @click="changeDefault(row)">设为默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancelAdd">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data(){
    return{
      //存储图片的信息
      spuImageList:[],
      //存储销售属性
      spuSaleAttrList:[],
      //获取平台属性的数据
      attrInfoList:[],
      skuInfo: {
        //第一类，父组件给的数据
        category3Id: undefined,
        spuId: undefined,
        tmId: undefined,
        //第二类，需要数据双向绑定
        skuName: '',
        price: undefined,
        weight: '',
        skuDesc: '',
        //第三类，需要自己书写代码
        //收集平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // }
        ],
        //设置默认图片
        skuDefaultImg: '',
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: 'string',
          //   imgUrl: 'string',
          //   isDefault: 'string',
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        //收集销售属性列表
        skuSaleAttrValueList: [
          // {

          //   saleAttrId: 0,
          //   saleAttrValueId: 0,

          // }
        ]
      },
      spu:{},
      //收集选中图片的字段,但注意，当前缺少isDefault字段
      imageList:[]
    }
  },
  methods:{
    //获取skuForm数组
    getData(category1Id,category2Id,row){
      console.log(row)
      //收集父组件给与的数据
      this.skuInfo.category3Id = row.category3Id
      this.skuInfo.spuId = row.id
      this.skuInfo.tmId = row.tmId
      this.spu = row
      this.$API.sku.reqSpuImageList(row.id).then(res=>{
        let list = res.data
        list.forEach(item=>{
          item.isDefault = 0
        })
        this.spuImageList = list
      })
      this.$API.sku.reqSpuSaleAttrList(row.id).then(res=>{
        this.spuSaleAttrList = res.data
      })
      this.$API.sku.reqAttrInfoList(category1Id,category2Id,row.category3Id).then(res=>{
        this.attrInfoList = res.data
      })
    },
    //取消添加
    cancelAdd(){
      this.$emit('changeScene',{scene:0})
      //清除数据
      Object.assign(this._data,this.$options.data())
    },
    //表格选中的回调
    handleSelectionChange(selection){
      this.imageList = selection
    },
    //更改默认
    changeDefault(row){
      this.spuImageList.forEach(item=>{
        item.isDefault = 0
      })
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    //保存sku
    save(){
      //简单验证
      if (!this.skuInfo.skuName.trim()){
        this.$message({type:'warning',message:"请输入sku名称"})
        return
      }
      if (!this.skuInfo.price){
        this.$message({type:'warning',message:"请输入价格"})
        return
      }
      if (!this.skuInfo.weight.trim()){
        this.$message({type:'warning',message:"请输入重量"})
        return
      }
      let isSubmit1 = this.attrInfoList.every(item=>{
        return item.attrIdAndValueId
      })
      if (!isSubmit1){
        this.$message({type:'warning',message:"请选择平台属性"})
        return
      }
      let isSubmit2 = this.spuSaleAttrList.every(item=>{
        return item.attrIdAndValueId
      })
      if (!isSubmit2){
        this.$message({type:'warning',message:"请选择销售属性"})
        return
      }
      if (this.imageList.length<1){
        this.$message({type:'warning',message:"请至少选择一个图片"})
        return
      }

      let isSubmit3 = this.imageList.every(item=>{
        return item.isDefault===0
      })
      if (isSubmit3){
        this.$message({type:'warning',message:"请至少选择一个默认图片"})
        return
      }

      //整理参数

      //整理平台属性
      const {attrInfoList} = this
      attrInfoList.forEach(item=>{
        if (item.attrIdAndValueId){
          const [attrId,valueId] = item.attrIdAndValueId.split(":")
          //携带给服务器的参数应该是对象
          let obj = {attrId,valueId}
          this.skuInfo.skuAttrValueList.push(obj)
        }
      })
      //整理销售属性
      const {spuSaleAttrList} = this
      spuSaleAttrList.forEach(item=>{
        if (item.attrIdAndValueId){
          const [saleAttrId,saleAttrValueId] = item.attrIdAndValueId.split(":")
          let obj = {saleAttrId,saleAttrValueId}
          this.skuInfo.skuSaleAttrValueList.push(obj)
        }
      })

      //整理图片属性
      this.skuInfo.skuImageList = this.imageList.map(item=>{
        return{
          imgName:item.imgName,
          imgUrl : item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id
        }

      })

      //发请求
      this.$API.spu.reqAddSku(this.skuInfo).then(res=>{
        this.$message({type:'success',message:"添加成功"})
        //切换场景并清空数据
        this.cancelAdd()
      })
    }
  }
}
</script>

<style scoped>

</style>
