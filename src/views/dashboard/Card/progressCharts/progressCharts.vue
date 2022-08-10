<template>
  <div class="charts" ref="charts">

  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: 'progressCharts',
  mounted() {
    //初始化echarts实例
    let lineCharts=echarts.init(this.$refs.charts)
    //配置echarts
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show:false,
        //最小值和最大值的设置
        min:0,
        max:100,

      },
      yAxis: {
        //隐藏y轴
        show:false,
        type:'category'
      },
      series:[
        {
          type:'bar',
          data:[78],
          //设置柱状图的宽度
          barWidth:20,
          color:'#9af3b0',
          //背景颜色设置
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
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
.charts{
  height: 100%;
  width: 100%;
}
</style>
