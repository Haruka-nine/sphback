<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select  placeholder="请选择品牌" v-model="spu.tmId">
          <el-option v-for="(tm,index) in tradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows="4" placeholder="描述" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handleSuccess"
          :on-error="handleError"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndName" :placeholder="`还有${unSelectSaleAttr.length}未选择`">
          <el-option :value="`${unselect.id}:${unselect.name}`" v-for="(unselect,index) in unSelectSaleAttr" :key="unselect.id" :label="unselect.name"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndName" @click="addSaleAttr">
          添加销售属性
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-table border :data="spu.spuSaleAttrList">
          <el-table-column label="序号" type="index" width="80" align="center" ></el-table-column>
          <el-table-column label="属性名" prop="saleAttrName"></el-table-column>
          <el-table-column label="属性值名称列表">
            <template v-slot="{row,$index}">
              <el-tag
                :key="index"
                v-for="(tag,index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(row,index)"
              >
                {{tag.saleAttrValueName}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                :ref="`${row.saleAttrName}`"
                size="small"
                @keyup.enter.native="handleInputConfirm11(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="$emit('changeScene',{scene:0})">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data(){
    return{
      dialogImageUrl: '',
      dialogVisible: false,
      //spu的信息
      spu:{
        //三级分类id
        category3Id: 0,
        //spu描述
        description: "",
        //spu名称
        spuName: "",
        //品牌id
        tmId: undefined,
        //spu图片信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "",
          //   imgUrl: "",
          //   spuId: 0
          // }
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   // id: 0,
          //   saleAttrName: "",
          //   // spuId: 0,
          //   spuSaleAttrValueList: [
          //     // {
          //     //   baseSaleAttrId: 0,
          //     //   id: 0,
          //     //   isChecked: "string",
          //     //   saleAttrName: "string",
          //     //   saleAttrValueName: "string",
          //     //   spuId: 0
          //     // }
          //   ]
          // }
        ]
      },
      //品牌的信息
      tradeMarkList:[],
      //spu图片
      spuImageList:[],
      //售卖属性
      saleAttrList:[],
      attrIdAndName:''
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.$message(`${file.name}已被删除`)
      this.spuImageList=fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList){
      if (response.code!==200){
        this.$message({type:'error',message:`${response.message}`})
        fileList.splice(fileList.length-1,1)
        return
      }
      this.$message({type:'success',message:`${file.name}添加成功`})
      let newImage={
        imgName:file.name,
        imgUrl:response.data,
        name:file.name,
        url:response.data
      }
      this.spuImageList.push(newImage)
    },
    handleError(err, file, fileList){
      console.log(err)
      this.$message({type:'error',message:`上传失败`})
    },
    //添加归零函数
    clearSpuData(id){
      //获取品牌的信息
      this.$API.spu.reqTradMarkList().then(res=>{
        this.tradeMarkList = res.data
      })
      //获取平台的销售属性
      this.$API.spu.reqBaseSaleAttrList().then(res=>{
        this.saleAttrList = res.data
      })
      this.spu={
        //三级分类id
        category3Id: id,
        //spu描述
        description: "",
        //spu名称
        spuName: "",
        //品牌id
        tmId: undefined,
        //spu图片信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "",
          //   imgUrl: "",
          //   spuId: 0
          // }
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   // id: 0,
          //   saleAttrName: "",
          //   // spuId: 0,
          //   spuSaleAttrValueList: [
          //     // {
          //     //   baseSaleAttrId: 0,
          //     //   id: 0,
          //     //   isChecked: "string",
          //     //   saleAttrName: "string",
          //     //   saleAttrValueName: "string",
          //     //   spuId: 0
          //     // }
          //   ]
          // }
        ]
      }
      this.spuImageList=[]
      this.attrIdAndName = ''

    },
    //初始化Spu数据
    initSpuDate(spu){
      //下拉列表清零
      this.attrIdAndName =''
      //获取spu信息的数据
      this.$API.spu.reqSpu(spu.id).then(res=>{
        res.data.spuSaleAttrList.forEach(item=>{
          item.inputVisible=false
          item.inputValue=''
        })
        this.spu = res.data
      })
      //获取品牌的信息
      this.$API.spu.reqTradMarkList().then(res=>{
        this.tradeMarkList = res.data
      })
      //获取spu接口的图标
      this.$API.spu.reqSpuImageList(spu.id).then(res=>{
        //由于照片墙显示图片的数据需要数组，数组里面的元素需要有name和url字段
        //需要把服务器返回的数据进行处理
        let listAttr=res.data
        listAttr.forEach(item=>{
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = listAttr
      })
      //获取平台的销售属性
      this.$API.spu.reqBaseSaleAttrList().then(res=>{
        this.saleAttrList = res.data
      })
    },
    //添加销售属性
    addSaleAttr(){

      const [baseSaleAttrId,saleAttrName] = this.attrIdAndName.split(':')
      const newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        inputVisible:false,
        inputValue:'',
        spuSaleAttrValueList:[]
      }

      this.spu.spuSaleAttrList.push(newSaleAttr)
      this.attrIdAndName = ''
    },
    //添加销售属性值
    addSaleAttrValue(row){
      row.inputVisible=true
      this.$nextTick(()=>{
        this.$refs[row.saleAttrName].focus()
      })
    },
    //保存新增的属性值(回车)
    handleInputConfirm11(row){
      //回车会失去焦点，所以直接调用失去焦点事件
      this.$refs[row.saleAttrName].blur()
    },
    //保存新增的属性值(失去焦点)
    handleInputConfirm(row){
      //判断是否为空
      if (row.inputValue.trim()===''){
        this.$message('属性值不能为空')
        this.$refs[row.saleAttrName].focus()
        return
      }
      //判断是否重复
      let isRepeat=row.spuSaleAttrValueList.every(item=>{
        return item.saleAttrValueName!==row.inputValue
      })
      if (!isRepeat){
        this.$message('属性值不能重复')
        this.$refs[row.saleAttrName].focus()
        return
      }
      const newSaleAttrValue={
        baseSaleAttrId:row.baseSaleAttrId,
        saleAttrName:row.saleAttrName,
        saleAttrValueName:row.inputValue
      }
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputValue= ''
      row.inputVisible=false
    },
    //删除属性值
    handleClose(row,index){
      row.spuSaleAttrValueList.splice(index,1)
    },
    //保存按钮的回调
    addOrUpdateSpu(){
      let isSubmit= this.spu.spuSaleAttrList.every(item=>{
        return item.inputVisible ===false
      })
      if (this.spu.spuName.trim()===''){
        this.$message({type:'warning',message:'spu名称不能为空'})
        return
      }
      if (!isSubmit){
        this.$message({type:'warning',message:'销售属性值不规范'})
        return
      }
      this.spu.spuImageList=this.spuImageList
      this.$API.spu.reqAddOrUpdateSpu(this.spu).then(res=>{
        this.$message({type:'success',message:'保存成功'})
        this.$emit('changeScene', {scene:0,flag:this.spu.id?'修改':'添加'})
      })
    }
  },
  computed:{
    //没选择的销售属性
    unSelectSaleAttr(){
      //整个平台的销售属性一共三个
      //数组过滤方法，可以从已有的数组中过滤出用户需要的元素，并返回出一个数据
      return this.saleAttrList.filter(item=>{
        return this.spu.spuSaleAttrList.every(item1=>{
          return item.name!==item1.saleAttrName
        })
      })
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
