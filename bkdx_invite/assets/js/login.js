// 登录
$(function() {
  const partUrl = getUrlPath();
  const backToUrl = 'http://www.baokaodaxue.com/web/h5/bkdxinvite/show.html';
  const loginByThirdUrl = {
    qq: '/passport/index/qq?backto='+backToUrl,
    wx: '/passport/index/weixinapp?backto='+backToUrl,
    wb: '/passport/index/weibo?backto='+backToUrl,
  };
  
  // 登录
  $('.login-btn').on('click', function() {
    var phone = $('.phone').val(),
        pwd = $('.pwd').val();
      
    if(!phone.trim()) {
      toast('请先输入手机号码')
      return false;
    }
    if(!isPhone(phone)) {
      toast('手机号码格式不正确');
      return false;
    }
    if(!pwd.trim()) {
      toast('请输入密码');
      return false;
    }

    let post_data = {
      dev: 1,
      phone: phone,
      pwd: pwd
    };

    $.ajax({
      url: APIDOMAIN + API.doLgoin,
      type: "post",
      data: post_data,
      dataType: "json",
    })
    .done(function(res) {
      if(res.code === '200'){
        jumpToUrl('show')
      }else{
        toast(res.message);
      }
    })
    .fail()
    .always()
  });

  // 新用户注册
  $('.register-btn').on('click', function() {
    jumpToUrl('register')
  });

  // 第三方登录
  $('.login-ways').on('click', 'li', function() {
    var index = $(this).index();
    var jumpUrl = '';

    switch(index){
      case 0:
        jumpUrl = loginByThirdUrl.qq;
      break;
      case 1:
        jumpUrl = loginByThirdUrl.wx;
      break;
      case 2:
        jumpUrl = loginByThirdUrl.wb;
      break;
    }
    jumpUrl ? (window.location.href = jumpUrl) : null;
  });
  
})