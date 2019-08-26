// const APIDOMAIN = "http://192.168.8.90";
// const PAGEDOMAIN = "http://192.168.8.90";
const APIDOMAIN = "";
const PAGEDOMAIN = "";
const API = {
  'createImgCode': '/passport/captcha/createcode',
  'checkIsRegister': '/passport/register/onephone',
  'sendPhoneCode': '/passport/captcha/websend',
  'goRegister': '/passport/register/webdo',
  'setInviteSuccess': '/bkdx/kxinvactivity/inviteSuccess',
  'doLgoin': '/passport/denglu/do_app_new',
  'getInviteInfo': '/bkdx/kxinvactivity/inviteIndex',
  'getJsapiConfig': '/bkdx/kxinvactivity/jsapiConfig',
  'getNickName': '/bkdx/kxinvactivity/shareInfo',
  'checkIsOuath': '/bkdx/kxinvactivity/isOauth  ',
  'goOuath': '/bkdx/kxinvactivity/oauth',
};



// 滚动底部加载更多
function ScrollLoadManage(options) {
  this.isAjax = false;
  this.isFinish = false;
  this._bottom = 50, //滚动条距离底部的距离
  this.curpage = 1;
  this.$loading_tips = null; //必须
  Object.assign(this, options);
}
ScrollLoadManage.prototype = {
  constructor: ScrollLoadManage,
  /**
   * [scrollLoadContent 滚动高底部加载更多内容]
   * @param {string} contrainer  [容器]
   * @param {string} scrollTarget  [滚动内容]
   * @param {Function} callback  [description]
   * @return {[type]}   [description]
   */
  initScrollLoad: function (container,scrollTarget,callback){
      var that = this,
          timer = '',
          endTop = 0;

      $(container).scroll(function(ev){
        var $this = $(this),
          _scrollTop = $this.scrollTop(),
          win_height = $this.height(), //视窗高度
          doc_height = $(scrollTarget).height(); //文档高度
          
        var direction = null;

        if(_scrollTop - endTop > 0){
          direction = 1; //下        
        }else{
          direction = -1; //上       
        }
        endTop = _scrollTop;

        var loadFn = function(_page){
          if(timer){
            clearTimeout(timer);
          }
          timer = setTimeout(function(){
            if(callback && typeof callback === 'function'){
              callback(_page);
              that.curpage++;
            }
          },30);
        };
        if(doc_height - win_height - _scrollTop < that._bottom && direction == 1 && !that.isFinish && !that.isAjax){
          var _page = parseInt(that.curpage) + 1;
          loadFn(_page);
        }
      });
  }
}

//重定向页面
function jumpToUrl(name, paramsObj) {
  var partUrl = getUrlPath();
  window.location.href = partUrl +'/'+ name +'.html' + (paramsObj?'?'+$.param(paramsObj):'');
}

function getUrlPath() {
  var localUrl = window.location.href;
  var qindex = localUrl.indexOf('?');

  if(qindex > -1){
    localUrl = localUrl.substring(0, qindex);
  }

  var index = localUrl.lastIndexOf('/');
  var partUrl = localUrl.substring(0, index);
  return partUrl;
}

//获取url参数
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  // if(r != null) return r[2];
  if(r != null) return decodeURIComponent(r[2]);
  // if(r != null) return unescape(r[2]);
  return null;
}

//判断是否是微信浏览器
function isWeiXin(){
  var ua = window.navigator.userAgent.toLowerCase();
  //通过正则表达式匹配ua中是否含有MicroMessenger字符串
  if(ua.match(/MicroMessenger/i) == 'micromessenger'){
    return true;
  }else{
    return false;
  }
}

// 判断是否是正确的手机号码
function isPhone(phone) {
  return /^1[2,3,4,5,6,7,8,9]\d{9}$/g.test(phone)
}

//toast
function toast(content, type, time) {
  $.dialog({
    type: type || 'tips',
    infoText: content,
    autoClose : time || 1500
  });
}


//倒计时
function CountDown(options) {
  this._timer = null;
  this._time = 0; //已经走过的时长
  this.everyTimeCallBack = function() {};
  this.finishCallBack = function() {};
  this.totalTime = 60; //60秒
  Object.assign(this, options)
}
CountDown.prototype = {
  constructor: CountDown,
  start: function() {
    let that = this;
    that.everyTimeCallBack && that.everyTimeCallBack(that.totalTime)
    that.timer = setInterval(function() {
      that._time++;
      that.everyTimeCallBack && that.everyTimeCallBack(that.totalTime - that._time)
      if(that.totalTime == that._time) {
        that.finishCallBack && that.finishCallBack(that.totalTime)
        clearInterval(that.timer)
      }
    }, 1000)
  },
  pause: function() {},
  stop: function() {},
  reset: function() {
    this._time = 0;
  },
}

// 检测是否微信登录
function checkIsOuath() {
  return new Promise(function(resolve, reject) {
    if(!isWeiXin()) return false;
    $.ajax({
      type: "post",
      url: APIDOMAIN + API.checkIsOuath,
      data: {},
      dataType: "json",
      success: function (res) {
        if(res.code === '200') {
          if(res.extraData.is_oauth == 0){
            var localUrl = window.location.href;
            window.location.href = PAGEDOMAIN + API.goOuath + '?url='+localUrl
          }
          resolve();
        }else {
          reject();
        }
      },
      fail:function() {
        reject();
      }
    })
  })
}
