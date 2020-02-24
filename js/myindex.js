$(function() {
  let query = "";
  let pageNum = 1;
  let pageSize = 16; //每页数量
  let total = 1; //总页数
  let heros = {}; //接收对象数据
  let arr;

  // 全局ajax
  $.ajaxSetup({
    beforeSend: function() {
      NProgress.start();
    },
    complete: function() {
      NProgress.done();
    }
  });

  $(".hero_list li").click(function() {
    let str = $(this)
      .text()
      .trim();
    $("#search").val("");
    $(this)
      .addClass("active")
      .siblings()
      .removeClass("active");
    getAjax(str);
    total = 1;
    pageNum = 1;
    $(".total_page").text(total);
    $(".current_page").text(pageNum);
  });

  // ajax 函数封装
  function getAjax(str) {
    $.ajax({
      type: "get",
      url: "https://autumnfish.cn/api/cq/category",
      data: {
        type: str
      },
      dataType: "json",
      success: function(response) {
        arr = [];
        heros = response.data;
        for (let i in heros) {
          arr.push(heros[i]);
        }
        // 总页数=总个数/每页显示的个数
        total = Math.ceil(arr[0].length / pageSize);
        // console.log("总数" + arr[0].length);
        $(".total_page").text(total);
        let newHeros = arr[0].slice(0, pageSize);
        // console.log(newHeros.length);
        let dataHtml = template("content", newHeros);
        $(".content_list").html(dataHtml);
      }
    });
  }

  $(".hero_list li:nth-child(1)").click();

  //   定时器函数
  function start() {
    $(".hero_list .active").click();
  }
  // 点击查看详情
  $(".content_list").on("click", "img", function(e) {
    console.log(heros);
    let search_hero = {};
    // 点击获取英雄的名称
    let hero = $(this)
      .parent()
      .siblings()
      .find("h3")
      .text()
      .trim();
    $(".cover").show();
    $(".skillgif").hide();
    $.each(heros.heros, function(index, items) {
      if (items.heroName == hero) {
        search_hero = items;
      }
    });
    console.log(heros);
    let content2Html = template("content2", search_hero);
    $("tbody").html(content2Html);

    // 点击查看技能动图
    $("tbody").on("click", "a", function(e) {
      let heroname = $(this)
        .parent()
        .siblings(".hero")
        .find("p")
        .text();
      let imgSrc;
      let that = $(this);
      $.ajax({
        type: "get",
        url: "https://autumnfish.cn/api/cq/gif",
        data: {
          name: heroname
        },
        dataType: "json",
        beforeSend: function() {
          $(".skillgif")
            .show()
            .find("img")
            .prop("src", "./images/loading01.gif");
        },
        success: function(response) {
          imgSrc = response.data.skillGif;
          that
            .parent()
            .parent()
            .parent()
            .parent()
            .siblings()
            .find("img")
            .prop("src", imgSrc);
        }
      });
    });
  });

  // 点击隐藏 table
  $(".cover").click(function(e) {
    if (e.target.className == "cover") {
      $(this).hide();
    }
  });
  // 点击隐藏 gif
  $(".skillgif").click(function(e) {
    if (e.target.nodeName !== "IMG") {
      $(this).hide();
    }
  });
  // 搜索
  $(".search_btn").click(function() {
    let has = [];
    let heroStr = $("#search")
      .val()
      .trim();
    if (heroStr.length == 0) {
      alert("内容不能为空哦！");
      return;
    } else {
      $.each(arr[0], function(index, items) {
        if (items.heroName.includes(heroStr)) {
          has.push(items);
          let hashtml = template("content", has);
          $(".content_list").html(hashtml);
        }
      });
    }
    // 搜到不到
    if (has.length == 0) {
      let newHtml = template("content3", {});
      $(".content_list").html(newHtml);
      $(".total_page").text(1);
      $(".current_page").text(1);
      setTimeout(start, 3000);
    }
  });

  //   回车搜索
  $("#search").keyup(function(e) {
    if (e.keyCode === 13) {
      $(".search_btn").click();
    }
  });
  // 上一页
  $(".previous_page").click(function() {
    if (pageNum == 1) {
      pageNum = 1;
    } else {
      pageNum--;
      $(".current_page").text(pageNum);
      let num = $(".current_page").text();
      let start = (parseInt(num) - 1) * 16;
      let end = parseInt(num) * 16;

      if (end > arr[0].length) {
        end = arr[0].length;
      }
      //   console.log(start);
      //   console.log(end);
      let newHeros = arr[0].slice(start, end);
      let dataHtml = template("content", newHeros);
      $(".content_list").html(dataHtml);
    }
  });
  // 下一页
  $(".next_page").click(function() {
    total = $(".total_page").text();
    if (pageNum == total) {
      pageNum = total;
    } else {
      pageNum++;
      $(".current_page").text(pageNum);
      let num = $(".current_page").text();
      let start = (parseInt(num) - 1) * 16;
      let end = parseInt(num) * 16;
      if (end > arr[0].length) {
        end = arr[0].length;
      }
      //   console.log(start);
      //   console.log(end);
      let newHeros = arr[0].slice(start, end);
      let dataHtml = template("content", newHeros);
      $(".content_list").html(dataHtml);
    }
  });
});
