/**
 * SNA
 * Plugin para gestion de Redes Sociales
 * @return object
 */
(function( factory ) {
    if ( typeof define === 'function' && define.amd ) {
        define([ 'jquery' ], factory );
    } else {
        factory( jQuery );
    }
}(function( jQuery ) { 
	'use strict';

	var $ = jQuery;

	if (typeof jQuery === 'undefined') {
		throw new Error('SNA requires jQuery!');
	}

	if ('MutationObserver' in window === false) {
		throw new Error('SNA requires MutationObserver!');
	}

	var URL = location.href;
	var isTouch = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
	var SNALANG = "es-VE";
	window.SNALANG = SNALANG;
	/**
	 * NUCLEO
	 * @type {Object}
	 */
	var SNA = {
		version: '1.0',
		name:'SNA',
		nameFull:'Social Networks Admin',
		isTouch:isTouch,
		events: {
			click: 'click.SNA',
			start: 'touchstart.SNA mousedown.SNA',
			stop: 'touchend.SNA mouseup.SNA',
			move: 'touchmove.SNA mousemove.SNA',
			enter: 'touchstart.SNA mouseenter.SNA',
			leave: 'mouseleave.SNA',
			focus: 'focus.SNA',
			focusClick: 'click.SNA focus.SNA',
			blur: 'blur.SNA',
			resize: 'resize.SNA',
			keyup: 'keyup.SNA',
			keydown: 'keydown.SNA',
			keypress: 'keypredd.SNA',
			dblclick: 'dblclick.SNA',
			input: 'input.SNA',
			invalid: 'invalid.SNA',
			valid: 'valid.SNA',
			change: 'change.SNA',
			cut: 'cut.SNA',
			paste: 'paste.SNA',
			scroll: 'scroll.SNA',
			scrollStart: 'scrollstart.SNA',
			scrollStop: 'scrollstop.SNA',
			mousewheel: 'mousewheel.SNA',
			inputChange: "change.SNA input.SNA propertychange.SNA cut.SNA paste.SNA copy.SNA",
			inputClick: "input.SNA click.SNA",
			dragstart: "dragstart.SNA",
			dragend: "dragend.SNA",
			dragenter: "dragenter.SNA",
			dragover: "dragover.SNA",
			dragleave: "dragleave.SNA",
			drop: 'drop.SNA',
			drag: 'drag.SNA'
		},

		keyCode: {
			BACKSPACE: 8,
			TAB: 9,
			ENTER: 13,
			SHIFT: 16,
			CTRL: 17,
			ALT: 18,
			BREAK: 19,
			CAPS: 20,
			ESCAPE: 27,
			SPACE: 32,
			PAGEUP: 33,
			PAGEDOWN: 34,
			END: 35,
			HOME: 36,
			LEFT_ARROW: 37,
			UP_ARROW: 38,
			RIGHT_ARROW: 39,
			DOWN_ARROW: 40,
			COMMA: 188
		},
		media_queries: {
			XS: "(min-width: 0px)",
			SM: "(min-width: 576px)",
			MD: "(min-width: 768px)",
			LG: "(min-width: 992px)",
			XL: "(min-width: 1200px)"
		},
		
		media_queries_range: {
			XS: "(min-width: 0px) and (max-width: 576px)",
			SM: "(min-width: 577px) and (max-width: 768px)",
			MD: "(min-width: 769px) and (max-width: 992px)",
			LG: "(min-width: 993px) and (max-width: 1200px)",
			XL: "(min-width: 1201px)"
		},

		media_sizes: {
			XS: 0,
			SM: 576,
			MD: 768,
			LG: 992,
			XL: 1200
		},
		links: {
			followme:{
				facebook:'https://facebook.com/',
				twitter:'https://twitter.com/',
				instagram:'https://www.instagram.com/',
				mailto:'mailto:',
				github:'https://github.com/',
				linkedin:'https://www.linkedin.com/in/',
				behance:'https://www.behance.net/',
				youtube: 'https://youtube.com/',
				blogger:'https://www.blogger.com/',
				tumblr: 'https://www.tumblr.com/',
				amazon: 'https://www.amazon.com/',
				periscope:'https://www.pscp.tv/',
				yelp: 'https://www.yelp.com/',
				flickr:'https://www.flickr.com/',
				soundcloud: 'https://soundcloud.com/',
				reddit: 'https://www.reddit.com/',
				slideshare:'https://www.slideshare.net/',
				vk:'https://vk.com/',
				vine: 'https://vine.co/',
				pinterest:'https://www.pinterest.com.',
				badoo:'https://badoo.com/profile/',
				deviantart: 'https://www.deviantart.com/',
				trello:'https://trello.com/'
			},
			chat:{
				whatsapp:{
					func:function(d){
						var p = d.phone.replace("+","");
						var api = Utils.isMovil() ? 'api':'web';
						return Utils.concatLinkChat('https://'+api+'.whatsapp.com/send?',
							{phone:p,text:d.text});
					},
					options:{
						phone:'',
						text:''
					}
				},
				skype:{
					func:function(d){
						var api = (skypeCheck())?'skype:':'https://web.skype.com/';
						if(skypeCheck()){
							return 'skype:'+d.user+((d.call)?'?call':'')+((d.sms)?'?chat':'');
						}else{
							return 'https://web.skype.com/';
						}						
						return false;
					},
					options:{
						user:'',
						call:false,
						sms:true
					}
				},
				phone: {
					func: function(d){return 'tel:'+d.tel; },
					options:{tel:''}
				},
				mailto: {
					func: function(d){return 'mailto:'+d.email; },
					options:{email:''}
				},
				kakaotalk:{},//APP
				viber:{},//APP
				telegram: {},//APP
				messenger:'https://m.me/',//APP
				wechat:{},//APP
				spotify:{},//APP
				snapchat:{},//APP
				line:{},
				qq:{},
				hangouts:{}
			},
			share:{
				facebook:function(d){
					var url = ($.isUndefined(d.url)) ? URL: d.url;
					return Utils.concatLinkChat('https://www.facebook.com/sharer.php?',{u:url});
				},
				twitter:function(d){
					var url = ($.isUndefined(d.url)) ? URL: d.url,
					by = d.via.replace("@","");
					return Utils.concatLinkChat('https://twitter.com/intent/tweet?',
						{url:url, text:d.description, via:by});
				},
				tumblr:function(d){
					var url = ($.isUndefined(d.url)) ? URL: d.url,
					pt = ($.isUndefined(d.postType) || d.postType == "") ? 'link': d.postType;
					return Utils.concatLinkChat('https://www.tumblr.com/widgets/share/tool?',{
						canonicalUrl:url, title:d.title, caption:d.description, posttype:pt
					});
				},
				blogger:function(d){
					var url = ($.isUndefined(d.url)) ? URL: d.url;
					return Utils.concatLinkChat('https://www.blogger.com/blog-this.g?',
						{u:url, n:d.title, t:d.description});
				},
				pinterest:function(d){
					var url = ($.isUndefined(d.url)) ? URL: d.url;
					return Utils.concatLinkChat('https://pinterest.com/pin/create/button?',
						{u:url, media:d.media, description:d.description});
				},
				linkedin:function(d){
					var url = ($.isUndefined(d.url)) ? URL: d.url,
						mi = ($.isUndefined(d.mini))? false: d.mini,
						data = {
							url:url, title:d.title, summary:d.description, source:d.source, mini:mi
						};
					return Utils.concatLinkChat('https://www.linkedin.com/shareArticle?',data);
				},
				reddit:function(d){
					var url = ($.isUndefined(d.url)) ? URL: d.url,
						mi = ($.isUndefined(d.mini))? false: d.mini;
					return Utils.concatLinkChat('https://www.reddit.com/submit?',{
						url:url, title:d.title, summary:d.description, source:d.source, mini:mi
					});
				},
				line:function(d){
					var url = ($.isUndefined(d.url)) ? URL: d.url;
					return Utils.concatLinkChat('http://line.me/R/text/',{
						'?':url
					});
				},
				telegram:function(d){
					var url = ($.isUndefined(d.url)) ? URL: d.url;
					return Utils.concatLinkChat('https://telegram.me/share/url?',{
						url:url,text:d.title+"%20"+d.description
					});
				},
				vk:function(d){
					var url = ($.isUndefined(d.url)) ? URL: d.url;
					return Utils.concatLinkChat('http://vk.com/share.php?',{
						url:url
					});
				},
				viber:function(d){
					var url = ($.isUndefined(d.url)) ? URL: d.url;
					return Utils.concatLinkChat('viber://forward?',{
						text:d.title+"%20"+d.description+"%20"+url
					});
				},
				skype:function(d){
					var url = ($.isUndefined(d.url)) ? URL: d.url;
					return Utils.concatLinkChat('http://web.skype.com/share?',{
						url:url
					});
				},
				whatsapp:function(d){
					var url = ($.isUndefined(d.url)) ? URL: d.url;
					var api = Utils.isMovil() ? 'api':'web';
					var t = d.title;
					if(Utils.isValue(d.media)){
						t += " "+d.media;
					}

						t += " "+d.description+" "+url
					return Utils.concatLinkChat('https://'+api+'.whatsapp.com/send?',{
						text:t
					});
				}
			},
			embeds:{

			}
		},
		colorList:{
			sna:"#07aef0",
			"white":"#fff",
			"black":"#1a1a1a",
			facebook:" #1877f2",
			"facebook-dark":" #3b5998",
			twitter:" #1da1f2",
			"twitter-dark":"#14171a",
			"twitter-gray":"#f5f8fa",
			"instagram-narvy":"#405DE6",
			"instagram-indio":"#5851DB",
			"instagram-magenta":" #C13584",
			instagram:" #E1306C",
			"instagram-purple":" #833AB4",
			"instagram-red":" #FD1D1D",
			"instagram-orange":" #F56040",
			"instagram-lightorange":" #F77737",
			"instagram-yellow":" #FCAF45",
			"instagram-lightyellow":" #FFDC80",
			github:" #333",
			"github-gay":"#f5f5f5",
			linkedin:" #0077b5",
			"linkedin-light":" #00a0dc",
			"linkedin-purple":" #8D6CAB",
			behance:"#1769ff",
			whatsapp:" #25d366",
			"whatsapp-teal1":" #075e54",
			"whatsapp-teal2":" #128c7e",
			"whatsapp-teal3":" #dcf8c6",
			"whatsapp-blue":" #34b7f1",
			youtube:" #ff0000",
			"youtube-dark":" #282828",
			blogger:" #f57d00",
			tumblr:" #2c4762",
			snapchat:" #fffc00",
			amazon:" #ff9900",
			periscope:" #3AA4C6",
			"periscope-red":" #D75444",
			yelp:" #d32323",
			skype:" #00aff0",
			"skype-darkblue":" #0078d7",
			flickr:" #f40083",
			"flickr-blue":" #006add",
			soundcloud:" #ff5500",
			"soundcloud-yellow":" #ff7700",
			"spotify-green":" #1ed760",
			"spotify-darkgreen":" #1db954",
			spotify:" #191414",
			reddit:" #FF4500",
			"reddit-blue":" #5F99CF",
			"reddit-lightblue":" #CEE3F8",
			deviantart:" #05cc47",
			"deviantart-dark":" #1f3626",
			slideshare:" #e68523",
			"slideshare-blue":" #00a0dc",
			vk:" #4a76a8",
			"vk-dark":" #2a5885",
			vine:" #00b489",
			steam:" #171a21",
			"steam-blue":" #00ADEE",
			telegram:" #0088CC",
			messenger:"#0084ff",
			wechat:"#7bb32e",
			qq:"#FEBF1B",
			"qq-red":"#E32B10",
			"qq-blue":"#3E7BD1",
			qzone:"#FFCE00",
			viber:" #59267c",
			"vibber-blue":" #a5cfd5",
			"vibber-green":" #81cd50",
			"vibber-light":" #e2d4e7",
			pinterest:"#bd081c",
			kakaotalk:"#FFE812",
			"badoo-indigo":"#783af9",
			badoo:"#F99DF0",
			wordpress:"#21759b",
			"wordpress-orange":"#d54e21",
			"wordpress-dark":"#464646",
			line:"#00C300",
			womanalias:"#DE4680",
			//EMAIL
			yahoo:"#410093",
			gmail:"#D44638",
			"gmail-darkred":"#B23121",
			"gmail-gray":"#EEE",
			outlook:"#0072C6",
			//OTROS
			"google-blue":" #4285f4",
			"google-red":" #ea4335", 
			"google-yellow":" #fbbc05", 
			"google-green":" #34a853",
			dropbox:"#007EE5",
			hangouts:" #0F9D58",
			paypal:"#003087",
			"paypal-light":"#009CDE",
			trello:" #0079BF",
			"trello-green":" #70B500",
			"trello-orange":" #FF9F1A",
			"trello-red":" #EB5A46",
			"trello-yellow":" #F2D600",
			"trello-purple":" #c377E0",
			"trello-pink":" #FF78CB",
			"trello-blue":" #00C2E0"
		},
		module:[],
		//Privados
		observe:function(){
			var observer, observerCallback;
			var observerConfig = {
				childList: true,
				attributes: true,
				subtree: true,
				characterData: false,
				attributeOldValue: false,
				characterDataOldValue: false
			};
			
			observerCallback = function(mutations){
				mutations.map(function(mutation){
					
					if (mutation.type === 'attributes' && mutation.attributeName !== "data-role") {
						var element = $(mutation.target);
						var mc = element.data('SNAcomponet');
						if (mc !== undefined) {
							$.each(mc, function(){
								var plug = element.data(this);
								if(plug && ("changeAttr" in plug)){
									plug.changeAttr(mutation.attributeName);
								}
							});
						}
					} else if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
						var i, obj, widgets = {}, plugins = {};
						var nodes = mutation.addedNodes;
						for(i = 0; i < nodes.length; i++) {

							var node = mutation.addedNodes[i];

							if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') {
								return;
							}
							
							obj = $(mutation.addedNodes[i]);
							
							plugins = obj.find("[data-role]");
							
							if (obj.data('role') !== undefined) {
								widgets = $.merge(plugins, obj);
							} else {
								widgets = plugins;
							}
							if (widgets.length > 0) {
							   SNA.initWidgets(widgets);
							}
						}

					} else  {
						if(SNA.debug){
							console.log("Mutation",mutation);
						}
					}
				});
			};
			observer = new MutationObserver(observerCallback);
			observer.observe($("html")[0], observerConfig);
		},
		init:function(opt){
			this.widgets =  $('[data-role]');
			this.isMovil= Utils.isMovil();

			if(isTouch){ $("html").addClass("is-touch"); }
			if(this.isMovil){ $('html').addClass('is-movil'); }

			this.observe();
			this.initWidgets(this.widgets);

			console.info(this.name+" v"+this.version);
			
			return this;
		},
		initWidgets:function(widget){
			var that = this;
			$.each(widget, function () {
				var $this = $(this), w = this;
				var roles = $this.data('role').split(/\s*,\s*/);
				roles.map(function (func) {
					if ($.fn[func] !== undefined && $this.attr("data-role-"+func) === undefined) {
						if(that.module.hasOwnProperty(func)){
							$.fn[func].call($this);
							$this.attr("data-role-"+func, true);

							var mc = $this.data('SNAcomponet');

							if (mc === undefined) {
								mc = [func];
							} else {
								mc.push(func);
							}
							$this.data('SNAcomponet', mc);
						}
					}
				});
			});
		},
		plugin: function(name, object){
			//Agregamos eventos
			if(!object.hasOwnProperty("setOptionsFromDOM")){
				object.setOptionsFromDOM = SNA.utils.setOptionsFromDOM;
			}
			object.fullname = name+".SNA";
			$.fn[name] = function( options ) {
				return this.each(function() {
					$.data( this, name, Object.create(object).init(options, this ));
				});
			};
			this.module[name] =  object;
			return $.fn[name];
		},

		destroyPlugin: function(element, name){
			var p, mc;
			element = Utils.isjQElement(element) ? element[0] : element;
			p = $(element).data(name);

			if (!Utils.isValue(p)) {
				throw new Error("Component can not be destroyed: the element is not a SNA component.");
			}

			if (!Utils.isFunc(p['destroy'])) {
				throw new Error("Component can not be destroyed: method destroy not found.");
			}

			p['destroy']();
			mc = $(element).data("SNAcomponet");
			mc.splice(mc.indexOf(name), 1)
			$(element).data("SNAcomponet", mc);
			$.removeData(element, name);
			$(element).removeAttr("data-role-"+name);
		},

		destroyPluginAll: function(element){
			element = Utils.isjQElement(element) ? element[0] : element;
			var mc = $(element).data("SNAcomponet");

			if (mc !== undefined && mc.length > 0) {
				$.each(mc, function(){
					SNA.destroyPlugin(element, this);
				});
			}
		},
		initPlugin: function(element, name){
			element = (Utils.isjQElement(element))?element:$(element);
			try {
				if ($.fn[name] !== undefined && element.attr("data-role-"+name) === undefined) {
					$.fn[name].call(element);
					element.attr("data-role-"+name, true);

					var mc = element.data('SNAcomponet');

					if (mc === undefined) {
						mc = [name];
					} else {
						mc.push(name);
					}
					element.data('SNAcomponet', mc);
				}
			} catch (e) {
				console.error(e.message+"\n", e.stack);
			}
		},
		initWidgetsAll:function(){
			var widgets = $('[data-role]');
			this.initWidgets(widgets);
			return widgets;
		},
		reinitPlugin: function(element, name){
			this.destroyPlugin(element, name);
			this.initPlugin(element, name);
		},

		reinitPluginAll: function(element){
			var mc = $(element).data("SNAcomponet");

			if (mc !== undefined && mc.length > 0) {
				$.each(mc, function(){
					SNA.reinitPlugin(element, this);
				});
			}
		},
		stop: function(e){
			e.stopPropagation();
			e.preventDefault();
		}
	};

	window.SNA = SNA;
	/**
	 * Conjunto de Funciones Utiles para el sistema
	 * @type {Object}
	 */
	var Utils = {
		_is:function(obj, type){
			return obj !== undefined && obj !== null && typeof obj === type;
		},
		
		isUrl: function (val) {
			return /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/.test(val);
		},

		isTag: function(val){
			return /^<\/?[\w\s="/.':;#-\/\?]+>/gi.test(val);
		},

		isColor: function (val) {
			return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(val);
		},
		
		isString: function(str){
			return this.isType(str, 'string'); 
		},
		
		isInt: function(n){
			return Number(n) === n && n % 1 === 0;
		},

		isFloat: function(n){
			return Number(n) === n && n % 1 !== 0;
		},
		
		isType: function(o, t){
			if($.isUndefined(o) || $.isNull(o)){ return false; }
			if(typeof o === t){ return o; }
			
			if(this.isTag(o) && t.toUpperCase() == "TAG"){ 
				if(this.lengthElement($(o) > 0)){
					return $(o);
				}
				return false;
			}
			if(this.isUrl(o) && t.toUpperCase() == 'URL'){ 
				if(location.href === o){
					return true;
				}
				return o;
			} 
			
			if(typeof window[o] === t){ return window[o]; }
			
			if(typeof o === 'string' && o.indexOf('#') !== -1){
				if(this.isColor(o) && t.toUpperCase() == 'COLOR'){
					return Color.ident(o);
				}
				if(this.isjQElement($(o)) && t.toUpperCase() == 'elem'){
					return $(o);
				}
				return false;
			}
			
			if(typeof o === 'string' && o.indexOf('.') !== -1){
				if(this.isjQElement($(o)) && t.toUpperCase() == 'elem'){
					return $(o);
				}
				return false;
			}
			
			if(typeof o === 'string' && o.indexOf('[') === 0){
				if(this.isjQElement($(o)) && t.toUpperCase() == 'elem'){
					return $(o);
				}
				return false;
			}
			
			return false;
		},
		
		isTouchDevice: function() {
			return (('ontouchstart' in window)
				|| (navigator.MaxTouchPoints > 0)
				|| (navigator.msMaxTouchPoints > 0));
		},

		isObject: function(o){
			return this.isType(o, 'object')
		},
		isDate: function(val, format){
			var result;

			if (typeof val === "object" && Utils.isFunc(val['getMonth'])) {
				return true;
			}

			if (Utils.isValue(format)) {
				result = String(val).toDate(format);
			} else {
				result = String(new Date(val));
			}

			return result !== "Invalid Date";
		},
		isDateObject: function(v){
			return typeof v === 'object' && v['getMonth'] !== undefined;
		},
		isValue: function(val){
			return val !== undefined && val !== null && val !== "";
		},
		isElement:function(selector){
			if(this.isjQElement(selector)){
				return selector;
			}
			if(this.isString(selector)){
				if(document.querySelectorAll(selector).length > 0){
					return $(selector);
				}
			}
			if(selector.nodeName){
				return $(selector);
			}
			return false;
		},
		isjQElement: function(el){
			return (typeof jQuery === "function" && el instanceof jQuery);
		},
		isSNAElement: function(el, type){
			var el = (this.isjQElement(el))?el: $(el),
				obj = el.data(type);
			if(el.length === 0){
				console.log("SNA: "+type + ': ' + el + ' not found!');
				return false;
			}
			if($.isUndefined(obj)){
				console.log('SNA: Element not contain role '+ type +'! Please add attribute data-role="'+type+'" to element ' + el);
				return false;
			}
			return true;
		},
		isMedia: function(query){
			return window.matchMedia(query).matches
		},
		toMedia: function(){
			var media = "";
			$.each(SNA.media_queries_range,function(k,v){
				if(Utils.isMedia(v)){
					media += " "+k;
				}
			})
			return $.trim(media);
		}, 
		func: function(f){
			return new Function("a", f);
		},
		parseHex: function(n){
			return parseInt(n, 16);
		},
		hex2dec:function(hex){
			return this.parseHex(hex);
		},
		dec2hex:function(dec){
			var n = parseInt(dec, 10);
			if(!$.isNumeric(n)){
				return "00";
			}
			return "0123456789ABCDEF".charAt( (n-n%16) / 16) + "0123456789ABCDEF".charAt( n % 16);
		},
		rad2deg:function(rad){
			return rad * Math.PI / 180;
		},
		deg2rad:function(deg){
			return deg / Math.PI * 180;
		},
		isFunc: function(f){
			return this.isType(f, 'function');
		},
		
		lengthElement: function(elem){
			return (elem.hasOwnProperty('length'))?elem.length:-1;
		},
		
		lengthObj: function(obj){
			return Object.keys(obj).length;
		},
		joinObj:function(obj,split, sep){
			if(!this.isObject(obj)){ return obj; }
			split = (!this.isValue(split))?", ":split;
			sep = (!this.isValue(sep))?" : ":sep;
			var strObj = [];
			$.each(obj,function(n,v){
				strObj.push(n+sep+v);
			})
			return strObj.join(split);
		},
		setOptionsFromDOM:function(that){
			var element = that.element, o = that.options,data = element.data(), no = {};
			$.each(data, function(key, value){
				if (key in o) {
					try {
						no[key] = JSON.parse(value);
					} catch (e) {
						no[key] = value;
					}
				}
			});
			return no;
		},
		
		exec: function(f, args, context){
			var result;
			if ($.isUndefined(f) || $.isNull(f)) {return false; }
			var func = this.isFunc(f);
			if (func === false) {
				func = this.func(f);
			}
			try {
				result = func.apply(context, args);
			} catch (err) {
				result = null;
				if (SNA.debug === true) {
					throw err;
				}
			}
			return result;
		}, 
		parseHex: function(n){
			return parseInt(n, 16);
		},
		por: function(n,p){
			var m, tantoPosiento = false;
			if(!$.isNumeric(n) && n.indexOf("%") != -1){
				m = parseInt(n);
				tantoPosiento = true;
			}
			
			if(tantoPosiento){
				return (m / 100) * p;
			}else{
				return (n / p) * 100;
			}
			
		},
		random: function(from, to){
			return Math.floor(Math.random()*(to-from+1)+from);
		},
		uniqueId: function () {
			var d = new Date().getTime();
			return 'xxsx-xxyx-yxhx-xxx5'.replace(/[xy]/g, function (c) {
				var r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
			});
		},

		elementId: function(prefix){
			return prefix+"-"+(new Date()).getTime()+Utils.random(1, 1000);
		},
		isVisible: function(el){
			if (Utils.isjQElement(el)) {
				el = el[0];
			}

			return Utils.getStyleOne(el, "display") !== "none" && Utils.getStyleOne(el, "visibility") !== "hidden" && el.offsetParent !== null;
		},
		getStyle: function(el, pseudo){
			if (Utils.isjQElement(el) === true) {
				el  = el[0];
			}
			return window.getComputedStyle(el, pseudo);
		},

		getStyleOne: function(el, property){
			return Utils.getStyle(el).getPropertyValue(property);
		},
		computedRgbToHex: function(rgb){
			var a = rgb.replace(/[^\d,]/g, '').split(',');
			var result = "#", i;

			for(i = 0; i < 3; i++) {
				var h = parseInt(a[i]).toString(16);
				result += h.length === 1 ? "0" + h : h;
			}

			return result;
		},

		computedRgbToRgba: function(rgb, alpha){
			var a = rgb.replace(/[^\d,]/g, '').split(',');
			if (alpha === undefined) {
				alpha = 1;
			}
			a.push(alpha);
			return "rgba("+a.join(",")+")";
		},

		computedRgbToArray: function(rgb){
			return rgb.replace(/[^\d,]/g, '').split(',');
		},
		
		pageHeight: function(){
			var body = document.body,
				html = document.documentElement;

			return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
		},
		hiddenElementSize: function(el, includeMargin){
			var clone = $(el).clone();
			clone.removeAttr("data-role").css({
				visibility: "hidden",
				position: "absolute",
				display: "block"
			});
			$("body").append(clone);

			if (includeMargin === undefined) {
				includeMargin = false;
			}

			var width = clone.outerWidth(includeMargin);
			var height = clone.outerHeight(includeMargin);
			clone.remove();
			return {
				width: width,
				height: height
			}
		},
		strToArray: function(str, delimiter, type, format){
			var a;

			if (!Utils.isValue(delimiter)) {
				delimiter = ",";
			}

			if (!Utils.isValue(type)) {
				type = "string";
			}

			a = (""+str).split(delimiter);

			return a.map(function(s){
				var result;

				switch (type) {
					case "int":
					case "integer": result = parseInt(s); break;
					case "number":
					case "float": result = parseFloat(s); break;
					case "date": result = !Utils.isValue(format) ? new Date(s) : s.toDate(format); break;
					default: result = s.trim();
				}

				return result;
			})
		},
		sort:function(m,t,n){
			var ms = m;
			if($.isUndefined(t)){
				t = "asc";
			}
			if(t != "asc" && t != 'desc'){
				n = t;
				t = "asc";
			}
			if(Utils.isObject(m)){
				ms = $.map(m, function(i,v){ return {index: v, value: i}; });
			}
			ms.sort(function(a,b){
				if(Utils.isObject(m) && !$.isUndefined(n)){
					if(a[n] < b[n]){
						return -1;
					}
					if(a[n] < b[n]){
						return 1;
					}
				}
				else{
					if(a < b){
						return -1;
					}
					if(a < b){
						return 1;
					}
				}
				return 0;
			})
			if(t == "desc"){
				ms.reverse();
			}
			if(Utils.isObject(m)){
				m = {};
				$.each(ms, function(i,v){
					m[v.index] = v.value;
				})
				ms = m;
			}
			return ms;
		},
		center:function(e,fn){
			var el = (this.isjQElement(e))?e:$(e);
			var p = el.parent();
			var w = Math.abs(p.outerWidth()/2 - el.outerWidth()/2);
			var h = Math.abs(p.outerHeight()/2 - el.outerHeight()/2);
			var center = function(){
				el.css({
					top: h,
					left: w
				})
			};
			center();
			$(window).on("resize-center",function(){
				center();
			})
		},
		concatLinkChat: function(links,param){
			var l = links;
			if(!this.isUrl(l)){return false; }
			var p = [];
			if(param != undefined){
				$.each(param, function(index, val) {
					 if(val != "" && val != undefined){
					 	p.push(index+"="+encodeURI(val));
					 }
				});
				l += p.join("&");
			}
			return l;
		},
		strsplit:function(text,long){
			if(text.length == long){
				return text;
			}
			var t = text.substring(0, long);
			return t+'...';
		},
		splitObj:function(obj){
			if(!this.isObject(obj)){ return [];}
			var arr = [];
			$.each(obj, function(i, val) {
				var  e = [];
				e.push(i);
				e.push(val)
				arr.push(e);
			});
			return arr;
		},
		isMovil:function(){
			return ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) ?
					   true: false;
		}
	};
	/**
	 * Valida si el elemento esta indefinido
	 * @param  {*|all}  u elemento, valor, matiz
	 * @return {Boolean}   true si es indefinido
	 */
	$.isUndefined = function(u){
		return (u === undefined)?true:typeof u === undefined;
	}
	/**
	 * Valida si el valor dado es NULL
	 * @param  {*|all}  u valor a validar
	 * @return {Boolean}   true si es NULL, false de lo contrario
	 */
	$.isNull= function(u){
		return (u === null)?true:typeof u === null;
	}
	SNA.utils = Utils;
	
	/**
	 * Conjunto de Funcines para manejar los colores
	 * @type {Object}
	 */
	var Color = {
		_is:function(){
			var that = this;
			var n = ['hsv', 'hsl', 'hsla', 'rgb', 'rgba'];
			$.each(n,function(s,n){
				that['is'+n.toUpperCase()] = function(v){
					if(Utils.isObject(v)){
						var o = n.split("");
						var l = o.length;
						if(l == 4){
							return o[0] in v && o[1] in v && o[2] in v && o[3] in v;
						}else{
							return o[0] in v && o[1] in v && o[2] in v;
						}
					}else if(Utils.isString(v)){
						var p = v.split("(");
						return (p[0] == n);
					}
					return false;
				}
			});
		},
		indent:function(c){
			var color = false;
			var Hex = this.toHEX(c);
			$.each(SNA.colorList,function(i,cl){
				if(cl.toLowerCase() == Hex.toLowerCase()){
					color = {
						name: i,
						color: cl
					};
				}
			});
			
			return color;
		},
		get:function(name){
			return (SNA.colorList.hasOwnProperty(name))
			? SNA.colorList[name]
			: false;
		},
		setColor:function(name,value){
			if(SNA.utils.isColor(value)){
				SNA.colorList[name] = value;
			}
			return this.get(name);
		},
		hex2rgb: function(hex){
			var regex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			hex = hex.replace( regex, function( m, r, g, b ) {
				return r + r + g + g + b + b;
			});
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
			return result ? {
				r: parseInt( result[1], 16 ),
				g: parseInt( result[2], 16 ),
				b: parseInt( result[3], 16 )
			} : null;
		},

		rgb2hex: function(r,g,b){
			var rgb = {};
			if(Utils.isObject(r)){
				rgb = r;
			}else{
				rgb = {
					r:r,
					g:g,
					b:b
				};
			}
			return "#" +
				Utils.dec2hex(rgb.r)+
				Utils.dec2hex(rgb.g)+
				Utils.dec2hex(rgb.b);
		},

		rgb2hsv: function(rgb){
			var hsv ={};
			var h, s, v;
			var r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
			var max = Math.max(r, g, b);
			var min = Math.min(r, g, b);
			var delta = max - min;

			v = max;

			if (max === 0) {
				s = 0;
			} else {
				s = 1 - min / max;
			}

			if (max === min) {
				h = 0;
			} else if (max === r && g >= b) {
				h = 60 * ( (g - b) / delta );
			} else if (max === r && g < b) {
				h = 60 * ( (g - b) / delta) + 360
			} else if (max === g) {
				h = 60 * ( (b - r) / delta) + 120
			} else if (max === b) {
				h = 60 * ( (r - g) / delta) + 240
			} else {
				h = 0;
			}

			hsv.h = h;
			hsv.s = s;
			hsv.v = v;

			return hsv;
		},

		hsv2rgb: function(hsv){
			var r, g, b;
			var h = hsv.h, s = hsv.s * 100, v = hsv.v * 100;
			var Hi = Math.floor(h / 60);
			var Vmin = (100 - s) * v / 100;
			var alpha = (v - Vmin) * ( (h % 60) / 60 );
			var Vinc = Vmin + alpha;
			var Vdec = v - alpha;

			switch (Hi) {
				case 0: r = v; g = Vinc; b = Vmin; break;
				case 1: r = Vdec; g = v; b = Vmin; break;
				case 2: r = Vmin; g = v; b = Vinc; break;
				case 3: r = Vmin; g = Vdec; b = v; break;
				case 4: r = Vinc; g = Vmin; b = v; break;
				case 5: r = v; g = Vmin; b = Vdec; break;
			}

			return {
				r: Math.round(r * 255 / 100),
				g: Math.round(g * 255 / 100),
				b: Math.round(b * 255 / 100)
			}
		},

		hsv2hex: function(hsv){
			return this.rgb2hex(this.hsv2rgb(hsv));
		},

		hex2hsv: function(hex){
			return this.rgb2hsv(this.hex2rgb(hex));
		},

		hsv2hsl: function(hsv){
			var h, s, l;
			h = hsv.h;
			l = (2 - hsv.s) * hsv.v;
			s = hsv.s * hsv.v;
			s /= (l <= 1) ? l : 2 - l;
			l /= 2;
			return {h: h, s: s, l: l}
		},

		hsl2hsv: function(hsl){
			var h, s, v, l;
			h = hsl.h;
			l = hsl.l * 2;
			s = hsl.s * (l <= 1 ? l : 2 - l);
			v = (l + s) / 2;
			s = (2 * s) / (l + s);
			return {h: h, s: s, v: v}
		},
		
		toHEX: function(color){
			if (this.isHSV(color)) return this.hsv2hex(color);
			if (this.isHSL(color)) return this.hsv2hex(this.hsl2hsv(color));
			if (this.isRGB(color)) this.rgb2hex(this.toRGB(color));
			if (this.isHEX(color)) return color;
			throw new Error("Formato de Color No encontrado!");
		},
		
		toRGB: function(color){
			if (this.isHSV(color)) return this.hsv2rgb(color);
			if (this.isHSL(color)) return this.hsv2rgb(this.hsl2hsv(color));
			if (this.isRGB(color)) return color;
			if (this.isHEX(color)) return this.hex2rgb(color);
			throw new Error("Formato de Color No encontrado! "+color);
		},

		toRGBA: function(color, alpha){
			var result = this.toRGB(color);
			result.a = (Utils.isValue(alpha))? alpha : 1;
			return result;
		},

		toHSV: function(color){
			if (this.isHSV(color)) return color;
			if (this.isHSL(color)) return this.hsl2hsv(color);
			if (this.isRGB(color)) return this.rgb2hsv(this.toRGB(color));
			if (this.isHEX(color)) return this.hex2hsv(color);
			throw new Error("Formato de Color No encontrado!");
		},

		toHSL: function(color){
			return this.hsv2hsl(this.rgb2hsv(this.toRGB(color)));
		},

		toHSLA: function(color, alpha){
			var hsla;
			hsla = this.hsv2hsl(this.rgb2hsv(this.toRGB(color)));
			hsla.a = (Utils.isValue(alpha))? alpha : this.options.alpha;
			return hsla;
		},

		toString: function(color){
			var stringColor = "";
			if (this.isHEX(color)) {
				stringColor =  color;
			}
			else if (this.isRGBA(color)){
				var rgb = this.toRGBA(color);
				stringColor = "rgba("+[rgb.r, rgb.g, rgb.b, rgb.a].join(",")+")";
			}
			else if (this.isRGB(color)) {
				var rgb = this.toRGB(color);
				stringColor = "rgb("+[rgb.r, rgb.g, rgb.b].join(",")+")";
			}
			else if (this.isHSV(color)){
				var hsv = (this.isHSV(color) && Utils.isObject(color))?color:this.toHSV(color);
				stringColor = "hsv("+[hsv.h, hsv.s, hsv.v].join(",")+")";
			}
			else if (this.isHSLA(color)) {
				var hsl = this.toHSLA(color);
				stringColor =  "hsla("+[Math.round(hsl.h), Math.round(hsl.s * 100) + "%" , Math.round(hsl.l * 100) + "%", hsl.a].join(",")+")";
			}
			else if (this.isHSL(color)) {
				var hsl = (this.isHSL(color) && Utils.isObject(color))?color:this.toHSL(color);
				stringColor = "hsl("+[Math.round(hsl.h), Math.round(hsl.s * 100) + "%" , Math.round(hsl.l * 100) + "%"].join(",")+")";
			}
			else { stringColor = false; }
			
			return stringColor;
		},
		isDark: function(color){
			var rgb = this.toRGB(color);
			var YIQ = (
				( rgb.r * 299 ) +
				( rgb.g * 587 ) +
				( rgb.b * 114 )
			) / 1000;
			return ( YIQ < 128 )
		},

		isLight: function(hex){
			return !this.isDark(hex);
		},

		isHEX: function(val){
			return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(val);
		},

		isColor: function(color){
			return this.isHEX(color) || this.isRGB(color) || this.isRGBA(color) || this.isHSV(color) || this.isHSL(color);
		},
		darken:function(color, base){
			return this.lighten( color, -1 * Math.abs(base) );
		},
		lighten: function(color, base){
			var hsl = this.toHSL($.trim(color));
			var l = (hsl.l * 100) + base;
			hsl.l = (l / 100);
			return hsl;
		},
		saturate: function(color, base){
			var hsl = this.toHSL(color);
			var s = (hsl.s * 100) + base;
			hsl.s = (s / 100);
			return hsl;
		},
		
		desaturate: function(color, base){
			return this.saturate( color, -1 * Math.abs(base) );
		},
		adjustHue: function(color, base){
			var hsl = this.toHSL(color);
				hsl.h = Utils.por(base+"%", 360); 
				hsl.h = (hsl.h > 360) ? 360: hsl.h;
				hsl.h = (hsl.h < 0) ? 0: hsl.h;
				
			return hsl;
		}
	};
	Color._is();
	
	SNA.color = Color;

	/**
	 * Objeto que contine el idioma y los diccionarios de Idiomas
	 * @type {Object}
	 */
	var Locate = {
		locale: "es-VE",
		options:{
			langText:'',
			social:{},
			mailto:{},
			floating:{},
			buttons:{},
			validation:{}
		},
		setup:function(lang,option){
			this[lang] = $.extend({},this.options,option);
			window.SHLANG = lang;
			return this;
		},
		//INGELS
		'en-US': {
			"langText":"Inglés Estados Unidos",
			"social":{
				'share':'Share',
				'titleShare':'Share on',
				"like":'I like',
				"followme":"Follow us on",
				"textFollowme":'Followme'
			},
			mailto:{
				'write':'Write us at',
				'contact':'Contact us by',
				'share':'Share via email',
				'to': 'To',
				'subject':'Subject',
				'message':'Message',
				'email_address':'Whast is your email?',
				'send':'Send',
				'fullname':'What is your name?'
			},
			floating:{
				'welcome':'Bienvenido a ',
				'welcome2':'¿En que podemos Ayudarte? '
			},
			"buttons": {
				"ok": "OK",
				"cancel": "Cancel",
				"done": "Done",
				"today": "Today",
				"now": "Now",
				"clear": "Clear",
				"help": "Help",
				"yes": "Yes",
				"no": "No",
				"random": "Random",
				"save": "Save",
				"reset": "Reset"
			},
			"validation":{
				"email":'Enter a valid email address',
				"text":"Please enter a valid text",
				"required":'Field required'
			}
		},
		
		//ESPAÑOL VENEZUELA
		'es-VE': {
			"langText":"Español Venezuela",
			"social":{
				'share':'Compartir',
				'titleShare':'Compartir en',
				"like":'Me gusta',
				"followme":"Siguenos en",
				"textFollowme":"Siguenos"
			},
			"mailto":{
				'write':'Escribenos a',
				'contact':'Contactanos por',
				'share':'Compartir vía correo',
				'to': 'Para',
				'subject':'Asunto',
				'message':'Mensaje',
				'email_address':'¿Cuál es tu correo electrónico',
				'send':'Enviar',
				'fullname':'¿Cómo te llamas?'
			},
			floating:{
				'welcome':'Bienvenido a ',
				'welcome2':'¿En que podemos Ayudarte? '
			},
			"buttons": {
				"ok": "Aceptar",
				"cancel": "Cancelar",
				"done": "Hecho",
				"today": "Hoy",
				"now": "Ahora",
				"clear": "Limpiar",
				"help": "Ayuda",
				"yes": "Si",
				"no": "No",
				"random": "Aleatorio",
				"save": "Guardar",
				"reset": "Reiniciar"
			},
			"validation":{
				"email":'Ingrese una dirección de correo válido',
				"required":'Campo Requerido',
				"text":"Por favor ingrese un texto válido"
			}
		}
	};
	
	SNA['locales'] = Locate;
	/**
	 * Conjunto de Funciones para la animaciones
	 * @type {Object}
	 */
	var Animations = {
		keyframes: [],
		_animate:function(elem,keyframe,duration,ease,fnIn, fnOut){
			this.ani;
			this.elem = (Utils.isjQElement(elem))?elem[0]:elem;
			this.element = $(this.elem);
			if(!$.isArray(keyframe)){ return }
			this.keyframe = keyframe;
			this.duration = ($.isNumeric(duration))?duration:1000;
			Utils.exec(fnIn,[this.element],this)
			this._initAnimate();
			if(this.ani){
				Utils.exec(fnOut, [this.element], this);
			}
			this._finish(fnOut);
			return this;
		},
		_addEfect:function(){
			var element = this.element, kf = this.keyframe, ani = this.ani;
			var m = element.data("Sanimation");
			if(m === undefined){
				m = [ani];
			}else{
				m.push(m)
			}
			element.data("Sanimation",m);
		},
		_initAnimate:function(){
			this.ani = this.elem.animate(this.keyframe,this.duration);
			this._addEfect();
		},
		_finish:function(fn){
			var that = this;
			if(this.ani){
				fn = Utils.isFunc(fn);
				if(fn === false){
					fn = function(){
						var l = that.keyframe.length;
						var css = that.keyframe[l - 1];
						that.element.css(css);
					}
				}
				this.ani.addEventListener('finish',fn);
			}
		},
		start:function(elem,keyframe,duration,ease,fncIn, fnOut){
			return this._animate(elem,keyframe,duration,ease,fncIn, fnOut)
		}
	};
	SNA['animations'] = Animations;
	
	var SNA_ANI_DURATION = 1000;
	var SNA_ANI_FUNC = 'ease-in';

	var Animate = {
		_position:function(element){
			if(element.css("position") == 'static'){
				element.css("position",'relative');
			}
		},
		_randomColor:function(){
			var colors = SNA.colorList;
			var color = {};
			$.each(colors,function(i,v){
				if(i != 'black' && i != 'white' && i != 'transparent'){
					color[i] = v;
				}
			})
			var random = Utils.random( 0, Utils.lengthObj(color) - 1 );
			var k = Object.keys(color);
			return color[ k[ random ] ];
		},
		animations:{
			/*========================
			 * SLIDE
			 */
			//Entrantes
			slideUpIn:[
				{
					transform: 'translate3d(0, 100%, 0)',
					opacity:0
				},
				{
					transform: 'translate3d(0, 0%, 0)',
					opacity:1
				}
			],
			slideDownIn:[
				{
					transform: 'translate3d(0, -100%, 0)',
					opacity:0
				},
				{
					transform: 'translate3d(0, 0, 0)',
					opacity:1
				}
			],
			slideLeftIn:[
				{
					transform: 'translate3d(-100%, 0%, 0)',
					opacity:0
				},
				{
					transform: 'translate3d(0, 0, 0)',
					opacity:1
				}
			],
			slideRightIn:[
				{
					transform: 'translate3d(100%,0, 0)',
					opacity:0
				},
				{
					transform: 'translate3d(0, 0, 0)',
					opacity:1
				}
			],
			//Slaientes:
			slideUpOut:[
				{
					transform: 'translate3d(0, 0, 0)',
					opacity:1
				},
				{
					transform: 'translate3d(0, 100%, 0)',
					opacity:0
				}
			],
			slideDownOut:[
				{
					transform: 'translate3d(0, 0, 0)',
					opacity:1
				},
				{
					transform: 'translate3d(0, -100%, 0)',
					opacity:0
				}
			],
			slideLeftOut:[
				{
					transform: 'translate3d(0, 0%, 0)',
					opacity:1
				},
				{
					transform: 'translate3d(-100%, 0, 0)',
					opacity:0
				}
			],
			slideRightOut:[
				{
					transform: 'translate3d(0,0, 0)',
					opacity:1
				},
				{
					transform: 'translate3d(100%, 0, 0)',
					opacity:0
				}
			],
			//Speed
			slideSpeedIn:[
				{ 
					transform: 'translate3d(100%, 0, 0) skewX(-30deg)',
					opacity: 0,
					offset:0
				},
				{ 
					transform: 'skewX(20deg)',
					opacity: 1,
					offset:0.6
				},
				{ 
					transform: 'skewX(-5deg)',
					opacity: 1,
					offset:0.8
				},
				{ 
					transform: 'none',
					opacity: 1,
					offset:1
				}
			],
			slideSpeedOut:[
				{ 
					transform: 'translate3d(0, 0, 0) skewX(-30deg)',
					opacity: 1,
					offset:0
				},
				{ 
					transform: 'translate3d(-60%, 0, 0) skewX(20deg)',
					opacity: 1,
					offset:0.6
				},
				{ 
					transform: 'translate3d(-100%, 0, 0) skewX(-5deg)',
					opacity: 1,
					offset:0.8
				},
				{ 
					transform: 'translate3d(-100%, 0, 0)',
					opacity: 0,
					offset:1
				}
			],
			/*========================
			 * FADE
			 */
			fadeIn:[
				{ opacity:0},
				{ opacity:1}
			],
			fadeOut:[
				{ opacity:1},
				{ opacity:0}
			],
			/*========================
			 * SPECIALES
			 */
			swing:[
				{ transform: 'rotate3d(0, 0, 1, 0deg)', offset:0},
				{ transform: 'rotate3d(0, 0, 1, 15deg)', offset:0.2},
				{ transform: 'rotate3d(0, 0, 1, -10deg)', offset:0.4},
				{ transform: 'rotate3d(0, 0, 1, 5deg)', offset:0.6},
				{ transform: 'rotate3d(0, 0, 1, -5deg)', offset:0.8},
				{ transform: 'rotate3d(0, 0, 1, 0deg)',offset:1}
			],
			Alert:[
				{transform: 'translate3d(0, 0, 0)',offset:0},
				{transform: 'translate3d(-10px, 0, 0)',offset:0.1},
				{transform: 'translate3d(10px, 0, 0)',offset:0.2},
				{transform: 'translate3d(-10px, 0, 0)',offset:0.3},
				{transform: 'translate3d(10px, 0, 0)',offset:0.4},
				{transform: 'translate3d(-10px, 0, 0)',offset:0.5},
				{transform: 'translate3d(10px, 0, 0)',offset:0.6},
				{transform: 'translate3d(-10px, 0, 0)',offset:0.7},
				{transform: 'translate3d(10px, 0, 0)',offset:0.8},
				{transform: 'translate3d(-10px, 0, 0)',offset:0.9},
				{transform: 'translate3d(0, 0, 0)',offset:1}
			],
			AlertV:[
				{transform: 'translate3d(0, 0, 0)',offset:0},
				{transform: 'translate3d(0, -10px, 0)',offset:0.1},
				{transform: 'translate3d(0, 10px, 0)',offset:0.2},
				{transform: 'translate3d(0, -10px, 0)',offset:0.3},
				{transform: 'translate3d(0, 10px, 0)',offset:0.4},
				{transform: 'translate3d(0, -10px, 0)',offset:0.5},
				{transform: 'translate3d(0, 10px, 0)',offset:0.6},
				{transform: 'translate3d(0, -10px, 0)',offset:0.7},
				{transform: 'translate3d(0, 10px, 0)',offset:0.8},
				{transform: 'translate3d(0, -10px, 0)',offset:0.9},
				{transform: 'translate3d(0, 0, 0)',offset:1}
			],
			boingUpIn:[
				{opacity: 0, transformOrigin: "50% 0%", transform: "perspective(800px) rotateX(-90deg)", offset:0 },
				{opacity: 1, transformOrigin: "50% 0%", transform: "perspective(800px) rotateX(50deg)", offset:0.5},
				{opacity: 1, transformOrigin: "50% 0%", transform: "perspective(800px) rotateX(0deg)", offset:1 }
			],
			boingUpOut:[
				{opacity: 1, transformOrigin: "50% 0%", transform: "perspective(800px) rotateX(0deg)", offset:0 },
				{opacity: 1, transformOrigin: "50% 0%", transform: "perspective(800px) rotateX(50deg)", offset:0.5},
				{opacity: 0, transformOrigin: "50% 0%", transform: "perspective(800px) rotateX(-90deg)", offset:1 }
			],
			boingDownIn:[
				{opacity: 0, transformOrigin: "100% 100%", transform: "perspective(800px) rotateX(90deg) rotateY(0deg)", offset:1 },
				{opacity: 1, transformOrigin: "0% 100%", transform: "perspective(800px) rotateX(10deg) rotateY(10deg)", offset:0.2 },
				{opacity: 1, transformOrigin: "0% 100%", transform: "perspective(800px) rotateX(0deg) rotateY(0deg)", offset:0.3 },
				{opacity: 1, transformOrigin: "100% 100%", transform: "perspective(800px) rotateX(0deg) rotateY(10deg)", offset:0.4 },
				{opacity: 1, transformOrigin: "100% 100%", transform: "perspective(800px) rotateX(0deg) rotateY(0deg)", offset:1 }
			],
			boingDownOut:[
				{opacity: 1, transformOrigin: "100% 100%", transform: "perspective(800px) rotateX(0deg) rotateY(0deg)", offset:0 },
				{opacity: 1, transformOrigin: "100% 100%", transform: "perspective(800px) rotateX(0deg) rotateY(10deg)", offset:0.2 },
				{opacity: 1, transformOrigin: "0% 100%", transform: "perspective(800px) rotateX(0deg) rotateY(0deg)", offset:0.3 },
				{opacity: 1, transformOrigin: "0% 100%", transform: "perspective(800px) rotateX(10deg) rotateY(10deg)", offset:0.4 },
				{opacity: 0, transformOrigin: "100% 100%", transform: "perspective(800px) rotateX(90deg) rotateY(0deg)", offset:1 },
			],
			boomOut:[
				{opacity: 1, transformOrigin:"50% 50%", transform:"rotate(0deg)",filter: "blur(0px)", offset: 0},
				{opacity: 1, transformOrigin:"-100% 50%", transform:"rotate(-160deg)",filter: "blur(0px)", offset: 0.5},
				{opacity: 1, transformOrigin:"-100% 50%", transform:"rotate(-250deg)",filter: "blur(20px)", offset: 0.7},
				{opacity: 0, transformOrigin:"-100% 50%", transform:"rotate(-250deg)",filter: "blur(100px)", offset: 1},
			],
			/*========================
			 * ROTACION
			 */
			rotateIn:[
				{transform: 'rotate3d(0, 1, 1, 175deg)'},
				{transform: 'rotate3d(0, 1, 1, 0deg)'}
			],
			rotateOut:[
				{transform: 'rotate3d(0, 1, 1, 0deg)'},
				{transform: 'rotate3d(0, 1, 1, 175deg)'}
			],
			rotateDownIn:[
				{opacity: 0, transformOrigin: "50% 100%", transform: "perspective(800px) rotateX(-180deg) translateZ(300px)"},
				{opacity: 1, transformOrigin: "0 0",	transform: "perspective(800px) rotateX(0deg) translateZ(0px)"}
			],
			rotateDownOut:[
				{opacity: 1, transformOrigin: "0 0",	transform: "perspective(800px) rotateX(0deg) translateZ(0px)"},
				{opacity: 0, transformOrigin: "50% 100%", transform: "perspective(800px) rotateX(-180deg) translateZ(300px)"}
			],
			rotateUpIn:[
				{opacity: 0, transformOrigin: "50% 0%", transform: "perspective(800px) rotateX(180deg) translateZ(100px)"},
				{opacity: 1, transformOrigin: "0 0",	transform: "perspective(800px) rotateX(0deg) translateZ(0px)"}				
			],
			rotateUpOut:[
				{opacity: 1, transformOrigin: "0 0",	transform: "perspective(800px) rotateX(0deg) translateZ(0px)"},
				{opacity: 0, transformOrigin: "50% 0%", transform: "perspective(800px) rotateX(180deg) translateZ(100px)"}
			],
			rotateLeftIn:[
				{opacity: 0, transformOrigin: "50% 0",	transform: "perspective(800px) rotateY(-1800deg) translateZ(300px)", offset:0},
				{opacity: 1, transformOrigin: "0% 0%", transform: "perspective(800px) rotateY(0deg) translateZ(0px)", offset:1}
			],
			rotateLeftOut:[
				{opacity: 1, transformOrigin: "0 0",	transform: "perspective(800px) rotateY(0deg) translateZ(0px)"},
				{opacity: 0, transformOrigin: "50% 0%", transform: "perspective(800px) rotateY(-180deg) translateZ(300px)"}
			],
			rotateRightIn:[
				{opacity: 1, transformOrigin: "50% 0%",	transform: "perspective(800px) rotateY(180deg) translateZ(300px)"},
				{opacity: 0, transformOrigin: "0 0", transform: "perspective(800px) rotateY(0deg) translateZ(0px)"}
			],
			rotateRightOut:[
				{opacity: 1, transformOrigin: "0 0",	transform: "perspective(800px) rotateY(0deg) translateZ(0px)"},
				{opacity: 0, transformOrigin: "50% 0%", transform: "perspective(800px) rotateY(180deg) translateZ(300px)"}
			],
			swapIn:[
				{opacity: 0, transformOrigin: "0 100%", transform: "scale(0, 0) translate(-700px, 0px)"},
				{opacity: 1, transformOrigin: "100% 100%", transform: "scale(1, 1) translate(0px, 0px)"}
			],
			swapOut:[
				{opacity: 1, transformOrigin:"100% 200%", transform:"scale(1, 1) rotate(0deg)"},
				{opacity: 0, transformOrigin:"200% 500%", transform:"scale(0, 0) rotate(270deg)"}
			],
			/*========================
			 * ZOOM
			 */
			zoomIn:[
				{transform: 'scale3d(0, 0, 0)', opacity: 0, offset:0},
				{transform: 'scale3d(.3, .3, .3)', opacity: 1, offset:0.5},
				{transform: 'scale3d(.6, .6, .6)', opacity: 1, offset:0.8},
				{transform: 'scale3d(1, 1, 1)', opacity: 1, offset:1}
			],
			zoomOut:[
				{transform: 'scale3d(1, 1, 1)', opacity: 1, offset:0},
				{transform: 'scale3d(.6, .6, .6)', opacity: 1, offset:0.5},
				{transform: 'scale3d(.3, .3, .3)', opacity: 1, offset:0.8},
				{transform: 'scale3d(0, 0, 0)', opacity: 0, offset:1}
			],
			zoomPulseIn:[
				{opacity: 0, transformOrigin: "50% 50%", transform: "scale(0, 0)", offset: 0},
				{opacity: 1, transformOrigin: "50% 50%", transform: "scale(0.9, 0.9)", offset: 0.8},
				{opacity: 1, transformOrigin: "50% 50%", transform: "scale(1, 1)", offset: 1}
			],
			zoomPulseOut:[
				{opacity: 1, transformOrigin: "50% 50%", transform: "scale(1, 1)", offset: 0},
				{opacity: 1, transformOrigin: "50% 50%", transform: "scale(0.9, 0.9)", offset: 0.8},
				{opacity: 0, transformOrigin: "50% 50%", transform: "scale(0, 0)", offset: 1}
			],
			/*========================
			 * PULSE
			 */
			flash:[
				{opacity:1, offset:0},
				{opacity:0, offset:0.25},
				{opacity:1, offset:0.5},
				{opacity:0, offset:0.75},
				{opacity:1, offset:1}
			],
			pulse:[
				{transform: 'scale3d(1, 1, 1)', offset:0},
				{transform: 'scale3d(1.05, 1.05, 1.05)', offset:0.5},
				{transform: 'scale3d(1, 1, 1)', offset:1}
			],
			slatic:[
				{transform: 'scale3d(1, 1, 1)', offset:0},
				{transform: 'scale3d(1.25, 0.75, 1)', offset:0.3},
				{transform: 'scale3d(0.75, 1.25, 1)', offset:0.4},
				{transform: 'scale3d(1.15, 0.85, 1)', offset:0.5},
				{transform: 'scale3d(.95, 1.05, 1)', offset:0.65},
				{transform: 'scale3d(1.05, .95, 1)', offset:0.75},
				{transform: 'scale3d(1, 1, 1)', offset:1}
			],
			buzi:[
				{transform: 'translate3d(0, 0, 0) rotate(0deg)', offset:0},
				{transform: 'translate3d(30px, 0, 0) rotate(20deg)', offset:0.1},
				{transform: 'translate3d(-30px, 0, 0) rotate(-20deg)', offset:0.3},
				{transform: 'translate3d(20px, 0, 0) rotate(15deg)', offset:0.4},
				{transform: 'translate3d(-20px, 0, 0) rotate(-15deg)', offset:0.7},
				{transform: 'translate3d(10px, 0, 0) rotate(5deg)', offset:0.8},
				{transform: 'translate3d(-10px, 0, 0) rotate(-5deg)', offset:0.9},
				{transform: 'translate3d(0, 0, 0) rotate(0deg)', offset:1}
			]
		},
		options:{
			speed:1000,
			ease: 'ease-in',
			toX:null,
			toY:null,
			pulseBg:[],
			pulseFg:[],
			fnIn:function(){},
			fnOut:function(){}
		},
		init:function(efect, options, elem){
			this.options = $.extend({}, this.options,options);
			this.elem = (Utils.isjQElement(elem))?elem[0]:elem;
			this.element = $(this.elem);
			
			if(efect in this){
				if(Utils.isFunc(this.elem.animate) === false){
					var int, that = this;
					clearInterval(int);
					$.each(this.animations, function(name,o){
						if(that.element.hasClass(name)){
							that.element.removeClass("animate").removeClass(name);
						}
					})
					
					this.element.addClass("animate").addClass(efect);
					int = setTimeout(function(){
						that.element.removeClass("animate").removeClass(efect);
						if(Utils.isFunc(that.options.fnOut)){
							Utils.exec(that.options.fnOut,[that.element], that);
						}
					},this.options.speed);
					return;
				}
				return this[efect]();
			}
			return this;
		},
		hue:function(){
			var element = this.element, o = this.options, speed = o.speed,
			ease = o.ease, fnIn = o.fnIn, fnOut = o.fnOut, c1 = this._randomColor(),
			c2 = this._randomColor();
			element.css({
				backgroundImage:'linear-gradient(90deg,'+c1+','+c2+')'
			})
			var keyfrma = [
				{filter: 'hue-rotate(0deg)'},
				{filter: 'hue-rotate(-360deg)'}
			];
			Animations.start(this.elem, keyfrma, o.duration,'lineal',fnIn,fnOut);
			return this;
		},
		hueText:function(){
			var element = this.element, o = this.options, speed = o.speed,
			ease = o.ease, fnIn = o.fnIn, fnOut = o.fnOut, c1 = this._randomColor(),
			c2 = this._randomColor();
			element.css({
				backgroundClip:'text',
				textFillColor:'transparent',
				backgroundImage:'linear-gradient(90deg,'+c1+','+c2+')'
			})
			var keyfrma = [
				{filter: 'hue-rotate(0deg)'},
				{filter: 'hue-rotate(-360deg)'}
			]
			Animations.start(this.elem, keyfrma, 60000,'lineal',fnIn,fnOut);
			return this;
		}
	}
	
	$.each(Animate.animations,function(name,keyfrma){
		Animate[name] = function(){
			var element = this.element, o = this.options, speed = o.speed,
			ease = o.ease, fnIn = o.fnIn, fnOut = o.fnOut;
			this._position(element);
			if(name == 'slideSpeedIn'){
				ease = 'ease-out';
			}
			if(name == 'slideSpeedOut'){
				ease = 'ease-in';
			}
			if(name.indexOf('In') != -1){
				element.css('visibility','visible');
				
			}else if(name.indexOf('Out') != -1){
				setTimeout(function(){
					element.css('visibility','hidden');
					if(name == "rotateIn" || name == "rotateOut"){
						element.css({transform: 'rotate3d(0, 1, 1, 0deg)'})
					}
				},speed+10);
			}
			
			Animations.start(this.elem,keyfrma,speed,ease,fnIn,fnOut);
			return this;
		}
	})
	
	SNA['animate'] = Animate;
	/**
	 * Motor de Plantillas
	 * @param {String} html    Codigo HTML (La Plantilla)
	 * @param {Object} options Conjunto de Opciones de la Plantilla
	 */
	var TemplateEngine = function(html, options) {
		var re = /<%(.+?)%>/g,
			reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g,
			code = 'with(obj) { var r=[];\n',
			cursor = 0,
			result,
			match;
		var add = function(line, js) {
			js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
				(code += line !== '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
			return add;
		};
		while(match = re.exec(html)) {
			add(html.slice(cursor, match.index))(match[1], true);
			cursor = match.index + match[0].length;
		}
		add(html.substr(cursor, html.length - cursor));
		code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, ' ');
		try { result = new Function('obj', code).apply(options, [options]); }
		catch(err) { console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n"); }
		return result;
	};
	SNA['tpl'] = TemplateEngine;
	/**
	 * Obtiene los Valores de los metadatos de la página
	 * @return {Object} Objeto con lo metadatos encontrados
	 */
	var rx = {
		twfb:/([twitter|fb]+):(\w+)/,
		og:/([og|article]+):(\w+)/
	};
	var meta=function(){
		var meta = {
			twitter:{},
			fb:{},
			og:{}
		};
		
		$.each($('meta'),function(i,m){
			var m = $(m);
			var content = m.attr("content");
			if(!$.isUndefined(m.attr("name"))){
				var name = m.attr("name");
				if(rx.twfb.test(name)){
					var d = rx.twfb.exec(name);
					meta[d[1]][d[2]] = content; 
				}else{
					meta[name] = content;
				}
			}
			if(!$.isUndefined(m.attr('property'))){
				var property = m.attr('property');
				if(rx.og.test(property)){
					var d = rx.og.exec(property);
					meta[d[1]][d[2]] = content; 
				}else{
					meta[property] = content;
				}
			}
		})
		return meta;
	}
	
	SNA.getMeta = meta;
	/**
	 * Funciones para manejar los Links de SNA
	 * @type {Object}
	 */
	var Links = {
		set:function(name, url, type){
			var link = SNA.links;
			var type = (!$.isUndefined(type) && link.hasOwnProperty(type))?type:'followme';
			if(!Utils.isUrl(url)){ return; }
			link[type][name] = url;
			SNA.links = $.extend({}, SNA.links, link);
			return SNA.links;
		},
		get:function(name,type){
			var link = SNA.links;
			var type = (!$.isUndefined(type) && link.hasOwnProperty(type))?type:'followme';
			return link[type][name];
		}
	};
	SNA.newlinks = Links;
	/* ---------------------------------------------------------------------------------------
	*	PLUGINS Y FUNCIONES PUBLICAS
	* ---------------------------------------------------------------------------------------*/
	
	/**
	 * $.fn.shanimate
	 * Función que se encarga de animar un elemento
	 * @param {Object} AnimatePgl.options
	 * @returns {Object} El objeto de animacion.
	 */
	var AnimatePgl = {
		options:{
			speed:1000,
			efect:'',
			ease: 'ease-in',
			fnIn:function(){},
			fnOut:function(){}
		},
		init:function(options, elem){
			this.elem = elem;
			this.element = $(elem);
			this.option = $.extend({},this.options,options);
			this.option = $.extend({}, this.option, this.setOptionsFromDOM(this));
			return Animate.init(this.option.efect,this.option,this.elem);
		}
	}
	SNA.plugin('shanimate',AnimatePgl);
	
	/**
	 * $.fn.hints
	 * Función que se encarga de mostrar los Titles
	 * @param {Object} Hints.options
	 * @returns {Object} El objeto de Title.
	 */
	var Hints = {
		options:{
			hide:5000,
			clsHints:'',
			hintsText:"",
			hintsIcons:"",
			htPosition:'bottom',
			htOffset:5,
			htEfects:null,
			htShowPermanet:false,
			onHintShow:function(){},
			onHintHide:function(){}
		},
		init: function(options, elem){
			this.options = $.extend( {}, this.options, options );
			this.elem  = elem;
			this.element = $(elem);
			this.options = $.extend({}, this.options, this.setOptionsFromDOM(this));
			this.hints = null;
			this.size = {
				width:0,
				height:0
			}
			if($.isNull(this.options.htEfects)){
				this.options.htEfects = {
					speed:200
				}
				if(this.options.htPosition.toLowerCase() === 'bottom' ||
				this.options.htPosition.toLowerCase() === 'bottom-left' ||
				this.options.htPosition.toLowerCase() === 'bottom-right'){
					this.options.htEfects.In = 'slideUpIn';
					this.options.htEfects.Out = 'slideUpOut';
					
				}
				if(this.options.htPosition.toLowerCase() === 'top' ||
				this.options.htPosition.toLowerCase() === 'top-left' ||
				this.options.htPosition.toLowerCase() === 'top-right'){
					this.options.htEfects.In = 'slideDownIn';
					this.options.htEfects.Out = 'slideDownOut';
					
				}
				if(this.options.htPosition.toLowerCase() === 'left'){
					this.options.htEfects.In = 'slideLeftIn';
					this.options.htEfects.Out = 'slideLeftOut';
					
				}
				if(this.options.htPosition.toLowerCase() === 'right'){
					this.options.htEfects.In = 'slideRightIn';
					this.options.htEfects.Out = 'slideRightOut';
					
				}
			}
			this._create();
			return this;
		},
		_create:function(){
			var that = this, o = this.options, element = this.element;
			if(o.htShowPermanet){
				this._createHints();
			}
			element.on(SNA.events.enter+"-hints",function(e){
				if($.isNull(that.hints)){
					that._createHints();
					if(o.hide > 0){
						setTimeout(function(){
							that._remove();
						},o.hide)
					}
				}
			})
			element.on(SNA.events.leave+"-hints",function(e){
				that._remove();
			})
			$(window).on(SNA.events.scroll+"-hints",function(){
				if(!$.isNull(that.hints)){
					that.setPosition();
				}
			})
		},
		_createHints:function(){
			var that = this, element = this.element, o = this.options;
			this.hints = $('<div>').addClass('hints').addClass(o.clsHints);

			if(Utils.isTag(o.hintsIcons)){
				$(o.hintsIcons).appendTo(this.hints);
			}else if(Utils.isValue(o.hintsIcons)){
				$('<i class="icons '+o.hintsIcons+'"></i>').appendTo(this.hints);
			}
			this.hints.append('<span class="hints-title">'+o.hintsText+'</span>');
			
			this.size = Utils.hiddenElementSize(this.hints);
			if(o.clsHints.indexOf('h2o') > -1){
				var title_size = Utils.hiddenElementSize(this.hints.find(".hints-title"));
				if(this.size.width < title_size.width){
					this.hints.css({
						width: title_size.width + title_size.width/4,
						height: title_size.width + title_size.width/4
					})
				}
				this.size = Utils.hiddenElementSize(this.hints);
			}
			$('.hints:not(.show)').remove();
			if(o.htShowPermanet){
				this.hints.addClass("show");
			}
			this.hints.shanimate({
				efect:o.htEfects.In,
				speed:o.htEfects.speed,
				fnIn:function(){
					that.setPosition();
				},
				fnOut:function(){
					if(!$.isNull(that.hints)){
						that.hints.css('display','block');
					}
				}
			})
			
			this.hints.appendTo($('body'));
			
			Utils.exec(o.onHintShow, [this.hints, element], this);
		},
		_remove:function(){
			var that = this, o = this.options, hints = this.hints, element = this.element,
			timeOut = (Utils.isFunc(o.onHintHide))?300:0;
			if(!$.isNull(hints)){
				if(!hints.hasClass("show")){
					hints.shanimate({
						efect:o.htEfects.Out,
						speed:o.htEfects.speed,
						fnOut:function(){
							Utils.exec(o.onHintHide,[hints,element], that);
							setTimeout(function(){
								hints.css('display','none');
								hints.remove();
							},timeOut)
						}
					})
				}
			}
			this.hints = null;
		},
		removeHints:function(){
			var d = this.element.data("hints");
			if(d !== undefined){
				d._remove();
			}
		},
		setPosition:function(){
			var hint = this.hints, hint_size = this.size, o = this.options, element = this.element,
			pos = o.htPosition.toLowerCase(),
			offset = element.offset(),
			scrollTop = $(window).scrollTop(),
			scrollLeft = $(window).scrollLeft(),
			hOffset = element.outerHeight(),
			wOffset = element.outerWidth();
			
			hint.addClass(pos);
			if(pos === "bottom"){
				hint.css({
					top: offset.top - scrollTop + hOffset + o.htOffset,
					left: offset.left + wOffset/2 - hint_size.width/2 - scrollLeft
				});
			}
			else if(pos === "bottom-left"){
				hint.css({
					top: offset.top - scrollTop + hOffset + o.htOffset,
					left: offset.left + wOffset/2 - hint_size.width - scrollLeft
				});
			}else if(pos === 'bottom-right'){
				hint.css({
					top: offset.top - scrollTop + hOffset + o.htOffset,
					left: offset.left + wOffset/2 - scrollLeft + o.htOffset
				});
			}
			else if(pos === 'right'){
				hint.css({
					top: offset.top + hOffset/2 - hint_size.height/2 - scrollTop - 10,
					left: offset.left + wOffset - scrollLeft + o.htOffset + 5
				});
			} else if (pos === 'left') {
				hint.css({
					top: offset.top + hOffset/2 - hint_size.height/2 - scrollTop - 10,
					left: offset.left - hint_size.width - scrollLeft - o.htOffset - 5
				});
			} 
			else if(pos === 'top-right'){
				hint.css({
					top: offset.top - scrollTop - hint_size.height - o.htOffset - 14,
					left: offset.left + wOffset/2 - scrollLeft + o.htOffset
				});
			} else if (pos === 'top-left') {
				hint.css({
					top: offset.top - scrollTop - hint_size.height - o.htOffset - 14,
					left: offset.left + wOffset/2 - hint_size.width  - scrollLeft
				});
			} 
			else {
				hint.css({
					top: offset.top - scrollTop - hint_size.height - o.htOffset - 14,
					left: offset.left + wOffset/2 - hint_size.width/2  - scrollLeft
				});
			}
		},
		changeText: function(){
			this.options.hintsText = this.element.attr("data-hints-text");
		},

		changeAttr: function(attributeName){
			switch (attributeName) {
				case "data-hints-text": this.changeText(); break;
				case "data-ht-position": this.setPosition(); break;
			}
		},
		destroy:function(){
			this._remove();
			this.element.off(SNA.events.enter + "-hints");
			this.element.off(SNA.events.leave + "-hints");
			$(window).off(SNA.events.scroll + "-hints");
		}
	}
	SNA.plugin('hints', Hints);

	/**
	 * $.fn.draggable
	 * Función que se encarga de realizar el arraste de los elementos
	 * @param {Object} Draggable.options
	 * @returns {Object} El objeto de Drag.
	 */
	var Draggable = {
		options:{
			dragElement: 'self',
			dragArea: "parent",
			onCanDrag: function(){return true; },
			onDragStart:function(position, element){},
			onDragStop: function(position, element){},
			onDragMove: function(position, element){},
		},
		init: function(options, elem){
			this.options = $.extend( {}, this.options, options );
			this.elem  = elem;
			this.element = $(elem);
			this.options = $.extend({}, this.options, this.setOptionsFromDOM(this));
			this.drag = false;
			this.move = false;
			this.backup = {
				cursor: 'default',
				zIndex: '0'
			};
			
			this._create();
			
			return this;
		},
		_page:function(e){
			 return {
				x: e.changedTouches ? e.changedTouches[0].pageX : e.pageX,
				y: e.changedTouches ? e.changedTouches[0].pageY : e.pageY
			};
		},
		_create:function(){
			var that = this, element = this.element, o = this.options,
			dragArea, offset, position, shift, coords,
			dragElement = (o.dragElement !== "self")? element.find(o.dragElement):element;
			
			dragElement[0].ondragstart = function(){return false;};
			
			dragElement.on(SNA.events.start+"-draggable", function(e){

				if (element.data("canDrag") === false || Utils.exec(o.onCanDrag, [element]) !== true) {
					return ;
				}

				if (isTouch === false && e.which !== 1) {
					return ;
				}

				that.drag = true;

				that.backup.cursor = element.css("cursor");
				that.backup.zIndex = element.css("z-index");
				that.backup.cursorElement = dragElement.css("cursor");
				
				dragElement.css("cursor","move")
								
				element.addClass("draggable");

				if (o.dragArea === 'document' || o.dragArea === 'window') {
					o.dragArea = "body";
				}

				if (o.dragArea === 'parent') {
					dragArea = element.parent();
				} else {
					dragArea = $(o.dragArea);
				}
				
				offset = {
					left: dragArea.offset().left,
					top:  dragArea.offset().top
				};

				position = that._page(e);

				var drg_h = element.outerHeight(),
					drg_w = element.outerWidth(),
					pos_y = element.offset().top + drg_h - that._page(e).y,
					pos_x = element.offset().left + drg_w - that._page(e).x;

				Utils.exec(o.onDragStart, [position, element], that);

				$(document).on(SNA.events.move+"-draggable", function(e){
					var pageX, pageY;

					if (that.drag === false) {
						return ;
					}
					that.move = true;

					pageX = that._page(e).x - offset.left;
					pageY = that._page(e).y - offset.top;

					var t = (pageY > 0) ? (pageY + pos_y - drg_h) : (0);
					var l = (pageX > 0) ? (pageX + pos_x - drg_w) : (0);
					var t_delta = dragArea.innerHeight() + dragArea.scrollTop() - element.outerHeight();
					var l_delta = dragArea.innerWidth() + dragArea.scrollLeft() - element.outerWidth();

					if(t >= 0 && t <= t_delta) {
						position.y = t;
						element.offset({top: t + offset.top});
					}
					if(l >= 0 && l <= l_delta) {
						position.x = l;
						element.offset({left: l + offset.left});
					}

					Utils.exec(o.onDragMove, [position, element], that);

					e.preventDefault();
				});
			});

			dragElement.on(SNA.events.stop+"-draggable", function(e){
				element.css({
					cursor: that.backup.cursor,
					zIndex: that.backup.zIndex
				}).removeClass("draggable");
				dragElement.css("cursor",that.backup.cursorElement)
				that.drag = false;
				that.move = false;
				position = that._page(e);
				$(document).off(SNA.events.move+"-draggable");
				Utils.exec(o.onDragStop, [position, element], that);
			});
		},
		off: function(){
			this.element.data("canDrag", false);
		},

		on: function(){
			this.element.data("canDrag", true);
		},
	}
	SNA.plugin('draggable', Draggable);

	/**
	 * $.fn.modal
	 * Función que se encarga de crear las ventanas modales
	 * @param {Object} Modals.options
	 * @returns {Object} El objeto de Modals.
	 */
	var Modals ={
		options:{
			//OBLIGATORIOS
			type: "modal",
			content: "",
			
			//MODALS
			footerAling:'left',
			footerCreate:false,
			buttons:null,
									
			//OVERLAY
			overlay:true,
			bgOverlay:SNA.colorList.black,
			alphaOverlay:0.5,
			
			//THUANAR
			icons:"",
			showMaximize:false,
			showBtnMin:true,
			showBtnMax:true,
			showBtnRolling:true,
			destroy:true,
			thunarPos:{
				position:"relative",
				top:0,
				left:0
			},
			thunarId:undefined,
			
			//INFOMODAL, THUNAR y MODALS
			clickOverlayOnClose: false,
			showBtnClose:true,
			posBtnClose:"right",
						
			//GENERAL
			title: "",
			toggleElement:null,
			show:false,
			resize:false,
			position:'center',// valores posibles: top, top-left, top-right, bottom bottom-left, bottom-right, left, right, center 				
			draggable:false,
			dragElement:'.head',
			dragArea:'parent',
			width:500,
			height:'auto',
			autoHide: false,
			locale: window.SNALANG,
			
			//EFECTOS
			speed:1000,
			efectShow:'fadeIn',
			efectHide:"fadeOut",
			
			//CSS GENERAL
			clsModal:"",
			clsHead:"",
			clsTitle:"",
			clsBtnClose:"",
			clsBody:"",
			clsFooter:"",
			clsOverlay:"",
			
			//CSS THUNAR
			clsIcons:"",
			clsBtnMin:"",
			clsBtnMax:"",
			clsBtnRolling:"",
			
			//FUNCIONES
			//GENERAL
			onMdResizeStart:function(element, size){},
			onMdResizeStop:function(element,size){},
			onMdResize:function(element,size){},
			onMdCreate:function(element){},
			onMdStart:function(position, element){},
			onMdStop:function(position, element){},
			onMdMove:function(position, element){},
			onMdShow:function(element){},
			onMdHide:function(element){},
			
			//OVERLAY
			onMdClickOverlay:function(overlay, element){},
			
			//BOTONES
			onMdClickClose:function(element){},
			onMdClickMin:null,
			onMdClickMax:function(element){},
			onMdClickRolling:function(rolling,element){},
			
			//THUNAR
			onMdThunarDestroy:function(){},
			onMdThunarFn:function(){return true;}
		},
		fnDefault:function(element){},
		optionsBtn:{
			cls:"",
			label:"",
			onClick:function(btn,modal){}
		},
		init: function(options, elem){
			this.options = $.extend( {}, this.options, options );
			this.elem  = elem;
			this.element = $(elem);
			this.options = $.extend({}, this.options, this.setOptionsFromDOM(this));
			this.modals = null;
			this.overlay = null;
			this.bodyHeight = 0;
			this.thunarPosition = {};
			this.thunar = null;
			this.displayOrigin= null;
			if(Utils.isString(this.options.locale)){
				this.options.locale = SNA.locales[this.options.locale];
			}
			this._create();
			
			return this;
		},
		_create:function(){
			var that = this, o = this.options, element = this.element;
			this.displayOrigin = element.css("display");
			if("_create"+o.type.toUpperCase() in this){
				this["_create"+o.type.toUpperCase()]();
				if(o.type.toLowerCase() !== 'modal'){
					if(o.type.toLowerCase() === "info"){
						element.addClass("infomodal");
					}else{
						element.addClass(o.type);
					}
				}
			}
			if(o.type.toLowerCase() != "thunar"){
				element.addClass("modal").addClass(o.clsModal);
			
				if($.isUndefined(element.attr("id"))){element.attr("id",Utils.elementId("md-"+o.type))}
				
				if(o.overlay === true){
					this.overlay = this._createOVERLAY();
				}
				
				element.css({
					width: o.width,
					height: o.height,
					visibility: "hidden",
					display: "none"
				});
			}
			
			if(o.show === true){
				this.open();
			}
			if(o.type.toLowerCase() === "thunar"){
				element = this.thunar;
			}
			$(window).on(SNA.events.resize+"-modal_"+element.attr("id"),function(){
				that.setPosition();
			})
			
			if(o.resize === true){
				var resizer = $("<span>").addClass("resize-element");
				resizer.appendTo(element);
				element.addClass("resizable");
				element.shresize({
					resizeElement: ".resize-element",
					onResizeStart: o.onMdResizeStart,
					onResizeStop: o.onMdResizeStop,
					onResize: o.onMdResize
				});
			}
			if(o.draggable === true){
				element.draggable({
					dragElement: o.dragElement,
					dragArea: o.dragArea,
					onDragStart: o.onMdStart,
					onDragStop: o.onMdStop,
					onDragMove: o.onMdMove
				});
			}
			if(!$.isNull(o.toggleElement)){
				var toggleElement;
				if(Utils.isjQElement(o.toggleElement)){
					toggleElement = o.toggleElement;
				}else{
					toggleElement = $(o.toggleElement);
				}
				if(toggleElement.length > 0){
					toggleElement.on(SNA.events.click+"-modal-btn",function(){
						that.open();
					})
				}
			}
			Utils.exec(o.onMdCreate,[element], this);
		},
		_createFooterBTN:function(){
			var that = this, element = this.element, o = this.options,
			footer = element.find(".footer");
			if($.isArray(o.buttons)){
				$.each(o.buttons,function(i,v){
					var buttons = $('<button>').addClass('btn');
					var btn = $.extend({},that.optionsBtn, v);
					buttons.addClass(v.cls);
					buttons.on(SNA.events.click, function(e){
						SNA.stop(e);
						var fn = Utils.isFunc(v.onClick);
						if(fn === false && Utils.isString(v.onClick)){
							if(v.onClick in that){
								that[v.onClick]();
							}
						}
						else{
							Utils.exec(fn, [$(this), element], that);
						}
					});
					buttons.html(v.label);
					buttons.appendTo(footer);
				})
			}else if(o.footerCreate === true){
				var btnClose = $("<button>").addClass('danger').html( o.locale.buttons.cancel );
				btnClose.on(SNA.events.click+"-modal", function(e){
					that.close();
				})
				btnClose.appendTo(footer);
			}
		},
		_createHeadBTN:function(){
			var that = this, o = this.options, element = this.element,
			head = element.find(".head"), type = o.type;
			if(type.toLowerCase() != 'thunar'){
				if(o.showBtnClose === true){
					var btnClose = $("<button>").addClass("sm close").addClass(o.clsBtnClose).addClass(o.posBtnClose);
					btnClose.on(SNA.events.click+"-modal", function(e){
						that.close();
						Utils.exec(o.onMdClickClose,[element], that);
					});
					btnClose.appendTo(head);
				}
			}
		},
		_createMODAL:function(){
			var that = this, o = this.options, element = this.element,
			head = (element.find(".head").length > 0)?element.find(".head"):$("<div>").addClass("head").appendTo(element),
			title = (head.find(".title").length > 0)?head.find(".title"):$("<div>").addClass("title").appendTo(head),
			body = (element.find(".body").length > 0)?element.find(".body"):$("<div>").addClass("body").appendTo(element),
			footerCreate = o.footerCreate === true || $.isArray(o.buttons) && element.find("footer").length == 0,
			footer = (footerCreate === true)? $("<div>").addClass("footer").appendTo(element) : element.find("footer");
			
			head.addClass(o.clsHead);
			title.addClass(o.clsTitle);
			if(Utils.isValue(o.title)){
				title.html(o.title);
			}
			body.addClass(o.clsBody);
			if(Utils.isValue(o.content)){
				body.html(o.content);
			}
			if(Utils.isValue(o.icons)){
				var icons;
				if(Utils.isTag(o.icons)){
					icons = $(o.icons);
				}else{
					icons = $('<i>').addClass(o.icons);
				}
				icons.addClass("icons "+ o.clsIcons);
				icons.prependTo(head);
			}
			this._createHeadBTN();
			
			this._createFooterBTN();
			
			if(footer.length > 0){
				footer.addClass(o.clsFooter);
				if(o.footerAling === "center"){
					footer.addClass("justify-content-center")
				}
				else if(o.footerAling === "right"){
					footer.addClass("justify-content-end")
				}
				else if(o.footerAling === "left"){
					footer.addClass("justify-content-start")
				}
			}
		},
		_createTHUNAR:function(){
			var that = this, element = this.element, o = this.options,
			thunar, overlay, parent = (o.dragArea.toLowerCase() === "parent")?element.parent(): o.dragArea;
			
			parent = (Utils.isjQElement(parent))?parent:$(parent);
			
			if(o.content.toLowerCase() === "inserto"){
				o.content = element;
			}
			thunar = this._thunar(o);
			
			parent.append(thunar);
			
			if(o.overlay === true){
				this.overlay = this._createOVERLAY();
				if(parent.find(".overlay").length === 0){
					parent.append(thunar.parent());
				}
			}
			this.thunar = thunar;
						
			thunar.find(".head").on(SNA.events.dblclick+"-modal-thunar", function(){
				that.maximize();
			})
			setTimeout(function(){
				that.setPosition();

				if (o.show === true) {
					that.open()
				}
				Utils.exec(o.onShow, [that.thunar], that);
			}, 100);
		},
		_createOVERLAY:function(){
			var o = this.options, 
			overlay = $("<div>").addClass("overlay").addClass(o.clsOverlay);
			if(o.bgOverlay === "transparent"){
				overlay.addClass("bg-transparent");
			}else{
				var bg = Color.toRGBA(o.bgOverlay, o.alphaOverlay);
					bg = "rgb("+[bg.r, bg.g, bg.b, bg.a].join(",")+')';
				overlay.css("background",bg);
			}
			return overlay;
		},
		_thunar:function(o){
			var that = this, thunar = $("<div>").addClass("modal thunar").addClass(o.clsModal),
			head, btnRolling, title, icons, btngroup, btnMin, btnMax, btnClose, body, embed;
			thunar.css({
				width: o.width,
				height:o.height,
				position:o.thunarPos.position,
				top:o.thunarPos.top,
				left:o.thunarPos.left
			})
			
			head = $("<div>").addClass("head").addClass(o.clsHead).appendTo(thunar);
			body = $("<div>").addClass("body").addClass(o.clsBody).appendTo(thunar);
			
			if(o.showBtnRolling === true){
				btnRolling = $("<button>").addClass("sm rollings").addClass(o.clsBtnRolling);
				btnRolling.on(SNA.events.click+"-modal", function(e){
					that.rolling();
				});
				btnRolling.appendTo(head);
			}
			
			if(Utils.isValue(o.icons)){
				this.setIcons(o.icons, thunar)
			}
			
			if(Utils.isValue(o.title)){
				title = $("<span>").addClass("title").addClass(o.clsTitle).html(o.title).appendTo(head);
			}
			if(o.showBtnClose == true ||
				o.showBtnMin == true || 
				o.showBtnMax == true)
			{
				btngroup = $("<div>").addClass("btn-group").addClass(o.posBtnClose);
				
				if(o.showBtnMin === true){
					btnMin = $("<button>").addClass("sm min").addClass(o.clsBtnMin);
					btnMin.on(SNA.events.click+"-modal", function(e){
						that.minimize();
					});
					btnMin.appendTo(btngroup);
				}
				if(o.showBtnMax === true){
					btnMax = $("<button>").addClass("sm max").addClass(o.clsBtnMax);
					btnMax.on(SNA.events.click+"-modal", function(e){
						that.maximize();
					});
					btnMax.appendTo(btngroup);
				}
				if(o.showBtnClose === true){
					btnClose = $("<button>").addClass("sm close").addClass(o.clsBtnClose);
					btnClose.on(SNA.events.click+"-modal", function(e){
						that.close();
						Utils.exec(o.onMdClickClose,[thunar], that);
					});
					btnClose.appendTo(btngroup);
				}
				btngroup.appendTo(head);
			}
			
			if(!$.isUndefined(o.content)){
				if(Utils.isUrl(o.content)){
					embed = $('<div>');
					o.content = $("<div>").html("Profavor cree el plugins de carga de video");
				}else if(!Utils.isjQElement(o.content) && Utils.isFunc(o.content) !== false)
				{
					 o.content = Utils.exec(o.content);
				}
				
				if(Utils.isjQElement( o.content )){
					 o.content.appendTo(body);
				}else{
					body.html(o.content);
				}
			}
			thunar.attr("id", ($.isUndefined(o.thunarId))?Utils.elementId("thunar"):o.thunarId) 
			return thunar;
		},
		//Methdos
		close:function(){
			var that = this, o = this.options, element = this.element, timeOut = 0,
			effect = o.efectHide || 'fadeOut';
			if(!$.isNull(this.thunar)){
				element = this.thunar;
			}
			if(o.onMdHide !== this.fnDefault){
				timeOut = 300;
				Utils.exec(o.onMdHide,[element], that);
			}
			setTimeout(function(){
				element.shanimate({
					efect:effect,
					speed:o.speed,
					fnOut:function(){
						setTimeout(function(){
							if(o.type.toLowerCase() === "thunar" && o.destroy === true){
								Utils.exec(o.onMdThunarDestroy,[element], that);
								element.remove();
							}else{
								element.css({
									visibility: "hidden",
									display:"none",
									top: "100%"
								})
								element.data('open',false);
							}
							
							if(!$.isNull(that.overlay)){
								that.overlay.remove();
							}
						},o.speed - 10)
					}
				})
			},timeOut);
		},
		open: function(){
			var that = this, o = this.options, element = this.element, timeOut = 0,
			effect = o.efectShow || 'fadeIn';
			if(!$.isNull(this.thunar)){
				element = this.thunar;
			}
			if(o.overlay === true && $(".overlay").length === 0 && o.type.toLowerCase() !== "thunar"){
				this.overlay.appendTo($("body"));
				this.overlay.on(SNA.events.click+"-modal", function(){
					Utils.exec(o.onMdClickOverlay, [$(this), element], that);
				})
				if(o.clickOverlayOnClose === true && (
					o.type.toLowerCase() === "modal" || 
					o.type.toLowerCase() === "thunar" || 
					o.type.toLowerCase() === "info")){
					this.overlay.on(SNA.events.click+"-modal", function(){
						that.close();
					})
				}
			}
			this.setPosition();
			element.shanimate({
				efect:effect,
				speed:o.speed,
				fnOut:function(){
					element.css({
						visibility: "visible",
						display: that.displayOrigin
					})
					element.data('open',true);
					if(parseInt(o.autoHide) > 0){
						setTimeout(function(){
							that.close();
						},o.autoHide)
					}
					if(o.type.toLowerCase() === "prompt"){
						element.find(".body .prompt-input").focus()
					}
					Utils.exec(o.onMdShow, [element], that);
					
				}
			})
		},
		toggle:function(){
			var element = this.element;
			if(element.data("open")){
				this.close();
			}else{
				this.open();
			}
		},
		setTitle: function(titletext){
			var that = this, element = this.element, o = this.options,
			title = element.find(".title");
			if(title.length === 0){
				title = $("<div>").addClass("title").addClass(o.clsTitle);
				if(o.type !== "info"){
					title.appendTo(element.find(".head"));
				}else{
					title.appendTo(element.find(".body"));
				}
			}
			title.html(titletext);
		},
		setIcons: function(icons,thunar){
			var that = this, o = this.options,
			element = ($.isUndefined(thunar))?this.element:thunar, 
			icon = element.find(".icons"), head = element.find('.head'), newicons;
			
			if(Utils.isTag(icons)){
				newicons = $(icons);
			}else{
				newicons = $('<i>').addClass(icons);
			}
			if(icon.lenght > 0){
				icon.remove();
			}
			if(!newicons.hasClass("icons")){ newicons.addClass("icons")}
			newicons.prependTo(head);
			
		},
		setContent: function(text){
			var that = this, element = this.element, o = this.options,
			body = element.find(".body");
			
			if(body.length === 0){
				body = $("<div>").addClass("body").addClass(o.clsBody).appendTo(element);
			}
			if(Utils.isjQElement(text) && Utils.isFunc(text)){
				text = Utils.exec(text);
			}
			
			if(Utils.isjQElement(text)){
				body.append(text);
			}else{
				body.html(text);
			}
		},
		setFooter:function(text){
			var that = this, element = this.element, o = this.options,
			footer = element.find(".footer");
			
			if(footer.length === 0){
				footer = $("<div>").addClass("footer").appendTo(element);
			}
			
			if(Utils.isjQElement(text) && Utils.isFunc(text)){
				text = Utils.exec(text);
			}
			else if(Utils.isObject(text)){
				this.options.buttons = text;
				this._createFooterBTN();
			}
			
			if(Utils.isjQElement(text)){
				footer.append(text);
			}else if(!Utils.isObject(text)){
				footer.html(text);
			}
		},
		setPositionThunar:function(pos){
			var element = this.thunar;
			if(!Utils.isObject(pos)){ return; }
			pos = $.extend({}, this.options.thunarPos, pos);
			element.css({
				position: pos.position,
				top: pos.top,
				left: pos.left
			})
		},
		setPosition:function(){
			var that = this, element = this.element, o = this.options;
			if(o.type.toLowerCase() === "thunar"){ element = this.thunar; }
			var pos = o.position.toLowerCase(),
			win = (o.dragArea.toLowerCase() === "parent")? window: o.dragArea,
			win = (!Utils.isjQElement(win))?$(win):win,
			ww = win.width(), wh = win.height(),
			h = element.outerHeight(), w = element.outerWidth(),
			top = 0, left = 0;
			
			if(pos == 'center'){
				top = (wh - h)/2;
				left = (ww - w)/2;
			}else if(pos == "top"){
				left = (ww - w)/2;
			}else if(pos == "top-right"){
				left = (ww - w);
			}
			else if(pos == "left"){
				top = (wh - h)/2;
			}
			else if(pos == "right"){
				top = (wh - h)/2;
				left = (ww - w);
			}
			else if(pos == "bottom"){
				top = (wh - h);
				left = (ww - w)/2;
			}else if(pos == "bottom-left"){
				top = (wh - h);
			}else if(pos == "bottom-right"){
				top = (wh - h);
				left = (ww - w);
			}else if(pos == "auto"){
				top = "auto";
				left= "auto";
			}
			if(pos != "auto"){
				top = (top < 0)?0:top;
				left = (left < 0)?0:left;
			}
			element.css({
				top: top,
				left: left
			})
		},
		setSize:function(w,h){
			var o = this.options, e = (o.type.toLowerCase() === 'thunar')?this.thunar:this.element;
			w = ($.isUndefined(w))?o.width:w;
			h = ($.isUndefined(h))?o.height:h;
			e.css({
				width:w,
				height:h
			})
			this.reposition();
		},
		isOpen:function(){
			return this.element.data("open") === true;
		},
		rolling:function(){
			var that = this, element = this.thunar, body = element.find(".body"),
			o = this.options,
			btnRolling = element.find(".head .rollings");
			
			if(element.data("rolling")){
				body.animate({
					height:that.bodyHeight
				})
				btnRolling.removeClass("rolling");
				body.removeClass("rolling");
				element.data("rolling",false)
			}else{
				if(this.bodyHeight === 0){
					this.bodyHeight = body.outerHeight();
				}
				body.animate({
					height:0
				})
				btnRolling.addClass("rolling");
				body.addClass("rolling");
				element.data("rolling",true)
			}
			Utils.exec(o.onMdClickRolling,[element.data("rolling"),element], that);
		},
		minimize: function(){
			var that = this, element = this.thunar, body = element.find(".body"), o = this.options,
			btnMin = element.find(".head .min"), headh = element.find('.head').outerHeight();
			if(element.data("minimize") == true){ 
				Utils.exec(o.onMdClickMin,[element], that);
				return;}
			var fn  = Utils.isFunc(o.onMdClickMin);
			if(fn === false){
				this.bodyHeight = body.outerHeight();
				body.animate({
					height:0
				}).addClass("rolling");
				element.css("width","20%");
				element.css({
					height:headh
				})
				var top = ($(window).height() - element.outerHeight());
				var left = ($(window).width() - element.outerWidth());
				this.thunarPosition = element.position();
				
				element.css({
					top:top,
					left: left
				})
				element.data("minimize",true);
				element.addClass("minimize");
			}else{
				Utils.exec(o.onMdClickMin,[element], that);
				element.data("minimize",true);
				element.addClass("minimize");
			}
		},
		maximize:function(){
			var that = this, element = this.thunar, body = element.find(".body"), o = this.options,
			btnMax = element.find(".head .max");
			
			if(element.data("minimize") == true){ 
				element.css({
					width: o.width,
					height: o.height,
					top:this.thunarPosition.top,
					left:this.thunarPosition.left
				})
				body.animate({
					height:that.bodyHeight
				}).removeClass("rolling");
				element.data("minimize",false);
				element.removeClass("minimize");
				if($(window).width() == element.outerWidth()){
					btnMax.addClass("expand")
				}
			}
			else if(element.data("maximize") === true){
				element.css({
					width: o.width,
					height: o.height,
					top:this.thunarPosition.top,
					left:this.thunarPosition.left
				}).removeClass("maximize");
				element.data("maximize",false);
				btnMax.removeClass("expand")
			}else{
				this.thunarPosition = element.position();
				element.addClass("maximize");
				element.data("maximize",true);
				btnMax.addClass("expand")
			}
			Utils.exec(o.onMdClickMax,[element], that);
		},
		getIcon:function(){
			return this.element.find(".head .shi, .head .icons");
		},
		getTitle: function(){
			return this.element.find(".title");
		},
		getId:function(el){
			return (this.options.type.toLowerCase() === "thunar")?el.attr("id"):this.element.attr("id");
		},
		reposition:function(){
			this.setPosition();
		},
		setType: function(t){
			var element = this.element;
			element.removeClass("success info alert warning").addClass(t);
		},
		toggleDraggable: function(){
			var element = this.element;
			var flag = JSON.parse(element.attr("data-draggable"));
			var drag = element.data("draggable");
			if (flag === true) {
				drag.on();
			} else {
				drag.off();
			}
		},
		toggleResizable: function(){
			var element = this.element;
			var flag = JSON.parse(element.attr("data-resize"));
			var resize = element.data("shresize");
			if (flag === true) {
				resize.on();
				element.find(".resize-element").removeClass("resize-element-disabled");
			} else {
				resize.off();
				element.find(".resize-element").addClass("resize-element-disabled");
			}
		},
		bgOverlay:function(bg,alpha){
			var overlay = $(".overlay");
			if(overlay.lenght > 0){
				if($.isUndefined(bg)){
					bg = o.bgOverlay;
				}
				if($.isUndefined(alpha)){
					alpha = o.alphaOverlay;
				}
				if(b === "transparent"){
					overlay.addClass("bg-transparent");
				}else{
					var bg = Color.toRGBA(bg, alpha);
						bg = "rgb("+[bg.r, bg.g, bg.b, bg.a].join(",")+')';
					overlay.css("background",bg);
				}
			}
		},
		changeAttr:function(attr){
			switch (attr) {
				case "data-icons": this.setIcon(element.attr('data-icons')); break;
				case "data-title": this.setTitle(element.attr('data-title')); break;
				case "data-content": this.setContent(element.attr('data-content')); break;
				case "data-buttons": this.setFooter(element.attr('data-buttons')); break;
				case "data-draggable": this.toggleDraggable(); break;
				case "data-resize": this.toggleResizable(); break;
				case "data-position": this.reposition(); break;
				case "data-bg-overlay":
				case "data-position": this.bgOverlay(element.attr("data-bg-overlay"), element.attr("data-position")); break;
				case "data-info-modals-type": this.setType(element.attr("data-info-modals-type")); break;
				case "data-thunar-pos": this.setPositionThunar( JSON.parse(element.attr("data-thunar-pos"))); break;
				case "data-width":
				case "data-height": this.setSize( element.attr('data-width'), element.attr('data-height')); break;
			}
		},
		destroy:function(){
			var o = this.options, element = this.element;
			
			if(o.overlay === true){
				if($(".overlay").length > 0){
					$(".overlay").remove();
				}
			}
			
			element.html("");
		}
	};
	SNA.plugin('modal', Modals);
	
	SNA['Modal'] = {
		isModals:function(modal){
			return Utils.isShtm5Element(modal,"modal");
		},
		listThunar:{},
		open:function(modal,title,content,footer){
			if(!this.isModals(modal)){ return; }
			var modals = modal.data("modal");
			if(!$.isUndefined(title)){
				modals.setTitle(title);
			}
			if(!$.isUndefined(content)){
				modals.setContent(content);
			}
			if(!$.isUndefined(footer)){
				modals.setFooter(footer);
			}
			modals.open();
		},
		close:function(modal){
			if(!this.isModals(modal)){ return; }
			var modals = modal.data("modal");
			modals.close();
		},
		toggle:function(modal){
			if(!this.isModals(modal)){ return; }
			var modals = modal.data("modal");
			modals.toggle();
		},
		create:function(options){
			var md = $("<div>").appendTo( $("body") );
			
			var opt = $.extend({},{
					type:'modal'
				},
				($.isUndefined(options))? {}: options)
			return md.modal(opt);
		},
		getThunar:function(id){
			if($.isUndefined(id)){
				return this.listThunar;
			}else{
				if(id in this.listThunar){
					return this.listThunar[id];
				}
			}
		},
		getIdThunar:function(thunar){
			if(!this.isModals(thunar)){ return; }
			var modals = thunar.data("modal");
			return modals.getId(thunar);
		},
		thunar: function(opt){
			var op = {
				//OBLIGATORIOS
				type: "thunar",
				title: "",
				content: "",
				
				//THUANAR y MODALS
				showBtnClose:true,
				posBtnClose:"right",
				
				//INFOMODAL, THUNAR Y MODALS
				overlay:true,
				bgOverlay:SNA.colorList.black,
				alphaOverlay:0.5,
				
				//THUANAR
				icons:"",
				showMaximize:false,
				showBtnMin:true,
				showBtnMax:true,
				showBtnRolling:true,
				destroy:true,
				thunarPos:{
					position:"relative",
					top:0,
					left:0
				},
				thunarId:undefined,
				
				//EFECTOS
				speed:1000,
				efectShow:'fadeIn',
				efectHide:"fadeOut",
				
				//GENERAL
				locale: SNA.locales[window.SNALANG],
				toggleElement:null,
				show:false,
				resize:false,
				position:'center',// valores posibles: top, top-left, top-right, bottom bottom-left, bottom-right, left, right, center 				
				draggable:false,
				dragElement:'.head',
				dragArea:'parent',
				width:500,
				height:'auto',
				
				//CSS GENERAL
				clsModal:"",
				clsHead:"",
				clsTitle:"",
				clsBtnClose:"",
				clsBody:"",
				clsFooter:"",
				clsOverlay:"",
				
				//CSS THUNAR
				clsIcons:"",
				clsBtnMin:"",
				clsBtnMax:"",
				clsBtnRolling:"",
				
				//FUNCIONES
				//GENERAL
				onMdResizeStart:function(){},
				onMdResizeStop:function(){},
				onMdResize:function(){},
				onMdCreate:function(element){},
				onMdStart:function(){},
				onMdStop:function(){},
				onMdMove:function(){},
				onMdShow:function(element){},
				onMdHide:function(element){},
				
				//OVERLAY
				onMdClickOverlay:function(){},
				
				//BOTONES
				onMdClickClose:function(element){},
				onMdClickMin:null,
				onMdClickMax:function(element){},
				onMdClickRolling:function(rolling,element){},
				
				//THUNAR
				onMdThunarDestroy:function(){},
				onMdThunarFn:function(){return true;}
			};
			var o = $.extend({}, op, opt);
			var newThunar = $("<div>").appendTo( (o.dragArea.toLowerCase() !== "parent")?$(o.dragArea):$("body") );
			var newaler = newThunar.modal(o);
			this.listThunar[newaler.attr("id")] = newaler;
			return newaler.data("modal");
		}		
	};
	/**
	 * $.fn.tagsinput
	 * Función que se encarga de crear inputs con elementos tags.
	 * @param {Object} TagInput.options
	 * @returns {Object} El objeto de Tag  Input.
	 */
	var TagInput = {
		options:{
			placeholder:"",
			sedPlaceholder:"",
			randomColor: true,
			maxTags: 0,
			tagSeparator: ",",
			tagTrigger: "13,188",
			clsTag: "",
			clsTagTitle: "",
			clsTagClose: "",
			//Funcion
			onTagAdd:function(tag,elem){},
			onTagRemove: function(tag,elem){},
			onTagSelected: function(tag,elem){},
			onTagInputCreate:function(elem){},
		},
		init: function(options, elem){
			this.options = $.extend( {}, this.options, options );
			this.elem  = elem;
			this.element = $(elem);
			this.options = $.extend({}, this.options, this.setOptionsFromDOM(this));
			this.values = [];
			
			this._create();
			
			return this;
		},
		_create:function(){
			 var element = this.element, o = this.options;

			this._createStructure();
			this._createEvents();

			Utils.exec(o.onTagInputCreate, [element], this);
		},
		_createStructure:function(){
			var that =this, element = this.element, o = this.options, val = element.val().trim() || element.data("values");
			if(element.closest('.input').length > 0){
				this.fInput = element.parent('.input');
			}
			else{
				this.fInput = $('<div class="input">');
				this.fInput.insertAfter(this.element);
				this.element = this.element.appendTo(this.fInput);
				element = this.element;
			}
			
			if(!Utils.isValue(element.attr("id"))){ element.attr("id", Utils.elementId("TagI")); }
			this.fInput.addClass("taginput");
			if(Utils.isValue(val)){
				var val2arr = val.split(o.tagSeparator);
				$.each(val2arr, function(i,v){
					if(Utils.isValue(v)){
						that._addTag(v);
					}
				})
				this.fInput.addClass("focus");
				if(this.fInput.find(".tag").length > 0){
					element.attr("placeholder",o.sedPlaceholder);
				}
			}else{
				element.attr("placeholder",o.placeholder);
			}
			
			if (element.is(":disabled")) {
				this.disable();
			} else {
				this.enable();
			}
		},
		_createEvents:function(){
			var that = this, o = this.options, element = this.element,
			fInput = element.closest(".input"), tag;
			element.on(SNA.events.focus, function(){
				fInput.addClass("focus");
				fInput.find('label').addClass("active")
			});

			element.on(SNA.events.blur, function(){
				if(fInput.find(".tags").length == 0){
					fInput.removeClass("focus");
					fInput.find('label').removeClass("active")
				}else if(!fInput.hasClass("focus")){
					fInput.addClass("focus");
					fInput.find('label').addClass("active")
				}
			});
			element.on(SNA.events.inputchange, function(){
				element.attr("size", Math.ceil(input.val().length / 2) + 2);
			});
			element.on(SNA.events.keyup, function(e){
				var val = element.val().trim();

				if (val === "") {return ;}
				var tgfn = function(){
					var a = o.tagTrigger;
					a = (""+a).split(",");
					return a.map(function(s){
						return  parseInt(s);
					});
				}
				if (tgfn().indexOf(e.keyCode) === -1) {
					return ;
				}

				that._addTag(val.replace(",", ""));
				var sz = (!Utils.isValue(o.sedPlaceholder))?1:o.sedPlaceholder.length;
				element.attr("size", sz);
				element.attr("placeholder",o.sedPlaceholder);
				if (e.keyCode === SNA.keyCode.ENTER) {
					e.preventDefault();
				}
			});
			fInput.on(SNA.events.click, ".tags .close", function(){
				var tag = $(this).closest(".tags");
				that._removeTag(tag);
			});
			fInput.on(SNA.events.mousedown, ".tags", function(){
				$(this).addClass("active");
				Utils.exec(o.onTagSelected, [tag], that);
			});
			fInput.on(SNA.events.mouseup, ".tags", function(){
				$(this).removeClass("active");
			});

			fInput.on(SNA.events.click, function(){
				element.focus();
			});
		},
		_addTag:function(text){
			var that = this, o = this.options, element = this.element,
			fInput = element.closest(".input"), tag, title, close;
			
			if(o.maxTags > 0 && this.values.length === o.maxTags){
				return;
			}
			
			tag = $('<span>').addClass("tags").addClass(o.clsTag).insertBefore(element);
			tag.data("value", text);
			
			title = $('<span>').addClass(o.clsTagTitle).html(text);
			title.appendTo(tag);
			close = $('<span>').addClass("close").addClass(o.clsTagClose).appendTo(tag);
			
			if (o.randomColor === true) {
				var colors = SNA.colorList, length = Utils.lengthObj(SNA.colorList),
				keyColor = Object.keys(SNA.colorList),
				bg, fg, bg_r;
				
				bg = $.trim( colors[ keyColor[Utils.random(0, length - 1)] ] );
				bg_r = Color.darken(bg, 10);
				fg = Color.isDark(bg) ? "#ffffff" : "#000000";
				tag.css({
					backgroundColor: bg,
					color: fg
				});
				close.css({
					backgroundColor: bg_r,
					color: fg
				});
			}
			this.values.push(text);
			element.data("values", this.values.join(o.tagSeparator));
			element.val("");
			Utils.exec(o.onTagAdd, [tag, text, this.values], this);
		},
		_removeTag:function(tag){
			var element = this.element, o = this.options;
			var val = tag.data("value");
			
			this.values.splice( this.values.indexOf(val), 1 )
			
			element.data("values",this.values.join(o.tagSeparator));

			Utils.exec(o.onTagRemove, [tag, val, this.values],this);
			tag.remove();
		},
		tags: function(){
			return this.values;
		},

		val: function(v){
			var that = this, o = this.options;

			if (!Utils.isValue(v)) {
				return this.tags();
			}

			this.values = [];

			if (Utils.isValue(v)) {
				v = ($.isArray(v))?v:v.split(o.tagSeparator);
				$.each(v, function(){
					that._addTag(this);
				})
			}
		},

		clear: function(){
			var element = this.element;
			var container = element.closest(".taginput");

			this.values = [];
			element.val("");

			container.find(".tags").remove();
		},
		disable: function(){
			this.element.data("disabled", true);
			this.element.parent().addClass("disabled");
		},

		enable: function(){
			this.element.data("disabled", false);
			this.element.parent().removeClass("disabled");
		},
		toggleState: function(){
			if (this.elem.disabled) {
				this.disable();
			} else {
				this.enable();
			}
		},

		changeAttr: function(attributeName){
			var that = this, element = this.element, o = this.options;
			var changeValue = function(){
				var val = element.attr("value").trim();
				that.clear();
				if (!Utils.isValue(val)) {
					return ;
				}
				that.val( val.split(o.tagSeparator) );
			};

			switch (attributeName) {
				case "data-value": 
				case "value": changeValue(); break;
				case "disabled": this.toggleState(); break;
			}
		},

		destroy: function(){
			var element = this.element;
			var container = element.closest(".taginput");
			element.off(SNA.events.focus);
			element.off(SNA.events.blur);
			element.off(SNA.events.keydown);
			container.off(SNA.events.click, ".tags .remover");
			container.off(SNA.events.click);

			element.insertBefore(container);
			container.remove();
		}
	};
	SNA.plugin('tagsinput', TagInput);
	/**
	 * $.fn.dropdown
	 * Función que se encarga de crear combobox
	 * @param {Object} Dropdown.options
	 * @returns {Object} El objeto de Dropdown.
	 */
	var Dropdown = {
		options:{
			toggleBtn:null,
			efectDrop:'slideUpIn',
			efectUp:'slideDownOut',
			noClose:false,
			duration:200,
			onDrop:function(){},
			onUp:function(){},
			onDropCreate:function(){},
			onActive:function(){},
			onToggle:function(){}
		},
		init:function(options, elem){
			this.options = $.extend( {}, this.options, options );
			this.elem  = elem;
			this.element = $(elem);
			if(this.element.data('role') === undefined){
				this.element.data('role', 'dropdowns')
			}
			this.options = $.extend( {}, this.options, this.setOptionsFromDOM(this) );
			this.toggleBtn = null;
			
			if($.isNull(this.options.toggleBtn)){
				var toggleBtn = this.element.prev();
				if(toggleBtn.hasClass('dropdown-btn')){
					this.toggleBtn = toggleBtn;
				}
			}else{
				this.toggleBtn = this.options.toggleBtn;
			}
			
			this.toggleBtn = (Utils.isjQElement(this.toggleBtn)) ? this.toggleBtn : $(this.toggleBtn);
			
			if(this.element.attr('id') == undefined){ this.element.attr('id',Utils.elementId('dropdown')); }
			
			this.display = false;
			this._create();
			
			Utils.exec(this.options.onDropCreate,[this.element],this);
			return this;
		},
		_create:function(){
			var that = this, element = this.element, toggleBtn = this.toggleBtn, o = this.options,
			parent = element.parent();
			this.displayOrigin = element.css('display');
			//BTN
			if(!toggleBtn.hasClass('dropdown-btn')){toggleBtn.addClass('dropdown-btn')}
			
			if(!element.hasClass('menu-drop') && !element.hasClass('menu-v')){ element.addClass("menu-drop"); }
			
			toggleBtn.on(SNA.events.click, function(e){
				SNA.stop(e);
				if(element.find('.active-drop').length > 0){
					element.find('.active-drop').removeClass('active-drop');
				}
				$('.active-drop').removeClass('active-drop');
				
				if(Utils.isVisible(element) && !element.hasClass('no-close')){
					that._close(element);
				}else{
					$('[data-role="dropdowns"]').each(function(i, el){
						el = $(el);
						if(!element.parent('[data-role="dropdowns"]').is(el) && el.hasClass('no-close') && Utils.isVisible(el)){
							that.close(el);
						}
					});
					that._open(element);
					parent.addClass('active-drop');
				}
				Utils.exec(o.onToggle, [element,$(this)], that);
			});
			if((element[0].tagName == "UL" || element[0].tagName == "OL") && Utils.isFunc(o.onActive)){
				var a = element.find("a");
				if(a.length > 0){
					a.each(function(i,link){
						$(link).on(SNA.events.click, function(e){
							SNA.stop(e);
							Utils.exec(o.onActive,[$(link),element],that);
						})
					})
				}
			}
			if(o.noClose){
				element.addClass('no-close').on(function(e){
					e.stopPropagation();
				})
			}
			element.find('li').on(SNA.events.click, function(e){
				if($(this).hasClass("disabled")){
					SNA.stop(e);	
				}
				if($(this).find("a").hasClass("disabled")){
					SNA.stop(e);	
				}
			})
		},
		_close:function(el){
			if(Utils.isjQElement(el) === false){ el = $(el); }
			var dropdown  = el.data("dropdowns");
			var toggleBtn = dropdown.toggleBtn;
			var o = dropdown.options;
			
			toggleBtn.removeClass('active-toggle');
			dropdown.element.parent().removeClass('active-drop');
			el.shanimate({
				efect:o.efectUp,
				speed:o.duration,
				fnOut:function(){
					setTimeout(function(e){
						el.css({
							display:'none',
							visibility: 'hidden'
						});
					},o.duration+100)
				}
			})
			if(el.hasClass("open")){ el.removeClass("open");}
			Utils.exec(o.onUp,[el],dropdown);
			this.display = false;
		},
		_open:function(el){
			if(Utils.isjQElement(el) === false){ el = $(el); }
			var dropdown  = el.data("dropdowns");
			var toggleBtn = dropdown.toggleBtn;
			var o = dropdown.options;
			toggleBtn.addClass('active-toggle');
			el.shanimate({
				efect:o.efectDrop,
				speed:o.duration,
				fnIn:function(e){
					e.css({
						display:'block',
						visibility: 'visible'
					});
				}
			})
			if(el[0].tagName !== "UL"){
				el.addClass("open")
			}
			Utils.exec(o.onDrop,[el],dropdown);
			this.display = true;
		},
		close:function(){
			this._close(this.element);
		},
		open:function(){
			this._open(this.element);
		},
		toggle:function(){
			if(this.display){
				this.close();
			}else{
				this.open();
			}
		},
		isActive: function(){
			return this.display;
		},
		destroy: function(){
			this.toggleBtn.off(SNA.events.click);
		}
	};
	
	SNA.plugin('dropdowns', Dropdown);
	/**
	 * Funciones Utiles
	 */
	var validate = function(form, lang){
		var input = form.find('input, textarea');
		var valid = false;
		var i = 0;
		var msj = "";
		var _showError = function(el, msj){
			var span = (el.next('.sna-error').length > 0)? el.next('.sna-error') : $('<span>').addClass('sna-error').insertAfter(el);
			span.text(msj);
			span.css('height', (el.height()+ 8)+"px" )
			el.blur(function(event) {
				if($(this).val() != ""){
					span.fadeOut(function(){
						$(this).animate({
							flex: '0%',
						});
					});
				}
			});
			span.fadeIn(function(){
				$(this).animate({
					flex: '80%',
				});
			});
		}
		do{
			var el = input[i];
			var elem = $(el);
			var val = elem.val().trim();
			if(el.required){
				valid = val !== "";
				if(!valid){
					msj =  lang.validation.required;
				}
			}
			if(elem.attr('type') == "email"){
				valid = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(val);
				if(!valid){
					msj =  lang.validation.email;
				}
			}
			if(!valid){
				_showError(elem, msj);
				elem.focus();
				return false;
			}
			i++;
		}while (i < input.length);
		if(valid){
			var data = form.serializeArray();
			var serial = {};
			$.each(data, function(index, val) {
				serial[val.name] = val.value;
			});
			return serial;
		}
		return valid;
	}
	//Predeterminadas para todos los Pluigns
	SNA.defaultsOpt = {
		//Iniciales
		options:{
			text:'',
			links:{},//Links de Redes Sociales
			pos:null,//top-left, top-center, top-right, bottom-left, bottom-center, bottom-right, left-center, right-center
			//Si se deja Basio sera pocion relative en la ubicacion deseada
			inline:null, //True se coloca en linea horizontal false en linea Vertical y null segun la posicon data top, bottom y null seran inline horizontal left o right inline vertical 
			target:'_blank',
			//CSS
			only:'icon',//Icon, text, duo
			size:'medium',
			squema:{},
			clsIcons:'',
			clsLink:'',
			cls:'',
			themen:'sna-icon-',
			locale:window.SNALANG,
			hints:null,
			dialogType:'modal',
			dialog:{},
			image:null
			//APPS
		},
		squema:{
			bg:true,
			fg:'white',
			bgColors:null,
			shadow:true,
			notspace:true
		},
		tpl:{
			modalEmail:'<form class="form">'+
				'<%if(this.type == "fw"){%>'+
				'<label for="fullname"><%this.label.namefull%></label>'+
				'<div class="input">'+
				'<input class="to-input" type="text" name="fullname" required/>'+
				'</div>'+
				'<label for="email"><%this.label.emailaddress%></label>'+
				'<div class="input">'+
				'<input class="to-input" type="email" name="email" required/>'+
				'</div>'+
				'<label for="subject"><%this.label.subject%></label>'+
				'<div class="input">'+
				'<input class="to-input" type="text" name="subject" required/>'+
				'</div>'+
				'<%}else{%>'+
				'<label for="email"><%this.label.emailaddress%></label>'+
				'<div class="input">'+
				'<input class="to-input" data-role="tagsinput" type="text" name="email" required/>'+
				'</div>'+
				'<%}%>'+
				'<label for="message"><%this.label.message%></label>'+
				'<div class="input">'+
				'<textarea class="to-input" name="message" required></textarea>'+
				'</div></form><div id="msm-show" style="padding: 0.5rem; border-radius: 8px;"></div>'
		},
		setup:function(opt){
			this.options = $.extend( {}, this.options, opt );
		}
	}
	/**
	 * $.fn.snafollowme
	 * Función que se encarga de crear los botones sigueme
	 * @param {Object} followme.options
	 * @returns {Object} El objeto de Modals.
	 */
	var followme = {
		options:{
			style:'rounded',//square, circle, flex, inline
			clsFollowme:'',
			
		},
		init:function(options, elem){
			options = $.extend({}, SNA.defaultsOpt.options, options);
			this.options = $.extend( {}, this.options, options );
			this.elem  = elem;
			this.element = $(elem);
			
			this.options = $.extend( {}, this.options, this.setOptionsFromDOM(this) );
			this.links = SNA.links.followme;
			this.element.addClass(this.options.cls);
			if(Utils.isString(this.options.locale)){
				this.options.locale = SNA.locales[this.options.locale];
			}
			this.profile = {};
			this._create();
			return this;
		},
		_createDialog:function(el){
			var modal = SNA.Modal, color = el.data("social"), o = this.options,
			lang = o.locale, email = el.data('email'),
			body = SNA.tpl(SNA.defaultsOpt.tpl.modalEmail, {
				type:'fw',
				label:{
					namefull:lang['mailto']['fullname'],
					emailaddress:lang['mailto']['email_address'],
					subject:lang['mailto']['subject'],
					message:lang['mailto']['message']
				}
			});
			
			modal = modal.create;

			var opt = {
				title:'<i class="icons sna-icon-send-mail"></i>'+lang['mailto']['write']+" "+email,
				content:body,
				footerCreate:true,
				show:true,
				footerAling:'center',
				locales:o.locale,
				width: 600,
				buttons:[
					{
						cls:'bg-google-green fg-white',
						label:lang['mailto']['send'],
						onClick:function(d,m){
							var form = m.find('.body form');
							var data = validate(form, o.locale);
							var msj = $("#msm-show");
							msj.fadeOut();
							if(Utils.isObject(data)){
								data.type = "follow";
								data.to = email;
								$.post('lib/phpmail/mail.php', data, function(d) {
									var val = JSON.parse(d);
									if(val.success == 0){
										msj.removeClass('bg-google-green').addClass('bg-google-red fg-white').html(val.msj);
									}else{
										msj.removeClass('bg-google-red').addClass('bg-google-green fg-white').html('Mensaje Enviado Exitosamente');
									}
									msj.fadeIn();
									console.log(d,val);
								});
							}
						}
					},
					{
						cls:'bg-youtube fg-white',
						label:lang['buttons']['cancel'],
						onClick:'close'
					}
				],
				efectShow:'slideUpIn',
				efectHide:'slideUpOut',
				clsHead:'bg-'+color,
				clsTitle:'fg-white '
			};
			opt = $.extend({}, Modals.options, opt);
			opt = $.extend({},opt, o.dialog);
			
			modal(opt);
		},
		_createLinks:function(parents, social, profile){
			var that = this,  o = this.options,
				linksSocial = this.links[social]+profile,
				icons = social, 
				theme = (o.themen.indexOf('image') == -1), 
				a = $('<a>');

				if(social.toLowerCase() == "mailto"){
					a.data({
						href:linksSocial,
						social:social,
						email:profile
					});
					a.on(SNA.events.click+"-Followme",function(e){
						SNA.stop(e);
						that._createDialog($(this));
					})
					this.profile['mailto'] = profile;
				}else{
					a.attr({
						target:o.target,
						href:linksSocial
					});
					this.profile[social] = linksSocial;
				}

				a.addClass(o.style).addClass('sna_icons').addClass(o.clsLink);

			if(Utils.isString(o.squema)){
				a.addClass(o.squema);
			}else{
				var sq = $.extend({}, SNA.defaultsOpt.squema, o.squema);
				var bg = social;
				if(social == "mailto"){
					var companic = profile.split("@");
						companic = companic[1].split(".")[0];
					bg = companic;
					icons = companic;
				}
				if(sq.bg != 'transparent' && sq.bg != false && theme ){
					bg = (sq.bg === true)? bg: sq.bg;
					if(sq.bgColors != null){
						if( sq.bgColors.hasOwnProperty(social) ){
							bg += "-" +sq.bgColors[social];
						}
					}
					
					a.addClass('sna_squema').addClass('bg-'+bg).addClass('fg-white');
					if(sq.shadow){ a.addClass('shadow'); }
					if(social.toLowerCase() == 'mailto'){
						a.data('social', bg);
					}
				}
				
				if( sq.notspace ){
					if(o.style != 'circle' && theme){
						parents.addClass('notspace').addClass(o.style);
					}
					if(!theme){
						parents.removeClass(o.style);
					}
					if(o.themen.indexOf('circle') == -1){
						parents.addClass('notspace');
					}
					a.removeClass(o.style);
				}
			}

			var icon;
			if(!theme){
				icon = $('<img>');
				if(o.themen.toLowerCase() === 'image'){
					if(Utils.isObject(o.image)){
						icon.attr({
							src: o.image[icons],
							class:'image-customize'
						});
					}else{
						console.error("The "+typeof o.image+" type is not a valid image object");
						return;
					}
				}else{
					var type = o.themen.replace('image',"");
					icon.attr({
						src:'dist/img/'+icons+type+'.svg',
						class:type.replace('-',"")
					});
				}
				a.addClass('image-content').addClass('fg-'+icons+"-hover");
			}else{
				icon = $('<i>').addClass(o.clsIcons);
				icon.addClass(o.themen+icons);
			}
			
			var text = $('<span>');

			if(Utils.isObject(o.text)){
				text.html(o.text[social]);
			}else if(o.text == true){
				text.html(o.locale.social.textFollowme)
			}else{ text.html(o.text); }
			if(o.only.toLowerCase() == "icon"){
				text.hide();
			}else if(o.only.toLowerCase() == 'text'){
				icon.hide();
			}else{
				parents.addClass('icon-text');
			}

			icon.appendTo(a);
			text.appendTo(a);

			a.appendTo(parents);
			if(!$.isNull(o.hints)){
				var text = "";
				if(social == "mailto"){
					text = '<p>'+o.locale['mailto']['write']+' '+profile+'</p>';
				}else{
					text = '<p>'+o.locale['social']['followme']+' <span style="text-transform:capitalize">'+social+'</span></p>';
				}
				var ht = {
					hide:5000,
					clsHints:'bg-black fg-white',
					hintsText:text,
					hintsIcons:o.themen+icons,
					htPosition:'top',
					htOffset:5,
					htEfects:null,
					htShowPermanet:false,
				};
				if(o.hints === true){
					var pos = 'top';
					if(!$.isNull(o.pos)){
						if(o.pos.indexOf('top') > -1){
							pos = 'bottom';
						}else if(o.pos.indexOf('bottom') > -1){
							pos = 'top';
						}else if(o.pos.indexOf('left') > -1){
							pos = 'right';
						}else if(o.pos.indexOf('right') > -1){
							pos = 'left';
						}
					}
					
					ht.htPosition = pos;

					a.hints(ht);
				}else{
					a.hints( $.extend({}, ht, o.hints) );
				}
			}
		},
		_reposition:function(element){
			var element = this.element, that = this, o = this.options,
				pos = o.pos, cls = 'top-left,top-right,bottom-left,bottom-right,left-center,right-center'.split(',');
			$.each(cls, function(index, cls) {
					element.removeClass(cls)
			});
			element.addClass(o.pos);
			var size = Utils.hiddenElementSize(element), w = $(window),
				ww = w.outerWidth(), hw = w.outerHeight(),
				wE = size.width, hE = size.height;
			if(Utils.por(wE, ww) >= 70){ wE = ww; }
			if(Utils.por(hE, hw) >= 70){ hE = hw; }
			
			switch (pos) {
				case 'top-left':
				case 'top-right':
				case 'bottom-left':
				case 'bottom-right':
					element.css('width',wE+'px');
				break;
				case 'left-center':
				case 'right-center':
					var t =Math.abs( hE/2 - hw/2 );
					if(hE == hw){
						t = 0;
					}
					element.css({
						top:t+'px',
						height: hE+'px'
					});
					element.addClass('pos-size-'+o.size);
				break;
			}

		},
		_create:function(){
			var that = this, element = this.element, o = this.options;
			var parent;
			if(!element.hasClass('sna')){ element.addClass('sna'); }
			if(element.attr('id') == undefined){ element.attr('id', Utils.elementId('sna-followme') );}
			if(o.inline == true){element.addClass('inline'); }
			var llink = Utils.lengthObj(o.links);
			if(llink > 0){
				if(llink > 1){
					parent = $('<ul>').addClass(o.clsFollowme).appendTo(element);
					$.each(o.links, function(i,v) {
						var li = $('<li>').addClass(o.size).appendTo(parent); 
						that._createLinks(li, i,v);
					});
				}else{
					var arr = Utils.splitObj(o.links)[0];
					element.addClass(o.clsFollowme);
					var li = $('<div>').addClass(o.size).appendTo(element); 
					this._createLinks(li,arr[0], arr[1]);
				}
				if(!$.isNull(o.pos)){
					element.addClass('pos');
					this._reposition(element);
					$(window).on('resize-fwm',function(){
						that._reposition(element);
					})
				}
			}
		},
		//Public
		getLang:function(){
			return this.options.locale;
		},
		setLang:function(lang){
			var that = this, element = this.element, o = this.options;
			if(!Utils.isValue(lang) && $.isUndefined(element.attr('data-locale'))){ return; }
			var locale = (!$.isUndefined(element.attr('data-locale')))?element.attr('data-locale'):lang;
			this.options.locale = SNA.locales[locale];
			element.html("");
			that._create();
			return this;
		},
		setPosition:function(pos){
			var that = this, element = this.element, o = this.options;
			if(!Utils.isValue(pos) && $.isUndefined(element.attr('data-pos')) ){ return; }
			if(!element.hasClass('pos')){ element.addClass('pos');}
			var newPos = ($.isUndefined(pos))?element.attr('data-pos'):pos;
			this.options.pos = newPos;
			this._reposition(element);
			return this;
		},
		getPosition:function(cls){
			if(cls === true){
				return this.options.pos;
			}else{
				return this.element.position();
			}
		},
		setLinks:function(link){
			var element = this.element, that = this, newlinks = link;
			if(!Utils.isValue(link) && $.isUndefined(element.attr('data-links')) ){ return; }
			if(!$.isUndefined(element.attr('data-links')) && $.isUndefined(link)){
				newlinks = $.parseJSON(element.attr('data-links'));
			}
			newlinks = $.extend({}, that.options.links, newlinks);
			element.html("");
			this._create();	
			return this;			
		},
		getLinks:function(){
			return this.profile;
		},
		setSize:function(mx){
			var that = this, element = this.element, o = this.options;
			if(!Utils.isValue(mx) && $.isUndefined(element.attr('data-size')) ){ return; }
			var newSz = ($.isUndefined(mx))?element.attr('data-size'):mx;
			var d = element.data('snafollowme');
			var size = d.options.size;
			var elements = element.find("."+size);
			$.each(elements, function(index, el) {
				$(el).removeClass(size).addClass(newSz);
			});
			d.options.size = newSz;
			this.options.size = newSz;
			return this;
		},
		changeAttr:function(attr){
			switch (attr) {
				case 'data-pos': this.setPosition(); break;
				case 'data-links': this.setLinks(); break;
				case 'data-locale': this.setLang(); break;
				case 'data-size': this.setSize(); break;
			}
		},
		destroy:function(){
			this.element.html("");
		}
	};
	SNA.plugin('snafollowme',followme);
	/**
	 * $.fn.snashare
	 * Función que se encarga de crear los botones de compartir
	 * @param {Object} Share.options
	 * @returns {Object} El objeto de Modals.
	 */
	var Share = {
		options:{
			style:'rounded',//square,
			type:'button',//dropdown
			text:true,
			clsShare:'',
			url:'',
			title:'',
			description:'',
			media:'',
			via:'',
			social:'all',
			postType:'',
			source:'',
			dialog:{},
			hints:true
		},
		init:function(options, elem){
			options = $.extend({}, this.options, options);
			this.options = $.extend( {}, SNA.defaultsOpt.options, options );
			this.elem  = elem;
			this.element = $(elem);
			
			this.options = $.extend( {}, this.options, this.setOptionsFromDOM(this) );
			this.linksShare = SNA.links.share;

			if(Utils.isString(this.options.locale)){
				this.options.locale = SNA.locales[this.options.locale];
			}
			
			this.element.addClass(this.options.cls);
			this._setOptionsMeta();
			this.listSocial = {};
			this._create();
			return this;
		},
		_getMeta:function(property){
			var meta = SNA.getMeta(), value = false;
			if(meta.twitter.hasOwnProperty(property)){
				value = meta.twitter[property];
			}
			else if(meta.og.hasOwnProperty(property)){
				value = meta.og[property];
			}
			else if(meta.fb.hasOwnProperty(property)){
				value = meta.fb[property];
			}else if(meta.hasOwnProperty(property)){
				value = meta[property];
			}
			return value;
		},
		_setOptionsMeta:function(){
			var o =this.options,
			data = {
				url:o.url,
				title:o.title,
				description:o.description,
				media:o.media,
				via:o.via,
				postType:o.postType,
				source:o.source
			};
			if($.isUndefined(o.url) || o.url == ""){
				var metaURL = this._getMeta('url');
				if(metaURL !== false){	data.url = metaURL; }
				else { data.url = location.href; }
			}
			if($.isUndefined(o.via) || o.via == ""){
				var metaVia = this._getMeta('site');
				if(metaVia !== false){	data.via = metaVia; }
			}
			if($.isUndefined(o.postType) || o.postType == ""){
				var metaPT = this._getMeta('type');
				if(metaPT !== false){	data.postType = metaPT; }
			}
			if($.isUndefined(o.source) || o.source == ""){
				var metaAt = this._getMeta('author');
				if(metaAt !== false){	data.source = metaAt; }
			}
			if($.isUndefined(o.title) || o.title == ""){
				var metaTitle = this._getMeta('title');
				if(metaTitle !== false){ data.title = metaTitle; }
				else{
					data.title = $("title").text();
				}
			}else if(Utils.isElement(o.title) != false){
				data.title = Utils.strsplit(Utils.isElement(o.title).html(), 60);
			}
			if($.isUndefined(o.description) || o.description == ""){
				var metadep = this._getMeta('description');
				if(metadep != false){ data.description = metadep; }
			}else if(Utils.isElement(o.description) != false){
				data.description = Utils.strsplit(Utils.isElement(o.description).text(), 150);
			}
			if($.isUndefined(o.media) || o.media == ""){
				var metaimg = this._getMeta('image');
				if(metaimg != false){ data.media = metaimg; }
			}else if(Utils.isUrl(o.media)){
				data.media = o.media;
			}
			else if(Utils.isElement(o.media) != false){
				data.media = Utils.isElement(o.media).attr('src');
			}
			data.title = $.trim(data.title);
			data.description = $.trim(data.description);
			data.postType = $.trim(data.postType);

			this.options = $.extend({}, this.options, data);
			
		},
		_createBtn:function(n,u,o, element){
			var that = this, a = $('<a>'), div,
			icons = n, theme = (o.themen != 'image-circle' && o.themen != 'image-square');
			if(o.target == "dialog" || o.target == 'popup' || n == 'mailto'){
				a.data({
					href: u,
					name: n,
					type:(n == 'mailto')?'dialog':o.target
				});
				a.on(SNA.events.click+"-share",function(e){
					e.preventDefault();
					var type = $(this).data('type');
					that[type]($(this));
				})
				if(n == 'mailto'){
					icons = 'mail';
				}
			}else{
				a.attr({
					href:u,
					target:o.target
				})
			}
			
			if(o.type.toLowerCase() === "button"){
				div = $('<div>')
				if(!$.isNull(o.hints) && !$.isUndefined(o.hints)){
					this.hint(div, n);
				}
				div.addClass(o.style).addClass(o.size).addClass('share-btn-container');
			}else{
				div = $('<li>');
			}

			a.addClass('sna_icons').addClass(o.clsShare);
			this.listSocial[n] = u;
			if(Utils.isString(o.squema)){
				a.addClass(o.squema);
			}else{
				var sq = $.extend({}, SNA.defaultsOpt.squema, o.squema);
				var bg = n;
				
				if(sq.bg != 'transparent' && sq.bg != false && theme ){
					bg = (sq.bg === true)? bg: sq.bg;
					if(sq.bgColors != null){
						if( sq.bgColors.hasOwnProperty(n) ){
							bg += "-" +sq.bgColors[n];
						}
					}
					if(sq.notspace && o.style != 'circle'){
						element.addClass('notspace').addClass(o.style);
						a.removeClass(o.style);
					}
					if(n == "mailto"){ bg = "google-green";}
					div.addClass('bg-'+bg+"-hover fg-white-hover");
					a.addClass('sna_squema');//.addClass('fg-'+bg+"-hover bg-white-hover");
					if(sq.shadow){ a.addClass('shadow'); }
				}
			}
			var icon;
			if(!theme){
				icon = $('<img>');
				if(o.themen.toLowerCase() === 'image'){
					if(Utils.isObject(o.image)){
						icon.attr({
							src: o.image[icons],
							class:'image-customize'
						});
					}else{
						console.error("The "+typeof o.image+" type is not a valid image object");
						return;
					}
				}else{
					var type = o.themen.replace('image',"");
					icon.attr({
						src:'dist/img/'+icons+type+'.svg',
						class:type.replace('-',"")
					});
				}
				a.addClass('image-content').addClass('fg-'+icons+"-hover");
			}else{
				icon = $('<i>').addClass(o.clsIcons);
				icon.addClass(o.themen+icons);
			}
			var text = $('<span>').addClass('text');
			if(Utils.isString(o.text)){
				text.html(o.text)
			}else if(o.text === true){
				text.html(o.locale.social.share)
			}
			else{
				text.html(o.text[n]);
			}
			if(o.type == 'button'){
				var divHide = $('<span>').addClass('content-hide').appendTo(a);
				var iconCOntent = $('<span>').addClass('icons-container').appendTo(divHide);
				var space = $('<span>').addClass('space').appendTo(iconCOntent);
				icon.appendTo(space);
				text.appendTo(space);
			}else{
				icon.appendTo(a);
				text.appendTo(a);
			}
			
			a.appendTo(div);
			div.appendTo(element);
			if(o.type === "button"){
				var flex = div.css('flex');
				var widthIconsC = parseInt(div.find(".icons-container").css("width"));
				var textsize = Utils.hiddenElementSize(div.find(".icons-container .text"));
				var sizeHover = Math.abs(widthIconsC + textsize.width + 10);

				div.hover(function(){
					$(this).css({
						flex: '2 1 '+sizeHover+'px'
					});
					$(this).find("a").css({
						transform: 'scale(1) !important'
					})
					$(this).find(".icons-container").css({
						width: sizeHover+'px'
					})
				}, function(){
					$(this).css({
						flex: flex
					});
					$(this).find(".icons-container").css({
						width: widthIconsC+"px"
					})
				})
			}
		},
		hint:function(el, social){
			var that = this, o = this.options, icons = (social == 'mailto')?'mail':social,
				text = "";

			if(social == "mailto"){
				text = '<p>'+o.locale['mailto']['share']+'</p>';
			}else{
				text = '<p>'+o.locale['social']['titleShare']+' <span style="text-transform:capitalize">'+social+'</span></p>';
			}
			var ht = {
				hide:5000,
				clsHints:'bg-black fg-white',
				hintsText:text,
				hintsIcons:o.themen+icons,
				htPosition:'bottom',
				htOffset:5,
				htEfects:null,
				htShowPermanet:false,
			};
			if(o.hints === true){
				el.hints(ht);
			}else{
				el.hints( $.extend({}, ht, o.hints) );
			}
		},
		_create:function(){
			var that = this, o = this.options, element = this.element,
				link = (Utils.isString(o.social))? o.social.split(','): o.social, parent = element;
			if(link.toLocaleString() === 'all'){ link = Object.keys(this.linksShare); link.push('mailto') }

			element.addClass('sna share');
			if($.isUndefined(element.attr("id"))){ element.attr("id", Utils.elementId('sna-share') );}
			if(o.type.toLowerCase() === 'dropdown'){

				element.addClass('dropdown');
				var btn = $('<a>'), parent = $('<ul>');
					btn.attr({
						href:"#",
						id:Utils.elementId('snash-dropdowns')
					}).html('<i class="sna-icon-share"></i>');
				btn.appendTo(element);
				parent.attr({
					"data-role":'dropdowns',
					"data-toggle-btn":"#"+btn.attr('id')
				})
				parent.appendTo(element);
			}
				
			$.each(link, function(i, n) {
				 if(that.linksShare.hasOwnProperty(n)){
					var url = that.linksShare[n].apply(this,[o]);
					that._createBtn(n,url,o, parent);
				}else if(n == 'mailto' || n == 'email' || n == 'mail'){
					that._createBtn('mailto','#',o, parent);
				}
			});		
			
		},
		dialog:function(el){
			var modal = SNA.Modal, color = el.data("name"), o = this.options,
				url = el.data("href"), lang = o.locale, body,
				opt = {
					footerCreate:true,
					show:true,
					footerAling:'center',
					locales:o.locale,
					width: 600,
					buttons:[
						{
							cls:'bg-google-green fg-white',
							label:lang['mailto']['send'],
							onClick:function(d,m){
								var form = m.find('.body form');
								var data = validate(form, o.locale);
								if(Utils.isObject(data)){
									data.type = "follow";
									data.to = email;
									$.post('lib/phpmail/mail.php', data, function(d) {
										console.log(d);
									});
								}
							}
						},
						{
							cls:'bg-youtube fg-white',
							label:lang['buttons']['cancel'],
							onClick:'close'
						}
					],
					efectShow:'slideUpIn',
					efectHide:'slideUpOut',
					clsTitle:'fg-white ',
					draggable: true,
					speed: 600
				};
			if(color == "mailto"){
				opt.title = '<i class="icons sna-icon-send-mail"></i>'+o.locale['mailto']['share'];
				opt.content = SNA.tpl(SNA.defaultsOpt.tpl.modalEmail, {
					type:'sh',
					label:{
						emailaddress:lang['mailto']['email_address'],
						message:lang['mailto']['message']
					}
				});
				opt.clsHead = 'bg-sna';
			}else{
				opt.icons = o.themen+color;
				opt.title = o.locale['social']['titleShare']+" "+color;
				opt.content = '<iframe src="'+url+'" style="width:100%;height:98%;"></iframe>';
				opt.height = 600;
				opt.clsHead = 'bg-'+color;
				opt.type = "thunar";
				opt.thunarPos ={
					position: 'fixed'
				};
			}
			
			opt = $.extend({}, Modals.options, opt);
			opt = $.extend({},opt, o.dialog);
			
			if(color == "mailto"){
				SNA.Modal.create(opt);
			}else{
				SNA.Modal.thunar(opt);
			}
		},
		popup:function(el){
			var url = el.data('href'), n = el.data('name');
			window.open(url, n, "width=600,height=400,top=10px,left=10px");
		},
		//Public
		getLang:function(){
			return this.options.locale;
		},
		setLang:function(lang){
			var that = this, element = this.element, o = this.options;
			if(!Utils.isValue(lang) && $.isUndefined(element.attr('data-locale'))){ return; }
			var locale = (!$.isUndefined(element.attr('data-locale')))?element.attr('data-locale'):lang;
			this.options.locale = SNA.locales[locale];
			element.html("");
			that._create();
			return this;
		},
		setSocial:function(social){
			var element = this.element, that = this, newRs = social;
			if(!Utils.isValue(social) && $.isUndefined(element.attr('data-social')) ){ return; }
			if(!$.isUndefined(element.attr('data-social')) && $.isUndefined(social)){
				newRs = element.attr('data-social').split(",");
			}
			var oldRs = (Utils.isString(that.options.social))?that.options.social.split(','):that.options.social;
			$.merge(oldRs, newRs);
			element.html("");			
			this._create();	
			return this;			
		},
		getSocial:function(){
			return this.listSocial;
		},
		setSize:function(mx){
			var that = this, element = this.element, o = this.options;
			if(!Utils.isValue(mx) && $.isUndefined(element.attr('data-size')) ){ return; }
			var newSz = ($.isUndefined(mx))?element.attr('data-size'):mx;
			var d = element.data('snashare');
			var size = d.options.size;
			var elements = element.find("."+size);
			$.each(elements, function(index, el) {
				$(el).removeClass(size).addClass(newSz);
			});
			d.options.size = newSz;
			this.options.size = newSz;
			return this;
		},
		changeAttr:function(attr){
			switch (attr) {
				case 'data-social': this.setSocial(); break;
				case 'data-locale': this.setLang(); break;
				case 'data-size': this.setSize(); break;
			}
		},
		destroy:function(){
			this.element.html("");
		}
	};
	SNA.plugin('snashare',Share);
	/**
	 * $.snachat
	 * Función que se encarga de crear los botones de flotanes
	 * @param {Object} ChatBoot.options
	 * @returns {Object} El objeto de ChatBoot.
	 */
	var BtnFloat = {
		options:{
			parent:'body',
			position:'left',
			fixed:false,
			themen:'sna-icon-',
			locale:window.SNALANG,
			social:'whatsapp',
			data:{},
			cls: "",
			clsBtn: "",
			clsList:"",
			clsIcons:"",
			listSocial:null,
			listShowTopPoint:'SM',
			size:'medium',
			squema:{},
			//PopUp
			hint:{
				text:null,
				cls:''
			}
		},
		setup:function(options){
			this.options = $.extend( {}, this.options, options );
		},
		create:function(options){
			this.options = $.extend( {}, this.options, options );
			if(Utils.isString(this.options.locale)){
				this.options.locale = SNA.locales[this.options.locale];
			}
			this._create();

			return this;
		},
		_getIcons: function(e, o, p){
			var s = $('<span>').addClass('icons').appendTo(e), cls = this.options.clsIcons;
			if(p !== false){
				var i = $('<span>').addClass('snaicons sna-icon-share').addClass(cls);
				i.appendTo(s);
			}else if(Utils.isValue(o.social)){
				if(o.social == 'mailto'){
					o.social = this._getMailto(o.data.email);
				}
				var i = $('<span>').addClass(o.themen+o.social).addClass('snaicons').addClass(cls);
				i.appendTo(s);
			}
		},
		_getSquema:function(e, o, p){
			var that = this, bg, fg, bgh, fgh, sq = $.extend({}, {
				bg:true,
				fg:true,
				shadow:true
			}, o.squema);
			if(o.social == 'mailto'){
				o.social = this._getMailto(o.data.email);
			}
			if(Color.isHEX(sq.bg) || Color.isRGB(sq.bg) || Color.isRGBA(sq.bg)){
				bg = sq.bg;
				bgh = Color.darken(bg, 10);
			}else if(sq.bg === true){
				if(p !== false){
					bg = Color.get('sna');
					bgh = Color.darken(bg, 10);
				}else{
					bg = Color.get(o.social);
					if(bg === false){
						bg = Color.get('sna');
					}
					bgh = Color.darken(bg, 10);
				}
			}else{
				bg = Color.toRGBA( Color.get('black'), 0 );
				bgh = bg;
			}
			bg = (Utils.isString(bg))?$.trim(bg):bg;
			bgh = (Utils.isString(bgh))?$.trim(bgh):bgh;
			if(Color.isHEX(sq.fg) || Color.isRGB(sq.fg) || Color.isRGBA(sq.fg)){
				fg = sq.fg;
				fgh = Color.lighten(fg, 10);
			}else {
				fg = '#fff';
				fgh = Color.lighten(fg, 10);
			}
			
			fg = (Utils.isString(fg))?$.trim(fg):fg;
			fgh = (Utils.isString(fgh))?$.trim(fgh):fgh;
			
			bg = Color.toString(bg);
			bgh = Color.toString(bgh);
			fg = Color.toString(fg);
			fgh = Color.toString(fgh);

			e.css({
				backgroundColor: bg,
				color: fg
			})
			e.hover(function(){
				e.css({
					backgroundColor: bgh,
					color: fgh
				})
			},function(){
				e.css({
					backgroundColor: bg,
					color: fg
				})
			});
		},
		_resizeList:function(md){
			var that = this, o = this.options, content = this.content, ul = content.find('ul');

			var f = function(){
				var c = (o.position == 'left')? 'drop-right':'drop-left';
				if( SNA.media_sizes.hasOwnProperty( o.listShowTopPoint) ){
					var w = $(window).outerWidth();
					var point = SNA.media_sizes[o.listShowTopPoint];
					if(w <= point ){
						ul.removeClass('drop-left').removeClass('drop-right').addClass('drop-top');
					}else{
						if(ul.hasClass('drop-top')){
							ul.removeClass('drop-top').addClass(c);
						}
					}
				}else if(ul.hasClass('drop-top')){
					ul.removeClass('drop-top').addClass(c);
				}
			}
			f();
			$(window).on(SNA.events.resize+"-btnFloat",f);
		},
		_setFunc:function(el,s,o){
			var that = this, links = SNA.links.chat;
			
			if(links.hasOwnProperty(s) === false){ return false; }
			links = links[s];
			var a = $("<a>"), op = $.extend({}, links.options, o),
			url = links.func(op);
			if(Utils.isString(url)){
				a.attr({
					href:url,
					target:'_blank'
				});
				a.get(0).click();
				return true;
			}
			return false;
		},
		_getMailto:function(email){
			var companic = email.split("@");
				companic = companic[1].split(".")[0];
			return companic;
		},
		_create:function(){
			var that = this, o = this.options, lang = o.locale,
			parent, content, btnf, list, ls = Utils.isObject(o.listSocial);

			if(Utils.isjQElement(o.parent)){ parent = o.parent; }
			else if(Utils.isValue(o.parent)){ 
				if(Utils.isjQElement( $(o.parent) )){
					parent = $(o.parent);
				}
			}else if(Utils.isElement(o.parent)){
				parent = $(o.parent);
			}else{ parent = $('body'); }

			if(o.social.toUpperCase() === 'SKYPE' ||
				(ls !== false && o.listSocial.hasOwnProperty('skype'))
				){
				$.getScript('https://download.skype.com/share/skypebuttons/js/skypeCheck.js');
			}

			content = $('<div>').addClass('sna-float').addClass(o.cls);

			btnf = $('<button>').addClass('btn-action').addClass(o.clsBtn);

			content.attr("id", Utils.elementId('sna-bf') );

			if(o.social == 'mailto'){
				var r = o;
				var companic = profile.split("@");
					companic = companic[1].split(".")[0];
				this._getIcons(btnf, o, ls);
			}else{
				this._getIcons(btnf, o, ls);
			}
			
			this._getSquema(btnf, o, ls);

			content.appendTo(parent);
			btnf.appendTo(content);

			if(ls !== false){
				content.addClass('multi');
				var ul = $('<ul>').addClass('actions').addClass(o.clsList);
				if(Utils.isString(o.position)){
					if(o.position.toLowerCase() == 'left'){
						ul.addClass('drop-right');
					}else{
						ul.addClass('drop-left');
					}
				}
				
				$.each(ls, function(s,v) {
					if(Utils.isString(v)){
						if(s == 'phone'){
							v = {
								data:{tel:v}
							};
						}
						else if(s == 'mailto'){
							v = { data: {email:v} };
						}
					}
					var op = $.extend({}, {social:s, data:{}, squema:{}, themen:o.themen}, v);
					
					var l = $('<li>');
					that._getSquema(l, op, false);
					var a = $('<a>');
					that._getIcons(a, op, false);
					a.appendTo(l);
					l.appendTo(ul);
					a.on(SNA.events.click+"-btnFloat", function(event) {
						SNA.stop(event);
						that._setFunc($(this),op.social,op.data);
					});
				});
				ul.appendTo(content);
				
				btnf.on(SNA.events.click+"-btnFloat",function(){
					$(this).toggleClass('active');
					var ul = $(this).next('ul');
					var li = ul.find('li')
					if($(this).hasClass('active')){
						var base = Math.abs(ul.outerWidth() + ul.position().top);
						var e = $(this).outerWidth();

						li.each(function(index, el) {
							el = $(el);
							if(ul.hasClass('drop-right')){
								el.css({
									marginLeft: e+'px'
								})
							}
							else if(ul.hasClass('drop-left')){
								el.css({
									marginLeft: "-"+e+'px'
								})
							}
							else if(ul.hasClass('drop-top')){
								el.css({
									marginTop: "-"+e+'px'
								})
							}
							e = Math.abs(e + base);
						});
					}else{
						li.each(function(index, el) {
							el = $(el);
							if(ul.hasClass('drop-right') || ul.hasClass('drop-left')){
								el.css({
									marginLeft: '0px'
								})
							}
							else if(ul.hasClass('drop-top')){
								el.css({
									marginTop: '0px'
								})
							}
						});
					}
				})

			}else{
				btnf.on(SNA.events.click+"-btnFloat",function(){
					that._setFunc($(this),o.social, o.data);
				});
			}
			
			$.extend(this, {
				content:content,
				button:btnf,
				listBtn:list
			});
			
			this.setPosition();
			this.setSize();
			if(Utils.isValue(o.listShowTopPoint) && ls !== false){
				this._resizeList(o.listShowTopPoint);
			}
			this._hints();
		},
		_hints:function(){
			var that = this, o = this.options, btn = this.button,
				hints = $('<span>').addClass('hints'), parent = $( this.content.parent() ),
				bottom = Utils.por('17%', btn.outerWidth() ),
				op = $.extend({}, {
					text:{
						welcome:o.locale.floating.welcome + $('title').text(),
						welcome2:o.locale.floating.welcome2
					},
					cls:''
				}, o.hints);
				
			if(o.position == 'left'){ 
				hints.addClass('right').css({
					left: Math.abs(btn.outerWidth() + 16)+'px'
				}); 
			}else{ 
				hints.addClass('left').css({
					right: Math.abs(btn.outerWidth() + 16)+'px'
				});  
			}
			hints.css({
				position: Utils.getStyleOne(this.content,'position'),
				top:'auto',
				bottom: bottom,
				display: 'none'
			});
			hints.html(
				'<i class="sna-icon-user"></i> '+
				op.text.welcome
			);
			hints.appendTo(parent);
			setTimeout(function(){
				hints.shanimate({
					speed:500,
					efect:(o.position === 'left')?'slideRightIn':'slideLeftIn',
					fnIn:function(){
						hints.css('display','block')
					},
					fnOut:function(){ 
						hints.css('display','block') 
						setTimeout(function(){
							hints.html(
								'<i class="sna-icon-user"></i> '+
								op.text.welcome2
							);
							hints.shanimate({
								speed:500,
								efect:'slatic',
								fnIn:function(){
									hints.css('display','block')
								},
								fnOut:function(){ 
									hints.css('display','block')
									setTimeout(function(){hints.css('display','none')},5000)
								}
							})
						},5000)
					}
				})
				
			},3000);
		},
		setSize:function(size){
			var that = this, o = this.options, content = this.content;
			if(!$.isUndefined(size) && !$.isNull(size)){
				o.size  = size;
				this.options = $.extend({}, this.options, o);
				 o = this.options;
			}
			if($.isNumeric( parseInt(o.size) )){
				content.css({
					width: o.size,
					height: o.size
				})
			}
			else if(Utils.isString(o.size)){
				content.addClass(o.size);
			}
			return this;
		},
		getSize:function(int){
			if(int){
				return {
					width: Utils.getStyleOne(this.content,'width'),
					height: Utils.getStyleOne(this.content,'height')
				};
			}else{
				return this.options.size;
			}
		},
		setPosition:function(position,fixed){
			var that = this, o = this.options, content = this.content, pos;
			if(!$.isUndefined(position) && !$.isNull(position)){
				o.position  = position;
				this.options = $.extend({}, this.options, o);
				 o = this.options;
			}
			if(!$.isUndefined(fixed) && !$.isNull(fixed)){
				o.fixed  = fixed;
				this.options = $.extend({}, this.options, o);
				 o = this.options;
			}
			if(o.fixed){
				content.css({
					position: 'fixed'
				});
			}

			if(Utils.isString(o.position)){
				content.addClass(o.position);
			}else if(Utils.isObject(o.position)){
				pos = $.extend({}, {
					position:(fixed)?'fixed':'relative',
					top:'auto',
					left:'5px',
					bottom:'5px'
				}, o.position);
				content.css(pos);
			}
			return this;
		},
		getPosition:function(){
			return $.extend({}, 
				{
					position: Utils.getStyleOne(this.content,'position'),
					top:0,
					left:0
				}, 
					this.content.position()
				);
		}
	};

	SNA['btnfloat'] = BtnFloat;

	$.sna = SNA;
	return SNA.init();

}));
