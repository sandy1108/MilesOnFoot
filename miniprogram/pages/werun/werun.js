// pages/werun/werun.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    goToSettingsForPermission: function() {
        // wx.authorize({
        //   scope: 'scope.werun',
        // })
        wx.getSetting({ 
            success(res){
              const permission = res.authSetting['scope.werun']
              if(!permission) { //检查用户是否授权了微信运动数据获取权限，没有则引导授权
                openSetting()
              } else {
                //授权ok拉，执行下一步拉
                wx.showModal({ // 显示提示
                    content: '微信运动数据共享已经被用户授权了！',
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

    doWeixinLogin: function () {
        console.log('doWeixinLogin start')
        wx.login({
          timeout: 60000,
          success: function(data) {
            console.log('doWeixinLogin: ', data)
            wx.showModal({
                title: '微信登录信息获取成功',
                content: data.code
            })
          },
          fail: function(e) {
            console.log('doWeixinLogin fail:', e)
          }
        })
    },

    fetchWeChatRunData: function () {
        wx.getWeRunData({
            success (res) {
                console.log("fetchWeChatRunData: getWeRunData success: ", res)
                wx.showModal({
                    content: '获取微信运动步数成功！'
                })
                // 拿 encryptedData 到开发者后台解密开放数据
                const encryptedData = res.encryptedData
                // 或拿 cloudID 通过云调用直接获取开放数据
                const cloudID = res.cloudID
            },
            fail: function(e) {
                console.log("fetchWeChatRunData fail: ", e)
                if (e.errMsg.indexOf('auth deny') !== -1) { // 如果是权限拒绝
                    wx.showModal({ // 显示提示
                        content: '你已经拒绝了获取微信运动数据的权限，将无法获取到你的微信运动数据，点击前往开启',
                        success (res) {
                            if (res.confirm) { // 确认后
                                wx.openSetting() // 打开设置页，方便用户开启权限
                            }
                        }
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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