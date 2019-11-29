/** * 启动ios APP地址 */
var iosAppUrl = "";

/** * 启动安卓 APP地址 */
var androidAppUrl = "";

/** * AppStore下载地址 */
var iosAppStore = "";

/** * 安卓安装包下载地址 */
var androidApk = "";

/** * QQ应用宝 */
var appQQ = "";

/**
* 移动终端浏览器版本信息
* @method browserInfo 
*/

function browserInfo() {
    return {
        versions: function () {
            var u = navigator.userAgent,
                app = navigator.appVersion;

            return { //移动终端浏览器版本信息
                weixin: u.match(/MicroMessenger/i) == 'MicroMessenger',//是否为微信浏览器
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                // qq: u.match(/\sQQ/i) !== null, //是否QQ
                //Safari: u.indexOf('Safari') > -1,//Safari浏览器,
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
}


/**
* 版本检测
* @method detectVersion 版本检测
* @return {返回值类型} isAndroid, isIOS, isIOS9 true或false
*/

function detectVersion() {
    let isAndroid, isIOS, isIOS9, version,
        u = navigator.userAgent,
        ua = u.toLowerCase();

    //android终端或者uc浏览器
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        isAndroid = true
    }

    //ios
    if (ua.indexOf("like mac os x") > 0) {
        var regStr_saf = /os [\d._]*/gi;
        var verinfo = ua.match(regStr_saf);
        version = (verinfo + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, ".");
    }

    var version_str = version + "";

    if (version_str != "undefined" && version_str.length > 0) {
        version = parseInt(version)
        console.log('iso version', version)
        if (version >= 8) {
            // ios9以上
            isIOS9 = true
        }else{
          isIOS = true
        }
    }

    return { isAndroid, isIOS, isIOS9 }
}

/**
* 判断手机上是否安装了app，如果安装直接打开url，如果没安装，执行callbackUrl
* @method openApp 打开App
* @param {参数类型} url 启动app地址
* @param {参数类型} callbackUrl 回调地址app(下载地址)
* @return {返回值类型} 返回值说明
*/

function openApp(url, callbackUrl) {
    let { isAndroid, isIOS, isIOS9 } = detectVersion()

    if (isAndroid || isIOS) {
        var timeout, 
            t = 3000, 
            hasApp = true;

        setTimeout(function () {
            if (!hasApp) {
              // if(window.confirm("调起APP失败，请确保已安装掌通校园APP，没有安装，点击确定前往安装，"))
              callbackUrl && (window.location.href = callbackUrl);
            }
            document.body.removeChild(ifr);
        }, 4000)

        var t1 = Date.now();
        // var ifr = document.createElement("iframe");
        // ifr.setAttribute('src', url);
        // ifr.setAttribute('style', 'display:none');
        // document.body.appendChild(ifr);

        window.location.href = url;

        timeout = setTimeout(function () {
            var t2 = Date.now();
            if (t2 - t1 < t + 100) {
                hasApp = false;
            }
        }, t);
    }

    if (isIOS9) {
        location.href = url;

        setTimeout(function () {
          callbackUrl && (window.location.href = callbackUrl);
        }, 250);

        setTimeout(function () {
          location.reload();
        }, 1000);
    }
}


