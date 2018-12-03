import axios from 'axios'
import {UrlSearch, getSession, setSession, rid, getDevice} from './util';
import api from './api'

function Log (){
  var _self = this;
  var category = {
    ENTER: 'enter', // 进入页面 actions = ['pageEnter', 'routeChange']
    LEAVE: 'leave', // 离开  actions = ['position', 'mediaStatus', ...]
    OPERATION: 'userOperation', //用户主动操作   actions = ['click', 'touchstart', 'play', ...]
    ERROR: 'error', // 页面错误 actions = ['pageError', 'routeError', ...]
    CAPABILITY: 'capability', // 性能  actions = ['loadtime', ...]
    USER: 'user', //用户信息 actions = ['phone', ...]
    SHARE: 'share', //分享 actions = ['share', ...]
    MEDIA: 'media',  //视频 actions = ['videoEnd', ‘videoStart’， ...]
    SUBMIT: 'submit' //提交表单成功事件
  }
  var sendLog = function (category, action, content, option) {
    var url = window.location.href,
        route = window.location.pathname,
        query = UrlSearch(url),
        deviceData = getDevice();
    var device = {
      model: deviceData.model,  //手机型号
      pixelRatio: window.devicePixelRatio,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      // "brand": "devtools", //手机品牌
      system: deviceData.system, //操作系统版本
      language: navigator.language,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      platform: navigator.platform
    }
    var form = {
      appId: 'imba-landingpage',
      vvId: getSession('vvId'),
      pvId: getSession('pvId'),
      devTime: rid('format'), //客户端时间
      url: window.location.href,
      route: route,
      title: document.title,
      query: query,
      device: device,
      event: {
        category: category,
        action: action,
        content: content
      }
    }
    if(option && option instanceof Object){
      form = Object.assign(form, option);
    }
    axios.defaults.headers.common['log-version'] = '1';
    axios.post(api.log, form).then().catch((err)=>{
      console.log(err)
    });
  }
  this.enter = function(){
    window.startTime = new Date().getTime();
    var vvId = getSession('vvId') || rid();
    setSession('vvId', vvId);
    var pvId = rid();
    setSession('pvId', pvId);
    sendLog(category.ENTER,'enter');
  };
  this.leave = function(){
    var prev = {
      url: window.location.href,
      route: window.location.pathname,
      pvId: getSession('pvId')
    };
    setSession('prev', JSON.stringify(prev));
    sendLog(category.LEAVE,'leave',{duration:  new Date().getTime() -  Number(window.startTime)});
  };
  this.click = function(event, data = {}, describe){
    if(!data.targetName){
      data.targetName = 'getPhone';
    }
    if(!data.type){
      data.type = 'button'
    }
    if(event.changedTouches){
      data.pageX = event.changedTouches[0].pageX;
      data.pageY = event.changedTouches[0].pageY;
    } else {
      data.pageX = event.pageX;
      data.pageY = event.pageY;
    }
    let {phone, index} = data;
    sendLog(category.OPERATION,'click',describe,{click: data, ...{phone, index}});
  };
  this.pageLoad = function(){
    window.addEventListener('load',function () {
      sendLog(category.CAPABILITY,'pageLoad',{duration:  new Date().getTime() -  Number(window.startTime)});
    });
  };
  this.share = function(obj){
    sendLog(category.SHARE,'share','shareAppMessage', {share: obj});
  };
  this.error = function(str){
    sendLog(category.ERROR,'pageError',{message:str});
  };
  this.videoStart = function(media){
    sendLog(category.MEDIA,'videoStart',{}, {media: media});
  };
  this.videoEnd = function(media){
    sendLog(category.MEDIA,'videoEnd',{}, {media: media});
  };

  var _listen = function () {
    // 加载事件
    _self.pageLoad()
    // 离开页面事件
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState == 'hidden') {
        _self.leave();
      }
    })
  }
  _listen();
}
var SingerLog = new Log();
export default SingerLog;