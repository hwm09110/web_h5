// 用户注册页
$(function() {
  let isGetPhoneCode = false;
  let $phone = $('.phone');
  let $imgCode = $('.imgCode');
  let $getcode = $('.getcode');
  let $picCode = $('.picCode img');
  let inviterUid = getUrlParam('uid');

  if(inviterUid) {
    getInviteName()
  }else{
    $('.title').html('欢迎加入报考大学').css('text-align', 'center');
  }

  $picCode.attr('src', APIDOMAIN + API.createImgCode);
  $picCode.on('click', function() {
    $(this).attr('src', `${ APIDOMAIN + API.createImgCode }?t=${ Date.now() }`);
  })

  const countDown = new CountDown({totalTime: 60, everyTimeCallBack:countdownCallback, finishCallBack: countdownFinish});

  function countdownFinish() {
    countDown.reset();
    isGetPhoneCode = false;
    $getcode.html('重新获取');
  }
  function countdownCallback(time) {
    console.log(time);
    $getcode.html(`${time}s后获取`);
  }

  // 获取短信验证码
  $getcode.on('click', function() {
    var phone = $phone.val(),
        imgCode = $imgCode.val();

    if(!phone.trim()){
      toast('请先输入手机号码');
      return;
    }
    if(!imgCode.trim()){
      toast('请先输入图形验证码');
      return;
    }
    if(!isGetPhoneCode){
      sendPhoneCode(phone, imgCode)
    }
  });

  //光标离开验证
  $('.phone').on('blur', function(){
    var phone = $(this).val();

    if(phone.trim()){
      if(isPhone(phone)){
        checkPhoneIsReg(phone);
      }else{
        toast('手机号码格式不正确');
      }
    }
  });

  //input - 聚焦
  $('input').on('focus', function(){
    $('.register-btn').addClass('onfocus');
  });
  //input - 失焦
  $('input').on('blur', function(){
    $('.register-btn').removeClass('onfocus');
  });


  //注册
  $('.register-btn').on('click', function() {
    var phone = $('.phone').val(),
        phoneCode = $('.phoneCode').val(),
        imgCode = $('.imgCode').val(),
        pwd = $('.pwd').val();
      
    if(!phone.trim()) {
      toast('请输入手机号');
      return false;
    }
    if(!isPhone(phone)) {
      toast('手机号码格式不正确');
      return false;
    }
    if(!phoneCode.trim()) {
      toast('请输入短信验证码');
      return false;
    }
    if(!imgCode.trim()) {
      toast('请输入右侧验证码');
      return false;
    }
    if(!pwd.trim()) {
      toast('请输入密码');
      return false;
    }
    if(pwd.length < 6 || pwd.length > 20) {
      toast('请输入6-20位的密码');
      return false;
    }

    let post_data = {
      phone,
      verifycode: phoneCode,
      pwd,
    };

    $.ajax({
      type: "post",
      url: APIDOMAIN + API.goRegister,
      data: post_data,
      dataType: "json",
    })
    .done(function(res) {
      if(res.code === '200'){
        inviteSucc(res.extraData);
      }else{
        toast(res.message);
      }
    })
    .fail(function() {
      toast('注册失败');
    })
    .always()
  });


  //检测手机号码是否注册过
  function checkPhoneIsReg(phone) {
    $.ajax({
			url : APIDOMAIN + API.checkIsRegister,
			type : "get",
			data : {str: phone},
			dataType : "json",
			success : function(res){
				if(res.code == 200){
					toast('恭喜你，该手机号码可以注册')
				}else{
					toast('手机号码已被注册')
				}
			}
		});
  }

  //发送短信验证码
  function sendPhoneCode(phone, imgCode) {
    $.ajax({
      type: 'post',
      url : APIDOMAIN + API.sendPhoneCode,
      data:{phone:phone, vcode:imgCode, yong:1},
      dataType: 'json',
      success: function (res) {
        if(res.code == 200){
          toast(res.message)
          isGetPhoneCode = true
          countDown.start(); //开启倒计时
        }else{
          $imgCode.val('').focus();
          $picCode.trigger('click');
          toast(res.message)
          return false;
        }
      }
      })
  }

  //邀请注册
  function inviteSucc(numberId) {
    $.ajax({
			type: 'post',
			url: APIDOMAIN + API.setInviteSuccess,
			data: {
				'uid': inviterUid,
				'number': numberId,
      },
      dataType: "json",
			success: function(res){
        if(res.code === '200'){
          $.dialog({
            type : 'tips',
            infoText : '注册成功',
            autoClose : 2500,
            onClosed: function(){
              jumpToUrl('register-succ')
            }
          });
        }else{
          toast(res.message)
        }
			}
		})
  }

  function getInviteName() {
    $.ajax({
			type: 'get',
			url: APIDOMAIN + API.getNickName,
			data: {
				'uid': inviterUid,
      },
      dataType: "json",
			success: function(res){
        if(res.code === '200'){
          var nickname = res.extraData.nickname;
          $('.nickName').html(nickname);
        }
			}
		})
  }
})