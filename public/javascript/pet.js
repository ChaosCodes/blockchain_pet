
$(document).ready(function () {
  
  getpetInfo();
  setInterval(function(){
    getpetInfo();
  }, 5000)
  $('#loginsubmit').click(
    function() {
      check();
    }
  );

  $('.exercises').click(function() {
    $.post('api/exercise', {
    }, function() {
      history.go(0);
    })
  })



  $(".petbuttonEat").click(function() {
    $.post('api/food', {}, function() {
      history.go(0);
    })
  })

  $(".petbuttonCap").click(function() {
    $.post('api/medicine', {}, function() {
      history.go(0);
    })
  })

  $('.pet').hover(function () {
    // $('.pet').
  })

  $('.quit').click(function() {
    $.post("auth/logout",
    {},
    function(data,status){
      alert("退出成功");
      history.go(0);
    });
  });

  $('#regsubmit').click(function() {
    var user_id = $('#regid').val();
    var pass = $('#regpass').val();
    var passag = $('#regpassag').val();
    if(user_id==null || user_id==""){
      alert("请输入用户名");
      return;
    }
    if(pass==null || pass=="" || passag==null || passag==""){
      alert("请输入密码");
      return;
    }
    if (pass != passag) {
      alert("两次密码不吻合");
      return;
    }

    $.post("auth/register",
    {
      username: user_id,
      password: pass
    },
    function(data,status){
      if (data) {
        
        alert("成功注册");
        history.go(0) 
      }
      else {
        alert("失败");
      }
    });
  })
  
})


function check(){
  var user_id = $('#logid').val();
  var pass = $('#logpass').val();
  if(user_id==null || user_id==""){
    alert("请输入用户名");
    return;
  }
  if(pass==null || pass==""){
    alert("请输入密码");
    return;
  }

  $.post("auth/login",
  {
    username: user_id,
    password: pass
  },
  function(data,status){
    if (data.value) {
      alert("成功登录");
    }
    else {
      alert("用户名或密码错误");
    }
    history.go(0) 
  });
}

function getpetInfo() {
  $.get("/api/petInfo", function(data,status){
    console.log(data.value)
    if (data == null) return;
    if (data.value !== undefined && !data.value) return;
    $(".names").text(data[4])
    $(".health").text(data[1])
    $(".hungerfull").text(data[2])
    
    $(".healthpro").css({"style": "width: " + data[1] + "%", "aria-valuenow": String(data[1])});
    $(".fullpro").css({"style": "width: " + data[2] + "%", "aria-valuenow": String(data[2])});
  });
  
  $.get("/api/getBalance", function(data,status){
    if (data == null) return;
    console.log(data)
    if (data.value !== undefined && !data.value) return;
    $(".monsum").text(data)
  });

}

