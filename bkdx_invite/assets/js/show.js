// 活动首页
$(function(){
  let $invite_list_box = $('.invite-list-box'),
      $list_content = $('.list-content');

  //  // 初始化
  //  var vConsole = new VConsole();
  //  console.log('VConsole is cool');

   //在微信浏览器中，检测是否获得了openid
  checkIsOuath();
  getPageInfo();

  // 查看规则
  $('.look-rule').on('click', function() {
    $('.activity-rules').show();
  });
  // 关闭规则弹窗
  $('.activity-rules .close-btn').on('click', function() {
    $('.activity-rules').hide();
  });

  // 邀请
  $('.invite-btn').on('click', function() {
    $('.share-tips').show();
  });
  
  // 关闭邀请
  $('.share-tips').on('click', function () {
    $('.share-tips').hide();
  });

  // 滚动加载更多
  // const scrollLoadManage = new ScrollLoadManage();
  // scrollLoadManage.initScrollLoad($invite_list_box, $list_content, scrollBottomCallback);
  // function scrollBottomCallback(page) {
  //   console.log(page);
  //   if(page <= 10) {
  //     getInviteList()
  //   }
  // }

  function fillInviteList(lisData) {
    if(lisData.length == 0) return;
    let _html = `<li class="title">
                    <div class="rank">排名</div>
                    <div class="nickName">用户</div>
                    <div class="num">邀请人数</div>
                </li>`;
    for (let i = 0; i < lisData.length; i++) {
      if(i == 0){
        _html += `<li class="fontRed">
                      <div class="rank"><span class="icon first"></span></div>
                      <div class="nickName">${ lisData[i]['nickname'] ? lisData[i]['nickname'] : "-" }</div>
                      <div class="num">${ lisData[i]['count'] }</div>
                  </li>`;  
      }else if(i == 1){
        _html += `<li class="fontRed">
                      <div class="rank"><span class="icon second"></span></div>
                      <div class="nickName">${ lisData[i]['nickname'] ? lisData[i]['nickname'] : "-" }</div>
                      <div class="num">${ lisData[i]['count'] }</div>
                  </li>`; 
      }else if(i == 2){
        _html += `<li class="fontRed">
                      <div class="rank"><span class="icon third"></span></div>
                      <div class="nickName">${ lisData[i]['nickname'] ? lisData[i]['nickname'] : "-" }</div>
                      <div class="num">${ lisData[i]['count'] }</div>
                  </li>`; 
      }else{
        _html += `<li>
                    <div class="rank"><span class="number">${i + 1}</span></div>
                    <div class="nickName">${ lisData[i]['nickname'] ? lisData[i]['nickname'] : "-" }</div>
                    <div class="num">${ lisData[i]['count'] }</div>
                </li>`;
      }
    }
    $list_content.html(_html);            
  }

  function getPageInfo() {
    $.ajax({
      type: "get",
      url: APIDOMAIN + API.getInviteInfo,
      data: {},
      dataType: "json",
      success: function (res) {
        console.log(res)
        if(res.code === '200'){
          var info = res.extraData;
          var uid = info.uid;
          var ranking_list = info.ranking_list;

          $('.invite-count').html(info.count ? info.count: '0');
          $('.prize').html(info.prize ? info.prize: '--');
          // alert(uid)
          fillInviteList(ranking_list)
          if(isWeiXin()) {
            getWxconfig(uid) //配置微信分享
          }
        }else if(res.code === '9001'){
          toast(res.message)
          jumpToUrl('login')
        }else{
          toast(res.message)
        }
      }
    });
  }
  
})