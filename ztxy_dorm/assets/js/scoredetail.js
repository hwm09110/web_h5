// 分数明细
$(function() {
  var stu_guid = getUrlParam('stu_guid');
  var pageType = $('.top-nav li.active').data('type'); //1:分数明细 2：处理记录

  // 切换tab
  $('.top-nav').delegate('li', 'click', function(){
    var type = $(this).data('type');
    var url = '';
    if(type == 1){
      url = `./scoredetail.html?stu_guid=${stu_guid}`;
    }else if(type == 2){
      url = `./dealdetail.html?stu_guid=${stu_guid}`;
    }
    window.location.href = url;
  });

  // 实例化datePick
  var dtPicker = new mui.DtPicker({
    type:'date',
    beginYear: 1990
  });

  var $query_modal_wrap = $('.query-modal-wrap'),
      $query_modal_box = $('.query-modal-box'),
      $stime = $query_modal_box.find('.stime'),
      $etime = $query_modal_box.find('.etime'),
      $query_btn = $query_modal_box.find('.query-btn'),
      $detail_list = $('.detail-list');


  var openQueryModal = function(){
    $query_modal_wrap.show();
    ModalHelper.afterOpen();
  };

  var closeQueryModal = function(){
    ModalHelper.beforeClose();
    $query_modal_wrap.hide();
  };

  //打开选择条件弹层
  $('.header-wrap .more-icon').on('click', function() {
    if($query_modal_wrap.is(":visible")){
      closeQueryModal();
    }else{
      openQueryModal();
    }
  });

  //点击mask关闭弹层
  $query_modal_wrap.on('click', function(ev){
    if(ev.target == $query_modal_wrap.get(0)) {
      closeQueryModal();
    }
  });

  // 检索条件-单选项选择
  $query_modal_box.delegate('.select-item', 'click', function(){
    $(this).addClass('selected').siblings().removeClass('selected');
  });

  // 检索条件-选择时间范围
  $query_modal_box.delegate('.stime, .etime', 'click', function(){
    var $this = $(this),
        dateValue = $this.html();

    dtPicker.show(function (selectItems) {
      console.log(selectItems);
      $this.html(selectItems.value)
    });
    
    if(dateValue){
      setDatePickDefaultDate(dateValue)
    }

    // 置近一个周、近一个月...为不选中
    $('.timeType div').removeClass('selected');
    $('.dateTime .stime,.dateTime .etime').addClass('selected');
  });

  // 选择近一周、近一个月...
  $('.timeType div').on('click', function(){
    $('.dateTime .stime,.dateTime .etime').removeClass('selected');
  });

  //设置默认时间范围默认当月
  function setDefaultDate() {
    var oDate = new Date(),
        year = oDate.getFullYear(),
        month = oDate.getMonth() + 1 < 10 ? '0'+(oDate.getMonth() + 1) : (oDate.getMonth() + 1);
    var stime = year +'-'+ month +'-'+ '01';
    var nowDate = (new Date()).Format("yyyy-MM-dd");

    $stime.html(stime);
    $etime.html(nowDate);
  }
  setDefaultDate()

  //设置日期组件默认选中时间
  function setDatePickDefaultDate(date) {
    dtPicker.setSelectedValue(date)
  }

  //获取选择条件值
  var getQueryCond = function() {
    var query = {
      bdate: "",
      edate: "",
      time_type: "",
      for_type: "",
      action_type: "",
    };
    var $selectedTimeType = $('.timeType').find('.selected'),
        $stime = $('.dateTime .stime'),
        $etime = $('.dateTime .etime'),
        $selectedDealObj = $('.dealObj').find('.selected'),
        $selectedDealType = $('.dealType').find('.selected');
    
    if($selectedTimeType.length > 0){
      query.time_type = $selectedTimeType.data('type');
    }else{
      query.bdate = $stime.html();
      query.edate = $etime.html();
    }
    query.for_type = $selectedDealObj.data('type');
    query.action_type = $selectedDealType.data('type');
    
    return query;
  }
  
  //确定搜索
  $query_btn.on('click', function(){
    var queryParams = getQueryCond();
    console.log(queryParams);
    closeQueryModal();
    // //回到顶部
    // $('html, body').animate({"scrollTop":0}, 50, function() {
    // });
    $detail_list.html("");
    getList(1);
    scrollLoadManage.reset();
  });

  //渲染数据（分数明细）
  function renderScoreData(datas, curpage) {
    var _html =  '';
    if(datas.length == 0){
      if(curpage == 1){
        _html = '<div class="nodataTips">没有相关数据哦</div>';
      }else{
        _html = '<div class="nodataTips">已经到底了哦</div>';
      }
    }else{
      $.each(datas, function(index, item){
          _html +=  `<div class="list-item">
                      <div class="left">
                        <img src="http://www.33lc.com/article/UploadPic/2012-7/201272513538110.jpg" alt="portrait">
                      </div>
                      <div class="right">
                        <div class="middle">
                          <h2>
                            ${item.for_type==1?
                              (item.stu_name+'<span class="class_name">'+item.class_name+'</span><span class="room">宿舍'+item.room_name+'</span>')
                              :('宿舍'+item.room_name)
                            }
                          </h2>
                          <div class="info">
                            <h3>${item.rule_name}</h3>
                            <p>${item.detail_name}</p>
                          </div>
                          <div class="other">
                            <span class="publisher">发布人：${item.insert_operator_name}</span>
                            <span class="time">${item.date}</span>
                          </div>
                        </div>
                        <div class="score">
                          <strong class="${item.action_type==1?"plus":"reduce"}">${item.action_type==1?"+":"-"}${item.score}</strong>
                          <span>分</span>
                        </div>
                      </div>
                  </div>`;
      })
    }
    $detail_list.append(_html);
  }

  //渲染数据（处理记录）
  function renderDealData(datas, curpage) {
    var _html =  '';
    if(datas.length == 0){
      if(curpage == 1){
        _html = '<div class="nodataTips">没有相关数据哦</div>';
      }else{
        _html = '<div class="nodataTips">已经到底了哦</div>';
      }
    }else{
      $.each(datas, function(index, item){
          _html +=  `<div class="list-item">
                      <div class="left">
                        <img src="http://www.33lc.com/article/UploadPic/2012-7/201272513538110.jpg" alt="portrait">
                      </div>
                      <div class="right">
                        <div class="middle">
                          <h2>
                            ${item.for_type==1?
                              (item.stu_name+'<span class="class_name">'+item.class_name+'</span><span class="room">宿舍'+item.room_name+'</span>')
                              :('宿舍'+item.room_name)
                            }
                          </h2>
                          <div class="info">
                            <h3>${item.title}</h3>
                            <p>${item.content}</p>
                          </div>
                          <div class="other">
                            <span class="publisher">发布人：${item.insert_operator_name}</span>
                            <span class="time">${new Date(item.insert_time * 1000).Format("yyyy-MM-dd")}</span>
                          </div>
                        </div>
                        <div class="label ${item.handle_type == 1? "praise" : "criticism"}">${item.handle_type == 1? "表扬" : "批评"}</div>
                      </div>
                  </div>`;
      })
    }

    $detail_list.append(_html);
  }

  //拉取列表
  function getList(page) {
    var queryParams = getQueryCond();
    console.log(queryParams);
    queryParams.stu_guid = stu_guid;
    queryParams.page = page;
    scrollLoadManage.isAjax = true
    $.ajax({
      type: "get",
      url: pageType == 1 ? APIDOMAIN + API.getDormScoreRecord : APIDOMAIN + API.getDormPublicProcess,
      data: queryParams,
      dataType: "json",
    })
    .done(function(res){
      console.log(res)
      if(res.code === '200'){
        var listData = res.extraData;
        if(pageType == 1) {
          renderScoreData(listData, page);
        }else{
          renderDealData(listData, page)
        }
        if(res.extraData.length == 0) {
          scrollLoadManage.isFinish = true; //告诉插件已经加载完了
        }
      }else{
        alert(res.message);
      }
    })
    .fail(function(er){
      console.log(er);
      alert(er);
    })
    .always(function(){
      console.log('always')
      scrollLoadManage.isAjax = false;
    })
  }

  //滚动加载更多
  const scrollLoadManage = new ScrollLoadManage();
  scrollLoadManage.initScrollLoad(window, document, scrollBottomCallback);
  function scrollBottomCallback(page) {
    console.log(page);
    getList(page)
  }

  getList(1)


})