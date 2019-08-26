// 微信自定义分享内容配置
const partUrl = getUrlPath();

function getShareOptions(uid){
	var share_title = "报考大学",
			share_link = partUrl + '/register.html?uid='+uid,
			share_desc = '报考大学-开学邀请注册有礼',
			share_imgurl = 'http://www.baokaodaxue.com/web/h5/bkdxinvite/assets/img/bg1.png'; //报考大学

	setShareOptions(share_title, share_link, share_imgurl, share_desc);
}


function getWxconfig(uid){
	$.getJSON(APIDOMAIN + API.getJsapiConfig, { url: window.location.href }, function(res) {
		console.log(res)
		if(res.code == 200){
			setWXConfig(res.extraData);
			getShareOptions(uid);
		}
	});
}

function setWXConfig(config) {
		wx.config({
				// debug: USER_UID == 668775?true:false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: config.appId, // 必填，公众号的唯一标识
				timestamp: config.timestamp, // 必填，生成签名的时间戳
				nonceStr: config.nonceStr, // 必填，生成签名的随机串
				signature: config.signature, // 必填，签名，见附录1
				// jsApiList: ['updateAppMessageShareData','updateTimelineShareData']
				jsApiList: [
					'onMenuShareAppMessage',
					'onMenuShareTimeline',
					'onMenuShareQQ',
					'onMenuShareQZone'
				]
		});
}

function setShareOptions(title,link,imgUrl,desc){
		console.log('分享内容', title,link,imgUrl,desc);
		wx.ready(function(){
			// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
			//分享到朋友圈
			wx.onMenuShareTimeline({
					title: title, // 分享标题
					desc: desc,
					link: link, // 分享链接
					imgUrl: imgUrl, // 分享图标
					success: function () {
					},
					cancel: function () {
							// 用户取消分享后执行的回调函数
					}
			});
			// “分享给朋友”
			wx.onMenuShareAppMessage({
					title: title,
					desc: desc,
					link: link,
					imgUrl: imgUrl,
					trigger: function (res) {
						console.log(res)
					},
					success: function (res) {
						console.log(res)
					},
					cancel: function (res) {
						console.log(res)
					},
					fail: function (res) {
						console.log(res)
					}
			});
			//分享到qq
			wx.onMenuShareQQ({
					title: title, // 分享标题
					desc: desc, // 分享描述
					link: link, // 分享链接
					imgUrl: imgUrl, // 分享图标
					success: function () {
					},
					cancel: function () {
					}
			});
			//分享到qq空间
			wx.onMenuShareQZone({
					title: title, // 分享标题
					desc: desc, // 分享描述
					link: link, // 分享链接
					imgUrl: imgUrl, // 分享图标
					success: function () {
					},
					cancel: function () {
					}
			});
		});
		wx.error(function(res){
			// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
			console.log('wx.error', res)
		});
}
