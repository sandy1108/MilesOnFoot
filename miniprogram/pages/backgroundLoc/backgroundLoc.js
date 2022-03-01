// pages/backgroundLoc.js

let that = null // 页面this指针变量

Page({

    /**
     * 页面的初始数据
     */
    data: {
        permissionStatus: "未知",
        latitude: 39.9086, // 地图中心纬度
        longitude: 116.3974, // 地图中心经度
        lastUpdateMilis: 0,
        lastReceiveLocTime: '',
        lastUpdateTime: '',
        movingRouteLineData: { color: '#888888', width: 10, points: [{longitude: 116.29845, latitude: 39.95933},{longitude: 117.29, latitude: 38.95}] },
        locationList: []
    },

    formateTime: function(date) {
        let hour = date.getHours()
        let minute = date.getMinutes()
        let seconds = date.getSeconds()
        return hour + ":" + minute + ":" + seconds
    },

    onLocationChange: function(data) {
        console.log("onLocationChange", data)
        console.log("onLocationChange: that", that)
        const time = new Date()
        const milis = Date.parse(time)
        const timeString = that.formateTime(time)
        console.log("onLocationChange: onLocationChange:", timeString)
        that.setData({
            lastReceiveLocTime: timeString
        })
        if ((milis - that.data.lastUpdateMilis) > 5000) {
            that.setData({
                lastUpdateMilis: milis,
                lastUpdateTime: timeString,
                longitude: data.longitude,
                latitude: data.latitude
            })
            that.data.movingRouteLineData.points.push(that.getPolyLinePointFromLocation(data))
            that.setData({
                movingRouteLineData: Object.assign({}, that.data.movingRouteLineData)
            })
            console.log('movingRouteLineData', that.data.movingRouteLineData)
        }
        // wx.setStorage("lastLocation", data)
        // wx.setStorage("lastUpdateTime", new Date())
    },

    getPolyLinePointFromLocation: function(data) {
        return {
            longitude: data.longitude,
            latitude: data.latitude
        }
    },

    requestPermission: function () {
        const that = this
        // wx.authorize({
        //   scope: 'scope.userLocationBackground',
        //   fail: function() {
        //     that.goToSettingsForPermission()
        //   }
        // })
        that.goToSettingsForPermission()
    },

    goToSettingsForPermission: function() {
        wx.getSetting({ 
            success(res){
              const permission = res.authSetting['scope.userLocationBackground']
              if(!permission) { //检查用户是否授权了后台定位，没有则引导授权
                openSetting()
              } else {
                //授权ok拉，执行下一步拉
                wx.showModal({ // 显示提示
                    content: '定位已经被用户授权了！',
                    success (res) {
                    }
                })
              }
            }
          })
          const openSetting = () => {
            wx.openSetting({
              success(res){
                console.log(res)
              }
            })
          }
    },

    startBackgroundLocationRecord: function () {
        const that = this
        wx.startLocationUpdateBackground({
            type: "gcj02",
            success: function(data) {
                console.log("startBackgroundLocationRecord success: ", data)
                wx.onLocationChange(that.onLocationChange)
            },
            fail: function(e) {
                console.log("startBackgroundLocationRecord fail: ", e)
                if (e.errMsg.indexOf('auth deny') !== -1) { // 如果是权限拒绝
                    wx.showModal({ // 显示提示
                        content: '你已经拒绝了定位权限，将无法获取到你的位置信息，点击前往开启',
                        success (res) {
                        if (res.confirm) { // 确认后
                            wx.openSetting() // 打开设置页，方便用户开启定位
                        }
                        }
                    })
                }
            },
            complete: function(data) {
                console.log("startBackgroundLocationRecord complete: ", data)
            },
        })
    },

    stopBackgroundLocationRecord: function () {
        const that = this
        wx.stopLocationUpdate({
            success: function(data) {
                console.log("stopBackgroundLocationRecord success: ", data)
            },
            fail: function(data) {
                console.log("stopBackgroundLocationRecord fail: ", data)
            },
            complete: function(data) {
                console.log("stopBackgroundLocationRecord complete: ", data)
                wx.offLocationChange(that.onLocationChange)
            },
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log("onLoad")
        that = this
        console.log("onLoad: that:", that)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        console.log("onShow")
        const that = this
        wx.getSetting({ 
            success(res){
              const permission = res.authSetting['scope.userLocationBackground']
              if(!permission) { //检查用户是否授权了后台定位，没有则引导授权
                that.setData({
                    permissionStatus: '用户未授权'
                })
              } else {
                //授权ok拉，执行下一步拉
                that.setData({
                    permissionStatus: '用户已授权'
                })
              }
            }
          })
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