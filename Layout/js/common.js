var ua = window.navigator.userAgent;
var globalHref="";
//Scroll Navigation
$.fn.sbScrollNavi = function(options){
	var settings = $.extend({
		speed : 200,
		target : '.sections',
		gap : 0,
		navi : true,
		link : false
	}, options);

	//스크롤 네비게이션에 필요한 요소들 셋팅
	var _this = $(this);
	var _window = $(window);
	var _html = $("html, body");
	var hdHeight = $("#header").height();
	var navBox = _this.find(".navi_box");
	var navBoxHeight, ul, ulOffsetTop, li, target, scrollHeight, maxScroll, scrollTop, _scrollTop, oldUlOffsetTop, oldBrcTop;
	var brc = $(".bc_box");
	var toTop = $("#toTop");
	ul = _this.find(".navi");
	oldUlOffsetTop = 0;
	if(settings.navi){
		ulOffsetTop = Math.round(ul.offset().top);
		oldUlOffsetTop = ulOffsetTop;
	}
	var brc_height = brc.height();
	var brc_top = 0; 
	if(brc_height > 0){
		brc_top = Math.round(brc.offset().top);
	}
	oldBrcTop = brc_top;
	var titleboxHeight = $(".title_box").outerHeight();
	var gap = settings.gap;
	var timer, w;
	var fold_tit = $(".scr_box>.h2");
	var fold_close = ".close_inbox";
	var fold_box = $(".scr_box .inbox");
	fold_box.append("<span class='close_inbox'><a href='#'>닫기</a></span>");

	//init
	init = function(){
		if(settings.navi){
			navBox = _this.find(".navi_box");
			navBoxHeight = navBox.height();
			ul = _this.find(".navi");
			ulOffsetTop = Math.round(ul.offset().top);
			li = ul.find("li");
			target = $(settings.target);
		}else{
			navBoxHeight = 0;
			ulOffsetTop = 0;
		}

		//fixed함수 실행
		setFixed();

		if(settings.navi){
			if(!settings.link){
				li.each(function(i){
					$(this).on('click', {idx : i}, sbClick);
				});
			}
		}

		w = _window.width();
		//folding, update함수 실행
		sbFolding();
		sbUpdate();

		//페이지 스크롤, 리사이즈 될 때 실행 되는 함수
		_window.on('scroll', sbScroll);
		_window.on('resize', sbUpdate);

		//페이지 상단으로 이동 버튼 이벤트
		toTop.on('click', evToTop);
	},
	//페이지 리사이즈 될 때 각 요소 값 Update...
	sbUpdate = function(){
		_window = $(window);
		_html = $("html, body");
		hdHeight = $("#header").height();
		navBox = _this.find(".navi_box");
		brc = $(".bc_box");
		toTop = $("#toTop");
		titleboxHeight = $(".title_box").outerHeight();
		_scrollTop = $(window).scrollTop();

		if(settings.navi){
			if(navBox.hasClass('fixed')){
				//ulOffsetTop = oldUlOffsetTop;
				ulOffsetTop = hdHeight + $(".visual").height() + brc.height() + titleboxHeight;
			}else{
				ulOffsetTop = Math.round(ul.offset().top);
			}
		}

		brc_height = brc.height();
		if(brc_height == null || brc_height == ""){
			brc_height = 0;
		}
		if(brc_height > 0){
			if(brc.hasClass('fixed')){
				//brc_top = oldBrcTop;
				brc_top = hdHeight + $(".visual").height();
			}else{
				brc_top = Math.round(brc.offset().top);
			}
		}

		var ww = _window.width();
		var tm;
		/*
		if(ww < 768){
			tm = 400;
		}else{
			tm = 200;
		}
		*/
		tm = 200;

		clearTimeout(timer);
		timer = setTimeout(function(){
			if(_window.width() != w){
				w = _window.width();
				sbFolding();
			}
		}, tm);

		if(settings.navi){
			navBoxHeight = navBox.height();
		}else{
			navBoxHeight = 0;
		}

		scrollTop = _scrollTop + navBoxHeight;
		scTop = _scrollTop;

		if(brc_height > 0){
			addHeight = brc_height;
			if(brc_top > _scrollTop){
				//toTop icon hide
				//toTop.closest("span").stop().fadeOut(100);
				toTop.closest("span").hide();
			}
		}else{
			addHeight = 0;
		}

		if(settings.navi){
			if(!settings.link){
				var len = li.length;
				li.each(function(idx, ele){
					var target;
					var url = $(ele).find('a').attr('href');
					if(url.indexOf("#") == 0){
						var target = url;
						var targetTop = Math.round($(target).offset().top);

						if(targetTop - navBoxHeight - 20 - addHeight - gap <= scTop){
							li.removeClass('on');
							li.eq(idx).addClass('on');
						}
					}
				});
			}
		}
		scrollHeight = getScrollHeight();
		maxScroll = navBoxHeight + scrollHeight - $(window).height();
	},
	//페이지 스크롤 시 이벤트
	sbScroll = function(){
		_scrollTop = $(window).scrollTop();
		scrollHeight = getScrollHeight();
		maxScroll = navBoxHeight + scrollHeight - $(window).height();
		//sbUpdate();
		setFixed();

		scrollTop = _scrollTop + navBoxHeight;
		scTop = _scrollTop;

		if(brc_height > 0){
			addHeight = brc_height;
			if(brc_top > _scrollTop){
				//toTop icon hide
				//toTop.closest("span").stop().fadeOut(100);
				toTop.closest("span").hide();
			}
		}else{
			addHeight = 0;
		}

		if(settings.navi){
			if(!settings.link){
				var len = li.length;
				li.each(function(idx, ele){
					var target;
					var url = $(ele).find('a').attr('href');
					if(url.indexOf("#") == 0){
						var target = url;
						var targetTop = Math.round($(target).offset().top);

						if(targetTop - navBoxHeight - 20 - addHeight - gap <= scTop){
							li.removeClass('on');
							li.eq(idx).addClass('on');
						}
					}
				});

				if(scrollTop <= ulOffsetTop){
					li.removeClass('on');
					li.eq(0).addClass('on');
				}

				if (scrollTop >= maxScroll){
					li.removeClass('on');
					li.eq(len - 1).addClass('on');
				}
			}
		}
	},
	//스크롤 네비게이션 리스트 클릭 시 이벤트
	sbClick = function(rst){
		rst.preventDefault();

		var idx = rst.data['idx'];
		var link = rst.currentTarget.childNodes[0]['hash'];
		var as = settings.speed+50;

		if(brc_height > 0){
			addHeight = brc_height;
		}else{
			addHeight = 0;
		}

		$('html:not(:animated),body:not(:animated)').stop().animate({scrollTop: Math.round($(link).offset().top) - navBoxHeight - addHeight - gap}, as);
	},
	//스크롤 네비게이션 기본 위치 이상으로 스크롤 시 페이지상단으로 고정 시키는 이벤트
	setFixed = function(){
		if(brc_height > 0){
			if(_scrollTop > 0){
				if(_scrollTop >= brc_top){
					brc.addClass('fixed');

					//toTop icon show
					//toTop.closest("span").stop().fadeIn(200);
					toTop.closest("span").show();
				}else{
					brc.removeClass('fixed');

					//toTop icon hide
					//toTop.closest("span").stop().fadeOut(100);
					toTop.closest("span").hide();
				}

				if(ulOffsetTop - brc_height - gap <= _scrollTop){
					navBox.addClass('fixed').css('top', brc_height);
					navBox.css('padding-top', gap);
				}else{
					navBox.removeClass('fixed').css('top', '0');
					navBox.css('padding-top', 0);
				}
			}else{
				brc.removeClass('fixed');
				navBox.removeClass('fixed').css('top', '0');
				navBox.css('padding-top', 0);
			}
		}else{
			//toTop icon hide
			toTop.closest("span").hide();

			if(ulOffsetTop - gap <= _scrollTop){
				navBox.addClass('fixed');
			}else{
				navBox.removeClass('fixed');
			}
		}
	},
	//페이지 높이값 반환...
	getScrollHeight = function(){
		return $(window).scrollHeight || Math.max($('body')[0].scrollHeight, document.documentElement.scrollHeight);
	},
	//페이지 상단으로 이동 이벤트
	evToTop = function(e){
		e.preventDefault();

		_html.animate({scrollTop:0}, 250);
		return false;
	},
	//모바일 화면 전환 시 각 섹션 접는 이벤트
	sbFolding = function(){
		if(_window.width() < 768){
			fold_box.show();
			fold_box.hide();
			$(fold_tit).unbind('click');
			$(fold_tit).parent().removeClass('off').addClass('off');

			//모바일 전환 시 첫번째 Section Open!!
			$(fold_tit).parent().eq(0).removeClass('off');
			$(fold_tit).parent().eq(0).find(fold_box).show();

			$(fold_tit).click(function(){
				//$(this).next(fold_box).toggle().parent().toggleClass('off');
				$(this).next(fold_box).toggle(0, function(){
					if($(this).is(":visible")){
						$(this).parent().removeClass("off");
					}else{
						$(this).parent().removeClass("off").addClass('off');
					}
				});
			});
		}

		if(_window.width() >= 768 && _window.width() < 1024){
			fold_box.show();
			$(fold_tit).unbind('click');
			$(fold_tit).parent().removeClass('off');
			$(fold_tit).click(function(){
				//$(this).next(fold_box).toggle().parent().removeClass('off');
				//$(this).next(fold_box).toggle().parent().toggleClass('off');
				$(this).next(fold_box).toggle(0, function(){
					if($(this).is(":visible")){
						$(this).parent().removeClass("off");
					}else{
						$(this).parent().removeClass("off").addClass('off');
					}
				});

			});
		}

		if(_window.width() >= 1024){
			$(fold_tit).unbind('click');
			fold_box.show();
		}

		//fold_close.unbind('click');
		fold_box.find(fold_close).find("a").bind({
			"click" : function(e){
				e.preventDefault();
				$(this).parent().parent().hide();
				$(this).parent().parent().closest(".scr_box").removeClass('off').addClass('off');
			}
		});
	}
	//init 함수 실행
	init();
};
// Scroll Navigation

//지속경영 - 대외수상에서 쓰임!!
$.fn.sbListSel= function(options){
	var settings = $.extend({
		target : "#selbox",
		speed : 200,
		effect : null
	}, options);

	//기본값 셋팅
	var target = $(settings.target);
	var sp = settings.speed;
	var rst_txt = target.find('.rst_txt');
	var nav = target.find(".slist");
	var navLi = nav.find('li');
	var timer, w;
	var point = 768;

	//init 함수 실행
	var init = function(){
		w = $(window).width();
		if(w < point){
			nav.hide();
			closed();
			nav.css('top',rst_txt.outerHeight());
		}
		var active = nav.children(".on").index();
		if(active > 0){
			rst_txt.text(navLi.eq(active).text());
		}else{
			rst_txt.text(navLi.eq(0).text());
		}

		rst_txt.on('click', mclick);
		navLi.on('click', click);
		$(window).on('resize', function(){
			clearTimeout(timer);
			if($(window).width() != w){
				timer = setTimeout(resize, 100);
				w = $(window).width();
			}
		});
	}
	// 데스크탑, 테블릿 버전 클릭 이벤트
	var click = function(e){
		e.preventDefault();

		var idx = navLi.index(this);
		//console.log(idx);

		navLi.removeClass('on');
		navLi.eq(idx).addClass('on');
		rst_txt.text(navLi.eq(idx).text());
		if(w < point){
			nav.slideToggle(sp);
		}
	}
	// 모바일 버전 클릭 이벤트
	var mclick = function(e){
		e.preventDefault();

		nav.slideToggle('fast');
	}
	// 모바일 버전에서 셀렉트박스 영역 외에 클릭 시 이벤트
	var closed = function(){
		$(document).on('mousedown touchstart focusin', function(e){
			if($(e.target).closest(target).length === 0) {
				nav.slideUp(sp);
			}
		});
	}
	// 리사이즈 이벤트
	var resize = function(){
		var active = nav.children(".on").index();
		if(active > 0){
			rst_txt.text(navLi.eq(active).text());
		}else{
			rst_txt.text(navLi.eq(0).text());
		}

		 if(w < point){
			nav.hide();
			closed();
			nav.css('top',rst_txt.outerHeight());
		 }else{
			nav.show();
			$(document).off('mousedown touchstart focusin');
		 }
	}
	init();
}

var w;
var pWidth, pHeight, pTop, pLeft, ww;
var setWidth, setHeight, setLeft, setTop;

$(document).ready(function() {
	/* GNB 메뉴 마우스, 키보드 이벤트(마우스오버, 키보드 탭 버튼 이동) */
	$(".gnb_ul > li").each(function(idx){
		$(this).bind({
			"mouseenter focusin":function(){
				$("#header").addClass("on");
				$(".gnb_ul > li").removeClass('active');
				$(this).addClass('active');
				$('.subdepth').removeClass('show_menu');
				$(this).find('.subdepth').stop().slideDown(200, function(){
					$(this).addClass('show_menu');
				});
			},
			"mouseleave focusout":function(){
				$("#header").removeClass("on");
				$(".gnb_ul > li").removeClass('active');
				$(this).find('.subdepth').stop().slideUp(100, function(){
					$(this).addClass('show_menu');
				});
			}
		});
	});

	// 상단 통합검색 클릭 이벤트
	$(".tnavi01").bind({
		click : function(e){
			e.preventDefault();

			allSch();
		}
	});

	// 상단 언어선택 마우스, 키보드 이벤트
	/*
	$(".tnavi03").bind({
		click : function(e){
			e.preventDefault();

			if($(".tnavi01").hasClass("on")){
				$(".tnavi01").trigger('click');
			}

			$(this).toggleClass("on");
			$(".lan_box").toggleClass('show');
		}
	});
	*/
	$(".lan_select").bind({
		"mouseenter focusin" : function(){
			$(this).addClass("open");
			$(this).find(".tnavi03").addClass("on");
		},
		"mouseleave focusout" : function(){
			$(this).removeClass("open");
			$(this).find(".tnavi03").removeClass("on");
		}
	});

	// BreadCrumb 마우스, 키보드 이벤트
	$(".breadcrumb ul li").each(function(){
		$(this).bind({
			"mouseenter focusin":function(){
				//$(this).find(".low_path:eq(0)").show();
				//$(this).find("> div:eq(0)").show();
				$(this).find("> div:eq(0)").addClass('show');
				$(this).addClass("on");
			},
			"mouseleave focusout":function(){
				//$(this).find(".low_path:eq(0)").hide();
				//$(this).find("> div:eq(0)").hide();
				$(this).find("> div:eq(0)").removeClass('show');
				$(this).removeClass("on");
			}
		});
	});

	//탭 기본 텍스트 셋팅
	$(".tab_basic").each(function(idx){
		var txt = $(this).find(".sel_txt");
		//var first_txt = $(this).find("li").eq(0);
		var first_txt = $(this).find("li.on");
		txt.text(first_txt.text());
	});

	//탭 클릭 이벤트
	$(".tab_basic li a").not($(".tab_basic.link_tab li a")).bind({
		click : function(e){
			e.preventDefault();

			var txt = $(this).closest(".tab_basic").find(".sel_txt");

			$(this).parent().siblings().removeClass("on");
			$(this).parent().addClass("on");

			txt.text($(this).text());

			var idx = $(this).parent().index();

			$(this).closest(".inbox").find(".tab_con").removeClass("show");
			$(this).closest(".inbox").find(".tab_con").eq(idx).addClass("show");
		}
	});

	w = $(window).width();

	//페이지 사이즈별 탭 형태 변경
	if(w < 1024){
		$(".tab_basic.history_m").show();
	}
	if(w >= 768){
		$(".tab_basic ul").show();
		$(".tab_basic ul li").unbind('click');
		$(".shortcut strong.sc_tit").unbind('click');
	}else{
		$(".tab_basic ul").hide();
		$(".shortcut strong.sc_tit").unbind('click');
		sel_ctr();
		shortcuts_ctr();
	}

	//페이지 리사이트 이벤트
	$(window).resize(function(){
		w = $(window).width();

		if(w >= 768){
			$(".tab_basic ul").show();
			$(".sel_txt, .tab_basic ul li").unbind('click');
			$(".shortcut strong.sc_tit").unbind('click');
			$(".shortcut strong.sc_tit").next("div").show();
		}else{
			$(".tab_basic ul").hide();
			$(".sel_txt, .tab_basic ul li").unbind('click');
			$(".shortcut strong.sc_tit").unbind('click');
			$(".shortcut strong.sc_tit").next("div").hide();
			sel_ctr();
			shortcuts_ctr();
		}
	});

	//레이어팝업
	$('.lypop').click(function(e){
		e.preventDefault();

		var href = $(this).attr('href');
		globalHref = href;
		var id = $(this).attr('id');
		//console.log(id);
		setWidth = $(this).attr('data-width');
		setHeight = $(this).attr('data-height');
		setLeft = $(this).attr('data-left');
		setTop = $(this).attr('data-top');

		$(".layer_content").empty();
		$(".layer_content").css("height","100%");
		$(".layer_content").load(href, function(){
			//레이어팝업 Accordian Control
			if($(".layer_content").find("#pop_accord").length > 0){
				$("#pop_accord").sbPop();
			}

			if($(".layer_content").find(".lypop_close").length > 0){
				$(".lypop_close").on({
					click : function(e){
						e.preventDefault();

						$.unblockUI(function(){
							$("body").css("overflow","visible");
							$(".layer_content").empty();
							$(".layer_content").css("height","auto");
							$("#"+id).focus();
						});
						
						if($("body .layer_content").length < 1) {
							$("body").append("<div class='layer_content'></div>");
						}

						if($(".layer_content").find(".old_bro").length > 0 || $(".layer_content").find(".new_bro").length > 0){
							$(".layer_content").html("").load(href);
						}

					}
				});
			}

			//Layer Popup Open!!
			openPop(id, setWidth, setHeight, setLeft, setTop);
		});

		//Layer Popup Open!!
		//openPop(id, setWidth, setHeight, setLeft, setTop);
	});

	//제품 Speed Info
	$(".speed_info p").bind({
		"mouseover focusin" : function(){
			$(this).parent().find(".info_layer").show();
		},
		"mouseout focusout" : function(){
			$(this).parent().find(".info_layer").hide();
		}
	});
});

//레이어팝업 Accordian
$.fn.sbPop = function(options){
	var settings = $.extend({
		tit : ".acd_tit",				//title항목 클래스
		con : '.acd_con',				//content 항목 클래스
		btn : '.acd_con_close',	//content 하단 닫기 버튼 클래스
		speed : 150					//slideUp, slideDown일 경우 speed 조정
	}, options);

	//기본값 셋팅
	var _this, $tit, $con, $btn, speed;

	init = function(){
		_this = $(this);
		$tit = $(settings.tit);
		$con = $(settings.con);
		$btn = $(settings.btn);
		speed = settings.con;

		$tit.each(function(i){
			$(this).on('click', {idx:i}, pClick);
		});
		$btn.on('click', pClose);
	},
	//타이틀 클릭 이벤트
	pClick = function(e){
		e.preventDefault();

		var idx = e.data['idx'];

		//$tit.not($(this)).removeClass('open');
		$(this).toggleClass('open');

		var dropdown = $(this).next($con);

		//$con.not(dropdown).removeClass("show");
		dropdown.toggleClass("show");

		animate($(this));
	},
	//닫기 버튼 클릭 이벤트
	pClose = function(e){
		e.preventDefault();

		$(this).closest(settings.con).removeClass("show");
		$(this).closest(settings.con).prev(settings.tit).removeClass('open');

		animate($(this).closest(settings.con).prev(settings.tit));
	},
	//애니메이션 동작 이벤트 - 현재 미구현
	animate = function(tt){
		/*
		var $this = tt;
		var tit_top = $this.offset().top;
		var hd = 0;
		if($("#pop_header").length > 0){
			hd = $("#pop_header").height();
		}
		*/
	}
	init();
}

//페이지 하단 Shortcut 영역 클릭 이벤트
var shortcuts_ctr = function(){
	$(".shortcut strong.sc_tit").bind({
		click:function(){
			if(!$(this).hasClass("on")){
				//$(".shortcut strong.sc_tit").removeClass("on");
				$(this).addClass("on");
				$(this).next("div").show();
			}else{
				$(this).removeClass("on");
				$(this).next("div").hide();
			}
		}
	});
}

//basic tab control
var sel_ctr = function(){
	$(".sel_txt, .tab_basic ul li").bind({
		click : function(){
			$(this).closest(".tab_basic").find("ul").slideToggle(150);
		}
	});
}

/* 통합검색 실행 함수 */
var allSch = function() {
	/*
	if($(".tnavi03").hasClass("on")){
		$(".tnavi03").trigger('click');
	}
	*/

	$("#header").toggleClass("on");
	$(".all_sch .tnavi01").toggleClass("on");
	$(".all_sch .sch_box").stop().slideToggle(200, function(){
		if($(this).is(":visible")){
			$(".all_sch").find("input[type=text]").focus();
		}
	});
}
var lyOuterHeight = 0, gap, ct;
function openPop(id, width, height, left, top){
	if(ua.indexOf('MSIE 7') > -1 || ua.indexOf('MSIE 8') > -1){
		$("body").css({"overflow-y" : "visible"});
	}else{
		$("body").css("overflow","hidden");
	}
	//Layer Popup Resizing...!!
	var settings = resizePop(width, height, left, top);
	var tw = settings.tmpWidth;
	var th = settings.tmpHeight;
	var tl = settings.tmpLeft;
	var tt = settings.tmpTop;

	$.blockUI({
		message : $(".layer_content"),
		css:{
			padding:0,
			margin:0,
			width:tw,
			height:th,
			top:tt,
			left:tl,
			textAlign:'left',
			color:'#000',
			border:'0',
			backgroundColor:'#fff',
			cursor:'default',
			overflow:'hidden'
		},
		// styles for the overlay
		overlayCSS:{
			backgroundColor: '#000',
			opacity:0.5,
			cursor:'default'
		},
		fadeIn:200,
		fadeOut:100,
		onBlock : function(){
			//console.log($("#pop_head_tit").length);
			$("#layerPopupStart").focus();

			$("#layerPopupEnd").unbind('focusin');
			$("#layerPopupEnd").bind({
				'focusin' : function(){
					$(".lypop_close").focus();
				}
			});

			lyOuterHeight = 0;
			lyOuterHeight = $(".layer_content").find(".pop_header").outerHeight();
			gap =  34;
			ct = $(".pop_container > div").css("padding-top", (lyOuterHeight + gap) + 'px');

			if(ua.indexOf('MSIE 7') > -1 || ua.indexOf('MSIE 8') > -1 || ua.indexOf('MSIE 9') > -1){
				$(".new_bro").hide();
				$(".old_bro").show();
			}else{
				$(".new_bro").show();
				$(".old_bro").hide();
			}
		},
		onUnblock : function(){
			$("body").css("overflow","visible");
			$(".layer_content").empty();
			$(".layer_content").css("height","auto");

			$("#"+id).focus();
			
			if($("body .layer_content").length < 1) {
				$("body").append("<div class='layer_content'></div>");
			}

			if($(".layer_content").find(".old_bro").length > 0 || $(".layer_content").find(".new_bro").length > 0){
				$(".layer_content").html("").load(globalHref);
			}
		},
		onOverlayClick: $.unblockUI
	});

	$("iframe.blockUI").remove();
}
var resizePop = function(width, height, left, top){
	ww = $(window).width();
	hh  = $(window).height();
	var tmpWidth, tmpHeight, tmpLeft, tmpTop;

/*
	var lyOuterHeight = $(".layer_content").find(".pop_header").outerHeight(true);
	var gap =  34;
	var ct = $(".pop_container > div").css("padding-top", (lyOuterHeight + gap) + 'px');
*/
	if(ww < 1024){
		tmpWidth = "90%";
		tmpHeight = "90%";
		tmpLeft = "5%";
		tmpTop = "5%";
	}
	if(ww < 768){
		tmpWidth = "100%";
		tmpHeight = "100%";
		tmpLeft = "0";
		tmpTop = "0";
	}
	if(ww >= 1024){
		tmpWidth = width;
		if(typeof width == 'undefined'){
			tmpWidth = "60%";
		}
		tmpHeight = height;
		if(tmpHeight >= hh){
			tmpHeight = "80%";
		}
		if(typeof height == 'undefined'){
			tmpHeight = "80%";
		}
		tmpLeft = left;
		if(typeof left == 'undefined'){
			if(tmpWidth == "60%"){
				tmpLeft = "20%";
			}else{
				tmpLeft = ((ww - parseInt(tmpWidth)) / 2) + "px";
			}
		}
		tmpTop = top;
		if(typeof top == 'undefined'){
			if(tmpHeight == "80%"){
				tmpTop = "10%";
			}else{
				tmpTop = ((hh - parseInt(tmpHeight)) / 2) + "px";
			}
		}
	}
	$("div.blockPage").css({"width" : tmpWidth, "height" : tmpHeight, "top" : tmpTop, "left" : tmpLeft});

	$(window).on('resize',function(){
		ww = $(window).width();
		hh  = $(window).height();

		lyOuterHeight = 0;
		lyOuterHeight = $(".layer_content").find(".pop_header").outerHeight();
		ct = $(".pop_container > div").css("padding-top", (lyOuterHeight + gap) + 'px');

		if(ww < 1024){
			tmpWidth = "90%";
			tmpHeight = "90%";
			tmpLeft = "5%";
			tmpTop = "5%";
		}
		if(ww < 768){
			tmpWidth = "100%";
			tmpHeight = "100%";
			tmpLeft = "0";
			tmpTop = "0";
		}
		if(ww >= 1024){
			tmpWidth = width;
			if(typeof width == 'undefined'){
				tmpWidth = "60%";
			}
			tmpHeight = height;
			if(tmpHeight >= hh){
				tmpHeight = "80%";
			}
			if(typeof height == 'undefined'){
				tmpHeight = "80%";
			}
			tmpLeft = left;
			if(typeof left == 'undefined'){
				if(tmpWidth == "60%"){
					tmpLeft = "20%";
				}else{
					tmpLeft = ((ww - parseInt(tmpWidth)) / 2) + "px";
				}
			}
			tmpTop = top;
			if(typeof top == 'undefined'){
				if(tmpHeight == "80%"){
					tmpTop = "10%";
				}else{
					tmpTop = ((hh - parseInt(tmpHeight)) / 2) + "px";
				}
			}
		}
		$("div.blockPage").css({"width" : tmpWidth, "height" : tmpHeight, "top" : tmpTop, "left" : tmpLeft});
	});

	return {tmpWidth:tmpWidth, tmpHeight:tmpHeight, tmpLeft:tmpLeft, tmpTop:tmpTop};
}

//페이지 이동 후 해당 위치로 이동
function scroll_if_anchor(href){
	href=typeof(href)=="string"? href : $(this).attr("href");
	var fromTop=108;
	/*
	var brc = $(".bc_box").height();
	var navi = $(".navi_box").height();
	console.log(brc)
	console.log(navi)
	*/
	if(href.indexOf("#")==0){
		var $target=$(href);
		if($target.length){
			$('html, body').animate({scrollTop:$target.offset().top - fromTop}, 500);
			if(history&&"pushState"in history){
				// history.pushState({},document.title,window.location.pathname+href);
				history.pushState({},$(location).attr("href"));
				return false;
			}
		}
	}
}

/**************************
*** Option Value ***
target : layer popup id value
w : layer popup width
h : layer popup height
l : layer popup left position
t : layer popup top position
**************************/
function openLayer(target, w, h, l, t, purl){
	$(target).load(purl, function(){
		$(".close_layer").bind({
			click : function(e){
				e.preventDefault();
				$(this).closest(target).hide();
			}
		});

		$("input[name=today]").click(function(){
			var targetNm = target.replace("#", "");
			if($(this).prop("checked") == true) {
				$.cookie(targetNm, 'hidden', {expires : 1});
				$(this).closest(target).hide();
			} else {
				$.cookie(targetNm,null);
			}
		});
	});

	//Layer Popup Resize!!
	resizeMngPop(target, w, h, l, t);

	$(target).show();
}
var resizeMngPop = function(target, width, height, left, top){
	var cmlayer = $(".layer_pop");
	var len = cmlayer.length;
	ww = $(window).width();
	hh  = $(window).height();

	var tmpWidth, tmpHeight, tmpLeft, tmpTop;

	if(ww < 1024){
		if(width >= ww){
			tmpWidth = "90%";
		}else{
			tmpWidth = width+"px";
		}
		if(height >= hh){
			tmpHeight = "90%";
		}else{
			tmpHeight = height+"px";
		}

		tmpLeft = "5%";
		tmpTop = "5%";
	}
	if(ww < 768){
		if(width >= ww){
			tmpWidth = "90%";
		}else{
			tmpWidth = width+"px";
		}
		tmpHeight = "80%";
		tmpLeft = "5%";
		tmpTop = "10%";

	}
	if(ww >= 1024){
		tmpWidth = width+"px";
		tmpHeight = height+"px";
		tmpLeft = left+"px";
		tmpTop = top+"px";
	}
	setValue(target, tmpWidth, tmpHeight, tmpLeft, tmpTop);

	$(window).on('resize',function(){
		ww = $(window).width();
		hh  = $(window).height();

		if(ww < 1024){
			if(width >= ww){
				tmpWidth = "90%";
			}else{
				tmpWidth = width+"px";
			}
			if(height >= hh){
				tmpHeight = "90%";
			}else{
				tmpHeight = height+"px";
			}

			tmpLeft = "5%";
			tmpTop = "5%";
		}
		if(ww < 768){
			if(width >= ww){
				tmpWidth = "90%";
			}else{
				tmpWidth = width+"px";
			}
			tmpHeight = "80%";
			tmpLeft = "5%";
			tmpTop = "10%";

		}
		if(ww >= 1024){
			tmpWidth = width+"px";
			tmpHeight = height+"px";
			tmpLeft = left+"px";
			tmpTop = top+"px";
		}
		setValue(target, tmpWidth, tmpHeight, tmpLeft, tmpTop);
	});
	//return {tmpWidth:tmpWidth, tmpHeight:tmpHeight, tmpLeft:tmpLeft, tmpTop:tmpTop};
}

function setValue(target, w, h, l, t){
	$(target).css({
		"width" : w,
		"height" : h,
		"left" : l,
		"top" : t
	});
}

/*
 *  페이징 출력 함수
 *  
 *  @currentPage	: 현재 페이지
 *  @totalRow	: 총 레코드수
 *  @pageRow	: 페이지당 출력 레코드수
 */

function paging(currentPage, totalRow, pageRow)
{	
	var html = "";
	var totalPage = Math.ceil(Number(totalRow) / Number(pageRow));
	
	var start = ((currentPage - 2) <= 1) ? 1 : currentPage - 2;
	var end = ((start + 4) >= totalPage) ? totalPage : start + 4;

	start = (start > 1 && (end - start) < 4) ? end - 4 : start; 
	start = (start == 0) ? 1 : start;

	if(start == 2) {
		html += "<a href='javascript:pageMove(1)'>1</a>";
	} else if(start > 2) {
		html += "<a href='javascript:pageMove(1)'>1</a>";
		html += "<span>&hellip;</span>";
	}
	for(var i=start; i <= end; i++) {
		if(i == currentPage) {
			html += "<span class='on'>" + i + "</span>";
		} else {
			html += "<a href='javascript:pageMove(" + i + ");'>" + i + "</a>";
		}
	}
	if(end == totalPage - 1) {
		html += "<a href='javascript:pageMove(" + totalPage + ")'>" + totalPage + "</a>";
	} else if(end < totalPage - 1) {
		html += "<span>&hellip;</span>";
		html += "<a href='javascript:pageMove(" + totalPage + ")'>" + totalPage + "</a>";
	}
	
	$(".paging").html(html);
	
}

/**
 * 비밀번호 체크
 * 
 * @param passowrd - 비밀번호
 * @returns {Boolean}
 */
function checkPassowrd(passowrd) {
	var reg = /^.*(?=.{10,12})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;	// 영.숫자 10 ~ 12 자리
	var regSpecial = /^.*(?=.*[&%]).*$/;	// 특수문자 %, & 제외
	
	if(!reg.test(passowrd) || regSpecial.test(passowrd)) {
 		return false;
	}
	
	return true;
}


/*
 * strTemp  : [필수] 크로스사이트 스크립팅을 검사할 문자열
 * level    : [옵션] 검사레벨
 *            0 (기본) -> XSS취약한 문자 제거
 *            1 (선택) -> 단순한 <, > 치환
 */
function XSS_Check(strTemp, level) {     
  if ( level == undefined || level == 0 ) {
    strTemp = strTemp.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g,"");		
  }
  else if (level != undefined && level == 1 ) {
    strTemp = strTemp.replace(/\</g, "&lt;");
    strTemp = strTemp.replace(/\>/g, "&gt;");
  }
  return strTemp;
}