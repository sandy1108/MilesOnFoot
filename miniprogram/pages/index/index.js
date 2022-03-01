const app = getApp()
Page({
  tomap () {
    wx.navigateTo({
      url: '../map/map'
    })
  },
  toBackgroundLocation () {
    wx.navigateTo({
      url: '../backgroundLoc/backgroundLoc'
    })
  },
  toWeRun () {
    wx.navigateTo({
      url: '../werun/werun'
    })
  },
  onShareAppMessage () {
    return {
      title: '快来使用LBS定位小工具',
      imageUrl: '../../asset/logo.png'
    }
  }
})
