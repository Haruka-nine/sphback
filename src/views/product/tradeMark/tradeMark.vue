<template>
  <div>
    <!--按钮-->
    <el-button type="primary" icon="el-icon-plus" @click="showDialog">添加</el-button>
    <!--表格组件-->
    <!--data:表格组件将来需要展示的数据----数组类型-->
    <!--注意:
      elementUi当中的table组件,时按列处理数据的-->
    <el-table style="width: 100%" :border="true" :data="list">
      <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
      <el-table-column label="品牌名称" width="width" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO" width="width" prop="logoUrl">
        <template v-slot="{row,$index}">
          <img :src="row.logoUrl" alt="" style="width: 120px;height: 67.5px">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="width" >
        <template v-slot="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTrade(row)">修改</el-button>
          <el-button type="danger"  icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页器
        当前第几页，数据总条数，每一页展示条数，连续页码数
        layout可以调整各个组件排布
        current-page:代表的是当前第几页
        total:代表分页器一共需要展示多少条数据
        page-size :代表的是每一页需要展示多少条数据
        page-sizes: 代表的是可以设置每一页需要展示多少条数据
        page-count:按钮的数量 如果为9 ，连续页码为7
    -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-count="7"
      :page-sizes="[3,5,10]"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      style="margin-top: 20px;text-align: center"
      layout='prev,pager,next,jumper,->,sizes,total'
    >
    </el-pagination>
    <!--对话框-->
    <!--
      :visible.sync 控制对话框显示与隐藏-->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称"  label-width="100px" prop="tmName">
          <el-input  autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO"  label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" alt="">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg文件，且不超过2M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'tradeMark',
  data(){
    return{
      //代表分页器第几页
      page:1,
      //当前页数展示数据条数
      limit:3,
      //总共数据条数
      total:0,
      //列表战术数据
      list:[],
      //控制对话框显示与隐藏
      dialogFormVisible:false,
      //收集品牌信息
      tmForm:{
        tmName:'',
        logoUrl:''
      },
      rules: {
        //品牌名称的验证规则
        //require:必须要校验字段（前面五角星有关系） message:提示信息  trigger:触发事件
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        //品牌logo的验证规则
        logoUrl: [
          { required: true, message: '请添加logo图片'}
        ]
      }

    }
  },
  mounted() {
    //获取列表数据的函数
    this.getPageList()
  },
  methods:{
    //向服务器发送请求,更新数据
    getPageList(){
      const {page,limit} = this
      this.$API.tradeMark.reqTradeMarkList(page,limit).then(res=>{
        this.total=res.data.total
        this.list =res.data.records
      })
    },
    //分页器换页
    handleCurrentChange(page){
      this.page = page
      this.getPageList()
    },
    //分页器每一页显示的数据条数改变
    handleSizeChange(limit){
      this.limit=limit
      this.page=1
      this.getPageList()
    },
    //点击添加品牌的按钮
    showDialog(){
      //显示对话框
      this.dialogFormVisible=true
      this.tmForm={
        tmName: '',
        logoUrl: ''
      }

    },
    //修改品牌
    updateTrade(row){
      this.dialogFormVisible=true
      this.tmForm={...row}
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      //res：上传成功之后返回前端数据
      //file:上传成功之后服务器返回前端数据
      //收集品牌图片数据，因为将来会带给服务器
      this.tmForm.logoUrl = res.data
    },
    //图片上传前判断大小和格式
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    //添加品牌或者修改品牌
    addOrUpdateTradeMark(){
      this.$refs.ruleForm.validate((valid)=>{
        if (valid){
          this.dialogFormVisible=false
          //发请求（添加|修改品牌）
          this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm).then(()=>{
            this.$message({message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功' ,type:'success'})
            //添加或者修改品牌成功后，再次获取品牌列表
            //添加应该留在第一页，修改留在当前页
            if (!this.tmForm.id){
              this.page=1
            }
            this.getPageList()
          }).catch(err=>{
            this.$message({ message:err.message,type:'error' })
          })
        }else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    //删除品牌
    deleteTradeMark(row){
      this.$confirm(`你确定删除${row.tmName}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //当用户点击确定按钮时触发
        this.$API.tradeMark.reqDeleteTradeMark(row.id).then(res=>{
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          //再次获取品牌列表
          if (this.list.length===1){
            this.page=this.page-1
          }
          this.getPageList()
        })

      }).catch(() => {
        //当用户点击取消按钮时触发
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
