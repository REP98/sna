(function() {
    "use strict";

    Metro.utils.cleanPreCode("pre, textarea");
    
    var it = SNA.locales.setup('it-IT',{
		langText:"Italiana Italia",
		social:{
			share:'Condividere',
			titleShare:'Condividi su ',
			like:'Mi piace',
			followme:'Seguiteci su ',
			textFollowme: 'Seguimi'
		}
	});
	console.log(it);
}());
function ancla(node, tree){
	console.log(node,tree);
}
$(function(){
	var URL = location.href.replace( location.hash,"");
	var SNA = window.SNA;
	//Funciones
	var aniSvg = function(svg){
		var path = svg.find('path');
		var text = svg.find('text');
		//Reasignación de ID
		var UnidId = Metro.utils.elementId;
		path.each(function(index, el) {
			var el = $(el);
			var id = el.attr('id');
			if(id == 'path898'){
				el.attr('id','heart');
			}else{
				var nId = UnidId('pathSvg');
				el.attr('id',nId);
			}
		});
		text.each(function(index, el) {
			var el = $(el);
			var id = el.attr('id');
			var nId = UnidId('textSvg');
				el.attr('id',nId);
		});
		//Iniciación de Efectos
		svg.find('#heart').addClass('fade-heart');
		svg.find('path:not(#heart)').fadeOut();
		text.fadeOut();
		setTimeout(function(){
			var l =path.length - 1;
			var e = 0;
			var interval = setInterval(function(){
				if(e == l){clearInterval(interval); return; }
				var p = $(path[e]);
				p.fadeIn(function(){
					if(e == 3){
						text.fadeIn();
					}
				});
				e++;
			}, 1000);
		}, 500);
	};

	// Load Logo 
	$.ajax({
		url:URL+'img/logo.svg',
		type: "GET",
		dataType:'xml',
		success:function(svg){
			var svgs = $(svg.documentElement);
			var logo = $('.logo');
			var id = {
				'50':'svg_logo_bar',
				'80':'svg_logo',
				'300':'svg_header'
			};
			logo.each(function(index, el) {
				var el = $(el);
				var svgk = svgs.clone();
					el.html(svgk);
				var w = el.data("width");
				var svg1 = el.find('svg');
				svg1.attr('id',id[w]);
				svg1.css({
					width:w+"px",
					height: w +"px"
				})
				if(parseInt(w) >= 300){
					aniSvg(svg1);
				}
			});
		//	console.log(svg,img,svgs,logo);
		},
		error:function(e,x) {
			console.error(x,e)
		}
	})
	//LOAD
	$.each($('.langs'), function(index, el) {
		$(el).html(window.SNALANG);
	});
	//Documentation
	$("#appbar-nav a, .linksd").click(function(event) {
		SNA.stop(event);
		var ir = $(this).attr('href');
		var np = $(ir).offset();
		$('html, body').animate({
			scrollTop: np.top - 60
		},2000);
		return false;
	});
	

	$("#nav-float .toc-nav").treeview({
		onNodeClick:function(n,t){
			var ir = n.data('href');
			var np = $(ir).offset();
			$('html, body').animate({
				scrollTop: np.top - 60
			},2000);
		}
	});
	
	//Followme
	var snaf = SNA.links.followme;
	var l = SNA.utils.lengthObj(snaf) - 1;
	var listF = $("#listfollowme");
	$("#lenghtSocial").html(l);
	$.each(snaf, function(name, uri) {
		if(name != 'mailto'){
			var li = $('<div>').addClass('cell c-pontier transition fg-'+name+'-hover bg-'+name+' bg-white-hover fg-white border p-3 bd-gray');
			var i = $('<i>').addClass("mr-1 sna-icon-"+name);
			var text = $('<span>').addClass('text-cap').html(name);
			i.appendTo(li);
			text.appendTo(li);
			li.appendTo(listF);
		}
	});

	$("#bar-right").click(function(){
		if($("#miright").length == 0){
			var div = $('<div>').attr('id', 'miright').appendTo('body');
			div.snafollowme({
				pos: 'right-center',
				links:{
					facebook:"rep190",
					twitter:"Robert_saer",
					instagram:"robertperez757",
					mailto:"delfinmundo@gmail.com"
				}
			});
		}
	})
	$("#fw-locale input").on(SNA.events.change,function(){
		var lang = $("#fw-locale input:checked").val();
		$("#sna-locale").attr("data-locale",lang);
	})
	var meta = SNA.getMeta();
	$(".metadata").each(function(index, el) {
		var el = $(el);
		var id = el.data("id");
		
		switch (id) {
			case 'sh-url': $(this).html(meta.og.url);	break;	
			case 'sh-title': $(this).html(meta.og.title);	break;	
			case 'sh-description': $(this).html(meta.og.description);	break;	
			case 'sh-media': 
				$(this).html(meta.og.image);
				if(SNA.utils.isValue(meta.og.image)){
					var img = $('<img>');
					img.attr({
						src:meta.og.image
					}).css('width','100%');
					img.appendTo($(this));
				}
				
			break;	
			case 'sh-via': $(this).html(meta.twitter.creator);	break;	
			case 'sh-source': $(this).html(meta.author);	break;	
			case 'sh-postype': $(this).html(meta.og.type);	break;	
		}
	});
	
	var p = '#parentbn';
	var o = [

		{
			listSocial:null,
			data:{
				phone:'+584241922546',
				text:'Me gusta Tu sistio'
			}
		},
		{
			listSocial:{
				whatsapp:{
					data:{
						phone:'+584241922546',
						text:'Bienvenido a mis sitema'
					}
				},
				skype:{
					data:{
						live:'shellrumm.fp',
						sms:'Hola en que puedo ayudarte?'
					}
				}
			}
		}
	];
	/*var btnf = */
	$.each(o, function(index, val) {
		 var i = (index > 0)? index: '';
		 val.parent = $(p+i);
		 val.fixed = false;
		 SNA.btnfloat.create(val);
	});
	SNA.btnfloat.create({
		fixed:true,
		position:'right',
		listSocial:{
			whatsapp:{
				data:{
					phone:'+584241922546',
					text:'Bienvenido a mis sitema'
				}
			},
			skype:{
				data:{
					user:'shellrumm.fp',
					sms:'Hola en que puedo ayudarte?'
				}
			},
			phone:'+584241922546',
			mailto:'delfinmundo@gmail.com'
		}
	});
	var lc = $('#listcolors');
	var cl = SNA.colorList;
	console.log(cl);
	$.each(cl, function(name, color) {
		var color = color, 
		cell = $('<div>').addClass('cell c-pontier transition border p-3 bd-gray'),
		title = $('<span>').html(name), 
		bg, fg;

		bg = SNA.color.toString($.trim(color));
		fg = (SNA.color.isDark(bg))?'#fff':'#1a1a1a';
		cell.css({
			background:bg,
			color:fg,
			cursor: 'pointer',
			verticalAlign: 'middle',
			textAlign:'center'
		});
		cell.hover(function() {
			cell.css({
				background:(bg == cl.white)?"#1a1a1a":"#fff",
				color:bg
			})
			title.fadeOut(function(){
				title.html(color).fadeIn()
			});
		}, function() {
			cell.css({
				background:bg,
				color:fg
			})
			title.fadeOut(function(){
				title.html(name).fadeIn()
			});
		});
		title.appendTo(cell);
		cell.appendTo(lc)
	});

	var ofUtls = $("#nav-float").offset();
	var footer = $("footer").offset();
	$(window).on('scroll',function(){
		var top = ofUtls.top + 100;
		var stop = $(window).scrollTop();
		if(stop  > top && stop < footer.top){
			$("#nav-float").css('position', 'fixed');
		}else{
			$("#nav-float").css('position', 'sticky');
		}
		var n = Math.abs($("#nav-float").offset().top + $("#nav-float").outerHeight());
		if(n > footer.top){
			$("#nav-float").css('position', 'sticky');
		}
	})
})