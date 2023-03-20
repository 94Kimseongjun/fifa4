<template>
  <div ref="chart" style="width: 300px; height: 300px;"></div>
</template>
  
<script>
import * as echarts from 'echarts';

export default {
  name: 'EchartPie',
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      if (this.chart) {
        this.chart.dispose();
      }

      const data = this.chartData;

      // 차트 생성
      this.chart = echarts.init(this.$refs.chart);

      // 옵션 설정
      const options = {
        title: {
          left: 'center'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },

        grid: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        },
        series: [
          {
            type: 'pie',
            label: {
              show: true,
              formatter: '{c} {b}'
            },
            radius: '50%',
            data: [
              { value: data.win, name: '승' },
              { value: data.draw, name: '무' },
              { value: data.lose, name: '패' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      // 차트에 옵션 적용
      this.chart.setOption(options);
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },

  watch: {
    chartData: {
      handler() {
        this.initChart();
      }

    }
  }
};
</script>
  