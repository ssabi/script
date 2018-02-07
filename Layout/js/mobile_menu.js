function getSize(){
	if(window.innerHeight){
		// Firefox, Webkit
		iW = window.innerWidth;
		//iH = window.innerHeight;
	}else{
		// Internet Explorer
		iW = document.documentElement.clientWidth;
		//iH = document.documentElement.clientHeight;
	}
	return iW;
}
// Document Width Variable
var dW;
var lm_open = false;
var lan_open = false;
var lo_open = false;
var ua = window.navigator.userAgent;
var mobileMenuAllHtml = "";
var winW = $(window).width();

$(document).ready(function(){
	chk();
});
$(window).bind('resize', function(){
	setTimeout(function(){
		if(winW != $(window).width()){
			chk();
			winW = $(window).width();
		}
	}, 500);
});

function chk(){
	dW = getSize();
	menu_chk(dW);
}

// Mobile Menu 
function menu_chk(val){
	$(".mbg").remove();
	$(".mt_v").remove();
	$(".m_lmenu").remove();
	$(".sel_lan").remove();
	$(".msch_wrap").remove();
	$("html, body").removeClass("ovf_hdn");

	if(val <= 1023){
		//$("#header").css("display","none");
		$("#header").css("visibility","hidden");
		$(".loc_box").css("display","none");
		mobile_menu();
	}else{
		//$("#header").css("display","block");
		$("#header").css("visibility","visible");
		$(".loc_box").css("display","block");
		mobile_menu();
	}

	if(ua.indexOf('MSIE 7') > -1 || ua.indexOf('MSIE 8') > -1){
		$("html").css({"height" : "100%"});
		$("body").css({"height" : "100%", "overflow" : "visible", "position" : "static"});
	}
}

function mobile_menu(){
	html = '	<div class="mbg"></div>';
	html += '	<div class="mt_v">';
	// Mobile Menu
	html += '		<a href="#" class="mctr">Menu</a>';
	// Logo
	html += '		<a href="/kor/index.jsp" class="mlogo">SK hynix</a>';
	// Search
	html += '		<div class="msch">';
	html += '			<a href="#" class="open_msch">Search</a>';
	html += '		</div>';
	// Language
	html += '		<div class="mlan">';
	html += '			<a href="#" class="lan_ctr">Language Select</a>';
	html += '		</div>';
	html += '	</div>';

	// Laguage Select Layer
	html += '	<div class="sel_lan">';
	html += '		<a href="#" class="sel_close">Language Select Close</a>';
	html += '		<ul>';
	html += '			<li class="on"><a href="/kor/index.jsp">KOREAN</a></li>';
	html += '			<li><a href="/eng/index.jsp">ENGLISH</a></li>';
	html += '			<li><a href="/cha/index.jsp">CHINESE-SIMPLIFIED</a></li>';
	html += '			<li><a href="/chat/index.jsp">CHINESE-TRADITIONAL</a></li>';
	html += '			<li><a href="/jpa/index.jsp">JAPANESE</a></li>';
	html += '		</ul>';
	html += '	</div>';

	// Search Layer
	html += '	<div class="msch_wrap">';
	html += '		<a href="#" class="sch_close">Search Close</a>';
	html += '		<form name="mbknSearchForm" method="get" onsubmit="return mobileTotalSearch();">';
	html += '			<fieldset>';
	html += '				<div class="msch_box">';
	html += '					<div>';
	html += '						<p><input type="text" name="kwd"  class="txt" title="검색어를 입력해주세요" placeholder="검색어를 입력해주세요"></p>';
	html += '						<input type="submit" class="msch_submit" value="검색">';
	html += '					</div>';
	html += '				</div>';
	html += '			</fieldset>';
	html += '		</form>';
	html += '	</div>';

	html += '	<div class="m_lmenu">';
	html += '		<div>';
	html += '			<ul class="left_menu" id="mobileLeftMenu">'+mobileMenuAllHtml+'</ul>'; //AUTO MOBILE MENU INSERT	
	html += '			<ul class="mquick">';
	html += '				<li><a href="/kor/about/global.jsp">Global Network</a></li>';
	html += '				<li><a href="/kor/common/careers.jsp">Careers</a></li>';
	html += '				<li><a href="/kor/support/contactus.do">Contact Us</a></li>';
	html += '				<li><a href="/kor/support/faq.do">FAQ</a></li>';
	html += '			</ul>';

	html += '		</div>';
	html += '	</div>';
	//Left Menu
	// Mobile Menu

	$("#wrap").prepend(html);

	var minit = function(){
		$(".left_menu > li").each(function(idx){
			if($(this).find(".mdepth2").length > 0){
				$(this).find("> a").append("<span />");
			}
		});
	}
	var minit02 = function(){
		$(".mdepth2 > ul > li").each(function(){
			if($(this).find(".mdepth3").length > 0){
				$(this).find("> a").append("<span />");
			}
		});
	}
	var minit03 = function(){
		$(".mdepth3 > ul > li").each(function(){
			$(this).find("> a").append("<span />");
		});
	}
	
	minit();
	minit02();
	minit03();
}

var m_sch = {
	open : function(e){
		e.preventDefault();

		if($(".mctr").hasClass("open")){
			$(".mctr").trigger("click");
		}
		$("html, body").addClass("ovf_hdn");
		$(".mbg").fadeIn(200);
		$(".msch_wrap").show();
	},
	close : function(e){
		e.preventDefault();
		$("html, body").removeClass("ovf_hdn");
		$(".mbg").fadeOut(200);
		$(".msch_wrap").find("input").val("");
		$(".msch_wrap").hide();
	}
}

//Mobile Menu
$(document).on("click", ".mctr", menuCtr);
$(document).on("click", ".left_menu > li > a", subMenu);
$(document).on("click", ".mdepth2 > ul > li > a", subMenu02);
$(document).on("click", ".mdepth3 > ul > li > a", subMenu03);
$(document).on("click", ".lan_ctr", langCtr);
$(document).on("click", ".sel_close", langCtr);
$(document).on("click", ".open_msch", m_sch.open);
$(document).on("click", ".sch_close", m_sch.close);

function menuCtr(e){
	//$(window).unbind('resize');
	e.preventDefault();

	//Close Search
	$(".msch_wrap").find("input").val("");
	$(".msch_wrap").hide();

	//Close Select Language
	$(".sel_lan").hide();
	lan_open = false;

	$(".mdepth2").slideUp(200);
	$(".left_menu li").removeClass("on");

	$(this).toggleClass("open");
	if(ua.indexOf('MSIE 7') > -1 || ua.indexOf('MSIE 8') > -1){
		$("body").toggleClass("ovf_hdn");
	}else{
		$("html, body").toggleClass("ovf_hdn");
	}

	$(".m_lmenu > div").css("padding-bottom", 0);
	//$(".m_lmenu > div").css("padding-top", 60);

	if(!$(this).hasClass("open")){
		$(".m_lmenu").stop().animate({left : '-100%'}, 250);
		$(".mbg").fadeOut(200);
		lm_open = false;

		if(ua.indexOf('MSIE 7') > -1 || ua.indexOf('MSIE 8') > -1){
			$("html").css({"height" : "100%"});
			$("body").css({"height" : "100%", "overflow" : "visible", "position" : "static"});
		}
	}else{
		$(".m_lmenu").stop().animate({left : 0}, 250);
		$(".mbg").fadeIn(200);
		lm_open = true;

		if(ua.indexOf('MSIE 7') > -1 || ua.indexOf('MSIE 8') > -1){
			$("html").css({"height":$(window).height() + "px"});
			$("body").css({"height":$(window).height() + "px", "overflow" : "hidden", "position" : "relative"});
		}
	}
}

function subMenu(e){
	$thisp = $(this).parent();

	var chk = false;
	$(".left_menu > li").removeClass("on");

	var dropDown = $(this).next(".mdepth2");
	$(".mdepth2").not(dropDown).slideUp("fast");
	dropDown.stop(false, true).slideToggle("fast", function(){
		if($(this).is(":hidden")){
			$thisp.removeClass("on");
			chk = false;
		}else{
			$thisp.addClass("on");
			chk = true;
		}
	});

	if(!chk){
		$(this).parent().find(".mdepth3").each(function(idx){
			if($(this).css("display") == "block"){
				$(this).parent().removeClass("on");
				$(this).parent().find(".mdepth3").hide();
			}
		});
	}
}

function subMenu02(e){
	if($(this).next(".mdepth3").find("li:eq(0)").length > 0){
		e.preventDefault();
	}

	$thisp = $(this).parent();

	$(".mdepth2 > ul > li").removeClass("on");

	var dropDown = $(this).next(".mdepth3");
	$(".mdepth3").not(dropDown).slideUp("fast");
	dropDown.stop(false, true).slideToggle("fast", function(){
		if($(this).is(":hidden")){
			$thisp.removeClass("on");
		}else{
			$thisp.addClass("on");
		}
	});

	//Reset
	//$(".mctr").trigger("click");
}

function subMenu03(e){
	if($(this).next(".mdepth4").find("li:eq(0)").length > 0){
		e.preventDefault();
	}

	$thisp = $(this).parent();

	$(".mdepth3 > ul > li").removeClass("on");

	var dropDown = $(this).next(".mdepth4");
	$(".mdepth4").not(dropDown).slideUp("fast");
	dropDown.stop(false, true).slideToggle("fast", function(){
		if($(this).is(":hidden")){
			$thisp.removeClass("on");
		}else{
			$thisp.addClass("on");
		}
	});

	//Reset
	//$(".mctr").trigger("click");
}

function langCtr(e){
	e.preventDefault();

	if($(".mctr").hasClass("open")){
		$(".mctr").trigger("click");
	}

	if(lan_open){
		$("html, body").removeClass("ovf_hdn");
		$(".mbg").fadeOut(200);
		$(".sel_lan").hide();
		lan_open = false;
	}else{
		$("html, body").addClass("ovf_hdn");
		$(".mbg").fadeIn(200);
		$(".sel_lan").show();
		$(".msch_wrap").hide();
		lan_open = true;
	}

	/*$(document).on('mousedown focusin', function(e){
		if($(e.target).closest('.lan_ctr, .sel_lan').length === 0){
			console.log("closing....")
			$(".mbg").fadeOut(200);
			$(".sel_lan").hide();
			lan_open = false;
		}
	});
	*/
}