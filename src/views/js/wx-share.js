import axios from 'axios';
import wx from 'weixin-js-sdk';
import singerLog from './log';
import api from './api';

export default {
  getSign(){
    let url = encodeURIComponent(window.location.href);
    axios({
      url: api.getSign + url,
      method: 'get'
    }).then(res => {
      wx.config({
        debug: false,
        appId: res.data.item.appId,
        timestamp: res.data.item.timestamp,
        nonceStr: res.data.item.nonceStr,
        signature: res.data.item.signature,
        jsApiList: [
          'onMenuShareAppMessage',
          'onMenuShareTimeline',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'onMenuShareQZone'
        ]
      });
    })
  },

  // title:title, // 分享标题
  // desc:desc, // 分享描述
  // imgUrl:imgUrl, // 分享图标
  // link: link, // 分享链接
  commonShare(obj, fn = null){
    this.getSign();
    let {title, desc, link = window.location.href} = obj;
    let shareLog = {
      shareTitle : title,
      shareDesc : desc,
      sharePath : link,
      source: 0
    }
    let params = {
      ...obj,
      success: function () {
        singerLog.share({...shareLog, isSuccess: true});
        fn && fn();
        return true;
      },
      cancel: function () {
        singerLog.share({...shareLog, isSuccess: false});
        // 用户取消分享后执行的回调函数
      },
      fail: function () {
        singerLog.share({...shareLog, isSuccess: false});
        alert('服务器生气了,程序员哥哥正在安慰它!!!');
      }
    };
    wx.ready(function () {
      wx.onMenuShareTimeline(params);
      wx.onMenuShareAppMessage(params);
      wx.onMenuShareQQ(params);
    })
  }

}