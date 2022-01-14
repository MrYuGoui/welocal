Page({
  data: {
    device: '',
    service: '',
    lon: "", //经度
    lat: "", //纬度
    alt: "", //高度
    speed: "", //速度
    acc: "", //精确度
    va: "", //垂直精度
    ha: "", //水平精度
    sors: "启动"
  },
  deviceInput: function (e) {
    this.data.device = e.detail.value;
  },
  serviceInput: function (e) {
    this.data.service = "http://"+e.detail.value+"/outdoorlable/push/mini";
  },
  switchButton: function () {
    var that = this;
    if (that.data.device.length === 0 || that.data.service.length === 0) {
      // 没有填写参数
      wx.showToast({
        title: '请完整填写以上参数！',
        icon: 'none',
        duration: 1500
      })
    } else if(that.data.device.indexOf(" ")!=-1 || that.data.service.indexOf(" ")!=-1){
      // 参数中有空格
      wx.showToast({
        title: '参数中有空格！',
        icon: 'none',
        duration: 1500
      })
    }else {
      // 格式没问题，进行启停判断
      if (that.data.sors === "启动") {
        that.setData({
          sors: "停止"
        }),
        wx.showToast({
          title: '开始推送数据',
          icon: 'success',
          duration: 500
        })
      } else {
        that.setData({
          sors: "启动"
        }),
        wx.showToast({
          title: '停止推送数据',
          icon: 'error',
          duration: 500
        })
      }
    }
  },
  onReady: function (options) {
    var that = this;
    wx.startLocationUpdateBackground({
      success: (res) => {
        console.log("开启后台定位", res)
        wx.onLocationChange(function (res) {
          that.setData({
            lon: res.longitude,
            lat: res.latitude,
            alt: res.altitude,
            speed: res.speed,
            acc: res.accuracy,
            va: res.verticalAccuracy,
            ha: res.horizontalAccuracy
          })
          if (that.data.sors === "停止") {
            wx.request({
              url: that.data.service,
              data: {
                "lon": that.data.lon,
                "lat": that.data.lat,
                "deviceId": that.data.device,
                "alt":that.data.alt,
                "acc":that.data.acc,
                "speed":that.data.speed
              },
              method: "GET",
              success(res) {
                console.log("推送到"+that.data.service)
              },
              fail(res) {
                that.setData({sors:"启动"})
                wx.showToast({
                  title: '推送失败，请核实服务地址正常，并确认处于IP白名单中，或联系后台管理员',
                  icon: 'none',
                  duration: 2000
                })
                console.log("失败了")
              }
            })
          }
        })
      },
      fail: (res) => {
        console.log("开启定位失败", res)
        wx.showToast({
          title: '开启定位失败，请联系后台管理员',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },
  	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		  })
	}
})