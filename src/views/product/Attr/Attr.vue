<template>
  <div>
    <el-card>
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"/>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <el-table style="width: 100%" border :data="attrList" >
          <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
          <el-table-column label="属性名称" width="150" prop="attrName"></el-table-column>
          <el-table-column label="属性值列表" width="width">
            <template v-slot="{row,$index}">
              <el-tag type="success" v-for="(attrValue,index) in row.attrValueList" :key="row.attrId" style="margin: 0 20px">
                {{attrValue.valueName}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template v-slot="{row,$index}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-popconfirm
                title="确认删除这个属性吗？"
                @onConfirm="deleteAttr(row.id)"
              >
                <el-button type="danger"  icon="el-icon-delete" size="mini" slot="reference" style="margin: 0 10px"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--添加属性|修改属性的结构-->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table style="width: 100%;margin: 20px 0" border :data="attrInfo.attrValueList">
          <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template v-slot="{row,$index}">
              <!--这里结构需要span与input来回的切换-->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              >
              </el-input>
              <span v-else  @click="toEdit(row,$index)" style="display: block" >{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width" >
            <template v-slot="{row,$index}">
              <el-popconfirm
                :title="`确认删除${row.valueName}吗?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="isSubmit">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data(){
    return{
      category1Id:'',
      category2Id:'',
      category3Id:'',
      //接收平台属性的字段
      attrList:[],
      //这个属性控制table的展示和隐藏
      isShowTable:true,
      //收集添加|修改属性使用
      attrInfo:{
        attrName:'',//属性名
        attrValueList:[//属性值
          // {
          //   attrId:0, //属性名Id
          //   valueName:""
          // }
        ],
        categoryId:0, //三级分类的id
        categoryLevel:3
      },
    }
  },
  computed:{
    isSubmit(){
      let legitimate= this.attrInfo.attrValueList.some(item=>{
        return item.flag!==false
      })
      return legitimate || this.attrInfo.attrValueList.length<1

    }
  },
  methods:{
    //组件内id向上传递
    getCategoryId({ categoryId,level }){
      if (level===1){
        this.category2Id=''
        this.category3Id=''
        this.attrList=[]
        this.category1Id=categoryId
      }else if (level===2){
        this.category3Id=''
        this.attrList=[]
        this.category2Id=categoryId
      }else {
        //代表三级分类的id有了
        this.category3Id=categoryId
        this.getAttrList()
      }
    },
    //获取平台属性的数据
    getAttrList(){
      const {category1Id,category2Id,category3Id} = this
      this.$API.attr.reqGetAttrList(category1Id,category2Id,category3Id).then(res=>{
        this.attrList = res.data
      })
    },
    //添加属性值
    addAttrValue(){

      this.attrInfo.attrValueList.push({
        flag:true,
        //添加属性没有对应的属性id，所以带给服务器的为undefined
        attrId:this.attrInfo.id, //对于修改，会赋予id，对于添加，则会赋予undefined
        valueName:''
      })
      //新加入自动聚焦
      this.$nextTick(()=>{
        this.$refs[this.attrInfo.attrValueList.length-1].focus()
      })
    },
    //添加属性
    addAttr(){
      this.isShowTable = false
      //清零
      //并收集三级分类的id
      this.attrInfo ={
        attrName:'',//属性名
        attrValueList:[//属性值
          // {
          //   attrId:0, //属性名Id
          //   valueName:""
          // }
        ],
        categoryId:this.category3Id, //三级分类的id
        categoryLevel:3
      }
    },
    //修改某一个属性
    updateAttr(row){
      this.isShowTable = false
      //将选中的属性赋值给attrInfo
      //这里数据结构中存在对象里面套数组，数组里边套对象，因此浅拷贝不能完全拷贝，还是有指针重复情况
      //所以需要使用深拷贝
      //深拷贝和浅拷贝在面试时频率很高，切记可以手写深拷贝和浅拷贝
      this.attrInfo = cloneDeep(row)
      //在修改某一个属性时，在相应的示行元素添加上flag这个标记
      this.attrInfo.attrValueList.forEach(item=>{
        //这样写也可以给属性值添加flag，但是会发现试图不会跟着变化，因为flag不是响应式数据
        //对象新增的属性是不会被vue赋予响应式的
        // item.flag = false
        this.$set(item,'flag',false)

      })
    },
    //编辑模式转换为查看模式
    toLook(row){
      //如果属性值为空，不能为新的属性值，给用户提示，让他输入一个新的属性值
      if (row.valueName.trim()===''){
        this.$message({type:'warning',message:'请输入一个正常的属性值'})
        return
      }
      //新增的属性值不能和已有的属性值重复
      let isRepeat = this.attrInfo.attrValueList.some(item=>{
        //需要将row从数组中剔除
        if (row!==item){
          return row.valueName===item.valueName
        }
      })
      if (isRepeat){
        this.$message({type:'warning',message:'属性值不能重复'})
        return
      }
      //当前的编辑模式转换为查看模式
      row.flag = false
    },
    //点击span的回调，查看模式变为编辑模式
    toEdit(row,index){
      //将span隐藏，显示input
      row.flag=true
      //自动聚焦到input
      //需要注意，点击span的时候，切换为input变为编辑模式，但对于浏览器而言，页面的重绘和重拍需要时间的
      //不可能立即获得ref
      //所以使用nextTick,渲染完成再执行
      this.$nextTick(()=>{
        //获取相应的input表单元素实现聚焦
        this.$refs[index].focus()
      })
    },
    //删除属性值
    //最新版本的element ui触发事件是不一样的，注意版本问题
    deleteAttrValue(index){
      //这里是不需要发请求的
      this.attrInfo.attrValueList.splice(index,1)
    },
    //添加或者更新属性
    addOrUpdateAttr(){
      //整理参数
      //属性值不合法，不能提交，并且不能出现flag字段
      //判断数据是否合法
      // let isSubmit = this.attrInfo.attrValueList.some(item=>{
      //   return item.flag!==false
      // })
      // if (isSubmit){
      //   this.$message({type:'warning',message:'数据不合法，请修改'})
      //   return
      // }
      //这里可以不用过滤的，直接遍历就可以
      this.attrInfo.attrValueList=this.attrInfo.attrValueList.filter(item=>{
        //不合法时不会变为查看模式，可以用flag判断
        if (item.flag===false){
          //删除flag属性
          delete item.flag
          return true
        }
      })
      //发请求
      this.$API.attr.reqAddOrUpdateAttr(this.attrInfo).then(res=>{
        this.$message({type:'success',message:'保存成功'})
        //保存成功以后需要再次获取平台属性
        this.getAttrList()
        this.isShowTable=true
      })
    },
    //删除属性
    deleteAttr(id){
      this.$API.attr.reqDeleteAttr(id).then(res=>{
        this.$message({type:'success',message:'删除成功'})
        //删除后从新获取数据
        this.getAttrList()
      })
    }
  }
}
</script>

<style scoped>

</style>
