<template>
  <div class="charts" ref="charts">

  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: 'barChart',
  mounted() {
    //初始化echarts实例
    let lineCharts=echarts.init(this.$refs.charts)
    //配置echarts
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show:false,
        //均分
        type:'category'
      },
      yAxis: {
        //隐藏y轴
        show:false
      },
      series:[
        {
          //图标的形式
          type:'bar',
          data:[10,7,33,12,88,9,6,5,6,3,1,3,8,6,55,6,77]
        }
      ],
      //布局调试
      grid:{
        left:0,
        top:0,
        right:0,
        bottom:0
      },
      tooltip:{}
    })
  }
}
</script>

<style scoped>
.charts{
  height: 100%;
  width: 100%;
}
</style>
