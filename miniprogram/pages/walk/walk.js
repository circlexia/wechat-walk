import * as echarts from '../ec-canvas/echarts';
var time = require('../../utils/utils.js');
const app = getApp();
// 图表一
let res1 = '';
let res2 = '';
function setOption(chart,caloryArr,xdata,ydata){
  const option = {
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter: function (value, index) {
        var that = this;
        console.log(caloryArr, 'qrrr');
        caloryArr.forEach(item=>{
          if(item.xdata === value[0].name){
            res1 = `${value[0].value}步\n${item.calory}cal`
          }
        })
        return res1;
      },
    },
    grid:{
      left: '14%',
      bottom: '10%',
      right: '5%'
    },
    xAxis: {
      data: xdata,
      axisLabel: {
        interval: 0
      },
      axisLine: {
        lineStyle: {
          color: '#AAAAAA'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
          color: ['rgba(152,152,152,.2)']
        }
      },
    },
    yAxis: [{
      type: 'value',
      scale: true,
      name: '步数',
      min: 0,
      axisLabel: {
        textStyle: {
          color: '#3C3939'
        },
      },
      nameTextStyle: {
        color: '#3C3939'
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'solid',
          color: ['rgba(152,152,152,.2)']
        }
      },
      axisLine: {
        lineStyle: {
          color: '#AAAAAA',
          width: 1
        }
      },
    }],
    series: [{
      type: 'line',
      data: ydata,
      symbolSize: 6,
      lineStyle: {
        width: 1
      },
      itemStyle: {
        normal: {
          color: '#26A6FF',
          lineStyle: {
            color: '#26A6FF'
          },
        }
      },
      symbolSize: 6,
      areaStyle: {normal: {
        color: new echarts.graphic.LinearGradient(
          0,0,0,1,
          [
            { offset: 0, color: '#1495EB' },
            { offset: 0.5, color: '#C0E2F9' },
            { offset: 1, color: '#ffffff' }
          ]
        )
      }},
      label: {
        normal: {
          show: false,
          position: 'center',
          formatter: (params) => {
            console.log(params, 'params');
          }
        }
      },
    }]
  };
  chart.setOption(option);
}
// 图表二
function setOptionTwo(chart, caloryArr, xdata, ydata) {
  const option = {
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter: function (value, index) {
        var that = this;
        console.log(caloryArr, 'qrrr');
        caloryArr.forEach(item => {
          if (item.xdata === value[0].name) {
            res2 = `${value[0].value}步\n${item.calory}cal`
          }
        })
        return res2;
      },
    },
    grid: {
      left: '14%',
      bottom: '10%',
      right: '5%'
    },
    xAxis: {
      data: xdata,
      axisLabel: {
        interval: 3
      },
      axisLine: {
        lineStyle: {
          color: '#AAAAAA'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
          color: ['rgba(152,152,152,.2)']
        }
      },
    },
    yAxis: [{
      type: 'value',
      scale: true,
      name: '步数',
      min: 0,
      axisLabel: {
        textStyle: {
          color: '#3C3939'
        },
        formatter: function (value, index) {
          return value;
        },
      },
      nameTextStyle: {
        color: '#3C3939'
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'solid',
          color: ['rgba(152,152,152,.2)']
        }
      },
      axisLine: {
        lineStyle: {
          color: '#AAAAAA',
          width: 1
        }
      },
    }],
    series: [{
      type: 'line',
      data: ydata,
      symbolSize: 6,
      lineStyle: {
        width: 1
      },
      itemStyle: {
        normal: {
          color: '#26A6FF',
          lineStyle: {
            color: '#26A6FF'
          },
        }
      },
      symbolSize: 6,
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0, 0, 0, 1,
            [
              { offset: 0, color: '#1495EB' },
              { offset: 0.5, color: '#C0E2F9' },
              { offset: 1, color: '#ffffff' }
            ]
          )
        }
      },
      label: {
        normal: {
          show: false,
          position: 'center',
          formatter: (params) => {
            console.log(params, 'params');
          }
        }
      },
    }]
  };
  chart.setOption(option);
}
Page({
  data: {
    loadingHidden: true,
    menuTapCurrent: 0,
    ecOne: {
      lazyLoad: true //延迟加载
    },
    ecTwo: {
      lazyLoad: true //延迟加载
    },
    timer: '',
    step: '',
    lastSeven: '',
    sum: '',
    evaluate: ''
  },
  loadingTap: function () {
    this.setData({
      loadingHidden: false
    });
    var that = this;
    setTimeout(function () {
      that.setData({
        loadingHidden: true
      });
      that.update();
    }, 3000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options) {
    // 获取上一个页面传递的参数
    console.log(options, 'option');
    this.oneComponent = this.selectComponent("#mychart-one");
    this.twoComponent = this.selectComponent("#mychart-two");
    var _this = this;
    this.getOneOption();
    this.getData();
  },
  // 获取数据
  getData(){
    var that = this;
    wx.getWeRunData({
      success(res) {
        // 拿 encryptedData 到开发者后台解密开放数据
        const encryptedData = res.encryptedData
        // 或拿 cloudID 通过云调用直接获取开放数据
        const cloudID = res.cloudID
        wx.cloud.init({ env: "env-khu8q" })
        wx.cloud.callFunction({
          name: 'login',
          data: {
            weRunData: wx.cloud.CloudID(cloudID),
            obj: {
              shareInfo: wx.cloud.CloudID(cloudID)
            }
          },
          success: res => {
            const result = res.result.event.weRunData.data.stepInfoList;
            // 今天的步数
            let last = result[result.length - 1].step;
            let lastTime = time.formatTime(result[result.length - 1].timestamp,'Y-M-D')
            // 调用接口上传步数
            wx.request({
              url:'http://enxcook.xcook.cn:8888/CookbookResourcePlatform-api/hulian/step/upLoadStep',
              data: {
                time: lastTime,
                stepcount: last,
                userId: '2022080674',
                client: 'microPro'
              },
              method: 'POST',
              header: {
                'content-type': 'application/json'
              },
              success(res){
                console.log(res);
              },
              fail(err){
                console.log(err);
              }
            })
            // 卡路里计算
            let calory = 65 * (last * 0.5 * 0.001) * 1.036;
            // 最近7天的步数
            let lastSeven = result.slice(-7);
            let sum = 0;
            lastSeven.forEach((item) => {
              sum += item.step;
            })
            that.setData({
              step: result[result.length - 1].step,
              calory: calory.toFixed(2)
            })
            if (sum <= 14000) {
              that.setData({
                evaluate: '运动量较低，请酌情增加运动量'
              })
            } else if (sum > 14000 && sum <= 35000) {
              that.setData({
                evaluate: '适当增加运动量更有益健康'
              })
            } else if (sum > 35000 && sum <= 70000) {
              that.setData({
                evaluate: '运动量较高，可根据身体状况适当调整'
              })
            } else {
              that.setData({
                evaluate: '运动量较高，请注意运动健康'
              })
            }
            // 最近7天数据
            console.log(lastSeven);
            // 今天的数据
            console.log(last);
          },
          fail: err => {
            console.log(err, '失败');
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  menuTap: function (e) {
    var that = this;
    var current = e.currentTarget.dataset.current;//获取到绑定的数据
    if (e.currentTarget.dataset.current == '1'){
      this.getTwoOption();
    }
    //改变menuTapCurrent的值为当前选中的menu所绑定的数据
    this.setData({
      menuTapCurrent: current
    });
  },
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);
  },

  init_one(caloryArr,xdata,ydata){
    this.oneComponent.init((canvas,width,height)=>{
      const chart = echarts.init(canvas, null,{
        width: width,
        height: height
      });
      setOption(chart, caloryArr, xdata, ydata)
      this.chart = chart;
      return chart;
    })
  },
  init_two(caloryArr,xdata,ydata){
    this.twoComponent.init((canvas,width,height)=>{
      const chart = echarts.init(canvas, null,{
        width: width,
        height: height
      });
      setOptionTwo(chart,caloryArr,xdata,ydata);
      this.chart = chart;
      return chart;
    });
  },
  getOneOption(){
    var _this = this;
    wx.getWeRunData({
      success(res) {
        const encryptedData = res.encryptedData
        const cloudID = res.cloudID
        wx.cloud.init({ env: "env-khu8q" })
        wx.cloud.callFunction({
          name: 'login',
          data: {
            weRunData: wx.cloud.CloudID(cloudID),
            obj: {
              shareInfo: wx.cloud.CloudID(cloudID)
            }
          },
          success: res => {
            const result = res.result.event.weRunData.data.stepInfoList;
            // 今天的步数
            let last = result[result.length - 1].step;
            // 卡路里计算
            let calory = 65 * (last * 0.5 * 0.001) * 1.036;
            // 最近7天的步数
            let lastSeven = result.slice(-7);
            let sum = 0;
            let xdata = [];
            let ydata = [];
            let caloryArr = [];
            lastSeven.forEach((item) => {
              sum += item.step;
              ydata.push(item.step);
              xdata.push(time.formatTime(item.timestamp, 'M-D'));
              caloryArr.push({
                xdata: time.formatTime(item.timestamp, 'M-D'),
                ydata: item.step,
                calory: (65 * (item.step * 0.5 * 0.001) * 1.036).toFixed(2)
              })
            })
            _this.init_one(caloryArr,xdata,ydata);
          },
          fail: err => {
            console.log(err, '失败');
          }
        })
      }
    })
  },

  getTwoOption() {
    var _this = this;
    wx.getWeRunData({
      success(res) {
        const encryptedData = res.encryptedData
        const cloudID = res.cloudID
        wx.cloud.init({ env: "env-khu8q" })
        wx.cloud.callFunction({
          name: 'login',
          data: {
            weRunData: wx.cloud.CloudID(cloudID),
            obj: {
              shareInfo: wx.cloud.CloudID(cloudID)
            }
          },
          success: res => {
            const result = res.result.event.weRunData.data.stepInfoList;
            // 今天的步数
            let last = result[result.length - 1].step;
            // 卡路里计算
            let calory = 65 * (last * 0.5 * 0.001) * 1.036;
            // 最近7天的步数
            let lastThirty = result.slice(-30);
            let xdata = [];
            let ydata = [];
            let caloryArr = [];
            lastThirty.forEach((item) => {
              ydata.push(item.step);
              xdata.push(time.formatTime(item.timestamp, 'M-D'));
              caloryArr.push({
                xdata: time.formatTime(item.timestamp, 'M-D'),
                ydata: item.step,
                calory: (65 * (item.step * 0.5 * 0.001) * 1.036).toFixed(2)
              })
            })
            console.log(caloryArr, 'ppp');
            _this.init_two(caloryArr,xdata, ydata);
          },
          fail: err => {
            console.log(err, '失败');
          }
        })
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})