<template>
  <div>
    <div class="header">
        <span>搜索用户数</span>
        <i class="el-icon-info"></i>
    </div>
    <div class="main">
      <span class="main-title">12321</span>
      <span class="main-content">17.1</span>
      <i class="el-icon-caret-top"></i>
      <i class="el-icon-caret-bottom"></i>
    </div>
    <div class="footer" ref="charts">
    </div>

  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: 'lineCharts',
  mounted() {
    //初始化echarts实例
    const lineCharts=echarts.init(this.$refs.charts)
    //配置echarts
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show:false,
        type:'category'
      },
      yAxis: {
        //隐藏y轴
        show:false
      },
      series:[
        {
          type:'line',
          data:[10,7,33,12,88,9,6,5,6,3,1,3,8,6,55,6,77],
          smooth:true,
          //设置拐点的样式
          itemStyle:{
            opacity:0
          },
          //线条的样式
          lineStyle:{
            color:'skyblue'
          },
          //填充颜色的设置
          areaStyle:{
            color:{
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'skyblue' // 0% 处的颜色
              }, {
                offset: 1, color: '#fff' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }
      ],
      //布局调试
      grid:{
        left:0,
        top:0,
        right:0,
        bottom:0
      }
    })
  }
}
</script>

<style scoped>
.header{
  display: flex;
  align-items: center;
}
.el-icon-info{
  margin: 20px;
}
.main-title{
  margin-right: 30px;
}
.main-content{
  margin-right: 10px;
}
.el-icon-caret-bottom{
  color: red;
}
.el-icon-caret-top{
  color: skyblue;
}
.footer{
  height: 50px;
  width: 100%;
}
</style>
