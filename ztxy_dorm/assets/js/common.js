const APIDOMAIN = "http://219.135.147.236:9901";
// const APIDOMAIN = "http://192.168.8.90";
const PAGEDOMAIN = "http://192.168.8.90";
// const APIDOMAIN = "";
// const PAGEDOMAIN = "";
const API = {
  'getDormScoreRecord': '/ydzt/parent_dormscore/getDormScoreRecord',
  'getDormPublicProcess': '/ydzt/parent_dormscore/getDormPublicProcess',
};



// 滚动底部加载更多
function ScrollLoadManage(options) {
  this.isAjax = false;
  this.isFinish = false;
  this._bottom = 50, //滚动条距离底部的距离
  this.curpage = 1;
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
  },
  reset: function() {
    this.curpage = 1;
    this.isFinish = false;
    this.isAjax = false;
  }
}

//获取url参数
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r != null) return decodeURIComponent(r[2]);
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

/**
 *对Date的扩展，将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *例子：
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 * version 1.0
 */
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
			.substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};