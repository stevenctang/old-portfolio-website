var jn = {};
var require = function(mod){
	mod = mod.replace(/^\.{0,1}\//,'');
	if (require.store[mod]) return require.store[mod];
};
require.store = {};
jn.isLoaded = false;
jn.loaded = function(){
	if (jn.isLoaded) return false;
	jn.isLoaded = true;
	//config - include from both the html page and the included js script
	jn.config = {};
	if (jnConfig){
		for (var i=0,len=jnConfig.length;i<len;i++){
			for (var c in jnConfig[i]){
				jn.config[c] = jnConfig[i][c];
			}
		}
	}
	//jn.config = require('config.js')();

	//	if we are not testing, turn off console.log
	if(!jn.config.testing){
		console = {};
		console.log = function(){};
	}

	//get sessId
	var getCookie = function(name){
		if (!document.cookie) return undefined;
	   	var result, decode = decodeURIComponent;
	   	return (result = new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
	};
	var randStr = function(len){
		var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var result = '';
	    for (var i=len;i>0;i--) result += chars[Math.round(Math.random()*(chars.length - 1))];
	    return result;
	};
	var sessId = getCookie('sessId');
	if (!sessId){
		try {
			if (sessionStorage !== undefined){
				sessId = sessionStorage.getItem('sessId');
				if (!sessId){
					sessId = randStr(32); //generate sessId
					sessionStorage.setItem('sessId',sessId);
				}
				//sessionStorage.setItem("key", "value");
				//console.log('SESSION STORAGE SESS SET:',sessId);
			}
			else sessId = randStr(32); //generate sessId
		}
		catch(e){
			console.log('sessionStorage not available:',e);
			sessId = randStr(32);
		}
	}
	//console.log('SESSION STORAGE SESS SET:',sessId);
	//console.log('web loaded sessId:',sessId);
	jn.config.sessId = sessId;
	require('jn/core.js')(jn,{
		fail:function(e){jn.log('core fail:',e);},
		done:function(){
			jn.m('sess').id = sessId;
			jn.ch(function(d,ch){ //init jquery
				$(function(){
					ch.done();
				});
			}).ch(function(d,ch){ //init views
				jn.views.start({},{
					fail:ch.fail,
					done:ch.done
				});
			}).ch(function(){ //start socket

			}).fail(function(e){
				jn.log('core ch fail:',e);
			});
		}
	});
};
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Â© 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Â© 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */function getContrastYIQ(hexcolor){
	if (hexcolor.length == 3) hexcolor = hexcolor.substr(0,1)+hexcolor.substr(0,1)+hexcolor.substr(1,1)+hexcolor.substr(1,1)+hexcolor.substr(2,1)+hexcolor.substr(2,1);
	var r = parseInt(hexcolor.substr(0,2),16);
	var g = parseInt(hexcolor.substr(2,2),16);
	var b = parseInt(hexcolor.substr(4,2),16);
	var yiq = ((r*299)+(g*587)+(b*114))/1000;
	return (yiq >= 128) ? 'black' : 'white';
}(function ( $ ) {
	$.fn.extend ({
		getImgSize: function(cb) {
			
			var me = this,
				result = {},
				// Get Image Size
				image_url = me.css('background-image'),
			    image;

			// Remove url() or in case of Chrome url("")
			image_url = image_url.match(/^url\("?(.+?)"?\)$/);

			if (image_url[1]) {
			    image_url = image_url[1];
			    image = new Image();

			    // just in case it is not already loaded
			    $(image).load(function () {
			    	cb(image);
			    	console.log(image.width + 'x' + image.height);
			    });

			    image.src = image_url;
			}
		}
	});
}(jQuery));	/*!
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery hashchange event
//
// *Version: 1.3, Last updated: 7/21/2010*
// 
// Project Home - http://benalman.com/projects/jquery-hashchange-plugin/
// GitHub       - http://github.com/cowboy/jquery-hashchange/
// Source       - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.js
// (Minified)   - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.min.js (0.8kb gzipped)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// These working examples, complete with fully commented code, illustrate a few
// ways in which this plugin can be used.
// 
// hashchange event - http://benalman.com/code/projects/jquery-hashchange/examples/hashchange/
// document.domain - http://benalman.com/code/projects/jquery-hashchange/examples/document_domain/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
// 
// jQuery Versions - 1.2.6, 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-4, Chrome 5-6, Safari 3.2-5,
//                   Opera 9.6-10.60, iPhone 3.1, Android 1.6-2.2, BlackBerry 4.6-5.
// Unit Tests      - http://benalman.com/code/projects/jquery-hashchange/unit/
// 
// About: Known issues
// 
// While this jQuery hashchange event implementation is quite stable and
// robust, there are a few unfortunate browser bugs surrounding expected
// hashchange event-based behaviors, independent of any JavaScript
// window.onhashchange abstraction. See the following examples for more
// information:
// 
// Chrome: Back Button - http://benalman.com/code/projects/jquery-hashchange/examples/bug-chrome-back-button/
// Firefox: Remote XMLHttpRequest - http://benalman.com/code/projects/jquery-hashchange/examples/bug-firefox-remote-xhr/
// WebKit: Back Button in an Iframe - http://benalman.com/code/projects/jquery-hashchange/examples/bug-webkit-hash-iframe/
// Safari: Back Button from a different domain - http://benalman.com/code/projects/jquery-hashchange/examples/bug-safari-back-from-diff-domain/
// 
// Also note that should a browser natively support the window.onhashchange 
// event, but not report that it does, the fallback polling loop will be used.
// 
// About: Release History
// 
// 1.3   - (7/21/2010) Reorganized IE6/7 Iframe code to make it more
//         "removable" for mobile-only development. Added IE6/7 document.title
//         support. Attempted to make Iframe as hidden as possible by using
//         techniques from http://www.paciellogroup.com/blog/?p=604. Added 
//         support for the "shortcut" format $(window).hashchange( fn ) and
//         $(window).hashchange() like jQuery provides for built-in events.
//         Renamed jQuery.hashchangeDelay to <jQuery.fn.hashchange.delay> and
//         lowered its default value to 50. Added <jQuery.fn.hashchange.domain>
//         and <jQuery.fn.hashchange.src> properties plus document-domain.html
//         file to address access denied issues when setting document.domain in
//         IE6/7.
// 1.2   - (2/11/2010) Fixed a bug where coming back to a page using this plugin
//         from a page on another domain would cause an error in Safari 4. Also,
//         IE6/7 Iframe is now inserted after the body (this actually works),
//         which prevents the page from scrolling when the event is first bound.
//         Event can also now be bound before DOM ready, but it won't be usable
//         before then in IE6/7.
// 1.1   - (1/21/2010) Incorporated document.documentMode test to fix IE8 bug
//         where browser version is incorrectly reported as 8.0, despite
//         inclusion of the X-UA-Compatible IE=EmulateIE7 meta tag.
// 1.0   - (1/9/2010) Initial Release. Broke out the jQuery BBQ event.special
//         window.onhashchange functionality into a separate plugin for users
//         who want just the basic event & back button support, without all the
//         extra awesomeness that BBQ provides. This plugin will be included as
//         part of jQuery BBQ, but also be available separately.

(function($,window,undefined){
  '$:nomunge'; // Used by YUI compressor.
  
  // Reused string.
  var str_hashchange = 'hashchange',
    
    // Method / object references.
    doc = document,
    fake_onhashchange,
    special = $.event.special,
    
    // Does the browser support window.onhashchange? Note that IE8 running in
    // IE7 compatibility mode reports true for 'onhashchange' in window, even
    // though the event isn't supported, so also test document.documentMode.
    doc_mode = doc.documentMode,
    supports_onhashchange = 'on' + str_hashchange in window && ( doc_mode === undefined || doc_mode > 7 );
  
  // Get location.hash (or what you'd expect location.hash to be) sans any
  // leading #. Thanks for making this necessary, Firefox!
  function get_fragment( url ) {
    url = url || location.href;
    return '#' + url.replace( /^[^#]*#?(.*)$/, '$1' );
  };
  
  // Method: jQuery.fn.hashchange
  // 
  // Bind a handler to the window.onhashchange event or trigger all bound
  // window.onhashchange event handlers. This behavior is consistent with
  // jQuery's built-in event handlers.
  // 
  // Usage:
  // 
  // > jQuery(window).hashchange( [ handler ] );
  // 
  // Arguments:
  // 
  //  handler - (Function) Optional handler to be bound to the hashchange
  //    event. This is a "shortcut" for the more verbose form:
  //    jQuery(window).bind( 'hashchange', handler ). If handler is omitted,
  //    all bound window.onhashchange event handlers will be triggered. This
  //    is a shortcut for the more verbose
  //    jQuery(window).trigger( 'hashchange' ). These forms are described in
  //    the <hashchange event> section.
  // 
  // Returns:
  // 
  //  (jQuery) The initial jQuery collection of elements.
  
  // Allow the "shortcut" format $(elem).hashchange( fn ) for binding and
  // $(elem).hashchange() for triggering, like jQuery does for built-in events.
  $.fn[ str_hashchange ] = function( fn ) {
    return fn ? this.bind( str_hashchange, fn ) : this.trigger( str_hashchange );
  };
  
  // Property: jQuery.fn.hashchange.delay
  // 
  // The numeric interval (in milliseconds) at which the <hashchange event>
  // polling loop executes. Defaults to 50.
  
  // Property: jQuery.fn.hashchange.domain
  // 
  // If you're setting document.domain in your JavaScript, and you want hash
  // history to work in IE6/7, not only must this property be set, but you must
  // also set document.domain BEFORE jQuery is loaded into the page. This
  // property is only applicable if you are supporting IE6/7 (or IE8 operating
  // in "IE7 compatibility" mode).
  // 
  // In addition, the <jQuery.fn.hashchange.src> property must be set to the
  // path of the included "document-domain.html" file, which can be renamed or
  // modified if necessary (note that the document.domain specified must be the
  // same in both your main JavaScript as well as in this file).
  // 
  // Usage:
  // 
  // jQuery.fn.hashchange.domain = document.domain;
  
  // Property: jQuery.fn.hashchange.src
  // 
  // If, for some reason, you need to specify an Iframe src file (for example,
  // when setting document.domain as in <jQuery.fn.hashchange.domain>), you can
  // do so using this property. Note that when using this property, history
  // won't be recorded in IE6/7 until the Iframe src file loads. This property
  // is only applicable if you are supporting IE6/7 (or IE8 operating in "IE7
  // compatibility" mode).
  // 
  // Usage:
  // 
  // jQuery.fn.hashchange.src = 'path/to/file.html';
  
  $.fn[ str_hashchange ].delay = 50;
  /*
  $.fn[ str_hashchange ].domain = null;
  $.fn[ str_hashchange ].src = null;
  */
  
  // Event: hashchange event
  // 
  // Fired when location.hash changes. In browsers that support it, the native
  // HTML5 window.onhashchange event is used, otherwise a polling loop is
  // initialized, running every <jQuery.fn.hashchange.delay> milliseconds to
  // see if the hash has changed. In IE6/7 (and IE8 operating in "IE7
  // compatibility" mode), a hidden Iframe is created to allow the back button
  // and hash-based history to work.
  // 
  // Usage as described in <jQuery.fn.hashchange>:
  // 
  // > // Bind an event handler.
  // > jQuery(window).hashchange( function(e) {
  // >   var hash = location.hash;
  // >   ...
  // > });
  // > 
  // > // Manually trigger the event handler.
  // > jQuery(window).hashchange();
  // 
  // A more verbose usage that allows for event namespacing:
  // 
  // > // Bind an event handler.
  // > jQuery(window).bind( 'hashchange', function(e) {
  // >   var hash = location.hash;
  // >   ...
  // > });
  // > 
  // > // Manually trigger the event handler.
  // > jQuery(window).trigger( 'hashchange' );
  // 
  // Additional Notes:
  // 
  // * The polling loop and Iframe are not created until at least one handler
  //   is actually bound to the 'hashchange' event.
  // * If you need the bound handler(s) to execute immediately, in cases where
  //   a location.hash exists on page load, via bookmark or page refresh for
  //   example, use jQuery(window).hashchange() or the more verbose 
  //   jQuery(window).trigger( 'hashchange' ).
  // * The event can be bound before DOM ready, but since it won't be usable
  //   before then in IE6/7 (due to the necessary Iframe), recommended usage is
  //   to bind it inside a DOM ready handler.
  
  // Override existing $.event.special.hashchange methods (allowing this plugin
  // to be defined after jQuery BBQ in BBQ's source code).
  
	special[ str_hashchange ] = $.extend( special[ str_hashchange ], {
    
    // Called only when the first 'hashchange' event is bound to window.
    setup: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to create our own. And we don't want to call this
      // until the user binds to the event, just in case they never do, since it
      // will create a polling loop and possibly even a hidden Iframe.
      $( fake_onhashchange.start );
    },
    
    // Called only when the last 'hashchange' event is unbound from window.
    teardown: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to stop ours (if possible).
      $( fake_onhashchange.stop );
    }
    
  });
  
  // fake_onhashchange does all the work of triggering the window.onhashchange
  // event for browsers that don't natively support it, including creating a
  // polling loop to watch for hash changes and in IE 6/7 creating a hidden
  // Iframe to enable back and forward.
  fake_onhashchange = (function(){
    var self = {},
      timeout_id,
      
      // Remember the initial hash so it doesn't get triggered immediately.
      last_hash = get_fragment(),
      
      fn_retval = function(val){ return val; },
      history_set = fn_retval,
      history_get = fn_retval;
    
    // Start the polling loop.
    self.start = function() {
      timeout_id || poll();
    };
    
    // Stop the polling loop.
    self.stop = function() {
      timeout_id && clearTimeout( timeout_id );
      timeout_id = undefined;
    };
    
    // This polling loop checks every $.fn.hashchange.delay milliseconds to see
    // if location.hash has changed, and triggers the 'hashchange' event on
    // window when necessary.
    function poll() {
      var hash = get_fragment(),
        history_hash = history_get( last_hash );
      
      if ( hash !== last_hash ) {
        history_set( last_hash = hash, history_hash );
        
        $(window).trigger( str_hashchange );
        
      } else if ( history_hash !== last_hash ) {
        location.href = location.href.replace( /#.*/, '' ) + history_hash;
      }
      
      timeout_id = setTimeout( poll, $.fn[ str_hashchange ].delay );
    };
    
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    // vvvvvvvvvvvvvvvvvvv REMOVE IF NOT SUPPORTING IE6/7/8 vvvvvvvvvvvvvvvvvvv
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    navigator.appName.indexOf("Internet Explorer")!=-1 && !supports_onhashchange && (function(){
      // Not only do IE6/7 need the "magical" Iframe treatment, but so does IE8
      // when running in "IE7 compatibility" mode.
      
      var iframe,
        iframe_src;
      
      // When the event is bound and polling starts in IE 6/7, create a hidden
      // Iframe for history handling.
      self.start = function(){
        if ( !iframe ) {
          iframe_src = $.fn[ str_hashchange ].src;
          iframe_src = iframe_src && iframe_src + get_fragment();
          
          // Create hidden Iframe. Attempt to make Iframe as hidden as possible
          // by using techniques from http://www.paciellogroup.com/blog/?p=604.
          iframe = $('<iframe tabindex="-1" title="empty"/>').hide()
            
            // When Iframe has completely loaded, initialize the history and
            // start polling.
            .one( 'load', function(){
              iframe_src || history_set( get_fragment() );
              poll();
            })
            
            // Load Iframe src if specified, otherwise nothing.
            .attr( 'src', iframe_src || 'javascript:0' )
            
            // Append Iframe after the end of the body to prevent unnecessary
            // initial page scrolling (yes, this works).
            .insertAfter( 'body' )[0].contentWindow;
          
          // Whenever `document.title` changes, update the Iframe's title to
          // prettify the back/next history menu entries. Since IE sometimes
          // errors with "Unspecified error" the very first time this is set
          // (yes, very useful) wrap this with a try/catch block.
          doc.onpropertychange = function(){
            try {
              if ( event.propertyName === 'title' ) {
                iframe.document.title = doc.title;
              }
            } catch(e) {}
          };
          
        }
      };
      
      // Override the "stop" method since an IE6/7 Iframe was created. Even
      // if there are no longer any bound event handlers, the polling loop
      // is still necessary for back/next to work at all!
      self.stop = fn_retval;
      
      // Get history by looking at the hidden Iframe's location.hash.
      history_get = function() {
        return get_fragment( iframe.location.href );
      };
      
      // Set a new history item by opening and then closing the Iframe
      // document, *then* setting its location.hash. If document.domain has
      // been set, update that as well.
      history_set = function( hash, history_hash ) {
        var iframe_doc = iframe.document,
          domain = $.fn[ str_hashchange ].domain;
        
        if ( hash !== history_hash ) {
          // Update Iframe with any initial `document.title` that might be set.
          iframe_doc.title = doc.title;
          
          // Opening the Iframe's document after it has been closed is what
          // actually adds a history entry.
          iframe_doc.open();
          
          // Set document.domain for the Iframe document as well, if necessary.
          domain && iframe_doc.write( '<'+'script>document.domain="' + domain + '"</'+'script>' );
          
          iframe_doc.close();
          
          // Update the Iframe's hash, for great justice.
          iframe.location.hash = hash;
        }
      };
      
    })();
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // ^^^^^^^^^^^^^^^^^^^ REMOVE IF NOT SUPPORTING IE6/7/8 ^^^^^^^^^^^^^^^^^^^
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    
    return self;
  })();
  
})($,this);/*!
 * iconic.js v0.3.2 - The Iconic JavaScript library
 * Copyright (c) 2014 Waybury - http://useiconic.com
 */

!function(a){"object"==typeof exports?module.exports=a():"function"==typeof define&&define.amd?define(a):"undefined"!=typeof window?window.IconicJS=a():"undefined"!=typeof global?global.IconicJS=a():"undefined"!=typeof self&&(self.IconicJS=a())}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b){var c=(a("./modules/polyfills"),a("./modules/svgInjector")),d=a("./modules/extend"),e=a("./modules/responsive"),f=a("./modules/position"),g=a("./modules/container"),h=a("./modules/log"),i={},j=window.iconicSmartIconApis={},k=("file:"===window.location.protocol,0),l=function(a,b,e){b=d({},i,b||{});var f={evalScripts:b.evalScripts,pngFallback:b.pngFallback};f.each=function(a){if(a)if(a instanceof SVGSVGElement){var c=a.getAttribute("data-icon");if(c&&j[c]){var d=j[c](a);for(var e in d)a[e]=d[e]}/iconic-bg-/.test(a.getAttribute("class"))&&g.addBackground(a),m(a),k++,b&&b.each&&"function"==typeof b.each&&b.each(a)}else"string"==typeof a&&h.debug(a)};var l=document.querySelectorAll(a);c(l,f,e)},m=function(a){var b=[];a?"object"==typeof a?b.push(a):"string"==typeof a&&(b=document.querySelectorAll(a)):b=document.querySelectorAll("svg.iconic"),Array.prototype.forEach.call(b,function(a){a instanceof SVGSVGElement&&(a.update&&a.update(),e.refresh(a),f.refresh(a))})},n=function(){i.debug&&console.time&&console.time("autoInjectSelector - "+i.autoInjectSelector);var a=k;l(i.autoInjectSelector,{},function(){if(i.debug&&console.timeEnd&&console.timeEnd("autoInjectSelector - "+i.autoInjectSelector),h.debug("AutoInjected: "+(k-a)),e.refreshAll(),i.autoInjectDone&&"function"==typeof i.autoInjectDone){var b=k-a;i.autoInjectDone(b)}})},o=function(a){a&&""!==a&&"complete"!==document.readyState?document.addEventListener("DOMContentLoaded",n):document.removeEventListener("DOMContentLoaded",n)},p=function(a){return a=a||{},d(i,a),o(i.autoInjectSelector),h.enableDebug(i.debug),window._Iconic?window._Iconic:{inject:l,update:m,smartIconApis:j,svgInjectedCount:k}};b.exports=p,window._Iconic=new p({autoInjectSelector:"img.iconic",evalScripts:"once",pngFallback:!1,each:null,autoInjectDone:null,debug:!1})},{"./modules/container":2,"./modules/extend":3,"./modules/log":4,"./modules/polyfills":5,"./modules/position":6,"./modules/responsive":7,"./modules/svgInjector":8}],2:[function(a,b){var c=function(a){var b=a.getAttribute("class").split(" "),c=-1!==b.indexOf("iconic-fluid"),d=[],e=["iconic-bg"];Array.prototype.forEach.call(b,function(a){switch(a){case"iconic-sm":case"iconic-md":case"iconic-lg":d.push(a),c||e.push(a.replace(/-/,"-bg-"));break;case"iconic-fluid":d.push(a),e.push(a.replace(/-/,"-bg-"));break;case"iconic-bg-circle":case"iconic-bg-rounded-rect":case"iconic-bg-badge":e.push(a);break;default:d.push(a)}}),a.setAttribute("class",d.join(" "));var f=a.parentNode,g=Array.prototype.indexOf.call(f.childNodes,a),h=document.createElement("span");h.setAttribute("class",e.join(" ")),h.appendChild(a),f.insertBefore(h,f.childNodes[g])};b.exports={addBackground:c}},{}],3:[function(a,b){b.exports=function(a){return Array.prototype.forEach.call(Array.prototype.slice.call(arguments,1),function(b){if(b)for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c])}),a}},{}],4:[function(a,b){var c=!1,d=function(a){console&&console.log&&console.log(a)},e=function(a){d("Iconic INFO: "+a)},f=function(a){d("Iconic WARNING: "+a)},g=function(a){c&&d("Iconic DEBUG: "+a)},h=function(a){c=a};b.exports={info:e,warn:f,debug:g,enableDebug:h}},{}],5:[function(){Array.prototype.forEach||(Array.prototype.forEach=function(a,b){"use strict";var c,d;for(c=0,d=this.length;d>c;++c)c in this&&a.call(b,this[c],c,this)})},{}],6:[function(a,b){var c=function(a){var b=a.getAttribute("data-position");if(b&&""!==b){var c,d,e,f,g,h,i,j=a.getAttribute("width"),k=a.getAttribute("height"),l=b.split("-"),m=a.querySelectorAll("g.iconic-container");Array.prototype.forEach.call(m,function(a){if(c=a.getAttribute("data-width"),d=a.getAttribute("data-height"),c!==j||d!==k){if(e=a.getAttribute("transform"),f=1,e){var b=e.match(/scale\((\d)/);f=b&&b[1]?b[1]:1}g=Math.floor((j/f-c)/2),h=Math.floor((k/f-d)/2),Array.prototype.forEach.call(l,function(a){switch(a){case"top":h=0;break;case"bottom":h=k/f-d;break;case"left":g=0;break;case"right":g=j/f-c;break;case"center":break;default:console.log("Unknown position: "+a)}}),i=0===h?g:g+" "+h,i="translate("+i+")",e?/translate/.test(e)?e=e.replace(/translate\(.*?\)/,i):e+=" "+i:e=i,a.setAttribute("transform",e)}})}};b.exports={refresh:c}},{}],7:[function(a,b){var c=/(iconic-sm\b|iconic-md\b|iconic-lg\b)/,d=function(a,b){var c="undefined"!=typeof window.getComputedStyle&&window.getComputedStyle(a,null).getPropertyValue(b);return!c&&a.currentStyle&&(c=a.currentStyle[b.replace(/([a-z])\-([a-z])/,function(a,b,c){return b+c.toUpperCase()})]||a.currentStyle[b]),c},e=function(a){var b=a.style.display;a.style.display="block";var c=parseFloat(d(a,"width").slice(0,-2)),e=parseFloat(d(a,"height").slice(0,-2));return a.style.display=b,{width:c,height:e}},f=function(){var a="/* Iconic Responsive Support Styles */\n.iconic-property-fill, .iconic-property-text {stroke: none !important;}\n.iconic-property-stroke {fill: none !important;}\nsvg.iconic.iconic-fluid {height:100% !important;width:100% !important;}\nsvg.iconic.iconic-sm:not(.iconic-size-md):not(.iconic-size-lg), svg.iconic.iconic-size-sm{width:16px;height:16px;}\nsvg.iconic.iconic-md:not(.iconic-size-sm):not(.iconic-size-lg), svg.iconic.iconic-size-md{width:32px;height:32px;}\nsvg.iconic.iconic-lg:not(.iconic-size-sm):not(.iconic-size-md), svg.iconic.iconic-size-lg{width:128px;height:128px;}\nsvg.iconic-sm > g.iconic-md, svg.iconic-sm > g.iconic-lg, svg.iconic-md > g.iconic-sm, svg.iconic-md > g.iconic-lg, svg.iconic-lg > g.iconic-sm, svg.iconic-lg > g.iconic-md {display: none;}\nsvg.iconic.iconic-icon-sm > g.iconic-lg, svg.iconic.iconic-icon-md > g.iconic-lg {display:none;}\nsvg.iconic-sm:not(.iconic-icon-md):not(.iconic-icon-lg) > g.iconic-sm, svg.iconic-md.iconic-icon-sm > g.iconic-sm, svg.iconic-lg.iconic-icon-sm > g.iconic-sm {display:inline;}\nsvg.iconic-md:not(.iconic-icon-sm):not(.iconic-icon-lg) > g.iconic-md, svg.iconic-sm.iconic-icon-md > g.iconic-md, svg.iconic-lg.iconic-icon-md > g.iconic-md {display:inline;}\nsvg.iconic-lg:not(.iconic-icon-sm):not(.iconic-icon-md) > g.iconic-lg, svg.iconic-sm.iconic-icon-lg > g.iconic-lg, svg.iconic-md.iconic-icon-lg > g.iconic-lg {display:inline;}";navigator&&navigator.userAgent&&/MSIE 10\.0/.test(navigator.userAgent)&&(a+="svg.iconic{zoom:1.0001;}");var b=document.createElement("style");b.id="iconic-responsive-css",b.type="text/css",b.styleSheet?b.styleSheet.cssText=a:b.appendChild(document.createTextNode(a)),(document.head||document.getElementsByTagName("head")[0]).appendChild(b)},g=function(a){if(/iconic-fluid/.test(a.getAttribute("class"))){var b,d=e(a),f=a.viewBox.baseVal.width/a.viewBox.baseVal.height;b=1===f?Math.min(d.width,d.height):1>f?d.width:d.height;var g;g=32>b?"iconic-sm":b>=32&&128>b?"iconic-md":"iconic-lg";var h=a.getAttribute("class"),i=c.test(h)?h.replace(c,g):h+" "+g;a.setAttribute("class",i)}},h=function(){var a=document.querySelectorAll(".iconic-injected-svg.iconic-fluid");Array.prototype.forEach.call(a,function(a){g(a)})};document.addEventListener("DOMContentLoaded",function(){f()}),window.addEventListener("resize",function(){h()}),b.exports={refresh:g,refreshAll:h}},{}],8:[function(a,b){var c="file:"===window.location.protocol,d=document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1"),e={},f=0,g=[],h={},i=function(a){return a.cloneNode(!0)},j=function(a,b){g[a]=g[a]||[],g[a].push(b)},k=function(a){for(var b=0,c=g[a].length;c>b;b++)!function(b){setTimeout(function(){g[a][b](i(e[a]))},0)}(b)},l=function(a,b){if(void 0!==e[a])e[a]instanceof SVGSVGElement?b(e[a].cloneNode(!0)):j(a,b);else{if(!window.XMLHttpRequest)return b("Browser does not support XMLHttpRequest"),!1;e[a]={},j(a,b);var d=new XMLHttpRequest;d.onreadystatechange=function(){if(4===d.readyState){if(404===d.status||null===d.responseXML)return b("Unable to load SVG file: "+a),c&&b("Note: SVG injection ajax calls do not work locally without adjusting security setting in your browser. Or consider using a local webserver."),b(),!1;if(!(200===d.status||c&&0===d.status))return b("There was a problem injecting the SVG: "+d.status+" "+d.statusText),!1;if(d.responseXML instanceof Document)e[a]=d.responseXML.documentElement;else if(DOMParser&&DOMParser instanceof Function){var f;try{var g=new DOMParser;f=g.parseFromString(d.responseText,"text/xml")}catch(h){f=void 0}if(!f||f.getElementsByTagName("parsererror").length)return b("Unable to parse SVG file: "+a),!1;e[a]=f.documentElement}k(a)}},d.open("GET",a),d.overrideMimeType&&d.overrideMimeType("text/xml"),d.send()}},m=function(a,b,c,e){var g=a.getAttribute("src")||a.getAttribute("data-src");return/svg$/i.test(g)?d?(a.setAttribute("src",""),l(g,function(c){if(void 0===c||"string"==typeof c)return e(c),!1;var d=a.getAttribute("id");d&&c.setAttribute("id",d);var i=a.getAttribute("title");i&&c.setAttribute("title",i);var j=a.getAttribute("class");if(j){var k=[c.getAttribute("class"),"iconic-injected-svg",j].join(" ");c.setAttribute("class",k)}var l=a.getAttribute("style");l&&c.setAttribute("style",l);var m=[].filter.call(a.attributes,function(a){return/^data-\w[\w\-]*$/.test(a.name)});Array.prototype.forEach.call(m,function(a){a.name&&a.value&&c.setAttribute(a.name,a.value)});for(var n,o=c.querySelectorAll("defs clipPath[id]"),p=0,q=o.length;q>p;p++){n=o[p].id+"-"+f;for(var r=c.querySelectorAll('[clip-path*="'+o[p].id+'"]'),s=0,t=r.length;t>s;s++)r[s].setAttribute("clip-path","url(#"+n+")");o[p].id=n}c.removeAttribute("xmlns:a");for(var u,v,w=c.querySelectorAll("script"),x=[],y=0,z=w.length;z>y;y++)v=w[y].getAttribute("type"),v&&"application/ecmascript"!==v&&"application/javascript"!==v||(u=w[y].innerText||w[y].textContent,x.push(u),c.removeChild(w[y]));if(x.length>0&&("always"===b||"once"===b&&!h[g])){for(var A=0,B=x.length;B>A;A++)new Function(x[A])(window);h[g]=!0}a.parentNode.replaceChild(c,a),f++,e(c)}),void 0):(c?(a.setAttribute("src",c+"/"+g.split("/").pop().replace(".svg",".png")),e(null)):e("This browser does not support SVG and no PNG fallback was defined."),void 0):(e("Attempted to inject a non-svg file: "+g),void 0)},n=function(a,b,c){b=b||{};var d=b.evalScripts||"always",e=b.pngFallback||!1,f=b.each;if(void 0!==a.length){var g=0;Array.prototype.forEach.call(a,function(b){m(b,d,e,function(b){f&&"function"==typeof f&&f(b),c&&a.length===++g&&c(g)})})}else null!==a?m(a,d,e,function(a){f&&"function"==typeof f&&f(a),c&&c(1)}):c&&c(0)};b.exports=n},{}]},{},[1])(1)});/*!
	Autosize v1.18.1 - 2013-11-05
	Automatically adjust textarea height based on user input.
	(c) 2013 Jack Moore - http://www.jacklmoore.com/autosize
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function(e){var t,o={className:"autosizejs",append:"",callback:!1,resizeDelay:10},i='<textarea tabindex="-1" style="position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; padding: 0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden; transition:none; -webkit-transition:none; -moz-transition:none;"/>',n=["fontFamily","fontSize","fontWeight","fontStyle","letterSpacing","textTransform","wordSpacing","textIndent"],s=e(i).data("autosize",!0)[0];s.style.lineHeight="99px","99px"===e(s).css("lineHeight")&&n.push("lineHeight"),s.style.lineHeight="",e.fn.autosize=function(i){return this.length?(i=e.extend({},o,i||{}),s.parentNode!==document.body&&e(document.body).append(s),this.each(function(){function o(){var t,o;"getComputedStyle"in window?(t=window.getComputedStyle(u,null),o=u.getBoundingClientRect().width,e.each(["paddingLeft","paddingRight","borderLeftWidth","borderRightWidth"],function(e,i){o-=parseInt(t[i],10)}),s.style.width=o+"px"):s.style.width=Math.max(p.width(),0)+"px"}function a(){var a={};if(t=u,s.className=i.className,d=parseInt(p.css("maxHeight"),10),e.each(n,function(e,t){a[t]=p.css(t)}),e(s).css(a),o(),window.chrome){var r=u.style.width;u.style.width="0px",u.offsetWidth,u.style.width=r}}function r(){var e,n;t!==u?a():o(),s.value=u.value+i.append,s.style.overflowY=u.style.overflowY,n=parseInt(u.style.height,10),s.scrollTop=0,s.scrollTop=9e4,e=s.scrollTop,d&&e>d?(u.style.overflowY="scroll",e=d):(u.style.overflowY="hidden",c>e&&(e=c)),e+=w,n!==e&&(u.style.height=e+"px",f&&i.callback.call(u,u))}function l(){clearTimeout(h),h=setTimeout(function(){var e=p.width();e!==g&&(g=e,r())},parseInt(i.resizeDelay,10))}var d,c,h,u=this,p=e(u),w=0,f=e.isFunction(i.callback),z={height:u.style.height,overflow:u.style.overflow,overflowY:u.style.overflowY,wordWrap:u.style.wordWrap,resize:u.style.resize},g=p.width();p.data("autosize")||(p.data("autosize",!0),("border-box"===p.css("box-sizing")||"border-box"===p.css("-moz-box-sizing")||"border-box"===p.css("-webkit-box-sizing"))&&(w=p.outerHeight()-p.height()),c=Math.max(parseInt(p.css("minHeight"),10)-w||0,p.height()),p.css({overflow:"hidden",overflowY:"hidden",wordWrap:"break-word",resize:"none"===p.css("resize")||"vertical"===p.css("resize")?"none":"horizontal"}),"onpropertychange"in u?"oninput"in u?p.on("input.autosize keyup.autosize",r):p.on("propertychange.autosize",function(){"value"===event.propertyName&&r()}):p.on("input.autosize",r),i.resizeDelay!==!1&&e(window).on("resize.autosize",l),p.on("autosize.resize",r),p.on("autosize.resizeIncludeStyle",function(){t=null,r()}),p.on("autosize.destroy",function(){t=null,clearTimeout(h),e(window).off("resize",l),p.off("autosize").off(".autosize").css(z).removeData("autosize")}),r())})):this}})(window.jQuery||window.$);/*mousewheel*/
(function(a){function d(b){var c=b||window.event,d=[].slice.call(arguments,1),e=0,f=!0,g=0,h=0;return b=a.event.fix(c),b.type="mousewheel",c.wheelDelta&&(e=c.wheelDelta/120),c.detail&&(e=-c.detail/3),h=e,c.axis!==undefined&&c.axis===c.HORIZONTAL_AXIS&&(h=0,g=-1*e),c.wheelDeltaY!==undefined&&(h=c.wheelDeltaY/120),c.wheelDeltaX!==undefined&&(g=-1*c.wheelDeltaX/120),d.unshift(b,e,g,h),(a.event.dispatch||a.event.handle).apply(this,d)}var b=["DOMMouseScroll","mousewheel"];if(a.event.fixHooks)for(var c=b.length;c;)a.event.fixHooks[b[--c]]=a.event.mouseHooks;a.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=b.length;a;)this.addEventListener(b[--a],d,!1);else this.onmousewheel=d},teardown:function(){if(this.removeEventListener)for(var a=b.length;a;)this.removeEventListener(b[--a],d,!1);else this.onmousewheel=null}},a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery);
/*custom scrollbar*/
(function(c){var b={init:function(e){var f={set_width:false,set_height:false,horizontalScroll:false,scrollInertia:950,mouseWheel:true,mouseWheelPixels:"auto",autoDraggerLength:true,autoHideScrollbar:false,alwaysShowScrollbar:false,snapAmount:null,snapOffset:0,scrollButtons:{enable:false,scrollType:"continuous",scrollSpeed:"auto",scrollAmount:40},advanced:{updateOnBrowserResize:true,updateOnContentResize:false,autoExpandHorizontalScroll:false,autoScrollOnFocus:true,normalizeMouseWheelDelta:false},contentTouchScroll:true,callbacks:{onScrollStart:function(){},onScroll:function(){},onTotalScroll:function(){},onTotalScrollBack:function(){},onTotalScrollOffset:0,onTotalScrollBackOffset:0,whileScrolling:function(){}},theme:"light"},e=c.extend(true,f,e);return this.each(function(){var m=c(this);if(e.set_width){m.css("width",e.set_width)}if(e.set_height){m.css("height",e.set_height)}if(!c(document).data("mCustomScrollbar-index")){c(document).data("mCustomScrollbar-index","1")}else{var t=parseInt(c(document).data("mCustomScrollbar-index"));c(document).data("mCustomScrollbar-index",t+1)}m.wrapInner("<div class='mCustomScrollBox mCS-"+e.theme+"' id='mCSB_"+c(document).data("mCustomScrollbar-index")+"' style='position:relative; height:100%; overflow:hidden; max-width:100%;' />").addClass("mCustomScrollbar _mCS_"+c(document).data("mCustomScrollbar-index"));var g=m.children(".mCustomScrollBox");if(e.horizontalScroll){g.addClass("mCSB_horizontal").wrapInner("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />");var k=g.children(".mCSB_h_wrapper");k.wrapInner("<div class='mCSB_container' style='position:absolute; left:0;' />").children(".mCSB_container").css({width:k.children().outerWidth(),position:"relative"}).unwrap()}else{g.wrapInner("<div class='mCSB_container' style='position:relative; top:0;' />")}var o=g.children(".mCSB_container");if(c.support.touch){o.addClass("mCS_touch")}o.after("<div class='mCSB_scrollTools' style='position:absolute;'><div class='mCSB_draggerContainer'><div class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' style='position:relative;'></div></div><div class='mCSB_draggerRail'></div></div></div>");var l=g.children(".mCSB_scrollTools"),h=l.children(".mCSB_draggerContainer"),q=h.children(".mCSB_dragger");if(e.horizontalScroll){q.data("minDraggerWidth",q.width())}else{q.data("minDraggerHeight",q.height())}if(e.scrollButtons.enable){if(e.horizontalScroll){l.prepend("<a class='mCSB_buttonLeft' oncontextmenu='return false;'></a>").append("<a class='mCSB_buttonRight' oncontextmenu='return false;'></a>")}else{l.prepend("<a class='mCSB_buttonUp' oncontextmenu='return false;'></a>").append("<a class='mCSB_buttonDown' oncontextmenu='return false;'></a>")}}g.bind("scroll",function(){if(!m.is(".mCS_disabled")){g.scrollTop(0).scrollLeft(0)}});m.data({mCS_Init:true,mCustomScrollbarIndex:c(document).data("mCustomScrollbar-index"),horizontalScroll:e.horizontalScroll,scrollInertia:e.scrollInertia,scrollEasing:"mcsEaseOut",mouseWheel:e.mouseWheel,mouseWheelPixels:e.mouseWheelPixels,autoDraggerLength:e.autoDraggerLength,autoHideScrollbar:e.autoHideScrollbar,alwaysShowScrollbar:e.alwaysShowScrollbar,snapAmount:e.snapAmount,snapOffset:e.snapOffset,scrollButtons_enable:e.scrollButtons.enable,scrollButtons_scrollType:e.scrollButtons.scrollType,scrollButtons_scrollSpeed:e.scrollButtons.scrollSpeed,scrollButtons_scrollAmount:e.scrollButtons.scrollAmount,autoExpandHorizontalScroll:e.advanced.autoExpandHorizontalScroll,autoScrollOnFocus:e.advanced.autoScrollOnFocus,normalizeMouseWheelDelta:e.advanced.normalizeMouseWheelDelta,contentTouchScroll:e.contentTouchScroll,onScrollStart_Callback:e.callbacks.onScrollStart,onScroll_Callback:e.callbacks.onScroll,onTotalScroll_Callback:e.callbacks.onTotalScroll,onTotalScrollBack_Callback:e.callbacks.onTotalScrollBack,onTotalScroll_Offset:e.callbacks.onTotalScrollOffset,onTotalScrollBack_Offset:e.callbacks.onTotalScrollBackOffset,whileScrolling_Callback:e.callbacks.whileScrolling,bindEvent_scrollbar_drag:false,bindEvent_content_touch:false,bindEvent_scrollbar_click:false,bindEvent_mousewheel:false,bindEvent_buttonsContinuous_y:false,bindEvent_buttonsContinuous_x:false,bindEvent_buttonsPixels_y:false,bindEvent_buttonsPixels_x:false,bindEvent_focusin:false,bindEvent_autoHideScrollbar:false,mCSB_buttonScrollRight:false,mCSB_buttonScrollLeft:false,mCSB_buttonScrollDown:false,mCSB_buttonScrollUp:false});if(e.horizontalScroll){if(m.css("max-width")!=="none"){if(!e.advanced.updateOnContentResize){e.advanced.updateOnContentResize=true}}}else{if(m.css("max-height")!=="none"){var s=false,r=parseInt(m.css("max-height"));if(m.css("max-height").indexOf("%")>=0){s=r,r=m.parent().height()*s/100}m.css("overflow","hidden");g.css("max-height",r)}}m.mCustomScrollbar("update");if(e.advanced.updateOnBrowserResize){var i,j=c(window).width(),u=c(window).height();c(window).bind("resize."+m.data("mCustomScrollbarIndex"),function(){if(i){clearTimeout(i)}i=setTimeout(function(){if(!m.is(".mCS_disabled")&&!m.is(".mCS_destroyed")){var w=c(window).width(),v=c(window).height();if(j!==w||u!==v){if(m.css("max-height")!=="none"&&s){g.css("max-height",m.parent().height()*s/100)}m.mCustomScrollbar("update");j=w;u=v}}},150)})}if(e.advanced.updateOnContentResize){var p;if(e.horizontalScroll){var n=o.outerWidth()}else{var n=o.outerHeight()}p=setInterval(function(){if(e.horizontalScroll){if(e.advanced.autoExpandHorizontalScroll){o.css({position:"absolute",width:"auto"}).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({width:o.outerWidth(),position:"relative"}).unwrap()}var v=o.outerWidth()}else{var v=o.outerHeight()}if(v!=n){m.mCustomScrollbar("update");n=v}},300)}})},update:function(){var n=c(this),k=n.children(".mCustomScrollBox"),q=k.children(".mCSB_container");q.removeClass("mCS_no_scrollbar");n.removeClass("mCS_disabled mCS_destroyed");k.scrollTop(0).scrollLeft(0);var y=k.children(".mCSB_scrollTools"),o=y.children(".mCSB_draggerContainer"),m=o.children(".mCSB_dragger");if(n.data("horizontalScroll")){var A=y.children(".mCSB_buttonLeft"),t=y.children(".mCSB_buttonRight"),f=k.width();if(n.data("autoExpandHorizontalScroll")){q.css({position:"absolute",width:"auto"}).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({width:q.outerWidth(),position:"relative"}).unwrap()}var z=q.outerWidth()}else{var w=y.children(".mCSB_buttonUp"),g=y.children(".mCSB_buttonDown"),r=k.height(),i=q.outerHeight()}if(i>r&&!n.data("horizontalScroll")){y.css("display","block");var s=o.height();if(n.data("autoDraggerLength")){var u=Math.round(r/i*s),l=m.data("minDraggerHeight");if(u<=l){m.css({height:l})}else{if(u>=s-10){var p=s-10;m.css({height:p})}else{m.css({height:u})}}m.children(".mCSB_dragger_bar").css({"line-height":m.height()+"px"})}var B=m.height(),x=(i-r)/(s-B);n.data("scrollAmount",x).mCustomScrollbar("scrolling",k,q,o,m,w,g,A,t);var D=Math.abs(q.position().top);n.mCustomScrollbar("scrollTo",D,{scrollInertia:0,trigger:"internal"})}else{if(z>f&&n.data("horizontalScroll")){y.css("display","block");var h=o.width();if(n.data("autoDraggerLength")){var j=Math.round(f/z*h),C=m.data("minDraggerWidth");if(j<=C){m.css({width:C})}else{if(j>=h-10){var e=h-10;m.css({width:e})}else{m.css({width:j})}}}var v=m.width(),x=(z-f)/(h-v);n.data("scrollAmount",x).mCustomScrollbar("scrolling",k,q,o,m,w,g,A,t);var D=Math.abs(q.position().left);n.mCustomScrollbar("scrollTo",D,{scrollInertia:0,trigger:"internal"})}else{k.unbind("mousewheel focusin");if(n.data("horizontalScroll")){m.add(q).css("left",0)}else{m.add(q).css("top",0)}if(n.data("alwaysShowScrollbar")){if(!n.data("horizontalScroll")){m.css({height:o.height()})}else{if(n.data("horizontalScroll")){m.css({width:o.width()})}}}else{y.css("display","none");q.addClass("mCS_no_scrollbar")}n.data({bindEvent_mousewheel:false,bindEvent_focusin:false})}}},scrolling:function(i,q,n,k,A,f,D,w){var l=c(this);if(!l.data("bindEvent_scrollbar_drag")){var o,p,C,z,e;if(c.support.pointer){C="pointerdown";z="pointermove";e="pointerup"}else{if(c.support.msPointer){C="MSPointerDown";z="MSPointerMove";e="MSPointerUp"}}if(c.support.pointer||c.support.msPointer){k.bind(C,function(K){K.preventDefault();l.data({on_drag:true});k.addClass("mCSB_dragger_onDrag");var J=c(this),M=J.offset(),I=K.originalEvent.pageX-M.left,L=K.originalEvent.pageY-M.top;if(I<J.width()&&I>0&&L<J.height()&&L>0){o=L;p=I}});c(document).bind(z+"."+l.data("mCustomScrollbarIndex"),function(K){K.preventDefault();if(l.data("on_drag")){var J=k,M=J.offset(),I=K.originalEvent.pageX-M.left,L=K.originalEvent.pageY-M.top;G(o,p,L,I)}}).bind(e+"."+l.data("mCustomScrollbarIndex"),function(x){l.data({on_drag:false});k.removeClass("mCSB_dragger_onDrag")})}else{k.bind("mousedown touchstart",function(K){K.preventDefault();K.stopImmediatePropagation();var J=c(this),N=J.offset(),I,M;if(K.type==="touchstart"){var L=K.originalEvent.touches[0]||K.originalEvent.changedTouches[0];I=L.pageX-N.left;M=L.pageY-N.top}else{l.data({on_drag:true});k.addClass("mCSB_dragger_onDrag");I=K.pageX-N.left;M=K.pageY-N.top}if(I<J.width()&&I>0&&M<J.height()&&M>0){o=M;p=I}}).bind("touchmove",function(K){K.preventDefault();K.stopImmediatePropagation();var N=K.originalEvent.touches[0]||K.originalEvent.changedTouches[0],J=c(this),M=J.offset(),I=N.pageX-M.left,L=N.pageY-M.top;G(o,p,L,I)});c(document).bind("mousemove."+l.data("mCustomScrollbarIndex"),function(K){if(l.data("on_drag")){var J=k,M=J.offset(),I=K.pageX-M.left,L=K.pageY-M.top;G(o,p,L,I)}}).bind("mouseup."+l.data("mCustomScrollbarIndex"),function(x){l.data({on_drag:false});k.removeClass("mCSB_dragger_onDrag")})}l.data({bindEvent_scrollbar_drag:true})}function G(J,K,L,I){if(l.data("horizontalScroll")){l.mCustomScrollbar("scrollTo",(k.position().left-(K))+I,{moveDragger:true,trigger:"internal"})}else{l.mCustomScrollbar("scrollTo",(k.position().top-(J))+L,{moveDragger:true,trigger:"internal"})}}if(c.support.touch&&l.data("contentTouchScroll")){if(!l.data("bindEvent_content_touch")){var m,E,s,t,v,F,H;q.bind("touchstart",function(x){x.stopImmediatePropagation();m=x.originalEvent.touches[0]||x.originalEvent.changedTouches[0];E=c(this);s=E.offset();v=m.pageX-s.left;t=m.pageY-s.top;F=t;H=v});q.bind("touchmove",function(x){x.preventDefault();x.stopImmediatePropagation();m=x.originalEvent.touches[0]||x.originalEvent.changedTouches[0];E=c(this).parent();s=E.offset();v=m.pageX-s.left;t=m.pageY-s.top;if(l.data("horizontalScroll")){l.mCustomScrollbar("scrollTo",H-v,{trigger:"internal"})}else{l.mCustomScrollbar("scrollTo",F-t,{trigger:"internal"})}})}}if(!l.data("bindEvent_scrollbar_click")){n.bind("click",function(I){var x=(I.pageY-n.offset().top)*l.data("scrollAmount"),y=c(I.target);if(l.data("horizontalScroll")){x=(I.pageX-n.offset().left)*l.data("scrollAmount")}if(y.hasClass("mCSB_draggerContainer")||y.hasClass("mCSB_draggerRail")){l.mCustomScrollbar("scrollTo",x,{trigger:"internal",scrollEasing:"draggerRailEase"})}});l.data({bindEvent_scrollbar_click:true})}if(l.data("mouseWheel")){if(!l.data("bindEvent_mousewheel")){i.bind("mousewheel",function(K,M){var J,I=l.data("mouseWheelPixels"),x=Math.abs(q.position().top),L=k.position().top,y=n.height()-k.height();if(l.data("normalizeMouseWheelDelta")){if(M<0){M=-1}else{M=1}}if(I==="auto"){I=100+Math.round(l.data("scrollAmount")/2)}if(l.data("horizontalScroll")){L=k.position().left;y=n.width()-k.width();x=Math.abs(q.position().left)}if((M>0&&L!==0)||(M<0&&L!==y)){K.preventDefault();K.stopImmediatePropagation()}J=x-(M*I);l.mCustomScrollbar("scrollTo",J,{trigger:"internal"})});l.data({bindEvent_mousewheel:true})}}if(l.data("scrollButtons_enable")){if(l.data("scrollButtons_scrollType")==="pixels"){if(l.data("horizontalScroll")){w.add(D).unbind("mousedown touchstart MSPointerDown pointerdown mouseup MSPointerUp pointerup mouseout MSPointerOut pointerout touchend",j,h);l.data({bindEvent_buttonsContinuous_x:false});if(!l.data("bindEvent_buttonsPixels_x")){w.bind("click",function(x){x.preventDefault();r(Math.abs(q.position().left)+l.data("scrollButtons_scrollAmount"))});D.bind("click",function(x){x.preventDefault();r(Math.abs(q.position().left)-l.data("scrollButtons_scrollAmount"))});l.data({bindEvent_buttonsPixels_x:true})}}else{f.add(A).unbind("mousedown touchstart MSPointerDown pointerdown mouseup MSPointerUp pointerup mouseout MSPointerOut pointerout touchend",j,h);l.data({bindEvent_buttonsContinuous_y:false});if(!l.data("bindEvent_buttonsPixels_y")){f.bind("click",function(x){x.preventDefault();r(Math.abs(q.position().top)+l.data("scrollButtons_scrollAmount"))});A.bind("click",function(x){x.preventDefault();r(Math.abs(q.position().top)-l.data("scrollButtons_scrollAmount"))});l.data({bindEvent_buttonsPixels_y:true})}}function r(x){if(!k.data("preventAction")){k.data("preventAction",true);l.mCustomScrollbar("scrollTo",x,{trigger:"internal"})}}}else{if(l.data("horizontalScroll")){w.add(D).unbind("click");l.data({bindEvent_buttonsPixels_x:false});if(!l.data("bindEvent_buttonsContinuous_x")){w.bind("mousedown touchstart MSPointerDown pointerdown",function(y){y.preventDefault();var x=B();l.data({mCSB_buttonScrollRight:setInterval(function(){l.mCustomScrollbar("scrollTo",Math.abs(q.position().left)+x,{trigger:"internal",scrollEasing:"easeOutCirc"})},17)})});var j=function(x){x.preventDefault();clearInterval(l.data("mCSB_buttonScrollRight"))};w.bind("mouseup touchend MSPointerUp pointerup mouseout MSPointerOut pointerout",j);D.bind("mousedown touchstart MSPointerDown pointerdown",function(y){y.preventDefault();var x=B();l.data({mCSB_buttonScrollLeft:setInterval(function(){l.mCustomScrollbar("scrollTo",Math.abs(q.position().left)-x,{trigger:"internal",scrollEasing:"easeOutCirc"})},17)})});var h=function(x){x.preventDefault();clearInterval(l.data("mCSB_buttonScrollLeft"))};D.bind("mouseup touchend MSPointerUp pointerup mouseout MSPointerOut pointerout",h);l.data({bindEvent_buttonsContinuous_x:true})}}else{f.add(A).unbind("click");l.data({bindEvent_buttonsPixels_y:false});if(!l.data("bindEvent_buttonsContinuous_y")){f.bind("mousedown touchstart MSPointerDown pointerdown",function(y){y.preventDefault();var x=B();l.data({mCSB_buttonScrollDown:setInterval(function(){l.mCustomScrollbar("scrollTo",Math.abs(q.position().top)+x,{trigger:"internal",scrollEasing:"easeOutCirc"})},17)})});var u=function(x){x.preventDefault();clearInterval(l.data("mCSB_buttonScrollDown"))};f.bind("mouseup touchend MSPointerUp pointerup mouseout MSPointerOut pointerout",u);A.bind("mousedown touchstart MSPointerDown pointerdown",function(y){y.preventDefault();var x=B();l.data({mCSB_buttonScrollUp:setInterval(function(){l.mCustomScrollbar("scrollTo",Math.abs(q.position().top)-x,{trigger:"internal",scrollEasing:"easeOutCirc"})},17)})});var g=function(x){x.preventDefault();clearInterval(l.data("mCSB_buttonScrollUp"))};A.bind("mouseup touchend MSPointerUp pointerup mouseout MSPointerOut pointerout",g);l.data({bindEvent_buttonsContinuous_y:true})}}function B(){var x=l.data("scrollButtons_scrollSpeed");if(l.data("scrollButtons_scrollSpeed")==="auto"){x=Math.round((l.data("scrollInertia")+100)/40)}return x}}}if(l.data("autoScrollOnFocus")){if(!l.data("bindEvent_focusin")){i.bind("focusin",function(){i.scrollTop(0).scrollLeft(0);var x=c(document.activeElement);if(x.is("input,textarea,select,button,a[tabindex],area,object")){var J=q.position().top,y=x.position().top,I=i.height()-x.outerHeight();if(l.data("horizontalScroll")){J=q.position().left;y=x.position().left;I=i.width()-x.outerWidth()}if(J+y<0||J+y>I){l.mCustomScrollbar("scrollTo",y,{trigger:"internal"})}}});l.data({bindEvent_focusin:true})}}if(l.data("autoHideScrollbar")&&!l.data("alwaysShowScrollbar")){if(!l.data("bindEvent_autoHideScrollbar")){i.bind("mouseenter",function(x){i.addClass("mCS-mouse-over");d.showScrollbar.call(i.children(".mCSB_scrollTools"))}).bind("mouseleave touchend",function(x){i.removeClass("mCS-mouse-over");if(x.type==="mouseleave"){d.hideScrollbar.call(i.children(".mCSB_scrollTools"))}});l.data({bindEvent_autoHideScrollbar:true})}}},scrollTo:function(e,f){var i=c(this),o={moveDragger:false,trigger:"external",callbacks:true,scrollInertia:i.data("scrollInertia"),scrollEasing:i.data("scrollEasing")},f=c.extend(o,f),p,g=i.children(".mCustomScrollBox"),k=g.children(".mCSB_container"),r=g.children(".mCSB_scrollTools"),j=r.children(".mCSB_draggerContainer"),h=j.children(".mCSB_dragger"),t=draggerSpeed=f.scrollInertia,q,s,m,l;if(!k.hasClass("mCS_no_scrollbar")){i.data({mCS_trigger:f.trigger});if(i.data("mCS_Init")){f.callbacks=false}if(e||e===0){if(typeof(e)==="number"){if(f.moveDragger){p=e;if(i.data("horizontalScroll")){e=h.position().left*i.data("scrollAmount")}else{e=h.position().top*i.data("scrollAmount")}draggerSpeed=0}else{p=e/i.data("scrollAmount")}}else{if(typeof(e)==="string"){var v;if(e==="top"){v=0}else{if(e==="bottom"&&!i.data("horizontalScroll")){v=k.outerHeight()-g.height()}else{if(e==="left"){v=0}else{if(e==="right"&&i.data("horizontalScroll")){v=k.outerWidth()-g.width()}else{if(e==="first"){v=i.find(".mCSB_container").find(":first")}else{if(e==="last"){v=i.find(".mCSB_container").find(":last")}else{v=i.find(e)}}}}}}if(v.length===1){if(i.data("horizontalScroll")){e=v.position().left}else{e=v.position().top}p=e/i.data("scrollAmount")}else{p=e=v}}}if(i.data("horizontalScroll")){if(i.data("onTotalScrollBack_Offset")){s=-i.data("onTotalScrollBack_Offset")}if(i.data("onTotalScroll_Offset")){l=g.width()-k.outerWidth()+i.data("onTotalScroll_Offset")}if(p<0){p=e=0;clearInterval(i.data("mCSB_buttonScrollLeft"));if(!s){q=true}}else{if(p>=j.width()-h.width()){p=j.width()-h.width();e=g.width()-k.outerWidth();clearInterval(i.data("mCSB_buttonScrollRight"));if(!l){m=true}}else{e=-e}}var n=i.data("snapAmount");if(n){e=Math.round(e/n)*n-i.data("snapOffset")}d.mTweenAxis.call(this,h[0],"left",Math.round(p),draggerSpeed,f.scrollEasing);d.mTweenAxis.call(this,k[0],"left",Math.round(e),t,f.scrollEasing,{onStart:function(){if(f.callbacks&&!i.data("mCS_tweenRunning")){u("onScrollStart")}if(i.data("autoHideScrollbar")&&!i.data("alwaysShowScrollbar")){d.showScrollbar.call(r)}},onUpdate:function(){if(f.callbacks){u("whileScrolling")}},onComplete:function(){if(f.callbacks){u("onScroll");if(q||(s&&k.position().left>=s)){u("onTotalScrollBack")}if(m||(l&&k.position().left<=l)){u("onTotalScroll")}}h.data("preventAction",false);i.data("mCS_tweenRunning",false);if(i.data("autoHideScrollbar")&&!i.data("alwaysShowScrollbar")){if(!g.hasClass("mCS-mouse-over")){d.hideScrollbar.call(r)}}}})}else{if(i.data("onTotalScrollBack_Offset")){s=-i.data("onTotalScrollBack_Offset")}if(i.data("onTotalScroll_Offset")){l=g.height()-k.outerHeight()+i.data("onTotalScroll_Offset")}if(p<0){p=e=0;clearInterval(i.data("mCSB_buttonScrollUp"));if(!s){q=true}}else{if(p>=j.height()-h.height()){p=j.height()-h.height();e=g.height()-k.outerHeight();clearInterval(i.data("mCSB_buttonScrollDown"));if(!l){m=true}}else{e=-e}}var n=i.data("snapAmount");if(n){e=Math.round(e/n)*n-i.data("snapOffset")}d.mTweenAxis.call(this,h[0],"top",Math.round(p),draggerSpeed,f.scrollEasing);d.mTweenAxis.call(this,k[0],"top",Math.round(e),t,f.scrollEasing,{onStart:function(){if(f.callbacks&&!i.data("mCS_tweenRunning")){u("onScrollStart")}if(i.data("autoHideScrollbar")&&!i.data("alwaysShowScrollbar")){d.showScrollbar.call(r)}},onUpdate:function(){if(f.callbacks){u("whileScrolling")}},onComplete:function(){if(f.callbacks){u("onScroll");if(q||(s&&k.position().top>=s)){u("onTotalScrollBack")}if(m||(l&&k.position().top<=l)){u("onTotalScroll")}}h.data("preventAction",false);i.data("mCS_tweenRunning",false);if(i.data("autoHideScrollbar")&&!i.data("alwaysShowScrollbar")){if(!g.hasClass("mCS-mouse-over")){d.hideScrollbar.call(r)}}}})}if(i.data("mCS_Init")){i.data({mCS_Init:false})}}}function u(w){if(i.data("mCustomScrollbarIndex")){this.mcs={top:k.position().top,left:k.position().left,draggerTop:h.position().top,draggerLeft:h.position().left,topPct:Math.round((100*Math.abs(k.position().top))/Math.abs(k.outerHeight()-g.height())),leftPct:Math.round((100*Math.abs(k.position().left))/Math.abs(k.outerWidth()-g.width()))};switch(w){case"onScrollStart":i.data("mCS_tweenRunning",true).data("onScrollStart_Callback").call(i,this.mcs);break;case"whileScrolling":i.data("whileScrolling_Callback").call(i,this.mcs);break;case"onScroll":i.data("onScroll_Callback").call(i,this.mcs);break;case"onTotalScrollBack":i.data("onTotalScrollBack_Callback").call(i,this.mcs);break;case"onTotalScroll":i.data("onTotalScroll_Callback").call(i,this.mcs);break}}}},stop:function(){var g=c(this),e=g.children().children(".mCSB_container"),f=g.children().children().children().children(".mCSB_dragger");d.mTweenAxisStop.call(this,e[0]);d.mTweenAxisStop.call(this,f[0])},disable:function(e){var j=c(this),f=j.children(".mCustomScrollBox"),h=f.children(".mCSB_container"),g=f.children(".mCSB_scrollTools"),i=g.children().children(".mCSB_dragger");f.unbind("mousewheel focusin mouseenter mouseleave touchend");h.unbind("touchstart touchmove");if(e){if(j.data("horizontalScroll")){i.add(h).css("left",0)}else{i.add(h).css("top",0)}}g.css("display","none");h.addClass("mCS_no_scrollbar");j.data({bindEvent_mousewheel:false,bindEvent_focusin:false,bindEvent_content_touch:false,bindEvent_autoHideScrollbar:false}).addClass("mCS_disabled")},destroy:function(){var e=c(this);e.removeClass("mCustomScrollbar _mCS_"+e.data("mCustomScrollbarIndex")).addClass("mCS_destroyed").children().children(".mCSB_container").unwrap().children().unwrap().siblings(".mCSB_scrollTools").remove();c(document).unbind("mousemove."+e.data("mCustomScrollbarIndex")+" mouseup."+e.data("mCustomScrollbarIndex")+" MSPointerMove."+e.data("mCustomScrollbarIndex")+" MSPointerUp."+e.data("mCustomScrollbarIndex"));c(window).unbind("resize."+e.data("mCustomScrollbarIndex"))}},d={showScrollbar:function(){this.stop().animate({opacity:1},"fast")},hideScrollbar:function(){this.stop().animate({opacity:0},"fast")},mTweenAxis:function(g,i,h,f,o,y){var y=y||{},v=y.onStart||function(){},p=y.onUpdate||function(){},w=y.onComplete||function(){};var n=t(),l,j=0,r=g.offsetTop,s=g.style;if(i==="left"){r=g.offsetLeft}var m=h-r;q();e();function t(){if(window.performance&&window.performance.now){return window.performance.now()}else{if(window.performance&&window.performance.webkitNow){return window.performance.webkitNow()}else{if(Date.now){return Date.now()}else{return new Date().getTime()}}}}function x(){if(!j){v.call()}j=t()-n;u();if(j>=g._time){g._time=(j>g._time)?j+l-(j-g._time):j+l-1;if(g._time<j+1){g._time=j+1}}if(g._time<f){g._id=_request(x)}else{w.call()}}function u(){if(f>0){g.currVal=k(g._time,r,m,f,o);s[i]=Math.round(g.currVal)+"px"}else{s[i]=h+"px"}p.call()}function e(){l=1000/60;g._time=j+l;_request=(!window.requestAnimationFrame)?function(z){u();return setTimeout(z,0.01)}:window.requestAnimationFrame;g._id=_request(x)}function q(){if(g._id==null){return}if(!window.requestAnimationFrame){clearTimeout(g._id)}else{window.cancelAnimationFrame(g._id)}g._id=null}function k(B,A,F,E,C){switch(C){case"linear":return F*B/E+A;break;case"easeOutQuad":B/=E;return -F*B*(B-2)+A;break;case"easeInOutQuad":B/=E/2;if(B<1){return F/2*B*B+A}B--;return -F/2*(B*(B-2)-1)+A;break;case"easeOutCubic":B/=E;B--;return F*(B*B*B+1)+A;break;case"easeOutQuart":B/=E;B--;return -F*(B*B*B*B-1)+A;break;case"easeOutQuint":B/=E;B--;return F*(B*B*B*B*B+1)+A;break;case"easeOutCirc":B/=E;B--;return F*Math.sqrt(1-B*B)+A;break;case"easeOutSine":return F*Math.sin(B/E*(Math.PI/2))+A;break;case"easeOutExpo":return F*(-Math.pow(2,-10*B/E)+1)+A;break;case"mcsEaseOut":var D=(B/=E)*B,z=D*B;return A+F*(0.499999999999997*z*D+-2.5*D*D+5.5*z+-6.5*D+4*B);break;case"draggerRailEase":B/=E/2;if(B<1){return F/2*B*B*B+A}B-=2;return F/2*(B*B*B+2)+A;break}}},mTweenAxisStop:function(e){if(e._id==null){return}if(!window.requestAnimationFrame){clearTimeout(e._id)}else{window.cancelAnimationFrame(e._id)}e._id=null},rafPolyfill:function(){var f=["ms","moz","webkit","o"],e=f.length;while(--e>-1&&!window.requestAnimationFrame){window.requestAnimationFrame=window[f[e]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[f[e]+"CancelAnimationFrame"]||window[f[e]+"CancelRequestAnimationFrame"]}}};d.rafPolyfill.call();c.support.touch=!!("ontouchstart" in window);c.support.pointer=window.navigator.pointerEnabled;c.support.msPointer=window.navigator.msPointerEnabled;var a=("https:"==document.location.protocol)?"https:":"http:";c.event.special.mousewheel||document.write('<script src="'+a+'//cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.0.6/jquery.mousewheel.min.js"><\/script>');c.fn.mCustomScrollbar=function(e){if(b[e]){return b[e].apply(this,Array.prototype.slice.call(arguments,1))}else{if(typeof e==="object"||!e){return b.init.apply(this,arguments)}else{c.error("Method "+e+" does not exist")}}}})(jQuery);/*! Socket.IO.min.js build:0.9.16, production. Copyright(c) 2011 LearnBoost <dev@learnboost.com> MIT Licensed */
var io="undefined"==typeof module?{}:module.exports;(function(){(function(a,b){var c=a;c.version="0.9.16",c.protocol=1,c.transports=[],c.j=[],c.sockets={},c.connect=function(a,d){var e=c.util.parseUri(a),f,g;b&&b.location&&(e.protocol=e.protocol||b.location.protocol.slice(0,-1),e.host=e.host||(b.document?b.document.domain:b.location.hostname),e.port=e.port||b.location.port),f=c.util.uniqueUri(e);var h={host:e.host,secure:"https"==e.protocol,port:e.port||("https"==e.protocol?443:80),query:e.query||""};c.util.merge(h,d);if(h["force new connection"]||!c.sockets[f])g=new c.Socket(h);return!h["force new connection"]&&g&&(c.sockets[f]=g),g=g||c.sockets[f],g.of(e.path.length>1?e.path:"")}})("object"==typeof module?module.exports:this.io={},this),function(a,b){var c=a.util={},d=/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,e=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];c.parseUri=function(a){var b=d.exec(a||""),c={},f=14;while(f--)c[e[f]]=b[f]||"";return c},c.uniqueUri=function(a){var c=a.protocol,d=a.host,e=a.port;return"document"in b?(d=d||document.domain,e=e||(c=="https"&&document.location.protocol!=="https:"?443:document.location.port)):(d=d||"localhost",!e&&c=="https"&&(e=443)),(c||"http")+"://"+d+":"+(e||80)},c.query=function(a,b){var d=c.chunkQuery(a||""),e=[];c.merge(d,c.chunkQuery(b||""));for(var f in d)d.hasOwnProperty(f)&&e.push(f+"="+d[f]);return e.length?"?"+e.join("&"):""},c.chunkQuery=function(a){var b={},c=a.split("&"),d=0,e=c.length,f;for(;d<e;++d)f=c[d].split("="),f[0]&&(b[f[0]]=f[1]);return b};var f=!1;c.load=function(a){if("document"in b&&document.readyState==="complete"||f)return a();c.on(b,"load",a,!1)},c.on=function(a,b,c,d){a.attachEvent?a.attachEvent("on"+b,c):a.addEventListener&&a.addEventListener(b,c,d)},c.request=function(a){if(a&&"undefined"!=typeof XDomainRequest&&!c.ua.hasCORS)return new XDomainRequest;if("undefined"!=typeof XMLHttpRequest&&(!a||c.ua.hasCORS))return new XMLHttpRequest;if(!a)try{return new(window[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")}catch(b){}return null},"undefined"!=typeof window&&c.load(function(){f=!0}),c.defer=function(a){if(!c.ua.webkit||"undefined"!=typeof importScripts)return a();c.load(function(){setTimeout(a,100)})},c.merge=function(b,d,e,f){var g=f||[],h=typeof e=="undefined"?2:e,i;for(i in d)d.hasOwnProperty(i)&&c.indexOf(g,i)<0&&(typeof b[i]!="object"||!h?(b[i]=d[i],g.push(d[i])):c.merge(b[i],d[i],h-1,g));return b},c.mixin=function(a,b){c.merge(a.prototype,b.prototype)},c.inherit=function(a,b){function c(){}c.prototype=b.prototype,a.prototype=new c},c.isArray=Array.isArray||function(a){return Object.prototype.toString.call(a)==="[object Array]"},c.intersect=function(a,b){var d=[],e=a.length>b.length?a:b,f=a.length>b.length?b:a;for(var g=0,h=f.length;g<h;g++)~c.indexOf(e,f[g])&&d.push(f[g]);return d},c.indexOf=function(a,b,c){for(var d=a.length,c=c<0?c+d<0?0:c+d:c||0;c<d&&a[c]!==b;c++);return d<=c?-1:c},c.toArray=function(a){var b=[];for(var c=0,d=a.length;c<d;c++)b.push(a[c]);return b},c.ua={},c.ua.hasCORS="undefined"!=typeof XMLHttpRequest&&function(){try{var a=new XMLHttpRequest}catch(b){return!1}return a.withCredentials!=undefined}(),c.ua.webkit="undefined"!=typeof navigator&&/webkit/i.test(navigator.userAgent),c.ua.iDevice="undefined"!=typeof navigator&&/iPad|iPhone|iPod/i.test(navigator.userAgent)}("undefined"!=typeof io?io:module.exports,this),function(a,b){function c(){}a.EventEmitter=c,c.prototype.on=function(a,c){return this.$events||(this.$events={}),this.$events[a]?b.util.isArray(this.$events[a])?this.$events[a].push(c):this.$events[a]=[this.$events[a],c]:this.$events[a]=c,this},c.prototype.addListener=c.prototype.on,c.prototype.once=function(a,b){function d(){c.removeListener(a,d),b.apply(this,arguments)}var c=this;return d.listener=b,this.on(a,d),this},c.prototype.removeListener=function(a,c){if(this.$events&&this.$events[a]){var d=this.$events[a];if(b.util.isArray(d)){var e=-1;for(var f=0,g=d.length;f<g;f++)if(d[f]===c||d[f].listener&&d[f].listener===c){e=f;break}if(e<0)return this;d.splice(e,1),d.length||delete this.$events[a]}else(d===c||d.listener&&d.listener===c)&&delete this.$events[a]}return this},c.prototype.removeAllListeners=function(a){return a===undefined?(this.$events={},this):(this.$events&&this.$events[a]&&(this.$events[a]=null),this)},c.prototype.listeners=function(a){return this.$events||(this.$events={}),this.$events[a]||(this.$events[a]=[]),b.util.isArray(this.$events[a])||(this.$events[a]=[this.$events[a]]),this.$events[a]},c.prototype.emit=function(a){if(!this.$events)return!1;var c=this.$events[a];if(!c)return!1;var d=Array.prototype.slice.call(arguments,1);if("function"==typeof c)c.apply(this,d);else{if(!b.util.isArray(c))return!1;var e=c.slice();for(var f=0,g=e.length;f<g;f++)e[f].apply(this,d)}return!0}}("undefined"!=typeof io?io:module.exports,"undefined"!=typeof io?io:module.parent.exports),function(exports,nativeJSON){function f(a){return a<10?"0"+a:a}function date(a,b){return isFinite(a.valueOf())?a.getUTCFullYear()+"-"+f(a.getUTCMonth()+1)+"-"+f(a.getUTCDate())+"T"+f(a.getUTCHours())+":"+f(a.getUTCMinutes())+":"+f(a.getUTCSeconds())+"Z":null}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i instanceof Date&&(i=date(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";return e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g,e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)typeof rep[c]=="string"&&(d=rep[c],e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));return e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g,e}}"use strict";if(nativeJSON&&nativeJSON.parse)return exports.JSON={parse:nativeJSON.parse,stringify:nativeJSON.stringify};var JSON=exports.JSON={},cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")},JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")}}("undefined"!=typeof io?io:module.exports,typeof JSON!="undefined"?JSON:undefined),function(a,b){var c=a.parser={},d=c.packets=["disconnect","connect","heartbeat","message","json","event","ack","error","noop"],e=c.reasons=["transport not supported","client not handshaken","unauthorized"],f=c.advice=["reconnect"],g=b.JSON,h=b.util.indexOf;c.encodePacket=function(a){var b=h(d,a.type),c=a.id||"",i=a.endpoint||"",j=a.ack,k=null;switch(a.type){case"error":var l=a.reason?h(e,a.reason):"",m=a.advice?h(f,a.advice):"";if(l!==""||m!=="")k=l+(m!==""?"+"+m:"");break;case"message":a.data!==""&&(k=a.data);break;case"event":var n={name:a.name};a.args&&a.args.length&&(n.args=a.args),k=g.stringify(n);break;case"json":k=g.stringify(a.data);break;case"connect":a.qs&&(k=a.qs);break;case"ack":k=a.ackId+(a.args&&a.args.length?"+"+g.stringify(a.args):"")}var o=[b,c+(j=="data"?"+":""),i];return k!==null&&k!==undefined&&o.push(k),o.join(":")},c.encodePayload=function(a){var b="";if(a.length==1)return a[0];for(var c=0,d=a.length;c<d;c++){var e=a[c];b+="\ufffd"+e.length+"\ufffd"+a[c]}return b};var i=/([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;c.decodePacket=function(a){var b=a.match(i);if(!b)return{};var c=b[2]||"",a=b[5]||"",h={type:d[b[1]],endpoint:b[4]||""};c&&(h.id=c,b[3]?h.ack="data":h.ack=!0);switch(h.type){case"error":var b=a.split("+");h.reason=e[b[0]]||"",h.advice=f[b[1]]||"";break;case"message":h.data=a||"";break;case"event":try{var j=g.parse(a);h.name=j.name,h.args=j.args}catch(k){}h.args=h.args||[];break;case"json":try{h.data=g.parse(a)}catch(k){}break;case"connect":h.qs=a||"";break;case"ack":var b=a.match(/^([0-9]+)(\+)?(.*)/);if(b){h.ackId=b[1],h.args=[];if(b[3])try{h.args=b[3]?g.parse(b[3]):[]}catch(k){}}break;case"disconnect":case"heartbeat":}return h},c.decodePayload=function(a){if(a.charAt(0)=="\ufffd"){var b=[];for(var d=1,e="";d<a.length;d++)a.charAt(d)=="\ufffd"?(b.push(c.decodePacket(a.substr(d+1).substr(0,e))),d+=Number(e)+1,e=""):e+=a.charAt(d);return b}return[c.decodePacket(a)]}}("undefined"!=typeof io?io:module.exports,"undefined"!=typeof io?io:module.parent.exports),function(a,b){function c(a,b){this.socket=a,this.sessid=b}a.Transport=c,b.util.mixin(c,b.EventEmitter),c.prototype.heartbeats=function(){return!0},c.prototype.onData=function(a){this.clearCloseTimeout(),(this.socket.connected||this.socket.connecting||this.socket.reconnecting)&&this.setCloseTimeout();if(a!==""){var c=b.parser.decodePayload(a);if(c&&c.length)for(var d=0,e=c.length;d<e;d++)this.onPacket(c[d])}return this},c.prototype.onPacket=function(a){return this.socket.setHeartbeatTimeout(),a.type=="heartbeat"?this.onHeartbeat():(a.type=="connect"&&a.endpoint==""&&this.onConnect(),a.type=="error"&&a.advice=="reconnect"&&(this.isOpen=!1),this.socket.onPacket(a),this)},c.prototype.setCloseTimeout=function(){if(!this.closeTimeout){var a=this;this.closeTimeout=setTimeout(function(){a.onDisconnect()},this.socket.closeTimeout)}},c.prototype.onDisconnect=function(){return this.isOpen&&this.close(),this.clearTimeouts(),this.socket.onDisconnect(),this},c.prototype.onConnect=function(){return this.socket.onConnect(),this},c.prototype.clearCloseTimeout=function(){this.closeTimeout&&(clearTimeout(this.closeTimeout),this.closeTimeout=null)},c.prototype.clearTimeouts=function(){this.clearCloseTimeout(),this.reopenTimeout&&clearTimeout(this.reopenTimeout)},c.prototype.packet=function(a){this.send(b.parser.encodePacket(a))},c.prototype.onHeartbeat=function(a){this.packet({type:"heartbeat"})},c.prototype.onOpen=function(){this.isOpen=!0,this.clearCloseTimeout(),this.socket.onOpen()},c.prototype.onClose=function(){var a=this;this.isOpen=!1,this.socket.onClose(),this.onDisconnect()},c.prototype.prepareUrl=function(){var a=this.socket.options;return this.scheme()+"://"+a.host+":"+a.port+"/"+a.resource+"/"+b.protocol+"/"+this.name+"/"+this.sessid},c.prototype.ready=function(a,b){b.call(this)}}("undefined"!=typeof io?io:module.exports,"undefined"!=typeof io?io:module.parent.exports),function(a,b,c){function d(a){this.options={port:80,secure:!1,document:"document"in c?document:!1,resource:"socket.io",transports:b.transports,"connect timeout":1e4,"try multiple transports":!0,reconnect:!0,"reconnection delay":500,"reconnection limit":Infinity,"reopen delay":3e3,"max reconnection attempts":10,"sync disconnect on unload":!1,"auto connect":!0,"flash policy port":10843,manualFlush:!1},b.util.merge(this.options,a),this.connected=!1,this.open=!1,this.connecting=!1,this.reconnecting=!1,this.namespaces={},this.buffer=[],this.doBuffer=!1;if(this.options["sync disconnect on unload"]&&(!this.isXDomain()||b.util.ua.hasCORS)){var d=this;b.util.on(c,"beforeunload",function(){d.disconnectSync()},!1)}this.options["auto connect"]&&this.connect()}function e(){}a.Socket=d,b.util.mixin(d,b.EventEmitter),d.prototype.of=function(a){return this.namespaces[a]||(this.namespaces[a]=new b.SocketNamespace(this,a),a!==""&&this.namespaces[a].packet({type:"connect"})),this.namespaces[a]},d.prototype.publish=function(){this.emit.apply(this,arguments);var a;for(var b in this.namespaces)this.namespaces.hasOwnProperty(b)&&(a=this.of(b),a.$emit.apply(a,arguments))},d.prototype.handshake=function(a){function f(b){b instanceof Error?(c.connecting=!1,c.onError(b.message)):a.apply(null,b.split(":"))}var c=this,d=this.options,g=["http"+(d.secure?"s":"")+":/",d.host+":"+d.port,d.resource,b.protocol,b.util.query(this.options.query,"t="+ +(new Date))].join("/");if(this.isXDomain()&&!b.util.ua.hasCORS){var h=document.getElementsByTagName("script")[0],i=document.createElement("script");i.src=g+"&jsonp="+b.j.length,h.parentNode.insertBefore(i,h),b.j.push(function(a){f(a),i.parentNode.removeChild(i)})}else{var j=b.util.request();j.open("GET",g,!0),this.isXDomain()&&(j.withCredentials=!0),j.onreadystatechange=function(){j.readyState==4&&(j.onreadystatechange=e,j.status==200?f(j.responseText):j.status==403?c.onError(j.responseText):(c.connecting=!1,!c.reconnecting&&c.onError(j.responseText)))},j.send(null)}},d.prototype.getTransport=function(a){var c=a||this.transports,d;for(var e=0,f;f=c[e];e++)if(b.Transport[f]&&b.Transport[f].check(this)&&(!this.isXDomain()||b.Transport[f].xdomainCheck(this)))return new b.Transport[f](this,this.sessionid);return null},d.prototype.connect=function(a){if(this.connecting)return this;var c=this;return c.connecting=!0,this.handshake(function(d,e,f,g){function h(a){c.transport&&c.transport.clearTimeouts(),c.transport=c.getTransport(a);if(!c.transport)return c.publish("connect_failed");c.transport.ready(c,function(){c.connecting=!0,c.publish("connecting",c.transport.name),c.transport.open(),c.options["connect timeout"]&&(c.connectTimeoutTimer=setTimeout(function(){if(!c.connected){c.connecting=!1;if(c.options["try multiple transports"]){var a=c.transports;while(a.length>0&&a.splice(0,1)[0]!=c.transport.name);a.length?h(a):c.publish("connect_failed")}}},c.options["connect timeout"]))})}c.sessionid=d,c.closeTimeout=f*1e3,c.heartbeatTimeout=e*1e3,c.transports||(c.transports=c.origTransports=g?b.util.intersect(g.split(","),c.options.transports):c.options.transports),c.setHeartbeatTimeout(),h(c.transports),c.once("connect",function(){clearTimeout(c.connectTimeoutTimer),a&&typeof a=="function"&&a()})}),this},d.prototype.setHeartbeatTimeout=function(){clearTimeout(this.heartbeatTimeoutTimer);if(this.transport&&!this.transport.heartbeats())return;var a=this;this.heartbeatTimeoutTimer=setTimeout(function(){a.transport.onClose()},this.heartbeatTimeout)},d.prototype.packet=function(a){return this.connected&&!this.doBuffer?this.transport.packet(a):this.buffer.push(a),this},d.prototype.setBuffer=function(a){this.doBuffer=a,!a&&this.connected&&this.buffer.length&&(this.options.manualFlush||this.flushBuffer())},d.prototype.flushBuffer=function(){this.transport.payload(this.buffer),this.buffer=[]},d.prototype.disconnect=function(){if(this.connected||this.connecting)this.open&&this.of("").packet({type:"disconnect"}),this.onDisconnect("booted");return this},d.prototype.disconnectSync=function(){var a=b.util.request(),c=["http"+(this.options.secure?"s":"")+":/",this.options.host+":"+this.options.port,this.options.resource,b.protocol,"",this.sessionid].join("/")+"/?disconnect=1";a.open("GET",c,!1),a.send(null),this.onDisconnect("booted")},d.prototype.isXDomain=function(){var a=c.location.port||("https:"==c.location.protocol?443:80);return this.options.host!==c.location.hostname||this.options.port!=a},d.prototype.onConnect=function(){this.connected||(this.connected=!0,this.connecting=!1,this.doBuffer||this.setBuffer(!1),this.emit("connect"))},d.prototype.onOpen=function(){this.open=!0},d.prototype.onClose=function(){this.open=!1,clearTimeout(this.heartbeatTimeoutTimer)},d.prototype.onPacket=function(a){this.of(a.endpoint).onPacket(a)},d.prototype.onError=function(a){a&&a.advice&&a.advice==="reconnect"&&(this.connected||this.connecting)&&(this.disconnect(),this.options.reconnect&&this.reconnect()),this.publish("error",a&&a.reason?a.reason:a)},d.prototype.onDisconnect=function(a){var b=this.connected,c=this.connecting;this.connected=!1,this.connecting=!1,this.open=!1;if(b||c)this.transport.close(),this.transport.clearTimeouts(),b&&(this.publish("disconnect",a),"booted"!=a&&this.options.reconnect&&!this.reconnecting&&this.reconnect())},d.prototype.reconnect=function(){function e(){if(a.connected){for(var b in a.namespaces)a.namespaces.hasOwnProperty(b)&&""!==b&&a.namespaces[b].packet({type:"connect"});a.publish("reconnect",a.transport.name,a.reconnectionAttempts)}clearTimeout(a.reconnectionTimer),a.removeListener("connect_failed",f),a.removeListener("connect",f),a.reconnecting=!1,delete a.reconnectionAttempts,delete a.reconnectionDelay,delete a.reconnectionTimer,delete a.redoTransports,a.options["try multiple transports"]=c}function f(){if(!a.reconnecting)return;if(a.connected)return e();if(a.connecting&&a.reconnecting)return a.reconnectionTimer=setTimeout(f,1e3);a.reconnectionAttempts++>=b?a.redoTransports?(a.publish("reconnect_failed"),e()):(a.on("connect_failed",f),a.options["try multiple transports"]=!0,a.transports=a.origTransports,a.transport=a.getTransport(),a.redoTransports=!0,a.connect()):(a.reconnectionDelay<d&&(a.reconnectionDelay*=2),a.connect(),a.publish("reconnecting",a.reconnectionDelay,a.reconnectionAttempts),a.reconnectionTimer=setTimeout(f,a.reconnectionDelay))}this.reconnecting=!0,this.reconnectionAttempts=0,this.reconnectionDelay=this.options["reconnection delay"];var a=this,b=this.options["max reconnection attempts"],c=this.options["try multiple transports"],d=this.options["reconnection limit"];this.options["try multiple transports"]=!1,this.reconnectionTimer=setTimeout(f,this.reconnectionDelay),this.on("connect",f)}}("undefined"!=typeof io?io:module.exports,"undefined"!=typeof io?io:module.parent.exports,this),function(a,b){function c(a,b){this.socket=a,this.name=b||"",this.flags={},this.json=new d(this,"json"),this.ackPackets=0,this.acks={}}function d(a,b){this.namespace=a,this.name=b}a.SocketNamespace=c,b.util.mixin(c,b.EventEmitter),c.prototype.$emit=b.EventEmitter.prototype.emit,c.prototype.of=function(){return this.socket.of.apply(this.socket,arguments)},c.prototype.packet=function(a){return a.endpoint=this.name,this.socket.packet(a),this.flags={},this},c.prototype.send=function(a,b){var c={type:this.flags.json?"json":"message",data:a};return"function"==typeof b&&(c.id=++this.ackPackets,c.ack=!0,this.acks[c.id]=b),this.packet(c)},c.prototype.emit=function(a){var b=Array.prototype.slice.call(arguments,1),c=b[b.length-1],d={type:"event",name:a};return"function"==typeof c&&(d.id=++this.ackPackets,d.ack="data",this.acks[d.id]=c,b=b.slice(0,b.length-1)),d.args=b,this.packet(d)},c.prototype.disconnect=function(){return this.name===""?this.socket.disconnect():(this.packet({type:"disconnect"}),this.$emit("disconnect")),this},c.prototype.onPacket=function(a){function d(){c.packet({type:"ack",args:b.util.toArray(arguments),ackId:a.id})}var c=this;switch(a.type){case"connect":this.$emit("connect");break;case"disconnect":this.name===""?this.socket.onDisconnect(a.reason||"booted"):this.$emit("disconnect",a.reason);break;case"message":case"json":var e=["message",a.data];a.ack=="data"?e.push(d):a.ack&&this.packet({type:"ack",ackId:a.id}),this.$emit.apply(this,e);break;case"event":var e=[a.name].concat(a.args);a.ack=="data"&&e.push(d),this.$emit.apply(this,e);break;case"ack":this.acks[a.ackId]&&(this.acks[a.ackId].apply(this,a.args),delete this.acks[a.ackId]);break;case"error":a.advice?this.socket.onError(a):a.reason=="unauthorized"?this.$emit("connect_failed",a.reason):this.$emit("error",a.reason)}},d.prototype.send=function(){this.namespace.flags[this.name]=!0,this.namespace.send.apply(this.namespace,arguments)},d.prototype.emit=function(){this.namespace.flags[this.name]=!0,this.namespace.emit.apply(this.namespace,arguments)}}("undefined"!=typeof io?io:module.exports,"undefined"!=typeof io?io:module.parent.exports),function(a,b,c){function d(a){b.Transport.apply(this,arguments)}a.websocket=d,b.util.inherit(d,b.Transport),d.prototype.name="websocket",d.prototype.open=function(){var a=b.util.query(this.socket.options.query),d=this,e;return e||(e=c.MozWebSocket||c.WebSocket),this.websocket=new e(this.prepareUrl()+a),this.websocket.onopen=function(){d.onOpen(),d.socket.setBuffer(!1)},this.websocket.onmessage=function(a){d.onData(a.data)},this.websocket.onclose=function(){d.onClose(),d.socket.setBuffer(!0)},this.websocket.onerror=function(a){d.onError(a)},this},b.util.ua.iDevice?d.prototype.send=function(a){var b=this;return setTimeout(function(){b.websocket.send(a)},0),this}:d.prototype.send=function(a){return this.websocket.send(a),this},d.prototype.payload=function(a){for(var b=0,c=a.length;b<c;b++)this.packet(a[b]);return this},d.prototype.close=function(){return this.websocket.close(),this},d.prototype.onError=function(a){this.socket.onError(a)},d.prototype.scheme=function(){return this.socket.options.secure?"wss":"ws"},d.check=function(){return"WebSocket"in c&&!("__addTask"in WebSocket)||"MozWebSocket"in c},d.xdomainCheck=function(){return!0},b.transports.push("websocket")}("undefined"!=typeof io?io.Transport:module.exports,"undefined"!=typeof io?io:module.parent.exports,this),function(a,b){function c(){b.Transport.websocket.apply(this,arguments)}a.flashsocket=c,b.util.inherit(c,b.Transport.websocket),c.prototype.name="flashsocket",c.prototype.open=function(){var a=this,c=arguments;return WebSocket.__addTask(function(){b.Transport.websocket.prototype.open.apply(a,c)}),this},c.prototype.send=function(){var a=this,c=arguments;return WebSocket.__addTask(function(){b.Transport.websocket.prototype.send.apply(a,c)}),this},c.prototype.close=function(){return WebSocket.__tasks.length=0,b.Transport.websocket.prototype.close.call(this),this},c.prototype.ready=function(a,d){function e(){var b=a.options,e=b["flash policy port"],g=["http"+(b.secure?"s":"")+":/",b.host+":"+b.port,b.resource,"static/flashsocket","WebSocketMain"+(a.isXDomain()?"Insecure":"")+".swf"];c.loaded||(typeof WEB_SOCKET_SWF_LOCATION=="undefined"&&(WEB_SOCKET_SWF_LOCATION=g.join("/")),e!==843&&WebSocket.loadFlashPolicyFile("xmlsocket://"+b.host+":"+e),WebSocket.__initialize(),c.loaded=!0),d.call(f)}var f=this;if(document.body)return e();b.util.load(e)},c.check=function(){return typeof WebSocket!="undefined"&&"__initialize"in WebSocket&&!!swfobject?swfobject.getFlashPlayerVersion().major>=10:!1},c.xdomainCheck=function(){return!0},typeof window!="undefined"&&(WEB_SOCKET_DISABLE_AUTO_INITIALIZATION=!0),b.transports.push("flashsocket")}("undefined"!=typeof io?io.Transport:module.exports,"undefined"!=typeof io?io:module.parent.exports);if("undefined"!=typeof window)var swfobject=function(){function A(){if(t)return;try{var a=i.getElementsByTagName("body")[0].appendChild(Q("span"));a.parentNode.removeChild(a)}catch(b){return}t=!0;var c=l.length;for(var d=0;d<c;d++)l[d]()}function B(a){t?a():l[l.length]=a}function C(b){if(typeof h.addEventListener!=a)h.addEventListener("load",b,!1);else if(typeof i.addEventListener!=a)i.addEventListener("load",b,!1);else if(typeof h.attachEvent!=a)R(h,"onload",b);else if(typeof h.onload=="function"){var c=h.onload;h.onload=function(){c(),b()}}else h.onload=b}function D(){k?E():F()}function E(){var c=i.getElementsByTagName("body")[0],d=Q(b);d.setAttribute("type",e);var f=c.appendChild(d);if(f){var g=0;(function(){if(typeof f.GetVariable!=a){var b=f.GetVariable("$version");b&&(b=b.split(" ")[1].split(","),y.pv=[parseInt(b[0],10),parseInt(b[1],10),parseInt(b[2],10)])}else if(g<10){g++,setTimeout(arguments.callee,10);return}c.removeChild(d),f=null,F()})()}else F()}function F(){var b=m.length;if(b>0)for(var c=0;c<b;c++){var d=m[c].id,e=m[c].callbackFn,f={success:!1,id:d};if(y.pv[0]>0){var g=P(d);if(g)if(S(m[c].swfVersion)&&!(y.wk&&y.wk<312))U(d,!0),e&&(f.success=!0,f.ref=G(d),e(f));else if(m[c].expressInstall&&H()){var h={};h.data=m[c].expressInstall,h.width=g.getAttribute("width")||"0",h.height=g.getAttribute("height")||"0",g.getAttribute("class")&&(h.styleclass=g.getAttribute("class")),g.getAttribute("align")&&(h.align=g.getAttribute("align"));var i={},j=g.getElementsByTagName("param"),k=j.length;for(var l=0;l<k;l++)j[l].getAttribute("name").toLowerCase()!="movie"&&(i[j[l].getAttribute("name")]=j[l].getAttribute("value"));I(h,i,d,e)}else J(g),e&&e(f)}else{U(d,!0);if(e){var n=G(d);n&&typeof n.SetVariable!=a&&(f.success=!0,f.ref=n),e(f)}}}}function G(c){var d=null,e=P(c);if(e&&e.nodeName=="OBJECT")if(typeof e.SetVariable!=a)d=e;else{var f=e.getElementsByTagName(b)[0];f&&(d=f)}return d}function H(){return!u&&S("6.0.65")&&(y.win||y.mac)&&!(y.wk&&y.wk<312)}function I(b,c,d,e){u=!0,r=e||null,s={success:!1,id:d};var g=P(d);if(g){g.nodeName=="OBJECT"?(p=K(g),q=null):(p=g,q=d),b.id=f;if(typeof b.width==a||!/%$/.test(b.width)&&parseInt(b.width,10)<310)b.width="310";if(typeof b.height==a||!/%$/.test(b.height)&&parseInt(b.height,10)<137)b.height="137";i.title=i.title.slice(0,47)+" - Flash Player Installation";var j=y.ie&&y.win?["Active"].concat("").join("X"):"PlugIn",k="MMredirectURL="+h.location.toString().replace(/&/g,"%26")+"&MMplayerType="+j+"&MMdoctitle="+i.title;typeof c.flashvars!=a?c.flashvars+="&"+k:c.flashvars=k;if(y.ie&&y.win&&g.readyState!=4){var l=Q("div");d+="SWFObjectNew",l.setAttribute("id",d),g.parentNode.insertBefore(l,g),g.style.display="none",function(){g.readyState==4?g.parentNode.removeChild(g):setTimeout(arguments.callee,10)}()}L(b,c,d)}}function J(a){if(y.ie&&y.win&&a.readyState!=4){var b=Q("div");a.parentNode.insertBefore(b,a),b.parentNode.replaceChild(K(a),b),a.style.display="none",function(){a.readyState==4?a.parentNode.removeChild(a):setTimeout(arguments.callee,10)}()}else a.parentNode.replaceChild(K(a),a)}function K(a){var c=Q("div");if(y.win&&y.ie)c.innerHTML=a.innerHTML;else{var d=a.getElementsByTagName(b)[0];if(d){var e=d.childNodes;if(e){var f=e.length;for(var g=0;g<f;g++)(e[g].nodeType!=1||e[g].nodeName!="PARAM")&&e[g].nodeType!=8&&c.appendChild(e[g].cloneNode(!0))}}}return c}function L(c,d,f){var g,h=P(f);if(y.wk&&y.wk<312)return g;if(h){typeof c.id==a&&(c.id=f);if(y.ie&&y.win){var i="";for(var j in c)c[j]!=Object.prototype[j]&&(j.toLowerCase()=="data"?d.movie=c[j]:j.toLowerCase()=="styleclass"?i+=' class="'+c[j]+'"':j.toLowerCase()!="classid"&&(i+=" "+j+'="'+c[j]+'"'));var k="";for(var l in d)d[l]!=Object.prototype[l]&&(k+='<param name="'+l+'" value="'+d[l]+'" />');h.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+i+">"+k+"</object>",n[n.length]=c.id,g=P(c.id)}else{var m=Q(b);m.setAttribute("type",e);for(var o in c)c[o]!=Object.prototype[o]&&(o.toLowerCase()=="styleclass"?m.setAttribute("class",c[o]):o.toLowerCase()!="classid"&&m.setAttribute(o,c[o]));for(var p in d)d[p]!=Object.prototype[p]&&p.toLowerCase()!="movie"&&M(m,p,d[p]);h.parentNode.replaceChild(m,h),g=m}}return g}function M(a,b,c){var d=Q("param");d.setAttribute("name",b),d.setAttribute("value",c),a.appendChild(d)}function N(a){var b=P(a);b&&b.nodeName=="OBJECT"&&(y.ie&&y.win?(b.style.display="none",function(){b.readyState==4?O(a):setTimeout(arguments.callee,10)}()):b.parentNode.removeChild(b))}function O(a){var b=P(a);if(b){for(var c in b)typeof b[c]=="function"&&(b[c]=null);b.parentNode.removeChild(b)}}function P(a){var b=null;try{b=i.getElementById(a)}catch(c){}return b}function Q(a){return i.createElement(a)}function R(a,b,c){a.attachEvent(b,c),o[o.length]=[a,b,c]}function S(a){var b=y.pv,c=a.split(".");return c[0]=parseInt(c[0],10),c[1]=parseInt(c[1],10)||0,c[2]=parseInt(c[2],10)||0,b[0]>c[0]||b[0]==c[0]&&b[1]>c[1]||b[0]==c[0]&&b[1]==c[1]&&b[2]>=c[2]?!0:!1}function T(c,d,e,f){if(y.ie&&y.mac)return;var g=i.getElementsByTagName("head")[0];if(!g)return;var h=e&&typeof e=="string"?e:"screen";f&&(v=null,w=null);if(!v||w!=h){var j=Q("style");j.setAttribute("type","text/css"),j.setAttribute("media",h),v=g.appendChild(j),y.ie&&y.win&&typeof i.styleSheets!=a&&i.styleSheets.length>0&&(v=i.styleSheets[i.styleSheets.length-1]),w=h}y.ie&&y.win?v&&typeof v.addRule==b&&v.addRule(c,d):v&&typeof i.createTextNode!=a&&v.appendChild(i.createTextNode(c+" {"+d+"}"))}function U(a,b){if(!x)return;var c=b?"visible":"hidden";t&&P(a)?P(a).style.visibility=c:T("#"+a,"visibility:"+c)}function V(b){var c=/[\\\"<>\.;]/,d=c.exec(b)!=null;return d&&typeof encodeURIComponent!=a?encodeURIComponent(b):b}var a="undefined",b="object",c="Shockwave Flash",d="ShockwaveFlash.ShockwaveFlash",e="application/x-shockwave-flash",f="SWFObjectExprInst",g="onreadystatechange",h=window,i=document,j=navigator,k=!1,l=[D],m=[],n=[],o=[],p,q,r,s,t=!1,u=!1,v,w,x=!0,y=function(){var f=typeof i.getElementById!=a&&typeof i.getElementsByTagName!=a&&typeof i.createElement!=a,g=j.userAgent.toLowerCase(),l=j.platform.toLowerCase(),m=l?/win/.test(l):/win/.test(g),n=l?/mac/.test(l):/mac/.test(g),o=/webkit/.test(g)?parseFloat(g.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):!1,p=!1,q=[0,0,0],r=null;if(typeof j.plugins!=a&&typeof j.plugins[c]==b)r=j.plugins[c].description,r&&(typeof j.mimeTypes==a||!j.mimeTypes[e]||!!j.mimeTypes[e].enabledPlugin)&&(k=!0,p=!1,r=r.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),q[0]=parseInt(r.replace(/^(.*)\..*$/,"$1"),10),q[1]=parseInt(r.replace(/^.*\.(.*)\s.*$/,"$1"),10),q[2]=/[a-zA-Z]/.test(r)?parseInt(r.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0);else if(typeof h[["Active"].concat("Object").join("X")]!=a)try{var s=new(window[["Active"].concat("Object").join("X")])(d);s&&(r=s.GetVariable("$version"),r&&(p=!0,r=r.split(" ")[1].split(","),q=[parseInt(r[0],10),parseInt(r[1],10),parseInt(r[2],10)]))}catch(t){}return{w3:f,pv:q,wk:o,ie:p,win:m,mac:n}}(),z=function(){if(!y.w3)return;(typeof i.readyState!=a&&i.readyState=="complete"||typeof i.readyState==a&&(i.getElementsByTagName("body")[0]||i.body))&&A(),t||(typeof i.addEventListener!=a&&i.addEventListener("DOMContentLoaded",A,!1),y.ie&&y.win&&(i.attachEvent(g,function(){i.readyState=="complete"&&(i.detachEvent(g,arguments.callee),A())}),h==top&&function(){if(t)return;try{i.documentElement.doScroll("left")}catch(a){setTimeout(arguments.callee,0);return}A()}()),y.wk&&function(){if(t)return;if(!/loaded|complete/.test(i.readyState)){setTimeout(arguments.callee,0);return}A()}(),C(A))}(),W=function(){y.ie&&y.win&&window.attachEvent("onunload",function(){var a=o.length;for(var b=0;b<a;b++)o[b][0].detachEvent(o[b][1],o[b][2]);var c=n.length;for(var d=0;d<c;d++)N(n[d]);for(var e in y)y[e]=null;y=null;for(var f in swfobject)swfobject[f]=null;swfobject=null})}();return{registerObject:function(a,b,c,d){if(y.w3&&a&&b){var e={};e.id=a,e.swfVersion=b,e.expressInstall=c,e.callbackFn=d,m[m.length]=e,U(a,!1)}else d&&d({success:!1,id:a})},getObjectById:function(a){if(y.w3)return G(a)},embedSWF:function(c,d,e,f,g,h,i,j,k,l){var m={success:!1,id:d};y.w3&&!(y.wk&&y.wk<312)&&c&&d&&e&&f&&g?(U(d,!1),B(function(){e+="",f+="";var n={};if(k&&typeof k===b)for(var o in k)n[o]=k[o];n.data=c,n.width=e,n.height=f;var p={};if(j&&typeof j===b)for(var q in j)p[q]=j[q];if(i&&typeof i===b)for(var r in i)typeof p.flashvars!=a?p.flashvars+="&"+r+"="+i[r]:p.flashvars=r+"="+i[r];if(S(g)){var s=L(n,p,d);n.id==d&&U(d,!0),m.success=!0,m.ref=s}else{if(h&&H()){n.data=h,I(n,p,d,l);return}U(d,!0)}l&&l(m)})):l&&l(m)},switchOffAutoHideShow:function(){x=!1},ua:y,getFlashPlayerVersion:function(){return{major:y.pv[0],minor:y.pv[1],release:y.pv[2]}},hasFlashPlayerVersion:S,createSWF:function(a,b,c){return y.w3?L(a,b,c):undefined},showExpressInstall:function(a,b,c,d){y.w3&&H()&&I(a,b,c,d)},removeSWF:function(a){y.w3&&N(a)},createCSS:function(a,b,c,d){y.w3&&T(a,b,c,d)},addDomLoadEvent:B,addLoadEvent:C,getQueryParamValue:function(a){var b=i.location.search||i.location.hash;if(b){/\?/.test(b)&&(b=b.split("?")[1]);if(a==null)return V(b);var c=b.split("&");for(var d=0;d<c.length;d++)if(c[d].substring(0,c[d].indexOf("="))==a)return V(c[d].substring(c[d].indexOf("=")+1))}return""},expressInstallCallback:function(){if(u){var a=P(f);a&&p&&(a.parentNode.replaceChild(p,a),q&&(U(q,!0),y.ie&&y.win&&(p.style.display="block")),r&&r(s)),u=!1}}}}();(function(){if("undefined"==typeof window||window.WebSocket)return;var a=window.console;if(!a||!a.log||!a.error)a={log:function(){},error:function(){}};if(!swfobject.hasFlashPlayerVersion("10.0.0")){a.error("Flash Player >= 10.0.0 is required.");return}location.protocol=="file:"&&a.error("WARNING: web-socket-js doesn't work in file:///... URL unless you set Flash Security Settings properly. Open the page via Web server i.e. http://..."),WebSocket=function(a,b,c,d,e){var f=this;f.__id=WebSocket.__nextId++,WebSocket.__instances[f.__id]=f,f.readyState=WebSocket.CONNECTING,f.bufferedAmount=0,f.__events={},b?typeof b=="string"&&(b=[b]):b=[],setTimeout(function(){WebSocket.__addTask(function(){WebSocket.__flash.create(f.__id,a,b,c||null,d||0,e||null)})},0)},WebSocket.prototype.send=function(a){if(this.readyState==WebSocket.CONNECTING)throw"INVALID_STATE_ERR: Web Socket connection has not been established";var b=WebSocket.__flash.send(this.__id,encodeURIComponent(a));return b<0?!0:(this.bufferedAmount+=b,!1)},WebSocket.prototype.close=function(){if(this.readyState==WebSocket.CLOSED||this.readyState==WebSocket.CLOSING)return;this.readyState=WebSocket.CLOSING,WebSocket.__flash.close(this.__id)},WebSocket.prototype.addEventListener=function(a,b,c){a in this.__events||(this.__events[a]=[]),this.__events[a].push(b)},WebSocket.prototype.removeEventListener=function(a,b,c){if(!(a in this.__events))return;var d=this.__events[a];for(var e=d.length-1;e>=0;--e)if(d[e]===b){d.splice(e,1);break}},WebSocket.prototype.dispatchEvent=function(a){var b=this.__events[a.type]||[];for(var c=0;c<b.length;++c)b[c](a);var d=this["on"+a.type];d&&d(a)},WebSocket.prototype.__handleEvent=function(a){"readyState"in a&&(this.readyState=a.readyState),"protocol"in a&&(this.protocol=a.protocol);var b;if(a.type=="open"||a.type=="error")b=this.__createSimpleEvent(a.type);else if(a.type=="close")b=this.__createSimpleEvent("close");else{if(a.type!="message")throw"unknown event type: "+a.type;var c=decodeURIComponent(a.message);b=this.__createMessageEvent("message",c)}this.dispatchEvent(b)},WebSocket.prototype.__createSimpleEvent=function(a){if(document.createEvent&&window.Event){var b=document.createEvent("Event");return b.initEvent(a,!1,!1),b}return{type:a,bubbles:!1,cancelable:!1}},WebSocket.prototype.__createMessageEvent=function(a,b){if(document.createEvent&&window.MessageEvent&&!window.opera){var c=document.createEvent("MessageEvent");return c.initMessageEvent("message",!1,!1,b,null,null,window,null),c}return{type:a,data:b,bubbles:!1,cancelable:!1}},WebSocket.CONNECTING=0,WebSocket.OPEN=1,WebSocket.CLOSING=2,WebSocket.CLOSED=3,WebSocket.__flash=null,WebSocket.__instances={},WebSocket.__tasks=[],WebSocket.__nextId=0,WebSocket.loadFlashPolicyFile=function(a){WebSocket.__addTask(function(){WebSocket.__flash.loadManualPolicyFile(a)})},WebSocket.__initialize=function(){if(WebSocket.__flash)return;WebSocket.__swfLocation&&(window.WEB_SOCKET_SWF_LOCATION=WebSocket.__swfLocation);if(!window.WEB_SOCKET_SWF_LOCATION){a.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf");return}var b=document.createElement("div");b.id="webSocketContainer",b.style.position="absolute",WebSocket.__isFlashLite()?(b.style.left="0px",b.style.top="0px"):(b.style.left="-100px",b.style.top="-100px");var c=document.createElement("div");c.id="webSocketFlash",b.appendChild(c),document.body.appendChild(b),swfobject.embedSWF(WEB_SOCKET_SWF_LOCATION,"webSocketFlash","1","1","10.0.0",null,null,{hasPriority:!0,swliveconnect:!0,allowScriptAccess:"always"},null,function(b){b.success||a.error("[WebSocket] swfobject.embedSWF failed")})},WebSocket.__onFlashInitialized=function(){setTimeout(function(){WebSocket.__flash=document.getElementById("webSocketFlash"),WebSocket.__flash.setCallerUrl(location.href),WebSocket.__flash.setDebug(!!window.WEB_SOCKET_DEBUG);for(var a=0;a<WebSocket.__tasks.length;++a)WebSocket.__tasks[a]();WebSocket.__tasks=[]},0)},WebSocket.__onFlashEvent=function(){return setTimeout(function(){try{var b=WebSocket.__flash.receiveEvents();for(var c=0;c<b.length;++c)WebSocket.__instances[b[c].webSocketId].__handleEvent(b[c])}catch(d){a.error(d)}},0),!0},WebSocket.__log=function(b){a.log(decodeURIComponent(b))},WebSocket.__error=function(b){a.error(decodeURIComponent(b))},WebSocket.__addTask=function(a){WebSocket.__flash?a():WebSocket.__tasks.push(a)},WebSocket.__isFlashLite=function(){if(!window.navigator||!window.navigator.mimeTypes)return!1;var a=window.navigator.mimeTypes["application/x-shockwave-flash"];return!a||!a.enabledPlugin||!a.enabledPlugin.filename?!1:a.enabledPlugin.filename.match(/flashlite/i)?!0:!1},window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION||(window.addEventListener?window.addEventListener("load",function(){WebSocket.__initialize()},!1):window.attachEvent("onload",function(){WebSocket.__initialize()}))})(),function(a,b,c){function d(a){if(!a)return;b.Transport.apply(this,arguments),this.sendBuffer=[]}function e(){}a.XHR=d,b.util.inherit(d,b.Transport),d.prototype.open=function(){return this.socket.setBuffer(!1),this.onOpen(),this.get(),this.setCloseTimeout(),this},d.prototype.payload=function(a){var c=[];for(var d=0,e=a.length;d<e;d++)c.push(b.parser.encodePacket(a[d]));this.send(b.parser.encodePayload(c))},d.prototype.send=function(a){return this.post(a),this},d.prototype.post=function(a){function d(){this.readyState==4&&(this.onreadystatechange=e,b.posting=!1,this.status==200?b.socket.setBuffer(!1):b.onClose())}function f(){this.onload=e,b.socket.setBuffer(!1)}var b=this;this.socket.setBuffer(!0),this.sendXHR=this.request("POST"),c.XDomainRequest&&this.sendXHR instanceof XDomainRequest?this.sendXHR.onload=this.sendXHR.onerror=f:this.sendXHR.onreadystatechange=d,this.sendXHR.send(a)},d.prototype.close=function(){return this.onClose(),this},d.prototype.request=function(a){var c=b.util.request(this.socket.isXDomain()),d=b.util.query(this.socket.options.query,"t="+ +(new Date));c.open(a||"GET",this.prepareUrl()+d,!0);if(a=="POST")try{c.setRequestHeader?c.setRequestHeader("Content-type","text/plain;charset=UTF-8"):c.contentType="text/plain"}catch(e){}return c},d.prototype.scheme=function(){return this.socket.options.secure?"https":"http"},d.check=function(a,d){try{var e=b.util.request(d),f=c.XDomainRequest&&e instanceof XDomainRequest,g=a&&a.options&&a.options.secure?"https:":"http:",h=c.location&&g!=c.location.protocol;if(e&&(!f||!h))return!0}catch(i){}return!1},d.xdomainCheck=function(a){return d.check(a,!0)}}("undefined"!=typeof io?io.Transport:module.exports,"undefined"!=typeof io?io:module.parent.exports,this),function(a,b){function c(a){b.Transport.XHR.apply(this,arguments)}a.htmlfile=c,b.util.inherit(c,b.Transport.XHR),c.prototype.name="htmlfile",c.prototype.get=function(){this.doc=new(window[["Active"].concat("Object").join("X")])("htmlfile"),this.doc.open(),this.doc.write("<html></html>"),this.doc.close(),this.doc.parentWindow.s=this;var a=this.doc.createElement("div");a.className="socketio",this.doc.body.appendChild(a),this.iframe=this.doc.createElement("iframe"),a.appendChild(this.iframe);var c=this,d=b.util.query(this.socket.options.query,"t="+ +(new Date));this.iframe.src=this.prepareUrl()+d,b.util.on(window,"unload",function(){c.destroy()})},c.prototype._=function(a,b){a=a.replace(/\\\//g,"/"),this.onData(a);try{var c=b.getElementsByTagName("script")[0];c.parentNode.removeChild(c)}catch(d){}},c.prototype.destroy=function(){if(this.iframe){try{this.iframe.src="about:blank"}catch(a){}this.doc=null,this.iframe.parentNode.removeChild(this.iframe),this.iframe=null,CollectGarbage()}},c.prototype.close=function(){return this.destroy(),b.Transport.XHR.prototype.close.call(this)},c.check=function(a){if(typeof window!="undefined"&&["Active"].concat("Object").join("X")in window)try{var c=new(window[["Active"].concat("Object").join("X")])("htmlfile");return c&&b.Transport.XHR.check(a)}catch(d){}return!1},c.xdomainCheck=function(){return!1},b.transports.push("htmlfile")}("undefined"!=typeof io?io.Transport:module.exports,"undefined"!=typeof io?io:module.parent.exports),function(a,b,c){function d(){b.Transport.XHR.apply(this,arguments)}function e(){}a["xhr-polling"]=d,b.util.inherit(d,b.Transport.XHR),b.util.merge(d,b.Transport.XHR),d.prototype.name="xhr-polling",d.prototype.heartbeats=function(){return!1},d.prototype.open=function(){var a=this;return b.Transport.XHR.prototype.open.call(a),!1},d.prototype.get=function(){function b(){this.readyState==4&&(this.onreadystatechange=e,this.status==200?(a.onData(this.responseText),a.get()):a.onClose())}function d(){this.onload=e,this.onerror=e,a.retryCounter=1,a.onData(this.responseText),a.get()}function f(){a.retryCounter++,!a.retryCounter||a.retryCounter>3?a.onClose():a.get()}if(!this.isOpen)return;var a=this;this.xhr=this.request(),c.XDomainRequest&&this.xhr instanceof XDomainRequest?(this.xhr.onload=d,this.xhr.onerror=f):this.xhr.onreadystatechange=b,this.xhr.send(null)},d.prototype.onClose=function(){b.Transport.XHR.prototype.onClose.call(this);if(this.xhr){this.xhr.onreadystatechange=this.xhr.onload=this.xhr.onerror=e;try{this.xhr.abort()}catch(a){}this.xhr=null}},d.prototype.ready=function(a,c){var d=this;b.util.defer(function(){c.call(d)})},b.transports.push("xhr-polling")}("undefined"!=typeof io?io.Transport:module.exports,"undefined"!=typeof io?io:module.parent.exports,this),function(a,b,c){function e(a){b.Transport["xhr-polling"].apply(this,arguments),this.index=b.j.length;var c=this;b.j.push(function(a){c._(a)})}var d=c.document&&"MozAppearance"in c.document.documentElement.style;a["jsonp-polling"]=e,b.util.inherit(e,b.Transport["xhr-polling"]),e.prototype.name="jsonp-polling",e.prototype.post=function(a){function i(){j(),c.socket.setBuffer(!1)}function j(){c.iframe&&c.form.removeChild(c.iframe);try{h=document.createElement('<iframe name="'+c.iframeId+'">')}catch(a){h=document.createElement("iframe"),h.name=c.iframeId}h.id=c.iframeId,c.form.appendChild(h),c.iframe=h}var c=this,d=b.util.query(this.socket.options.query,"t="+ +(new Date)+"&i="+this.index);if(!this.form){var e=document.createElement("form"),f=document.createElement("textarea"),g=this.iframeId="socketio_iframe_"+this.index,h;e.className="socketio",e.style.position="absolute",e.style.top="0px",e.style.left="0px",e.style.display="none",e.target=g,e.method="POST",e.setAttribute("accept-charset","utf-8"),f.name="d",e.appendChild(f),document.body.appendChild(e),this.form=e,this.area=f}this.form.action=this.prepareUrl()+d,j(),this.area.value=b.JSON.stringify(a);try{this.form.submit()}catch(k){}this.iframe.attachEvent?h.onreadystatechange=function(){c.iframe.readyState=="complete"&&i()}:this.iframe.onload=i,this.socket.setBuffer(!0)},e.prototype.get=function(){var a=this,c=document.createElement("script"),e=b.util.query(this.socket.options.query,"t="+ +(new Date)+"&i="+this.index);this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),c.async=!0,c.src=this.prepareUrl()+e,c.onerror=function(){a.onClose()};var f=document.getElementsByTagName("script")[0];f.parentNode.insertBefore(c,f),this.script=c,d&&setTimeout(function(){var a=document.createElement("iframe");document.body.appendChild(a),document.body.removeChild(a)},100)},e.prototype._=function(a){return this.onData(a),this.isOpen&&this.get(),this},e.prototype.ready=function(a,c){var e=this;if(!d)return c.call(this);b.util.load(function(){c.call(e)})},e.check=function(){return"document"in c},e.xdomainCheck=function(){return!0},b.transports.push("jsonp-polling")}("undefined"!=typeof io?io.Transport:module.exports,"undefined"!=typeof io?io:module.parent.exports,this),typeof define=="function"&&define.amd&&define([],function(){return io})})();(function(window, undefined) {


    window.delay = function(func, wait) {
        var args = Array.prototype.slice.call(arguments, 2);
        return setTimeout(function(){ return func.apply(null, args); }, wait);
    };


    /* Debounce and throttle functions taken from underscore.js */
    window.debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
          var context = this, args = arguments;
          var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
          if (immediate && !timeout) func.apply(context, args);
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
    };


    window.throttle = function(func, wait) {
        var context, args, timeout, throttling, more, result;
        var whenDone = debounce(
            function(){ more = throttling = false; }, wait);
        return function() {
          context = this; args = arguments;
          var later = function() {
            timeout = null;
            if (more) func.apply(context, args);
            whenDone();
          };
          if (!timeout) timeout = setTimeout(later, wait);
          if (throttling) {
            more = true;
          } else {
            result = func.apply(context, args);
          }
          whenDone();
          throttling = true;
          return result;
        };
    };

})(window);
/*!
* ZeroClipboard
* The ZeroClipboard library provides an easy way to copy text to the clipboard using an invisible Adobe Flash movie and a JavaScript interface.
* Copyright (c) 2014 Jon Rohan, James M. Greene
* Licensed MIT
* http://zeroclipboard.org/
* v2.0.0-beta.4
*/
!function(a){"use strict";var b,c={bridge:null,version:"0.0.0",pluginType:"unknown",disabled:null,outdated:null,unavailable:null,deactivated:null,overdue:null,ready:null},d={},e=null,f=0,g={},h=0,i={},j=function(){var a,b,c,d,e="ZeroClipboard.swf";if(document.currentScript&&(d=document.currentScript.src));else{var f=document.getElementsByTagName("script");if("readyState"in f[0])for(a=f.length;a--&&("interactive"!==f[a].readyState||!(d=f[a].src)););else if("loading"===document.readyState)d=f[f.length-1].src;else{for(a=f.length;a--;){if(c=f[a].src,!c){b=null;break}if(c=c.split("#")[0].split("?")[0],c=c.slice(0,c.lastIndexOf("/")+1),null==b)b=c;else if(b!==c){b=null;break}}null!==b&&(d=b)}}return d&&(d=d.split("#")[0].split("?")[0],e=d.slice(0,d.lastIndexOf("/")+1)+e),e}(),k=function(){var a=/\-([a-z])/g,b=function(a,b){return b.toUpperCase()};return function(c){return c.replace(a,b)}}(),l=function(b,c){var d,e,f;return a.getComputedStyle?d=a.getComputedStyle(b,null).getPropertyValue(c):(e=k(c),d=b.currentStyle?b.currentStyle[e]:b.style[e]),"cursor"!==c||d&&"auto"!==d||(f=b.tagName.toLowerCase(),"a"!==f)?d:"pointer"},m=function(b){b||(b=a.event);var c;this!==a?c=this:b.target?c=b.target:b.srcElement&&(c=b.srcElement),K.activate(c)},n=function(a,b,c){a&&1===a.nodeType&&(a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent&&a.attachEvent("on"+b,c))},o=function(a,b,c){a&&1===a.nodeType&&(a.removeEventListener?a.removeEventListener(b,c,!1):a.detachEvent&&a.detachEvent("on"+b,c))},p=function(a,b){if(!a||1!==a.nodeType)return a;if(a.classList)return a.classList.contains(b)||a.classList.add(b),a;if(b&&"string"==typeof b){var c=(b||"").split(/\s+/);if(1===a.nodeType)if(a.className){for(var d=" "+a.className+" ",e=a.className,f=0,g=c.length;g>f;f++)d.indexOf(" "+c[f]+" ")<0&&(e+=" "+c[f]);a.className=e.replace(/^\s+|\s+$/g,"")}else a.className=b}return a},q=function(a,b){if(!a||1!==a.nodeType)return a;if(a.classList)return a.classList.contains(b)&&a.classList.remove(b),a;if(b&&"string"==typeof b||void 0===b){var c=(b||"").split(/\s+/);if(1===a.nodeType&&a.className)if(b){for(var d=(" "+a.className+" ").replace(/[\n\t]/g," "),e=0,f=c.length;f>e;e++)d=d.replace(" "+c[e]+" "," ");a.className=d.replace(/^\s+|\s+$/g,"")}else a.className=""}return a},r=function(){var a,b,c,d=1;return"function"==typeof document.body.getBoundingClientRect&&(a=document.body.getBoundingClientRect(),b=a.right-a.left,c=document.body.offsetWidth,d=Math.round(b/c*100)/100),d},s=function(b,c){var d={left:0,top:0,width:0,height:0,zIndex:y(c)-1};if(b.getBoundingClientRect){var e,f,g,h=b.getBoundingClientRect();"pageXOffset"in a&&"pageYOffset"in a?(e=a.pageXOffset,f=a.pageYOffset):(g=r(),e=Math.round(document.documentElement.scrollLeft/g),f=Math.round(document.documentElement.scrollTop/g));var i=document.documentElement.clientLeft||0,j=document.documentElement.clientTop||0;d.left=h.left+e-i,d.top=h.top+f-j,d.width="width"in h?h.width:h.right-h.left,d.height="height"in h?h.height:h.bottom-h.top}return d},t=function(a,b){var c=null==b||b&&b.cacheBust===!0;return c?(-1===a.indexOf("?")?"?":"&")+"noCache="+(new Date).getTime():""},u=function(b){var c,d,e,f,g="",h=[];if(b.trustedDomains&&("string"==typeof b.trustedDomains?f=[b.trustedDomains]:"object"==typeof b.trustedDomains&&"length"in b.trustedDomains&&(f=b.trustedDomains)),f&&f.length)for(c=0,d=f.length;d>c;c++)if(f.hasOwnProperty(c)&&f[c]&&"string"==typeof f[c]){if(e=A(f[c]),!e)continue;if("*"===e){h=[e];break}h.push.apply(h,[e,"//"+e,a.location.protocol+"//"+e])}return h.length&&(g+="trustedOrigins="+encodeURIComponent(h.join(","))),b.forceEnhancedClipboard===!0&&(g+=(g?"&":"")+"forceEnhancedClipboard=true"),g},v=function(a,b,c){if("function"==typeof b.indexOf)return b.indexOf(a,c);var d,e=b.length;for("undefined"==typeof c?c=0:0>c&&(c=e+c),d=c;e>d;d++)if(b.hasOwnProperty(d)&&b[d]===a)return d;return-1},w=function(a){if("string"==typeof a)throw new TypeError("ZeroClipboard doesn't accept query strings.");return a.length?a:[a]},x=function(b,c,d,e){e?a.setTimeout(function(){b.apply(c,d)},0):b.apply(c,d)},y=function(a){var b,c;return a&&("number"==typeof a&&a>0?b=a:"string"==typeof a&&(c=parseInt(a,10))&&!isNaN(c)&&c>0&&(b=c)),b||("number"==typeof N.zIndex&&N.zIndex>0?b=N.zIndex:"string"==typeof N.zIndex&&(c=parseInt(N.zIndex,10))&&!isNaN(c)&&c>0&&(b=c)),b||0},z=function(){var a,b,c,d,e,f,g=arguments[0]||{};for(a=1,b=arguments.length;b>a;a++)if(null!=(c=arguments[a]))for(d in c)if(c.hasOwnProperty(d)){if(e=g[d],f=c[d],g===f)continue;void 0!==f&&(g[d]=f)}return g},A=function(a){if(null==a||""===a)return null;if(a=a.replace(/^\s+|\s+$/g,""),""===a)return null;var b=a.indexOf("//");a=-1===b?a:a.slice(b+2);var c=a.indexOf("/");return a=-1===c?a:-1===b||0===c?null:a.slice(0,c),a&&".swf"===a.slice(-4).toLowerCase()?null:a||null},B=function(){var a=function(a,b){var c,d,e;if(null!=a&&"*"!==b[0]&&("string"==typeof a&&(a=[a]),"object"==typeof a&&"length"in a))for(c=0,d=a.length;d>c;c++)if(a.hasOwnProperty(c)&&(e=A(a[c]))){if("*"===e){b.length=0,b.push("*");break}-1===v(e,b)&&b.push(e)}};return function(b,c){var d=A(c.swfPath);null===d&&(d=b);var e=[];a(c.trustedOrigins,e),a(c.trustedDomains,e);var f=e.length;if(f>0){if(1===f&&"*"===e[0])return"always";if(-1!==v(b,e))return 1===f&&b===d?"sameDomain":"always"}return"never"}}(),C=function(a){if(null==a)return[];if(Object.keys)return Object.keys(a);var b=[];for(var c in a)a.hasOwnProperty(c)&&b.push(c);return b},D=function(a){if(a)for(var b in a)a.hasOwnProperty(b)&&delete a[b];return a},E=function(){try{return document.activeElement}catch(a){}return null},F=function(a,b){for(var c={},d=0,e=b.length;e>d;d++)b[d]in a&&(c[b[d]]=a[b[d]]);return c},G=function(a,b){var c={};for(var d in a)-1===v(d,b)&&(c[d]=a[d]);return c},H=function(a){var b={},c={};if("object"==typeof a&&a){for(var d in a)if(d&&a.hasOwnProperty(d)&&"string"==typeof a[d]&&a[d])switch(d.toLowerCase()){case"text/plain":case"text":case"air:text":case"flash:text":b.text=a[d],c.text=d;break;case"text/html":case"html":case"air:html":case"flash:html":b.html=a[d],c.html=d;break;case"application/rtf":case"text/rtf":case"rtf":case"richtext":case"air:rtf":case"flash:rtf":b.rtf=a[d],c.rtf=d}return{data:b,formatMap:c}}},I=function(a,b){if("object"!=typeof a||!a||"object"!=typeof b||!b)return a;var c={};for(var d in a)if("success"===d||"data"===d){c[d]={};var e=a[d];for(var f in e)f&&e.hasOwnProperty(f)&&b.hasOwnProperty(f)&&(c[d][b[f]]=e[f])}else c[d]=a[d];return c},J=function(){function a(a){var b=a.match(/[\d]+/g);return b.length=3,b.join(".")}function b(a){return!!a&&(a=a.toLowerCase())&&(/^(pepflashplayer\.dll|libpepflashplayer\.so|pepperflashplayer\.plugin)$/.test(a)||"chrome.plugin"===a.slice(-13))}function d(c){c&&(h=!0,c.version&&(j=a(c.version)),!j&&c.description&&(j=a(c.description)),c.filename&&(k=b(c.filename)))}var e,f,g,h=!1,i=!1,j="",k=!1;if(navigator.plugins&&navigator.plugins.length)e=navigator.plugins["Shockwave Flash"],d(e),navigator.plugins["Shockwave Flash 2.0"]&&(h=!0,j="2.0.0.11");else if(navigator.mimeTypes&&navigator.mimeTypes.length)g=navigator.mimeTypes["application/x-shockwave-flash"],e=g&&g.enabledPlugin,d(e);else if("undefined"!=typeof ActiveXObject){i=!0;try{f=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"),h=!0,j=a(f.GetVariable("$version"))}catch(l){try{f=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"),h=!0,j="6.0.21"}catch(m){try{f=new ActiveXObject("ShockwaveFlash.ShockwaveFlash"),h=!0,j=a(f.GetVariable("$version"))}catch(n){i=!1}}}}c.disabled=h!==!0,c.outdated=j&&parseFloat(j)<11,c.version=j||"0.0.0",c.pluginType=k?"pepper":i?"activex":h?"netscape":"unknown"};J();var K=function(a){if(!(this instanceof K))return new K(a);if(this.id=""+f++,g[this.id]={instance:this,elements:[],handlers:{}},a&&this.clip(a),"boolean"!=typeof c.ready&&(c.ready=!1),!K.isFlashUnusable()&&null===c.bridge){var b=this,d=N.flashLoadTimeout;"number"==typeof d&&d>=0&&setTimeout(function(){"boolean"!=typeof c.deactivated&&(c.deactivated=!0),c.deactivated===!0&&K.emit({type:"error",name:"flash-deactivated",client:b})},d),c.overdue=!1,O()}};K.prototype.setText=function(a){return K.setData("text/plain",a),this},K.prototype.setHtml=function(a){return K.setData("text/html",a),this},K.prototype.setRichText=function(a){return K.setData("application/rtf",a),this},K.prototype.setData=function(){return K.setData.apply(K,Array.prototype.slice.call(arguments,0)),this},K.prototype.clearData=function(){return K.clearData.apply(K,Array.prototype.slice.call(arguments,0)),this},K.prototype.setSize=function(a,b){var d=P(c.bridge);return d&&(d.style.width=a+"px",d.style.height=b+"px"),this};var L=function(a){c.ready===!0&&c.bridge&&"function"==typeof c.bridge.setHandCursor?c.bridge.setHandCursor(a):c.ready=!1};K.prototype.destroy=function(){this.unclip(),this.off(),delete g[this.id]};var M=function(){var a,b,c,d=[],e=C(g);for(a=0,b=e.length;b>a;a++)c=g[e[a]].instance,c&&c instanceof K&&d.push(c);return d};K.version="2.0.0-beta.4";var N={swfPath:j,trustedDomains:a.location.host?[a.location.host]:[],cacheBust:!0,forceHandCursor:!1,forceEnhancedClipboard:!1,zIndex:999999999,debug:!1,title:null,autoActivate:!0,flashLoadTimeout:3e4};K.isFlashUnusable=function(){return!!(c.disabled||c.outdated||c.unavailable||c.deactivated)},K.config=function(a){"object"==typeof a&&null!==a&&z(N,a);{if("string"!=typeof a||!a){var b={};for(var c in N)N.hasOwnProperty(c)&&(b[c]="object"==typeof N[c]&&null!==N[c]?"length"in N[c]?N[c].slice(0):z({},N[c]):N[c]);return b}if(N.hasOwnProperty(a))return N[a]}},K.destroy=function(){K.deactivate();for(var a in g)if(g.hasOwnProperty(a)&&g[a]){var b=g[a].instance;b&&"function"==typeof b.destroy&&b.destroy()}var d=c.bridge;if(d){var e=P(d);e&&("activex"===c.pluginType&&"readyState"in d?(d.style.display="none",function f(){if(4===d.readyState){for(var a in d)"function"==typeof d[a]&&(d[a]=null);d.parentNode.removeChild(d),e.parentNode&&e.parentNode.removeChild(e)}else setTimeout(f,10)}()):(d.parentNode.removeChild(d),e.parentNode&&e.parentNode.removeChild(e))),c.ready=null,c.bridge=null,c.deactivated=null}K.clearData()},K.activate=function(a){b&&(q(b,N.hoverClass),q(b,N.activeClass)),b=a,p(a,N.hoverClass),Q();var d=N.title||a.getAttribute("title");if(d){var e=P(c.bridge);e&&e.setAttribute("title",d)}var f=N.forceHandCursor===!0||"pointer"===l(a,"cursor");L(f)},K.deactivate=function(){var a=P(c.bridge);a&&(a.style.left="0px",a.style.top="-9999px",a.removeAttribute("title")),b&&(q(b,N.hoverClass),q(b,N.activeClass),b=null)},K.state=function(){return{browser:F(a.navigator,["userAgent","platform","appName"]),flash:G(c,["bridge"]),zeroclipboard:{version:K.version,config:K.config()}}},K.setData=function(a,b){var c;if("object"==typeof a&&a&&"undefined"==typeof b)c=a,K.clearData();else{if("string"!=typeof a||!a)return;c={},c[a]=b}for(var e in c)e&&c.hasOwnProperty(e)&&"string"==typeof c[e]&&c[e]&&(d[e]=c[e])},K.clearData=function(a){"undefined"==typeof a?(D(d),e=null):"string"==typeof a&&d.hasOwnProperty(a)&&delete d[a]};var O=function(){var b,d,e=document.getElementById("global-zeroclipboard-html-bridge");if(!e){var f=B(a.location.host,N),g="never"===f?"none":"all",h=u(N),i=N.swfPath+t(N.swfPath,N);e=document.createElement("div"),e.id="global-zeroclipboard-html-bridge",e.className="global-zeroclipboard-container",e.style.position="absolute",e.style.left="0px",e.style.top="-9999px",e.style.width="1px",e.style.height="1px",e.style.zIndex=""+y(N.zIndex);var j=document.createElement("div");e.appendChild(j),document.body.appendChild(e);var k=document.createElement("div"),l="activex"===c.pluginType;k.innerHTML='<object id="global-zeroclipboard-flash-bridge" name="global-zeroclipboard-flash-bridge" width="100%" height="100%" '+(l?'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"':'type="application/x-shockwave-flash" data="'+i+'"')+">"+(l?'<param name="movie" value="'+i+'"/>':"")+'<param name="allowScriptAccess" value="'+f+'"/><param name="allowNetworking" value="'+g+'"/><param name="menu" value="false"/><param name="wmode" value="transparent"/><param name="flashvars" value="'+h+'"/></object>',b=k.firstChild,k=null,b.ZeroClipboard=K,e.replaceChild(b,j)}b||(b=document["global-zeroclipboard-flash-bridge"],b&&(d=b.length)&&(b=b[d-1]),b||(b=e.firstChild)),c.bridge=b||null},P=function(a){for(var b=a&&a.parentNode;b&&"OBJECT"===b.nodeName&&b.parentNode;)b=b.parentNode;return b||null},Q=function(){if(b){var a=s(b,N.zIndex),d=P(c.bridge);d&&(d.style.top=a.top+"px",d.style.left=a.left+"px",d.style.width=a.width+"px",d.style.height=a.height+"px",d.style.zIndex=a.zIndex+1),c.ready===!0&&c.bridge&&"function"==typeof c.bridge.setSize?c.bridge.setSize(a.width,a.height):c.ready=!1}return this};K.emit=function(b){var f,g;if("string"==typeof b&&b&&(f=b),"object"==typeof b&&b&&"string"==typeof b.type&&b.type&&(f=b.type,g=b),f){if(b=T(f,g),V(b),"ready"===b.type&&c.overdue===!0)return K.emit({type:"error",name:"flash-overdue"});var h=!/^(before)?copy$/.test(b.type);if(b.client)R.call(b.client,b,h);else{var i,j,k,l=b.target&&b.target!==a&&N.autoActivate===!0?W(b.target):M();for(i=0,j=l.length;j>i;i++)k=z({},b,{client:l[i]}),R.call(l[i],k,h)}var m;if("copy"===b.type){var n=H(d);m=n.data,e=n.formatMap}return m}};var R=function(b,c){var d=g[this.id]&&g[this.id].handlers[b.type];if(d&&d.length){var e,f,h,i,j=this;for(e=0,f=d.length;f>e;e++)h=d[e],i=j,"string"==typeof h&&"function"==typeof a[h]&&(h=a[h]),"object"==typeof h&&h&&"function"==typeof h.handleEvent&&(i=h,h=h.handleEvent),"function"==typeof h&&x(h,i,[b],c)}return this},S={ready:"Flash communication is established",error:{"flash-disabled":"Flash is disabled or not installed","flash-outdated":"Flash is too outdated to support ZeroClipboard","flash-unavailable":"Flash is unable to communicate bidirectionally with JavaScript","flash-deactivated":"Flash is too outdated for your browser and/or is configured as click-to-activate","flash-overdue":"Flash communication was established but NOT within the acceptable time limit"}},T=function(a,d){if(a||d&&d.type){d=d||{},a=(a||d.type).toLowerCase(),z(d,{type:a,target:d.target||b||null,relatedTarget:d.relatedTarget||null,currentTarget:c&&c.bridge||null});var f=S[d.type];return"error"===d.type&&d.name&&f&&(f=f[d.name]),f&&(d.message=f),"ready"===d.type&&z(d,{target:null,version:c.version}),"error"===d.type&&(d.target=null,/^flash-(outdated|unavailable|deactivated|overdue)$/.test(d.name)&&z(d,{version:c.version,minimumVersion:"11.0.0"})),"copy"===d.type&&(d.clipboardData={setData:K.setData,clearData:K.clearData}),"aftercopy"===d.type&&(d=I(d,e)),d.target&&!d.relatedTarget&&(d.relatedTarget=U(d.target)),d}},U=function(a){var b=a&&a.getAttribute&&a.getAttribute("data-clipboard-target");return b?document.getElementById(b):null},V=function(a){var e=a.target||b;switch(a.type){case"error":v(a.name,["flash-disabled","flash-outdated","flash-deactivated","flash-overdue"])&&z(c,{disabled:"flash-disabled"===a.name,outdated:"flash-outdated"===a.name,unavailable:"flash-unavailable"===a.name,deactivated:"flash-deactivated"===a.name,overdue:"flash-overdue"===a.name,ready:!1});break;case"ready":var f=c.deactivated===!0;z(c,{disabled:!1,outdated:!1,unavailable:!1,deactivated:!1,overdue:f,ready:!f});break;case"copy":var g,h,i=a.relatedTarget;!d["text/html"]&&!d["text/plain"]&&i&&(h=i.value||i.outerHTML||i.innerHTML)&&(g=i.value||i.textContent||i.innerText)?(a.clipboardData.clearData(),a.clipboardData.setData("text/plain",g),h!==g&&a.clipboardData.setData("text/html",h)):!d["text/plain"]&&a.target&&(g=a.target.getAttribute("data-clipboard-text"))&&(a.clipboardData.clearData(),a.clipboardData.setData("text/plain",g));break;case"aftercopy":K.clearData(),e&&e!==E()&&e.focus&&e.focus();break;case"mouseover":p(e,N.hoverClass);break;case"mouseout":N.autoActivate===!0&&K.deactivate();break;case"mousedown":p(e,N.activeClass);break;case"mouseup":q(e,N.activeClass)}};K.prototype.on=function(a,b){var d,e,f,h={},i=g[this.id]&&g[this.id].handlers;if("string"==typeof a&&a)f=a.toLowerCase().split(/\s+/);else if("object"==typeof a&&a&&"undefined"==typeof b)for(d in a)a.hasOwnProperty(d)&&"string"==typeof d&&d&&"function"==typeof a[d]&&this.on(d,a[d]);if(f&&f.length){for(d=0,e=f.length;e>d;d++)a=f[d].replace(/^on/,""),h[a]=!0,i[a]||(i[a]=[]),i[a].push(b);if(h.ready&&c.ready&&K.emit({type:"ready",client:this}),h.error){var j=["disabled","outdated","unavailable","deactivated","overdue"];for(d=0,e=j.length;e>d;d++)if(c[j[d]]){K.emit({type:"error",name:"flash-"+j[d],client:this});break}}}return this},K.prototype.off=function(a,b){var c,d,e,f,h,i=g[this.id]&&g[this.id].handlers;if(0===arguments.length)f=C(i);else if("string"==typeof a&&a)f=a.split(/\s+/);else if("object"==typeof a&&a&&"undefined"==typeof b)for(c in a)a.hasOwnProperty(c)&&"string"==typeof c&&c&&"function"==typeof a[c]&&this.off(c,a[c]);if(f&&f.length)for(c=0,d=f.length;d>c;c++)if(a=f[c].toLowerCase().replace(/^on/,""),h=i[a],h&&h.length)if(b)for(e=v(b,h);-1!==e;)h.splice(e,1),e=v(b,h,e);else i[a].length=0;return this},K.prototype.handlers=function(a){var b,c=null,d=g[this.id]&&g[this.id].handlers;if(d){if("string"==typeof a&&a)return d[a]?d[a].slice(0):null;c={};for(b in d)d.hasOwnProperty(b)&&d[b]&&(c[b]=d[b].slice(0))}return c},K.prototype.clip=function(a){a=w(a);for(var b=0;b<a.length;b++)if(a.hasOwnProperty(b)&&a[b]&&1===a[b].nodeType){a[b].zcClippingId?-1===v(this.id,i[a[b].zcClippingId])&&i[a[b].zcClippingId].push(this.id):(a[b].zcClippingId="zcClippingId_"+h++,i[a[b].zcClippingId]=[this.id],N.autoActivate===!0&&n(a[b],"mouseover",m));var c=g[this.id].elements;-1===v(a[b],c)&&c.push(a[b])}return this},K.prototype.unclip=function(a){var b=g[this.id];if(b){var c,d=b.elements;a="undefined"==typeof a?d.slice(0):w(a);for(var e=a.length;e--;)if(a.hasOwnProperty(e)&&a[e]&&1===a[e].nodeType){for(c=0;-1!==(c=v(a[e],d,c));)d.splice(c,1);var f=i[a[e].zcClippingId];if(f){for(c=0;-1!==(c=v(this.id,f,c));)f.splice(c,1);0===f.length&&(N.autoActivate===!0&&o(a[e],"mouseover",m),delete a[e].zcClippingId)}}}return this},K.prototype.elements=function(){var a=g[this.id];return a&&a.elements?a.elements.slice(0):[]};var W=function(a){var b,c,d,e,f,h=[];if(a&&1===a.nodeType&&(b=a.zcClippingId)&&i.hasOwnProperty(b)&&(c=i[b],c&&c.length))for(d=0,e=c.length;e>d;d++)f=g[c[d]].instance,f&&f instanceof K&&h.push(f);return h};N.hoverClass="zeroclipboard-is-hover",N.activeClass="zeroclipboard-is-active","function"==typeof define&&define.amd?define(function(){return K}):"object"==typeof module&&module&&"object"==typeof module.exports&&module.exports?module.exports=K:a.ZeroClipboard=K}(function(){return this}());var strings_danish = {
	title:'Brandisty',
	general:{
		login:'Log in',
		signUp:'Sign up',
		home:'Home'
	},
	p_brand:{
		brandguide:'Designguide',
		logos:'Logo',
		colors:'Farver',
		typography:'Typografi',
		images:'Billeder',
		allAssets:'Download alle filer',
		browsePages:'Oversigt',
		closePages:'Luk',
		primary:'Primært',
		alternate:'Alternativt',
		icon:'Ikon',
		secondary:'Sekundær',
		header:'Overskrift',
		paragraph:'Tekst',
		brand:'Designguide',
		poweredBy:'Powered by',
		getYourBrandspace:'Get your brandspace today'
	},
	l_pageChilds:{
		defaultParent:'Oversigt'
	}
};var strings_englishUs = {
	title:'Brandisty',
	general:{
		login:'Log in',
		signUp:'Sign up',
		home:'Home'
	},
	p_brand:{
		brandguide:'Brandguide',
		logos:'Logos',
		colors:'Colors',
		typography:'Typography',
		images:'Images',
		allAssets:'All assets',
		browsePages:'Browse pages',
		closePages:'Close pages',
		primary:'Primary',
		alternate:'Alternate',
		icon:'Icon',
		secondary:'Secondary',
		header:'Header',
		paragraph:'Paragraph',
		brand:'Brand',
		poweredBy:'Powered by',
		getYourBrandspace:'Get your brandspace today'
	},
	l_pageChilds:{
		defaultParent:'Home'
	}
};require.store["jn/builds.js"]=function(j,cb){var module = {};var jn;

var fs = require('fs');

var builds = module.exports = function(j,cb){
	jn = j;
	jn.builds = builds;


	cb.done();
};
var me = builds;




return module.exports(j,cb);};require.store["jn/comm.js"]=function(j,cb){var module = {};var jn;

var fs = require('fs');

var comm = module.exports = function(j,cb){
	jn = j;
	jn.comm = comm;


	jn.ch(function(d,ch){ //if socket, init
		if (jn.socket){
			//on reconnect send sendQueue events one at a time
			jn.socket.bind({
				bind:{connect:function(){
					var sess = jn.m('sess');
					if (sess.sendQueue){
						for (var i=0,len=sess.sendQueue.length;i<len;i++){
							var send = sess.sendQueue[i];
							//jn.log('send:',send.reqId);
							jn.socket.send({send:send});
						}
						sess.sendQueue = [];
					}
				}}
			});
		}
		ch.done();
	}).ch(function(d,ch){ //if no socket, start polling
		setTimeout(function(){
			comm.poll({},{
				fail:function(e){
					jn.log('poll failed:',e);
				},
				done:function(){} //polling will never be done
			});
		},1000);
	}).fail(function(e){
		jn.log('comm init fail:',e);
	});	
	

	cb.done();
};

var me = comm;

me.pollExpiration = 30000;
me.pollOffline = 5000;
me.pollCheck = 600000;
me.packDelimiter = '\n';

/*
receive (fun): receive communication (from web or socket)
	---a---
	[sess] (obj): if on node
	[path] (str): 'ent/m/users', on incoming messages
	[resCb] (str): 'done' or 'fail', on outgoing messages
	[reqId] (str): id of request (to keep track of responses to messages)
		if not defined, send response with this message
	(any): data to passthrough
*/
me.receive = function(a,cb){
	var me = this;
	var isCb = (cb)? true: false;
	cb = jn.dcb(cb);
	var sess = jn.sess(a);
	jn.ch(function(d,ch){ //if resCb (is a callback)
		if (!a.resCb || !a.reqId) return ch.done();
		//run cb for sent message

		if (sess.sendCb && sess.sendCb[a.reqId] && sess.sendCb[a.reqId][a.resCb]){
			//jn.log('run cb:',a.reqId,a.resCb);
			sess.sendCb[a.reqId][a.resCb](a);
			delete sess.sendCb[a.reqId];
		}
		cb.done();
	}).ch(function(d,ch){ //route message to an ent
		if (!a.path) return ch.done();
		if (a.path.indexOf('ent/') !== 0) return ch.done(); //if !ent, skip
		var p = a.path.substr(4);
		var ind = p.indexOf('/');
		if (ind === -1) return ch.fail('no ent recognized');
		var e = p.substr(0,ind);
		if (!isCb) var acb = {
			fail:function(res){
				if (typeof res == 'string') res = {res:res};
				res.reqId = a.reqId;
				res.resCb = 'fail';
				res = sess.a('prepSend',({send:res}));
				me.send({toSess:a.sess,send:res});
			},
			done:function(res){
				res = res || {};
				res.reqId = a.reqId;
				res.resCb = 'done';
				res = sess.a('prepSend',({send:res}));
				me.send({toSess:a.sess,send:res});
			}
		};
		else if (cb) var acb = cb;
		if (a.a) jn[e](p.substr(ind+1)).a(a,acb);
	}).cb(cb)
};

/*
poll (fun): for web, starts a poll post request (to receive data from node)
	---a---
	---cb---
	fail (fun): if any poll fails
	done (fun): since polling is never done, this should never be called
*/

me.poll = function(a,cb){
	var me = this;
	cb = jn.dcb(cb);
	//jn.log('poll send');
	var repollCb = {
		fail:function(){
			setTimeout(function(){
				me.poll({},cb);
			},me.pollOffline);
		},
		done:function(){}
	};
	jn.ch(function(d,ch){ //send poll
		me.send({send:{poll:true}},repollCb);
		ch.done();
	}).ch(function(d,ch){ //set poll timer (for if poll breaks)
		if (me.pollTimer) clearTimeout(me.pollTimer);
		me.pollTimer = setTimeout(function(){
			me.send({send:{poll:true}},repollCb);
		},me.pollCheck);
	}).fail(cb.fail);
};

/*
send (fun): for web, send to back end
	---a---
	[send] (obj):
		reqId
		path
		data
		dir
	---cb--- will be called once full message is complete, don't call done from within this method!
*/
me.send = function(a,cb){
	var me = this;
	cb = jn.dcb(cb);

	if (a.send === undefined) return cb.fail('no send defined');
	var send = jn.morph({t:a.send,clone:true});
	send.reqId = send.reqId || me.reqId();

	if (!send.resCb){ //in message, store cb
		var sess = jn.sess(a);
		sess.sendCb = sess.sendCb || {};
		sess.sendCb[send.reqId] = cb;
		//jn.log('sess sendCb:',sess.sendCb);
	}
	jn.ch(function(d,ch){ //TODO: send through socket
		if (!jn.socket) return ch.done();
		var socket = jn.m('socket');
		if (!socket.online) return ch.done();
		jn.socket.send({send:send});
	}).ch(function(d,ch){ //send POST request
		if (!jn.web) return ch.done();
		var pack = me.pack({pack:send});
		jn.web.post({path:'/comm/',post:pack},{
			fail:ch.done,
			done:function(res){
				if (a.send.poll) me.poll();
				var ary = me.unpack({unpack:res});
				for (var i=0,len=ary.length;i<len;i++){
					var msg = ary[i];
					//jn.log('receive:',msg);
					me.receive(msg);
				}
			}
		});
	}).ch(function(d,ch){ //if conn failed, queue and try to send again
		var sess = jn.sess(a);
		sess.sendQueue = sess.sendQueue || [];
		sess.sendQueue.push(send);
	}).fail(cb.fail);
};



/*
reqId (fun): gets a request id
	---a---
*/
me.reqId = function(a,cb){
	var me = this;
	me.reqInc = me.reqInc || 0;
	me.reqInc++;
	return jn.date({get:'ts'})+'_'+me.reqInc;
};

/*
pack (fun): packages data for a send
	---a---
	pack (obj or array)
*/
me.pack = function(a,cb){
	var me = this;
	cb = jn.dcb(cb);
	if (!a.pack) return '';
	try{
		var pack = a.pack;
		
		if (Object.prototype.toString.call(a.pack) !== '[object Array]'){ //is not array
			pack = [pack];
		}
		for (var i=0,len=pack.length;i<len;i++){
			pack[i] = JSON.stringify(pack[i]);
		}
		return pack.join(me.packDelimiter);
	}
	catch(e){
		cb.fail('pack err:',e);
	}
};

/*
unpack (fun): unpackages data from a send
	---a---
	unpack (str)
	---return---
	(ary): array of decoded JSON objects
*/
me.unpack = function(a,cb){
	cb = jn.dcb(cb);
	try{
		if (!a.unpack) return [];
		var unpack = a.unpack;
		if (typeof unpack == 'string'){
			unpack = unpack.split(me.packDelimiter);
			for (var i=0,len=unpack.length;i<len;i++){
				unpack[i] = JSON.parse(unpack[i]);	
			}
		}
		else if(typeof unpack == 'object'){
			unpack = [unpack];
		}
		return unpack;
	}
	catch(e){
		cb.fail('unpack err:',e);
	}
};


return module.exports(j,cb);};require.store["jn/core.js"]=function(j,cb){var module = {};/*
***** core *****
----------------
Constructs the builds
Core cannot be included into any builds
*/

var jn = {};

var core = module.exports = function(j,cb){
	var me = core;
	jn = j;

	jn.core = core;
	jn.require = core.require;
	jn.isStarted = false;

	jn.require('jn/tools.js',{
		fail:function(res){cb.fail(res)},
		done:function(){
			jn.ch(function(d,ch){
				if (jn.config.system == 'node') jn.dir({dir:'tmp',srcDir:jn.config.root+'jn'},ch);
				else ch.done();
			}).ch(function(d,ch){
				jn.require('jn/builds.js',ch);
			}).ch(function(d,ch){ //load all components
				me.includeDir({
					dir:'jn/',
					exclude:['core.js','tools.js','builds.js','tmp']
				},ch);
			}).ch(function(d,ch){
				if (jn.config.build && jn.config.build.include){
					jn.loop({ary:jn.config.build.include},{
						loop:function(loop){
							me.includeDir(jn.config.build.include[loop.i],{
								fail:ch.fail,
								done:function(){
									loop.next();
								}
							});
						},
						done:function(){
							ch.done();
						}
					});
				}
				else ch.done();
			}).ch(function(d,ch){
				if (!jn.socket) return ch.done();
				jn.socket.start({},ch);
			}).ch(function(d,ch){
				jn.isStarted = true;
				ch.done();
			}).cb(cb);	
		}
	});
};

/*
require (fun):
	---a---
	mod (str)
*/
core.require = function(mod,cb){
	require(jn.config.root+mod)(jn,cb);
};

/*
includeDir (fun): includes all contents of a directory
	[root] (str): directory root path, defaults to jn.config.paths.root
	dir (str): directory path - ex: 'components/' with trailing '/'
	[exclude] (ary): files and directories to not include
	[order] (ary): files and directories to include first - in order
	---cb---
	done (fun): callback after directory is included 
	fail (fun)
*/	
core.tmp = 1;
core.includeDir = function(a,cb){
	var me = this;

	a.root = a.root || jn.config.root;

	if (jn.config.system == 'node'){
		var fs = require('fs');
		fs.readdir(a.root+a.dir, function(err, files) {
			if (!files || err) return cb.done();
			files.sort();
			if (a.order) {
				var nAry = [];
				for(var i=0,len=a.order.length;i<len;i++) {
					var ind = files.indexOf(a.order[i]);
					if (ind != -1) nAry.push(files.splice(ind,1)[0]);
				}
				files = nAry.concat(files);
			}
			jn.loop({ary:files},{ 
				loop:function(loop){ //loop
					var file = files[loop.i];
					fs.stat(a.root+a.dir+file, function(err, stat) {
						if (a.exclude && a.exclude.indexOf(file) != -1) return loop.next(); //if file is in exclude ary
						if (!stat) return loop.next();
						if (stat.isDirectory()) { //is a directory
							me.includeDir({
								root:a.root,
								dir:a.dir+file+'/', 
								namespace:a.namespace, 
								exclude:a.exclude,
								order:a.order
							},{
								done:function(){
									loop.next();
								}
							});
							return;
						}
						if (file.indexOf('.js') != -1){ //is a js file
							var temp = 'jn/tmp/'+file+'.$tmp$.js';
							jn.ch(function(d,ch){
								//read file
								jn.builds.get({system:'node',file:a.root+a.dir+file,type:'node'},{
									fail:ch.fail,
									done:ch.done
								});
							}).ch(function(d,ch){
								fs.writeFile(jn.config.root+temp,d.output,'utf-8',function(err){
									if (err) return cb.fail(err);
									ch.done(d);
								});
							}).ch(function(d,ch){
								jn.require(temp,{
									fail:function(e){jn.log(e);},
									done:function(){
										ch.done(d);
									}
								});
								ch.done();
							}).ch(function(d,ch){
								//console.log(file,'unlink:',jn.config.root+temp);
								if (!jn.config.keepTmp) fs.unlink(jn.config.root+temp);
								ch.done();
							}).ch(loop.next).fail(cb.fail);

							return;
						}
						return loop.next();
					});
				},
				done:function(){ //loop complete
					cb.done();
				}
			});
		});
	}
	else if (jn.config.system == 'web'){
		//var exp = new RegExp('^'+a.dir);
		var exp = new RegExp(a.dir);
		jn.loop({obj:require.store},{
			loop:function(loop){
				var file = loop.prop.substr(loop.prop.lastIndexOf('/')+1);
				if (a.exclude && a.exclude.indexOf(file) != -1) return loop.next();
				if (loop.prop.match(exp)){
					jn.require(loop.prop,{
						fail:function(res){cb.fail(res);},
						done:function(){
							loop.next();
						}
					});
					return;
				}
				loop.next();
			},
			done:function(){
				cb.done();
			}
		});
	}
};

module.exports = core;	return module.exports(j,cb);};require.store["jn/ent.js"]=function(j,cb){var module = {};var jn;

var me = module.exports = function(j,cb){
	jn = j;
	jn.ent = me;
	jn.sess = me.sess;
	cb.done();
};

me.types = {
	e:{root:'ent',obj:'ent'},
	v:{root:'views',obj:'view'},
	g:{root:'groups',obj:'group'},
	s:{root:'session',obj:'sess'},
	m:{root:'models',obj:'model'}
};

/*
a_branch (fun): gets a branch for an ent based on its parents and current branch
*/
me.a_branch = function(a,cb){
	var b = {};
	var pars = [];
	var curEnt = a.ent;
	while (curEnt.parent){
		pars.push(curEnt.parent);
		curEnt = curEnt.parent;
	}
	for (var i=pars.length-1;i>0;i--){
		var branch = jn.morph({t:pars[i].branch,clone:true});
		b = jn.morph({t:b,merge:branch});
	}
	b = jn.morph({t:b,merge:a.ent.branch});
	a.ent.branch = b;
	return b;
};

/*
a_destroy (fun): deletes a model
	---a---
	ent
*/
me.a_destroy = function(a,cb){
	if (!a.ent) return cb.fail('no ent to destroy');
	var root = me.types[a.ent._type].root;
	if (!root) return cb.fail('ent type not recognized');
	if (jn[root].ents[a.ent._path]){
		delete jn[root].ents[a.ent._path];
	}
	cb.done();
};

me.sess = function(a){
	return jn.m('sess');
};

/*
a_prepSend (fun): prepares data to be sent, simplifies models down to paths
	---a---
	send
*/
me.a_prepSend = function(a,cb){
	//jn.log('prepSend:',a.ent._path,a.send);
	//if (a.send === undefined) return cb.fail('send not defined');
	a._level = a._level || 0;

	if (a.send === undefined){
		cb.done({noSend:true});
		return undefined;
	}
	a._level++;
	if (a._level > 2){
		cb.done({noSend:true});
		return a.send;
	}

	var type = jn.type(a.send);

	if (type == 'ary'){ //is an ary
		var send = [];
		for (var i=0,len=a.send.length;i<len;i++){
			send[i] = me.a_prepSend({send:a.send[i],_level:a._level},cb);
		}
		cb.done({noSend:true});
		return send;
	}
	else if(type == 'obj'){
		if (a.send._path){ //is an ent
			var send = {_path:a.send._path};
			cb.done({noSend:true});
			return send;
		}
		else {
			for (var i in a.send){
				a.send[i] = me.a_prepSend({send:a.send[i],_level:a._level},cb);
			}
		}
		cb.done({noSend:true});
		return a.send;
	}
	else {
		cb.done({noSend:true});
		return a.send;
	}
	
};


/*
a_send (fun)
	---a---
	[toSess]
	action
*/
me.a_send = function(a,cb){
	if (typeof a.action == 'string') a.action = {a:a.action};
	var action = jn.morph({t:a.action,clone:true});
	action = a.model.a('prepSend',{send:action});
	action.path = 'ent/'+a.ent._type+'/'+a.ent._path;

	//jn.log('send action:',jn.sess(a).id,action);
	jn.comm.send({
		toSess:a.toSess,
		send:action
	},cb);
};


/*
a_trigger (fun): triggers an event on entity
	---a---
	trigger
	ent
*/
me.a_trigger = function(a,cb){
	if (!a.ent._bind || !a.ent._bind[a.trigger]) return cb.done();
	var bind = a.ent._bind[a.trigger];
	var send = jn.morph({t:a,clone:true,shrink:['ent']});
	for (var i in bind){
		if (bind[i]) bind[i](send);
	}
	cb.done();
};

/*
a_bind (fun): binds callbacks to an entity
	---a---
	ent (obj)
	key (str)
	[*] (fun): any function
	---cb---
	fail
*/
me.a_bind = function(a,cb){
	if (!a.ent._bind) a.ent._bind = {};
	a.key = a.key || 'key';
	for (var i in a){
		if (typeof(a[i]) == "function"){
			if (!a.ent._bind[i]) a.ent._bind[i] = {};
			a.ent._bind[i][a.key] = a[i];
		}
	}
	cb.done();
};

/*
a_unbind (fun): binds callbacks to an entity
	---a---
	[key] (str): if key not defined will clear all
	[event] (str): if defined will only clear this event, if not defined will clear all with the corresponding key
	---cb---
*/
me.a_unbind = function(a,cb){
	if (!a.ent._bind) return cb.done();
	if (!a.event && !a.key) a.ent._bind = {};
	if (a.event){
		if (a.key){
			if (a.ent._bind[a.event][a.key]) delete a.ent._bind[a.event][a.key];
			return cb.done();
		}
		if (a.ent._bind[a.event]) delete a.ent._bind[a.event];
		return cb.done();
	}
	if (a.key){
		for (var i in a.ent._bind){
			if (a.ent._bind[i][a.key]) delete a.ent._bind[i][a.key];
		}
		return cb.done();
	}
};

/*
e (fun): creates or gets an entity
	---ent---
	path (str)
	---return---
	(obj): entity obj
		a(fun): call to perform an action on the entity
			a (str): action to perform
			ent (bool): true if action should be called on ent
			root
			patt
*/
me.e = function(en){

	//get all arguments and combine to the left
	if (typeof en == 'string') en = {_path:en};

	if (arguments.length > 1){ //more arguments
		for (var i=1,len=arguments.length;i<len;i++){
			en = jn.morph({t:en,merge:arguments[i],clone:true});
		}
	}

	en._type = en._type || 'e';
	en = me.path(en);
	en = me.ref(en);
	var b;
	/*
	var cb = {};
	cb.done = cb.done || function(){};
	cb.fail = cb.fail || function(e){'ent action fail:'+e;};
	*/

	/*
	child (fun): 
	*/
	en.child = function(b){
		if (typeof b == 'string'){
			var str = b;
			b = {};
			b[en._type] = str;
		}
		b.parent = en;
		b._type = en._type;
		arguments[0] = b;
		return me.e.apply(jn.ent,arguments);
	};
	
	//patt (fun): for storing and retrieving data in ent class
	en.patt = function(p){
		if (arguments.length < 2){ //is a get action
			if (jn[en._type][en._pattern] && jn[en._type][en._pattern][p]) return jn[en._type][en._pattern][p];
			return undefined;
		}
	};

	//define a (action)

	en.a = function(b){
		if (b === undefined) b = {};
		if (typeof b == 'string') b = {a:b};
		else b = jn.morph({t:b,clone:true});
		var cb = {};
		if (arguments.length > 1){ //more arguments
			for (var i=1,len=arguments.length;i<len;i++){
				if (i==len-1 && arguments[len-1] && arguments[len-1].fail) cb = arguments[len-1]; //take last argument as callbacks (if fail is defined)
				else if(arguments[i]) b = jn.morph({t:arguments[i],merge:b,clone:true});
			}
		}
		
		cb = jn.dcb(cb);
		var type = me.types[en._type];
		b[type.obj] = en;

		if (b.ent){
			if (jn.ent['a_'+b.a]){
				b.ent = en;
				return jn.ent['a_'+b.a](b,cb);
			}
			else cb.fail('no action found in ent:'+b.ent._path+' action:'+b.a);
		}
		else if (b.patt){
			if (jn[en._type][b.patt] && jn[en._type][b.patt]['a_'+b.a]) return jn[en._type][b.patt]['a_'+b.a](b,cb);
			else cb.fail('no action found in patt:'+b.patt);
		}
		else {
			if (jn[en._type][en._pattern] && jn[en._type][en._pattern]['a_'+b.a] && !b.root) return jn[en._type][en._pattern]['a_'+b.a](b,cb);
			else if (jn[type.root]['a_'+b.a]) return jn[type.root]['a_'+b.a](b,cb);
			else if (jn.ent['a_'+b.a]){
				b.ent = en;
				return jn.ent['a_'+b.a](b,cb);
			}
			else cb.fail('no action found:'+b.a);
		}
	};


	/*
	en.cb = function(cbR){
		cb = cbR;
		return en;
	};
	*/
	return en;
};

/*
ref (fun): creates or gets reference to ent 
	TODO: store ents in reddis
	---a---
	_path
*/
me.ref = function(a,cb){
	var root = me.types[a._type].root;
	if (jn[root].ents[a._path]) return jn[root].ents[a._path];
	else jn[root].ents[a._path] = a;
	return jn[root].ents[a._path];
};


/*
path (fun): creates or gets a path for an entity
	TODO: put path in alphabetical order
	---a---
*/
me.path = function(a,cb){
	//jn.log('path:',a._path,a.rec);
	if (a._path){
		var pAry = a._path.split('/');
		if (pAry.length < 1) pAry = [a._path];
		var pAry2 = pAry.pop().split('?');
		a._qry = jn.morph({unweb:pAry2[1]}) || {};
		if (pAry2[1]) a = jn.morph({t:a._qry,merge:a});
		if (pAry.length > 0){
			var parent = pAry.join('/');
			a.parent = jn[a._type](parent);
			//a.branch = jn.morph({t:a.parent.branch,clone:true,merge:a.branch});
		}
		a.branch = a.branch || {};
		a._pattern = pAry2[0];
		a[a._type] = a._pattern;
		//jn.log('path done:',a._path,a.rec);
		return a;
	}
	a._qry = jn.morph({t:a,clone:true,shrink:['_type','parent','_lastUsed',a._type]}) || {};
	if (a[a._type]) a._pattern = a[a._type];
	var qry = jn.morph({t:a._qry,web:true}) || '';
	a._path = a._pattern;
	if (qry != '?') a._path = a._path+qry;
	//jn.log('parent:',a._pattern,a.parent);
	if (a.parent){
		a.parent = jn[a._type](a.parent);
		if (a.parent._path) a._path = a.parent._path+'/'+a._path;
		//a.branch = jn.morph({t:a.parent.branch,clone:true,merge:a.branch});
	}
	a.branch = a.branch || {};
	return a;
};
return module.exports(j,cb);};require.store["jn/models.js"]=function(j,cb){var module = {};var jn;

var models = module.exports = function(j,cb){
	jn = j;
	jn.models = models;
	jn.m = models.e;

	jn.core.includeDir({dir:'models/'},{
		fail:cb.fail,
		done:cb.done
	});

	/*
	on reconnect, subscribe to all previously subscribed to models
	*/
	jn.socket.bind({
		bind:{
			reconnect:function(){
				//jn.m('users').a('auth');
				var sess = jn.m('sess');
				if (sess._subs){
					for (var i=0,len=sess._subs.length;i<len;i++){
						jn.m(sess._subs[i]).a('sub');
					}
				}
			}
		}
	});

};
var me = models;

/*
reserved fields
	path
	model
	a
	col
	db
	fields
*/

/*
a_rec (fun): creates an ent from a rec, stores rec on ent
	---a---
	rec
*/
me.a_rec = function(a,cb){
	if (!a.rec) return cb.fail('no rec defined');
	var model = jn.m(a.model.m,{id:a.rec.id});
	model.rec = a.model.a('filter',{rec:a.rec});
	return model;
};

/*
a_recs (fun): loop through recs and create models for each rec, store in group for model
	group is overwritten each time recs is called
	---a---
	recs
*/
me.a_recs = function(a,cb){
	if (!a.recs) return cb.fail('no recs defined');
	a.model.group = [];
	for (var i=0,len=a.recs.length;i<len;i++){
		var model = a.model.a('rec',{rec:a.recs[i]});
		a.model.group.push(model);
	}
	return a.model;
};

/*
a_trigger (fun): triggers models on front end (triggers touch on get and update)
	---a---
	[any]
	trigger
*/
me.a_trigger = function(a,cb){
	jn.ch(function(d,ch){ //trigger handler
		a.model.a('trigger_'+a.trigger,a,{
			fail:function(e){
				//jn.log('trigger handler failed:',e);
				ch.done();
			},
			done:ch.done
		});
	}).ch(function(d,ch){ //trigger model callbacks
		//jn.log('d:',d);
		a.model.a('trigger',{ent:true,trigger:a.trigger},a,d);

		if (['get','update'].indexOf(a.trigger) !== -1){
			//trigger touch
			a.model.a('trigger',{ent:true,trigger:'rec'},d);
		}
		ch.done();
	}).cb(cb);
};

/*
a_trigger_get (fun): triggers default front end get rec(s) behavior
	---a---
	rec
*/
me.a_trigger_get = function(a,cb){
	if (a.model.id){ //single
		//loop through model cbs and trigger get calls
		if (a.rec) a.model.rec = a.rec;
	}
	else { //group
		if (!a.recs) return cb.fail('no recs defined for get');
		var recs = a.recs;
		a.model.group = [];
		//loop through recs and create ents for each model
		for (var i=0,len=recs.length;i<len;i++){
			var model = jn.m(a.model.m,{id:recs[i].id});
			model.rec = recs[i];
			a.model.group.push(model);
		}
		//jn.log('get group:',a.model);
	}
	cb.done();
};

/*
a_trigger_add (fun): triggers default front end add rec behavior
	---a---
	rec
*/
me.a_trigger_add = function(a,cb){
	if (!a.rec) return cb.fail('no rec defined for add');
	//jn.log('trigger_add:',a.rec);
	var model = jn.m(a.model.m,{id:a.rec.id});
	model.rec = a.rec;
	a.model.group = a.model.group || [];
	a.model.group.push(model);
	cb.done({add:model});
};


/*
a_trigger_update (fun): triggers default front end update rec behavior
	---a---
	rec
*/
me.a_trigger_update = function(a,cb){
	//jn.log('trig update:',a.rec);
	if (!a.rec) return cb.fail('no rec defined for update');
	var model = jn.m(a.model.m,{id:a.rec.id});
	model.rec = a.rec;
	cb.done();
};

/*
a_trigger_remove (fun): triggers default front end update rec behavior
	---a---
	model
		id
*/
me.a_trigger_remove = function(a,cb){
	var model = jn.m(a.model.m,{id:a.rec.id});
	model.rec = a.rec;
	cb.done();
};




/*
a_sub (fun): subscribes to a model
	---a---
*/
me.a_sub = function(a,cb){
	a.model.a('send',{action:a},cb);
};


/*
a_pub (fun): publishes to a model
	---a---
	sess
*/
me.a_pub = function(a,cb){
	a.model.a({a:'send',action:a},cb);
};




/*
a_vals (fun): vals validates all data found in 'a' according to the fields specified in this call
	---a---
	[any]: will check every prop of 'a' 
		* do not define vals as a prop, or it will be overwritten
	[fields] (obj): if not defined, defaults to the default fields in pattern
*/
me.a_vals = function(a,cb){
	var check = jn.morph({t:a,clone:true});
	var vals = {};
	var fields = a.fields || a.model.patt('fields');
	var errors = {};
	var areErrors = false;
	jn.loop({obj:check},{
		loop:function(loop){
			var prop = loop.prop;
			if (fields[prop]){
				jn.check({
					rules:fields[prop],
					value:check[prop]
				},{
					done:function(res){
						vals[prop] = res;
						loop.next();
					},
					fail:function(err){
						areErrors = true;
						errors[prop] = err;
						loop.next();
					}
				});
			}
			else {
				loop.next();
			}
		},
		done:function(){
			if (areErrors) cb.fail(errors);
			cb.done({vals:vals});
			a.vals = vals;
		}
	});
};	

/*
a_get (fun): gets recs for a model
	---a---
	[sub] (bool): true to subscribe to the models found
*/
me.a_get = function(a,cb){
	//check ent first
	//if (a.model.rec) cb.done(a);
	if (a.model.id && a.model.rec){
		cb.done();
		//a.model.a('trigger',{trigger:'get',rec:a.model.rec},cb);
		return;
	}
	if (!a.model.id && a.model.recs){
		cb.done();
		return;
	}

	//send to back end to handle
	a.sub = (a.sub === undefined)? true: false;
	if (a.sub){ //subscribe to this model
		var sess = jn.m('sess');
		sess._subs = sess._subs || [];
		if (sess._subs.indexOf(a.model._path) === -1) sess._subs.push(a.model._path);
	}
	a.model.a('send',{action:a},{
		fail:cb.fail,
		done:function(res){
			if (a.model.id){ //single
				a.model.rec = res.rec;
				a.model.a('trigger',{trigger:'get',rec:res.rec});
			}
			else { //group
				//TODO fix to take in models in group
				a.model.a('trigger',{trigger:'get',recs:res.recs});
				a.model.recs = res.recs;
			}
			cb.done();
		}
	});

};



/*
a_add (fun): adds a model (stores in db)
	---a---
	add
*/
me.a_add = function(a,cb){
	a.model.a({a:'send',action:a},cb); //send to back end to handle
};



/*
a_update (fun): adds a model (stores in db)
	---a---
	where
	update
*/
me.a_update = function(a,cb){
	a.model.a({a:'send',action:a},cb); //send to back end to handle
};





/*
e (fun): creates or gets a view entity
	---a---
*/
me.e = function(a,cb){
	if (typeof a == 'string' && arguments.length == 1) a = {_path:a};
	else if (typeof a == 'string') a = {m:a};
	a._type = 'm';
	a._lastUsed = jn.date({get:'ts'});
	arguments[0] = a;
	//var cb = cb || {done:function(){},fail:function(e){'view create fail:'+e;}};
	return jn.ent.e.apply(jn.ent,arguments);
};

/*
ents (obj): stores all entities
*/
me.ents = {};return module.exports(j,cb);};require.store["jn/socket.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.socket = me;
	cb.done();
};


/*
bind (fun): 
	---a---
	bind (obj): {event:cb}
*/
me.bind = function(a,cb){
	if (!a.bind) return cb.fail('socket bind: no event defined');
	me.bound = me.bound || {};
	for (var i in a.bind){
		me.bound[i] = me.bound[i] || [];
		me.bound[i].push(a.bind[i]);
	}
};

/*
send (fun): 
	---a---
	send
*/
me.send = function(a,cb){
	cb = jn.dcb(cb);
	var sock = jn.m('socket');
	a.event = a.event || 'comm';
	sock.socket.emit(a.event,a.send);
	cb.done();
};


me.start = function(a,cb){
	cb = jn.dcb(cb);
	var sock = jn.m('socket');
	var reconnect = false;
	sock.socket = io.connect(jn.config.socketPath,{
		reconnect:true,
		'reconnection limit':1000,
		'max reconnection attempts':'Infinity'
	});
	sock.socket.on('connect', function(){
		if (sock.reconnTimer) clearInterval(sock.reconnTimer);
		
		reconnect = true;
		sock.online = true;
		//var sessId = jn.web.getCookie({key:'sessId'});
		var sessId = jn.config.sessId;
		jn.log('socket sessId:',sessId);
		sock.socket.emit('start',{sessId:sessId}); //send session to back end

		if (me.bound && me.bound.connect){
			for (var i=0,len=me.bound.connect.length;i<len;i++){
				me.bound.connect[i]();
			}
		}
		if (reconnect && me.bound && me.bound.reconnect){
			//jn.log('trig reconnect:',reconnect);
			for (var i=0,len=me.bound.reconnect.length;i<len;i++){
				me.bound.reconnect[i]();
			}
		}
	});
	sock.socket.on('disconnect',function(){
		//jn.log('socket disconnect');
		sock.online = false;
		if (me.bound && me.bound.disconnect){
			for (var i=0,len=me.bound.disconnect.length;i<len;i++){
				me.bound.disconnect[i]();
			}
		}
	});
	sock.socket.on('comm',function(req){
  		if (!req.reqId) return jn.log('no reqId defined in socket comm request');
  		jn.comm.receive(req);
  	});
	cb.done();
};

return module.exports(j,cb);};require.store["jn/tools.js"]=function(j,cb){var module = {};var jn;

var me = module.exports = function(j,cb){
	jn = j;
	jn.ch = me.ch;
	jn.loop = me.loop;
	jn.morph = me.morph;
	jn.log = me.log;
	jn.hash = me.hash;
	jn.format = me.format;
	jn.date = me.date;
	jn.check = me.check;
	jn.q = me.query;
	jn.dcb = me.dcb;
	jn.dir = me.dir; //creates new dir if doesn't exist
	jn.type = me.type;
	jn.compare = me.compare;
	jn.uriVars = me.uriVars;
	//TODO cleanup
	jn.qa = me.query;
	jn.tools = me;

	cb.done();
};

//NOTE: cannot put ~node and ~web tags in this file
me.uriVars = function(){
	var vars = {};
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i=0,len=hashes.length;i<len;i++){
        var hash = hashes[i].split('=');
        vars[hash[0]] = decodeURIComponent(hash[1]);
    }
    return vars;
};

/*
compare (fun): true if 2 json objects match
	---obj1---
	---obj2---
*/
me.compare = function(a1,a2){
	//jn.log('compare:',jn.morph({t:a1,freeze:true}),jn.morph({t:a2,freeze:true}));
	return jn.morph({t:a1,freeze:true}) == jn.morph({t:a2,freeze:true})? true: false;
};

/*
dir (fun): 
	---a---
	dir
	srcDir
*/
var fs = require('fs');
me.dirs = {};
me.dir = function(a,cb){
	cb = me.dcb(cb);

	a.srcDir = a.srcDir.replace(/\/$/,'');

	var dirs = a.dir.split('/');

	//build each dir only once per startup
	if (me.dirs[a.dir]) return cb.done();
	me.dirs[a.dir] = true;

	//console.log('dirs:',dirs,a.srcDir);
	var dirBase = '/';
	jn.loop({
		ary:dirs
	},{
		loop:function(loop){
			var path = a.srcDir+dirBase+dirs[loop.i];
			fs.stat(path,function(err,stats){
				dirBase += dirs[loop.i]+'/';
				//console.log('create path:',path);
				if (err || !stats.isDirectory()) { //no dir
					fs.mkdir(path, function(){
						return loop.next();
					});
					return;
				} 
				return loop.next();
			});
		},
		done:function(){
			return cb.done(dirBase);
		}
	});
};

/*
dcb (fun): defines a cb to have at least done and fail by default
	---cb---
*/
me.dcb = function(cb){
	cb = cb || {};
	if (!cb.done) cb.done = function(){};
	if (!cb.fail) cb.fail = function(e){console.log('fail:',e)};
	return cb;
};

/*
query (fun):
	---a---
*/
me.query = function(a,cb) {
	me.dcb(cb);
	if (!jn[jn.config.query]) return cb.fail('no query module defined');
	jn[jn.config.query].a(a,cb);
};


/*
type (fun): retrieves a variable's type
	val (any)
*/
me.type = function(val,check,fail){
	var f = function(){if (fail) fail(); return false;};
	if (arguments.length < 1) return true;
	if (arguments.length == 1){ //return type
		if (val === undefined) return 'und';
		if (val === null) return 'nul';
		if (val === true || val === false) return 'bool';
		var type = typeof val;
		if (type == 'string') return 'str';
		if (type == 'number') return 'num';
		if (type == 'function') return 'fun';
		if (Object.prototype.toString.call(val) == '[object Array]') return 'ary';
		return 'obj';
	} 
	var type = me.type(val);
	if (check.type && check.type != type){
		if (check.type == 'num'){
			try{
				a.value = Number(a.value);
			} catch(e){
				cb.fail('not a valid number');
				return false
			}
		}
		return f('not '+type);
	}

};

/*
check (fun): checks a single value against a set of rules
	value (any):
	check (obj): rules to check
		type
			str
			num
			ary
			bool
			fun
			obj
			und
			nul
		[minLen] (num): minimum length of input
		[maxLen] (num): maximum length
		[email] (bool): true to test if value is an email
		[phone] (str): 'US' to check for valid USA phone number
		[bool] (bool): converts value to a boolean
		[int] (bool): converts to integer and errors if failed
		[timestamp] (bool): tests if value is a valid timestamp
	value (any): value to test
	---cb---
	fail (fun) also returns false
*/
me.check = function(a,cb){
	cb = me.dcb(cb);

	if (!a.rules){
		cb.fail('no rules defined');
		return false;
	}

	if (a.rules.email) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!re.test(a.value)){
			cb.fail('not a valid email');
			return false;
		}
	}
	if (a.rules.phone) {
		try {
			a.value = a.value.replace(/[^0-9]/g, '');
		} catch(e){
			cb.fail('not a valid phone number');
			return false;
		}
		if (a.rules.phone == 'US' && a.value.length != 10){
			cb.fail('not a valid US phone number');
			return false;
		}
	}
	if (a.rules.type){
		var type = jn.type(a.value);
		if (a.rules.type !== type){
			cb.fail('not of type '+a.rules.type);
			return false;
		}
	}
	if (a.rules.timestamp){
		try{
			new Date(a.value);
		} catch(e){
			cb.fail('not an valid timestamp');
			return false;
		}
	}
	if (a.rules.min) {
		if (a.value.length < a.rules.min){
			cb.fail('less than minimum length '+a.rules.min);
			return false;
		}
	}
	if (a.rules.max) {
		if (a.value.length > a.rules.max){ 
			cb.fail('greater than maximum length '+a.rules.max);
			return false;
		}
	}
	if (a.rules.illegalChars){
		if (a.rules.illegalChars.test(a.value)){
			cb.fail('illegal characters');
			return false;
		}
	}

	cb.done(a.value);
	return true;
};

/*
date (fun): 
	---a---
	D (date obj)
	ts (num): timestamp 
	get (str): 'ts' or 'ago',
*/
me.date = function(a){
	if (!a.D && !a.ts) a.D = new Date();
	var D = a.D || new Date(a.ts);
	if (a.get) {
		switch(a.get){
			case 'ts':
				return D.getTime();
			case 'ago':
				var curD = new Date();
				var nowTs = curD.getTime();
				var diff = nowTs - D.getTime();
				if (diff < 2*me.date.sec) return '1 sec ago';
				if (diff < me.date.min) return Math.round(diff/me.date.sec)+' secs ago';
				if (diff < me.date.hour) return Math.round(diff/me.date.min)+' min ago';
				if (diff < 2*me.date.hour) return '1 hr ago';
				if (diff < me.date.day) return Math.round(diff/me.date.hour)+' hrs ago';
				if (diff < 2*me.date.day) return 'yesterday';
				if (diff < me.date.week) return Math.round(diff/me.date.day)+' days ago';
				if (diff < 2*me.date.week) return 'a week ago';
				if (diff < me.date.month) return Math.round(diff/me.date.week)+' weeks ago';
				if (diff < 2*me.date.month) return 'a month ago';
				if (diff < me.date.year) return Math.round(diff/me.date.month)+' months ago';
				if (diff < 2*me.date.year) return 'a year ago';
				return Math.round(diff/me.date.year)+' years ago';
			case 'day':
				var dayD = new Date(D.getFullYear(),D.getMonth(),D.getDate());
				var curD = new Date();
				var curDayD = new Date(curD.getFullYear(),curD.getMonth(),curD.getDate());
				if (dayD.getTime() == curDayD.getTime()) return 'Today';
				if (curDayD.getTime() <= dayD.getTime()+me.date.day+me.date.hour) return 'Yesterday'; //add hr for daylight savings
				if (curDayD.getTime() <= dayD.getTime()+me.date.week+me.date.hour) return me.date({D:dayD,get:'weekday'});
				else return (curDayD.getMonth()+1)+'/'+(curDayD.getDate())
			case 'in':
				var nowTs = new Date().getTime();
				var diff = D.getTime() - nowTs;
				if (diff < 2*me.date.sec) return '1 sec';
				if (diff < me.date.min) return Math.round(diff/me.date.sec)+' secs';
				if (diff < me.date.hour) return Math.round(diff/me.date.min)+' min';
				if (diff < 2*me.date.hour) return '1 hr';
				if (diff < me.date.day) return Math.round(diff/me.date.hour)+' hrs';
				if (diff < me.date.week) return Math.round(diff/me.date.day)+' days';
				if (diff < 2*me.date.week) return 'a week';
				if (diff < me.date.month) return Math.round(diff/me.date.week)+' weeks';
				if (diff < 2*me.date.month) return 'a month';
				if (diff < me.date.year) return Math.round(diff/me.date.month)+' months';
				if (diff < 2*me.date.year) return 'a year';
				return Math.round(diff/me.date.year)+' years';
			case 'month':
				var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
				return months[D.getMonth()];
			case 'weekday':
				var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
				return days[D.getDay()];
			case 'time':
				var hour = D.getHours();
				var min = D.getMinutes();
				if (hour == 12){
					var ap = 'p';
				}
				else if (hour > 12){
					var ap = 'p';
					hour = hour - 12;
				}
				else if (hour == 0){
					var ap = 'a';
					hour = 12;
				}
				else {
					var ap = 'a';
				}
				if (String(min).length < 2) min = '0'+min;
				return hour+':'+min+ap;
			case 'mdy':
				return (D.getMonth()+1)+'/'+(D.getDate())+'/'+(String(D.getFullYear()).substr(2));
			case 'md':
				return (D.getMonth()+1)+'/'+(D.getDate());
			case 'utcStr':
				return D.toUTCString();
		}
	}
};

me.date.sec = 1000;
me.date.min = 1000*60;
me.date.hour = 1000*60*60;
me.date.day = 1000*60*60*24;
me.date.week = 1000*60*60*24*7;
me.date.month = 1000*60*60*24*30;
me.date.year = 1000*60*60*24*365;

/*
format (fun): formats a string
	t (str): string to be formatted
	upper (str): 'first', 'all',
	truncate (num): length to truncate
	phone (str): 'usa' for us phone numbers
	trim (str): 'spaces' trims off all whitespace
*/
me.format = function(a){
	if (!a.t && a.t === undefined) return '';
	if (a.upper) {
		if (a.upper == 'first') a.t = a.t.charAt(0).toUpperCase()+a.t.slice(1);
		if (a.upper == 'all') a.t = a.t.toUpperCase();
	}
	if (a.lower) {
		if (a.lower == 'all') a.t = a.t.toLowerCase();
	}
	if (a.truncate) {
		if (a.t.length > a.truncate) a.t = a.t.substr(0,a.truncate)+'...';
	}
	if (a.phone) {
		if (a.phone == 'usa' && a.t.length > 0){
			a.t = a.t.replace(/[^0-9]/g,'');
			a.t = a.t.substr(0,3)+'-'+a.t.substr(3,3)+'-'+a.t.substr(6,4);
		}
	}
	if (a.trim) {
		if (a.trim == 'spaces') a.t = a.t.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		if (a.trim == 'nonAlphaNumeric') a.t = a.t.replace(/[^a-zA-Z_0-9]/g,'');
	}
	if (a.currency){
		if (a.currency == 'usd') {
			if (!a.noCents){
				var p = a.t.toFixed(2).split(".");
			    a.t = ["$", p[0].split("").reverse().reduce(function(acc, num, i) {
			        return num + (i && !(i % 3) ? "," : "") + acc;
			    }, "."), p[1]].join("");
			}
			else {
				var val = Math.round(a.t);
				var rgx = /(\d+)(\d{3})/;
				while (/(\d+)(\d{3})/.test(val.toString())){
			    	val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
			    }
				return '$'+val; 
			}
		}
	}
	return a.t;
};


/*
randStr (fun): used to generate random character strings on the client
	---a---
	[len] (num)
*/
me.randStr = function(a,cb){
	var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var result = '';
    for (var i=a.len; i>0; i--) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
};


/*
log (fun):
*/
me.log = function(){
	if (console){
        console.log.apply(console,arguments);
    }
};

/*
morph (fun): morph manipulates objects in a number of different ways
	---a---
	[thaw] (str): creates the target obj from a string
	[unweb] (str): convert query format to obj
	t (obj): the obj to be morphed
	[clone] (bool): if true, creates a shallow copy of the obj
	[merge] (obj): merges this object into the target, target properties are overwritten
	[shrink] (str or ary): removes attributes specified by shrink
	[separate] (ary): removes all attributes NOT in the ary
	[sort] (bool): puts object keys in order
	[web] (bool): turns the object into a query string
	[freeze] (bool): turns object into a string
*/
me.morph = function(a){
	if (a.unweb) {
		a.unweb = a.unweb.replace(/\?/, '');
		//a.unweb = unescape(a.unweb);
		var ary = a.unweb.split('&');
		a.t = {};
		for (var i=0,len=ary.length;i<len;i++){
			var v = ary[i].split('=');
			try {
				a.t[v[0]] = JSON.parse(decodeURIComponent(v[1]));
			}
			catch(e){
				a.t[v[0]] = decodeURIComponent(v[1]);
			}
		}
	}
	if (a.thaw) {
		try {	
			a.t = JSON.parse(a.thaw);
		} catch(e){
			a.t = {};
		}
	}
	if (!a.t) return a.t;
	if (a.clone){
		var t = {};
		for (var attr in a.t) {t[attr] = a.t[attr];}
		a.t = t;
	}
	if (a.merge){
		for (var attr in a.merge){a.t[attr] = a.merge[attr];}
	}
	if (a.shrink){
		if (a.shrink instanceof Array) {
			for (var i=0,len=a.shrink.length;i<len;i++){
				if (a.t[a.shrink[i]]) delete a.t[a.shrink[i]];
			}
		}
		else if (typeof a.shrink == 'string'){
			if (a.t[a.shrink]) delete a.t[a.shrink];
		}
	}
	if (a.separate){
		for (var i in a.t){
			if (a.separate.indexOf(i) === -1) {
				delete a.t[i];
			}
		}
	}
	if (a.sort){
		var sort = [];
		for (var i in a.t){
			sort.push(i);
		}
		sort.sort();
		var sorted = {};
		for (var i=0,len=sort.length;i<len;i++){
			sorted[sort[i]] = a.t[sort[i]];
		}
		a.t = sorted;
	}
	if (a.web){
		var str='',first=true;
		for (var i in a.t){
			if (!first) str += '&';
			if (typeof a.t[i] == 'object'){
				str += i+'='+encodeURIComponent(JSON.stringify(a.t[i]));
			}
			else str += i+'='+encodeURIComponent(a.t[i]);
			first = false;
		}
		//str = escape(str);
		if (str != '') str = '?'+str;
		return str;
	}
	if (a.freeze){
		try {
			var str = JSON.stringify(a.t);
		} catch(e){return {}}
		return str;
	}
	return a.t;
};

/*
loop (fun): asynchronous loop method that iterates many different formats
	---a---
	ary (ary): loop will iterate through each element in ary
	obj (obj): loops for each property in obj
	for (obj): loop will act similar to for loop
		i (num): start value of i
		where (obj): if where evaluates to false loop stops
			$lt (num): less than
			$lte (num): less than or equal to
			$gt (num): greater than
			$gte (num): greater than or equal to
		iter (obj): defines what occurs after each iteration of loop
			$inc (num): each iteration increment factor
	---cb---
	loop (fun)
		---obj---
		i (num): current iteration i
		[prop] (str): only defined if an obj is passed into loop
		loop (fun): call this to start the next iteration of loop
	done (fun)
	fail (fun)
*/
me.loop = function(a,cb) {
	me.dcb(cb);

	var cond = true;
	if (a.i === undefined) a.i=0;
	var next = a.i+1;
	var prop;
	if (a.ary) { //is an array
		if (!a.len) a.len=a.ary.length;
		
		cond = a.i < a.len;
	}
	else if (a.obj){
		var i=0;
		for (var p in a.obj) {
			if (i==a.i){
				prop = p;
				break;
			}
			i++;
		}
		if (!prop) cond = false;
	}
	else if (a.for) { //for loop
		if (!a.for.where) return cb.fail('no where defined');
		if (!a.for.iter) return cb.fail('no iter defined');
		if (!a.i) a.i = (a.for.i)? a.for.i: 0;
		if (a.for.where.$lte) cond = a.i <= a.for.where.$lte;
		else if (a.for.where.$lt) cond = a.i < a.for.where.$lt;
		else if (a.for.where.$gte) cond = a.i >= a.for.where.$gte;
		else if (a.for.where.$gt) cond = a.i > a.for.where.$gt;
		if (a.for.iter.$inc) next = a.i+a.for.iter.$inc;
	}
	if (cond) {
		if (!cb.loop) return cb.fail('no loop callback');
		var loop = {
			i:a.i,
			next:function(){
				//console.log('i:'+i+' ary:'+ary[i]);
				a.i = next;
				me.loop(a, cb);
			},
			done:cb.done
		};
		if (prop) loop.prop = prop;
		cb.loop(loop);
	}
	else {
		cb.done();
	}
};

/*
ch (fun): chain
	a (fun): first function to execute in the ch
	return (obj): chainable with done, loop, and fail
		[done] (fun): done calls the done ch method in the queue
		[loop] (fun): loop calls the current ch method in the queue, again
		[fail] (fun): fail calls the done fail method in the ch

*/
me.ch = function(a){
	var inc = 0;
	var queue = [{ch:a}]; //build queue with json object

	var done = function(res){
		if (this.called) return; //prevents done from being called twice
		while(inc<queue.length-1 && !this.called){
			inc++;
			if (queue[inc].ch){
				if (typeof queue[inc].ch == 'function'){
					if (res === undefined) res = {};
					queue[inc].ch(res,{done:done,loop:loop,fail:failCb});
				}
				this.called = true;
			}
		}
	};

	var loop = function(res){
		if (this.called) return; //prevents loop from being called twice
		while(inc<queue.length && !this.called){
			if (queue[inc].ch){
				if (typeof queue[inc].ch == 'function'){
					if (res === undefined) res = {};
					if (res.obj){

					}
					queue[inc].ch(res,{done:done,loop:loop,fail:failCb});
				}
				this.called = true;
			}
			else {
				inc++;
			}
		}
	};

	var failCb = function(res){
		if (this.called) return; //prevents done from being called twice
		//jn.log('ch fail:',queue);
		while(inc<queue.length-1 && !this.called){
			inc++;
			if (queue[inc].fail){
				if (typeof queue[inc].fail == 'function'){
					if (res === undefined) res = {};
					queue[inc].fail(res,{done:done,loop:loop,fail:failCb});
				}
				this.called = true;
			}
		}
	};
	setTimeout(function(){
		a({},{
			done:done,
			loop:loop,
			fail:failCb
		});
	},1);
	var ch = function(b){
		queue.push({ch:b});
		return this;
	};
	var fail = function(b){
		queue.push({fail:b});
		return this;
	};
	var cbCb = function(b){
		for (var i in b){
			if (typeof b[i] == 'function' && i=='done' || i=='fail'){
				var bObj = {};
				if (i=='done') bObj.ch = b.done; //oops
				else bObj[i] = b[i];
				queue.push(bObj);
			}
		}
		return this;
	};
	return {
		ch:ch,
		fail:fail,
		cb:cbCb
	}
};return module.exports(j,cb);};require.store["jn/views.js"]=function(j,cb){var module = {};
var jn;

var views = module.exports = function(j,cb){
	jn = j;
	jn.views = views;
	jn.v = views.e;
	cb.done();
};
var me = views;

//TODO: change data (prop of view) to _class


/*
a_str (fun): writes all strings in a view
	---a---
	cat
*/
me.a_str = function(a,cb){
	var v = a.view;
	v.$el.find('[str]').each(function(){
		var $this = $(this);
		var str = $this.attr('str');
		//jn.log('cat:',a.cat);
		$this.html(jn.m('strings').a('get',{view:v,cat:a.cat,str:str}));
	});
};


/*
a_access (fun): hides all access tags and then shows only those that match access ary passed in
	---a---
	access (ary or str)
*/
me.a_access = function(a,cb){
	var $el = a.view.a('$el');
	if (!a.access) return cb.fail('no access defined');
	var acc = (jn.type(a.access) != 'ary')? [a.access]: a.access; 

	$el.find('[access]').hide();
	//get all access tags and loop through them
	$el.find('[access]').each(function(){
		var $acc = $(this);
		var accProp = $acc.attr('access');
		for (var i=0,len=acc.length;i<len;i++){
			if (accProp.indexOf(acc[i]) !== -1) $acc.show();
		}
	});
	cb.done();
};

/*
a_section (fun): 
	---a---
	[show] (str): section to show, by default hides all others
*/
me.a_section = function(a,cb){
	var $el = a.view.a('$el');
	//if ($el.only) $el.only.find('[section]').hide();
	$el.find('[section]').hide();
	if (typeof a.show == 'string') $el.find('[section="'+a.show+'"]').show();
	cb.done();
};

/*
a_props (fun): fills in all props in the view
	---a---
	[props] (obj):
	[model] (obj): if props is not defined and model has a rec, use rec
*/
me.a_props = function(a,cb){
	var $el = a.view.a('$el');
	if (!$el) return cb.fail('no $el');
	if (!a.props && a.model && a.model.rec) a.props = a.model.rec;
	if (!a.props) return cb.fail('no props defined');
	$el.find('[prop]').addBack('[prop]').filter(function(){
		return $(this).closest('[v]').attr('v') == a.view.v; //don't write props of sub views
	}).each(function(){
		var $p = $(this);
		var prop = $p.attr('prop');
		if (a.props[prop] && (typeof a.props[prop] == 'string' || typeof a.props[prop] == 'number')){
			if ($p.is('input') || $p.is('select')){
				$p.val(a.props[prop]);
			}
			else if ($p.is('img')){
				$p.attr({src:a.props[prop]});
			}
			else {
				$p.html(a.props[prop]);
			}
		}
	});
	cb.done();
};

/*
a_model (fun): binds view to a model
	---a---
	model
	[touch] (fun)
	[get] (fun)
	[update] (fun)
	[remove] (fun)
*/
me.a_model = function(a,cb){
	a.model = a.model || a.view.model;
	if (!a.model) return cb.fail('view.a_model: no model defined');
	//cb.done must be called after rec is retrieved
	a.model.a('bind',{
		key:a.view._path,
		rec:function(){ //triggered on group get and updates (refresh)
			if (a.rec) a.rec();
			else if (jn.v[a.view.v].a_rec) a.view.a('rec');
		},
		get:function(){ 
			if (a.get) a.get();
			else if (jn.v[a.view.v].a_get) a.view.a('get');
		},
		update:function(){ 
			if (a.update) a.update();
			else if (jn.v[a.view.v].a_update) a.view.a('update');
		},
		remove:function(){
			if (a.remove) a.remove();
			else if (jn.v[a.view.v].a_remove) a.view.a('remove');
		}
	});
	if (!a.model.rec) return a.model.a('get',cb);
	if (a.rec) a.rec();
	else if (jn.v[a.view.v].a_rec) a.view.a('rec');
	cb.done();
};

/*
a_list (fun): lists and binds to a group in a view
	---a---
	model (obj): model to bind to
	list (obj): view to show (id is appended to view path)
	[get] (fun)
	[group] (fun)
	[add] (fun)
	[remove] (fun)
	[rebuild] (bool)
*/
me.a_list = function(a,cb){
	var v = a.view;
	//jn.log('list:',a.model.find);
	var add = function(id,done){
		var child = v.child(a.list,{id:id});
		if (a.add) a.add(child);
		child.a('show',{rebuild:a.rebuild},{
			fail:cb.fail,
			done:done
		});
	};

	a.model.a('bind',{
		key:v._path,
		get:function(){ //triggered on group get and updates (refresh)
			/*
			//jn.log('list get:');
			jn.ch(function(d,ch){
				ch.done();
				//a.view.a('clear',{clear:a.list},ch); //clears all childs of view type defined in clear
			}).ch(function(d,ch){ //show all child pages
				//jn.log('list group:',a.model.group);
				var childs = a.model.group;
				if (childs.length < 1) return cb.done();
				jn.loop({
					ary:childs
				},{
					loop:function(loop){
						var rec = childs[loop.i];
						add(rec.id,loop.next);
					},
					done:ch.done
				});
			}).cb(cb);
			*/
		},
		add:function(res){ //contains model that was added
			//jn.log('add trig in view:',res.add);
			if (res.add) add(res.add.id,function(){});
		},
		remove:function(res){ //contains model that was removed
			if (res.model) a.view.child(a.list,{id:res.model.id}).a('hide');
		}
	});
	a.model.a('get',{
		fail:cb.fail,
		done:function(){
			var recs = a.model.recs;
			if (a.get) a.get();
			//jn.log('list recs:',recs);
			if (recs.length < 1) return cb.done();
			jn.loop({
				ary:recs
			},{
				loop:function(loop){
					var rec = recs[loop.i];
					add(rec.id,loop.next);
				},
				done:cb.done
			});
		}
	});
};

/*
a_go (fun): used to direct the user to a view by affecting the browser path
	---a---
	silent (bool): true if don't populate into location bar
*/
me.a_go = function(a,cb){
	//remove base from path
	//jn.log('path:',a.view._path);

	if (a.silent){
		me.showPath({path:a.view._path},cb);
	}
	else {
		var path = (a.view._path.indexOf(jn.config.vRoot) == 0)? a.view._path.replace(jn.config.vRoot,''): 
			a.view._path;
		window.location = '#!'+path;
		cb.done();
	}
};

/*
a_reset (fun): resets all prop elements to blank values
	---a---
*/
me.a_reset = function(a,cb){
	var $el = a.view.a('$el');

	var props = $el.find('[prop]').addBack('[prop]');
	for (var i=0,len=props.length;i<len;i++){
		var $e = $(props[i]);
		if ($e.is('input[type="text"]') || $e.is('select')) {
			$e.val('');
		}
		else if ($e.is('input[type="checkbox"]')) {
			if ($e.is(':checked')) $e.removeAttr('checked');
		}
		else if ($e.is('img')) {
			$e.attr({'src':''});
		}
		else {
			$e.html('');
		}
	}
};

/*
a_set (fun): sets all [prop] elements to the values defined in a
	---a---
*/
me.a_set = function(a,cb){
	var $el = a.view.a('$el');
	var props = $el.find('[prop]').addBack('[prop]');
	for (var i=0,len=props.length;i<len;i++){
		var $e = $(props[i]);
		var prop = $e.attr('prop');
		if (a[prop] !== undefined){
			if ($e.is('input[type="text"]') || $e.is('input[type="password"]') || $e.is('select')) {
				$e.val(a[prop]);
			}
			else if ($e.is('input[type="checkbox"]')) {
				if (a[prop] == $e.attr('value')) $e.attr({checked:'checked'});
			}
			else if ($e.is('img')) {
				$e.attr({'src':a[prop]});
			}
			else {
				$e.html(a[prop]);
			}
		}
	}
	cb.done();
};

/*
a_vals (fun): pulls all values from a view, values come from input elements with [prop=""]
	---a---
	$el
*/
me.a_vals = function(a,cb){
	var $el = a.view.a('$el');

	a.$el = a.$el || $el;
	var data = {};
	a.$el.find('input[prop],select[prop],checkbox[prop],textarea[prop]').each(function(){
		var $inp = $(this);
		if ($inp.attr('type') == 'radio' || $inp.attr('type') == 'checkbox'){
			console.log('check:',$inp.is(':checked'),$inp.val());
			if ($inp.is(':checked')) data[$inp.attr('prop')] = $inp.val();
			else data[$inp.attr('prop')] = false;
		}
		else {
			data[$inp.attr('prop')] = $inp.val();
		}
	});
	return data;
};

/*
a_btn (fun): turn an element into a button (works on mobile and web)
	TODO: make btn work with default view actions
	---a---
	[btnTime] (num): number of milliseconds to register click
	[touched] (fun): cb if touched
	[released] (fun): cb if btn released
	[click] (fun): cb if clicked
	---cb---
*/
me.a_btn = function(a,cb){

	var $el = a.view.a('$el');
	var btnTime = a.btnTime || 500;
	var down = function(){
		var $this = $(this);
		$this.addClass('touched');
		$this.btn = $this.attr('btn');
		if (a.touched) a.touched($this);

		var scroll = $(window).scrollTop();
		var ts = jn.date({get:'ts'});
		var expire = ts+btnTime;

		$this.one('mouseup touchend',function(){
			if (Math.abs($(window).scrollTop()-scroll) > 10) return;
			var curTs = jn.date({get:'ts'});
			if (curTs < expire){
				jn.log('btn click:',$this.btn,a.view.v);
				if (a[$this.btn]) a[$this.btn]($this.btn,{$btn:$this});
				else if (jn.v[a.view.v]['a_'+$this.btn]) a.view.a($this.btn,{$btn:$this});
			} 
			//$('body').off('mouseup touchend');
		});

		$('body').one('mouseup touchend',function(){
			$this.removeClass('touched');
			if (a.released) a.released($this);
			//$this.off('mouseup touchend');
			//return false;
		});
	};
	if ($el.attr('btn')) $el.on('mousedown touchstart',down);
	else $el.on('mousedown touchstart','[btn]',down);

	//bind only once to body
	/*
	//full body bind (slow but only one bind)
	var btnTime = a.btnTime || 500;
	if (!me.btnBound) {
		$('body').on('mousedown touchstart','[btn]',function(){
			var $this = $(this);
			$this.addClass('touched');
			$this.btn = $this.attr('btn');
			if (a.touched) a.touched($this);

			var scroll = $(window).scrollTop();
			var ts = jn.date({get:'ts'});
			var expire = ts+btnTime;

			$this.one('mouseup touchend',function(){
				if (Math.abs($(window).scrollTop()-scroll) > 10) return;
				var curTs = jn.date({get:'ts'});
				if (curTs < expire){
					//look through parents for all v's above it, trigger btn on nearest parent () (bubbling?)
					jn.log('btn click:',$this.btn);

					//check if btnViews
					var btnViews = $this.data('btnViews');
					if (!btnViews) return;
					for (var i=0,len=btnViews.length;i<len;i++){
						var view = jn.v(btnViews[i]);
						if (jn.v[view.v]['a_'+$this.btn]) view.a($this.btn,{$btn:$this});
					}
				} 
				$('body').off('mouseup touchend');
			});

			$('body').one('mouseup touchend',function(){
				$this.removeClass('touched');
				if (a.released) a.released($this);
				$this.off('mouseup touchend');
				return false;
			});
		});
		me.btnBound = true;
	}

	//attach view to handle btn click to btns in view
	var btns = $el.find('[btn]').addBack('[btn]');
	//for (var i=0,len=btns.length;i<len;i++){
	btns.each(function(){
		var $btn = $(this);
		var btnViews = $btn.data('btnViews');
		if (!btnViews) btnViews = [];
		if (btnViews.indexOf(a.view._path) === -1) btnViews.push(a.view._path);
		$btn.data('btnViews',btnViews);
	});
	*/

	cb.done();
};

/*
a_hide (fun): shows view and parent views
	---a---
	view
	[hide]
	[detach]
	[unbind]
	---cb---
*/
me.a_hide = function(a,cb){
	var $el = a.view.a('$el');
	if (!$el) return cb.fail('no $el to hide');
	jn.ch(function(d,ch){ //hide childs
		for (var i in jn.views.ents){
			var ve = jn.views.ents[i];
			if (ve.parent && ve.parent._path == a.view._path){ //is parent, trigger hide
				ve.a('hide');
			}
		}
		ch.done();
	}).ch(function(d,ch){ //hide
		if (a.view._displayed){
			a.view._displayed = false;
			if (cb.hide) cb.hide(a,ch);
			else if (jn.v[a.view.v].a_hide) jn.v[a.view.v].a_hide(a,ch);
			else {
				$el.hide();
				ch.done();
			}
			return;
		}
		ch.done();
	}).ch(function(d,ch){ //detach
		if (a.view._attached){
			if (cb.detach) cb.detach(a,ch);
			else if (jn.v[a.view.v].a_detach) jn.v[a.view.v].a_detach(a,ch);
			else {
				$el.detach();
				ch.done();
			}
			a.view._attached = false;
			return;
		}
		ch.done();
	}).ch(function(d,ch){ //unbind
		//jn.log('unbind:',a.view.v);
		if (a.view._bound){
			if (cb.unbind) cb.unbind(a,ch);
			else if (jn.v[a.view.v].a_unbind) jn.v[a.view.v].a_unbind(a,ch);
			else {
				$el.off();
				ch.done();
			}
			a.view._bound = false;
			return;
		}
		ch.done();
	}).ch(cb.done).fail(cb.fail);
};

/*
a_show (fun): shows view and parent views
	TODO: if action is defined on view, attempt to call it if cb is not defined
	---a---
	view
	[build]
	[touch]: called each time
	[attach]
	[bind]
	[display]
	[rebuild] (bool): set to true to rebuild view on show
	[rebind] (bool): set to true to rebind view on show
	---cb---
*/
me.a_show = function(a,cb){
	if (!jn.v[a.view.v]) return cb.fail('no view defined:'+a.view.v);
	jn.ch(function(d,ch){ //show parent
		if (a.view.parent){
			jn.v(a.view.parent).a('show',ch);
			return;
		}
		ch.done();
	}).ch(function(d,ch){ //get $el + attach
		if (a.view.parent){ //set branch (due to async issue)
			var branch = jn.morph({t:a.view.parent.branch,clone:true}); 
			a.view.branch = jn.morph({t:a.view.branch,merge:branch});
		}
		a.view.a('$el');
		if (!a.view._built || a.rebuild){
			a.view._built = true;
			if (a.build) a.build(a,ch);
			else if (jn.v[a.view.v].a_build) jn.v[a.view.v].a_build(a,ch);
			else ch.done();
			return;
		}
		ch.done();
	}).ch(function(d,ch){
		if (a.every) a.touch(a,ch);
		else if (jn.v[a.view.v].a_touch) jn.v[a.view.v].a_touch(a,ch);
		else ch.done();
	}).ch(function(d,ch){ //bind events (user interactions)
		if (!a.view._attached){
			a.view._attached = true;
			if (a.attach) a.attach(a,ch);
			else if (jn.v[a.view.v].a_attach) jn.v[a.view.v].a_attach(a,ch);
			else a.view.a('attach',ch);
			return;
		}
		ch.done();
	}).ch(function(d,ch){
		if (!a.view._bound  || a.rebind){
			a.view._bound = true;
			if (a.bind) a.bind(a,ch);
			else if (jn.v[a.view.v].a_bind) jn.v[a.view.v].a_bind(a,ch);
			else ch.done();
			return;
		}
		ch.done();
	}).ch(function(d,ch){ //
		if (!a.view._displayed){
			a.view._displayed = true;
			if (a.display) a.display(a,ch);
			else if (jn.v[a.view.v].a_display) jn.v[a.view.v].a_display(a,ch);
			else {
				if (!a.view.$el) return ch.fail('no template found');
				a.view.$el.show();
				ch.done();
			}
			return;
		}
		ch.done();
	}).cb(cb);
};

/*
a_$el (fun): creates and attaches or gets $el
	---a---
	view
	---cb---
	attach
*/
me.a_$el = function(a,cb){
	//jn.log('a_$el',a);
	if (a.view.$el){
		return a.view.$el;
	}
	if (!me.patterns[a.view.v]) return cb.fail('no pattern found:'+a.view.v);
	a.view.$el = me.patterns[a.view.v].clone();
	/*
	a.view.$el.only = function(){
		return $el.filter();
	}
	*/
	return a.view.$el;
};

/*
a_attach (fun): attaches $el to parent
	---a---
	view
	[method] (str): 'append', 'prepend', 'before', 'after'
	[attach] (str): defaults to view.v
	[$attach] (obj):
*/
me.a_attach = function(a,cb){
	a.method = a.method || 'append';
	a.attach = a.attach || a.view.v;
	if (!a.view.parent) var $par = $('body');
	else if (a.view.parent.$el) var $par = a.view.parent.$el;
	if (a.$attach){
		a.$attach[a.method](a.view.$el);
	}
	else if ($par) $par.find('[attach="'+a.attach+'"],[attach="all"]').addBack('[attach="'+a.attach+'"],[attach="all"]').filter(function(){
		if (!a.view.parent) return true;
		else return $(this).closest('[v]').attr('v') == a.view.parent.v; //don't write props of sub views
	}).one()[a.method](a.view.$el);
	cb.done();
};


/*
e (fun): creates or gets a view entity
	---a---
*/
me.e = function(a){
	if (typeof a == 'string' && arguments.length == 1) a = {_path:a};
	else if (typeof a == 'string') a = {v:a};
	a._type = 'v';
	arguments[0] = a;
	//var cb = cb || {done:function(){},fail:function(e){'view create fail:'+e;}};
	return jn.ent.e.apply(jn.ent,arguments);
};

/*
showPath (fun): shows a view path
	---a---
	path
*/
me.showPath = function(a,cb){

	jn.ch(function(d,ch){ //set path
		if (!a.path) a.path = '';
		a.path = a.path.replace(/[\#\!]+/, '');
		if (a.path.length < 1 && jn.config.vDefault) a.path = jn.config.vDefault;
		if (jn.config.vRoot) a.path = jn.config.vRoot+a.path;
		ch.done();
	}).ch(function(d,ch){ //compare paths, get v to hide and ones to show
		var prev = me.history[0];
		//hide prev paths (if history)
		if (prev){
			var sPrev = prev.split('/');
			var sCur = a.path.split('/');
			//check all split parts

			var pStr = '';
			var cStr = '';
			for (var i=0,len=sPrev.length;i<len;i++){
				pStr += sPrev[i];
				cStr += sCur[i];
				//check path
				if (pStr != cStr){ //path does not match (problem if path base/page == base/page?pageId=12345)
					//hide cur view
					//jn.log('hide:',pStr);
					jn.v(pStr).a('hide',{childs:true},{
						fail:ch.fail,
						done:function(){}
					});
					return ch.done(); //don't wait for hide to finish (for speed increase)
				}
				pStr += '/';
				cStr += '/';
			}
		}
		ch.done();
	}).ch(function(d,ch){ //show current paths
		jn.v(a.path).a('show',{
			fail:ch.fail,
			done:ch.done
		});
	}).ch(function(d,ch){
		me.history.unshift(a.path); //add path to front of array
		cb.done();
	}).fail(cb.fail);

};

/*
hash (fun): initializes hashchange system (requires hashchange jquery plugin)
	---a---
*/
me.hash = function(a,cb){

	jn.ch(function(d,ch){
		if (jn.config.system == 'web'){
			var page = window.location.pathname.replace(/^\//,'');
			$(window).hashchange(function(){
				me.showPath({path:window.location.hash}, {
					fail:function(e){jn.log('view show failed:',e);},
					done:function(res){
						window.scrollTo(0,0);
					}
				});
			});
			$(window).hashchange();
			ch.done();
		}
	}).cb(cb);
	
};

/*
start (fun): initializes v
	---a---
*/
me.start = function(a,cb){

	jn.ch(function(d,ch){ //detach & store templates
		$('#template [v]').each(function(){
			var v = $(this).attr('v');
			me.patterns[v] = $(this).detach().hide();
		});
		ch.done();
	}).ch(function(d,ch){ //initialize v
		jn.core.includeDir({dir:'views/'},{
			fail:ch.fail,
			done:ch.done
		});
	}).ch(function(d,ch){ //init hash
		//jn.log('hash');
		me.hash(a,{
			fail:ch.fail,
			done:ch.done
		});
	}).ch(cb.done).fail(cb.fail);
};

/*
patterns (ary): stores detached view html
*/
me.patterns = {};

/*
history (ary): array of paths visited (most recent first)
*/
me.history = [];

/*
ents (obj): stores all entities
*/
me.ents = {};

return module.exports(j,cb);};require.store["jn/web.js"]=function(j,cb){var module = {};/*
***** web *****
---------------

*/

var core = {};
var jn = {};


var jn;

var me = module.exports = function(j,cb){
	jn = j;
	jn.web = me;

	cb.done();
};

/*
post (fun):
	---a---
	path
	post
*/
me.post = function(a,cb){
	var me = this;
	//jn.log('post:',a.data,typeof a.data);
	$.ajax({
		type:'POST',
		url:a.path,
		data:a.post,
		dataType:'text'
	}).done(function(res){
		cb.done(res);
	}).fail(function(err){
		cb.fail('-POST fail>'+err.responseText);
	});
};

/*
packObj (fun): used to pack data into a url query string
	---a---
	(any)
	---return---
	(str): data stringified, ready to append to url
*/
me.packObj = function(a,cb){
	if (!a) return '';
	try{
		if (typeof a == 'object'){
			return escape(JSON.stringify(a));
		}
	}
	catch(e){
	}
	return a;
};


/*
setCookie (fun):
	---a---
	name (str): name of cookie to be stored
	[value] (str): value to be stored in cookie, set value to null to destroy cookie
	[expires] (int): days from now that the cookie will expire in
	[path] (str): folders that cookie will be available to, use '/' for all folders
	[secure] (bool): for https cookies
*/
me.setCookie = function(a,cb){
	if (a.value === undefined){
		var D = new Date((-1*jn.date.day)+jn.date({get:'ts'}));
		a.expires = D.toUTCString();
		a.value = null;
	}
	else {
		//jn.log('expires:',a.expires*jn.date.day);
		if (a.expires){
			var D = new Date((Number(a.expires)*jn.date.day)+jn.date({get:'ts'}));
			a.expires = D.toUTCString();
			//jn.log('expires:',a.expires);
		}
		a.value = String(a.value);
		a.value = (a.raw)? a.value : encodeURIComponent(a.value);
	}
	
	document.cookie = [
		encodeURIComponent(a.name), '=',
		a.value,
		a.expires? '; expires='+a.expires : '', // use expires attribute, max-age is not supported by IE
		a.path ? '; path='+a.path : '',
		a.domain && a.domain != 'localhost' ? '; domain='+a.domain : '',
		a.secure ? '; secure' : ''
    ].join('');
};


/*
getCookie (fun): gets a cookie
	key (str): name of cookie to retrieve
	[raw] (bool): if true, do not decode value
	---return--- 
	(str): value stored in cookie
*/
me.getCookie = function(a,cb){
   	var result, decode = a.raw ? function (s){return s;}: decodeURIComponent;
   	return (result = new RegExp('(?:^|; )' + encodeURIComponent(a.key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
}




return module.exports(j,cb);};require.store["models/assets/as_color.js"]=function(j,cb){var module = {};var jn;

var me = module.exports = function(j,cb){
	jn = j;
	jn.m.as_color = me;
	cb.done();
};

me.fields = {
	src:{type:'str'},
	cmyk:{type:'ary'},
	rgb:{type:'ary'},
	hex:{str:true,max:7},
	pantone:{str:true,max:40}
};



var reAlpha = new RegExp('[a-zA-Z]');
var hex = new RegExp('^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$');
me.a_sniffColor = function(a, cb){
	var color = a.color.trim();
	color = jn.format({t:color,lower:'all'});

	//	sniff for alpha char
	if(hex.test(color)) {
		//	add has if missing
		if (color.substr(0,1) != '#') color = '#'+color;

		//	expand out to 7 chars if 4 (i.e. 000 -> 000000)
		if (color.length == 4) color = '#'+color.substr(1,1)+color.substr(1,1)+color.substr(2,1)+color.substr(2,1)+color.substr(3,1)+color.substr(3,1);
		a.hex = color;
	} else if(reAlpha.test(color)){
		a.pantone = color;
	} else {
		color = color.replace(/[\,\-\n\t]/g,' ');
		var colorAry = color.split(' ');
		var colorAryInt = [];
		console.log(colorAry);
		if (colorAry.length < 3 || colorAry.length > 4){
			return cb.fail("invalid color value. RGB has 3 numbers, CMYK has 4 numbers");
		}
		if (colorAry.length == 3) {
			for (var i=0, l=3; i<l; i++){
				if(colorAry[i] < 0 || colorAry[i] > 255){
					return cb.fail('RGB values must be between 0 and 255');
				}
				colorAryInt.push(parseInt(colorAry[i], 10));
			}
			a.rgb = colorAryInt;
		}
		if (colorAry.length == 4) {
			for (var i=0, l=4; i<l; i++){
				if(colorAry[i] < 0 || colorAry[i] > 100){
					return cb.fail('CMYK values must be between 0 and 100');
				}
				colorAryInt.push(parseInt(colorAry[i],10));
			}
			a.cmyk = colorAryInt;
		}
	}

	a.model.a('send',{
		action:a
	},cb);
};

return module.exports(j,cb);};require.store["models/assets/as_eps.js"]=function(j,cb){var module = {};var jn;

var me = module.exports = function(j,cb){
	jn = j;
	jn.m.as_eps = me;
	cb.done();
};

me.fields = { //fields stored in data property of asset
	bgColor:{str:true}, //hex color of background color in interface
	colorspace:{str:true},
	rasterPath:{str:true},
	dim:{obj:true}, //dimensions of orig image {w:145,h:100}
	propWH:{number:true}, //proportion W/H
	notPassed:{type:'bool'}, //true if eps didn't pass all tests, false otherwise
	isLogo:{type:'bool'}
};














return module.exports(j,cb);};require.store["models/assets/as_font.js"]=function(j,cb){var module = {};var jn;

var me = module.exports = function(j,cb){
	jn = j;
	jn.m.as_font = me;
	cb.done();
};

me.fields = { //fields stored in data property of asset
	font:{type:'obj'},
	fontName:{type:'str'},
	family:{type:'str'},
	fontformat:{type:'str'},
	foundry:{type:'str'},
	fullname:{type:'str'},
	style:{type:'str'},
	info:{type:'obj'}
};	





me.sanitize = function(name){
	name = name.replace(/^[^a-zA-Z0-9]+/, '');
	name = name.replace(/[^a-zA-Z0-9]+$/, '');
	name = name.replace(/[^a-zA-Z0-9]+/g, '-');
	name = name.replace(/[-]+/, '-');
	return name;
};
return module.exports(j,cb);};require.store["models/assets/as_image.js"]=function(j,cb){var module = {};var jn;

var me = module.exports = function(j,cb){
	jn = j;
	jn.m.as_image = me;
	cb.done();
};

me.fields = {
	bgColor:{str:true}, //hex color of background color in interface
	colorspace:{str:true},
	dim:{obj:true}, //dimensions of orig image {w:145,h:100}
	propWH:{number:true} //proportion W/H
};











return module.exports(j,cb);};require.store["models/assets/as_pdf.js"]=function(j,cb){var module = {};var jn;

var me = module.exports = function(j,cb){
	jn = j;
	jn.m.as_pdf = me;
	cb.done();
};

me.fields = {
	numPages:{num:true} //number of pages in pdf
};




return module.exports(j,cb);};require.store["models/assets/assets.js"]=function(j,cb){var module = {};var jn;

var me = module.exports = function(j,cb){
	jn = j;
	jn.m.assets = me;
	jn.log('init assets');
	cb.done();
};

me.fields = {
	customLabel:{type:'str', max: 50},
	//type:{str:true,max:100}, //type of asset 'eps', 'image', 'color', 'font', 'other' (derive from typeExt?)

	name:{str:true,max:100},
	filepath:{str:true}, //relative path to file
	filename:{str:true,max:255}, //original file name
	customFilename:{type:'str',max:50},
	exportFilename:{type:'str'}, //for the filename in exports
	ext:{str:true}, //extension of asset
	mime:{str:true}, //mime type of file
	filesize:{num:true},
	company:{id:true},
	srcPage:{id:true}, //id of page the asset entered on
	creator:{id:true}, //user id of asset creator
	pagesIn:{ary:true}, //ary of pages that contain this asset
	data:{obj:true}, //store asset specific data in here
	placed:{type:'bool'},
	version:{type:'num'}
};


me.typeExt = {
	eps:['eps'],
	image:['png','jpg','jpeg','gif','bmp','tif','tiff'],
	font:['otf','ttf'],
	pdf:['pdf'],
	color:['color']
};


me.a_setCustomFilename = function(a,cb){
	a.model.a('send',{action:a},cb);
};


//me.a_setCustomLabel = function(a,cb){
//	a.model.a('send',{action:a},cb);
//};
//

me.a_tmpImg = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_analyze = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_replace = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_getData = function(a,cb){
	a.model.a('send',{action:a},cb);
};













/*
a_type (fun): pass an action to an asset type (if exists)
	---a---
	type
	action
*/
me.a_aType = function(a,cb){
	a.type = a.type || me.getType(a.model.rec.ext);
	a.action.model = a.model;
	//jn.log('type:',a.type,a.action.a);
	if (jn.m['as_'+a.type] && jn.m['as_'+a.type]['a_'+a.action.a]){
		jn.m['as_'+a.type]['a_'+a.action.a](a.action,cb);
		return true;
	}
	return false;
};

/*
***** get *****
*/
me.getPath = function(companyId,assetId,ext){
	return jn.config.assetsDir+companyId+'/'+assetId+'.'+ext;
};
me.getType = function(ext){
	for (var i in me.typeExt){
		var exts = me.typeExt[i];
		if (exts.indexOf(ext) !== -1){
			var type = i;
			break;
		}
	}
	if (!type) return 'other';
	return type;
};
me.getExt = function(file){
	var ind = file.lastIndexOf('.');
	if (ind == -1) return '';
	return jn.format({t:file.substr(ind+1),lower:'all'});
};


return module.exports(j,cb);};require.store["models/company.js"]=function(j,cb){var module = {};var jn;

var me = module.exports = function(j,cb){
	jn = j;
	jn.m.company = me;
	cb.done();
};

me.fields = {
	companyName:{type:'str',max:30},
	owners:{type:'ary'},

	/*
	teams (ary):
		[{
			name:'first team',
			pages:['12456','22345'], //pages listed allow write access into the page as well as all child pages
			users:['89736','12837']
		},{
			name:'super team!',
			pages:'all',
			users:['67276','83778']
		}]
	*/
	teams:{type:'ary'},
	isPrivate:{type:'bool'},
	/*
	plan (obj):
		type (str): free, startup, established, enterprise
		userId (str): userId of payment agent
		stripePlanId (str): unique name per plan 'month15perUser'
		stripeCustomerToken (str): id to track customer in stripe
		stripeCardToken (str): stripe token of card
		stripeCardData (obj):
			last4 (str):
			exp_month
		billingStart (num): ts of billing start
		price (num): price per period
		interval (str): 'week', 'month', 'year'
		features (obj):
			maxUsers (num): maximum number of users on this plan (must upgrade to get past)
			maxAssets (num): maximum number of assets
			annoying (bool): if true, will put an annoying banner on all pages
			footer (bool): if true puts a footer on the bottom of the page
			privacy (bool): if true, allows pages to be password protected
			whiteLabel (bool): if true, allows pages to be white labelled
			pagePermissions (bool): if true, allows team members to have access to pages within company (instead of only at top level)
	*/
	plan:{type:'obj'},
	/*
	grandfather (obj):
		name (str): name of plan
		userId (str): userId of payment agent
		stripePlanId (str): unique name per plan 'month15perUser'
		stripeCustomerToken (str): id to track customer in stripe
		stripeCardToken (str): stripe token of card
		stripeCardData (obj):
			last4 (str):
			exp_month
		stripeSubscriptionId (str):
		billingStart (num): ts of billing start
		price (num): price of plan
		interval (str): 'week', 'month', 'year'
		features (obj):

	*/
	grandfather:{type:'obj'},
	privateNav:{type:'bool'} //true to turn on privacy in the nav for pages
};


me.plans = {
	free:{
		price:0,
		interval:'month',
		features:{
			maxUsers:1,
			maxAssets:9,
			annoying:true,
			footer:true
		}
	},
	alpha:{
		price:7,
		interval:'month',
		features:{
			maxUsers:1,
			footer:true,
			maxAssets:10,
			pagePermissions:true
		}
	},
	beta:{
		price:18,
		interval:'month',
		features:{
			footer:true,
			maxAssets:24,
			pagePermissions:true
		}
	},
	startup:{
		price:24,
		interval:'month',
		features:{
			footer:true,
			maxAssets:50,
			pagePermissions:true
		}
	},
	established:{
		price:49,
		interval:'month',
		features:{
			footer:true,
			maxAssets:125,
			privacy:true,
			pagePermissions:true
		}
	},
	enterprise:{
		price:150,
		interval:'month',
		features:{
			privacy:true,
			maxAssets:100000,
			whiteLabel:true,
			pagePermissions:true
		}
	}
};

me.a_migrate = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_getMainPage = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_removePageTeam = function(a,cb){
	a.model.a('send',{action:a},cb);
};



me.a_getNumAssets = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_getStripeKey = function(a,cb){
	a.model.a('send',{action:a},cb);
};

me.a_changeCard = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_subscribe = function(a,cb){
	a.model.a('send',{action:a},cb);
};



me.a_getNumUsers = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_getTeam = function(a,cb){
	a.model.a('send',{action:a},cb);
};






return module.exports(j,cb);};require.store["models/intercom.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.m.intercom = me;
	cb.done();
};


/*
a_submitEvent (fun):
	---a---
	event
	data
*/
me.a_submitEvent = function(a,cb){
	if (!window.Intercom) return cb.fail('no intercom module found');
	window.Intercom('trackEvent',a.event,a.data);
};



me.a_apiStart = function(a,cb){
	a.model.a('send',{action:a},cb);
};

/*
a_update (fun)
	---a---
	[any]: data to send
	[increments] (obj): incremental change to intercom values
*/
me.a_update = function(a,cb){
	cb = jn.dcb(cb);
	if (!window.Intercom) return;

	var update = jn.morph({t:a,shrink:['model','a']});
	console.log('intercom update:',update);
	try{
		window.Intercom('update',update);
		//cb.done();
	}
	catch(e){
		//cb.fail('intercom update failed');
	}
	cb.done();
};

/*
a_start (fun):
*/
me.a_start = function(a,cb){
	cb = jn.dcb(cb);
	var sess = jn.m('sess');
	if (!sess.user){
		jn.log('intercom start - no sess user defined');
		return cb.done();
	}

	//jn.log('intercom start called')

	jn.ch(function(d,ch){
		sess.user.a('get',ch);
	}).ch(function(d,ch){
		a.model.a('getKey',ch);
	}).ch(function(d,ch){ //get user hash
		a.key = d.key;
		jn.log('start intercom:',sess.user.rec.email,a.key);
		a.model.a('getUserHash',{userId:sess.user.id,},ch);
	}).ch(function(d,ch){ 
		a.hash = d.hash;
		ch.done();
	}).ch(function(d,ch){
		jn.log('start intercom');
		if (!window.Intercom) setTimeout(function(){ch.loop();},1000);
		try{	
			window.intercomSettings = {
				app_id:a.key,
				user_hash:a.hash
			};	

			var boot = {
				app_id:a.key,
				email:sess.user.rec.email,
				user_id:sess.user.id,
				user_hash:a.hash,
				created_at:Math.round(Number(sess.user.rec.created)/1000),
				widget:{activator:"#Intercom"}
			};
			//if (a.from) boot.from = 'logoValidate';
			window.Intercom('boot', boot);
			ch.done();
		}
		catch(e){
			jn.log('intercom failed:',e);
			ch.fail('intercom load failed');
		}
	}).cb(cb);
};

me.a_getUserHash = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_getKey = function(a,cb){
	a.model.a('send',{action:a},cb);
};


/*
	actionUpdateUser:function(a,cb){
		var update = {};
		update.numLogos = $('[data-v="brandLogosRow"]').length; 
		update.numColors = $('[data-v="brandColorRow"]').length; 
		update.numFonts = $('[data-v="brandFontsRow"]').length; 

		if (update.numLogos) update.hasLogo = true;
		if (update.numColors) update.hasColor = true;
		if (update.numFonts) update.hasFont = true;

		jin.ga({
			action:'update',
			group:a.group,
			update:update
		});
	}
*/return module.exports(j,cb);};require.store["models/mandrill.js"]=function(j,cb){var module = {};var mp = 'mandrill', jn;
var me = module.exports = function(j,cb){
	jn = j, jn.m[mp] = me;
	cb.done();
};

return module.exports(j,cb);};require.store["models/migrate.js"]=function(j,cb){var module = {};var jn;

var me = module.exports = function(j,cb){
	jn = j;
	jn.m.migrate = me;
	cb.done();
};










me.sanitize = function(name){
	name = name.replace(/^[^a-zA-Z0-9]+/, '');
	name = name.replace(/[^a-zA-Z0-9]+$/, '');
	name = name.replace(/[^a-zA-Z0-9]+/g, '-');
	name = name.replace(/[-]+/, '-');
	return name;
};


return module.exports(j,cb);};require.store["models/pages/p_brand.js"]=function(j,cb){var module = {};var jn;

var me = module.exports = function(j,cb){
	jn = j;
	jn.m.p_brand = me;
	cb.done();
};

me.defaultFiles = {
	cmyk:[{format:'eps'},{format:'png'},{format:'jpg'}],
	rgb:[{format:'eps'},{format:'png'},{format:'jpg'}]
};

me.dirMap = {
	cmyk:'Print-CMYK',
	rgb:'Digital-RGB'
};


/*
a_place (fun): places an asset within a page - or builds a sub page to fit asset (in case of brand page)
	---a---
	asset (obj): model
	type (str): 'eps', 'image', 'font', 'pdf'
	[pos]
	[colorspace] (str): for logos only/
*/
me.a_place = function(a,cb){
	if (!a.asset) return cb.fail('no asset to place');
	//jn.log('asset:',a.asset,a.type);

	var rec = a.model.rec;
	var parts = a.model.rec.parts || {};
	jn.ch(function(d,ch){
		if (a.type == 'eps'){ //place in logos
			if (!parts.logos) parts.logos = [];
			if (parts.logos.length < 1) parts.logos.push({
				category:'Primary',
				descrip:'Use this logo whenever possible. Maintain the logo\'s orientation, and make sure it has plenty of space to breathe.',
				assets:[]
			});

			if (a.pos){ //position defined
				if (a.colorspace){ //place inside this colorspace in spot
					var spot = a.model.a('getPos',{pos:a.pos});
					spot[a.colorspace] = a.asset.id;
				}
			}
			else {
				//by default, add logo to first category
				var embed = {};
				a.asset.colorspace = a.asset.colorspace || 'rgb'; //may remove this when colorspace is grabbed from eps
				embed[a.asset.colorspace] = a.asset.id;
				parts.logos[0].assets.push(embed);
			}

			//update page with new parts
			a.model.a('update',{parts:parts,sess:a.sess},cb);
		}
		else if (a.type == 'image'){
			if (!parts.images) parts.images = [];
			if (parts.images.length < 1) parts.images.push({
				category:'Brand',
				descrip:'These images help display our products and create a visual connection between our brand and the world.',
				assets:[]
			});
			//by default, add logo to first category
			var embed = {id:a.asset.id};
			parts.images[0].assets.push(embed);

			//jn.log('update parts:',parts);

			//update page with new parts
			a.model.a('update',{parts:parts,sess:a.sess},cb);
		}
		else if (a.type == 'color'){
			//jn.log('place color:',a.asset.id);
			if (!parts.colors) parts.colors = [];
			if (parts.colors.length < 1) parts.colors.push({
				category:'Primary',
				descrip:'These colors are the most common ones used to represent our brand. The color values are specific, so use their values precisely.',
				assets:[]
			});
			//by default, add logo to first category
			var embed = {id:a.asset.id};
			parts.colors[0].assets.push(embed);

			//jn.log('update parts:',parts);

			//update page with new parts
			a.model.a('update',{parts:parts,sess:a.sess},cb);
		}
		else if (a.type == 'font'){
			//jn.log('place color:',a.asset.id);
			if (!parts.fonts) parts.fonts = [];
			if (parts.fonts.length < 1) parts.fonts.push({
				category:'Primary',
				descrip:'Our primary typography should be used for all written communication.',
				assets:[]
			});
			//by default, add logo to first category
			var embed = {id:a.asset.id};
			parts.fonts[0].assets.push(embed);

			//jn.log('update parts:',parts);

			//update page with new parts
			a.model.a('update',{parts:parts,sess:a.sess},cb);
		}
		else if (a.type == 'pdf'){
			parts.guide = a.asset.id;

			//update page with new parts
			a.model.a('update',{parts:parts,sess:a.sess},cb);
		}
	}).ch(function(d,ch){ //if page is type 'asset', catch all and embed all
		cb.done({});
	}).cb(cb);
};

/*
a_download (fun): by default downloads all assets in a brand page
	---a---
	model

*/
me.a_download = function(a,cb){
	var s = {sess:a.sess};
	var zip = {};
	var rand = jn.hash({random:true});
	zip.dest = jn.config.assetsDir+'packages/'+rand+'.zip'; //random zip name
	zip.root = jn.config.assetsDir;
	zip.name = a.model.rec.name+'.zip';
	zip.files = [];

	/*
	{
		"reqId": 0,
		"action": "MakeArchive",
		"data": {
			"dest": "/absolute/path/to/dest.zip",
			"root": "/absolute/ref/to/root/dir",
			"name": "name-of-archive-as-delivered",
			"files": [
				{
					"src": "relative/path/and/name/to/file/in/root.jpg",
					"dest": "relative/path/and/name/archive.jpg"
				}
			]		
		}
	}
	*/

	//loop parts
	jn.loop({obj:a.model.rec.parts},{
		loop:function(loop){
			var part = a.model.rec.parts[loop.prop];
			var type = loop.prop;
			if (type == 'logos'){
				//loop through categories
				jn.loop({ary:part},{
					loop:function(l){
						var cat = part[l.i];
						if (!cat) return l.next();
						var defName = a.model.rec.name+'_'+cat.category;
						var dir = 'Logos/'+cat.category+'/';

						//loop through assets
						jn.loop({ary:cat.assets},{
							loop:function(l2){
								var spot = cat.assets[l2.i];
								if (!spot) return l2.next();
								var name = defName+'_V'+(l2.i+1);
								me.packLogoSpot({spot:spot,files:zip.files,dir:dir,sess:a.sess,name:name},{
									fail:function(err){
										//jn.log('pack err:',err);
										l2.next();
									},
									done:l2.next
								});
							},
							done:function(){
								l.next();
							}
						});
					},
					done:function(){
						loop.next();
					}
				});
			}
			else if(type == 'colors'){ //get swatch and package
				/*
				var swatches = {};
				swatches[cat.category] = [];
				swatches[cat.category].push({rgb:color.color.rgb});
				*/
				loop.next();
				/*
				jin.ga({
					action:'getSwatch',
					group:{g:'brandBrain'},
					dest:swatchDest,
					swatches:swatches
				},{
					fail:function(res){
						cb.fail('get swatch fail:',res);
					},
					success:function(res){
						//console.log('swatch send',brand);
						var filename = jin.tools.format({target:brand.name,filename:true})+'.ase';

						a.scope.request.res.writeHead(200, {
							'Content-disposition':'attachment; filename=' + filename,
							'Content-type':'application/octet-stream'
						});

						var filestream = fs.createReadStream(swatchDest);
		  				filestream.pipe(a.scope.request.res);
					}
				});
				*/
			}
			else if(type == 'guide'){
				var asset = jn.m('assets',{id:part});
				var name = a.model.a('getAssetDlName',s,{asset:asset});
				//jn.log('download guide name:',name);
				jn.ch(function(d,ch){ //get filepath
					asset.a('getFile',{name:name,rel:true,format:'pdf'},s,ch);
				}).ch(function(d,ch){ //send file
					//console.log("guide d", d);
					zip.files.push({src:d.filepath,dest:d.filename});
					ch.done();
				}).ch(loop.next).fail(loop.next);
			}
			else {
				loop.next();
			}

			//loop through part assets

		},
		done:function(){
			//jn.log('zip:',zip);

			jn.brain.createArchive(zip,{
				fail:cb.fail,
				done:function(res){
					cb.done({dest:zip.dest});
				}
			});

			
		}
	});
};

/*
packLogoSpot (fun):
	---a---
	dir
	spot
	files (ary): write to this ary
	name
	---cb---
	files
*/
me.packLogoSpot = function(a,cb){
	var s = {sess:a.sess};
	jn.loop({obj:a.spot},{ //loop through colorspaces
		loop:function(loop){
			var colorspace = loop.prop;
			var spot = a.spot[loop.prop];
			if (!me.defaultFiles[loop.prop]) return loop.next();
			var dir = a.dir+me.dirMap[loop.prop]+'/';
			jn.loop({ary:me.defaultFiles[loop.prop]},{ //loop through files
				loop:function(l){
					var logo = jn.morph({t:me.defaultFiles[loop.prop][l.i],clone:true});
					logo.dir = dir;
					if (logo.format == 'png') logo.dir += 'png/';
					if (logo.format == 'jpg') logo.dir += 'jpg/';
					logo.logoId = spot;
					logo.sess = a.sess;
					logo.name = a.name;
					if (colorspace == 'rgb' || colorspace == 'cmyk') logo.colorspace = colorspace;
					me.packLogo(logo,{
						fail:function(err){
							//jn.log('pack logo err:',err);
							l.next();
						},
						done:function(res){
							a.files.push(res);	
							l.next();		
						}
					});
				},
				done:function(){
					loop.next();
				}
			});
		},
		done:function(){
			cb.done();
		}
	});
};

/*
packLogo (fun): packs a logo asset for insertion into a zip
	---a---
	format
	w
	h
	logoId
	dir
	name
	---cb---
	done
		src
		dest
*/
me.packLogo = function(a,cb){
	var s = {sess:a.sess};
	//get asset file (resized and in correct format)
	var logo = jn.m('assets',{id:a.logoId});
	jn.ch(function(d,ch){ //get filepath
		logo.a('getFile',{rel:true,name:a.name},a,ch);
	}).ch(function(d,ch){
		cb.done({
			src:d.filepath,
			dest:a.dir+d.filename
		});
	}).cb(cb);
};return module.exports(j,cb);};require.store["models/pages/p_host.js"]=function(j,cb){var module = {};var jn, mp = 'p_host';
var me = module.exports = function(j,cb){
	jn = j, jn.m[mp] = me;

	/*
	setTimeout(function(){

		jn.m(mp).a('migrateAll',{
			fail:function(res){
				jn.log('migrate failed:',res);
			},
			done:function(){
				jn.log('migrate done:');
			}
		});
	},3000);
	*/

	cb.done();
};




return module.exports(j,cb);};require.store["models/pages.js"]=function(j,cb){var module = {};var jn;

var pages = module.exports = function(j,cb){
	jn = j;
	jn.m.pages = pages;


	cb.done();
};
var me = pages;

me.fields = {
	type:{str:true,max:100},
	name:{str:true,min:1,max:50},
	customUrl:{str:true,min:1,max:100,illegalChars:/[^0-9a-zA-Z\_\-]/g},
	customHost:{type:'str',min:1,max:100},
	isWhite:{bool:true},
	creator:{id:true},
	company:{id:true},
	parent:{id:true},
	isPrivate:{bool:true}, //could deprecate?
	password:{str:true,min:4,max:20,secret:true},
	parts:{obj:true},
	logoRequestUsers:{ary:true}, //store users who have been asked to submit a logo, iterate through to turn off request campaigns
	logoRequestedBy:{ary:true} //store an ary of users who have sent logo requests
};

//TODO: clear lastVisited on user if = on page removal


/*
parts (obj)
	--- ind ---
	type (str): 'logos', 'colors', or 'fonts'
	--- val (ary) ---
	category (str)
	descrip (str)
	assets (ary): ary of ids

	//brand page
	parts:{
		guide:'12345', //asset id
		logos:[{
			category:'primary',
			descrip:'this is a description',
			assets:[{rgb:'11234',cmyk:'22345',col:1,row:1,w:2,h:2},{rgb:'11234',cmyk:'22345'}]
		},{
			category:'primary',
			descrip:'this is a description',
			assets:[{rgb:'11234',cmyk:'22345'},{rgb:'11234',cmyk:'22345'}]
		}]
	}

	main logo -> parts.logos[0].assets[0]

	//assets page
	parts:{
		images:[{
			category:'primary',
			descrip:'this is a description',
			assets:['12345','22345']
		}]
	}
*/


me.a_saveCategory = function(a,cb){
	a.model.a('send',{action:a},cb);
};



me.a_moveCategory = function(a,cb){
	a.model.a('send',{action:a},cb);
};



me.a_requestLogo = function(a,cb){
	a.model.a('send',{action:a},cb);
};





me.a_getCompanyMain = function(a,cb){
	a.model.a('send',{action:a},cb);
};


/*
a_getUrl (fun): gets a url for a page (uses custom url if it exists)
	---a---
*/
me.a_getUrl = function(a,cb){
	a.model.a('send',{action:a},cb);	
};


me.a_getSwatch = function(a,cb){
	a.model.a('send',{action:a},cb);
};


/*
a_numAssets (fun):
	---a---
*/
me.a_numAssets = function(a,cb){
	var s = {sess:a.sess};

	jn.ch(function(d,ch){
		a.model.a('get',s,ch);
	}).ch(function(d,ch){
		if (!a.model.rec) return cb.fail('no page found');
		if (!a.model.rec.parts) return ch.done({num:0});
		var num = 0;
		if (a.model.rec.parts.guide) num++;
		for (var i in a.model.rec.parts){
			var part = a.model.rec.parts[i];
			if (jn.type(part) == 'ary'){
				for (var j=0,lenJ=part.length;j<lenJ;j++){
					var cat = part[j];
					if (cat && cat.assets) num += cat.assets.length;
					//jn.log('page assets:',i,cat);
				}
			}
		}
		ch.done({num:num});
	}).cb(cb);
};

me.a_remove = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_requestAccess = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_removeGuide = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_removeGuide = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_removeTeamMember = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_getTeam = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_acceptInvite = function(a,cb){
	a.model.a('send',{action:a},cb);
};



me.a_getTeamInvite = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_getPageInvites = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_removeInvite = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_sendTeamInvite = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_catDescrip = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_share = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_checkPassword = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_getPassword = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_setName = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_setCustomHost = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_customHost = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_setCustomUrl = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_customUrl = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_unsubmitAsset = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_submitAsset = function(a,cb){
	a.model.a('send',{action:a},cb);
};



me.a_getMain = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_updateGrid = function(a,cb){
	jn.ch(function(d,ch){
		a.parts = a.model.rec.parts;

		//var spot = a.model.a('getPos',{pos:a.pos});
		//spot._gr = a.grid;
		
		var assets = a.model.a('getPos',{pos:a.pos});
		for (var i=0,len=assets.length;i<len;i++){
			if (a.grid[i]){
				//jn.log('update grid:',a.grid[i]);
				assets[i]._gr = assets[i]._gr || {};
				assets[i]._gr = jn.morph({t:assets[i]._gr,merge:a.grid[i]});
			}
		}
		ch.done();
	}).ch(function(d,ch){
		a.model.a('send',{action:a},cb);
	}).cb(cb);
};



me.a_addColor = function(a,cb){
	a.model.a('send',{action:a},cb);
};


/*
a_type (fun): pass an action to a page type (if exists)
	---a---
	type
	action
*/
me.a_aType = function(a,cb){
	a.type = a.type || a.model.rec.type;
	a.action.model = a.model;
	//jn.log('type:',a.type,a.action.a);
	if (jn.m['p_'+a.type] && jn.m['p_'+a.type]['a_'+a.action.a]){
		jn.m['p_'+a.type]['a_'+a.action.a](a.action,cb);
		return true;
	}
	return false;
};


/*
a_getAssetName (fun)
	---a---
	asset
*/
me.a_getAssetDlName = function(a,cb){
	var pos = a.model.a('search',{asset:a.asset});
	//get category position
	if (!pos) return false;
	var posA = pos.split('.');
	var name = me.filterDl(a.model.rec.name);
	if (posA.length > 3){
		var cat = a.model.rec.parts[posA[0]][posA[1]];
		cat.category = me.filterDl(cat.category);
		name = name+'_'+cat.category+'_V'+(Number(posA[3])+1);
	}

	//console.log('getAssetDlName', a.model.rec, name);

	//	replace spaces with underscores
	//name = name.replace(/ /g,'_');
	cb.done();
	return name;
};


me.filterDl = function(name){
	return name.replace(/[^a-zA-Z0-9]/g,'');
};


me.a_removeSpotProp = function(a,cb){
	a.model.a('send',{action:a},cb);
};


me.a_removeSpot = function(a,cb){
	a.model.a('send',{action:a},cb);
};


/*
a_moveIntoCat (fun): moves an assetObj into a category
	---a---
	part (str): defines the part the asset is in ('logos', 'colors', 'images')
	cat (obj): defines the category moved into
	spot (obj): spot to move
*/
me.a_moveIntoCat = function(a,cb){
	a.model.a('send',{action:a},cb);
};


/*
a_cleanupCats (fun): deletes empty categories
*/
me.a_cleanupCats = function(a,cb){
	if (!a.model.rec || !a.model.rec.parts) return cb.fail('missing input');
	var parts = a.model.rec.parts;
	for (var i in parts){
		var type = jn.type(parts[i]);
		if (type == 'ary'){
			for (var j=0,len=parts[i].length;j<len;j++){
				//jn.log('check assets:',parts[i][j]);
				if (!parts[i][j] || (parts[i][j].assets && parts[i][j].assets.length < 1)){
					parts[i].splice(j,1);
					j--;
					len--;
				}
			}
		}
	}
	cb.done();
};

/*
a_getPos (fun): returns a pos inside a page's parts
	---a---
	pos
*/
me.a_getPos = function(a,cb){
	if (!a.model.rec || !a.model.rec.parts || !a.pos) return false;
	//jn.log('get pos:',a.pos);
	var ary = a.pos.split('.');
	var cur = a.model.rec.parts;
	for (var i in ary){
		if (cur[ary[i]] == undefined) return cb.fail('no pos found:',a.pos);
		cur = cur[ary[i]];
	}
	cb.done();
	return cur;
};

/*
a_search (fun): searches page assets for an asset
	---a---
	model
		rec
	asset
	spot
	[search] (str): defines what object to search (inside of parts)
	[pos] (str): defines current pos searching
	[found] (fun): callback to execute on found asset
	[remove] (bool): if true, remove asset from page
	---return---
	pos or false
*/
me.a_search = function(a,cb){
	if (!a.model.rec || !a.model.rec.parts) return false;
	a.search = a.search || a.model.rec.parts;
	a.pos = a.pos || '';
	var type = jn.type(a.search);
	//jn.log('search:',a.search,a.spot);
	if (type == 'ary'){
		for (var i=0,len=a.search.length;i<len;i++){
			var part = a.search[i];
			if (part){
				var pos = (a.pos.length > 0)? a.pos+'.'+i: a.pos+i;
				if ((a.spot && jn.compare(part,a.spot)) || (a.asset && part == a.asset.id)){
					if (a.found) a.found({container:a.search,pos:pos,found:part,ind:i});
					if (a.remove) a.search.splice(i,1); 
					cb.done();
					return pos;
				}
				var pass = jn.morph({t:a,merge:{search:part,pos:pos},clone:true});
				var found = me.a_search(pass,cb);
				if (found){
					cb.done();
					return found;
				}
			}
		}
	}
	else if (type == 'obj'){
		for (var i in a.search){
			var part = a.search[i];
			if (part){
				var pos = (a.pos.length > 0)? a.pos+'.'+i: a.pos+i;
				//jn.log('sear:',part);
			
				if ((a.spot && jn.compare(part,a.spot)) || (a.asset && part == a.asset.id)){
					if (a.found) a.found({container:a.search,pos:pos,found:part,ind:i});
					if (a.remove) delete a.search[i]; 
					cb.done();
					return pos;
				}
				var pass = jn.morph({t:a,merge:{search:part,pos:pos},clone:true});
				var found = me.a_search(pass,cb);
				if (found){
					cb.done();
					return found;
				}
			}
		}
	}
	cb.done();
	return false;
};

me.a_upload = function(a,cb){
	a.model.a('send',{action:a},cb);
};





/*
a_access (fun): gets access level for the currently logged in user
	admin > owner > team > user > public
	---a---
	sess
*/
me.a_access = function(a,cb){
	a.model.a('send',{action:a},cb);
};




return module.exports(j,cb);};require.store["models/strings.js"]=function(j,cb){var module = {};var mp = 'strings', jn, language;
var me = module.exports = function(j,cb){
	jn = j, jn.m[mp] = me;

	if (window.navigator.languages && window.navigator.languages.length > 0){
		for (var i=0,len=window.navigator.languages.length;i<len;i++){
			var lan = window.navigator.languages[i];
			if (languageMap[lan]){
				language = languageMap[lan];
				break;
			}
		}
	}
	else {
		var len = window.navigator.userLanguage || window.navigator.language;
		if (languageMap[lan]){
			language = languageMap[lan];
		}
	}
	//jn.log(language);
	cb.done();
};
var language = 'englishUs';
var languageMap = {
	'en-US':'englishUs',
	'da':'danish'
};
/*
a_language (fun):
	---a---
	language
*/
me.a_language = function(a,cb){
	var m = a.model;
	if (!a.language) a.language = 'englishUs';
	language = a.language;
	cb.done();
};
/*
a_get (fun):
	---a---
	str
	view
	cat (get from category)
*/
me.a_get = function(a,cb){
	var m = a.model;
	//jn.log('strings get:',a.str,a.view.v,a.cat);
	if (!a.str) return cb.fail('no str defined');
	if (!window['strings_'+language]) return cb.fail('no strings obj defined');
	if (!a.view && !a.cat) return window['strings_'+language][a.str];	
	else {
		var ind = a.cat;
		if (!ind && a.view) ind = a.view.v;
		//jn.log('str:',window['strings_'+language][ind][a.str]);
		return window['strings_'+language][ind][a.str];
	}
};return module.exports(j,cb);};require.store["models/users.js"]=function(j,cb){var module = {};var jn;

var users = module.exports = function(j,cb){
	jn = j;
	jn.m.users = users;
	cb.done();
};
var me = users;

me.fields = {
	email:{email:true,max:255},
	password:{min:6,max:50,secret:true},
	tokens:{ary:true,secret:true},
	salt:{secret:true},
	lastPageVisited:{id:true},
	fName:{type:'str'},
	lName:{type:'str'},
	address:{type:'str'},
	city:{type:'str'},
	state:{type:'str'},
	postal:{type:'str'},
	recoverToken:{type:'str',secret:true}, //for recovering password
	signUpReferrers:{type:'ary'}
};

//TODO: logout functionality


me.a_userError = function(a,cb){
	a.model.a('send',{action:a},cb);
};


/*
a_sendRecoverPassword (fun): checks if a user has this email
	---a---
	email
*/
me.a_sendRecoverPassword = function(a,cb){
	if (!a.email) return cb.fail('no email entered');
	a.model.a({a:'send',action:a},cb);
};


/*
a_checkEmail (fun): checks if a user has this email
	---a---
	email
*/
me.a_checkEmail = function(a,cb){
	if (!a.email) return cb.fail('no email entered');
	a.model.a({a:'send',action:a},cb);
};


/*
a_recoverTokenCheck (fun): checks if a recover token is valid
	---a---
	email
	token
*/
me.a_recoverTokenCheck = function(a,cb){
	a.model.a({a:'send',action:a},cb);
};




/*
a_setPassword (fun): changes a user's password
	---a---
	email
	token
	newPassword
	newPasswordRepeat
*/
me.a_setPassword = function(a,cb){
	if (a.newPassword != a.newPasswordRepeat) return cb.fail('passwords don\'t match');
	a.model.a({a:'send',action:a},cb);
};


/*
a_changePassword (fun): changes a user's password
	---a---
	curPassword
	newPassword
	newPasswordRepeat
*/
me.a_changePassword = function(a,cb){
	if (a.newPassword != a.newPasswordRepeat) return cb.fail('passwords don\'t match');
	a.model.a({a:'send',action:a},cb);
};


/*
a_logout (fun): logs out a user
	---a---
	sess
*/
me.a_logout = function(a,cb){
	var sess = jn.sess(a);
	jn.ch(function(d,ch){
		a.model.a({a:'send',action:a},ch);
	}).ch(function(d,ch){ //logout res
		sess.a('destroy');
		jn.web.setCookie({name:'token',path:'/',domain:jn.config.cookieDomain}); //delete cookie
		jn.web.setCookie({name:'token',path:'/'});
		//jn.web.setCookie({name:'sessId',path:'/'}); //delete cookie
		ch.done();
	}).cb(cb);
};



me.a_login = function(a,cb){
	var sess = jn.sess(a);
	jn.ch(function(d,ch){
		a.model.a({a:'send',action:a},ch);
	}).ch(function(d,ch){
		//jn.log('login res:',d);
		if (!d.rec) sess.access = ['public'];
		else {
			//setup user
			var user = jn.m(a.model.m,{id:d.rec.id});
			user.rec = d.rec;

			//set sess user values
			sess.access = user.rec.access;
			sess.user = user;

			//store token in cookie
			if (d.token) jn.web.setCookie({name:'token',value:d.token,expires:365,path:'/',domain:jn.config.cookieDomain});
		}
		ch.done();
	}).cb(cb);
};




me.a_signUp = function(a,cb){
	var sess = jn.sess(a);
	jn.ch(function(d,ch){
		var refCookie = jn.web.getCookie({key:'referrers'});
		if (refCookie){
			refCookie = jn.morph({thaw:refCookie});
			a.signUpReferrers = refCookie;
		}
		a.model.a({a:'send',action:a},ch);
	}).ch(function(d,ch){
		//jn.log('signUp res:',d);
		if (!d.rec) sess.access = ['public'];
		else {
			//setup user
			var user = jn.m(a.model.m,{id:d.rec.id});
			user.rec = d.rec;

			//set sess user values
			sess.access = d.rec.access;
			sess.user = user;

			//store token in cookie
			if (d.token) jn.web.setCookie({name:'token',value:d.token,expires:365,path:'/',domain:jn.config.cookieDomain});
		}
		ch.done();
	}).cb(cb);
};


me.a_auth = function(a,cb){
	//send to back end to handle
	a.token = jn.web.getCookie({key:'token'});

	a.model.a({a:'send',action:a},{
		fail:cb.fail,
		done:function(res){
			//jn.log('auth res:',res.rec);
			var user;
			if (!res.model){
				jn.m('sess').access = ['public'];

				jn.log('referrer:',document.referrer);
				if (document.referrer){ //store referrer in cookie

					var refCookie = jn.web.getCookie({key:'referrers'});
					if (!refCookie){
						refCookie = [document.referrer];
					}
					else {
						refCookie = jn.morph({thaw:refCookie});
						jn.log('refCookie:',refCookie);
						if(refCookie.indexOf(document.referrer) === -1)
						refCookie.push(document.referrer);
					}
					refCookie = jn.morph({t:refCookie,freeze:true});
					jn.web.setCookie({
						name:'referrers',
						value:refCookie,
						expires:365, //one year
						domain:jn.config.cookieDomain
					});	
					//%5B%22http%3A%2F%2Flocalhost%3A9090%2Fpage%3Fid%3D53162bf8df8695230d000003%22%2C%22http%3A%2F%2Fstackoverflow.com%2Fquestions%2F220149%2Fhow-do-i-access-the-http-request-header-fields-via-javascript%22%5D

				}
			}
			else {
				user = jn.m(res.model);
				user.rec = res.rec;
				jn.m('sess').access = user.rec.access;
				jn.m('sess').user = user;
			}
			cb.done({model:user});
		}
	});
};


return module.exports(j,cb);};require.store["web/views/base.js"]=function(j,cb){var module = {};var view = 'base', jn;
var me = module.exports = function(j,cb){
	jn = j, jn.v[view] = me;
	cb.done();
};
me.a_build = function(a,cb){ //happens once, bind models to view here
	var v = a.view;
	jn.ch(function(d,ch){
		jn.m('users').a('auth',ch);
	}).ch(function(d,ch){
		v.branch.alert = v.child('alert');
		v.branch.err = function(err){
			jn.m('users').a('userError',{
				error:err,when:jn.date({get:'ts'})
			});
			v.branch.alert.a('show',{message:err});
		};
		v.branch.win = jn.v('win');
		v.branch.left = v.child('left');
		v.branch.pageNav = v.child('pageNav');
		v.branch.base = v;
		if (d.model) v.branch.sessUser = d.model;

		jn.socket.bind({bind:{
			disconnect:function(){
				v.branch.alert.a('show',{message:'Connection to Brandisty lost.  Attempting to reconnect...'});
			},
			reconnect:function(){
				v.branch.alert.a('hide');
			}
		}});

		ch.done();
	}).cb(cb);
};
me.a_bind = function(a,cb){
	var v = a.view;
	v.a('btn');
	cb.done();
};
me.a_leftShow = function(a,cb){
	var v = a.view;
	v.$el.find('[btn="leftShow"]').fadeOut(100);
	v.branch.left.a('slideIn');
};
me.a_leftHide = function(a,cb){
	var v = a.view;
	v.$el.find('[btn="leftShow"]').fadeIn(100);
	v.branch.left.a('slideOut');
	v.branch.pageNav.a('slideOut');
};
me.a_pageNavShow = function(a,cb){
	var v = a.view;
	v.$el.browsePages = v.$el.find('.pageNavigation');
	v.$el.browseIcon = v.$el.browsePages.find('.browseIcon');
	v.$el.closeIcon = v.$el.browsePages.find('.closeIcon');

	var str = jn.m('strings').a('get',{str:'closePages',cat:'p_brand'});
	v.$el.browsePages.find('.label').text(str);
	v.$el.browseIcon.hide();
	v.$el.closeIcon.show();
	v.branch.pageNav.a('pageNavShow');
};
me.a_pageNavHide = function(a,cb){
	var v = a.view;
	v.$el.browsePages = v.$el.find('.pageNavigation');
	v.$el.browseIcon = v.$el.browsePages.find('.browseIcon');
	v.$el.closeIcon = v.$el.browsePages.find('.closeIcon');

	var str = jn.m('strings').a('get',{str:'browsePages',cat:'p_brand'});
	v.$el.browsePages.find('.label').text(str);
	v.$el.browseIcon.show();
	v.$el.closeIcon.hide();
	v.branch.pageNav.a('slideOut');
};return module.exports(j,cb);};require.store["web/views/categories/asset/asset.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.asset = me;
	cb.done();
};

me.a_build = function(a,cb){
	var v = a.view, b = v.a('branch'), $el = v.$el;

	$el.attr({pos:v.pos,path:v._path});
	cb.done();
};

me.a_bind = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;

	jn.log('ASSET BIND');

	var assetChanged = false;
	if (!a.spot || !v.spot || a.spot.id != v.spot.id){ 
		//delete v._gr;
		assetChanged = true;
	}
	v.a('btn');
	v.a('access',{access:b.access});
	v.a('section');

	var gridChanged = false;
	if (!a.spot || !v._gr || !jn.compare(a.spot._gr,v._gr)){
		gridChanged = true;
	}

	v.spot = a.spot;
	//jn.log('changed:',assetChanged,gridChanged);
	jn.ch(function(d,ch){
		if (!assetChanged) return ch.done();
		v.model = jn.m('assets',{id:v.spot.id});
		a.view.a('model',{model:v.model},ch);
		ch.done();
	}).ch(function(d,ch){
		if (!gridChanged) return ch.done();
		//jn.log('changed _gr:',v._gr,a.spot._gr);
		v._gr = a.spot._gr;
		b.grid.a('add',{add:v,
			update:function(dim){
				var spot = b.page.a('getPos',{pos:v.pos});
				spot._gr = dim;
				//jn.log('update:',dim,spot._gr);
		        return false;
			}
		},ch);
	}).ch(cb.done).fail(function(res){
		jn.log('image row err:',res);
		v.a('hide');
	});
};

me.a_hide = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.grid.a('remove',{remove:v});
	delete v._gr;
	delete v._grUpdate;
	v.a('hide',{root:true},cb);
};

me.a_rec = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	jn.log('asset rec:',v.model.rec);
	if (!v.model.rec){
		v.a('hide');
		return cb.fail('no asset rec found');
	} 
	jn.ch(function(d,ch){
		v.assetType = jn.m.assets.getType(v.model.rec.ext);
		v.a(v.assetType,ch);
	}).cb(cb);
};

me.a_eps = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	v.a('section',{show:'image'});
	var rec = v.model.rec;
	var url = 'img?id='+v.model.id;
	$el.find('[prop="img"]').css({'background-image':'url('+url+')'});
	var color = (rec.data && rec.data.bgColor)? rec.data.bgColor: '#f8f8f8';

	jn.log('color:',color);

	var colorHex = color;
	if (colorHex.substring(0, 1) == '#') { 
	  colorHex = colorHex.substring(1);
	}
	$el.find('[prop="bgFill"]').css({'background-color':color});
	$el.removeClass('white black').addClass(getContrastYIQ(colorHex));
	a.view.a('set',v.model.rec);

	if (!rec.data.dim || !rec.data.propWH){
		v.model.a('getData');
		return;
	}

	var dim = rec.data.dim;
	var downloadSizes = [{label:'Large',size:1200},{label:'Medium',size:600},{label:'Small',size:300}];
	v.$el.find('[btn="downloadQuick"]:not([tpl])').remove();
	var $tpl = v.$el.find('[tpl="downloadQuick"]');
	var $insert = v.$el.find('[area="downloadQuick"]');
	$tpl.hide();
	for (var i=0,len=downloadSizes.length;i<len;i++){
		var size = downloadSizes[i].size;
		var label = downloadSizes[i].label;

		var w,h;
		if (rec.data.propWH >= 1){
			w = size;
			h = Math.round(size/rec.data.propWH);
		}
		else {
			h = size;
			w = Math.round(size*rec.data.propWH);
		}
		if (w){
			var $dl = $tpl.clone();
			$dl.removeAttr('tpl');
			$dl.attr({w:w,h:h});
			$dl.find('[prop="label"]').html(label);
			$dl.find('[prop="size"]').html(w+'x'+h+'.png');
			$dl.show();
			$insert.before($dl);
		}
	}
	cb.done();
};

me.a_image = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	v.a('section',{show:'image'});
	var rec = v.model.rec;
	var url = 'img?id='+v.model.id+'&w=720&h=618';
	$el.find('[prop="bgFill"]').css({'background-image':'url("'+url+'")'})
	.getImgSize(function(dim){
		var h = $el.height();
		var w = $el.width();
		var bh = dim.height;
		var bw = dim.width;

		if(h > bh && w > bw){
			$el.find('[prop="bgFill"]').addClass('auto');
		}
	});

	if (!rec.data.dim || !rec.data.propWH){
		v.model.a('getData');
		return;
	}

	var dim = rec.data.dim;
	var downloadSizes = [{label:'Large',size:1200},{label:'Medium',size:600},{label:'Small',size:300}];
	v.$el.find('[btn="downloadQuick"]:not([tpl])').remove();
	var $tpl = v.$el.find('[tpl="downloadQuick"]');
	var $insert = v.$el.find('[area="downloadQuick"]');
	$tpl.hide();
	for (var i=0,len=downloadSizes.length;i<len;i++){
		var size = downloadSizes[i].size;
		var label = downloadSizes[i].label;

		var w,h;
		if (rec.data.propWH >= 1){
			if (dim.w >= size){
				w = size;
				h = Math.round(size/rec.data.propWH);
			}
		}
		else {
			if (dim.h >= size){
				h = size;
				w = Math.round(size*rec.data.propWH);
			}
		}
		if (w){
			var $dl = $tpl.clone();
			$dl.removeAttr('tpl');
			$dl.attr({w:w,h:h});
			$dl.find('[prop="label"]').html(label);
			$dl.find('[prop="size"]').html(w+'x'+h+'.'+rec.ext);
			$dl.show();
			$insert.before($dl);
		}
	}
	cb.done();
};

me.a_assetEdit = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_imageEdit').a('show',{pos:v.pos,spot:v.spot});
};

me.a_imageOverlay = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_imageOverlay').a('show',{pos:v.pos,spot:v.spot});
};

me.a_downloadCustom = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_imageDownload').a('show',{pos:v.pos,spot:v.spot});
};

me.a_downloadQuick = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	var assetId = v.model.id;
	if (!assetId) return ch.fail('no asset defined');
	var files = [{
		w:a.$btn.attr('w'),
		h:a.$btn.attr('h'),
		ext:a.$btn.attr('ext')
	}];
	var path = 'downloadAsset?obj='+jn.web.packObj({
		id:b.page.id,
		assetId:assetId,
		files:files
	});
	window.location = path;
};
return module.exports(j,cb);};require.store["web/views/categories/asset/assetCat.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.assetCat = me;
	cb.done();
};

/*
a_build (fun):
	---a---
	pos (str): the position of the category
	cat (obj): the category object
*/
me.a_build = function(a,cb){
	var v = a.view, b = v.a('branch'), $el = v.$el;
	var part = 'assets';
	$el.attr('pos',v.pos);
	v.a('set',a.cat);
	v.a('access',{access:b.access});
	if (!a.cat.assets) return cb.done();
	if (!v.shown) v.shown = [];
	jn.ch(function(d,ch){ //init grid
		if (b.grid) return ch.done();
		var $container = $el.find('ul');
		b.grid = v.child('grid');
		var noResize = (!b.isAccess('team'))? true: false;
		b.grid.a('init',{$container:$container,group:part,noResize:noResize,gridW:6,size:160,
			update:function(childs){
				b.page.a('update',{parts:b.page.rec.parts});
			},
			jump:function(jump){
				jn.log('jump:',jump);
				if (!jump.group) return;
				var groupPos = jump.group.parent.pos;
				var gCat = b.page.a('getPos',{pos:groupPos});;
				var elemPos = jump.elem.pos;
				var spot = b.page.a('getPos',{pos:elemPos});
				b.page.a('moveIntoCat',{part:part,spot:spot,cat:gCat});
			}
		},ch);
	}).ch(function(d,ch){ //check for views to hide
		if (v.shown.length < 1 || v.shown.length <= a.cat.assets.length) return ch.done();
		var hideI = a.cat.assets.length - 1;
		jn.log('hide:',v.shown.length,a.cat.assets.length);
		jn.loop({ary:v.shown,i:hideI},{
			loop:function(loop){
				jn.log('hide:',hideI);
				v.shown[loop.i].a('hide',{
					fail:ch.fail,
					done:loop.next
				});
			},
			done:ch.done
		});
	}).ch(function(d,ch){ //show views
		v.shown = [];
		jn.loop({ary:a.cat.assets},{
			loop:function(loop){
				var spot = a.cat.assets[loop.i];
				var pos = v.pos+'.assets.'+loop.i;
				var row = v.child('asset',{pos:pos});
				v.shown.push(row);
				row.a('show',{spot:spot,rebind:true},{
					fail:ch.fail,
					done:loop.next
				});
			},
			done:ch.done
		});
	}).ch(function(d,ch){
		var $descrip = $el.find('textarea[prop="descrip"]');
		$descrip.autosize();
		$el.on('blur','textarea[prop="descrip"]',function(e){
			//console.log('blur');
			var descrip = $descrip.val();
			b.page.a('catDescrip',{descrip:descrip,pos:v.pos});
		});
		$el.on('keyup','textarea[prop="descrip"]',function(e){
			if(e.keyCode == 9){ //tab
				$(this).blur();
				return false;	
			}
		});
		ch.done();
	}).ch(cb.done).fail(b.err);
};

me.a_hide = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	var $descrip = $el.find('textarea[prop="descrip"]');
	$descrip.trigger('autosize.destroy');

	if (b.grid){
		b.grid.a('destroy');
		delete b.grid;
	}

	a.view.a('hide',{root:true},cb);
};
return module.exports(j,cb);};require.store["web/views/categories/colors/overlays/o_colorAdd.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_colorAdd = me;
	cb.done();
};

me.a_bind = function(a,cb){ //bind user events here
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('btn');

	a.view.a('set',{color:''});
	delete b.src;
	$el.find('[area=swatch]').css({
		'background-color': '#fff'
	});
	$el.find('[area="master-color"]').removeClass('val');
	$el.find('[area="color-vals"]').removeClass('show');

	jn.ch(function(d,ch){ //check maxAssets against numAssets
		if (!b.com.features || !b.com.features.maxAssets) return ch.done();
		b.com.a('getNumAssets',{
			fail:ch.fail,
			done:function(res){
				if (b.com.features.maxAssets <= res.numAssets){ //over max
					a.view.a('hide');
					b.overlay.child('o_selectPlan').a('show');
					return cb.done();
				}
				ch.done();
			}
		});
	}).ch(function(d,ch){
		$el.on('blur', 'input[prop="color"]',function(){
			b.alert.a('hide');
			a.view.a('sniffColor');
		});
		$el.on('keyup','input[prop="color"]',function(e){
			if (e.keyCode == 13){
				$(this).blur();
			}
		});
		ch.done();
	}).ch(cb.done).fail(b.err);
};

me.a_sniffColor = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	jn.ch(function(d,ch){
		var vals = a.view.a('vals');
		jn.m('as_color').a('sniffColor',{color:vals.color},ch);
	}).ch(function(d,ch){
		b.src = d.src;
		var data = {
			src: d.src,
			cmyk: d.cmyk.join(" "),
			rgb: d.rgb.join(" "),
			hex: d.hex,
			pantone: ''
		};
		if (d.pantone) data.pantone = d.pantone;
		$el.find('[area=swatch]').css({
			'background-color': d.hex
		});
		$el.find('[area="master-color"]').addClass('val');
		$el.find('[area="color-vals"]').addClass('show');
		a.view.a('set', data);
		cb.done();
	}).fail(function(err){
		b.err(err);
		//	clear previous values on error
		a.view.a('set',{
			cmyk: '',
			rgb: '',
			hex: '',
			pantone: ''
		});
	});	
};

me.a_addColor = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	jn.ch(function(d,ch){
		//	a color has not yet been added. stop add
		if(!b.src){
			return;
		}

		var send = a.view.a('vals');
		if (!send.rgb){
			return ch.fail('no color to add, please enter a valid color');
		}
		if (send.rgb) send.rgb = send.rgb.split(' ');
		if (send.cmyk) send.cmyk = send.cmyk.split(' ');
		send.type = 'color';
		send.src = b.src;
		b.page.a('addColor',send,ch);
	}).ch(function(d,ch){
		a.view.a('set',{
			color:'',
			cmyk:'',
			rgb:'',
			hex:'',
			pantone:''
		});
		b.overlay.a('hide');
		ch.done();
	}).ch(cb.done).fail(b.err);
};

return module.exports(j,cb);};require.store["web/views/categories/colors/overlays/o_colorOverlay.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_colorOverlay = me;
	cb.done();
};

me.defaultCats = [
	{category:'Primary',glyph:'\'',descrip:''},
	{category:'Secondary',glyph:'%',descrip:''},
	{category:'Accent',glyph:'(',descrip:''}
];

me.a_build = function(a,cb){
	var v = a.view;
	v.$sidebar = v.$el.find('[area="sidebar"]');
	v.$main = v.$el.find('[area="main"]');
	v.$bgColor = v.$el.find('[area="bgColor"]');
	v.$imgShow = v.$el.find('[img="show"]');
	v.$imgHide = v.$el.find('[img="hide"]');
	v.enableKeys = true;

	v.branch.win.a('bind',{
		resize:function(){
			var dim = v.branch.win.a('dim');
			v.$el.find('.item-hldr').height(dim.h);
		}
	});

	cb.done();
};

me.a_bind = function(a,cb){ //bind user events here
	var v = a.view;
	
	if (!a.spot && !v.spot) return cb.fail('no spot defined');
	v.spot = a.spot || v.spot;
	v.pos = a.pos || v.pos;
	v.id = v.spot.id;
	if (!v.id) return cb.fail('no id defined');

	v.a('btn');
	v.a('access',{access:v.branch.access});

	
	//jn.log('zclip:',v.$el.find('[zclip]').zclip);
	ZeroClipboard.config({swfPath:'/flash/zeroClipboard.swf'});
	var zero = new ZeroClipboard(v.$el.find('[zclip="rgb"]'));
	zero.on('aftercopy',function(e){
		v.branch.alert.a('show',{
			message:'Copied to clipboard',
			type:'success',
			hideAfter:1000
		})
    	jn.log('Copied text to clipboard: '+e.data['text/plain']);
  	});
	zero.on('copy',function(e){
		e.clipboardData.setData('text/plain',v.$el.find('[prop="rgb"]').val());
	});

	var zero = new ZeroClipboard(v.$el.find('[zclip="cmyk"]'));
	zero.on('aftercopy',function(e){
		v.branch.alert.a('show',{
			message:'Copied to clipboard',
			type:'success',
			hideAfter:1000
		})
    	jn.log('Copied text to clipboard: '+e.data['text/plain']);
  	});
	zero.on('copy',function(e){
		e.clipboardData.setData('text/plain',v.$el.find('[prop="cmyk"]').val());
	});

	var zero = new ZeroClipboard(v.$el.find('[zclip="hex"]'));
	zero.on('aftercopy',function(e){
		v.branch.alert.a('show',{
			message:'Copied to clipboard',
			type:'success',
			hideAfter:1000
		})
    	jn.log('Copied text to clipboard: '+e.data['text/plain']);
  	});
	zero.on('copy',function(e){
		e.clipboardData.setData('text/plain',v.$el.find('[prop="hex"]').val());
	});

	var zero = new ZeroClipboard(v.$el.find('[zclip="pantone"]'));
	zero.on('aftercopy',function(e){
		v.branch.alert.a('show',{
			message:'Copied to clipboard',
			type:'success',
			hideAfter:1000
		})
    	jn.log('Copied text to clipboard: '+e.data['text/plain']);
  	});
	zero.on('copy',function(e){
		e.clipboardData.setData('text/plain',v.$el.find('[prop="pantone"]').val());
	});

	var prevColor = v.$el.find('input[prop="color"]').val();
	v.$el.on('blur', 'input[prop="color"]',function(){
		if (prevColor == $(this).val()) return;
		//check if color has changed
		v.branch.alert.a('hide');
		v.a('sniffColor');
	});
	v.$el.on('keyup','input[prop="color"]',function(e){
		if (e.keyCode == 13 || e.keyCode == 9){
			e.preventDefault();
			$(this).blur();
			return false;
		}
	});

	v.$el.on('blur', '[area="colorVals"] input[prop]',function(){
		v.branch.alert.a('hide');
		v.a('saveColor');
	});

	//to enable and disable left and right key navigation
	v.$el.on('focus','input',function(){
		v.enableKeys = false;
	});
	v.$el.on('blur','input',function(){
		v.enableKeys = true;
	});

	//jn.log('color id:',v.spot);

	jn.ch(function(d,ch){
		v.assets = {};
		if (v.spot.id){ //get cmyk asset rec
			v.assets.color = jn.m('assets',{id:v.spot.id});
			v.a('model',{model:v.assets.color,
				rec:function(){
					v.a('color');
				}
			});
		}
		ch.done();
	}).ch(function(d,ch){ //bind to page
		a.view.a('model',{model:v.branch.page,rec:function(){
			a.view.a('page');
		}},ch);
	}).ch(function(d,ch){ //get position of this logo in brand (if exists)
		v.a('initControls');
		v.a('buildCats',a,ch);
	}).ch(cb.done).fail(v.branch.err);
};

me.a_sniffColor = function(a,cb){
	var v = a.view;

	jn.ch(function(d,ch){
		var vals = v.a('vals');
		jn.m('as_color').a('sniffColor',{color:vals.color},ch);
	}).ch(function(d,ch){
		v.src = d.src;
		var data = {
			src: d.src,
			cmyk: d.cmyk.join(" "),
			rgb: d.rgb.join(" "),
			hex: d.hex,
			pantone: ''
		};
		if (d.pantone) data.pantone = d.pantone;
		v.$el.find('[area=color]').css({
			'background-color': d.hex
		});
		v.$el.find('[area=master-color]').addClass('val');
		v.$el.find('.converted-color-values').addClass('show');
		v.a('set', data);
		v.a('saveColor',ch);
	}).ch(cb.done).fail(function(err){
		v.branch.err(err);
		//	clear previous values on error
		v.a('set',{
			cmyk: '',
			rgb: '',
			hex: '',
			pantone: ''
		});
	});
};

me.a_resize = function(a,cb){
	var v = a.view;
	if (v.$sidebar.hasClass('closed')){
		v.$sidebar.removeClass('closed');
		v.$main.removeClass('fullscreen');
		v.$imgShow.show();
		v.$imgHide.hide();
	}
	else {
		v.$sidebar.addClass('closed');
		v.$main.addClass('fullscreen');
		v.$imgShow.hide();
		v.$imgHide.show();
	}
};

me.a_settings = function(a,cb){
	var v = a.view;
	changeView('settings');
};

me.a_back = function(a,cb){
	var v = a.view;
	changeView('back');
};

me.a_save = function(a,cb){
	var v = a.view;

	var vals = v.a('vals');
	jn.ch(function(d,ch){
		//move cat, if cat changed
		var cat = v.$el.find('[tpl="cat"].active').data('cat');
		if (v.activeCat) var active = v.branch.page.rec.parts.colors[v.activeCat].category;
		//jn.log('cat:',cat.category,active);
		if (active && cat.category == active) return ch.done();
		jn.log('cat:',cat);
		v.branch.page.a('moveIntoCat',{part:'colors',cat:cat,spot:v.spot},ch);
	}).ch(function(d,ch){
		//v.branch.overlay.a('hide');
		changeView('back');
		ch.done();
	}).ch(cb.done).fail(v.branch.err);
};

me.a_saveColor = function(a,cb){
	var v = a.view;
	var vals = {};
	vals.rgb = v.$el.find('[area="colorVals"] input[prop="rgb"]').val();
	vals.cmyk = v.$el.find('[area="colorVals"] input[prop="cmyk"]').val();
	vals.pantone = v.$el.find('[area="colorVals"] input[prop="pantone"]').val();
	vals.hex = v.$el.find('[area="colorVals"] input[prop="hex"]').val();
	jn.log('save color:',vals);
	jn.ch(function(d,ch){
		if (vals.rgb) vals.rgb = vals.rgb.split(' ');
		if (vals.cmyk) vals.cmyk = vals.cmyk.split(' ');
		if (v.src) vals.src = v.src;
		v.assets.color.a('update',vals,ch);
	}).ch(cb.done).fail(v.branch.err);
};

me.a_color = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	var color = v.assets.color;

	v.$el.find('[area="color"]').css({'background-color':color.rec.data.hex});

	var data = {
		src: color.rec.data.src,
		hex: color.rec.data.hex,
		pantone: color.rec.data.pantone || ''
	};
	if (color.rec.data.cmyk) data.cmyk = color.rec.data.cmyk.join(' ');
	if (color.rec.data.rgb) data.rgb = color.rec.data.rgb.join(' ');
	var srcColor = (color.rec.data.src == 'cmyk' || color.rec.data.src == 'rgb')? color.rec.data[color.rec.data.src].join(' '): color[color.rec.data.src];
	data.color = srcColor;

	v.a('set',data);

	jn.log('color:',color);
};

me.a_display = function(a, cb){
	var v = a.view;
	v.$el.show();

	var wh = $(window).height(),
		//childHeight = a.$child.height(),
		$scrollDiv = v.$el.find('.scroll-hldr'),
		mh = v.$el.height();
		console.log('Mh, ', mh);
		console.log('Wh, ', wh);

   	if ( mh >= wh ) {
   		$scrollDiv.height(wh - 100);
    }
	
	$scrollDiv.mCustomScrollbar({
		theme: 'dark',
		autoHideScrollbar: false,
		//mouseWheel:false,
		contentTouchScroll:false,
		scrollInertia: 20,
		advanced:{
			updateOnContentResize: true,
			autoScrollOnFocus:false
		}
	});

	v.$main.find('.item-hldr').css('max-height', ( ( parseInt( v.$main.height() ) - 200 ) + 'px' ));

	v.branch.win.a('touch');

	cb.done();
};

var changeView = function( typeOfShift ){
	var shiftPanes = $('[data-pane="shift"]');
	var fadePanes = $('[data-pane="fade"]');

	if ( typeOfShift === 'settings' ){
		shiftPanes.addClass('shift-left');
		fadePanes.addClass('fade-on');
	}
	else if ( typeOfShift === 'back' || typeOfShift === 'reset' ){
		shiftPanes.removeClass('shift-left');
		fadePanes.removeClass('fade-on');
	}
};

var setBackgroundColor = function( colorVal, elementToChange ){
	var colorVal = colorVal.replace(/#/g, '');

	if ( colorVal.indexOf('rgb') != -1 ){
		elementToChange.css('background', colorVal);
	} 
	else {
		elementToChange.css('background', '#' + colorVal);
	}
};

me.a_buildCats = function(a,cb){
	var v = a.view;
	v.activeCat = v.pos.split('.')[1]; //get active category from pos
	jn.log('active cat:',v.activeCat);
	//loop through logo categories
	var parts = v.branch.page.rec.parts;
	if (!me.$tpl) me.$tpl = v.$el.find('[tpl="cat"]').detach();
	v.$el.find('[tpl="cat"]').remove();
	var $container = v.$el.find('[container="cat"]');
	var $addCat = v.$el.find('[btn="addCat"]');
	var cats = [];
	if (a.custom){ //custom category defined
		var $cat = me.$tpl.clone();
		$cat.addClass('active');
		$cat.find('[prop="category"]').html(a.custom);
		$cat.data('cat',{category:a.custom,descip:''});
		$addCat.before($cat);
	}
	var colors = parts.colors;
	for (var i=0,len=colors.length;i<len;i++){
		var cat = colors[i];
		if (cat){
			var $cat = me.$tpl.clone();
			if (v.activeCat == i && !a.custom){
				v.curCat = cat.category;
				$cat.addClass('active');
			}
			$cat.find('[prop="category"]').html(cat.category);
			if (cat.assets.length > 0){
				$cat.find('[prop="glyph"]').hide();
				var imgId = cat.assets[0].rgb || cat.assets[0].cmyk || cat.assets[0].id;
				var src = 'img?id='+imgId;
				$cat.find('[prop="img"]').show().attr('src',src);
			}
			$cat.data('cat',cat);
			$addCat.before($cat);
			cats.push(cat.category.toLowerCase());
		}
	}
	//if (v.assets.color) return cb.done();
	for (var i=0,len=me.defaultCats.length;i<len;i++){
		var cat = me.defaultCats[i];
		if (cats.indexOf(cat.category.toLowerCase()) === -1){ //default cat not populated
			var $cat = me.$tpl.clone();
			$cat.data('cat',cat);
			$cat.find('[prop="category"]').html(cat.category);
			$cat.find('[prop="glyph"]').html(cat.glyph);
			$addCat.before($cat);
		}
	}
	cb.done();
};

me.a_catSelect = function(a,cb){
	var v = a.view;
	a.$btn.siblings('.active').removeClass('active');
	a.$btn.addClass('active');
};

me.a_addCat = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('hide');
	b.overlay.child('o_catAdd').a('show',{prev:a.view});
};

me.a_prev = function(a,cb){
	var v = a.view;
	var pos = v.branch.page.a('search',{spot:v.spot});
	if (!pos) return cb.fail('no pos found');

	var posAry = pos.split('.');
	if (posAry.length < 3) return cb.fail('pos not complete');
	var part = posAry[0];
	var catInd = posAry[1];
	var assetInd = posAry[3];
	var catI = catInd;
	
	var spot;
	if (v.spot._gr){
		while (catI >= 0 && !spot){
			var cat = v.branch.page.rec.parts[part][catI];
			for (var i=0,len=cat.assets.length;i<len;i++){ //look in same cat
				var sp = cat.assets[i];
				if (((sp._gr.x < v.spot._gr.x && sp._gr.y == v.spot._gr.y) || (sp._gr.y < v.spot._gr.y) || (catI < catInd)) && 
					(!spot || ((sp._gr.x > spot._gr.x && sp._gr.y == spot._gr.y) || (sp._gr.y > spot._gr.y)))
					){
					spot = sp;
				}
			}
			catI--;
		}
		if (spot){
			var newPos = v.branch.page.a('search',{spot:v.spot});
			jn.ch(function(d,ch){
				v.a('hide',ch);
			}).ch(function(d,ch){
				v.branch.overlay.child('o_colorOverlay').a('show',{spot:spot,pos:newPos},ch);
			}).cb(cb);
		}
	}

};

me.a_next = function(a,cb){
	var v = a.view;
	var pos = v.branch.page.a('search',{spot:v.spot});
	if (!pos) return cb.fail('no pos found');

	var posAry = pos.split('.');
	if (posAry.length < 3) return cb.fail('pos not complete');
	var part = posAry[0];
	var catInd = posAry[1];
	var assetInd = posAry[3];
	var catI = catInd;

	var spot;
	if (v.spot._gr){
		while (catI < v.branch.page.rec.parts[part].length && !spot){
			var cat = v.branch.page.rec.parts[part][catI];
			jn.log('cat:',cat);
			for (var i=0,len=cat.assets.length;i<len;i++){
				var sp = cat.assets[i];
				if (((sp._gr.x > v.spot._gr.x && sp._gr.y == v.spot._gr.y) || (sp._gr.y > v.spot._gr.y) || (catI > catInd)) && 
					(!spot || ((sp._gr.x < spot._gr.x && sp._gr.y == spot._gr.y) || (sp._gr.y < spot._gr.y)))
					){
					spot = sp;
				}
			}
			catI++;
		}
		if (spot){
			var newPos = v.branch.page.a('search',{spot:v.spot});
			jn.ch(function(d,ch){
				v.a('hide',ch);
			}).ch(function(d,ch){
				v.branch.overlay.child('o_colorOverlay').a('show',{spot:spot,pos:newPos},ch);
			}).cb(cb);
		}
	}
};

me.a_initControls = function(a,cb){
	var v = a.view;
	var v = a.view;
	var pos = v.branch.page.a('search',{spot:v.spot});
	if (!pos) return cb.fail('no pos found');

	var posAry = pos.split('.');
	if (posAry.length < 3) return cb.fail('pos not complete');
	var part = posAry[0];
	var catInd = posAry[1];
	var assetInd = posAry[3];
	var catI = catInd;
	var $next = v.$el.find('[btn="next"]');
	var $prev = v.$el.find('[btn="prev"]');

	$('body').on('keyup',function(e){
		if (!v.enableKeys) return;
		jn.log('keyup:',e.keyCode);
		if (e.keyCode == 39){
			v.a('next');
		}
		else if (e.keyCode == 37){
			v.a('prev');
		}
		else if (e.keyCode == 27){
			v.branch.overlay.a('hide');
		}
	});

	if (!v.spot._gr){
		//hide next and prev
		$next.css({visibility:'hidden'});
		$prev.css({visibility:'hidden'});
		return;
	}

	var spot;
	while (catI < v.branch.page.rec.parts[part].length && !spot){
		var cat = v.branch.page.rec.parts[part][catI];
		for (var i=0,len=cat.assets.length;i<len;i++){
			var sp = cat.assets[i];
			if (((sp._gr.x > v.spot._gr.x && sp._gr.y == v.spot._gr.y) || (sp._gr.y > v.spot._gr.y) || (catI > catInd)) && 
				(!spot || ((sp._gr.x < spot._gr.x && sp._gr.y == spot._gr.y) || (sp._gr.y < spot._gr.y)))
				){
				spot = sp;
			}
		}
		catI++;
	}
	if (spot) $next.css({visibility:'visible'});
	else $next.css({visibility:'hidden'});

	catI = catInd;
	spot = undefined;
	while (catI >= 0 && !spot){
		var cat = v.branch.page.rec.parts[part][catI];
		for (var i=0,len=cat.assets.length;i<len;i++){ //look in same cat
			var sp = cat.assets[i];
			if (((sp._gr.x < v.spot._gr.x && sp._gr.y == v.spot._gr.y) || (sp._gr.y < v.spot._gr.y) || (catI < catInd)) && 
				(!spot || ((sp._gr.x > spot._gr.x && sp._gr.y == spot._gr.y) || (sp._gr.y > spot._gr.y)))
				){
				spot = sp;
			}
		}
		catI--;
	}
	if (spot) $prev.css({visibility:'visible'});
	else $prev.css({visibility:'hidden'});
};

me.a_removeColor = function(a,cb){
	var v = a.view;
	v.a('hide');
	v.branch.overlay.child('o_colorRemove').a('show',{prev:v,pos:v.pos});
};

me.a_hide = function(a,cb){
	var v = a.view;
	v.branch.alert.a('hide');
	$('body').removeClass('dropDisabled');
	$('body').off('keyup');

	v.$el.find('.scroll-hldr').mCustomScrollbar('destroy');
	v.a('hide',{root:true},cb);
};



return module.exports(j,cb);};require.store["web/views/categories/colors/overlays/o_colorRemove.js"]=function(j,cb){var module = {};var vp = 'o_colorRemove', jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v[vp] = me;
	cb.done();
};

/*
a_bind (fun):
	---a---
	prevView
*/
me.a_bind = function(a,cb){
	var v = a.view;
	v.a('btn');
	v.pos = a.pos;
	v.prev = a.prev;
	cb.done();
};

me.a_display = function(a, cb) {
	var v = a.view;
	v.$el.show();
	var h = v.$el.outerHeight();
	v.$el.css('margin-top', -(h/2));
	cb.done();
};

me.a_cancel = function(a,cb){
	var v = a.view;
	//close this overlay and show prev
	v.a('hide');
	v.prev.a('show');
};

me.a_remove = function(a,cb){
	var v = a.view;

	jn.ch(function(d,ch){
		//remove spot from page
		v.branch.page.a('removeSpot',{pos:v.pos},ch);
	}).ch(function(d,ch){
		v.branch.overlay.a('hide');
		cb.done();
	}).fail(v.branch.err);
};
return module.exports(j,cb);};require.store["web/views/categories/colors/p_b_colorCat.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.p_b_colorCat = me;
	cb.done();
};

/*
a_build (fun):
	---a---
	pos (str): the position of the category
	cat (obj): the category object
*/
me.a_build = function(a,cb){
	var v = a.view, b = v.a('branch'), $el = v.$el;
	var part = 'colors';

	$el.attr('pos',v.pos);
	v.a('set',a.cat);
	v.cat = a.cat;
	v.a('access',{access:b.access});
	v.$catH2 = v.$el.find('h2[prop="category"]');
	v.$catH2.show();
	v.$catField = v.$el.find('input[prop="category"]');
	v.$catField.hide();

	v.$moveUp = v.$el.find('[btn="moveUp"]');
	v.$moveDown = v.$el.find('[btn="moveDown"]');
	if (a.ind !== undefined && a.len !== undefined){
		if (a.ind == 0) v.$moveUp.hide();
		else v.$moveUp.show();
		if (a.ind >= a.len - 1) v.$moveDown.hide();
		else v.$moveDown.show();
	}

	if (!a.cat.assets) return cb.done();
	if (!v.shown) v.shown = [];
	jn.ch(function(d,ch){ //init grid
		if (b.grid) return ch.done();
		var $container = $el.find('ul');
		b.grid = v.child('grid');
		var noResize = (!b.isAccess('team'))? true: false;
		b.grid.a('init',{$container:$container,group:part,noResize:noResize,
			update:function(childs){
				b.page.a('update',{parts:b.page.rec.parts});
			},
			jump:function(jump){
				jn.log('jump:',jump);
				if (!jump.group) return;
				var groupPos = jump.group.parent.pos;
				var gCat = b.page.a('getPos',{pos:groupPos});;
				var elemPos = jump.elem.pos;
				var spot = b.page.a('getPos',{pos:elemPos});
				b.page.a('moveIntoCat',{part:part,spot:spot,cat:gCat});
			}
		},ch);
	}).ch(function(d,ch){ //check for views to hide
		if (v.shown.length < 1 || v.shown.length <= a.cat.assets.length) return ch.done();
		var hideI = a.cat.assets.length - 1;
		//jn.log('hide:',v.shown.length,a.cat.assets.length);
		jn.loop({ary:v.shown,i:hideI},{
			loop:function(loop){
				//jn.log('hide:',hideI);
				if (v.shown[loop.i]) v.shown[loop.i].a('hide',{
					fail:ch.fail,
					done:loop.next
				});
				else loop.next();
			},
			done:ch.done
		});
	}).ch(function(d,ch){ //show views
		v.shown = [];
		jn.loop({ary:a.cat.assets},{
			loop:function(loop){
				var spot = a.cat.assets[loop.i];
				var pos = v.pos+'.assets.'+loop.i;
				var row = v.child('p_b_colorRow',{pos:pos});
				v.shown.push(row);
				row.a('show',{spot:spot,rebind:true},{
					fail:ch.fail,
					done:loop.next
				});
			},
			done:ch.done
		});
	}).ch(function(d,ch){
		var $descrip = $el.find('textarea[prop="descrip"]');
		$descrip.autosize();
		$el.on('blur','textarea[prop="descrip"]',function(e){
			//console.log('blur');
			var descrip = $descrip.val();
			b.page.a('catDescrip',{descrip:descrip,pos:v.pos});
		});
		$el.on('keyup','textarea[prop="descrip"]',function(e){
			if(e.keyCode == 9){ //tab
				$(this).blur();
				return false;	
			}
		});

		$el.on('blur','input[prop="category"]',function(e){
			//console.log('blur');
			v.a('saveCategory');
		});
		$el.on('keyup','input[prop="category"]',function(e){
			if(e.keyCode == 9 || e.keyCode == 13){ //tab
				$(this).blur();
				return false;	
			}
		});
		ch.done();
	}).ch(cb.done).fail(b.err);
};

me.a_hide = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	var $descrip = $el.find('textarea[prop="descrip"]');
	$descrip.trigger('autosize.destroy');

	if (b.grid){
		b.grid.a('destroy');
		delete b.grid;
	}
	a.view.a('hide',{root:true},cb);
};

me.a_bind = function(a,cb){
	var v = a.view;
	v.a('btn');
	cb.done();
};

me.a_moveUp = function(a,cb){
	var v = a.view;
	jn.ch(function(d,ch){
		v.branch.page.a('moveCategory',{pos:v.pos,part:'colors',move:'up'},ch);
	}).cb(cb);
};

me.a_moveDown = function(a,cb){
	var v = a.view;
	jn.ch(function(d,ch){
		v.branch.page.a('moveCategory',{pos:v.pos,part:'colors',move:'down'},ch);
	}).cb(cb);
};

me.a_editCategory = function(a,cb){
	var v = a.view;
	v.$catH2.hide();
	v.$catField.show().focus();
};

me.a_saveCategory = function(a,cb){
	var v = a.view;
	var vals = v.a('vals');
	if (vals.category == v.cat.category){
		v.$catH2.show();
		v.$catField.hide();
		return;
	}

	jn.ch(function(d,ch){
		if (!vals.category) return ch.fail('no category entered');
		v.branch.page.a('saveCategory',{pos:v.pos,category:vals.category},ch);
	}).fail(v.branch.err).cb(cb);
};
return module.exports(j,cb);};require.store["web/views/categories/colors/p_b_colorRow.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.p_b_colorRow = me;
	cb.done();
};

me.a_build = function(a,cb){
	var v = a.view, b = v.a('branch'), $el = v.$el;

	$el.attr({pos:v.pos,path:v._path});
	cb.done();
};

me.a_bind = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;

	var assetChanged = false;
	if (!a.spot || !v.spot || a.spot.id != v.spot.id){ 
		//delete v._gr;
		assetChanged = true;
	}
	v.a('btn');
	v.a('access',{access:b.access});

	var gridChanged = false;
	if (!a.spot || !v._gr || !jn.compare(a.spot._gr,v._gr)){
		gridChanged = true;
	}

	v.spot = a.spot;
	//jn.log('changed:',assetChanged,gridChanged);
	jn.ch(function(d,ch){
		if (!assetChanged) return ch.done();
		v.color = jn.m('assets',{id:v.spot.id});
		a.view.a('model',{model:v.color},ch);
		ch.done();
	}).ch(function(d,ch){
		if (!gridChanged) return ch.done();
		//jn.log('changed _gr:',v._gr,a.spot._gr);
		v._gr = a.spot._gr;
		b.grid.a('add',{add:v,
			update:function(dim){
				var spot = b.page.a('getPos',{pos:v.pos});
				spot._gr = dim;
				//jn.log('update:',dim,spot._gr);
		        return false;
			}
		},ch);
	}).ch(cb.done).fail(function(res){
		jn.log('color row err:',res);
		v.a('hide');
	});
};

me.a_hide = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.grid.a('remove',{remove:v});
	delete v._gr;
	delete v._grUpdate;
	v.a('hide',{root:true},cb);
};

me.a_rec = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	if (!v.color.rec || !v.color.rec.data){ 
		v.a('hide');
		//remove spot from page?
		return cb.fail('no rec or data found');
	}
	var data = jn.morph({t:v.color.rec.data,clone:true});

	if (data.rgb && data.rgb.length){
		var rgb = data.rgb;
		data.r = rgb[0];
		data.g = rgb[1];
		data.b = rgb[2];
	}
	if (data.cmyk && data.cmyk.length){
		var cmyk = data.cmyk;
		data.c = cmyk[0];
		data.m = cmyk[1];
		data.y = cmyk[2];
		data.k = cmyk[3];
	}

	var colorHex = data.hex;
	if (colorHex.substring(0, 1) == '#') { 
		colorHex = colorHex.substring(1);
	}

	$el.find('[prop="bgFill"]').css({'background-color':data.hex});
	$el.removeClass('white black').addClass(getContrastYIQ(colorHex));
	v.a('set',data);
};

me.a_colorOverlay = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_colorOverlay').a('show',{pos:v.pos,spot:v.spot});
};

me.a_colorEdit = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	//jn.log('color edit:',a.view.pos,b.spot);
	b.overlay.child('o_colorEdit').a('show',{pos:v.pos,spot:v.spot});
};
return module.exports(j,cb);};require.store["web/views/categories/fonts/overlays/o_fontOverlay.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_fontOverlay = me;
	cb.done();
};

me.defaultCats = [
	{category:'Header',glyph:'\'',descrip:''},
	{category:'Paragraph',glyph:'%',descrip:''},
	{category:'Alternate',glyph:'(',descrip:''}
];

me.a_build = function(a,cb){
	var v = a.view;
	v.$sidebar = v.$el.find('[area="sidebar"]');
	v.$main = v.$el.find('[area="main"]');
	v.$bgColor = v.$el.find('[area="bgColor"]');
	v.enableKeys = true;

	v.branch.win.a('bind',{
		resize:function(){
			var dim = v.branch.win.a('dim');
			v.$el.find('.item-hldr').height(dim.h);
		}
	});

	cb.done();
};

me.a_bind = function(a,cb){ //bind user events here
	var v = a.view;

	if (a.uploaded){
		var asset = jn.m('assets',{id:a.uploaded});
		var pos = v.branch.page.a('search',{asset:asset});
		jn.log('uploaded pos:',pos);
		if (!pos){
			v.branch.overlay.a('hide');
			return cb.done();
		}
		var lDot = pos.lastIndexOf('.');
		v.pos = pos.substr(0,lDot);
		v.spot = v.branch.page.a('getPos',{pos:v.pos});
		v.a('resize');
	}
	//else changeView('back');
	
	if (!a.spot && !v.spot) return cb.fail('no spot defined');
	v.spot = a.spot || v.spot;
	v.pos = a.pos || v.pos;
	v.id = v.spot.id;
	if (!v.id) return cb.fail('no id defined');

	v.a('btn');
	v.a('access',{access:v.branch.access});

	//to enable and disable left and right key navigation
	v.$el.on('focus','input',function(){
		v.enableKeys = false;
	});
	v.$el.on('blur','input',function(){
		v.enableKeys = true;
	});

	//jn.log('color id:',v.spot);

	jn.ch(function(d,ch){
		v.assets = {};
		if (v.spot.id){ //get cmyk asset rec
			v.assets.font = jn.m('assets',{id:v.spot.id});
			v.a('model',{model:v.assets.font,
				rec:function(){
					v.a('font',ch);
				}
			});
		}
		ch.done();
	}).ch(function(d,ch){ //bind to page
		a.view.a('model',{model:v.branch.page,rec:function(){
			a.view.a('page');
		}},ch);
	}).ch(function(d,ch){ //get position of this logo in brand (if exists)
		v.a('initControls');
		v.a('buildCats',a,ch);
	}).ch(cb.done).fail(v.branch.err);
};

me.a_font = function(a,cb){
	var v = a.view;
	var font = v.assets.font;
	v.$el.find('[prop="fontImg"]').attr({src:'img?id='+font.id+'&img=char'});
	v.$el.find('[prop="fontChar"]').attr({src:'img?id='+font.id});
	v.a('set',v.assets.font.rec.data);
	cb.done();
};

me.a_resize = function(a,cb){
	var v = a.view;
	if (v.$sidebar.hasClass('closed')){
		v.$sidebar.removeClass('closed');
		v.$main.removeClass('fullscreen');
	}
	else {
		v.$sidebar.addClass('closed');
		v.$main.addClass('fullscreen');
	}
};

me.a_settings = function(a,cb){
	var v = a.view;
	changeView('settings');
};

me.a_back = function(a,cb){
	var v = a.view;
	changeView('back');
};

me.a_save = function(a,cb){
	var v = a.view;

	var vals = v.a('vals');
	jn.ch(function(d,ch){
		//move cat, if cat changed
		var cat = v.$el.find('[tpl="cat"].active').data('cat');
		if (v.activeCat) var active = v.branch.page.rec.parts.fonts[v.activeCat].category;
		//jn.log('cat:',cat.category,active);
		if (active && cat.category == active) return ch.done();
		jn.log('cat:',cat);
		v.branch.page.a('moveIntoCat',{part:'fonts',cat:cat,spot:v.spot},ch);
	}).ch(function(d,ch){
		//v.branch.overlay.a('hide');
		v.a('resize');
		ch.done();
	}).ch(cb.done).fail(v.branch.err);
};

me.a_display = function(a, cb){
	var v = a.view;

	var wh = $(window).height(),
		//childHeight = a.$child.height(),
		$scrollDiv = v.$el.find('.scroll-hldr'),
		mh = v.$el.height();
		console.log('Mh, ', mh);
		console.log('Wh, ', wh);

   	if ( mh >= wh ) {
   		$scrollDiv.height(wh - 0);
    }
	
	$scrollDiv.mCustomScrollbar({
		theme: 'dark',
		autoHideScrollbar: false,
		//mouseWheel:false,
		contentTouchScroll:false,
		scrollInertia: 20,
		advanced:{
			updateOnContentResize: true,
			autoScrollOnFocus:false
		}
	});

	v.$main.find('.item-hldr').css('max-height', ( ( parseInt( v.$main.height() ) - 200 ) + 'px' ));

	v.branch.win.a('touch');

	v.$el.show();
	cb.done();
};

var changeView = function( typeOfShift ){
	var shiftPanes = $('[data-pane="shift"]');
	var fadePanes = $('[data-pane="fade"]');

	if ( typeOfShift === 'settings' ){
		shiftPanes.addClass('shift-left');
		fadePanes.addClass('fade-on');
	}
	else if ( typeOfShift === 'back' || typeOfShift === 'reset' ){
		shiftPanes.removeClass('shift-left');
		fadePanes.removeClass('fade-on');
	}
};

var setBackgroundColor = function( colorVal, elementToChange ){
	var colorVal = colorVal.replace(/#/g, '');

	if ( colorVal.indexOf('rgb') != -1 ){
		elementToChange.css('background', colorVal);
	} 
	else {
		elementToChange.css('background', '#' + colorVal);
	}
};

me.a_buildCats = function(a,cb){
	var v = a.view;
	v.activeCat = v.pos.split('.')[1]; //get active category from pos
	jn.log('active cat:',v.activeCat);
	//loop through logo categories
	var parts = v.branch.page.rec.parts;
	if (!me.$tpl) me.$tpl = v.$el.find('[tpl="cat"]').detach();
	v.$el.find('[tpl="cat"]').remove();
	var $container = v.$el.find('[container="cat"]');
	var $addCat = v.$el.find('[btn="addCat"]');
	var cats = [];
	if (a.custom){ //custom category defined
		var $cat = me.$tpl.clone();
		$cat.addClass('active');
		$cat.find('[prop="category"]').html(a.custom);
		$cat.data('cat',{category:a.custom,descip:''});
		$addCat.before($cat);
	}
	var fonts = parts.fonts;
	for (var i=0,len=fonts.length;i<len;i++){
		var cat = fonts[i];
		if (cat){
			var $cat = me.$tpl.clone();
			if (v.activeCat == i && !a.custom){
				v.curCat = cat.category;
				$cat.addClass('active');
			}
			$cat.find('[prop="category"]').html(cat.category);
			if (cat.assets.length > 0){
				$cat.find('[prop="glyph"]').hide();
				var imgId = cat.assets[0].id;
				var src = 'img?id='+imgId;
				$cat.find('[prop="img"]').show().attr('src',src);
			}
			$cat.data('cat',cat);
			$addCat.before($cat);
			cats.push(cat.category.toLowerCase());
		}
	}
	//if (v.assets.color) return cb.done();
	for (var i=0,len=me.defaultCats.length;i<len;i++){
		var cat = me.defaultCats[i];
		if (cats.indexOf(cat.category.toLowerCase()) === -1){ //default cat not populated
			var $cat = me.$tpl.clone();
			$cat.data('cat',cat);
			$cat.find('[prop="category"]').html(cat.category);
			$cat.find('[prop="glyph"]').html(cat.glyph);
			$addCat.before($cat);
		}
	}
	cb.done();
};

me.a_catSelect = function(a,cb){
	var v = a.view;
	a.$btn.siblings('.active').removeClass('active');
	a.$btn.addClass('active');
};

me.a_addCat = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('hide');
	b.overlay.child('o_catAdd').a('show',{prev:a.view});
};

me.a_prev = function(a,cb){
	var v = a.view;
	var pos = v.branch.page.a('search',{spot:v.spot});
	if (!pos) return cb.fail('no pos found');

	var posAry = pos.split('.');
	if (posAry.length < 3) return cb.fail('pos not complete');
	var part = posAry[0];
	var catInd = posAry[1];
	var assetInd = posAry[3];
	var catI = catInd;
	
	var spot;
	if (v.spot._gr){
		while (catI >= 0 && !spot){
			var cat = v.branch.page.rec.parts[part][catI];
			for (var i=0,len=cat.assets.length;i<len;i++){ //look in same cat
				var sp = cat.assets[i];
				if (((sp._gr.x < v.spot._gr.x && sp._gr.y == v.spot._gr.y) || (sp._gr.y < v.spot._gr.y) || (catI < catInd)) && 
					(!spot || ((sp._gr.x > spot._gr.x && sp._gr.y == spot._gr.y) || (sp._gr.y > spot._gr.y)))
					){
					spot = sp;
				}
			}
			catI--;
		}
		if (spot){
			var newPos = v.branch.page.a('search',{spot:v.spot});
			jn.ch(function(d,ch){
				v.a('hide',ch);
			}).ch(function(d,ch){
				v.branch.overlay.child('o_fontOverlay').a('show',{spot:spot,pos:newPos},ch);
			}).cb(cb);
		}
	}

};

me.a_next = function(a,cb){
	var v = a.view;
	var pos = v.branch.page.a('search',{spot:v.spot});
	if (!pos) return cb.fail('no pos found');

	var posAry = pos.split('.');
	if (posAry.length < 3) return cb.fail('pos not complete');
	var part = posAry[0];
	var catInd = posAry[1];
	var assetInd = posAry[3];
	var catI = catInd;

	var spot;
	if (v.spot._gr){
		while (catI < v.branch.page.rec.parts[part].length && !spot){
			var cat = v.branch.page.rec.parts[part][catI];
			jn.log('cat:',cat);
			for (var i=0,len=cat.assets.length;i<len;i++){
				var sp = cat.assets[i];
				if (((sp._gr.x > v.spot._gr.x && sp._gr.y == v.spot._gr.y) || (sp._gr.y > v.spot._gr.y) || (catI > catInd)) && 
					(!spot || ((sp._gr.x < spot._gr.x && sp._gr.y == spot._gr.y) || (sp._gr.y < spot._gr.y)))
					){
					spot = sp;
				}
			}
			catI++;
		}
		if (spot){
			var newPos = v.branch.page.a('search',{spot:v.spot});
			jn.ch(function(d,ch){
				v.a('hide',ch);
			}).ch(function(d,ch){
				v.branch.overlay.child('o_fontOverlay').a('show',{spot:spot,pos:newPos},ch);
			}).cb(cb);
		}
	}
};

me.a_initControls = function(a,cb){
	var v = a.view;
	var v = a.view;
	var pos = v.branch.page.a('search',{spot:v.spot});
	if (!pos) return cb.fail('no pos found');

	var posAry = pos.split('.');
	if (posAry.length < 3) return cb.fail('pos not complete');
	var part = posAry[0];
	var catInd = posAry[1];
	var assetInd = posAry[3];
	var catI = catInd;
	var $next = v.$el.find('[btn="next"]');
	var $prev = v.$el.find('[btn="prev"]');

	$('body').on('keyup',function(e){
		if (!v.enableKeys) return;
		
		jn.log('keyup:',e.keyCode);
		if (e.keyCode == 39){
			v.a('next');
		}
		else if (e.keyCode == 37){
			v.a('prev');
		}
		else if (e.keyCode == 27){
			v.branch.overlay.a('hide');
		}
	});

	if (!v.spot._gr){
		//hide next and prev
		$next.css({visibility:'hidden'});
		$prev.css({visibility:'hidden'});
		return;
	}

	var spot;
	while (catI < v.branch.page.rec.parts[part].length && !spot){
		var cat = v.branch.page.rec.parts[part][catI];
		for (var i=0,len=cat.assets.length;i<len;i++){
			var sp = cat.assets[i];
			if (((sp._gr.x > v.spot._gr.x && sp._gr.y == v.spot._gr.y) || (sp._gr.y > v.spot._gr.y) || (catI > catInd)) && 
				(!spot || ((sp._gr.x < spot._gr.x && sp._gr.y == spot._gr.y) || (sp._gr.y < spot._gr.y)))
				){
				spot = sp;
			}
		}
		catI++;
	}
	if (spot) $next.css({visibility:'visible'});
	else $next.css({visibility:'hidden'});

	catI = catInd;
	spot = undefined;
	while (catI >= 0 && !spot){
		var cat = v.branch.page.rec.parts[part][catI];
		for (var i=0,len=cat.assets.length;i<len;i++){ //look in same cat
			var sp = cat.assets[i];
			if (((sp._gr.x < v.spot._gr.x && sp._gr.y == v.spot._gr.y) || (sp._gr.y < v.spot._gr.y) || (catI < catInd)) && 
				(!spot || ((sp._gr.x > spot._gr.x && sp._gr.y == spot._gr.y) || (sp._gr.y > spot._gr.y)))
				){
				spot = sp;
			}
		}
		catI--;
	}
	if (spot) $prev.css({visibility:'visible'});
	else $prev.css({visibility:'hidden'});
};

me.a_removeFont = function(a,cb){
	var v = a.view;
	v.a('hide');
	v.branch.overlay.child('o_fontRemove').a('show',{prev:v,pos:v.pos});
};

me.a_hide = function(a,cb){
	var v = a.view;
	v.branch.alert.a('hide');
	$('body').removeClass('dropDisabled');
	$('body').off('keyup');

	v.$el.find('.scroll-hldr').mCustomScrollbar('destroy');
	v.a('hide',{root:true},cb);
};

return module.exports(j,cb);};require.store["web/views/categories/fonts/overlays/o_fontRemove.js"]=function(j,cb){var module = {};var vp = 'o_fontRemove', jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v[vp] = me;
	cb.done();
};

/*
a_bind (fun):
	---a---
	prevView
*/
me.a_bind = function(a,cb){
	var v = a.view;
	v.a('btn');
	v.pos = a.pos;
	v.prev = a.prev;
	cb.done();
};

me.a_display = function(a,cb) {
	var v = a.view;
	v.$el.show();
	var h = v.$el.outerHeight();
	v.$el.css('margin-top', -(h/2));
	cb.done();
};

me.a_cancel = function(a,cb){
	var v = a.view;
	//close this overlay and show prev
	v.a('hide');
	v.prev.a('show');
};

me.a_remove = function(a,cb){
	var v = a.view;

	jn.ch(function(d,ch){
		//remove spot from page
		v.branch.page.a('removeSpot',{pos:v.pos},ch);
	}).ch(function(d,ch){
		v.branch.overlay.a('hide');
		cb.done();
	}).fail(v.branch.err);
};
return module.exports(j,cb);};require.store["web/views/categories/fonts/p_b_fontCat.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.p_b_fontCat = me;
	cb.done();
};

/*
a_build (fun):
	---a---
	pos (str): the position of the category
	cat (obj): the category object
*/
me.a_build = function(a,cb){
	var v = a.view, b = v.a('branch'), $el = v.$el;
	var part = 'fonts';
	$el.attr('pos',v.pos);
	v.a('set',a.cat);
	v.cat = a.cat;
	v.a('access',{access:b.access});

	v.$catH2 = v.$el.find('h2[prop="category"]');
	v.$catH2.show();
	v.$catField = v.$el.find('input[prop="category"]');
	v.$catField.hide();

	v.$moveUp = v.$el.find('[btn="moveUp"]');
	v.$moveDown = v.$el.find('[btn="moveDown"]');
	if (a.ind !== undefined && a.len !== undefined){
		if (a.ind == 0) v.$moveUp.hide();
		else v.$moveUp.show();
		if (a.ind >= a.len - 1) v.$moveDown.hide();
		else v.$moveDown.show();
	}
	
	if (!a.cat.assets) return cb.done();
	if (!v.shown) v.shown = [];
	jn.ch(function(d,ch){ //init grid
		if (b.grid) return ch.done();
		var $container = $el.find('ul');
		b.grid = v.child('grid');
		var noResize = (!b.isAccess('team'))? true: false;
		b.grid.a('init',{$container:$container,group:part,noResize:noResize,
			update:function(childs){
				b.page.a('update',{parts:b.page.rec.parts});
			},
			jump:function(jump){
				jn.log('jump:',jump);
				if (!jump.group) return;
				var groupPos = jump.group.parent.pos;
				var gCat = b.page.a('getPos',{pos:groupPos});;
				var elemPos = jump.elem.pos;
				var spot = b.page.a('getPos',{pos:elemPos});
				b.page.a('moveIntoCat',{part:part,spot:spot,cat:gCat});
			}
		},ch);
	}).ch(function(d,ch){ //check for views to hide
		if (v.shown.length < 1 || v.shown.length <= a.cat.assets.length) return ch.done();
		var hideI = a.cat.assets.length - 1;
		//jn.log('hide:',v.shown.length,a.cat.assets.length);
		jn.loop({ary:v.shown,i:hideI},{
			loop:function(loop){
				//jn.log('hide:',hideI);
				if (v.shown[loop.i]) v.shown[loop.i].a('hide',{
					fail:ch.fail,
					done:loop.next
				});
				else loop.next();
			},
			done:ch.done
		});
	}).ch(function(d,ch){ //show views
		v.shown = [];
		jn.loop({ary:a.cat.assets},{
			loop:function(loop){
				var spot = a.cat.assets[loop.i];
				var pos = v.pos+'.assets.'+loop.i;
				var row = v.child('p_b_fontRow',{pos:pos});
				v.shown.push(row);
				row.a('show',{spot:spot,rebind:true},{
					fail:ch.fail,
					done:loop.next
				});
			},
			done:ch.done
		});
	}).ch(function(d,ch){
		var $descrip = $el.find('textarea[prop="descrip"]');
		$descrip.autosize();
		$el.on('blur','textarea[prop="descrip"]',function(e){
			//console.log('blur');
			var descrip = $descrip.val();
			b.page.a('catDescrip',{descrip:descrip,pos:v.pos});
		});
		$el.on('keyup','textarea[prop="descrip"]',function(e){
			if(e.keyCode == 9){ //tab
				$(this).blur();
				return false;	
			}
		});

		$el.on('blur','input[prop="category"]',function(e){
			//console.log('blur');
			v.a('saveCategory');
		});
		$el.on('keyup','input[prop="category"]',function(e){
			if(e.keyCode == 9 || e.keyCode == 13){ //tab
				$(this).blur();
				return false;	
			}
		});
		ch.done();
	}).ch(cb.done).fail(b.err);
};

me.a_hide = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	var $descrip = $el.find('textarea[prop="descrip"]');
	$descrip.trigger('autosize.destroy');

	if (b.grid){
		b.grid.a('destroy');
		delete b.grid;
	}

	a.view.a('hide',{root:true},cb);
};

me.a_bind = function(a,cb){
	var v = a.view;
	v.a('btn');
	cb.done();
};

me.a_moveUp = function(a,cb){
	var v = a.view;
	jn.ch(function(d,ch){
		v.branch.page.a('moveCategory',{pos:v.pos,part:'fonts',move:'up'},ch);
	}).cb(cb);
};

me.a_moveDown = function(a,cb){
	var v = a.view;
	jn.ch(function(d,ch){
		v.branch.page.a('moveCategory',{pos:v.pos,part:'fonts',move:'down'},ch);
	}).cb(cb);
};

me.a_editCategory = function(a,cb){
	var v = a.view;
	v.$catH2.hide();
	v.$catField.show().focus();
};

me.a_saveCategory = function(a,cb){
	var v = a.view;
	var vals = v.a('vals');
	if (vals.category == v.cat.category){
		v.$catH2.show();
		v.$catField.hide();
		return;
	}

	jn.ch(function(d,ch){
		if (!vals.category) return ch.fail('no category entered');
		v.branch.page.a('saveCategory',{pos:v.pos,category:vals.category},ch);
	}).fail(v.branch.err).cb(cb);
};


return module.exports(j,cb);};require.store["web/views/categories/fonts/p_b_fontRow.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.p_b_fontRow = me;
	cb.done();
};

me.a_build = function(a,cb){
	var v = a.view, b = v.a('branch'), $el = v.$el;

	$el.attr({pos:v.pos,path:v._path});
	cb.done();
};

me.a_bind = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;

	var assetChanged = false;
	if (!a.spot || !v.spot || a.spot.id != v.spot.id){ 
		//delete v._gr;
		assetChanged = true;
	}
	v.a('btn');
	v.a('access',{access:b.access});

	var gridChanged = false;
	if (!a.spot || !v._gr || !jn.compare(a.spot._gr,v._gr)){
		gridChanged = true;
	}

	v.spot = a.spot;
	//jn.log('changed:',assetChanged,gridChanged);
	jn.ch(function(d,ch){
		if (!assetChanged) return ch.done();
		v.font = jn.m('assets',{id:v.spot.id});
		a.view.a('model',{model:v.font},ch);
		ch.done();
	}).ch(function(d,ch){
		if (!gridChanged) return ch.done();
		//jn.log('changed _gr:',v._gr,a.spot._gr);
		v._gr = a.spot._gr;
		b.grid.a('add',{add:v,
			update:function(dim){
				var spot = b.page.a('getPos',{pos:v.pos});
				spot._gr = dim;
				//jn.log('update:',dim,spot._gr);
		        return false;
			}
		},ch);
	}).ch(cb.done).fail(function(res){
		jn.log('font row err:',res);
		v.a('hide');
	});
};

me.a_hide = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.grid.a('remove',{remove:v});
	delete v._gr;
	delete v._grUpdate;
	v.a('hide',{root:true},cb);
};

me.a_rec = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	if (!v.font.rec || !v.font.rec.data){
		v.a('hide');
		return cb.fail('no rec or data found');
	}
	var data = jn.morph({t:v.font.rec.data,clone:true});

	$el.find('[prop="fontImg"]').attr({src:jn.config.cdn+'img?id='+v.font.id});
	$el.find('[prop="fontImgChar"]').attr({src:jn.config.cdn+'img?id='+v.font.id+'&img=char'});

	if (data.foundry.toLowerCase() == 'unknown'){
		data.foundry = '';
	}

	a.view.a('set',data);
};

me.a_fontOverlay = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_fontOverlay').a('show',{pos:v.pos,spot:v.spot});
};

me.a_editFont = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_fontEdit').a('show',{pos:v.pos,spot:v.spot});
};
return module.exports(j,cb);};require.store["web/views/categories/guide/overlays/o_guideOverlay.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_guideOverlay = me;
	cb.done();
};
me.a_bind = function(a,cb){
	var v = a.view;
	jn.log('v.id',v.id);
	v.model = jn.m('assets',{id:v.id});
	v.page = v.page || 1;
	v.a('set',{img:jn.config.cdn + 'img?id='+v.id+'&num='+v.page});
	v.a('btn');

	v.$main = v.$el.find('[area="main"]');
	v.branch.win.a('bind',{
		resize:function(){
			var dim = v.branch.win.a('dim');
			v.$el.find('.item-hldr').height(dim.h);
		}
	});

	$('body').on('keyup',function(e){
		jn.log('keyup:',e.keyCode);
		if (e.keyCode == 39){
			v.a('next');
		}
		else if (e.keyCode == 37){
			v.a('prev');
		}
		else if (e.keyCode == 27){
			v.branch.overlay.a('hide');
		}
	});

	jn.ch(function(d,ch){
		v.a('model',{model:v.model},ch);
	}).ch(cb.done).fail(v.branch.err);
};
me.a_display = function(a, cb){
	var v = a.view;

	var wh = $(window).height(),
		//childHeight = a.$child.height(),
		$scrollDiv = v.$el.find('.scroll-hldr'),
		mh = v.$el.height();
		console.log('Mh, ', mh);
		console.log('Wh, ', wh);

   	if ( mh >= wh ) {
   		$scrollDiv.height(wh - 0);
    }
	
	$scrollDiv.mCustomScrollbar({
		theme: 'dark',
		autoHideScrollbar: false,
		//mouseWheel:false,
		contentTouchScroll:false,
		scrollInertia: 20,
		advanced:{
			updateOnContentResize: true,
			autoScrollOnFocus:false
		}
	});

	v.$main.find('.item-hldr').css('max-height', ( ( parseInt( v.$main.height() ) - 200 ) + 'px' ));

	v.branch.win.a('touch');

	v.$el.show();
	cb.done();
};
me.a_rec = function(a,cb){
	var v = a.view;
	var rec = v.model.rec;
	jn.log('guide:',rec);
	if (rec.data && rec.data.numPages){ //pages
		v.numPages = rec.data.numPages;
	}
	v.a('controls');
};
me.a_next = function(a,cb){
	var v = a.view;
	if (v.page < v.numPages){
		v.page++;
		v.a('set',{img:jn.config.cdn +'img?id='+v.id+'&num='+v.page});
	}
	v.a('controls');
};
me.a_prev = function(a,cb){
	var v = a.view;
	if (v.page > 1){
		v.page--;
		v.a('set',{img:jn.config.cdn +'img?id='+v.id+'&num='+v.page});
	}
	v.a('controls');
};
me.a_controls = function(a,cb){
	var v = a.view;
	v.a('set',{pages:v.page+'/'+v.numPages});
	if (v.page == v.numPages) v.$el.find('[btn="next"]').css({visibility:'hidden'});
	else v.$el.find('[btn="next"]').css({visibility:'visible'});
	if (v.page > 1) v.$el.find('[btn="prev"]').css({visibility:'visible'});
	else v.$el.find('[btn="prev"]').css({visibility:'hidden'});
};
me.a_close = function(a,cb){
	var v = a.view;
	v.branch.overlay.a('hide',cb);
};
me.a_hide = function(a,cb){
	var v = a.view;
	v.branch.alert.a('hide');
	$('body').removeClass('dropDisabled');
	$('body').off('keyup');

	v.$el.find('.scroll-hldr').mCustomScrollbar('destroy');
	v.a('hide',{root:true},cb);
};return module.exports(j,cb);};require.store["web/views/categories/guide/overlays/o_guideRemove.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_guideRemove = me;
	cb.done();
};

/*
a_bind (fun):
	---a---
	prevView
*/
me.a_bind = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('btn');
	cb.done();
};

me.a_display = function(a, cb) {
	var $el = a.view.a('$el'), b = a.view.branch;
	$el.show();
	var h = $el.outerHeight();
	$el.css('margin-top', -(h/2));
	cb.done();
};

me.a_remove = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	jn.ch(function(d,ch){
		//remove spot from page
		b.page.a('removeGuide',ch);
	}).ch(function(d,ch){
		b.overlay.a('hide');
		cb.done();
	}).fail(b.err);
};
return module.exports(j,cb);};require.store["web/views/categories/guide/p_b_guide.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.p_b_guide = me;
	cb.done();
};

me.a_bind = function(a,cb){
	var v = a.view, $el = a.view.a('$el'), b = a.view.branch;

	v.a('btn');
	v.a('access',{access:b.access});
	//jn.log('guide');
	v.a('str',{cat:'p_brand'});

	b.guide = jn.m('assets',{id:a.guideId});
	jn.ch(function(d,ch){
		v.a('model',{model:b.guide},ch);
	}).ch(cb.done).fail(function(res){
		jn.log('guide row err:',res);
		v.a('hide');
	});
};

me.a_rec = function(a,cb){
	var v = a.view, $el = a.view.a('$el'), b = a.view.branch;

	if (!b.guide.rec){
		v.a('hide');
		return cb.fail('no guide found');
	}

	var guidePath = 'img?id='+b.guide.id+'&num=1';
	jn.log('guide path:',guidePath);
	$el.find('[prop="cover"]').css({'background-image':'url('+guidePath+')'});
};

me.a_downloadGuide = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	var path = 'downloadAsset?obj='+jn.web.packObj({
		id:b.page.id,
		assetId:b.guide.id
	});
	//jn.log('asset path:',path);
	window.location = path;
};

me.a_guideOverlay = function(a,cb){
	var v = a.view;
	v.branch.overlay.child('o_guideOverlay',{id:v.branch.guide.id}).a('show');
};return module.exports(j,cb);};require.store["web/views/categories/host/p_h_assetCat.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.p_h_assetCat = me;
	cb.done();
};

/*
a_build (fun):
	---a---
	pos (str): the position of the category
	cat (obj): the category object
*/
me.a_build = function(a,cb){
	var v = a.view, b = v.a('branch'), $el = v.$el;
	var part = 'assets';
	$el.attr('pos',v.pos);
	v.a('set',a.cat);
	v.a('access',{access:b.access});
	if (!a.cat.assets) return cb.done();
	if (!v.shown) v.shown = [];
	jn.ch(function(d,ch){ //init grid
		if (b.grid) return ch.done();
		var $container = $el.find('ul');
		b.grid = v.child('grid');
		var noResize = (!b.isAccess('team'))? true: false;
		b.grid.a('init',{$container:$container,group:part,noResize:noResize,gridW:6,size:160,
			update:function(childs){
				b.page.a('update',{parts:b.page.rec.parts});
			},
			jump:function(jump){
				jn.log('jump:',jump);
				if (!jump.group) return;
				var groupPos = jump.group.parent.pos;
				var gCat = b.page.a('getPos',{pos:groupPos});;
				var elemPos = jump.elem.pos;
				var spot = b.page.a('getPos',{pos:elemPos});
				b.page.a('moveIntoCat',{part:part,spot:spot,cat:gCat});
			}
		},ch);
	}).ch(function(d,ch){ //check for views to hide
		if (v.shown.length < 1 || v.shown.length <= a.cat.assets.length) return ch.done();
		var hideI = a.cat.assets.length - 1;
		//jn.log('hide:',v.shown.length,a.cat.assets.length);
		jn.loop({ary:v.shown,i:hideI},{
			loop:function(loop){
				//jn.log('hide:',hideI);
				if (v.shown[loop.i]) v.shown[loop.i].a('hide',{
					fail:ch.fail,
					done:loop.next
				});
				else loop.next();
			},
			done:ch.done
		});
	}).ch(function(d,ch){ //show views
		v.shown = [];
		jn.loop({ary:a.cat.assets},{
			loop:function(loop){
				var spot = a.cat.assets[loop.i];
				var pos = v.pos+'.assets.'+loop.i;
				var row = v.child('p_h_assetRow',{pos:pos});
				v.shown.push(row);
				row.a('show',{spot:spot,rebind:true},{
					fail:ch.fail,
					done:loop.next
				});
			},
			done:ch.done
		});
	}).ch(function(d,ch){
		var $descrip = $el.find('textarea[prop="descrip"]');
		$descrip.autosize();
		$el.on('blur','textarea[prop="descrip"]',function(e){
			//console.log('blur');
			var descrip = $descrip.val();
			b.page.a('catDescrip',{descrip:descrip,pos:v.pos});
		});
		$el.on('keyup','textarea[prop="descrip"]',function(e){
			if(e.keyCode == 9){ //tab
				$(this).blur();
				return false;	
			}
		});
		ch.done();
	}).ch(cb.done).fail(b.err);
};return module.exports(j,cb);};require.store["web/views/categories/host/p_h_assetRow.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.p_h_assetRow = me;
	cb.done();
};

me.a_build = function(a,cb){
	var v = a.view, b = v.a('branch'), $el = v.$el;

	$el.attr({pos:v.pos,path:v._path});
	cb.done();
};

me.a_bind = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;

	var assetChanged = false;
	if (!a.spot || !v.spot || a.spot.id != v.spot.id){ 
		//delete v._gr;
		assetChanged = true;
	}
	v.a('btn');
	v.a('access',{access:b.access});

	var gridChanged = false;
	if (!a.spot || !v._gr || !jn.compare(a.spot._gr,v._gr)){
		gridChanged = true;
	}

	v.spot = a.spot;
	//jn.log('changed:',assetChanged,gridChanged);
	jn.ch(function(d,ch){
		if (!assetChanged) return ch.done();
		v.asset = jn.m('assets',{id:v.spot.id});
		a.view.a('model',{model:v.asset},ch);
		ch.done();
	}).ch(function(d,ch){
		if (!gridChanged) return ch.done();
		//jn.log('changed _gr:',v._gr,a.spot._gr);
		v._gr = a.spot._gr;
		b.grid.a('add',{add:v,
			update:function(dim){
				var spot = b.page.a('getPos',{pos:v.pos});
				spot._gr = dim;
				//jn.log('update:',dim,spot._gr);
				return false;
			}
		},ch);
	}).ch(cb.done).fail(b.err);
};

me.a_hide = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.grid.a('remove',{remove:v});
	delete v._gr;
	delete v._grUpdate;
	v.a('hide',{root:true},cb);
};

me.a_rec = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	if (!v.asset.rec) return cb.fail('no rec or data found');

	var rec = v.asset.rec;

	var color = (rec.data && rec.data.bgColor)? rec.data.bgColor: '#f8f8f8';

	jn.log('color:',color);

	var colorHex = color;
	if (colorHex.substring(0, 1) == '#') { 
	  colorHex = colorHex.substring(1);
	}
	$el.find('[prop="bgFill"]').css({'background-color':color});
	$el.removeClass('white black').addClass(getContrastYIQ(colorHex));

	var url = jn.config.cdn+'img?id='+v.asset.id+'&w=236&h=236';
	$el.find('[prop="img"]').css({'background-image':'url("'+url+'")'})
	.getImgSize(function(dim){
		var h = $el.height();
		var w = $el.width();
		var bh = dim.height;
		var bw = dim.width;

		if(h > bh && w > bw) {
			$el.find('[prop="bgFill"]').addClass('auto');
		}
	});
};

me.a_edit = function(a,cb){
	jn.log('image edit click');
	var $el = a.view.a('$el'), b = a.view.branch;
	b.overlay.child('o_logoEdit').a('show',{pos:a.view.pos,spot:b.spot});
};

me.a_logoOverlay = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_logoOverlay').a('show',{pos:v.pos,spot:v.spot});
};

me.a_downloadQuick = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	var assetId = v.spot.rgb || v.spot.cmyk || v.spot.id;
	if (!assetId) return ch.fail('no asset defined');
	var files = [{
		w:a.$btn.attr('w'),
		h:a.$btn.attr('h'),
		format:a.$btn.attr('ext')
	}];
	var path = 'downloadAsset?obj='+jn.web.packObj({
		id:b.page.id,
		assetId:assetId,
		files:files
	});
	//jn.log('asset path:',path);
	window.location = path;
};

me.a_downloadCustom = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_logoDownload').a('show',{pos:v.pos,spot:v.spot});
};
return module.exports(j,cb);};require.store["web/views/categories/images/overlays/o_imageOverlay.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_imageOverlay = me;
	cb.done();
};

me.defaultCats = [
	{category:'Brand',glyph:'\'',descrip:''}
];
me.downloadSizes = {
	small:300,
	medium:600,
	large:1200
};
me.defaultSize = 'medium';

me.a_build = function(a,cb){
	var v = a.view;
	v.$sidebar = v.$el.find('[area="sidebar"]');
	v.$main = v.$el.find('[area="main"]');
	v.$imgShow = v.$el.find('[img="show"]');
	v.$imgHide = v.$el.find('[img="hide"]');
	v.$bgColor = v.$el.find('[area="bgColor"]');
	v.$img = v.$el.find('[prop="img"]');
	v.$size = v.$el.find('[area="size"]');
	v.$w = v.$el.find('[prop="w"]');
	v.$h = v.$el.find('[prop="h"]');
	v.enableKeys = true;

	v.branch.win.a('bind',{
		resize:function(){
			var dim = v.branch.win.a('dim');
			v.$el.find('.item-hldr').height(dim.h);
		}
	});

	cb.done();
};

me.a_bind = function(a,cb){ //bind user events here
	var v = a.view;

	if (a.uploaded){
		var asset = jn.m('assets',{id:a.uploaded});
		var pos = v.branch.page.a('search',{asset:asset});
		jn.log('uploaded pos:',pos);
		if (!pos){
			v.branch.overlay.a('hide');
			return cb.done();
		}
		var lDot = pos.lastIndexOf('.');
		v.pos = pos.substr(0,lDot);
		v.spot = v.branch.page.a('getPos',{pos:v.pos});
		changeView('settings');
	}
	else if (a.custom){
		changeView('settings');
	} 
	else changeView('back');
	
	if (!a.spot && !v.spot) return cb.fail('no spot defined');
	v.spot = a.spot || v.spot;
	v.pos = a.pos || v.pos;
	v.id = v.spot.rgb || v.spot.cmyk || v.spot.id;
	if (!v.id) return cb.fail('no id defined');

	v.$img.attr({src:''});

	v.$el.find('[area="bgColor"]').css({'background-color':'#f9f9f9'});

	v.a('btn');
	v.a('access',{access:v.branch.access});

	v.$el.on('blur','[prop="bgColor"]',function(){
		v.a('saveColor');
	});

	v.$el.on('blur','[prop="customFilename"]',function(){
		var val = $(this).val();
		v.a('saveFilename');
		//var color = v.a('checkColor',{color:val});
		//v.$el.find('[area="bgColor"]').css({'background-color':color});
	});

	
	//
	//
	//
	//v.$el.on('blur','[prop="customLabel"]',function(){
	//	var val = $(this).val();
	//	v.a('saveLabel');
	//	//var color = v.a('checkColor',{color:val});
	//	//v.$el.find('[area="bgColor"]').css({'background-color':color});
	//});
	//
	//
	//


	//to enable and disable left and right key navigation
	v.$el.on('focus','input',function(){
		v.enableKeys = false;
	});
	v.$el.on('blur','input',function(){
		v.enableKeys = true;
	});

	//size blur
	var prev = {};
	v.$el.on('blur','[prop="w"]',function(){
		var val = $(this).val();
		val = val.replace(/[^0-9]/g,'');
		if(!val.length || val < 1 || val > 10000){
			v.branch.err('dimensions must be between 0-10000');
			v.$w.val(prev.w);
			return;
		}
		if (prev.w == val) return;
		var h = Math.round(val/v.propWH);
		prev = {w:val,h:h};
		$(this).val(val);
		v.$h.val(h);
		v.a('embed');
	});

	v.$el.on('blur','[prop="h"]',function(){
		var val = $(this).val();
		val = val.replace(/[^0-9]/g,'');
		if(!val.length || val < 1 || val > 10000){
			v.branch.err('dimensions must be between 0-10000');
			v.$h.val(prev.h);
			return;
		}
		if (prev.h == val) return;
		var w = Math.round(val*v.propWH);
		prev = {w:w,h:val};
		$(this).val(val);
		v.$w.val(w);
		v.a('embed');
	});
	//jn.log('zclip:',v.$el.find('[zclip]').zclip);
	ZeroClipboard.config({swfPath:'/flash/zeroClipboard.swf'});
	var zero = new ZeroClipboard(v.$el.find('[zclip]'));
	zero.on('aftercopy',function(e){
		v.branch.alert.a('show',{
			message:'Copied to clipboard',
			type:'success',
			hideAfter:1000
		})
    	jn.log('Copied text to clipboard: '+e.data['text/plain']);
  	});
	zero.on('copy',function(e){
		e.clipboardData.setData('text/plain',v.$el.find('[prop="embed"]').val());
	});

	jn.ch(function(d,ch){
		v.assets = {};
		if (v.spot.id){ //get cmyk asset rec
			v.assets.image = jn.m('assets',{id:v.spot.id});
			if (!v.assets.image) v.assets.main = v.assets.image;
			v.a('model',{model:v.assets.image,
				rec:function(){
					v.a('image');
				}
			});
		}
		ch.done();
	}).ch(function(d,ch){ //bind to page
		a.view.a('model',{model:v.branch.page,rec:function(){
			a.view.a('page');
		}},ch);
	}).ch(function(d,ch){ //get position of this logo in brand (if exists)
		v.a('buildCats',a,ch);
	}).ch(function(d,ch){
		v.a('embed');
		v.a('initControls');
		v.a('buildColors',a,ch);
	}).ch(cb.done).fail(v.branch.err);
};

me.a_resize = function(a,cb){
	var v = a.view;
	if (v.$sidebar.hasClass('closed')){
		v.$sidebar.removeClass('closed');
		v.$main.removeClass('fullscreen');
		v.$imgShow.show();
		v.$imgHide.hide();
	}
	else {
		v.$sidebar.addClass('closed');
		v.$main.addClass('fullscreen');
		v.$imgShow.hide();
		v.$imgHide.show();
	}
};

me.a_size = function(a,cb){
	var v = a.view;
	var size = a.$btn.attr('size');
	v.$el.find('[size].active').removeClass('active');
	a.$btn.addClass('active');

	var dim = me.downloadSizes[size];
	if (v.propWH >= 1){
		w = dim;
		h = Math.round(dim/v.propWH);
	}
	else {
		h = dim;
		w = Math.round(dim*v.propWH);
	}
	if (w){
		v.a('set',{w:w,h:h});
	}
	v.a('embed');
};

me.a_settings = function(a,cb){
	var v = a.view;
	changeView('settings');
};

me.a_back = function(a,cb){
	var v = a.view;
	changeView('back');
};

me.a_save = function(a,cb){
	var v = a.view;

	var vals = v.a('vals');
	jn.ch(function(d,ch){
		//move cat, if cat changed
		var cat = v.$el.find('[tpl="cat"].active').data('cat');
		if (v.activeCat) var active = v.branch.page.rec.parts.images[v.activeCat].category;
		//jn.log('cat:',cat.category,active);
		if (active && cat.category == active) return ch.done();
		jn.log('cat:',cat);
		v.branch.page.a('moveIntoCat',{part:'images',cat:cat,spot:v.spot},ch);
	}).ch(function(d,ch){
		//v.branch.overlay.a('hide');
		changeView('back');
		ch.done();
	}).ch(cb.done).fail(v.branch.err);
};

me.a_saveClose = function(a,cb){
	var v = a.view;
	jn.ch(function(d,ch){
		v.a('save',ch);
	}).ch(function(d,ch){
		v.branch.overlay.a('hide',ch);
	}).cb(cb);
};

me.a_saveColor = function(a,cb){
	var v = a.view;
	var vals = v.a('vals');
	jn.ch(function(d,ch){
		if (!vals.bgColor) return ch.done();
		a.color = v.a('checkColor',{color:vals.bgColor});
		jn.log('color:',a.color);
		ch.done();
	}).ch(function(d,ch){ //backdrop, change on both logos in spot
		if (!v.assets.image || !a.color) return ch.done();
		if (v.assets.image.rec.bgColor == a.color) return ch.done();
		v.assets.image.a('update',{bgColor:a.color},ch);
	}).ch(cb.done).fail(v.branch.err);
};

me.a_saveFilename = function(a,cb){
	var v = a.view;
	var vals = v.a('vals');
	v.branch.alert.a('hide');
	jn.ch(function(d,ch){ //backdrop, change on both logos in spot
		if (!v.assets.image) return ch.fail('no image defined');
		v.assets.image.a('setCustomFilename',{customFilename:vals.customFilename},ch);
	}).ch(function(d,ch){
		v.branch.alert.a('show',{type:'success',message:'Filename saved!'},ch);
	}).ch(cb.done).fail(v.branch.err);
};

//
//
//
//me.a_saveLabel = function(a,cb){
//	var v = a.view;
//	var vals = v.a('vals');
//	v.branch.alert.a('hide');
//	jn.ch(function(d,ch){ //backdrop, change on both logos in spot
//		if (!v.assets.image) return ch.fail('no image defined');
//		v.assets.image.a('setCustomLabel',{customLabel:vals.customLabel},ch);
//	}).ch(function(d,ch){
//		v.branch.alert.a('show',{type:'success',message:'Label saved!'},ch);
//	}).ch(cb.done).fail(v.branch.err);
//};
//
//
//



me.hexExp = new RegExp('^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$');
me.a_checkColor = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	if (a.color.substr(0,1) != '#'){
		a.color = '#'+a.color;
	}
	if (!a.color.match(me.hexExp)){
		b.err('color not recognized');
		return false;
	}
	return a.color;
};

me.a_image = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	var image = v.assets.image;

	jn.log('image:',image);

	v.a('buildAsset',{asset:image});
};

me.a_buildAsset = function(a,cb){
	var v = a.view;
	var image = a.asset;
	var src = jn.config.cdn+'img?id='+v.id+'&w=1200&h=1200';
	v.$img.attr('src', src);
	var color = (image.rec.data && image.rec.data.bgColor)? image.rec.data.bgColor: '#f9f9f9';

	var colorHex = color;
	if (colorHex.substring(0, 1) == '#') { 
		colorHex = colorHex.substring(1);
	}

	v.$el.find('[area="bgColor"]').css({'background-color':color});
	v.$el.removeClass('white black').addClass(getContrastYIQ(colorHex));
	v.a('set',image.rec,{bgColor:color});

	jn.log('bgcolor:',color);

	//if (image.rec.data && image.rec.data.bgColor){
		v.$el.find('[area="bgColor"]').css({
			'background-color':color
		});
	//}

	if (!image.rec.customFilename && image.rec.filename){
		var prefix = image.rec.filename.replace(/\.[a-zA-Z]{1,5}$/,'');
		v.a('set',{customFilename:prefix});
	}	

	var data = image.rec.data;
	v.$el.find('[size]').hide();
	var activeSize;
	for (var i in me.downloadSizes){
		var size = me.downloadSizes[i];
		var label = i;

		var bigger = false;
		if (data.propWH >= 1){
			if (data.dim.w >= size) bigger = true;
		}
		else {
			if (data.dim.h >= size) bigger = true;
		}
		if (bigger){
			activeSize = activeSize || label;
			v.$el.find('[size="'+label+'"]').show();
		}
	}

	v.propWH = data.propWH;
	if (activeSize){
		var size = me.downloadSizes[activeSize];
		v.$el.find('[size].active').removeClass('active');
		v.$el.find('[size="'+activeSize+'"]').addClass('active');
		var w,h;
		if (data.propWH >= 1){
			w = size;
			h = Math.round(size/data.propWH);
		}
		else {
			h = size;
			w = Math.round(size*data.propWH);
		}
		if (w){
			v.a('set',{w:w,h:h});
		}
	}
	else { //no active size
		v.a('set',data.dim);
	}

	//show logo in settings and hide upload form
	v.$el.find('[area="form"]').hide();
	v.$el.find('[area="disp"]').show();

	v.a('setUpload',{action:'replace'},cb);

};

/*
a_setUpload
	---a---
	colorspace
	action
*/
me.a_setUpload = function(a,cb){
	var v = a.view;
	var $upload = v.$el.find('.upload');
	var $uploadForm = v.$el.find('.uploadForm');
	var $loader = v.$el.find('.loading-ani span');

	$('body').addClass('dropDisabled');

	var path = 'comm/?obj='+jn.web.packObj({
		path:'ent/m/'+v.assets.image._path,
		a:'replace',
		reqId:jn.comm.reqId()
	});
	jn.log('replace path:',path);

	v.child('upload').a('drop',{
		$drop:v.$el.find('[area="drop"]'),
		$form:v.$el.find('form'),
		path:path
	},{
		submit:function(res,resCb){
			if (!res.files || res.files.length < 1) return 'no file chosen';
			var file = res.files[0];
			if (!file.name) return 'no file name';
			//get file extension
			var ext = jn.m.assets.getExt(file.name);
			if (['jpg','jpeg','png'].indexOf(ext) === -1) return v.branch.err('file type must be .png, .jpg, or .jpeg');
			$upload.addClass('upload-in-progress');
			$uploadForm.addClass('spinner');
			$loader.css({width:'0%'});
			return false;
		},
		progress:function(res){
			var w = (Number(res.done)/Number(res.total))*100;
			jn.log('progress:',w);
			$loader.css({width:w+'%'});
		},
		complete:function(res){
			jn.log('replace COMPLETE res!!!:',res);
			$upload.removeClass('upload-in-progress');
			$uploadForm.removeClass('spinner');
			v.$el.find('input[type="file"]').val('');
			

			/*
			Set the cdn reference to blank - This ensures that all requests for this page will come direct from the server to
			fix any asynch issues where the logo has not been fully purged
			*/
			jn.config.cdn = '';
			v.a('page',{replace:true});
		},
		error:function(res){
			jn.log('upload fail:',res);
			$upload.removeClass('upload-in-progress');
			$uploadForm.removeClass('spinner');
			$loader.css({width:'0%'});

			v.branch.err(res);
		}
	});

	cb.done();
};

me.a_replace = function(a,cb){
	var v = a.view;
	v.$el.find('[area="disp"]').hide();
	v.$el.find('[area="form"]').show();
};

me.a_display = function(a, cb){
	var v = a.view;
	v.$el.show();

	var wh = $(window).height(),
		//childHeight = a.$child.height(),
		$scrollDiv = v.$el.find('.scroll-hldr'),
		mh = v.$el.height();
		console.log('Mh, ', mh);
		console.log('Wh, ', wh);

   	if ( mh >= wh ) {
   		$scrollDiv.height(wh);
    }
	
	$scrollDiv.mCustomScrollbar('disable', true);
	$scrollDiv.mCustomScrollbar({
		theme: 'dark',
		autoHideScrollbar: false,
		//mouseWheel:false,
		contentTouchScroll:false,
		scrollInertia: 20,
		advanced:{
			updateOnContentResize: true,
			autoScrollOnFocus:false
		}
	});

	v.$main.find('.item-hldr').css('max-height', ( ( parseInt( v.$main.height() )- 120 ) + 'px' ));

	v.branch.win.a('touch');

	cb.done();
};

var changeView = function( typeOfShift ){
	var shiftPanes = $('[data-pane="shift"]');
	var fadePanes = $('[data-pane="fade"]');

	if ( typeOfShift === 'settings' ){
		shiftPanes.addClass('shift-left');
		fadePanes.addClass('fade-on');
	}
	else if ( typeOfShift === 'back' || typeOfShift === 'reset' ){
		shiftPanes.removeClass('shift-left');
		fadePanes.removeClass('fade-on');
	}
};

var setBackgroundColor = function( colorVal, elementToChange ){
	var colorVal = colorVal.replace(/#/g, '');

	if ( colorVal.indexOf('rgb') != -1 ){
		elementToChange.css('background', colorVal);
	} 
	else {
		elementToChange.css('background', '#' + colorVal);
	}
};

me.a_buildCats = function(a,cb){
	var v = a.view;
	v.activeCat = v.pos.split('.')[1]; //get active category from pos
	jn.log('active cat:',v.activeCat);
	//loop through logo categories
	var parts = v.branch.page.rec.parts;
	if (!me.$tpl) me.$tpl = v.$el.find('[tpl="cat"]').detach();
	v.$el.find('[tpl="cat"]').remove();
	var $container = v.$el.find('[container="cat"]');
	var $addCat = v.$el.find('[btn="addCat"]');
	var cats = [];
	if (a.custom){ //custom category defined
		var $cat = me.$tpl.clone();
		$cat.addClass('active');
		$cat.find('[prop="category"]').html(a.custom);
		$cat.data('cat',{category:a.custom,descip:''});
		$addCat.before($cat);
	}
	var images = parts.images;
	for (var i=0,len=images.length;i<len;i++){
		var cat = images[i];
		if (cat){
			var $cat = me.$tpl.clone();
			if (v.activeCat == i && !a.custom){
				v.curCat = cat.category;
				$cat.addClass('active');
			}
			$cat.find('[prop="category"]').html(cat.category);
			if (cat.assets.length > 0){
				$cat.find('[prop="glyph"]').hide();
				var imgId = cat.assets[0].rgb || cat.assets[0].cmyk || cat.assets[0].id;
				var src = 'img?id='+imgId;
				$cat.find('[prop="img"]').show().attr('src',src);
			}
			$cat.data('cat',cat);
			$addCat.before($cat);
			cats.push(cat.category.toLowerCase());
		}
	}
	for (var i=0,len=me.defaultCats.length;i<len;i++){
		var cat = me.defaultCats[i];
		if (cats.indexOf(cat.category.toLowerCase()) === -1){ //default cat not populated
			var $cat = me.$tpl.clone();
			$cat.data('cat',cat);
			$cat.find('[prop="category"]').html(cat.category);
			$cat.find('[prop="glyph"]').html(cat.glyph);
			$addCat.before($cat);
		}
	}
	cb.done();
};

me.a_catSelect = function(a,cb){
	var v = a.view;
	a.$btn.siblings('.active').removeClass('active');
	a.$btn.addClass('active');
};

me.a_addCat = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('hide');
	b.overlay.child('o_catAdd').a('show',{prev:a.view});
};

me.a_buildColors = function(a,cb){
	var v = a.view;
	//loop through colors and build
	var parts = v.branch.page.rec.parts;
	if (!me.$colorTpl) me.$colorTpl = v.$el.find('[tpl="color"]').detach();
	v.$el.find('[tpl="color"]').remove();
	var $container = v.$el.find('[container="color"]');
	if (!parts.colors) return cb.done();

	var colors = [];
	for (var i=0,len=parts.colors.length;i<len;i++){
		var cat = parts.colors[i];
		if (cat && cat.assets){
			for (var j=0,lenJ=cat.assets.length;j<lenJ;j++){
				colors.push(cat.assets[j].id);
			}
		}
	}

	jn.loop({ary:colors},{
		loop:function(loop){
			var colorId = colors[loop.i];
			var color = jn.m('assets',{id:colorId});
			jn.ch(function(d,ch){
				color.a('get',ch);
			}).ch(function(d,ch){
				if (!color.rec || !color.rec.data || !color.rec.data.hex) return loop.next();
				var $color = me.$colorTpl.clone();
				$color.css({'background-color':color.rec.data.hex});
				$color.data({color:color.rec.data.hex});
				$container.append($color);
				ch.done();
			}).ch(loop.next).fail(cb.fail);
		},
		done:cb.done
	});
};

me.a_bgColor = function(a,cb){
	var v = a.view;
	var color = a.$btn.data('color');
	v.a('set',{bgColor:color});
	v.$el.find('[area="bgColor"]').css({'background-color':color});
	v.a('saveColor');
};

me.a_download = function(a,cb){
	var v = a.view;
	var vals = a.view.a('vals');

	//get asset id
	var $format = v.$el.find('[format].active');
	var path = 'downloadAsset?id='+v.branch.page.id;
	var format = $format.attr('format');
	jn.ch(function(d,ch){ //get asset id
		var assetId = v.spot.id;
		path += '&assetId='+assetId;
		ch.done();
	}).ch(function(d,ch){ //size
		if (vals.w) path += '&w='+vals.w;
		if (vals.h) path += '&h='+vals.h;
		ch.done();
	}).ch(function(d,ch){
		jn.log('download path:',path);
		window.location = path;
		ch.done();
	}).ch(cb.done).fail(v.branch.err);
};

me.a_embed = function(a,cb){
	var v = a.view;
	var vals = a.view.a('vals');
	var path = jn.config.cdn;
	jn.ch(function(d,ch){ //get asset id
		var assetId = v.spot.id;
		if (!assetId) return ch.fail('no asset id');
		path += 'img?id='+assetId;
		ch.done();
	}).ch(function(d,ch){ //size
		if (vals.w) path += '&w='+vals.w;
		if (vals.h) path += '&h='+vals.h;
		ch.done();
	}).ch(function(d,ch){
		v.a('set',{embed:path});
		ch.done();
	}).ch(cb.done).fail(v.branch.err);
};

me.a_prev = function(a,cb){
	var v = a.view;
	var pos = v.branch.page.a('search',{spot:v.spot});
	if (!pos) return cb.fail('no pos found');

	var posAry = pos.split('.');
	if (posAry.length < 3) return cb.fail('pos not complete');
	var part = posAry[0];
	var catInd = posAry[1];
	var assetInd = posAry[3];
	var catI = catInd;
	
	var spot;
	if (v.spot._gr){
		while (catI >= 0 && !spot){
			var cat = v.branch.page.rec.parts[part][catI];
			for (var i=0,len=cat.assets.length;i<len;i++){ //look in same cat
				var sp = cat.assets[i];
				if (((sp._gr.x < v.spot._gr.x && sp._gr.y == v.spot._gr.y) || (sp._gr.y < v.spot._gr.y) || (catI < catInd)) && 
					(!spot || ((sp._gr.x > spot._gr.x && sp._gr.y == spot._gr.y) || (sp._gr.y > spot._gr.y)))
					){
					spot = sp;
				}
			}
			catI--;
		}
		if (spot){
			var newPos = v.branch.page.a('search',{spot:v.spot});
			jn.ch(function(d,ch){
				v.a('hide',ch);
			}).ch(function(d,ch){
				v.branch.overlay.child('o_imageOverlay').a('show',{spot:spot,pos:newPos},ch);
			}).cb(cb);
		}
	}

};

me.a_next = function(a,cb){
	var v = a.view;
	var pos = v.branch.page.a('search',{spot:v.spot});
	if (!pos) return cb.fail('no pos found');

	var posAry = pos.split('.');
	if (posAry.length < 3) return cb.fail('pos not complete');
	var part = posAry[0];
	var catInd = posAry[1];
	var assetInd = posAry[3];
	var catI = catInd;

	var spot;
	if (v.spot._gr){
		while (catI < v.branch.page.rec.parts[part].length && !spot){
			var cat = v.branch.page.rec.parts[part][catI];
			jn.log('cat:',cat);
			for (var i=0,len=cat.assets.length;i<len;i++){
				var sp = cat.assets[i];
				if (((sp._gr.x > v.spot._gr.x && sp._gr.y == v.spot._gr.y) || (sp._gr.y > v.spot._gr.y) || (catI > catInd)) && 
					(!spot || ((sp._gr.x < spot._gr.x && sp._gr.y == spot._gr.y) || (sp._gr.y < spot._gr.y)))
					){
					spot = sp;
				}
			}
			catI++;
		}
		if (spot){
			var newPos = v.branch.page.a('search',{spot:v.spot});
			jn.ch(function(d,ch){
				v.a('hide',ch);
			}).ch(function(d,ch){
				v.branch.overlay.child('o_imageOverlay').a('show',{spot:spot,pos:newPos},ch);
			}).cb(cb);
		}
	}
};

me.a_initControls = function(a,cb){
	var v = a.view;
	var pos = v.branch.page.a('search',{spot:v.spot});
	if (!pos) return cb.fail('no pos found');

	var posAry = pos.split('.');
	if (posAry.length < 3) return cb.fail('pos not complete');
	var part = posAry[0];
	var catInd = posAry[1];
	var assetInd = posAry[3];
	var catI = catInd;
	var $next = v.$el.find('[btn="next"]');
	var $prev = v.$el.find('[btn="prev"]');

	$('body').on('keyup',function(e){
		if (!v.enableKeys) return;
		jn.log('keyup:',e.keyCode);
		if (e.keyCode == 39){
			v.a('next');
		}
		else if (e.keyCode == 37){
			v.a('prev');
		}
		else if (e.keyCode == 27){
			v.branch.overlay.a('hide');
		}
	});

	if (!v.spot._gr){
		//hide next and prev
		$next.css({visibility:'hidden'});
		$prev.css({visibility:'hidden'});
		return;
	}

	var spot;
	while (catI < v.branch.page.rec.parts[part].length && !spot){
		var cat = v.branch.page.rec.parts[part][catI];
		for (var i=0,len=cat.assets.length;i<len;i++){
			var sp = cat.assets[i];
			if (((sp._gr.x > v.spot._gr.x && sp._gr.y == v.spot._gr.y) || (sp._gr.y > v.spot._gr.y) || (catI > catInd)) && 
				(!spot || ((sp._gr.x < spot._gr.x && sp._gr.y == spot._gr.y) || (sp._gr.y < spot._gr.y)))
				){
				spot = sp;
			}
		}
		catI++;
	}
	if (spot) $next.css({visibility:'visible'});
	else $next.css({visibility:'hidden'});

	catI = catInd;
	spot = undefined;
	while (catI >= 0 && !spot){
		var cat = v.branch.page.rec.parts[part][catI];
		for (var i=0,len=cat.assets.length;i<len;i++){ //look in same cat
			var sp = cat.assets[i];
			if (((sp._gr.x < v.spot._gr.x && sp._gr.y == v.spot._gr.y) || (sp._gr.y < v.spot._gr.y) || (catI < catInd)) && 
				(!spot || ((sp._gr.x > spot._gr.x && sp._gr.y == spot._gr.y) || (sp._gr.y > spot._gr.y)))
				){
				spot = sp;
			}
		}
		catI--;
	}
	if (spot) $prev.css({visibility:'visible'});
	else $prev.css({visibility:'hidden'});
};

me.a_removeImage = function(a,cb){
	var v = a.view;
	v.a('hide');
	v.branch.overlay.child('o_imageRemove').a('show',{prev:v,pos:v.pos});
};

me.a_hide = function(a,cb){
	var v = a.view;
	v.branch.alert.a('hide');
	$('body').removeClass('dropDisabled');
	$('body').off('keyup');

	v.$el.find('.scroll-hldr').mCustomScrollbar('destroy');
	v.a('hide',{root:true},cb);
};

return module.exports(j,cb);};require.store["web/views/categories/images/overlays/o_imageRemove.js"]=function(j,cb){var module = {};var vp = 'o_imageRemove', jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v[vp] = me;
	cb.done();
};

/*
a_bind (fun):
	---a---
	prevView
*/
me.a_bind = function(a,cb){
	var v = a.view;
	v.a('btn');
	v.pos = a.pos;
	v.prev = a.prev;
	cb.done();
};

me.a_display = function(a,cb) {
	var v = a.view;
	v.$el.show();
	var h = v.$el.outerHeight();
	v.$el.css('margin-top', -(h/2));
	cb.done();
};

me.a_cancel = function(a,cb){
	var v = a.view;
	//close this overlay and show prev
	v.a('hide');
	v.prev.a('show');
};

me.a_remove = function(a,cb){
	var v = a.view;

	jn.ch(function(d,ch){
		//remove spot from page
		v.branch.page.a('removeSpot',{pos:v.pos},ch);
	}).ch(function(d,ch){
		v.branch.overlay.a('hide');
		cb.done();
	}).fail(v.branch.err);
};
return module.exports(j,cb);};require.store["web/views/categories/images/p_b_imageCat.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.p_b_imageCat = me;
	cb.done();
};

/*
a_build (fun):
	---a---
	pos (str): the position of the category
	cat (obj): the category object
*/
me.a_build = function(a,cb){
	var v = a.view, b = v.a('branch'), $el = v.$el;
	var part = 'images';
	$el.attr('pos',v.pos);
	v.a('set',a.cat);
	v.cat = a.cat;
	v.a('access',{access:b.access});

	v.$catH2 = v.$el.find('h2[prop="category"]');
	v.$catH2.show();
	v.$catField = v.$el.find('input[prop="category"]');
	v.$catField.hide();

	v.$moveUp = v.$el.find('[btn="moveUp"]');
	v.$moveDown = v.$el.find('[btn="moveDown"]');
	if (a.ind !== undefined && a.len !== undefined){
		if (a.ind == 0) v.$moveUp.hide();
		else v.$moveUp.show();
		if (a.ind >= a.len - 1) v.$moveDown.hide();
		else v.$moveDown.show();
	}

	if (!a.cat.assets) return cb.done();
	if (!v.shown) v.shown = [];
	jn.ch(function(d,ch){ //init grid
		if (b.grid) return ch.done();
		var $container = $el.find('ul');
		b.grid = v.child('grid');
		var noResize = (!b.isAccess('team'))? true: false;
		b.grid.a('init',{$container:$container,group:part,noResize:noResize,
			update:function(childs){
				b.page.a('update',{parts:b.page.rec.parts});
			},
			jump:function(jump){
				jn.log('jump:',jump);
				if (!jump.group) return;
				var groupPos = jump.group.parent.pos;
				var gCat = b.page.a('getPos',{pos:groupPos});;
				var elemPos = jump.elem.pos;
				var spot = b.page.a('getPos',{pos:elemPos});
				b.page.a('moveIntoCat',{part:part,spot:spot,cat:gCat});
			}
		},ch);
	}).ch(function(d,ch){ //check for views to hide
		if (v.shown.length < 1 || v.shown.length <= a.cat.assets.length) return ch.done();
		var hideI = a.cat.assets.length - 1;
		//jn.log('hide:',v.shown.length,a.cat.assets.length);
		jn.loop({ary:v.shown,i:hideI},{
			loop:function(loop){
				//jn.log('hide:',hideI);
				if (v.shown[loop.i]) v.shown[loop.i].a('hide',{
					fail:ch.fail,
					done:loop.next
				});
				else loop.next();
			},
			done:ch.done
		});
	}).ch(function(d,ch){ //show views
		v.shown = [];
		jn.loop({ary:a.cat.assets},{
			loop:function(loop){
				var spot = a.cat.assets[loop.i];
				var pos = v.pos+'.assets.'+loop.i;
				var row = v.child('p_b_imageRow',{pos:pos});
				v.shown.push(row);
				row.a('show',{spot:spot,rebind:true},{
					fail:ch.fail,
					done:loop.next
				});
			},
			done:ch.done
		});
	}).ch(function(d,ch){
		var $descrip = $el.find('textarea[prop="descrip"]');
		$descrip.autosize();
		$el.on('blur','textarea[prop="descrip"]',function(e){
			//console.log('blur');
			var descrip = $descrip.val();
			b.page.a('catDescrip',{descrip:descrip,pos:v.pos});
		});
		$el.on('keyup','textarea[prop="descrip"]',function(e){
			if(e.keyCode == 9){ //tab
				$(this).blur();
				return false;	
			}
		});

		$el.on('blur','input[prop="category"]',function(e){
			//console.log('blur');
			v.a('saveCategory');
		});
		$el.on('keyup','input[prop="category"]',function(e){
			if(e.keyCode == 9 || e.keyCode == 13){ //tab
				$(this).blur();
				return false;	
			}
		});
		ch.done();
	}).ch(cb.done).fail(b.err);
};


me.a_hide = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	var $descrip = $el.find('textarea[prop="descrip"]');
	$descrip.trigger('autosize.destroy');

	if (b.grid){
		b.grid.a('destroy');
		delete b.grid;
	}

	a.view.a('hide',{root:true},cb);
};

me.a_bind = function(a,cb){
	var v = a.view;
	v.a('btn');
	cb.done();
};

me.a_moveUp = function(a,cb){
	var v = a.view;
	jn.ch(function(d,ch){
		v.branch.page.a('moveCategory',{pos:v.pos,part:'images',move:'up'},ch);
	}).cb(cb);
};

me.a_moveDown = function(a,cb){
	var v = a.view;
	jn.ch(function(d,ch){
		v.branch.page.a('moveCategory',{pos:v.pos,part:'images',move:'down'},ch);
	}).cb(cb);
};

me.a_editCategory = function(a,cb){
	var v = a.view;
	v.$catH2.hide();
	v.$catField.show().focus();
};

me.a_saveCategory = function(a,cb){
	var v = a.view;
	var vals = v.a('vals');
	if (vals.category == v.cat.category){
		v.$catH2.show();
		v.$catField.hide();
		return;
	}
	
	jn.ch(function(d,ch){
		if (!vals.category) return ch.fail('no category entered');
		v.branch.page.a('saveCategory',{pos:v.pos,category:vals.category},ch);
	}).fail(v.branch.err).cb(cb);
};

return module.exports(j,cb);};require.store["web/views/categories/images/p_b_imageRow.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.p_b_imageRow = me;
	cb.done();
};

me.a_build = function(a,cb){
	var v = a.view, b = v.a('branch'), $el = v.$el;

	$el.attr({pos:v.pos,path:v._path});
	cb.done();
};

me.a_bind = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;

	var assetChanged = false;
	if (!a.spot || !v.spot || a.spot.id != v.spot.id){ 
		//delete v._gr;
		assetChanged = true;
	}
	v.a('btn');
	v.a('access',{access:b.access});

	var gridChanged = false;
	if (!a.spot || !v._gr || !jn.compare(a.spot._gr,v._gr)){
		gridChanged = true;
	}

	v.spot = a.spot;
	//jn.log('changed:',assetChanged,gridChanged);
	jn.ch(function(d,ch){
		if (!assetChanged) return ch.done();
		v.image = jn.m('assets',{id:v.spot.id});
		a.view.a('model',{model:v.image},ch);
		ch.done();
	}).ch(function(d,ch){
		if (!gridChanged) return ch.done();
		//jn.log('changed _gr:',v._gr,a.spot._gr);
		v._gr = a.spot._gr;
		b.grid.a('add',{add:v,
			update:function(dim){
				var spot = b.page.a('getPos',{pos:v.pos});
				spot._gr = dim;
				//jn.log('update:',dim,spot._gr);
		        return false;
			}
		},ch);
	}).ch(cb.done).fail(function(res){
		jn.log('image row err:',res);
		v.a('hide');
	});
};

me.a_hide = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.grid.a('remove',{remove:v});
	delete v._gr;
	delete v._grUpdate;
	v.a('hide',{root:true},cb);
};

me.a_rec = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	if (!v.image.rec){
		v.a('hide');
		return cb.fail('no rec or data found');
	} 
	var rec = v.image.rec;

	var src = jn.config.cdn+'img?id='+v.image.id+'&w=720&h=618';
	$el.find('[prop="bgFill"]').css({'background-image':'url("'+src+'")'}).getImgSize(function(dim){
		var h = $el.height();
		var w = $el.width();
		var bh = dim.height;
		var bw = dim.width;

		if(h > bh && w > bw){
			$el.find('[prop="bgFill"]').addClass('auto');
		}
	});

	var color = (rec.data && rec.data.bgColor)? rec.data.bgColor: '#f9f9f9';
	$el.find('[prop="bgFill"]').css({'background-color':color});

	if ((!rec.data.dim || !rec.data.propWH) && !v.gotData){
		v.image.a('getData');
		v.gotData = true;
		return;
	}

	var dim = rec.data.dim;
	var downloadSizes = [{label:'Large',size:1200},{label:'Medium',size:600},{label:'Small',size:300}];
	v.$el.find('[btn="downloadQuick"]:not([tpl])').remove();
	var $tpl = v.$el.find('[tpl="downloadQuick"]');
	var $insert = v.$el.find('[area="downloadQuick"]');
	$tpl.hide();
	for (var i=0,len=downloadSizes.length;i<len;i++){
		var size = downloadSizes[i].size;
		var label = downloadSizes[i].label;

		var w,h;
		if (rec.data.propWH >= 1){
			if (dim.w >= size){
				w = size;
				h = Math.round(size/rec.data.propWH);
			}
		}
		else {
			if (dim.h >= size){
				h = size;
				w = Math.round(size*rec.data.propWH);
			}
		}
		if (w){
			var $dl = $tpl.clone();
			$dl.removeAttr('tpl');
			$dl.attr({w:w,h:h});
			$dl.find('[prop="label"]').html(label);
			$dl.find('[prop="size"]').html(w+'x'+h+'.'+rec.ext);
			$dl.show();
			$insert.before($dl);
		}
	}
};

me.a_imageEdit = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_imageEdit').a('show',{pos:v.pos,spot:v.spot});
};

me.a_imageOverlay = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_imageOverlay').a('show',{pos:v.pos,spot:v.spot});
};

me.a_downloadCustom = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_imageDownload').a('show',{pos:v.pos,spot:v.spot});
};

me.a_downloadQuick = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	var assetId = v.spot.id;
	if (!assetId) return ch.fail('no asset defined');
	var files = [{
		w:a.$btn.attr('w'),
		h:a.$btn.attr('h'),
		ext:a.$btn.attr('ext')
	}];
	var path = 'downloadAsset?obj='+jn.web.packObj({
		id:b.page.id,
		assetId:assetId,
		files:files
	});
	window.location = path;
};
return module.exports(j,cb);};require.store["web/views/categories/logos/overlays/o_logoColorspaceRemove.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_logoColorspaceRemove = me;
	cb.done();
};

me.a_bind = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	b.prev = a.prev;
	b.pos = a.pos;
	b.colorspace = a.colorspace;
	a.view.a('btn');
	cb.done();
};

me.a_display = function(a, cb) {
	var $el = a.view.a('$el'), b = a.view.branch;
	$el.show();
	var h = $el.outerHeight();
	console.log('overlay height, ', h);
	$el.css('margin-top', -(h/2));
	cb.done();
};

me.a_cancel = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('hide');
	b.prev.a('show');
};

me.a_remove = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	jn.ch(function(d,ch){
		b.page.a('removeSpotProp',{pos:b.pos,prop:b.colorspace},ch);
	}).ch(function(d,ch){
		a.view.a('hide');
		b.prev.a('show');
		cb.done();
	}).fail(b.err);	
};return module.exports(j,cb);};require.store["web/views/categories/logos/overlays/o_logoOverlay.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_logoOverlay = me;
	cb.done();
};

me.defaultCats = [
	{category:'Primary',glyph:'\'',descrip:'Use this logo whenever possible. Maintain the logos orientation, and make sure it has plenty of space to breathe.'},
	{category:'Icon',glyph:'%',descrip:'Use this logo in situations where the primary logo will not work, and it’s appropriate to have just a mark represent the brand.'},
	{category:'Typographic',glyph:'(',descrip:'Use this logo in situations where the primary logo will not work, and it’s appropriate to have the brand represented typographically.'}
];
me.downloadSizes = {
	small:300,
	medium:600,
	large:1200
};
me.defaultSize = 'medium';
me.defaultFormat = 'png';

me.a_build = function(a,cb){
	var v = a.view;
	v.$sidebar = v.$el.find('[area="sidebar"]');
	v.$main = v.$el.find('[area="main"]');
	v.$imgShow = v.$el.find('[img="show"]');
	v.$imgHide = v.$el.find('[img="hide"]');
	v.$bgColor = v.$el.find('[area="bgColor"]');
	v.$img = v.$el.find('[prop="img"]');
	v.$size = v.$el.find('[area="size"]');
	v.$w = v.$el.find('[prop="w"]');
	v.$h = v.$el.find('[prop="h"]');

	v.enableKeys = true;

	v.branch.win.a('bind',{
		resize:function(){
			var dim = v.branch.win.a('dim');
			v.$el.find('.item-hldr').height(dim.h);

			//Adjust scroll sections
			var scrollOffset = 43;
			var wh = $(window).height(),
				$scrollDiv = v.$el.find('.scroll-hldr'),
				mh = v.$el.height();

		   	$scrollDiv.height(wh - scrollOffset);
			
			$scrollDiv.mCustomScrollbar('disable', true);
			$scrollDiv.mCustomScrollbar({
				theme: 'dark',
				autoHideScrollbar: false,
				contentTouchScroll:false,
				scrollInertia: 20,
				advanced:{
					updateOnContentResize: true,
					autoScrollOnFocus:false
				}
			});

			v.$main.find('.item-hldr').css('max-height', ( ( parseInt( v.$main.height() ) - 120 ) + 'px' ));
		}
	});

	cb.done();
};

me.a_bind = function(a,cb){ //bind user events here
	var v = a.view;

	if (a.uploaded){
		var asset = jn.m('assets',{id:a.uploaded});
		var pos = v.branch.page.a('search',{asset:asset});
		jn.log('uploaded pos:',pos);
		if (!pos){
			v.branch.overlay.a('hide');
			return cb.done();
		}
		var lDot = pos.lastIndexOf('.');
		v.pos = pos.substr(0,lDot);
		v.spot = v.branch.page.a('getPos',{pos:v.pos});
		changeView('settings');
	}
	else if (a.custom){
		changeView('settings');
	} 
	else changeView('back');

	jn.log('bind pos:',a.pos);
	
	if (!a.spot && !v.spot) return v.branch.overlay.a('hide');
	v.spot = a.spot || v.spot;
	v.pos = a.pos || v.pos;
	v.id = v.spot.rgb || v.spot.cmyk || v.spot.id;
	//if (!v.id) return cb.fail('no id defined');

	v.$el.find('[format="eps"]').hide();

	v.a('btn');
	v.a('access',{access:v.branch.access});

	v.$img.css({'background-image':'none'});

	v.$el.on('blur','[prop="bgColor"]',function(){
		var val = $(this).val();
		v.a('saveColor');
		//var color = v.a('checkColor',{color:val});
		//v.$el.find('[area="bgColor"]').css({'background-color':color});
	});

	v.$el.find('[area="bgColor"]').css({'background-color':'#f9f9f9'});

	v.$el.on('blur','[prop="customFilename"]',function(){
		var val = $(this).val();
		v.a('saveFilename');
		//var color = v.a('checkColor',{color:val});
		//v.$el.find('[area="bgColor"]').css({'background-color':color});
	});

	//size blur
	var prev = {};
	v.$el.on('blur','[prop="w"]',function(){
		var val = $(this).val();
		val = val.replace(/[^0-9]/g,'');
		if(!val.length || val < 1 || val > 10000){
			v.branch.err('dimensions must be between 0-10000');
			v.$w.val(prev.w);
			return;
		}
		if (prev.w == val) return;
		var h = Math.round(val/v.propWH);
		prev = {w:val,h:h};
		$(this).val(val);
		v.$h.val(h);
		v.a('embed');
	});

	v.$el.on('blur','[prop="h"]',function(){
		var val = $(this).val();
		val = val.replace(/[^0-9]/g,'');
		if(!val.length || val < 1 || val > 10000){
			v.branch.err('dimensions must be between 0-10000');
			v.$h.val(prev.h);
			return;
		}
		if (prev.h == val) return;
		var w = Math.round(val*v.propWH);
		prev = {w:w,h:val};
		$(this).val(val);
		v.$w.val(w);
		v.a('embed');
	});

	//to enable and disable left and right key navigation
	v.$el.on('focus','input',function(){
		v.enableKeys = false;
	});
	v.$el.on('blur','input',function(){
		v.enableKeys = true;
	});

	jn.ch(function(d,ch){ //bind to page
		a.view.a('model',{model:v.branch.page,rec:function(){
			a.view.a('page',ch);
		}});
	}).ch(function(d,ch){
		v.$el.find('[size].active').removeClass('active');
		v.$el.find('[size="'+me.defaultSize+'"]').addClass('active');
		v.$el.find('[format].active').removeClass('active');
		v.$el.find('[format="'+me.defaultFormat+'"]').addClass('active');
		ch.done();
	}).ch(function(d,ch){ //get position of this logo in brand (if exists)
		v.a('buildCats',a,ch);
		//ch.done();
	}).ch(function(d,ch){
		v.a('embed');
		v.a('buildColors',a,ch);
	}).ch(cb.done).fail(v.branch.err);
};

me.a_page = function(a,cb){
	var v = a.view;
	jn.log('pos:',v.pos);
	v.spot = v.branch.page.a('getPos',{pos:v.pos});
	if (!v.spot) return jn.log('no spot found');

	
	v.assets = {};
	jn.ch(function(d,ch){ //get rgb asset rec
		if (!v.spot.rgb) return ch.done();
		v.$el.find('[format="eps"][colorspace="rgb"]').show();
		v.assets.rgb = jn.m('assets',{id:v.spot.rgb});
		v.assets.main = v.assets.rgb;
		v.a('model',{model:v.assets.rgb,
			rec:function(){
				v.a('rgb',ch);
			}
		});
	}).ch(function(d,ch){ //get cmyk asset rec
		if (!v.spot.cmyk) return ch.done();
		v.$el.find('[format="eps"][colorspace="cmyk"]').show();
		v.assets.cmyk = jn.m('assets',{id:v.spot.cmyk});
		if (!v.assets.main) v.assets.main = v.assets.cmyk;
		v.a('model',{model:v.assets.cmyk,
			rec:function(){
				v.a('cmyk',ch);
			}
		});
	}).ch(function(d,ch){ //get cmyk asset rec
		if (!v.spot.id) return ch.done(); 
		v.$el.find('[format="eps"][colorspace="none"]').show();
		v.assets.logo = jn.m('assets',{id:v.spot.id});
		if (!v.assets.main) v.assets.main = v.assets.logo;
		//hide settings button
		v.$el.find('[btn="settings"]').hide();
		v.a('model',{model:v.assets.logo,
			rec:function(){
				v.a('logo',ch);
			}
		});
	}).ch(function(d,ch){
		if (v.assets.main){
			var src = /*(a.replace)? 'img?id='+v.assets.main.id+'&w=1200&h=1200':*/ jn.config.cdn+'img?id='+v.assets.main.id+'&w=1200&h=1200';
			v.$img.css({'background-image':'url("'+src+'")'});
		}
		else v.$img.css({'background-image':'url("")'});
		ch.done();
	}).ch(function(d,ch){
		v.a('initControls');
		v.a('colorspaces',ch);
	}).cb(cb);
};

me.a_resize = function(a,cb){
	var v = a.view;
	if (v.$sidebar.hasClass('closed')){
		v.$sidebar.removeClass('closed');
		v.$main.removeClass('fullscreen');
		v.$imgShow.show();
		v.$imgHide.hide();
	}
	else {
		v.$sidebar.addClass('closed');
		v.$main.addClass('fullscreen');
		v.$imgShow.hide();
		v.$imgHide.show();
		console.log( 'image hide: ' );
		console.log( v.$imgHide );
	}
};

me.a_format = function(a,cb){
	var v = a.view;
	var format = a.$btn.attr('format');
	v.$el.find('[btn="format"].active').removeClass('active');
};

me.a_size = function(a,cb){
	var v = a.view;
	var size = a.$btn.attr('size');
	v.$el.find('[size].active').removeClass('active');
	a.$btn.addClass('active');

	var dim = me.downloadSizes[size];
	if (v.propWH >= 1){
		w = dim;
		h = Math.round(dim/v.propWH);
	}
	else {
		h = dim;
		w = Math.round(dim*v.propWH);
	}
	if (w){
		v.a('set',{w:w,h:h});
	}
	v.a('embed');
};

me.a_settings = function(a,cb){
	var v = a.view;
	changeView('settings');
};

me.a_back = function(a,cb){
	changeView('back');
};

me.a_save = function(a,cb){
	var v = a.view;

	jn.ch(function(d,ch){
		//move cat, if cat changed
		var cat = v.$el.find('[tpl="cat"].active').data('cat');
		//jn.log('parts',v.branch.page.rec.parts,v.activeCat);
		if (v.activeCat) var active = (v.assets.logo)? v.branch.page.rec.parts.assets[v.activeCat].category: v.branch.page.rec.parts.logos[v.activeCat].category;
		//jn.log('cat:',cat.category,active);
		if (active && cat.category == active) return ch.done();
		if (v.assets.logo) v.branch.page.a('moveIntoCat',{part:'assets',cat:cat,spot:v.spot},ch);
		else v.branch.page.a('moveIntoCat',{part:'logos',cat:cat,spot:v.spot},ch);
	}).ch(function(d,ch){
		jn.log('new pos:',d.pos);
		if (d.pos) v.pos = d.pos;
		//v.branch.overlay.a('hide');
		changeView('back');
		ch.done();
	}).ch(cb.done).fail(v.branch.err);
};

me.a_saveClose = function(a,cb){
	var v = a.view;
	jn.ch(function(d,ch){
		v.a('save',ch);
	}).ch(function(d,ch){
		v.branch.overlay.a('hide',ch);
	}).cb(cb);
};

me.a_saveColor = function(a,cb){
	var v = a.view;
	var vals = v.a('vals');
	jn.ch(function(d,ch){
		if (!vals.bgColor) return ch.done();
		a.color = v.a('checkColor',{color:vals.bgColor});
		jn.log('color:',a.color);
		ch.done();
	}).ch(function(d,ch){ //backdrop, change on both logos in spot
		if (!v.assets.rgb || !a.color) return ch.done();
		if (v.assets.rgb.rec.data && v.assets.rgb.rec.data.bgColor == a.color) return ch.done();
		v.assets.rgb.a('update',{bgColor:a.color},ch);
	}).ch(function(d,ch){
		if (!v.assets.cmyk || !a.color) return ch.done();
		if (v.assets.cmyk.rec.data && v.assets.cmyk.rec.data.bgColor == a.color) return ch.done();
		v.assets.cmyk.a('update',{bgColor:a.color},ch);
	}).ch(cb.done).fail(v.branch.err);
};

me.a_saveFilename = function(a,cb){
	var v = a.view;
	var vals = v.a('vals');
	v.branch.alert.a('hide');
	jn.ch(function(d,ch){ //backdrop, change on both logos in spot
		if (!v.assets.rgb) return ch.done();
		v.assets.rgb.a('setCustomFilename',{customFilename:vals.customFilename},ch);
	}).ch(function(d,ch){
		if (!v.assets.cmyk) return ch.done();
		v.assets.cmyk.a('setCustomFilename',{customFilename:vals.customFilename},ch);
	}).ch(function(d,ch){
		v.branch.alert.a('show',{type:'success',message:'Filename saved!'},ch);
	}).ch(cb.done).fail(v.branch.err);
};


me.hexExp = new RegExp('^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$');
me.a_checkColor = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	if (a.color.substr(0,1) != '#'){
		a.color = '#'+a.color;
	}
	if (!a.color.match(me.hexExp)){
		b.err('color not recognized');
		return false;
	}
	return a.color;
};

me.a_rgb = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	var rgb = v.assets.rgb;

	var src = jn.config.cdn+'img?id='+rgb.id;
	v.$el.find('[prop="imgRgb"]').attr({src:src});
	v.a('buildAsset',{asset:rgb},cb);
};

me.a_cmyk = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	var cmyk = v.assets.cmyk;

	var src = jn.config.cdn+'img?id='+cmyk.id;
	v.$el.find('[prop="imgCmyk"]').attr({src:src});
	if (!v.assets.rgb) return v.a('buildAsset',{asset:cmyk},cb);
	cb.done();
};

me.a_logo = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	var logo = v.assets.logo;
	v.a('buildAsset',{asset:logo},cb);
};

me.a_buildAsset = function(a,cb){
	var v = a.view;
	var logo = a.asset;
	if (!logo.rec) return cb.done();
	//var src = 'img?id='+logo.id;
	//v.$el.find('[prop="imgCs"]').attr({src:src});
	var color = (logo.rec.data && logo.rec.data.bgColor)? logo.rec.data.bgColor: '#f9f9f9';

	var colorHex = color;
	if (colorHex.substring(0, 1) == '#') { 
		colorHex = colorHex.substring(1);
	}

	v.$el.find('[area="bgColor"]').css({'background-color':color});
	v.$el.removeClass('white black').addClass(getContrastYIQ(colorHex));
	v.a('set',logo.rec,{bgColor:color});

	if (!logo.rec.customFilename && logo.rec.filename){
		var prefix = logo.rec.filename.replace(/\.[a-zA-Z]{1,5}$/,'');
		v.a('set',{customFilename:prefix});
	}	

	if (logo.rec.data && logo.rec.data.bgColor){
		v.$el.find('[area="swatch"]').css({
			'background-color':logo.rec.data.bgColor
		});
	}

	var size = me.downloadSizes[me.defaultSize];
	var w,h;
	v.propWH = logo.rec.data.propWH;
	if (logo.rec.data.propWH >= 1){
		w = size;
		h = Math.round(size/logo.rec.data.propWH);
	}
	else {
		h = size;
		w = Math.round(size*logo.rec.data.propWH);
	}
	if (w){
		v.a('set',{w:w,h:h});
	}
	cb.done();
};

me.a_format = function(a,cb){
	var v = a.view;
	a.$btn.siblings('.active').removeClass('active');
	a.$btn.addClass('active');
	var format = a.$btn.attr('format');
	if (format == 'png' || format == 'jpg'){
		v.$size.show();
	}
	else {
		v.$size.hide();
	}
	v.a('embed');
};

me.a_display = function(a, cb){
	var v = a.view;
	v.$el.show();

	var scrollOffset = 43;
	var wh = $(window).height(),
		//childHeight = a.$child.height(),
		$scrollDiv = v.$el.find('.scroll-hldr'),
		mh = v.$el.height();

   	if ( mh >= wh ) {
   		$scrollDiv.height(wh - scrollOffset);
    }
	
	$scrollDiv.mCustomScrollbar('disable', true);
	$scrollDiv.mCustomScrollbar({
		theme: 'dark',
		autoHideScrollbar: false,
		//mouseWheel:false,
		contentTouchScroll:false,
		scrollInertia: 20,
		advanced:{
			updateOnContentResize: true,
			autoScrollOnFocus:false
		}
	});

	v.branch.win.a('touch');

	//jn.log('zclip:',v.$el.find('[zclip]').zclip);
	ZeroClipboard.config({swfPath:'flash/zeroClipboard.swf'});
	var zero = new ZeroClipboard(v.$el.find('[zclip]'));
	jn.log('zero:',zero);
	zero.on('aftercopy',function(e){
		v.branch.alert.a('show',{
			message:'Copied to clipboard',
			type:'success',
			hideAfter:1000
		})
    	//jn.log('Copied text to clipboard: '+e.data['text/plain']);
  	});
	zero.on('copy',function(e){
		//
		var val = v.$el.find('[prop="embed"]').val();
		jn.log('copy:',val);
		e.clipboardData.setData('text/plain',val);
	});

	cb.done();
};

var changeView = function( typeOfShift ){
	var shiftPanes = $('[data-pane="shift"]');
	var fadePanes = $('[data-pane="fade"]');

	if ( typeOfShift === 'settings' ){
		shiftPanes.addClass('shift-left');
		fadePanes.addClass('fade-on');
	}
	else if ( typeOfShift === 'back' || typeOfShift === 'reset' ){
		shiftPanes.removeClass('shift-left');
		fadePanes.removeClass('fade-on');
	}
};

var setBackgroundColor = function( colorVal, elementToChange ){
	var colorVal = colorVal.replace(/#/g, '');

	if ( colorVal.indexOf('rgb') != -1 ){
		elementToChange.css('background', colorVal);
	} 
	else {
		elementToChange.css('background', '#' + colorVal);
	}
};


me.a_colorspaces = function(a,cb){
	var v = a.view;

	var $rgb = v.$el.find('[colorspace="rgb"]');
	var $cmyk = v.$el.find('[colorspace="cmyk"]');

	jn.ch(function(d,ch){ //init
		$('body').addClass('dropDisabled');
		
		if (v.spot.rgb){ //show rgb colorspace, hide form
			$rgb.children('[area="isLogo"]').show();
			$rgb.children('[area="noLogo"]').hide();
			var src = 'img?id='+v.spot.rgb;
			$rgb.find('[prop="img"]').attr('src',src);
		}
		else {
			$rgb.children('[area="isLogo"]').hide();
			$rgb.children('[area="noLogo"]').show();
		}
		if (v.spot.cmyk){ //show cmyk colorspace, hide form
			$cmyk.children('[area="isLogo"]').show();
			$cmyk.children('[area="noLogo"]').hide();
			var src = 'img?id='+v.spot.cmyk;
			$cmyk.find('[prop="img"]').attr('src',src);
		}
		else {
			$cmyk.children('[area="isLogo"]').hide();
			$cmyk.children('[area="noLogo"]').show();
		}
		ch.done();
	}).ch(function(d,ch){
		if (v.spot.rgb && v.assets.rgb){
			v.a('setUpload',{colorspace:'rgb',action:'replace'},ch);
			return ch.done();
		} 
		v.a('setUpload',{colorspace:'rgb',action:'upload'},ch);
	}).ch(function(d,ch){
		if (v.spot.cmyk && v.assets.cmyk){
			v.a('setUpload',{colorspace:'cmyk',action:'replace'},ch);
			return ch.done();
		}
		v.a('setUpload',{colorspace:'cmyk',action:'upload'},ch);
	}).cb(cb);
};

/*
a_setUpload
	---a---
	colorspace
	action
*/
me.a_setUpload = function(a,cb){
	var v = a.view;
	var $cs = v.$el.find('[colorspace="'+a.colorspace+'"]');
	var $upload = $cs.find('.upload');
	var $uploadForm = $cs.find('.uploadForm');
	var $loader = $cs.find('.loading-ani span');

	var vData = {};
	if (a.action == 'upload'){
		var path = 'comm/?obj='+jn.web.packObj({
			path:'ent/m/'+v.branch.page._path,
			pos:v.pos,
			colorspace:a.colorspace,
			a:'upload',
			reqId:jn.comm.reqId()
		});
		vData = {cs:a.colorspace};
	}
	else if (a.action == 'replace'){
		var path = 'comm/?obj='+jn.web.packObj({
			path:'ent/m/'+v.assets[a.colorspace]._path,
			a:'replace',
			reqId:jn.comm.reqId()
		});
		vData = {replace:v.assets[a.colorspace].id};
		jn.log('replace path:',path);
	}
	jn.log('vData:',vData);
	jn.v('upload',vData).a('drop',{
		$drop:$cs.find('[area="drop"]'),
		$form:$cs.find('form'),
		path:path
	},{
		submit:function(res,resCb){
			if (!res.files || res.files.length < 1) return 'no file chosen';
			var file = res.files[0];
			if (!file.name) return 'no file name';
			//get file extension
			var ext = jn.m.assets.getExt(file.name);
			if (ext != 'eps') return v.branch.err('file type must be .eps');
			$upload.addClass('upload-in-progress');
			$uploadForm.addClass('spinner');
			$loader.css({width:'0%'});
			return false;
		},
		progress:function(res){
			var w = (Number(res.done)/Number(res.total))*100;
			//jn.log('progress:',w);
			$loader.css({width:w+'%'});
		},
		complete:function(res){
			$upload.removeClass('upload-in-progress');
			$uploadForm.removeClass('spinner');
			$cs.find('input[type="file"]').val('');
			jn.log('upload complete res:',res,a.action);
			if (a.action == 'replace'){
				jn.log('refresh page');

				/*
				Set the cdn reference to blank - This ensures that all requests for this page will come direct from the server to
				fix any asynch issues where the logo has not been fully purged
				*/
				jn.config.cdn = '';
				v.a('page',{replace:true});
			}
		},
		error:function(res){
			jn.log('upload fail:',res);
			$upload.removeClass('upload-in-progress');
			$uploadForm.removeClass('spinner');
			$loader.css({width:'0%'});

			if (res == 'raster in vector' || (res.res && res.res == 'raster in vector')){
				res = 'This vector file has raster images in it. Remove the images and try again. <a href="http://blog.brandisty.com/why-your-brand-needs-a-vector-logo/" rel="external">Learn why.</a>';
			}
			v.branch.err(res);
		}
	});

	cb.done();
};

me.a_buildCats = function(a,cb){
	var v = a.view;
	v.activeCat = v.pos.split('.')[1]; //get active category from pos
	jn.log('active cat:',v.activeCat);
	//loop through logo categories
	var parts = v.branch.page.rec.parts;
	if (!me.$tpl) me.$tpl = v.$el.find('[tpl="cat"]').detach();
	v.$el.find('[tpl="cat"]').remove();
	var $container = v.$el.find('[container="cat"]');
	var $addCat = v.$el.find('[btn="addCat"]');
	var cats = [];
	if (a.custom){ //custom category defined
		var $cat = me.$tpl.clone();
		$cat.addClass('active');
		$cat.find('[prop="category"]').html(a.custom);
		$cat.data('cat',{category:a.custom,descip:''});
		$addCat.before($cat);
	}
	if (v.assets.logo) var logos = parts.assets;
	else var logos = parts.logos;
	for (var i=0,len=logos.length;i<len;i++){
		if (v.assets.logo) var cat = parts.assets[i];
		else var cat = logos[i];
		if (cat){
			var $cat = me.$tpl.clone();
			if (v.activeCat == i && !a.custom){
				v.curCat = cat.category;
				$cat.addClass('active');
			}
			$cat.find('[prop="category"]').html(cat.category);
			if (cat.assets.length > 0){
				$cat.find('[prop="glyph"]').hide();
				var imgId = cat.assets[0].rgb || cat.assets[0].cmyk || cat.assets[0].id;
				var src = 'img?id='+imgId;
				$cat.find('[prop="img"]').show().attr('src',src);
			}
			$cat.data('cat',cat);
			$addCat.before($cat);
			cats.push(cat.category.toLowerCase());
		}
	}
	if (v.assets.logo) return cb.done();
	for (var i=0,len=me.defaultCats.length;i<len;i++){
		var cat = me.defaultCats[i];
		if (cats.indexOf(cat.category.toLowerCase()) === -1){ //default cat not populated
			var $cat = me.$tpl.clone();
			$cat.data('cat',cat);
			$cat.find('[prop="category"]').html(cat.category);
			$cat.find('[prop="glyph"]').html(cat.glyph);
			$addCat.before($cat);
		}
	}
	cb.done();
};

me.a_catSelect = function(a,cb){
	var v = a.view;
	a.$btn.siblings('.active').removeClass('active');
	a.$btn.addClass('active');
};

me.a_addCat = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('hide');
	b.overlay.child('o_catAdd').a('show',{prev:a.view});
};

me.a_buildColors = function(a,cb){
	var v = a.view;
	//loop through colors and build
	var parts = v.branch.page.rec.parts;
	if (!me.$colorTpl) me.$colorTpl = v.$el.find('[tpl="color"]').detach();
	v.$el.find('[tpl="color"]').remove();
	var $container = v.$el.find('[container="color"]');
	if (!parts.colors){
		$container.hide();
		return cb.done();
	}

	var colors = [];
	for (var i=0,len=parts.colors.length;i<len;i++){
		var cat = parts.colors[i];
		if (cat && cat.assets){
			for (var j=0,lenJ=cat.assets.length;j<lenJ;j++){
				colors.push(cat.assets[j].id);
			}
		}
	}

	jn.loop({ary:colors},{
		loop:function(loop){
			var colorId = colors[loop.i];
			var color = jn.m('assets',{id:colorId});
			jn.ch(function(d,ch){
				color.a('get',ch);
			}).ch(function(d,ch){
				if (!color.rec || !color.rec.data || !color.rec.data.hex) return loop.next();
				var $color = me.$colorTpl.clone();
				$color.css({'background-color':color.rec.data.hex});
				$color.data({color:color.rec.data.hex});
				$container.append($color);
				ch.done();
			}).ch(loop.next).fail(cb.fail);
		},
		done:cb.done
	});
};

me.a_bgColor = function(a,cb){
	var v = a.view;
	var color = a.$btn.data('color');
	v.a('set',{bgColor:color});
	
	v.a('saveColor');
	//v.$el.find('[area="bgColor"]').css({'background-color':color});

};

me.a_download = function(a,cb){
	var v = a.view;
	var vals = a.view.a('vals');

	//get asset id
	var $format = v.$el.find('[format].active');
	var path = 'downloadAsset?id='+v.branch.page.id;
	var format = $format.attr('format');
	jn.ch(function(d,ch){ //get asset id
		if (format == 'png' || format == 'jpg'){
			var assetId = v.spot.rgb || v.spot.cmyk || v.spot.id;
		}
		else if (format == 'pdf') var assetId = v.spot.cmyk || v.spot.rgb || v.spot.id;
		else if (format == 'eps'){
			var colorspace = $format.attr('colorspace');
			if (colorspace == 'none') var assetId = v.spot.id;
			else var assetId = v.spot[colorspace];
		}
		else return ch.fail('no format defined');
		if (!assetId) return ch.fail('no asset id');
		path += '&assetId='+assetId+'&format='+format;

		if (assetId == v.spot.rgb) path += '&colorspace=rgb';
		if (assetId == v.spot.cmyk) path += '&colorspace=cmyk';
		
		ch.done();
	}).ch(function(d,ch){ //size
		if (format == 'png' || format == 'jpg'){
			if (vals.w) path += '&w='+vals.w;
			if (vals.h) path += '&h='+vals.h;
			return ch.done();
		}
		ch.done();
	}).ch(function(d,ch){
		jn.log('download path:',path);
		window.location = path;
		ch.done();
	}).ch(cb.done).fail(v.branch.err);
};

me.a_embed = function(a,cb){
	var v = a.view;
	var vals = a.view.a('vals');
	var $format = v.$el.find('[format].active');
	var format = $format.attr('format');
	var path = jn.config.cdn;
	jn.ch(function(d,ch){ //get asset id
		if (format == 'png' || format == 'jpg') var assetId = v.spot.rgb || v.spot.cmyk || v.spot.id;
		else if (format == 'pdf') var assetId = v.spot.cmyk || v.spot.rgb || v.spot.id;
		else if (format == 'eps'){
			var colorspace = $format.attr('colorspace');
			if (colorspace == 'none') var assetId = v.spot.id;
			else var assetId = v.spot[colorspace];
		}
		else return ch.fail('no format defined');
		if (!assetId) return cb.done();
		if (format == 'png' || format == 'jpg') path += 'img?id='+assetId;
		else path += 'downloadAsset?id='+v.branch.page.id+'&assetId='+assetId;
		path += '&format='+format;
		ch.done();
	}).ch(function(d,ch){ //size
		if (format == 'png' || format == 'jpg'){
			if (vals.w) path += '&w='+vals.w;
			if (vals.h) path += '&h='+vals.h;
			return ch.done();
		}
		ch.done();
	}).ch(function(d,ch){
		v.a('set',{embed:path});
		ch.done();
	}).ch(cb.done).fail(v.branch.err);
};

me.a_prev = function(a,cb){
	var v = a.view;
	var pos = v.branch.page.a('search',{spot:v.spot});
	if (!pos) return cb.fail('no pos found');

	var posAry = pos.split('.');
	if (posAry.length < 3) return cb.fail('pos not complete');
	var part = posAry[0];
	var catInd = posAry[1];
	var assetInd = posAry[3];
	var catI = catInd;
	
	var spot;
	if (v.spot._gr){
		while (catI >= 0 && !spot){
			var cat = v.branch.page.rec.parts[part][catI];
			for (var i=0,len=cat.assets.length;i<len;i++){ //look in same cat
				var sp = cat.assets[i];
				if (sp._gr && v.spot._gr && ((sp._gr.x < v.spot._gr.x && sp._gr.y == v.spot._gr.y) || (sp._gr.y < v.spot._gr.y) || (catI < catInd)) && 
					(!spot || ((sp._gr.x > spot._gr.x && sp._gr.y == spot._gr.y) || (sp._gr.y > spot._gr.y)))
					){
					spot = sp;
				}
			}
			catI--;
		}
		if (spot){
			var newPos = v.branch.page.a('search',{spot:spot});
			jn.ch(function(d,ch){
				v.a('hide',ch);
			}).ch(function(d,ch){
				v.branch.overlay.child('o_logoOverlay').a('show',{spot:spot,pos:newPos},ch);
			}).cb(cb);
		}
	}

};

me.a_next = function(a,cb){
	var v = a.view;
	var pos = v.branch.page.a('search',{spot:v.spot});
	if (!pos) return cb.fail('no pos found');

	var posAry = pos.split('.');
	if (posAry.length < 3) return cb.fail('pos not complete');
	var part = posAry[0];
	var catInd = posAry[1];
	var assetInd = posAry[3];
	var catI = catInd;

	var spot;
	if (v.spot._gr){
		while (catI < v.branch.page.rec.parts[part].length && !spot){
			var cat = v.branch.page.rec.parts[part][catI];
			for (var i=0,len=cat.assets.length;i<len;i++){
				var sp = cat.assets[i];
				if (sp._gr && v.spot._gr && ((sp._gr.x > v.spot._gr.x && sp._gr.y == v.spot._gr.y) || (sp._gr.y > v.spot._gr.y) || (catI > catInd)) && 
					(!spot || ((sp._gr.x < spot._gr.x && sp._gr.y == spot._gr.y) || (sp._gr.y < spot._gr.y)))
					){
					spot = sp;
				}
			}
			catI++;
		}
		if (spot){
			jn.log('new pos:',newPos);
			var newPos = v.branch.page.a('search',{spot:spot});
			jn.ch(function(d,ch){
				v.a('hide',ch);
			}).ch(function(d,ch){
				v.branch.overlay.child('o_logoOverlay').a('show',{spot:spot,pos:newPos},ch);
			}).cb(cb);
		}
	}
};

me.a_initControls = function(a,cb){
	var v = a.view;
	var v = a.view;
	var pos = v.branch.page.a('search',{spot:v.spot});
	if (!pos) return cb.fail('no pos found');

	var posAry = pos.split('.');
	if (posAry.length < 3) return cb.fail('pos not complete');
	var part = posAry[0];
	var catInd = posAry[1];
	var assetInd = posAry[3];
	var catI = catInd;
	var $next = v.$el.find('[btn="next"]');
	var $prev = v.$el.find('[btn="prev"]');

	$('body').on('keyup',function(e){
		if (!v.enableKeys) return;
		jn.log('keyup:',e.keyCode);
		if (e.keyCode == 39){
			v.a('next');
		}
		else if (e.keyCode == 37){
			v.a('prev');
		}
		else if (e.keyCode == 27){
			v.branch.overlay.a('hide');
		}
	});

	if (!v.spot._gr){
		//hide next and prev
		$next.css({visibility:'hidden'});
		$prev.css({visibility:'hidden'});
		return;
	}

	var spot;
	while (catI < v.branch.page.rec.parts[part].length && !spot){
		var cat = v.branch.page.rec.parts[part][catI];
		for (var i=0,len=cat.assets.length;i<len;i++){
			var sp = cat.assets[i];
			if (sp._gr && v.spot._gr && ((sp._gr.x > v.spot._gr.x && sp._gr.y == v.spot._gr.y) || (sp._gr.y > v.spot._gr.y) || (catI > catInd)) && 
				(!spot || ((sp._gr.x < spot._gr.x && sp._gr.y == spot._gr.y) || (sp._gr.y < spot._gr.y)))
				){
				spot = sp;
			}
		}
		catI++;
	}
	if (spot) $next.css({visibility:'visible'});
	else $next.css({visibility:'hidden'});

	catI = catInd;
	spot = undefined;
	while (catI >= 0 && !spot){
		var cat = v.branch.page.rec.parts[part][catI];
		for (var i=0,len=cat.assets.length;i<len;i++){ //look in same cat
			var sp = cat.assets[i];
			if (sp._gr && v.spot._gr && ((sp._gr.x < v.spot._gr.x && sp._gr.y == v.spot._gr.y) || (sp._gr.y < v.spot._gr.y) || (catI < catInd)) && 
				(!spot || ((sp._gr.x > spot._gr.x && sp._gr.y == spot._gr.y) || (sp._gr.y > spot._gr.y)))
				){
				spot = sp;
			}
		}
		catI--;
	}
	if (spot) $prev.css({visibility:'visible'});
	else $prev.css({visibility:'hidden'});
};

me.a_removeRgb = function(a,cb){
	var v = a.view;
	v.a('hide');
	v.branch.overlay.child('o_logoColorspaceRemove').a('show',{prev:v,pos:v.pos,colorspace:'rgb'});
};

me.a_removeCmyk = function(a,cb){
	var v = a.view;
	v.a('hide');
	v.branch.overlay.child('o_logoColorspaceRemove').a('show',{prev:v,pos:v.pos,colorspace:'cmyk'});
};

me.a_removeLogo = function(a,cb){
	var v = a.view;
	v.a('hide');
	v.branch.overlay.child('o_logoRemove').a('show',{prev:v,spot:v.spot,pos:v.pos});
};

me.a_replaceRgb = function(a,cb){
	var v = a.view;
	v.$el.find('[colorspace="rgb"] [area="noLogo"]').show();
	v.$el.find('[colorspace="rgb"] [area="isLogo"]').hide();
};
me.a_replaceCmyk = function(a,cb){
	var v = a.view;
	v.$el.find('[colorspace="cmyk"] [area="noLogo"]').show();
	v.$el.find('[colorspace="cmyk"] [area="isLogo"]').hide();
};
me.a_hide = function(a,cb){
	var v = a.view;
	v.branch.alert.a('hide');
	$('body').removeClass('dropDisabled');
	$('body').off('keyup');
	v.$el.find('.scroll-hldr').mCustomScrollbar('destroy');
	v.a('hide',{root:true},cb);
};


return module.exports(j,cb);};require.store["web/views/categories/logos/overlays/o_logoRemove.js"]=function(j,cb){var module = {};var vp = 'o_logoRemove', jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v[vp] = me;
	cb.done();
};

/*
a_bind (fun):
	---a---
	prevView
*/
me.a_bind = function(a,cb){
	var v = a.view;
	v.a('btn');
	v.spot = a.spot;
	v.prev = a.prev;
	v.pos = a.pos;
	jn.log('pos:',v.pos);
	cb.done();
};

me.a_display = function(a, cb) {
	var v = a.view;
	v.$el.show();
	var h = v.$el.outerHeight();
	v.$el.css('margin-top', -(h/2));
	cb.done();
};

me.a_cancel = function(a,cb){
	var v = a.view;
	//close this overlay and show prev
	v.a('hide');
	v.prev.a('show');
};

me.a_remove = function(a,cb){
	var v = a.view;

	jn.ch(function(d,ch){
		//remove spot from page
		v.branch.page.a('removeSpot',{pos:v.pos},ch);
	}).ch(function(d,ch){
		v.branch.overlay.a('hide');
		cb.done();
	}).fail(v.branch.err);
};
return module.exports(j,cb);};require.store["web/views/categories/logos/p_b_logoCat.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.p_b_logoCat = me;
	cb.done();
};

/*
a_build (fun):
	---a---
	pos (str): the position of the category
	cat (obj): the category object
*/
me.a_build = function(a,cb){
	var v = a.view, b = v.a('branch'), $el = v.$el;
	var part = 'logos';
	$el.attr('pos',v.pos);
	v.a('set',a.cat);
	v.cat = a.cat;
	v.a('access',{access:b.access});

	v.$catH2 = v.$el.find('h2[prop="category"]');
	v.$catH2.show();
	v.$catField = v.$el.find('input[prop="category"]');
	v.$catField.hide();

	v.$moveUp = v.$el.find('[btn="moveUp"]');
	v.$moveDown = v.$el.find('[btn="moveDown"]');
	if (a.ind !== undefined && a.len !== undefined){
		if (a.ind == 0) v.$moveUp.hide();
		else v.$moveUp.show();
		if (a.ind >= a.len - 1) v.$moveDown.hide();
		else v.$moveDown.show();
	}

	//jn.log('access',b.access);
	if (!a.cat.assets) return cb.done();
	if (!v.shown) v.shown = [];
	jn.ch(function(d,ch){ //init grid
		if (b.grid) return ch.done();
		var $container = $el.find('ul');
		b.grid = v.child('grid');
		var noResize = (!b.isAccess('team'))? true: false;
		b.grid.a('init',{$container:$container,group:part,noResize:noResize,
			update:function(childs){
				b.page.a('update',{parts:b.page.rec.parts});
			},
			jump:function(jump){
				jn.log('jump:',jump);
				if (!jump.group) return;
				var groupPos = jump.group.parent.pos;
				var gCat = b.page.a('getPos',{pos:groupPos});;
				var elemPos = jump.elem.pos;
				var spot = b.page.a('getPos',{pos:elemPos});
				b.page.a('moveIntoCat',{part:part,spot:spot,cat:gCat});
			}
		},ch);
	}).ch(function(d,ch){ //check for views to hide
		if (v.shown.length < 1 || v.shown.length <= a.cat.assets.length) return ch.done();
		var hideI = a.cat.assets.length - 1;
		//jn.log('hide:',v.shown.length,a.cat.assets.length);
		jn.loop({ary:v.shown,i:hideI},{
			loop:function(loop){
				//jn.log('hide:',hideI);
				if (v.shown[loop.i]) v.shown[loop.i].a('hide',{
					fail:ch.fail,
					done:loop.next
				});
				else loop.next();
			},
			done:ch.done
		});
	}).ch(function(d,ch){ //show views
		v.shown = [];
		jn.loop({ary:a.cat.assets},{
			loop:function(loop){
				var spot = a.cat.assets[loop.i];
				var pos = v.pos+'.assets.'+loop.i;
				var row = v.child('p_b_logoRow',{pos:pos});
				v.shown.push(row);
				row.a('show',{spot:spot,rebind:true},{
					fail:ch.fail,
					done:loop.next
				});
			},
			done:ch.done
		});
	}).ch(function(d,ch){
		var $descrip = $el.find('textarea[prop="descrip"]');
		$descrip.autosize();
		$el.on('blur','textarea[prop="descrip"]',function(e){
			//console.log('blur');
			var descrip = $descrip.val();
			b.page.a('catDescrip',{descrip:descrip,pos:v.pos});
		});
		$el.on('keyup','textarea[prop="descrip"]',function(e){
			if(e.keyCode == 9){ //tab
				$(this).blur();
				return false;	
			}
		});

		$el.on('blur','input[prop="category"]',function(e){
			//console.log('blur');
			v.a('saveCategory');
		});
		$el.on('keyup','input[prop="category"]',function(e){
			if(e.keyCode == 9 || e.keyCode == 13){ //tab
				$(this).blur();
				return false;	
			}
		});
		ch.done();
	}).ch(cb.done).fail(b.err);
};

me.a_hide = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	var $descrip = $el.find('textarea[prop="descrip"]');
	$descrip.trigger('autosize.destroy');

	if (b.grid){
		b.grid.a('destroy');
		delete b.grid;
	}

	a.view.a('hide',{root:true},cb);
};

me.a_bind = function(a,cb){
	var v = a.view;
	v.a('btn');
	cb.done();
};

me.a_moveUp = function(a,cb){
	var v = a.view;
	jn.ch(function(d,ch){
		v.branch.page.a('moveCategory',{pos:v.pos,part:'logos',move:'up'},ch);
	}).cb(cb);
};

me.a_moveDown = function(a,cb){
	var v = a.view;
	jn.ch(function(d,ch){
		v.branch.page.a('moveCategory',{pos:v.pos,part:'logos',move:'down'},ch);
	}).cb(cb);
};

me.a_editCategory = function(a,cb){
	var v = a.view;
	v.$catH2.hide();
	v.$catField.show().focus();
};

me.a_saveCategory = function(a,cb){
	var v = a.view;
	var vals = v.a('vals');
	if (vals.category == v.cat.category){
		v.$catH2.show();
		v.$catField.hide();
		return;
	}

	jn.ch(function(d,ch){
		if (!vals.category) return ch.fail('no category entered');
		v.branch.page.a('saveCategory',{pos:v.pos,category:vals.category},ch);
	}).fail(v.branch.err).cb(cb);
};

return module.exports(j,cb);};require.store["web/views/categories/logos/p_b_logoRow.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.p_b_logoRow = me;
	cb.done();
};

me.a_build = function(a,cb){
	var v = a.view, b = v.a('branch'), $el = v.$el;

	$el.attr({pos:v.pos,path:v._path});
	cb.done();
};

me.a_bind = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;

	var assetChanged = false;
	if (!a.spot || !v.spot || a.spot.rgb != v.spot.rgb || a.spot.cmyk != v.spot.cmyk){ 
		//delete v._gr;
		assetChanged = true;
	}
	v.a('btn');
	v.a('access',{access:b.access});

	var gridChanged = false;
	if (!a.spot || !v._gr || !jn.compare(a.spot._gr,v._gr)){
		gridChanged = true;
	}

	v.spot = a.spot;
	//jn.log('changed:',assetChanged,gridChanged);
	jn.ch(function(d,ch){
		if (!assetChanged) return ch.done();
		v.assets = {};
		if (!v.spot.rgb) return ch.done(); //get rgb asset rec
		v.assets.rgb = jn.m('assets',{id:v.spot.rgb});
		v.a('model',{model:v.assets.rgb,
			rec:function(){
				v.a('rgb');
			}
		},ch);
	}).ch(function(d,ch){
		if (!v.spot.cmyk) return ch.done(); //get cmyk asset rec
		v.assets.cmyk = jn.m('assets',{id:v.spot.cmyk});
		v.a('model',{model:v.assets.cmyk,
			rec:function(){
				v.a('cmyk');
			}
		},ch);
	}).ch(function(d,ch){
		if (!gridChanged) return ch.done();
		//if ((!v.assets.rgb || !v.assets.rgb.rec) && (!v.assets.cmyk || !v.assets.cmyk.rec)){
			//v.a('hide');
			//return cb.done();
			//return ch.fail('no rec found for logo');
		//}
		//jn.log('changed _gr:',v._gr,a.spot._gr);
		v._gr = a.spot._gr;
		b.grid.a('add',{add:v,
			update:function(dim){
				var spot = b.page.a('getPos',{pos:v.pos});
				spot._gr = dim;
				//jn.log('update:',dim,spot._gr);
		        return false;
			}
		},ch);
	}).ch(cb.done).fail(function(res){
		jn.log('logo row err:',res);
		v.a('hide');
	});
};

me.a_rgb = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	var rgb = v.assets.rgb;
	var rec = rgb.rec;

	var src = jn.config.cdn+'img?id='+rgb.id;
	$el.find('[prop="img"]').css({'background-image':'url('+src+')'});
	var color = (rec.data && rec.data.bgColor)? rec.data.bgColor: '#f9f9f9';

	var colorHex = color;
	if (colorHex.substring(0, 1) == '#') { 
	  colorHex = colorHex.substring(1);
	}
	$el.find('[prop="bgFill"]').css({'background-color':color});
	$el.removeClass('white black').addClass(getContrastYIQ(colorHex));
	a.view.a('set',rgb.rec);


	if ((!rec.data.dim || !rec.data.propWH) && !v.gotRgbData){
		rgb.a('getData');
		v.gotRgbData = true;
		return;
	}

	var dim = rec.data.dim;
	jn.log('dim:',dim);
	var downloadSizes = [{label:'Large',size:1200},{label:'Medium',size:600},{label:'Small',size:300}];
	v.$el.find('[btn="downloadQuick"]:not([tpl])').remove();
	var $tpl = v.$el.find('[tpl="downloadQuick"]');
	var $insert = v.$el.find('[area="downloadQuick"]');
	$tpl.hide();
	for (var i=0,len=downloadSizes.length;i<len;i++){
		var size = downloadSizes[i].size;
		var label = downloadSizes[i].label;

		var w,h;
		if (rec.data.propWH >= 1){
			w = size;
			h = Math.round(size/rec.data.propWH);
		}
		else {
			h = size;
			w = Math.round(size*rec.data.propWH);
		}
		if (w){
			var $dl = $tpl.clone();
			$dl.removeAttr('tpl');
			$dl.attr({w:w,h:h});
			$dl.find('[prop="label"]').html(label);
			$dl.find('[prop="size"]').html(w+'x'+h+'.png');
			$dl.show();
			$insert.before($dl);
		}
	}
};

me.a_cmyk = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	var cmyk = v.assets.cmyk;

	if (!v.assets.rgb){
		var rec = cmyk.rec;
		var src = jn.config.cdn+'img?id='+cmyk.id;
		$el.find('[prop="img"]').css({'background-image':'url('+src+')'});
		var color = (cmyk.rec.data && cmyk.rec.data.bgColor)? cmyk.rec.data.bgColor: '#f8f8f8';

		var colorHex = color;
		if (colorHex.substring(0, 1) == '#') { 
		  colorHex = colorHex.substring(1);
		}

		$el.find('[prop="bgFill"]').css({'background-color':color});
		$el.removeClass('white black').addClass(getContrastYIQ(colorHex));
		a.view.a('set',cmyk.rec);

		if ((!rec.data.dim || !rec.data.propWH) && !v.gotCmykData){
			cmyk.a('getData');
			v.gotCmykData = true;
			return;
		}

		var dim = rec.data.dim;
		var downloadSizes = [{label:'Large',size:1200},{label:'Medium',size:600},{label:'Small',size:300}];
		v.$el.find('[btn="downloadQuick"]:not([tpl])').remove();
		var $tpl = v.$el.find('[tpl="downloadQuick"]');
		var $insert = v.$el.find('[area="downloadQuick"]');
		$tpl.hide();
		for (var i=0,len=downloadSizes.length;i<len;i++){
			var size = downloadSizes[i].size;
			var label = downloadSizes[i].label;

			var w,h;
			if (rec.data.propWH >= 1){
				w = size;
				h = Math.round(size/rec.data.propWH);
			}
			else {
				h = size;
				w = Math.round(size*rec.data.propWH);
			}
			if (w){
				var $dl = $tpl.clone();
				$dl.removeAttr('tpl');
				$dl.attr({w:w,h:h});
				$dl.find('[prop="label"]').html(label);
				$dl.find('[prop="size"]').html(w+'x'+h+'.png');
				$dl.show();
				$insert.before($dl);
			}
		}
	}
};

me.a_hide = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.grid.a('remove',{remove:v});
	delete v._gr;
	delete a.view._grUpdate;
	a.view.a('hide',{root:true},cb);
};

//***** btn *****
me.a_downloadCustom = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_logoDownload').a('show',{pos:v.pos,spot:v.spot});
};

me.a_downloadQuick = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	var assetId = v.spot.rgb || v.spot.cmyk;
	if (!assetId) return ch.fail('no asset defined');
	var files = [{
		w:a.$btn.attr('w'),
		h:a.$btn.attr('h'),
		format:'png'
	}];
	var path = 'downloadAsset?obj='+jn.web.packObj({
		id:b.page.id,
		assetId:assetId,
		files:files
	});
	//jn.log('asset path:',path);
	window.location = path;
};

me.a_logoEdit = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_logoEdit').a('show',{pos:v.pos,spot:v.spot});
};

me.a_logoOverlay = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_logoOverlay').a('show',{pos:v.pos,spot:v.spot});
};
return module.exports(j,cb);};require.store["web/views/categories/logos/p_b_mainLogo.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.p_b_mainLogo = me;
	cb.done();
};

//***** const *****
me.heroMinusH = 500; //subtract this from win h to get hero h
me.navMinusScroll = 50;

me.a_bind = function(a,cb){
	var v = a.view, b = v.a('branch'), $el = v.$el;
	v.a('btn');
	v.a('access',{access:b.access});
	
	v.pos = a.pos;
	var assetChanged = false;
	if (!a.spot || !v.spot || a.spot.rgb != v.spot.rgb || a.spot.cmyk != v.spot.cmyk){ 
		assetChanged = true;
	}
	v.spot = a.spot;

	jn.log('main spot:',v.spot,v.pos);

	jn.ch(function(d,ch){
		if (!assetChanged) return ch.done();
		v.assets = {};
		if (v.spot.rgb){ //get rgb asset rec
			v.assets.rgb = jn.m('assets',{id:v.spot.rgb});
			v.a('model',{model:v.assets.rgb,
				rec:function(){
					v.a('rgb');
				}
			});
		}
		if (v.spot.cmyk){ //get cmyk asset rec
			v.assets.cmyk = jn.m('assets',{id:v.spot.cmyk});
			v.a('model',{model:v.assets.cmyk,
				rec:function(){
					v.a('cmyk');
				}
			});
		}
		ch.done();
	}).ch(function(d,ch){ //window resize
		b.win.a('bind',{
			resize:function(){
				var dim = b.win.a('dim');
				//$el.find('.logo-mark').height(dim.h - me.heroMinusH);
			}
		},ch);
		b.win.a('touch');
	}).ch(cb.done).fail(b.err);
};

me.a_rgb = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	var rgb = v.assets.rgb;
	var rec = rgb.rec;

	var src = jn.config.cdn+'img?id='+rgb.id+'&w=1400&h=1400';
	$el.find('[prop="img"]').css({'background-image':'url('+src+')'});
	var color = (rgb.rec.data && rgb.rec.data.bgColor)? rgb.rec.data.bgColor: '#f8f8f8';
	$el.css({'background-color':color});

	var colorHex = color;
	if (colorHex.substring(0, 1) == '#') { 
	  colorHex = colorHex.substring(1);
	}
	
	$('[area="nav"]').removeClass('white black').addClass(getContrastYIQ(colorHex));
	a.view.a('set',rgb.rec);

	var dim = rec.data.dim;
	jn.log('dim:',dim);
	var downloadSizes = [{label:'Large',size:1200},{label:'Medium',size:600},{label:'Small',size:300}];
	v.$el.find('[btn="downloadQuick"]:not([tpl])').remove();
	var $tpl = v.$el.find('[tpl="downloadQuick"]');
	var $insert = v.$el.find('[area="downloadQuick"]');
	$tpl.hide();
	for (var i=0,len=downloadSizes.length;i<len;i++){
		var size = downloadSizes[i].size;
		var label = downloadSizes[i].label;

		var w,h;
		if (rec.data.propWH >= 1){
			w = size;
			h = Math.round(size/rec.data.propWH);
		}
		else {
			h = size;
			w = Math.round(size*rec.data.propWH);
		}
		if (w){
			var $dl = $tpl.clone();
			$dl.removeAttr('tpl');
			$dl.attr({w:w,h:h});
			$dl.find('[prop="label"]').html(label);
			$dl.find('[prop="size"]').html(w+'x'+h+'.png');
			$dl.show();
			$insert.before($dl);
		}
	}
};

me.a_cmyk = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	var cmyk = v.assets.cmyk;
	var rec = cmyk.rec;

	if (!v.assets.rgb){
		var src = jn.config.cdn+'img?id='+cmyk.id+'&w=800&h=800';
		$el.find('[prop="img"]').css({'background-image':'url('+src+')'});
		var color = (cmyk.rec.data && cmyk.rec.data.bgColor)? cmyk.rec.data.bgColor: '#f8f8f8';
		$el.css({'background-color':color});

		var colorHex = color;
		if (colorHex.substring(0, 1) == '#') { 
		  colorHex = colorHex.substring(1);
		}

		$('[area="nav"]').removeClass('white black').addClass(getContrastYIQ(colorHex));
		a.view.a('set',cmyk.rec);

		var dim = rec.data.dim;
		var downloadSizes = [{label:'Large',size:1200},{label:'Medium',size:600},{label:'Small',size:300}];
		v.$el.find('[btn="downloadQuick"]:not([tpl])').remove();
		var $tpl = v.$el.find('[tpl="downloadQuick"]');
		var $insert = v.$el.find('[area="downloadQuick"]');
		$tpl.hide();
		for (var i=0,len=downloadSizes.length;i<len;i++){
			var size = downloadSizes[i].size;
			var label = downloadSizes[i].label;

			var w,h;
			if (rec.data.propWH >= 1){
				w = size;
				h = Math.round(size/rec.data.propWH);
			}
			else {
				h = size;
				w = Math.round(size*rec.data.propWH);
			}
			if (w){
				var $dl = $tpl.clone();
				$dl.removeAttr('tpl');
				$dl.attr({w:w,h:h});
				$dl.find('[prop="label"]').html(label);
				$dl.find('[prop="size"]').html(w+'x'+h+'.png');
				$dl.show();
				$insert.before($dl);
			}
		}
	}
};

me.a_logoEdit = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_logoEdit').a('show',{pos:v.pos,spot:v.spot});
};

//***** btn *****
me.a_downloadCustom = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_logoDownload').a('show',{pos:v.pos,spot:v.spot});
};

me.a_downloadQuick = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	var assetId = v.spot.rgb || v.spot.cmyk;
	if (!assetId) return ch.fail('no asset defined');
	var files = [{
		w:a.$btn.attr('w'),
		h:a.$btn.attr('h'),
		format:'png'
	}];
	var path = 'downloadAsset?obj='+jn.web.packObj({
		id:b.page.id,
		assetId:assetId,
		files:files
	});
	//jn.log('asset path:',path);
	window.location = path;
};

me.a_shareBrand = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_sharePage').a('show',cb);
};

me.a_logoOverlay = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_logoOverlay').a('show',{pos:v.pos,spot:v.spot});
};

return module.exports(j,cb);};require.store["web/views/left/l_company.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.l_company = me;
	cb.done();
};

me.a_build = function(a,cb){ //build, done once
	var v = a.view;
	if (!v.id) return cb.fail('no id defined');
	v.model = jn.m('company',{id:v.id});
	jn.ch(function(d,ch){
		v.a('model',ch);
	}).ch(function(d,ch){
		v.model.a('getMainPage',ch);
	}).ch(function(d,ch){
		if (!d.page) return ch.done();
		v.page = jn.m('pages',{id:d.page});
		v.a('model',{model:v.page,rec:function(){
			v.a('page');
		}},ch);
	}).ch(cb.done);
};
me.a_rec = function(a,cb){
	var v = a.view;
	if (v.model.rec.companyName) v.a('set',{companyName:v.model.rec.companyName});
};
me.a_bind = function(a,cb){ //bind user events
	var v = a.view;
	v.a('btn');
	cb.done();
};
me.a_page = function(a,cb){
	var v = a.view;
	if (!v.model.rec.companyName) v.a('set',{companyName:v.page.rec.name});
};
me.a_goPage = function(a,cb){
	var v = a.view;
	jn.ch(function(d,ch){ //get company page
		jn.m('pages',{id:v.page.id}).a('getUrl',ch);
	}).ch(function(d,ch){
		return window.location = '/'+d.url;
	}).cb(cb);
};

return module.exports(j,cb);};require.store["web/views/left/l_curCompany.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.l_curCompany = me;
	cb.done();
};

/*
***** bind *****
*/
me.a_bind = function(a,cb){ //bind user events
	var $el = a.view.a('$el'), b = a.view.branch;
	cb.done();
};

/*
***** model binding *****
*/
me.a_build = function(a,cb){ //build, done once
	/*
	var $el = a.view.a('$el'), b = a.view.branch;
	b.company = jn.m('company',{id:a.view.id});

	var tier = b.left.child('l_tier',{level:1});
	tier.a('show');
	jn.log('tier defined:',tier);
	jn.ch(function(d,ch){ //hide other childs
		tier.a('hideChilds',{except:b.page.rec.parent},ch);
	}).ch(function(d,ch){
		if (b.page.rec.parent) tier.child('l_pageChilds',{parentPage:b.page.rec.parent}).a('show',{rebuild:true},ch);
		else tier.child('l_pageChilds').a('show',{company:b.company.id,rebuild:true},ch);
	}).ch(cb.done).fail(b.err);
	
	/*
	jn.ch(function(d,ch){ //get cur page hierarchy relations
		if (b.page.rec.parent){
			b.$back.show();
			var childs = jn.m('pages',{find:{parent:b.page.rec.parent}});
		}
		else {
			var childs = jn.m('pages',{find:{company:b.company.id,parent:{$exists:false}}}); //get base pages of company
		}
		a.view.a('list',{model:childs,list:'l_page'},ch);
	}).cb(cb);
	*/
};
/*
me.a_addBasePage = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	if (b.page.rec.parent) b.overlay.child('o_addPage').a('show',{pageId:b.page.rec.parent});
	else b.overlay.child('o_addPage').a('show');
};
*/return module.exports(j,cb);};require.store["web/views/left/l_otherCompany.js"]=function(j,cb){var module = {};var jn;
var l_otherCompany = module.exports = function(j,cb){
	jn = j;
	jn.v.l_otherCompany = l_otherCompany;
	cb.done();
};
var me = l_otherCompany;

/*
***** bind *****
*/
me.a_bind = function(a,cb){ //bind user events

};

/*
***** model binding *****
*/
me.a_build = function(a,cb){ //build, done once
	var b = a.view.branch;
	//a.view.a('model',{model:b.page},cb);  //attempts to call actions on view (rec) - only works for single rec bound to this view
	//cb.done must be called after rec is retrieved
};

me.a_rec = function(a,cb){ //called on rec update or get
	var b = a.view.branch;
	jn.ch(function(d,ch){ //get cur page hierarchy relations
		var childs = a.m('pages',{find:{parent:b.page.rec.id}},ch); //get childs of this page
		a.view.a('list',{group:childs,list:'l_page'});
	}).cb(cb);
};


return module.exports(j,cb);};require.store["web/views/left/l_ownCompany.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.l_ownCompany = me;
	cb.done();
};

/*
***** bind *****
*/
me.a_bind = function(a,cb){ //bind user events
	cb.done();
};

/*
***** model binding *****
*/
me.a_build = function(a,cb){ //build, done once
	var $el = a.view.a('$el'), b = a.view.branch;
	b.company = jn.m('company',{id:a.view.id});
	jn.ch(function(d,ch){ //get cur page hierarchy relations
		var childs = jn.m('pages',{find:{company:b.company.id,parent:{$exists:false}}},ch); //get childs of this page
		a.view.a('list',{model:childs,list:'l_page'},ch);
	}).cb(cb);
};


return module.exports(j,cb);};require.store["web/views/left/l_page.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.l_page = me;
	cb.done();
};
me.a_build = function(a,cb){ //build, done once
	var v = a.view, b = v.a('branch');

	v.$arrow = v.$el.find('[btn="openSub"]');
	v.$arrow.hide();
	v.model = jn.m('pages',{id:v.id});
	jn.ch(function(d,ch){
		v.a('model',{model:v.model},ch);  //attempts to call actions on view (rec) - only works for single rec bound to this view
	}).ch(cb.done).fail(b.err);
};
me.a_bind = function(a,cb){ //bind user events
	var v = a.view, b = v.branch;

	v.a('btn');

	if (b.page.id == v.id) v.$el.addClass('current');
	if (v.active) v.$el.addClass('active');
	
	cb.done();
};

me.a_openSub = function(a,cb){
	var v = a.view, b = v.branch;
	var nextLevel = b.level+1;
	v.$el.addClass('active').siblings('.active').removeClass('active');
	jn.ch(function(d,ch){
		b.pageNav.a('focusTier',{level:nextLevel});
		ch.done();
	}).ch(function(d,ch){
		b.pageNav.a('popTier',{level:nextLevel,parentPage:v.id},ch);
	}).ch(cb.done).fail(b.err);
};

me.a_rec = function(a,cb){ //called on rec update or get
	var v = a.view, b = v.branch;

	if (v.model.rec.type == 'folder'){
		v.$el.find('.type-brand').removeClass('type-brand');
	}

	var childs = jn.m('pages',{find:{parent:v.id}});
	jn.ch(function(d,ch){
		v.a('set',v.model.rec,ch);
	}).ch(function(d,ch){ //check for page childs
		if (b.access.indexOf('team') !== -1){
			v.$arrow.show();
			return ch.done();
		}
		childs.a('get',{
			fail:ch.fail,
			done:function(){
				if (childs.recs && childs.recs.length > 0) v.$arrow.show();
				ch.done();
			}
		});
	}).cb(cb);
};

me.a_previewChilds = function(a,cb){
	var v = a.view, b = v.branch;
	var nextLevel = b.level+1;
	v.$el.addClass('active').siblings('.active').removeClass('active');
	jn.ch(function(d,ch){
		b.left.a('popTier',{level:nextLevel,parentPage:v.id},ch);
	}).ch(function(d,ch){
		b.left.a('focusTier',{level:nextLevel},ch);
	}).ch(cb.done).fail(b.err);
};

me.a_gotoPage = function(a,cb){
	var v = a.view, b = v.branch;
	if (v.model.rec.type == 'folder'){
		v.a('openSub');
		return;
	}
	jn.ch(function(d,ch){ //get company page
		jn.m('pages',{id:v.model.id}).a('getUrl',ch);
	}).ch(function(d,ch){
		return window.location = '/'+d.url;
	}).cb(cb);
};return module.exports(j,cb);};require.store["web/views/left/l_pageChilds.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.l_pageChilds = me;
	cb.done();
};

/*
a_bind (fun):
	---a---
	rootPage (str): id of page that is the base
*/
me.a_bind = function(a,cb){
	var v = a.view, b = v.a('branch'), $el = v.$el;

	jn.log('page childs parent:',v.parentPage,' company:',v.company,' level:',b.level);

	v.a('btn');
	v.a('access',{access:b.access});

	/*
	if (a.parentPage && a.parentPage == v.parentPage) return cb.done();
	v.parentPage = a.parentPage;
	if (a.company && a.company == v.company) return cb.done();
	v.company = a.company;
	*/

	v.childs = v.childs || []; //store all child references
	v.$back = $el.find('[btn="backTier"]');
	v.$parentName = $el.find('[prop="parentName"]');
	jn.ch(function(d,ch){ //clear all childs
		if (v.childs.length < 1) return ch.done();
		jn.loop({ary:v.childs},{
			loop:function(loop){
				var child = v.childs[loop.i];
				child.a('hide',{
					fail:ch.fail,
					done:loop.next
				});
			},
			done:ch.done
		});
	}).ch(function(d,ch){ //bind to parent page model
		if (!v.parentPage) return ch.done();
		v.model = jn.m('pages',{id:v.parentPage});
		v.a('model',{model:v.model},ch);
	}).ch(function(d,ch){
		if (!a.rootPage) return ch.done();
		v.$back.hide();
		v.$parentName.show();
		v.child('l_page',{id:a.rootPage}).a('show',cb);
	}).ch(function(d,ch){ //show childs
		if (!v.parentPage){
			v.a('str');
			return ch.done();
		}
		v.$back.show();
		v.$parentName.show();
		var childs = jn.m('pages',{find:{parent:v.parentPage},limit:1000}); //get childs of this page
		v.a('list',{model:childs,list:'l_page',
			get:function(){
				if (childs.recs){
					childs.recs = sort(childs.recs);
				}
			},
			add:function(add){
				if (a.childPage && a.childPage == add.id) add.active = true;
				v.childs.push(add);
			}
		},cb);
	}).ch(function(d,ch){
		v.$back.hide();
		//v.$parentName.hide();
		var childs = jn.m('pages',{find:{company:v.company,parent:{$exists:false}},limit:1000}); //get childs of this page
		v.a('list',{model:childs,list:'l_page',
			get:function(){
				if (childs.recs){
					childs.recs = sort(childs.recs);
				}
			},
			add:function(add){
				if (a.childPage && a.childPage == add.id) add.active = true;
				v.childs.push(add);
			}
		},ch);
	}).ch(cb.done).fail(b.err);
};

var sort = function(recs){
	return recs.sort(function(a,b){
		var A = a.name.toLowerCase();
		var B = b.name.toLowerCase();
		if (A < B) return -1;
		else if (A > B) return  1;
		else return 0;
	});
};

me.a_hide = function(a,cb){
	var v = a.view, b = v.branch;
	v.a('hide',{root:true},cb);
};

me.a_display = function(a, cb){
	var v = a.view, b = v.branch;
	v.$el.show();

	var wh = $(window).height(),
		$scrollDiv = v.$el.find('.scroll-hldr'),
		mh = v.$el.height();

    $scrollDiv.css({'max-height': wh-200});
	$scrollDiv.mCustomScrollbar({
		theme: 'dark',
		autoHideScrollbar: true,
		//mouseWheel:false,
		contentTouchScroll:false,
		scrollInertia: 20,
		advanced:{
			updateOnContentResize: true,
			autoScrollOnFocus:false
		}
	});

	cb.done();
};

me.a_rec = function(a,cb){ //parent page rec update
	var v = a.view;
	v.a('set',{parentName:v.model.rec.name});
};

me.a_addPage = function(a,cb){
	var v = a.view;
	if (v.parentPage) v.branch.overlay.child('o_addPage').a('show',{pageId:v.parentPage});
	else v.branch.overlay.child('o_addPage').a('show',{company:v.company});
};

me.a_backTier = function(a,cb){
	var v = a.view, b = v.branch;
	var backLevel = b.level-1;
	//jn.log('back level:',backLevel);
	jn.ch(function(d,ch){
		if (v.model.rec.parent) b.pageNav.a('popTier',{level:backLevel,parentPage:v.model.rec.parent,childPage:v.model.id},ch);
		else b.pageNav.a('popTier',{level:backLevel,company:v.company,childPage:v.model.id},ch);
	}).ch(function(d,ch){
		b.pageNav.a('focusTier',{level:backLevel,back:true},ch);
	}).ch(cb.done).fail(b.err);
};return module.exports(j,cb);};require.store["web/views/left/l_tier.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.l_tier = me;
	cb.done();
};
var tierW = 500;
me.a_build = function(a,cb){
	var v = a.view, b = v.a('branch'), $el = v.$el;
	//jn.log('build tier:',b.win);
	if (v.level !== undefined) b.level = v.level;
	$el.attr({level:b.level});
	if (b.level%2 == 0) $el.addClass('even'); 

	jn.ch(function(d,ch){
		$el.css({
			position:'absolute',
			left:(b.level-1)*tierW+'px'
		});
		b.win.a('bind',{
			resize:function(res){
				v.a('resize');
			}
		});
		b.win.a('touch');
		ch.done();
	}).ch(cb.done).fail(b.err);
};

me.a_bind = function(a,cb){
	var v = a.view, b = v.a('branch'), $el = v.$el;
	/*
	$el.on('mouseenter',function(){
		b.left.a('focusTier',{level:b.level});
	});
	*/
	cb.done();
};

me.a_resize = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	var dim = b.win.a('dim');
	$el.height(dim.h);
};return module.exports(j,cb);};require.store["web/views/left/left.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.left = me;
	cb.done();
};
var time = 300;
var tierW = 300;

/*
a_build (fun):
	---a---
	page
	[access]
	[overlay]
*/
me.a_build = function(a,cb){ //build, done once
	var v = a.view, b = v.a('branch'), $el = v.$el;

	if (a.access) b.access = a.access;
	if (a.overlay) b.overlay = a.overlay;
	if (a.page) b.page = a.page;
	if (!b.page || !b.page.rec || !b.page.rec.company) return cb.fail('no page defined');

	v.$leftBg = $('[area="leftBg"]');
	v.$leftBg.css({left:'300px'});
	v.$leftBtn = $('[btn="leftShow"]');
	v.$move = $('[area="page"],[area="nav"].fixed,≈');

	b.left = v;
	v.company = b.page.rec.company;
	cb.done();
	
	jn.ch(function(d,ch){ //get other companies for this user (is owner), populate main pages from those companies
		if (!b.sessUser) return cb.done(); //if no user logged in exit
		var ownCompanies = jn.m('company',{find:{owners:b.sessUser.id}}); //if sessUser is owner of a company and page company does not match
		a.view.a('list',{model:ownCompanies,list:'l_company'},ch);
	}).ch(function(d,ch){ //get other companies this user is shared on (is on the team)
		var otherCompanies = jn.m('company',{find:{teams:{$elemMatch:{users:{$in:[b.sessUser.id]}}}}}); //if sessUser is in the team for a company and page company does not match
		jn.log('other companies:',otherCompanies);
		a.view.a('list',{model:otherCompanies,list:'l_company'},ch);
	});
};

me.a_bind = function(a,cb){ 
	var v = a.view, b = v.branch, $el = v.$el;
	a.view.a('btn');
	jn.log('access:',b.access);
	a.view.a('access',{access:b.access});
	cb.done();
};

me.a_slideIn = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;

	$el.css('visibility','visible');
	v.$leftBg.show().css({left:'300px'});
	v.$leftBtn.hide();
	v.$move = $('[area="page"], [area="nav"].fixed, [area="noAssets"]');
	v.$move.animate({left:'300px'},time,'easeOutCirc');
	$('body').addClass('site-nav-transition');

	cb.done();
};

me.a_slideOut = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;

	$el.css('visibility','hidden');
	v.$leftBg.hide();
	v.$leftBtn.show();
	v.$move = $('[area="page"], [area="nav"].fixed, [area="noAssets"]');
	v.$move.animate({left:'0px'},time,'easeOutCirc');
	$('body').removeClass('site-nav-transition');

	cb.done();
};

me.a_logout = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;

	jn.m('users').a('logout', {
		done:function(res){
			window.location = '/';
		},
		fail:function(res){
			console.log('logout fail:',res);
		}
	});
};

me.a_accountSettings = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_accountSettings').a('show',cb);
};

me.a_globalTeamMembers = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_globalTeamMembers').a('show',cb);
};

me.a_login = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_login').a('show',cb);
};

me.a_signUp = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	b.overlay.child('o_signUp').a('show',cb);
};



return module.exports(j,cb);};require.store["web/views/left/overlays/o_accountSettings.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_accountSettings = me;
	cb.done();
};

me.a_bind = function(a,cb){ //bind user events here
	var v = a.view;

	v.a('section',{show:'accountSettings'});
	v.$el.find('[tab="accountSettings"]').addClass('active').siblings().removeClass('active');
	v.a('btn');
	jn.log('access:',v.branch.access);
	v.a('access',{access:v.branch.access});

	cb.done();
};

me.a_build = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	var sess = jn.sess(a);
	b.user = sess.user;

	$el.find('[area="grandfather"]').hide();
	jn.ch(function(d,ch){
		a.view.a('model',{model:b.user},ch);
	}).ch(function(d,ch){
		if (!b.page.rec.company) return ch.fail('no company defined');
		b.company = jn.m('company',{id:b.page.rec.company});
		b.company.a('getNumUsers',{
			fail:ch.fail,
			done:function(res){
				b.numUsers = res.numUsers;

				ch.done();
			}
		});
	}).ch(function(d,ch){ //company rec
		a.view.a('model',{model:b.company,
			rec:function(){
				a.view.a('company');	
			}
		},ch);
	}).ch(cb.done).fail(b.err);
};

me.a_company = function(a,cb){
	var v = a.view, $el = a.view.a('$el'), b = a.view.branch;
	var rec = b.company.rec;
	var plan = {};
	var gUsers = 0;

	/*
	if (rec.grandfather){
		$el.find('[area="grandfather"]').show();
		if (rec.grandfather.name) $el.find('[prop="grandfatherLabel"]').html(jn.format({t:rec.grandfather.name,upper:'first'}));
		gUsers = rec.grandfather.numUsers || 5;
		var numGusers = (b.numUsers > gUsers)? gUsers: b.numUsers;
		$el.find('[prop="numGusers"]').html(numGusers);
		var interval = (rec.grandfather.interval && rec.grandfather.interval == 'year')? 'yr': 'mo';
		$el.find('[prop="grandfatherPrice"]').html('$'+rec.grandfather.price+'/'+interval);
		$el.find('[prop="gUsers"]').html(gUsers);
	}
	*/

	if (!rec.plan){
		plan.type = 'free';
		plan.perUserPrice = 0;
	}
	else plan = rec.plan;
	var interval = (plan.interval && plan.interval == 'year')? 'yr': 'mo';
	var planUsers = b.numUsers - gUsers;
	if (plan.price) $el.find('[prop="price"]').html('$'+plan.price+'/'+interval);
	else $el.find('[prop="price"]').html('$0');
	$el.find('[prop="label"]').html(jn.format({t:plan.type,upper:'first'}));

	var $cardInfo = $el.find('[area="cardInfo"]');
	var $cardForm = $el.find('[area="cardForm"]');
	if (!rec.plan || !rec.plan.stripeCardToken){
		$cardInfo.hide();
		$cardForm.show();
	}
	else {
		$cardInfo.show();
		$cardForm.hide();
		jn.log('card data:',rec.plan.stripeCardData);
		$el.find('[prop="last4"]').html(rec.plan.stripeCardData.last4);
	}

	v.a('set',{companyName:rec.companyName});
};

me.a_saveCard = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	jn.ch(function(d,ch){
		b.company.a('getStripeKey',ch);
	}).ch(function(d,ch){
		jn.log('stripe key:',d.key);
		var stripeKey = d.key;
		var vals = a.view.a('vals');
		try{
			Stripe.setPublishableKey(stripeKey);
			Stripe.card.createToken({
			    number:vals.number,
			    cvc:vals.cvc,
			    exp_month:Number(vals.expMonth),
			    exp_year:Number(vals.expYear)
			}, function(status, res){
				if (res.error) return ch.fail(res.error.message);
				ch.done({token:res.id,card:res.card}); //stripe token
			});
		}
		catch(e){
			ch.fail({error:e});
		}
	}).ch(function(d,ch){
		jn.log('stripe card token:',d.token);
		var cardToken = d.token;
		var cardData = d.card;
		b.company.a('changeCard',{cardToken:cardToken,cardData:cardData},ch);
	}).ch(function(d,ch){
		var $cardInfo = $el.find('[area="cardInfo"]');
		var $cardForm = $el.find('[area="cardForm"]');
		$cardInfo.show();
		$cardForm.hide();
	}).ch(cb.done).fail(b.err);
};

me.a_editCard = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	var $cardInfo = $el.find('[area="cardInfo"]');
	var $cardForm = $el.find('[area="cardForm"]');
	$cardInfo.hide();
	$cardForm.show();
};

me.a_display = function(a, cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	$el.show();

	var wh = $(window).height(),
		//childHeight = a.$child.height(),
		$scrollDiv = $el.find('.scroll-hldr'),
		mh = $el.height();
		console.log('Mh, ', mh);
		console.log('Wh, ', wh);

   	if(mh >= wh - 100) {
   		$scrollDiv.height(wh - 225);
    }
	
	$scrollDiv.mCustomScrollbar({
		theme: 'dark',
		autoHideScrollbar: false,
		//mouseWheel:false,
		contentTouchScroll:false,
		scrollInertia: 20,
		advanced:{
			updateOnContentResize: true,
			autoScrollOnFocus:false
		}
	});

	cb.done();
};

//***** model *****
me.a_rec = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	jn.log('user rec:',b.user.rec);
	a.view.a('set',b.user.rec);
};

//***** btn *****
me.a_tab = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	var tab = a.$btn.attr('tab');
	a.$btn.addClass('active').siblings().removeClass('active');
	a.view.a('section',{show:tab});

	var wh = $(window).height(),
		//childHeight = a.$child.height(),
		$scrollDiv = $el.find('.scroll-hldr'),
		mh = $el.height();
		console.log('Mh, ', mh);
		console.log('Wh, ', wh);

		if(mh >= wh - 100) {
			$scrollDiv.height(wh - 225);
	}

	$scrollDiv.mCustomScrollbar({
		theme: 'dark',
		autoHideScrollbar: false,
		//mouseWheel:false,
		contentTouchScroll:false,
		scrollInertia: 20,
		advanced:{
			updateOnContentResize: true,
			autoScrollOnFocus:false
		}
		});
};

me.a_save = function(a,cb){
	var v = a.view, $el = a.view.a('$el'), b = a.view.branch;

	var vals = a.view.a('vals');
	//jn.log('update user:',vals);
	jn.ch(function(d,ch){ //update info
		b.user.a('update',vals,ch);
	}).ch(function(d,ch){ //change password
		if (vals.curPassword.length < 1) return ch.done();
		b.user.a('changePassword',vals,ch);
	}).ch(function(d,ch){
		var name = v.$el.find('[prop="companyName"]').val();
		if (!name || name == b.company.rec.companyName) return ch.done();
		b.company.a('update',{companyName:name},ch);
	}).ch(function(d,ch){
		b.overlay.a('hide');
		cb.done();
	}).fail(v.branch.err);
};

me.a_logout = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	jn.m('users').a('logout', {
		done:function(res){
			window.location = '/';
		},
		fail:function(res){
			console.log('logout fail');
		}
	});
	
 	b.overlay.a('hide');
};

me.a_selectPlan = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	a.view.a('hide');
	b.overlay.child('o_selectPlan').a('show');
};return module.exports(j,cb);};require.store["web/views/left/overlays/o_addPage.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_addPage = me;
	cb.done();
};

/*
a_bind (fun)
	---a---
	pageId
*/
me.a_bind = function(a,cb){ //bind user events here
	var v = a.view, $el = v.a('$el'), b = v.branch;

	if (a.pageId) b.parentPage = a.pageId;
	else b.parentPage = undefined;

	v.a('set',{name:''});
	v.a('btn');

	v.$el.find('[type].active').removeClass('active');

	v.$host = v.$el.find('[type="host"]');
	//if (b.com && b.com.plan && b.com.plan == 'enterprise'){
	//	v.$host.removeClass('upgrade enterprise');
	//}
	//else v.$host.addClass('upgrade enterprise');
	cb.done();
};

/*
***** btn *****
*/
me.a_addPage = function(a,cb){ //on click of submit btn
	var $el = a.view.a('$el'), b = a.view.branch;
	var vals = a.view.a('vals');
	if (b.parentPage) vals.parent = b.parentPage; //TODO: handle no parent situation
	else vals.company = b.page.rec.company;

	//get page type
	vals.type = $el.find('[type].active').attr('type');

	//jn.log(vals);
	b.alert.a('hide');
	jn.ch(function(d,ch){
		if (b.parentPage) jn.m('pages',{find:{parent:b.parentPage}}).a('add',vals,ch);
		else jn.m('pages',{find:{company:b.page.rec.company,parent:{$exists:false}}}).a('add',vals,ch);
	}).ch(function(d,ch){
		a.view.parent.a('hide'); //hide overlay
	}).ch(cb.done).fail(a.view.branch.err);
};

me.a_type = function(a,cb){
	var v = a.view, $el = v.$el, b = v.branch;
	if (a.$btn.hasClass('upgrade')){
		v.a('hide');
		v.branch.overlay.child('o_selectPlan').a('show');
	}
	a.$btn.addClass('active').siblings().removeClass('active');
};

return module.exports(j,cb);};require.store["web/views/left/overlays/o_globalTeamMembers.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_globalTeamMembers = me;
	cb.done();
};
return module.exports(j,cb);};require.store["web/views/left/pageNav.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.pageNav = me;
	cb.done();
};
var time = 300;
var tierW = 500;

/*
a_build (fun):
	---a---
	page
	[access]
	[overlay]
*/
me.a_build = function(a,cb){ //build, done once
	var v = a.view, b = v.a('branch'), $el = v.$el;

	if (a.access) b.access = a.access;
	if (a.overlay) b.overlay = a.overlay;
	if (a.page) b.page = a.page;
	jn.log('build nav page');
	if (!b.page || !b.page.rec || !b.page.rec.company) return cb.fail('no page defined');

	v.$tiers = $el.find('[area="tiers"]');
	v.$tierWrap = $el.find('[area="tierWrap"]');
	//v.$el.css({position:'relative',overflow:'visible'});
	
	v.$tiers.css({position:'relative',overflow:'visible'});
	v.$tierWrap.css({position:'relative',overflow:'visible'});
	v.$pageNavBg = $('[area="pageNavBg"]');
	//v.$pageNavBg.css({left:'300px'});
	v.$leftBtn = $('[btn="leftShow"]');
	//v.$move = $('[area="nav"]');
	//jn.log('$move:',v.$move);

	v.branch.win.a('bind',{
		key:v._path,
		resize:function(res){
			var dim = res.dim;
			jn.log('windim');
			var left = (dim.w-tierW)/2;
			v.$tierWrap.css({left:left+'px'});
		}
	});

	me.activeTier = 1;

	b.pageNav = v;
	v.company = jn.m('company',{id:b.page.rec.company});

	jn.ch(function(d,ch){
		v.company.a('get',ch);
	}).cb(cb);

	/*.ch(function(d,ch){ //get other companies for this user (is owner), populate main pages from those companies
		if (!b.sessUser) return cb.done(); //if no user logged in exit
		var ownCompanies = jn.m('company',{find:{owners:b.sessUser.id,id:{$ne:b.page.rec.company}}}); //if sessUser is owner of a company and page company does not match
		a.view.a('list',{model:ownCompanies,list:'l_ownCompany'},ch);
	}).ch(function(d,ch){ //get other companies this user is shared on (is on the team)
		var otherCompanies = jn.m('company',{find:{team:b.sessUser.id,id:{$ne:b.page.rec.company}}}); //if sessUser is in the team for a company and page company does not match
		a.view.a('list',{model:otherCompanies,list:'l_otherCompany'},ch);
	})*/
};

/*
a_popTier (fun): populates a tier of pages
	---a---
	level (num): defaults to 1
	parentPage (str): id of parent page (populates children of page)
*/
me.a_popTier = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;

	if (a.level === undefined) a.level = 1;
	if (!me.tierChilds) me.tierChilds = {};
	if (!me.tierChilds[a.level]) me.tierChilds[a.level] = {};

	var tier = a.view.child('l_tier',{level:a.level});
	if (a.parentPage) var child = tier.child('l_pageChilds',{parentPage:a.parentPage});
	else var child = tier.child('l_pageChilds',{company:v.company.id});

	for (var i in me.tierChilds[a.level]){
		if (i != child._path) me.tierChilds[a.level][i].$el.hide();
	}
	if (me.tierChilds[a.level][child._path]){ 
		me.tierChilds[a.level][child._path].$el.show();
		return cb.done();
	}

	jn.ch(function(d,ch){
		tier.a('show',ch);
	}).ch(function(d,ch){
		if (!b.page.isAccess('team') && a.level == 1 && v.company.rec.privateNav){ //show root page only and hide all siblings
			child.a('show',{rootPage:b.page.id},ch);
			me.tierChilds[a.level][child._path] = child;
			return;
		}
		child.a('show',{childPage:a.childPage},ch);
		me.tierChilds[a.level][child._path] = child;
	}).ch(function(d,ch){
		child.$el.show();
		ch.done();
	}).cb(cb);
};

/*
a_focusTier (fun): previews a tier
	---a---
	level (num): defaults to 1
	[back] (bool): true if looking back
*/
me.a_focusTier = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;

	var dim = b.win.a('dim');
	var winW = dim.w;

	var tiersL = (-a.level+1)*tierW;
	var moveL = tierW*2;

	v.$tiers.stop().animate({left:tiersL+'px'},time,'easeOutCirc');
};

me.a_bind = function(a,cb){ 
	var v = a.view, b = v.branch, $el = v.$el;
	a.view.a('btn');
	a.view.a('access',{access:b.access});
	cb.done();
};

me.a_display = function(a,cb){
	var v = a.view;
	v.$el.css({'top': $(window).height()})
	v.$el.show();
	v.branch.win.a('touch');
	cb.done();
};

me.a_pageNavShow = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;

	console.log('nav show!!');
	$el.removeClass('hide-nav').addClass('show-nav').css({'top': '60px'});
	/*
	setTimeout(function(){
		$el.css({'top': '60px'});
	}, 100);
	*/
	v.$pageNavBg.show();
	//v.$leftBtn.hide();
	//v.$move = $('[area="nav"]');
	//v.$move.animate({left:'300px'},time,'easeOutCirc');
	$('body').addClass('site-nav-transition');

	me.activeTier = 1;

	v.a('popTier',{parentPage:b.page.rec.parent},cb);

	cb.done();
};

me.a_slideOut = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;

	console.log('nav hide!!');
	$el.removeClass('show-nav').addClass('hide-nav').css({'top': $(window).height()});
	//$el.css({'left': '-300px'});
	v.$pageNavBg.hide();
	v.$leftBtn.show();

	//v.$move = $('[area="nav"]');
	//v.$move.animate({left:'-300px'},time,'easeOutCirc');
	$('body').removeClass('site-nav-transition');
	v.$tiers.css({left:'0px'});

	$el.find('[v="l_tier"]').each(function(){
		var $childs = $(this);
		var level = $childs.attr('level');
		a.view.child('l_tier',{level:level}).a('hide');
	});

	me.tierChilds = {};

	cb.done();
};


return module.exports(j,cb);};require.store["web/views/overlays/app/o_payment.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_payment = me;
	cb.done();
};

me.a_bind = function(a,cb){ //bind user events here
	var $el = a.view.a('$el'), b = a.view.branch;

	me.paymentSubmitted = false;

	a.view.a('btn');

	if (a.plan) b.plan = a.plan;
	var price = jn.m.company.plans[a.plan].price;

	a.view.a('set',{label:a.plan,price:price});

	cb.done();
};

me.a_display = function(a, cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	$el.show();

	var wh = $(window).height(),
		//childHeight = a.$child.height(),
		$scrollDiv = $el.find('.scroll-hldr'),
		mh = $el.height();
		console.log('Mh, ', mh);
		console.log('Wh, ', wh);

   	if(mh >= wh - 100) {
   		$scrollDiv.height(wh - 225);
    }
	
	$scrollDiv.mCustomScrollbar({
		theme: 'dark',
		autoHideScrollbar: false,
		//mouseWheel:false,
		contentTouchScroll:false,
		scrollInertia: 20,
		advanced:{
			updateOnContentResize: true,
			autoScrollOnFocus:false
		}
	});

	cb.done();
};

me.a_submitPayment = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	if (me.paymentSubmitted) return;
	me.paymentSubmitted = true;

	if (!Stripe) return cb.fail('no Stripe library found');
	b.company = jn.m('company',{id:b.page.rec.company});
	b.user = jn.m('sess').user;
	var vals = a.view.a('vals');
	jn.ch(function(d,ch){
		b.company.a('getStripeKey',ch);
	}).ch(function(d,ch){
		jn.log('stripe key:',d.key);
		var stripeKey = d.key;
		try{
			Stripe.setPublishableKey(stripeKey);
			Stripe.card.createToken({
			    number:vals.number,
			    cvc:vals.cvc,
			    exp_month:Number(vals.expMonth),
			    exp_year:Number(vals.expYear)
			}, function(status, res){
				if (res.error){ 
					me.paymentSubmitted = false;
					return ch.fail(res.error.message);
				}
				ch.done({token:res.id,card:res.card}); //stripe token
			});
		}
		catch(e){
			ch.fail({error:e});
		}
	}).ch(function(d,ch){
		jn.log('stripe card token:',d.token);
		var cardToken = d.token;
		var cardData = d.card;
		b.company.a('subscribe',{cardToken:cardToken,cardData:cardData,plan:b.plan},ch);
	}).ch(function(d,ch){
		b.user.a('update',jn.morph({t:vals,separate:['fName','lName','address','city','state','postal']}),ch);
	}).ch(function(d,ch){
		a.view.a('hide');
		me.paymentSubmitted = false;
		b.overlay.child('o_planStart').a('show',{plan:b.plan});
		ch.done();
	}).ch(cb.done).fail(b.err);
};return module.exports(j,cb);};require.store["web/views/overlays/app/o_planStart.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_planStart = me;
	cb.done();
};

me.a_bind = function(a,cb){
	a.view.a('set',{plan:jn.format({t:a.plan,upper:'first'})},cb);
};return module.exports(j,cb);};require.store["web/views/overlays/app/o_selectPlan.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_selectPlan = me;
	cb.done();
};

me.a_bind = function(a,cb){
	var v = a.view;

	me.planSelected = false;

	a.view.a('btn');

	//loop throguh plans and populate prices
	var plans = jn.m.company.plans;
	for (var i in plans){
		v.$el.find('[area="'+i+'"] [prop="price"]').html('$'+plans[i].price);
	}

	jn.ch(function(d,ch){
		if (!v.branch.page.rec.company) return ch.fail('no company defined');
		v.branch.company = jn.m('company',{id:v.branch.page.rec.company});
		v.a('model',{model:v.branch.company},ch);
	}).ch(cb.done).fail(v.branch.err);

};

me.a_selectPlan = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	if (me.planSelected) return;
	me.planSelected = true;

	var plan = a.$btn.attr('plan');
	//check if company has a card token
	var curPlan = b.company.rec.plan || b.company.rec.grandfather;
	if (!curPlan || !curPlan.stripeCardToken){
		me.planSelected = false;
		a.view.a('hide');
		b.overlay.child('o_payment').a('show',{plan:plan});
	}
	else {
		b.company.a('subscribe',{plan:plan},{
			fail:cb.fail,
			done:function(res){
				me.planSelected = false;
				a.view.a('hide');
				b.overlay.child('o_planStart').a('show',{plan:plan});
			}
		});
	}
};return module.exports(j,cb);};require.store["web/views/overlays/overlay.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.overlay = me;
	cb.done();
};

me.a_bind = function(a,cb){
	var $el = a.view.a('$el');

	$('body').addClass('overlayActive');

	a.view.a('btn',cb);
};

me.a_hide = function(a,cb){
	var b = a.view.branch;
	if (b.alert) b.alert.a('hide');
	a.view.a('hide',{root:true},cb);

	//$('body').removeClass('dropDisabled');
};

me.a_attach = function(a,cb){
	a.view.a('attach',{root:true,$attach:$('[attach="overlay"]')},cb);
};

/*
***** btn *****
*/
me.a_close = function(a,cb){
	a.view.a('hide',cb);
	//$('body').removeClass('dropDisabled');
	return false;
};
return module.exports(j,cb);};require.store["web/views/overlays/public/o_forgotPassword.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_forgotPassword = me;
	cb.done();
};

me.a_bind = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('btn');
	cb.done();
};

me.a_send = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	var vals = a.view.a('vals');
	jn.ch(function(d,ch){
		jn.m('users').a('sendRecoverPassword',{email:vals.email},ch);
	}).ch(function(d,ch){
		b.alert.a('show',{type:'success',message:'recover password email sent'},ch);
	}).ch(cb.done).fail(b.err);
	
};return module.exports(j,cb);};require.store["web/views/overlays/public/o_login.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_login = me;
	cb.done();
};

me.a_bind = function(a,cb){ //bind user events here
	var v = a.view;
	if (a.complete) v.complete = a.complete;

	if (jn.m('sess').user){
		if (v.complete) return v.complete();
		return v.a('goUserPage'); //if user is already logged in, go to their page
	}

	v.a('reset');
	v.a('btn');

	if (a.email) v.a('set',{email:a.email});
	

	v.$el.on('keyup','[prop="password"]',function(e){
		if (e.keyCode == 13) v.a('login');
	});
	cb.done();
};

me.a_display = function(a, cb){
	var v = a.view;
	var wh = $(window).height();
	v.$el.show();
	v.$el.height(wh - 100);
	cb.done();
};

/*
***** btn *****
*/
me.a_login = function(a,cb){ //on click of submit btn
	var v = a.view;
	var vals = v.a('vals');
	jn.log('login:',vals);
	v.branch.alert.a('hide');
	jn.ch(function(d,ch){
		jn.m('users').a('login',vals,ch);
	}).ch(function(d,ch){
		jn.log(v.complete);
		if (v.complete){
			v.complete();
			return ch.done();
		}
		v.a('goUserPage',ch);
	}).ch(cb.done).fail(v.branch.err);
};

me.a_forgotPassword = function(a,cb){
	var v = a.view;
	v.a('hide');
	v.branch.overlay.child('o_forgotPassword').a('show');
};

me.a_goUserPage = function(a,cb){
	var v = a.view;
	jn.ch(function(d,ch){ //get user main company
		jn.m('pages').a('getMain',{
			fail:ch.fail,
			done:function(res){
				if (res.main) return ch.done({main:res.main});
				return window.location = '/page';
			}
		});
	}).ch(function(d,ch){ //get company page
		jn.log('main:',d.main);
		jn.m('pages',{id:d.main}).a('getUrl',ch);
	}).ch(function(d,ch){
		return window.location = '/'+d.url;
	}).cb(cb);
};

return module.exports(j,cb);};require.store["web/views/overlays/public/o_signUp.js"]=function(j,cb){var module = {};var v = 'o_signUp', jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v[v] = me;
	cb.done();
};

me.a_bind = function(a,cb){ //bind user events here
	var v = a.view;

	if (a.email) v.a('set',{email:a.email});
	if (a.complete) v.complete = a.complete;
	if (a.logoValidate) v.logoValidate = a.logoValidate;
	v.eventSrc = a.eventSrc || 'show';

	if (a.generic) v.$el.addClass('show-generic');
	else v.$el.removeClass('show-generic');

	//TODO: make btn work with default actions on view
	v.a('btn');

	v.$el.on('keyup','[prop="password"]',function(e){
		if (e.keyCode == 13){
			v.a('signUp');
		}
	});

	cb.done();
};

me.a_display = function(a,cb){
	var v = a.view;

	jn.log('source', v.eventSrc);

	var wh = $(window).height();
	v.$el.show();
	v.$el.height(wh - 100);

	if (ga) ga('send', 'event', 'signup', 'show', v.eventSrc); // google analytics tracking - sign up dioalog shown

	cb.done();
};

/*
***** btn *****
*/
me.a_signUp = function(a,cb){ //on click of submit btn
	var v = a.view;
	
	//console.log(a);
	//if (v.logoValidate) vals.logoValidate = v.logoValidate;

	var vals = v.a('vals');

	//jn.log(vals);
	v.branch.alert.a('hide');
	jn.ch(function(d,ch){
		jn.m('users').a('signUp',vals,{
			fail:function(res){
				jn.log('signup fail:',res);
				ch.fail(res);
			},
			done:ch.done
		});
	}).ch(function(d,ch){
		if (v.complete){
			//v.parent.a('hide'); //hide overlay
			v.complete();
		}
		else {
			//var src = a.eventSrc || v.eventSrc || 'show';

			console.log('sign up src:',v.eventSrc);

			if(ga) ga('send', 'event', 'signup', 'success', v.eventSrc); //google analytics tracking - sign up successful

			// intercom source 
			jn.m('intercom').a('apiStart',{
				email:vals.email,
				created: jn.date({get:'ts'}),
				from:v.eventSrc
			});

			//	route the user to the app
			window.location = '/page';
		}

		ch.done();
	}).ch(cb.done).fail(v.branch.err);
};return module.exports(j,cb);};require.store["web/views/overlays/public/o_signUpPaid.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_signUpPaid = me;
	cb.done();
};

me.a_bind = function(a,cb){ //bind user events here
	var $el = a.view.a('$el');

	jn.log('sign up:',$el);

	//TODO: make btn work with default actions on view
	a.view.a('btn');

	cb.done();
};

me.a_display = function(a, cb){
	var $el = a.view.a('$el');
	var wh = $(window).height();
	$el.show();

	$el.height(wh - 100);
	cb.done();
};

/*
***** btn *****
*/
me.a_signUpPaid = function(a,cb){ //on click of submit btn
	var vals = a.view.a('vals'), b = a.view.branch;
	//jn.log(vals);
	b.alert.a('hide');
	jn.ch(function(d,ch){
		jn.m('users').a('signUp',vals,{
			fail:function(res){
				jn.log('signup fail:',res);
				ch.fail(res);
			},
			done:ch.done
		});
	}).ch(function(d,ch){
		a.view.parent.a('hide'); //hide overlay
		window.location = 'page';
	}).ch(cb.done).fail(b.err);
};

return module.exports(j,cb);};require.store["web/views/overlays/app/o_payment.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_payment = me;
	cb.done();
};

me.a_bind = function(a,cb){ //bind user events here
	var $el = a.view.a('$el'), b = a.view.branch;

	me.paymentSubmitted = false;

	a.view.a('btn');

	if (a.plan) b.plan = a.plan;
	var price = jn.m.company.plans[a.plan].price;

	a.view.a('set',{label:a.plan,price:price});

	cb.done();
};

me.a_display = function(a, cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	$el.show();

	var wh = $(window).height(),
		//childHeight = a.$child.height(),
		$scrollDiv = $el.find('.scroll-hldr'),
		mh = $el.height();
		console.log('Mh, ', mh);
		console.log('Wh, ', wh);

   	if(mh >= wh - 100) {
   		$scrollDiv.height(wh - 225);
    }
	
	$scrollDiv.mCustomScrollbar({
		theme: 'dark',
		autoHideScrollbar: false,
		//mouseWheel:false,
		contentTouchScroll:false,
		scrollInertia: 20,
		advanced:{
			updateOnContentResize: true,
			autoScrollOnFocus:false
		}
	});

	cb.done();
};

me.a_submitPayment = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	if (me.paymentSubmitted) return;
	me.paymentSubmitted = true;

	if (!Stripe) return cb.fail('no Stripe library found');
	b.company = jn.m('company',{id:b.page.rec.company});
	b.user = jn.m('sess').user;
	var vals = a.view.a('vals');
	jn.ch(function(d,ch){
		b.company.a('getStripeKey',ch);
	}).ch(function(d,ch){
		jn.log('stripe key:',d.key);
		var stripeKey = d.key;
		try{
			Stripe.setPublishableKey(stripeKey);
			Stripe.card.createToken({
			    number:vals.number,
			    cvc:vals.cvc,
			    exp_month:Number(vals.expMonth),
			    exp_year:Number(vals.expYear)
			}, function(status, res){
				if (res.error){ 
					me.paymentSubmitted = false;
					return ch.fail(res.error.message);
				}
				ch.done({token:res.id,card:res.card}); //stripe token
			});
		}
		catch(e){
			ch.fail({error:e});
		}
	}).ch(function(d,ch){
		jn.log('stripe card token:',d.token);
		var cardToken = d.token;
		var cardData = d.card;
		b.company.a('subscribe',{cardToken:cardToken,cardData:cardData,plan:b.plan},ch);
	}).ch(function(d,ch){
		b.user.a('update',jn.morph({t:vals,separate:['fName','lName','address','city','state','postal']}),ch);
	}).ch(function(d,ch){
		a.view.a('hide');
		me.paymentSubmitted = false;
		b.overlay.child('o_planStart').a('show',{plan:b.plan});
		ch.done();
	}).ch(cb.done).fail(b.err);
};return module.exports(j,cb);};require.store["web/views/overlays/app/o_planStart.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_planStart = me;
	cb.done();
};

me.a_bind = function(a,cb){
	a.view.a('set',{plan:jn.format({t:a.plan,upper:'first'})},cb);
};return module.exports(j,cb);};require.store["web/views/overlays/app/o_selectPlan.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_selectPlan = me;
	cb.done();
};

me.a_bind = function(a,cb){
	var v = a.view;

	me.planSelected = false;

	a.view.a('btn');

	//loop throguh plans and populate prices
	var plans = jn.m.company.plans;
	for (var i in plans){
		v.$el.find('[area="'+i+'"] [prop="price"]').html('$'+plans[i].price);
	}

	jn.ch(function(d,ch){
		if (!v.branch.page.rec.company) return ch.fail('no company defined');
		v.branch.company = jn.m('company',{id:v.branch.page.rec.company});
		v.a('model',{model:v.branch.company},ch);
	}).ch(cb.done).fail(v.branch.err);

};

me.a_selectPlan = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	if (me.planSelected) return;
	me.planSelected = true;

	var plan = a.$btn.attr('plan');
	//check if company has a card token
	var curPlan = b.company.rec.plan || b.company.rec.grandfather;
	if (!curPlan || !curPlan.stripeCardToken){
		me.planSelected = false;
		a.view.a('hide');
		b.overlay.child('o_payment').a('show',{plan:plan});
	}
	else {
		b.company.a('subscribe',{plan:plan},{
			fail:cb.fail,
			done:function(res){
				me.planSelected = false;
				a.view.a('hide');
				b.overlay.child('o_planStart').a('show',{plan:plan});
			}
		});
	}
};return module.exports(j,cb);};require.store["web/views/standard/alert.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.alert = me;
	cb.done();
};

/*
a_bind
	---a---
	message
	[type]
	[hideAfter] (num): milliseconds success will show for
*/
me.a_bind = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	jn.log('show error:',a.message);
	a.type = a.type || 'error';
	a.view.a('btn');
	if (a.message.res) a.message = a.message.res;

	//jn.log('alert:',a.message);

	a.hideAfter = a.hideAfter || 3000;

	var $tpl = $el.find('[tpl="message"]');
	$el.find('[prop="message"]:not([tpl])').remove();
	var type = jn.type(a.message);
	if (type == 'obj'){
		for (var i in a.message){
			if (['reqId','resCb'].indexOf(i) === -1){
				var $mes = $tpl.clone();
				$mes.removeAttr('tpl').show().html(i+': '+a.message[i]);
				$tpl.before($mes);
			}
		}
	}
	else if (type == 'str') { //str error
		var $mes = $tpl.clone();
		$mes.removeAttr('tpl').show().html(a.message);
		$tpl.before($mes);
	}
	if (me.timer){
		clearTimeout(me.timer);
		me.timer = undefined;
	}
	if (a.type == 'success'){
		$el.addClass('success');
		me.timer = setTimeout(function(){
			$el.fadeOut(300,function(){
				a.view.a('hide');
			});
		},a.hideAfter);
	}
	else {
		$el.removeClass('success');
	}

	//	for links returned in our error codes
	$el.on('click','a[rel=external]',function(e){
		window.open($(this).attr('href'));
		e.preventDefault();
		e.stopPropigation();
		return false;
	});

	cb.done();
};

me.a_closeAlert = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('hide');
};return module.exports(j,cb);};require.store["web/views/standard/grid.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.grid = me;
	cb.done();
};

var gridW = 4;
var max = {h:3,w:6};
var size = 180; //size
var groups = {}; //to store group instances

/*
a_init (fun): initializes a grid instance
	---a---
	group (str): grid elements interact within a group
	$container (obj): jquery ref to dom container for grid
	update (fun): callback on grid update
	[jump] (fun): callback for when element jumps categories
		elem
		group
	[noResize] (bool): if true, elements cannot be resized
	[gridW] (num): number of elements wide in grid
	[size]
*/
me.a_init = function(a,cb){
	var v = a.view, b = v.branch;
	if (!a.$container) return cb.fail('no $container defined');
	//a.$container.css()
	v.$el = a.$container;
	v._grid = { //init view grid instance
		group:a.group,
		w:gridW,
		h:0,
		grid:[],
		$container:a.$container
	};

	//store position and report to other grid instances
	groups[a.group] = groups[a.group] || [];
	groups[a.group].push(v._path);

	jn.log('groups:',groups);

	if (a.noResize) v._grid.noResize = true;
	if (a.update) v._grid.update = a.update;
	if (a.jump) v._grid.jump = a.jump;
	v._grid.gridW = a.gridW || gridW;
	v._grid.size = a.size || size;
	if (!v._bound){
		v.a('bind');
		v._bound = true;
	}
	
	cb.done();
};

/*
a_bind (fun): binds the grid drag and resize
	---a---
	$container (obj): jquery ref to dom container for grid
*/
me.a_bind = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch,
		grid = a.view._grid.grid;

	var selectClear = function(res){
		prev = {};
		$('body').one('mouseup',function(){
			$('body').off('mousemove');

			if (res.clear) res.clear(dim);

			//if there is a selection, move to that place
			var $select = $el.find('.gridSelect');

			if ($select.length > 0){
				var dim = $select.data('dim');
				var elem = $select.data('elem');
				var g = $select.data('group');
				a.view.a('clear',{clear:elem});

				if (dim){
					elem._gr.x = dim.x;
					elem._gr.y = dim.y;
					elem._gr.w = dim.w;
					elem._gr.h = dim.h;
					a.view.a('place',{place:elem,force:true});
					if (res.place) res.place(dim);

					setTimeout(function(){
						if (a.view._grid.update) a.view._grid.update();
					},1000);
				}
				else if (g !== undefined){
					var group = groups[a.view._grid.group][g];
					if (!group) return;
					if (a.view._grid.jump) a.view._grid.jump({elem:elem,group:jn.v(group)});

					setTimeout(function(){
						if (a.view._grid.update) a.view._grid.update();
					},1000);
				}
			}
			$select.remove();
		});
	};

	$el.on('mousedown','[area="handle"]',function(e){
		//get parent $el
		var elemP = $(this).parents('[v]').attr('path');
		var elem = jn.v(elemP);
		var curPos = {left:elem._gr.x*a.view._grid.size,top:elem._gr.y*a.view._grid.size};
		//jn.log('touch:',e);
		var $over = elem.$el.clone();
		//elem.$el.css({opacity:0.5});
		$over.css({
			zIndex:30000//,
			//backgroundColor:'#ffff64',
			//border:'3px solid #f00'
		});
		$el.append($over);

		var g = a.view._grid.group;
		//loop through other grid instances to get their positions
		var gridPos = [];
		if (groups[g]){
			for (var i=0,len=groups[g].length;i<len;i++){

				var gView = jn.v(groups[g][i]);
				if (gView._path != a.view._path){
					if (gView && gView.$el) gridPos[i] = [gView.$el.offset().top,gView.$el.offset().top+gView.$el.outerHeight(),
						gView.$el.offset().left,gView.$el.offset().left+gView.$el.outerWidth()];
				}
			}
		}

		selectClear({
			clear:function(){
				$over.remove();
			},
			place:function(dim){
				//if (elem._grUpdate) elem._grUpdate(dim);
			}
		});

		//get grab location e.offsetX, e.offsetY

		$('body').on('mousemove',function(e2){

			//get element under mouse
			//me.select(grid,obj,{x:e2.pageX,y:e2.pageY,offX:e.offsetX,offY:e.offsetY,$e:$e});
			var left = e2.pageX-e.pageX+curPos.left;
			var top = e2.pageY-e.pageY+curPos.top;
			a.view.a('select',{
				pos:{
					left:left,
					top:top
				},
				cursor:{
					x:e2.pageX,
					y:e2.pageY,
				},
				elem:elem,
				gridPos:gridPos
			});

			//jn.log('e2:',e2,$el.position(),e.offsetY);
			$over.css({
				top:top+'px',
				left:left+'px'
			});
		});

	});

	$el.on('mousedown','.sizeW',function(e){
		var orig = {x:e.pageX,y:e.pageY};
		var elemP = $(this).parents('[v]').attr('path');
		var elem = jn.v(elemP);
		a.view.a('select',{
			pos:{},
			elem:elem
		});
		selectClear({
			place:function(dim){
				//if (elem._grUpdate) elem._grUpdate(dim);
			}
		});
		$('body').on('mousemove',function(e2){
			//jn.log('check:',e2.pageX,orig.x)

			var resize = {w:elem._gr.w,h:elem._gr.h};
			if (e2.pageX > orig.x+(a.view._grid.size/2)){ //expand
				resize.w = Math.round((e2.pageX-orig.x)/a.view._grid.size)+elem._gr.w;
				if (resize.w > max.w) resize.w = max.w;
			}
			else if (e2.pageX < orig.x-(a.view._grid.size/2)){ //contract
				resize.w = Math.round((e2.pageX-orig.x)/a.view._grid.size)+elem._gr.w;
				if (resize.w < 1) resize.w = 1;
			}
			a.view.a('select',{
				pos:resize,
				elem:elem
			});

			return false;
		});
	});

	$el.on('mousedown','.sizeH',function(e){
		var orig = {x:e.pageX,y:e.pageY};
		var elemP = $(this).parents('[v]').attr('path');
		var elem = jn.v(elemP);
		a.view.a('select',{
			pos:{},
			elem:elem
		});
		selectClear({
			place:function(dim){
				//if (elem._grUpdate) elem._grUpdate(dim);
			}
		});
		$('body').on('mousemove',function(e2){
			//jn.log('check:',e2.pageX,orig.x)

			var resize = {w:elem._gr.w,h:elem._gr.h};
			if (e2.pageY > orig.y+(a.view._grid.size/2)){ //expand
				resize.h = Math.round((e2.pageY-orig.y)/a.view._grid.size)+elem._gr.h;
				if (resize.h > max.h) resize.h = max.h;
				if (resize.h > 1 && elem._gr.y+resize.h > grid.length){ //check if new row needs to be added
					a.view.a('buildRow');
				}
			}
			else if (e2.pageY < orig.y-(a.view._grid.size/2)){ //contract
				resize.h = Math.round((e2.pageY-orig.y)/a.view._grid.size)+elem._gr.h;
				if (resize.h < 1) resize.h = 1;
			}
			
			a.view.a('select',{
				pos:resize,
				elem:elem
			});
			return false;
		});
	});

	$el.on('mousedown','.sizeWH',function(e){
		var orig = {x:e.pageX,y:e.pageY};
		var elemP = $(this).parents('[v]').attr('path');
		var elem = jn.v(elemP);
		a.view.a('select',{
			pos:{},
			elem:elem
		});
		selectClear({
			place:function(dim){
				//if (elem._grUpdate) elem._grUpdate(dim);
			}
		});
		$('body').on('mousemove',function(e2){
			//jn.log('check:',e2.pageX,orig.x)
			var resize = {w:elem._gr.w,h:elem._gr.h};
			if (e2.pageY > orig.y+(a.view._grid.size/2)){ //expand
				resize.h = Math.round((e2.pageY-orig.y)/a.view._grid.size)+elem._gr.h;
				if (resize.h > max.h) resize.h = max.h;
				if (resize.h > 1 && elem._gr.y+resize.h > grid.length){ //check if new row needs to be added
					a.view.a('buildRow');
				}
			}
			else if (e2.pageY < orig.y-(a.view._grid.size/2)){ //contract
				resize.h = Math.round((e2.pageY-orig.y)/a.view._grid.size)+elem._gr.h;
				if (resize.h < 1) resize.h = 1;
			}
			if (e2.pageX > orig.x+(a.view._grid.size/2)){ //expand
				resize.w = Math.round((e2.pageX-orig.x)/a.view._grid.size)+elem._gr.w;
				if (resize.w > max.w) resize.w = max.w;
			}
			else if (e2.pageX < orig.x-(a.view._grid.size/2)){ //contract
				resize.w = Math.round((e2.pageX-orig.x)/a.view._grid.size)+elem._gr.w;
				if (resize.w < 1) resize.w = 1;
			}
			
			a.view.a('select',{
				pos:resize,
				elem:elem
			});
			return false;
		});
	});
};

var prev = {};
/*
a_select
	---a---
	elem
	pos
		x
		y
	cursor
		x
		y
	gridPos (ary): positions of other grids in group (index correlates with order of ents in group ary)
		[top,bottom]

*/
me.a_select = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch,
		grid = a.view._grid.grid;
	//get grid at pos
	var dim = {};
	if (a.pos.left) dim.x = Math.floor((a.pos.left)/a.view._grid.size);
	else if (a.pos.x) dim.x = a.pos.x;
	else dim.x = a.elem._gr.x;
	if (a.pos.top) dim.y = Math.floor((a.pos.top)/a.view._grid.size);
	else if (a.pos.y) dim.y = a.pos.y;
	else dim.y = a.elem._gr.y;
	//jn.log('select:',a.elem._gr);
	dim.w = (a.pos.w)? a.pos.w: a.elem._gr.w;
	dim.h = (a.pos.h)? a.pos.h: a.elem._gr.h;

	if (prev.x === dim.x && prev.y === dim.y && 
		prev.w === dim.w && prev.h === dim.h) return;

	prev = dim;
	$el.find('.gridSelect').remove();
	
	if (dim.x >= 0 && dim.x+dim.w-1 < a.view._grid.gridW && dim.y >= 0 && dim.y+dim.h-1 < grid.length){
		var $l = $('<div></div>');
		$l.css({
			position:'absolute',
			top:(dim.y*a.view._grid.size)+'px',
			left:(dim.x*a.view._grid.size)+'px',
			width:(dim.w*a.view._grid.size)+'px',
			height:(dim.h*a.view._grid.size)+'px',
			zIndex:25000,
			backgroundColor:'#66b9e7',
			opacity:0.3
		}).data({dim:dim,elem:a.elem}).addClass('gridSelect');
		$el.append($l);
	}
	else if (a.gridPos){ //check if hovering over another grid in the same group
		for (var i=0,len=a.gridPos.length;i<len;i++){
			var pos = a.gridPos[i];
			jn.log('pos',pos,a.cursor);
			if (pos && a.cursor.y > pos[0] && a.cursor.y < pos[1] && a.cursor.x > pos[2] && a.cursor.x < pos[3]){
				//select category

				var $l = $('<div></div>');
				$l.css({
					position:'fixed',
					top:pos[0]+'px',
					left:pos[2]+'px',
					height:(pos[1]-pos[0])+'px',
					width:(pos[3]-pos[2])+'px',
					zIndex:25000,
					backgroundColor:'#66b9e7',
					opacity:0.3
				}).data({group:i,elem:a.elem}).addClass('gridSelect');
				$el.append($l);
			}
		}
	}
};

/*
a_remove (fun): removes a grid element from a grid
	---a---
	remove (obj): view ent to put in grid
		_gr
			x
			y
			w
			h
*/
me.a_remove = function(a,cb){
	var grid = a.view._grid.grid, b = a.view.branch,
		pl = a.remove._gr;
	a.view.a('clear',{clear:a.remove});

	//elim extra rows (at bottom)
	for (var y=grid.length-1;y>0;y--){
		var isZeros = true;
		for (var x=0;x<a.view._grid.gridW;x++){
			if (grid[y][x] !== 0) isZeros = false;
		}
		if (isZeros) grid.splice(y,1);
		else break;
	}
};

/*
a_add (fun): adds a grid element to a grid
	---a---
	add (obj): view ent to put in grid
		_gr
			x
			y
			w
			h
	update (fun): callback on updated
*/
me.a_add = function(a,cb){
	var b = a.view.branch;
	a.add._gr = a.add._gr || {};
	if (!a.add._gr.w) a.add._gr.w = 1;
	if (!a.add._gr.h) a.add._gr.h = 1;

	if (a.update) a.add._grUpdate = a.update;

	//place element in grid
	jn.ch(function(d,ch){
		a.view.a('clear',{clear:a.add});
		a.view.a('place',{place:a.add,add:true},ch);
	}).ch(function(d,ch){
		if (!a.noResize && !a.view._grid.noResize){
			var $sizeW = $('<div/>');
			$sizeW.addClass('sizeW');
			$sizeW.css({
				position:'absolute',
				top:'0px',
				right:'0px',
				width:'10px',
				height:(a.add._gr.h*a.view._grid.size)+'px'
			});
			a.add.$el.find('[area="gridItem"]').append($sizeW);
			var $sizeH = $('<div/>');
			$sizeH.addClass('sizeH');
			$sizeH.css({
				position:'absolute',
				left:'0px',
				bottom:'0px',
				height:'10px',
				width:(a.add._gr.w*a.view._grid.size)+'px'
			});
			a.add.$el.find('[area="gridItem"]').append($sizeH);
			var $sizeWH = $('<div/>');
			$sizeWH.addClass('sizeWH');
			$sizeWH.css({
				position:'absolute',
				right:'0px',
				bottom:'0px',
				height:'20px',
				width:'20px'
			});
			a.add.$el.find('[area="gridItem"]').append($sizeWH);
		}
		ch.done();
	}).ch(cb.done).fail(b.err);
};

/*
a_clear (fun): clears an element from a grid
	---a---
	clear (obj): view ent to place
		_gr
			x
			y
			w
			h
*/
me.a_clear = function(a,cb){
	var grid = a.view._grid.grid, b = a.view.branch,
		pl = a.clear._gr;
	for (var y=0,maxY=grid.length;y<maxY;y++){
		for (var x=0,maxX=grid[0].length;x<maxX;x++){
			if (grid[y][x] == a.clear._path) grid[y][x] = 0;
		}
	}
};

/*
a_place (fun): places an element in a grid
	---a---
	[force] (bool): if true will push other objects out of the way
	[add] (bool)
	place (obj): view ent to place
		_gr
			x
			y
			w
			h
*/
me.a_place = function(a,cb){
	var grid = a.view._grid.grid, b = a.view.branch;
	
	var pl = a.place._gr; 
	var pos = {x:0,y:0};
	if (a.force || a.add){
		pos.x = pl.x || 0;
		pos.y = pl.y || 0;
	}
	var placed = false;
	
	while (!placed){
		if (!grid[pos.y]) a.view.a('buildRow'); //check if grid spaces exist, create if needed
		for (var y=1;y<pos.y+pl.h;y++){ //make new rows for height of placed elem
			if (!grid[y]) {
				//jn.log('build y:',y,grid[y]);
				var row = [];
				for (var x=0;x<a.view._grid.gridW;x++){
					row[x] = 0;
				}
				grid.push(row);
			}
		}

		var clear = true;
		for (var x=pos.x;x<pos.x+pl.w;x++){
			for (var y=pos.y;y<pos.y+pl.h;y++){
				//jn.log('check:',pos);
				if (grid[y][x] === undefined || (!a.force && (!a.add || !a.place._gr || !a.place._gr.x) && grid[y][x] !== 0)){
					clear = false;
					break;
				}
			}
		}
		if (clear){
			placed = true;	
			var move = [];
			for (var x=pos.x;x<pos.x+pl.w;x++){
				for (var y=pos.y;y<pos.y+pl.h;y++){
					if (grid[y][x] != 0 && move.indexOf(grid[y][x]) === -1){ //something is there, move it!
						move.push(grid[y][x]);
					}
					grid[y][x] = a.place._path;
				}
			}
			pl.x = pos.x;
			pl.y = pos.y;

			if (move.length > 0){
				for (var i=0,len=move.length;i<len;i++){
					var m = jn.v(move[i]);
					a.view.a('clear',{clear:m});
					a.view.a('place',{place:m});
				}
			}

			//draw elem in grid
			var $e = a.place.a('$el');

			$e.css({
				position:'absolute'
			}).attr({
				w:pl.w,
				h:pl.h
			});
			if (a.add){
				$e.css({
					width:(pl.w*a.view._grid.size)+'px',
					height:(pl.h*a.view._grid.size)+'px',
					top:(pl.y*a.view._grid.size)+'px',
					left:(pl.x*a.view._grid.size)+'px'
				});
			}
			else {
				$e.animate({
					width:(pl.w*a.view._grid.size)+'px',
					height:(pl.h*a.view._grid.size)+'px',
					top:(pl.y*a.view._grid.size)+'px',
					left:(pl.x*a.view._grid.size)+'px'
				},300,'easeOutCirc');
			}
			$e.find('.sizeW').css({height:(pl.h*a.view._grid.size)+'px'});
			$e.find('.sizeH').css({width:(pl.w*a.view._grid.size)+'px'});
		}
		else {
			pos.x++;
			if (pos.x == a.view._grid.gridW){
				pos.x = 0;
				pos.y++;
			}
		}
	}
	
	if (a.place._grUpdate) a.place._grUpdate(pl);

	//jn.log('grid:',JSON.stringify(grid));
	//elim extra rows (at bottom)
	for (var y=grid.length-1;y>0;y--){
		var isZeros = true;
		for (var x=0;x<a.view._grid.gridW;x++){
			if (grid[y][x] !== 0) isZeros = false;
		}
		if (isZeros) grid.splice(y,1);
		else break;
	}

	a.view.$el.height(grid.length*a.view._grid.size);

	cb.done();
};

/*
a_buildRow (fun): builds a row of blank spaces at the bottom of the grid
*/
me.a_buildRow = function(a,cb){
	var grid = a.view._grid.grid, b = a.view.branch;
	var row = [];
	for (var x=0;x<a.view._grid.gridW;x++){
		row[x] = 0;
	}
	grid.push(row);
};

return module.exports(j,cb);};require.store["web/views/standard/upload.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.upload = me; //defining statement - without this, me does not get exposed
	cb.done();
};

/*
a_drop (fun): sets up an object to receive file drop uploads
	---a---
	path
	$drop
	$form
	[submit] (fun): return err (str)
	[progress] (fun)
		done
		total
	[complete] (fun)
	[error] (fun)
	[multi] (bool): if true, allow for multiple files
*/
me.a_drop = function(a,cb){
	if (!a.$drop) return cb.fail('no drop defined');
	if (!a.path) return cb.fail('no path defined');

	if (a.progress){
		var upload = jn.m('upload',{id:a.path});
		jn.log('upload ent:',upload._path);
		upload.a('sub');
		upload.a('bind',{
			progress:function(res){
				a.progress({done:res.done,total:res.total});
			}
		});
	}

	//standard file uploads
	var name = a.view._path+'UploadFrame';
	$('iframe[name="'+name+'"]').remove();

	var $iframe = $('<iframe></iframe>');
	$iframe.attr({'name':name, 'onload':'var response = this.contentWindow.document.body; if (response.firstChild && response.firstChild.nodeName == \'PRE\') response = response.firstChild; if (!this || !$(this) || !$(this).data) return; $(this).data(\'response\', response.innerHTML).trigger(\'uploaded\');'}).css('display', 'none').appendTo('body');
	$iframe.bind('uploaded', function(){
		a.$form.find('input[type="file"]').val('');
		console.log('$iframe:',$iframe);
		var res = $iframe.data('response');
		try{
			res = JSON.parse(res);
		}
		catch(e){
			return cb.fail('json parse err:',e);
		}
		jn.log('upload COMPLETE:',res,res.resCb);
		if (!res || !res.resCb) return cb.fail(res);
		if (res.resCb == 'done'){
			if (a.complete) a.complete(res);
			return; 
		}
		if (a.error) a.error(res);
	});

	
	//set target on form to iframe name and action to api path
	a.$form.attr({'target': name, 'enctype':'multipart/form-data', 'method':'POST', 'action':a.path}).bind('submit', function(event){
		console.log('submitted:',name);

		var file = a.$form.find('input[type="file"]').val();
		var fAry = file.split('/');
		var fileName = fAry[fAry.length-1];
		if (a.submit){
			var err = a.submit({files:[{name:fileName}]});
			if (err){
				if (a.error) a.error(err);
				event.preventDefault();
			}
		}
	});

	a.$form.on('change','input[type="file"]',function(){
		a.$form.submit();
	});

	$.event.props.push('dataTransfer'); //set jquery file passing

	var timer;
	$('body').on('drag dragover',function(e){
		e.preventDefault();
		e.stopPropagation();
		clearTimeout(timer);
		timer = setTimeout(function(){
			a.$drop.removeClass('dropHover');
		},500);
		a.$drop.addClass('dropHover');
	});

	//console.log('bind drop:',a.$drop);
	a.$drop.off('drop');
	a.$drop.on('drop',function(e){
		var files = e.dataTransfer.files;
		if (files.length < 1) return;

		a.$drop.removeClass('dropHover');

		jn.ch(function(d,ch){
			if (!a.submit) return ch.done();
			var resFiles = [];
			for (var i=0,len=files.length;i<len;i++){
				resFiles[i] = {name:files[0].name};
			}
			var err = a.submit({files:resFiles});
			if (err) return ch.fail(err);
			ch.done();
		}).ch(function(d,ch){
			var res;
			jn.loop({ary:files},{
				loop:function(loop){
					var file = files[loop.i];
					var data = new FormData(a.$form[0]); 
		        	data.append("file",file);
		        	jn.log('file:',file,a.path);
		        	$.ajax({
				    	//headers: {'Cookie':jn.m('sess').id},
				        url : a.path, // use your target
				        type : 'POST',
				        data : data,
				        cache : false,
				        contentType : false,
				        processData : false,
				        success:function(r) {
				        	res = JSON.parse(r);
				        	jn.log('upload res:',res);
				        	loop.next();
				        }
				    });
				},
				done:function(){
					jn.log('upload complete!');
					if (!res || !res.resCb) return ch.fail(res);
					if (res.resCb == 'done'){
						if (a.complete) a.complete(res);
						return; 
					}
					return ch.fail(res.res);
				}
			});
		}).fail(function(err){
			if (a.error) a.error(err);
		});

	    return false;
	});

	cb.done();
};
return module.exports(j,cb);};require.store["web/views/standard/win.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.win = me;

	var timeout;
	var win = jn.v('win');
	me.$win = $(window);
	me.$win.bind('resize', function(){
		clearTimeout(timeout);
		timeout = setTimeout(function(){
			var dim = win.a('dim');
			win.a('trigger',{trigger:'resize',dim:dim});
		},200);
	}).on('scroll',function(e){
		var scrollTop = me.$win.scrollTop();
		win.a('trigger',{trigger:'scroll',scroll:scrollTop});
	});

	cb.done();
};

/*
a_touch (fun): used to trigger window related events
*/
me.a_touch = function(a,cb){
	//trigger both events
	me.$win.trigger('resize').trigger('scroll');
	cb.done();
};

me.a_dim = function(a,cb){
	//jn.log('$win',me.$win.width());
	return {w:me.$win.width(),h:me.$win.height()};
};return module.exports(j,cb);};require.store["web/views/page/overlays/o_addCategory.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_addCategory = me;
	cb.done();
};return module.exports(j,cb);};require.store["web/views/page/overlays/o_addContent.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_addContent = me;
	cb.done();
};

me.a_bind = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	a.view.a('btn');
	cb.done();
};	

/*
***** btn *****
*/
me.a_colorAdd = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('hide');
	b.overlay.child('o_colorAdd').a('show');
};

me.a_upload = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('hide');
	b.overlay.child('o_upload').a('show');
};return module.exports(j,cb);};require.store["web/views/page/overlays/o_catAdd.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_catAdd = me;
	cb.done();
};

/*
a_bind (fun):
	---a---
	prevView
*/
me.a_bind = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('btn');

	a.view.a('set',{category:''});

	b.prev = a.prev;
	cb.done();
};

me.a_cancel = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	//close this overlay and show prev
	a.view.a('hide');
	b.prev.a('show');
};

me.a_addCat = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	var vals = a.view.a('vals');
	if (vals.category.length < 1) return b.err('enter a category');
	b.prev.a('show',{custom:vals.category});
};

me.a_hide = function(a,cb){
	var b = a.view.branch;
	b.alert.a('hide');
	a.view.a('hide',{root:true},cb);
};
return module.exports(j,cb);};require.store["web/views/page/overlays/o_embedCode.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_embedCode = me;
	cb.done();
};

me.a_bind = function(a,cb){
	var v = a.view;

	v.$el.on('blur','input',function(){
		v.a('code');
	});
	v.$el.on('focus','[prop="email"]',function(){
		v.$categories.hide();
	});
	v.a('code');
	v.$categories = v.$el.find('[area="category"]');

	v.$el.on('click','[prop="category"]',function(e){
		if (v.$categories.children().length < 1) return;
		v.$categories.show();
		e.stopPropogation();
		return false;
	});

	v.$el.on('click',function(){
		v.$categories.hide();
	});

	v.$el.on('click','[category]',function(){
		var $cat = $(this);
		var cat = $cat.attr('category');
		v.$el.find('[prop="category"]').val(cat).blur();
		v.$categories.hide();
	});

	v.a('popCategories');

	a.view.a('btn');
	cb.done();
};	

me.a_popCategories = function(a,cb){
	var v = a.view;
	jn.log('page:',v.branch.page);
	if (!v.branch.page || !v.branch.page.rec || !v.branch.page.rec.parts || !v.branch.page.rec.parts.assets) 
		return cb.fail('no page defined');
	v.$categories.children().remove();
	for (var i=0,len=v.branch.page.rec.parts.assets.length;i<len;i++){
		var cat = v.branch.page.rec.parts.assets[i];
		var $li = $('<li></li>');
		$li.html(cat.category);
		$li.attr({category:cat.category});
		v.$categories.append($li);
	}
};

me.a_code = function(a,cb){
	var v = a.view;
	var vals = v.a('vals');
	var code = '&lt;div <b>id</b>="brandisty" <b>pageId</b>="'+v.branch.page.id+'" ';
	if (vals.category) code += '<b>category</b>="'+vals.category+'" ';
	if (vals.email) code += '<b>emailField</b>="'+vals.email+'" ';
	if (vals.company) code += '<b>companyField</b>="'+vals.company+'" ';
	if (vals.logo) code += '<b>logoField</b>="'+vals.logo+'" ';
	code += '&gt;&lt;/div&gt;';
	v.a('set',{code:code});
};

me.a_display = function(a, cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	$el.show();

	var wh = $(window).height(),
		//childHeight = a.$child.height(),
		$scrollDiv = $el.find('.scroll-hldr'),
		mh = $el.height();
		console.log('Mh, ', mh);
		console.log('Wh, ', wh);

   	if(mh >= wh - 100) {
   		$scrollDiv.height(wh - 100);
    }
	
	$scrollDiv.mCustomScrollbar({
		theme: 'dark',
		autoHideScrollbar: false,
		//mouseWheel:false,
		contentTouchScroll:false,
		scrollInertia: 20,
		advanced:{
			updateOnContentResize: true,
			autoScrollOnFocus:false
		}
	});

	cb.done();
};return module.exports(j,cb);};require.store["web/views/page/overlays/o_hostLink.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_hostLink = me;
	cb.done();
};

me.a_bind = function(a,cb){
	var v = a.view;

	var link= 'https://'+jn.config.domain+'/hostLink.html?id='+v.branch.page.id;
	v.a('set',{link:link});

	ZeroClipboard.config({swfPath:'flash/zeroClipboard.swf'});
	var zero = new ZeroClipboard(v.$el.find('[zclip]'));
	zero.on('aftercopy',function(e){
		v.branch.alert.a('show',{
			message:'Copied to clipboard',
			type:'success',
			hideAfter:1000
		})
    	//jn.log('Copied text to clipboard: '+e.data['text/plain']);
  	});
	zero.on('copy',function(e){
		//
		var val = v.$el.find('[prop="link"]').val();
		jn.log('copy:',val);
		e.clipboardData.setData('text/plain',val);
	});


	cb.done();
};

me.a_display = function(a, cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	$el.show();

	var wh = $(window).height(),
		//childHeight = a.$child.height(),
		$scrollDiv = $el.find('.scroll-hldr'),
		mh = $el.height();
		console.log('Mh, ', mh);
		console.log('Wh, ', wh);

   	if(mh >= wh - 100) {
   		$scrollDiv.height(wh - 100);
    }
	
	$scrollDiv.mCustomScrollbar({
		theme: 'dark',
		autoHideScrollbar: false,
		//mouseWheel:false,
		contentTouchScroll:false,
		scrollInertia: 20,
		advanced:{
			updateOnContentResize: true,
			autoScrollOnFocus:false
		}
	});

	cb.done();
};return module.exports(j,cb);};require.store["web/views/page/overlays/o_pageRemove.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_pageRemove = me;
	cb.done();
};

/*
a_bind (fun):
	---a---
	prevView
*/
me.a_bind = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('btn');
	b.spot = a.spot;
	b.prev = a.prev;
	cb.done();
};

me.a_display = function(a, cb) {
	var $el = a.view.a('$el'), b = a.view.branch;
	$el.show();
	var h = $el.outerHeight();
	console.log('overlay height, ', h);
	$el.css('margin-top', -(h/2));
	cb.done();
};

me.a_cancel = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	//close this overlay and show prev
	a.view.a('hide');
	b.prev.a('show');
};

me.a_remove = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	jn.ch(function(d,ch){
		//remove spot from page
		b.page.a('remove',ch);
	}).ch(function(d,ch){
		b.overlay.a('hide');
		window.location = '/page';
		cb.done();
	}).fail(b.err);
};
return module.exports(j,cb);};require.store["web/views/page/overlays/o_pageSettings.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_pageSettings = me;
	cb.done();
};


me.a_bind = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('reset');
	a.view.a('btn');
	$el.find('[area="password"]').hide();
	a.view.a('model',{model:b.page},cb);
	if (!b.com.features.privacy) $el.find('[section="private"]').addClass('disabled');
	else $el.find('[section="private"]').removeClass('disabled');
	$el.on('click','[prop="isPrivate"]',function(){
		if (!b.com.features.privacy){ //no privacy feature
			a.view.a('hide');
			b.overlay.child('o_selectPlan').a('show');
			return false;
		}
		if ($el.find('[prop="isPrivate"][value="1"]').is(':checked')) $el.find('[area="password"]').show();
		else $el.find('[area="password"]').hide();
	});
	
	console.log('access level', b.com.features);
	if (!b.com.features.whiteLabel) $el.find('[section="whiteLabel"]').addClass('disabled');
	else $el.find('[section="whiteLabel"]').removeClass('disabled');
	$el.on('click','[prop="isWhite"]',function(){
		if (!b.com.features.whiteLabel){ //no privacy feature
			a.view.a('hide');
			b.overlay.child('o_selectPlan').a('show');
			return false;
		}
		if ($el.find('[prop="isWhite"][value="1"]').is(':checked')) $el.find('[area="wlSettings"]').show();
		else $el.find('[area="wlSettings"]').hide();
	});

};

me.a_display = function(a, cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	$el.show();

	var wh = $(window).height(),
		//childHeight = a.$child.height(),
		$scrollDiv = $el.find('.scroll-hldr'),
		mh = $el.height();
		console.log('Mh, ', mh);
		console.log('Wh, ', wh);

   	if(mh >= wh - 100) {
   		$scrollDiv.height(wh - 225);
    }
	
	$scrollDiv.mCustomScrollbar({
		theme: 'dark',
		autoHideScrollbar: false,
		//mouseWheel:false,
		contentTouchScroll:false,
		scrollInertia: 20,
		advanced:{
			updateOnContentResize: true,
			autoScrollOnFocus:false
		}
	});

	cb.done();
};

me.a_rec = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('set',b.page.rec);

	jn.ch(function(d,ch){
		if (b.page.rec.isPrivate){
			$el.find('[prop="isPrivate"][value="1"]').attr({checked:'checked'});
			$el.find('[area="password"]').show();
		}
		if (b.page.rec.isWhite){
			$el.find('[prop="isWhite"][value="1"]').attr({checked:'checked'});
			$el.find('[area="wlSettings"]').show();
		}
		ch.done();
	}).ch(function(d,ch){
		b.page.a('getPassword',ch);
	}).ch(function(d,ch){
		if (d.password) $el.find('[prop="password"]').val(d.password);
	}).ch(cb.done).fail(b.err);
};

me.a_save = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	var vals = a.view.a('vals');

	jn.ch(function(d,ch){
		var update = {};
		if (vals.isPrivate == '1') update.isPrivate = true;
		else update.isPrivate = false;
		if (vals.isWhite == '1') update.isWhite = true;
		else update.isWhite = false;
		if (vals.password.length > 0) update.password = vals.password;
		if (vals.isPrivate == b.page.rec.isPrivate && vals.isWhite == b.page.rec.isWhite && vals.password == b.page.rec.password)
			return ch.done();
		b.page.a('update',update,{
			fail:function(res){
				jn.log('update fail:',res);
				ch.fail(res);
			},
			done:function(res){
				jn.log('update done:',res);
				ch.done(res);
			}
		});
	}).ch(function(d,ch){
		jn.log('update next');
		if (vals.name == b.page.rec.name) return ch.done();
		b.page.a('setName',{name:vals.name},ch);
	}).ch(function(d,ch){
		if (vals.customUrl.length < 1) return ch.done();
		b.page.a('setCustomUrl',{customUrl:vals.customUrl},ch);
	}).ch(function(d,ch){
		if (vals.customHost.length < 1) return ch.done();
		b.page.a('setCustomHost',{customHost:vals.customHost},ch);
	}).ch(function(d,ch){
		b.overlay.a('hide',ch);
		b.alert.a('show',{message:'page saved',type:'success'});
	}).ch(cb.done).fail(b.err);
};

me.a_selectPlan = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	a.view.a('hide');
	b.overlay.child('o_selectPlan').a('show');
};

me.a_removePage = function(a,cb){
	var v = a.view, b = v.branch;
	v.a('hide');
	v.branch.overlay.child('o_pageRemove').a('show'); 
};return module.exports(j,cb);};require.store["web/views/page/overlays/o_sharePage.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_sharePage = me;
	cb.done();
};

me.a_bind = function(a,cb){ //bind user events here
	var $el = a.view.a('$el'), b = a.view.branch;

	a.view.a('model',{model:b.page});
	a.view.a('btn');

	$el.find('[prop="link"]').attr('readonly','readonly');

	$el.on('click','[prop="link"]',function(){
		$(this).select();
	});

	cb.done();
};

me.a_rec = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	if (!b.page.rec) return cb.fail('no rec for this page');
	var data = {};
	if (b.page.rec.customUrl) data.link = 'https://'+jn.config.domain+'/'+b.page.rec.customUrl;
	else data.link = 'https://'+jn.config.domain+'/page?id='+b.page.rec.id;
	a.view.a('set',data);
};

me.a_sendEmail = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	var vals = a.view.a('vals');
	delete vals.link;
	if (!vals.email) return b.err('enter an email');
	if (!me.sent) me.sent = [];
	if (me.sent.indexOf(vals.email) !== -1) return b.err('share already sent to this email');

	jn.ch(function(d,ch){
		b.page.a('share',vals,ch);
	}).ch(function(d,ch){
		$el.find('[prop="email"]').val('');
		b.alert.a('show',{type:'success',message:'Email sent to '+vals.email},ch);
	}).ch(cb.done).fail(b.err);
};return module.exports(j,cb);};require.store["web/views/page/overlays/o_teamMemberInvite.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_teamMemberInvite = me;
	cb.done();
};

me.a_bind = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('reset');
	a.view.a('btn');
	cb.done();
};

me.a_send = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	var vals = a.view.a('vals');
	jn.ch(function(d,ch){
		b.page.a('sendTeamInvite',vals,ch);
	}).ch(function(d,ch){
		a.view.a('hide');
		b.alert.a('show',{type:'success',message:'team invite sent to: '+vals.email});
		b.overlay.child('o_teamMembers').a('show',ch);
	}).ch(cb.done).fail(b.err);
};
return module.exports(j,cb);};require.store["web/views/page/overlays/o_teamMemberInviteRow.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_teamMemberInviteRow = me;
	cb.done();
};

me.a_bind = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('set',{email:a.view.email});
	a.view.a('btn');
	cb.done();
};

me.a_removeMember = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	jn.ch(function(d,ch){
		b.page.a('removeInvite',{email:a.view.email},ch);
	}).ch(function(d,ch){
		a.view.a('hide',ch);
	}).ch(cb.done).fail(b.err);
};return module.exports(j,cb);};require.store["web/views/page/overlays/o_teamMemberRemove.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_teamMemberRemove = me;
	cb.done();
};

/*
a_bind (fun):
	---a---
	userId
	prevView
*/
me.a_bind = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('btn');
	b.userId = a.userId;
	b.prev = a.prev;
	cb.done();
};

me.a_display = function(a, cb) {
	var $el = a.view.a('$el'), b = a.view.branch;
	$el.show();
	var h = $el.outerHeight();
	console.log('overlay height, ', h);
	$el.css('margin-top', -(h/2));
	cb.done();
};

me.a_cancel = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	//close this overlay and show prev
	a.view.a('hide');
	b.prev.a('show');
};

me.a_remove = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	jn.ch(function(d,ch){
		b.page.a('removeTeamMember',{userId:b.userId},ch);
	}).ch(function(d,ch){
		a.view.a('hide',ch);
		b.prev.a('show');
	}).fail(b.err);
};
return module.exports(j,cb);};require.store["web/views/page/overlays/o_teamMemberRow.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_teamMemberRow = me;
	cb.done();
};

me.a_bind = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('btn');
	a.view.user = jn.m('users',{id:a.view.userId});
	a.view.a('model',{model:a.view.user});
	cb.done();
};

me.a_rec = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('set',a.view.user.rec);
};

me.a_removeMember = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	jn.ch(function(d,ch){
		a.view.parent.a('hide');
		b.overlay.child('o_teamMemberRemove').a('show',{userId:a.view.userId,prev:a.view.parent},ch);
	}).ch(cb.done).fail(b.err);
};return module.exports(j,cb);};require.store["web/views/page/overlays/o_teamMembers.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_teamMembers = me;
	cb.done();
};

me.a_bind = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('btn');

	jn.log('team members show');

	jn.ch(function(d,ch){
		b.page.a('getTeam',ch);
	}).ch(function(d,ch){
		if (!d.team || !d.team.users) return ch.done();
		jn.log('team:',d.team);
		jn.loop({
			ary:d.team.users
		},{
			loop:function(loop){
				var user = d.team.users[loop.i];
				a.view.child('o_teamMemberRow',{userId:user}).a('show',{
					done:loop.next,
					fail:ch.fail
				});
			},
			done:ch.done
		});
	}).ch(function(d,ch){
		b.com.a('getNumUsers',ch);
	}).ch(function(d,ch){
		var numUsers = d.numUsers;
		if (b.com.features.maxUsers >= numUsers){
			$el.find('[section="teamMembers"]').addClass('disabled');
		}
		else {
			$el.find('[section="teamMembers"]').removeClass('disabled');
		}
		ch.done();
	}).ch(function(d,ch){ //show pending invites
		b.page.a('getPageInvites',ch);
	}).ch(function(d,ch){
		jn.log('invites:',d);
		if (!d.recs) return ch.done();
		jn.loop({
			ary:d.recs
		},{
			loop:function(loop){
				var invite = d.recs[loop.i];
				a.view.child('o_teamMemberInviteRow',{email:invite.email}).a('show',{
					done:loop.next,
					fail:ch.fail
				});
			},
			done:ch.done
		});
	}).ch(cb.done).fail(b.err);
};

me.a_invite = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	jn.ch(function(d,ch){
		b.com.a('getNumUsers',ch);
	}).ch(function(d,ch){
		var numUsers = d.numUsers;
		if (b.com.features.maxUsers >= numUsers){
			a.view.a('hide');
			b.overlay.child('o_selectPlan').a('show');
		}
		else {
			a.view.a('hide');
			b.overlay.child('o_teamMemberInvite').a('show');
		}
	});
};

me.a_selectPlan = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	a.view.a('hide');
	b.overlay.child('o_selectPlan').a('show');
};
return module.exports(j,cb);};require.store["web/views/page/overlays/o_upload.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.o_upload = me; //defining statement - without this, me does not get exposed
	cb.done();
};

/*
***** model *****
*/
me.a_bind = function(a,cb){
	var $el = a.view.a('$el');
	var b = a.view.branch;

	jn.ch(function(d,ch){ //check maxAssets against numAssets
		if (!b.com.features || !b.com.features.maxAssets) return ch.done();
		b.com.a('getNumAssets',{
			fail:ch.fail,
			done:function(res){
				if (b.com.features.maxAssets <= res.numAssets){ //over max
					a.view.a('hide');
					b.overlay.child('o_selectPlan').a('show');

					//	stop upload dragover from triggering.
					$('body').addClass('dropDisabled');
					return cb.done();
				}
				ch.done();
			}
		});
	}).ch(function(d,ch){

		var path = 'comm/?obj='+jn.web.packObj({
			path:'ent/m/'+b.page._path,
			a:'upload',
			reqId:jn.comm.reqId()
		});
		var $loadAni = $el.find('.loading-ani span');
		jn.v('upload').a('drop',{
			$drop:$el.find('[area="drop"]'),
			$form:$el.find('form'),
			path:path,
			submit:function(res,resCb){
				if (!res.files || res.files.length < 1) return 'no file chosen';
				var file = res.files[0];
				if (!file.name) return 'no file name';
				//get file extension
				var ext = jn.m.assets.getExt(file.name);
				//if (ext != 'eps') return 'file type must be .eps';
				$el.find('.upload').addClass('upload-in-progress');
				$el.find('.uploadForm').addClass('spinner');
				$loadAni.css({width:'0%'});
				return false;
			},
			progress:function(res){
				var w = (Number(res.done)/Number(res.total))*100;
				//jn.log('progress:',w);
				$loadAni.css({width:w+'%'});
			},
			complete:function(res){
				$el.find('.upload').removeClass('upload-in-progress');
				$el.find('.uploadForm').removeClass('spinner');
				$el.find('input[type="file"]').val('');
				jn.log('upload complete res:',res);
				if (res.parts){ //update parts (to fix an async issue)
					b.page.rec.parts = res.parts;
				}

				if (res.assets && res.assets.length > 0){
					var asset = jn.m(res.assets[0].asset);
					var type = res.assets[0].type;

					a.view.a('hide');
					if (type == 'eps') b.overlay.child('o_logoOverlay').a('show',{uploaded:asset.id});
					else if (type == 'font') b.overlay.child('o_fontOverlay').a('show',{uploaded:asset.id});
					else if (type == 'image') b.overlay.child('o_imageOverlay').a('show',{uploaded:asset.id});
					else if (type == 'pdf') b.overlay.a('hide');
				}
			},
			error:function(res){
				jn.log('upload fail:',res);
				$el.find('.upload').removeClass('upload-in-progress');
				$el.find('.uploadForm').removeClass('spinner');
				$el.find('.loading-ani span').css({width:'0%'});

				if (res == 'raster in vector' || (res.res && res.res == 'raster in vector')){
					res = 'This vector file has raster images in it. Remove the images and try again. <a href="http://blog.brandisty.com/why-your-brand-needs-a-vector-logo/" rel="external">Learn why.</a>';
				}
				b.err(res);
			}
		},ch);
	}).ch(function(d,ch){
		cb.done();
	}).fail(function(res){
		$el.find('.upload').removeClass('upload-in-progress');
		$el.find('.uploadForm').removeClass('spinner');
		$el.find('.loading-ani span').css({width:'0%'});
		b.err(res);
	});
};

me.a_display = function(a, cb) {
	var $el = a.view.a('$el'), b = a.view.branch;
	$el.show();
	var h = $el.outerHeight();
	console.log('overlay height, ', h);
	$el.css('margin-top', -(h/2));
	cb.done();
};

me.a_hide = function(a,cb){
	var b = a.view.branch;
	a.view.a('hide',{root:true},cb);
	$('body').removeClass('dropDisabled');
};
return module.exports(j,cb);};require.store["web/views/page/p_asset.js"]=function(j,cb){var module = {};var jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v.p_asset = me;
	cb.done();
};

me.a_attach = function(a,cb){
	a.view.a('attach',{attach:'type',root:true},cb);
};

/*
***** model *****
*/
me.a_build = function(a,cb){ //happens once, bind models to view here
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('access',{access:b.access});
	cb.done();
};

me.a_bind = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;

	a.view.a('btn');

	a.view.parent.$el.find('[btn="downloadPage"]').hide();
	jn.ch(function(d,ch){
		a.view.a('model',{model:b.page},ch);
	}).ch(function(d,ch){
		a.view.a('buildPart',{type:'assets',show:'p_h_assetCat'},ch);
	}).cb(cb);
};

me.a_hide = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	a.view.a('hide',{root:true});
};

me.a_rec = function(a,cb){
	var v = a.view;

	var rec = v.branch.page.rec;

	jn.ch(function(d,ch){
		a.view.a('set',v.branch.page.rec,ch);
	}).ch(function(d,ch){ //show cats
		if (!rec.parts){
			v.$el.find('[area="noAssets"]').show();
			v.$el.find('[area="assets"]').hide();
			v.$el.find('[btn="addContent"]').addClass('highlight');
			return cb.done(); //no parts, return
		}
		v.$el.find('[area="noAssets"]').hide();
		v.$el.find('[area="assets"]').show();
		a.view.a('buildPart',{type:'assets',show:'assetCat'},ch);
	}).cb(cb);
};


/*
a_buildPart (fun):
	---a---
	type
	show (str): view pattern to show
*/
me.a_buildPart = function(a,cb){
	var $el = a.view.a('$el'), b = a.view.branch;
	var rec = b.page.rec;
	var shown = [];
	if (rec.parts[a.type]){
		var part = rec.parts[a.type];
		for (var i=0,len=part.length;i<len;i++){
			if (part[i]){
				var pos = a.type+'.'+i;
				//jn.log('cat:',part[i]);
				a.view.child(a.show,{pos:pos}).a('show',{cat:part[i],rebuild:true});
				shown.push(pos);
			}
		}
	}
	//if additional categories are shown, hide them
	$el.find('[v="'+a.show+'"]').each(function(){
		var $this = $(this);
		var pos = $this.attr('pos');
		if (shown.indexOf(pos) === -1){ //not shown, hide
			a.view.child(a.show,{pos:pos}).a('hide');
		}
	});
	cb.done();
};

/*
***** btn *****
*/
me.a_addContent = function(a, cb) {
	var $el = a.view.a('$el'), b = a.view.branch;
	jn.ch(function(d,ch){
		if (!b.com.features.maxAssets) return ch.done();
		b.com.a('getNumAssets',{
			fail:ch.fail,
			done:function(res){
				console.log("DEBUG", b.com.features.maxAssets, res.numAssets);
				if (b.com.features.maxAssets <= res.numAssets){ //over max
					b.overlay.child('o_selectPlan').a('show');
					return cb.done();
				}
				ch.done();
			}
		});
	}).ch(function(d,ch){
		b.overlay.child('o_upload').a('show');
		ch.done();
	}).ch(cb.done).fail(b.err);
};

me.a_settings = function(a, cb){
	var b = a.view.branch;
	b.overlay.child('o_settings').a('show');
};

me.a_embedCode = function(a, cb){
	var b = a.view.branch;
	b.overlay.child('o_embedCode').a('show');
};
return module.exports(j,cb);};require.store["web/views/page/p_brand.js"]=function(j,cb){var module = {};var vp = 'p_brand', jn;
var me = module.exports = function(j,cb){
	jn = j, jn.v[vp] = me;
	cb.done();
};

//***** const *****
var heroMinusH = 480;

me.a_attach = function(a,cb){
	var v = a.view;
	v.a('attach',{attach:'type',root:true},cb);
};

/*
***** model *****
*/
me.a_build = function(a,cb){ //happens once, bind models to view here
	var v = a.view;
	v.$section = v.$el.find('.section');
	cb.done();
};

me.a_bind = function(a,cb){
	var v = a.view;

	//v.$el.find('[area]').hide();

	v.a('btn');
	v.a('model',{model:v.branch.page}); //calls a_rec on updates (and get), and a_remove on remove
	v.a('access',{access:v.branch.access});
	v.a('str');

	v.$footer = v.$el.find('[area="footer"]');
	v.$leftShow = v.$el.find('[btn="leftShow"]');
	v.$pageNavShow = v.$el.find('[btn="pageNavShow"]');
	v.$hero = v.$el.find('[area="hero"]');
	v.$nav = v.$el.find('[area="nav"]');

	if (v.branch.com.features.footer && !v.branch.white) v.$footer.show(); //footer show
	else v.$footer.hide();

	if (v.branch.white){ //if white label version or not a team member
		v.$leftShow.hide();
		v.$pageNavShow.hide();
	}

	v.branch.win.a('bind',{
		resize:function(res){
			v.a('resize',res);
		}
	});
	v.branch.win.a('touch');

	if (v.branch.$areaPage){
		v.branch.$areaPage.on('scroll',function(){

			if (v.branch.navFixed) return;
			var scroll = v.branch.$areaPage.scrollTop();
			if (scroll > 0){
				v.$nav.addClass('fixed');
			}
			else {
				v.$nav.removeClass('fixed');
			}
		});
	}

	// Add Svble background color to alternating sections
	v.$el.find('.section.block:odd').addClass('alt');

	v.$el.on('mouseenter','.category-hldr',function(e){
		var textarea = $(this).find('[prop="descrip"]');
		textarea.addClass('editable');
	}).on('mouseleave', function(e){
		$(this).find('[prop="descrip"]').removeClass('editable');
	});

	cb.done();
};

me.a_scrollBtn = function(a,cb){
	var v = a.view;
	var scrollTo = a.$btn.attr('scroll');
	a.$btn.siblings().removeClass('active');
	a.$btn.addClass('active');
	var $to = v.$el.find('[area="'+scrollTo+'"]');
	var top = $to.offset().top + v.branch.$areaPage.scrollTop();
	v.branch.$areaPage.animate({scrollTop:top});
};
me.a_hide = function(a,cb){
	var v = a.view;
	v.branch.$areaPage.off('scroll');
	v.a('hide',{root:true});
};

me.a_resize = function(a,cb){
	var v = a.view;
	v.branch.winH = a.dim.h;
	v.$el.find('.hero-section').height(a.dim.h-heroMinusH);
};

me.a_rec = function(a,cb){
	var v = a.view;

	var rec = v.branch.page.rec;
	jn.ch(function(d,ch){
		v.a('set',v.branch.page.rec,ch);
	}).ch(function(d,ch){
		if (!rec.parts){ //no parts yet - show the default upload eps view
			jn.log('show default');

			v.a('showDefault');

			$('[btn="addContent"]').addClass('highlight');
			$('[btn="downloadPage"]').hide();
			return cb.done();
		}
		v.$el.find('[area="noAssets"]').hide();
		$('[btn="addContent"]').removeClass('highlight');
		$('[btn="downloadPage"]').show();
		v.$el.find('[area="nav"]').show();
		ch.done();
	}).ch(function(d,ch){
		if (!rec.parts.guide){
			v.$el.find('[area="guide"]').hide();
			v.$el.find('[scroll="guide"]').hide();
			return ch.done();
		}
		v.$el.find('[area="guide"]').show();
		v.$el.find('[scroll="guide"]').show();
		v.child('p_b_guide').a('show',{rebind:true,guideId:rec.parts.guide},ch);
	}).ch(function(d,ch){ //show cats
		if (!rec.parts.logos || rec.parts.logos.length < 1){
			v.$el.find('[area="logos"]').hide();
			v.$el.find('[scroll="logos"]').hide();
			v.branch.navFixed = true;
			v.$nav.addClass('fixed');
			//b.$siteNav.addClass('dark');
			$('[btn="downloadPage"]').hide();
			return ch.done();
		}
		v.$el.find('[area="logos"]').show();
		v.$el.find('[scroll="logos"]').show();
		v.branch.navFixed = false;
		//v.$nav.removeClass('fixed');
		//b.$siteNav.removeClass('dark');
		v.$el.find('[btn="downloadPage"]').show();
		v.$el.find('[btn="pageNavShow"]').css({visibility:'visible'});
		var part = rec.parts.logos;
		if (part[0] && part[0].assets.length > 0){
			v.$el.find('[area="hero"]').show();
			//show main logo
			var mainLogo;
			var mainLogoPos;
			for (var i=0,len=part[0].assets.length;i<len;i++){
				var logo = part[0].assets[i];
				jn.log('check main logo',mainLogo,logo);
				if (!mainLogo || (!mainLogo._gr && logo._gr) || 
					(logo._gr && logo._gr.y < mainLogo._gr.y) || 
					(logo._gr && logo._gr.y == mainLogo._gr.y && logo._gr.x < mainLogo._gr.x)){
					mainLogo = logo;
					mainLogoPos = 'logos.0.assets.'+i;
				}
			}

			v.child('p_b_mainLogo').a('show',{pos:mainLogoPos,spot:mainLogo,rebind:true});
		}
		else {
			v.$el.find('[area="hero"]').hide();
		}
		return v.a('buildPart',{type:'logos',show:'p_b_logoCat'},ch);
	}).ch(function(d,ch){ //colors
		if (!rec.parts.colors || rec.parts.colors.length < 1){
			v.$el.find('[area="colors"]').hide();
			v.$el.find('[scroll="colors"]').hide();
			return ch.done();
		}
		v.$el.find('[area="colors"]').show();
		v.$el.find('[scroll="colors"]').show();
		v.a('buildPart',{type:'colors',show:'p_b_colorCat'},ch);
	}).ch(function(d,ch){ //fonts
		if (!rec.parts.fonts || rec.parts.fonts.length < 1){
			v.$el.find('[area="fonts"]').hide();
			v.$el.find('[scroll="fonts"]').hide();
			return ch.done();
		}
		v.$el.find('[area="fonts"]').show();
		v.$el.find('[scroll="fonts"]').show();
		v.a('buildPart',{type:'fonts',show:'p_b_fontCat'},ch);
	}).ch(function(d,ch){ //images
		if (!rec.parts.images || rec.parts.images.length < 1){
			v.$el.find('[area="images"]').hide();
			v.$el.find('[scroll="images"]').hide();
			return ch.done();
		} 
		v.$el.find('[area="images"]').show();
		v.$el.find('[scroll="images"]').show();
		v.a('buildPart',{type:'images',show:'p_b_imageCat'},ch);
	}).cb(cb);
};


/*
a_showDefault (fun): show default page if brand page is empty
	---a---
*/
me.a_showDefault = function(a,cb){
	var v = a.view;

	v.$el.find('[area]').hide();
	v.$el.find('[area="noAssets"]').show();
	$('body').addClass('dropDisabled');

	v.$el.find('[area="pageSettings"]').show();

	//trigger upload functionality
	var $loader = v.$el.find('.loading-ani span');

	var path = 'comm/?obj='+jn.web.packObj({
		path:'ent/m/'+v.branch.page._path,
		a:'upload',
		reqId:jn.comm.reqId()
	});

	jn.v('upload').a('drop',{
		$drop:v.$el.find('[upload="drop"]'),
		$form:v.$el.find('[upload="uploadForm"]'),
		path:path,
		submit:function(res,resCb){
			if (!res.files || res.files.length < 1) return 'no file chosen';
			var file = res.files[0];
			if (!file.name) return 'no file name';
			//get file extension
			var ext = jn.m.assets.getExt(file.name);
			if (ext != 'eps') return 'file type must be .eps';
			v.$el.find('.upload').addClass('upload-in-progress');
			v.$el.find('.uploadForm').addClass('spinner');
			$loader.css({width:'0%'});
			return false;
		},
		progress:function(res){
			var w = (Number(res.done)/Number(res.total))*100;
			//jn.log('progress:',w);
			$loader.css({width:w+'%'});
		},
		complete:function(res){
			v.$el.find('.upload').removeClass('upload-in-progress');
			v.$el.find('.uploadForm').removeClass('spinner');
			v.$el.find('input[type="file"]').val('');

			v.$el.find('[area="pageSettings"]').show();
			$('body').removeClass('dropDisabled');
			jn.log('upload complete res:',res);
			if (res.parts){ //update parts (to fix an async issue)
				v.branch.page.rec.parts = res.parts;
			}

			if (res.assets && res.assets.length > 0){
				var asset = jn.m(res.assets[0].asset);
				var type = res.assets[0].type;
				v.branch.overlay.child('o_logoOverlay').a('show',{uploaded:asset.id});
			}
			//b.overlay.child('o_assetPlace').a('show',d);
		},
		error:function(res){
			jn.log('upload fail:',res);
			v.$el.find('.upload').removeClass('upload-in-progress');
			v.$el.find('.uploadForm').removeClass('spinner');
			v.$el.find('.loading-ani span').css({width:'0%'});

			if (res == 'raster in vector' || (res.res && res.res == 'raster in vector')){
				res = 'This vector file has raster images in it. Remove the images and try again. <a href="http://blog.brandisty.com/why-your-brand-needs-a-vector-logo/" rel="external">Learn why.</a>';
			}
			v.branch.err(res);
		}
	});

	//trigger invite functionality


};

me.a_logoRequest = function(a,cb){
	var v = a.view;
	var vals = v.a('vals');
	jn.ch(function(d,ch){
		v.branch.page.a('requestLogo',{email:vals.requestEmail},ch);
	}).ch(function(d,ch){
		v.a('reset');
		v.branch.alert.a('show',{type:'success',message:'logo request sent to: '+vals.requestEmail});
	}).ch(cb.done).fail(v.branch.err);	
};

/*
a_buildPart (fun):
	---a---
	type
	show (str): view pattern to show
*/
me.a_buildPart = function(a,cb){
	var v = a.view;
	var rec = v.branch.page.rec;
	var shown = [];
	if (rec.parts[a.type]){
		var part = rec.parts[a.type];
		for (var i=0,len=part.length;i<len;i++){
			if (part[i]){
				var pos = a.type+'.'+i;
				v.child(a.show,{pos:pos}).a('show',{cat:part[i],rebuild:true,ind:i,len:len});
				shown.push(pos);
			}
		}
	}
	//if additional categories are shown, hide them
	v.$el.find('[v="'+a.show+'"]').each(function(){
		var $this = $(this);
		var pos = $this.attr('pos');
		if (shown.indexOf(pos) === -1){ //not shown, hide
			v.child(a.show,{pos:pos}).a('hide');
		}
	});
	cb.done();
};

/*
***** btn *****
*/

me.a_addContent = function(a, cb) {
	var v = a.view;
	jn.ch(function(d,ch){
		if (!v.branch.com.features.maxAssets) return ch.done();
		v.branch.com.a('getNumAssets',{
			fail:ch.fail,
			done:function(res){
				if (v.branch.com.features.maxAssets <= res.numAssets){ //over max
					v.branch.overlay.child('o_selectPlan').a('show');
					return cb.done();
				}
				ch.done();
			}
		});
	}).ch(function(d,ch){
		v.branch.overlay.child('o_addContent').a('show');
		ch.done();
	}).ch(cb.done).fail(v.branch.err);
};

me.a_colorAdd = function(a,cb){
	var v = a.view;
	v.branch.overlay.child('o_colorAdd').a('show');
};

me.a_settings = function(a, cb){
	var v = a.view;
	v.branch.overlay.child('o_settings').a('show');
};

me.a_addContent = function(a, cb) {
	var v = a.view;
	jn.ch(function(d,ch){
		if (!v.branch.com.features.maxAssets) return ch.done();
		v.branch.com.a('getNumAssets',{
			fail:ch.fail,
			done:function(res){
				if (v.branch.com.features.maxAssets <= res.numAssets){ //over max
					v.branch.overlay.child('o_selectPlan').a('show');
					return cb.done();
				}
				ch.done();
			}
		});
	}).ch(function(d,ch){
		v.branch.overlay.child('o_addContent').a('show');
		ch.done();
	}).ch(cb.done).fail(v.branch.err);
};

me.a_upload = function(a,cb){
	var v = a.view;
	v.branch.overlay.child('o_upload').a('show');
};
return module.exports(j,cb);};require.store["web/views/page/p_host.js"]=function(j,cb){var module = {};var vp = 'p_host', jn;
var me = module.exports = function(j,cb){
	jn = j, jn.v[vp] = me;
	cb.done();
};
var showNum = 20;
me.a_build = function(a,cb){ //happens once, bind models to view here
	var v = a.view;
	v.branch.pageView = a.view;
	v.a('access',{access:v.branch.access});
	v.$selectAll = v.$el.find('[btn="selectAll"]');
	v.$deselectAll = v.$el.find('[btn="deselectAll"]');
	cb.done();
};
me.a_bind = function(a,cb){
	var v = a.view;
	$('body').addClass('dropDisabled');
	v.a('btn');
	v.a('model',{model:v.branch.page}); //calls a_rec on updates (and get), and a_remove on remove
	v.parent.$el.find('[btn="downloadPage"]').hide();

	v.$deselectAll.hide();
	v.$selectAll.show();

	v.$el.find('[area="noAssets"]').hide();

	v.selected = [];

	var searchTimeout;

	v.curPage = 1;

	v.$el.on('input keyup','[prop="search"]',function(){
		if (searchTimeout) clearTimeout(searchTimeout);
		searchTimeout = setTimeout(function(){
			var search = v.$el.find('[prop="search"]').val();
			search = search.toLowerCase();
			v.search = search;
			
			v.a('buildAssets');
		},300);
	});

	v.branch.$areaPage.on('scroll',function(){
		var scroll = v.branch.$areaPage.scrollTop();
		var pageH = v.$el.height();
		var winDim = v.branch.win.a('dim');
		if (scroll+winDim.h >= pageH){ //load next page
			v.curPage++;
			v.a('showPage',{page:v.curPage});
		}
		//jn.log('scroll:',scroll,pageH,winDim.h);
	});

	cb.done();
};
/*
a_buildAssets (fun):
	---a---
	page
*/
me.a_buildAssets = function(a,cb){
	var v = a.view;

	v.activeAssets = v.activeAssets || [];

	var i = v.allAssets.length-1;
	var assets = [];
	//var shown = 0;
	if (!v.search || v.search.length < 1){ //show default views
		assets = v.allAssets;
	}
	else { //v.search is defined
		//jn.log('all assets:',v.allAssets);
		for (var i=0,len=v.allAssets.length;i<len;i++){
			var asset = v.allAssets[i];
			var match = false;
			//jn.log('asset:',asset);
			if (asset.company && asset.company.toLowerCase().indexOf(v.search) !== -1) match = true;
			else if (asset.email && asset.email.toLowerCase().indexOf(v.search) !== -1) match = true;
			else if (v.search == asset.id) match = true;
			if (match){
				assets.push(asset);
			}
		}
	}

	//jn.log('search assets:',assets);
	for (var i=0,len=v.activeAssets.length;i<len;i++){
		var shown = v.activeAssets[i];
		var found = undefined;

		//check that it exists in new asset array
		for (var j=0,lenJ=assets.length;j<lenJ;j++){
			var asset = assets[j];
			if (shown.source && shown.source == asset.source) found = j;
			if (!shown.source && shown.id == asset.id) found = j;
		}

		//if not found, hide
		if (found === undefined && shown.view){
			jn.log('hide:',shown.view.v);
			shown.view.a('hide',{
				fail:function(){},
				done:function(){
					//remove shown from the array

				}
			});
		}
	}
	v.activeAssets = assets;
	v.shownAssets = [];

	//jn.log('activeAssets 2 2222:',v.curPage);

	jn.ch(function(d,ch){
		for (var i=1;i<=v.curPage;i++){
			jn.log('shw page:',i);
			v.a('showPage',{page:i,isNew:a.isNew});
		}
		ch.done();
	}).cb(cb);
	
};
me.a_showPage = function(a,cb){
	var v = a.view;

	a.page = a.page || 1;

	var shown = 0;
	var i = (a.page-1)*showNum;
	if (i < 0) i = 0;

	//jn.log('i start:',i,v.activeAssets.length);
	//var assets;
	while (i<v.activeAssets.length && shown<showNum){
		var asset = v.activeAssets[i];
		if (asset.source) asset.view = v.child('h_logoRow',{source:asset.source});
		else asset.view = v.child('h_logoRow',{id:asset.id});
		//jn.log('show:',asset.view.v);
		var selected = (v.selected.indexOf(asset.id) !== -1)? true: false;
		asset.view.a('show',{spot:v.activeAssets[i],page:a.page,isNew:a.isNew,selected:selected});
		v.shownAssets.push(asset);
		i++;
		shown++;
	}
	if (shown === 0 && v.curPage > 1) v.curPage--;
	return cb.done();

	
	cb.done();
};
me.a_attach = function(a,cb){
	var v = a.view;
	v.a('attach',{attach:'type',root:true},cb);
};
me.a_hide = function(a,cb){
	var v = a.view;
	v.a('hide',{root:true});
};
me.a_rec = function(a,cb){
	var v = a.view;

	var rec = v.branch.page.rec;

	jn.ch(function(d,ch){
		v.a('set',v.branch.page.rec,ch);
	}).ch(function(d,ch){ //show cats
		if (!rec.parts){
			v.$el.find('[area="noAssets"]').show();
			v.$el.find('[area="assets"]').hide();
			v.$el.find('[btn="embedCode"]').addClass('highlight');
			return cb.done(); //no parts, return
		} 
		v.$el.find('[area="noAssets"]').hide();
		v.$el.find('[area="assets"]').show();
		v.a('logos',ch);
	}).cb(cb);
};
me.a_logos = function(a,cb){
	var v = a.view;
	var rec = v.branch.page.rec;

	//collect all assets into one large array in reverse order of when they were uploaded

	//consider adding new asset, removal of an asset, updating an asset
	//hide views that are removed
	var assets = [];
	for (var i=0,len=rec.parts.assets.length;i<len;i++){
		var cat = rec.parts.assets[i];
		for (var j=0,lenJ=cat.assets.length;j<lenJ;j++){
			var spot = cat.assets[j];
			assets.unshift(spot);
		}
	}

	var isNew = (v.allAssets && v.allAssets.length < assets.length)? true: false;

	v.allAssets = assets.slice(0);

	var numAssetStr = (v.allAssets.length === 1)? '1 logo collected': v.allAssets.length + ' logos collected';

	v.a('set',{numAssets:numAssetStr});

	jn.log('all assets:',v.allAssets);

	v.a('buildAssets',{isNew:isNew},cb);
};

/*
***** btn *****
*/
me.a_addLogo = function(a,cb){
	var v = a.view;
	v.branch.overlay.child('h_addLogo').a('show');
};
me.a_settings = function(a,cb){
	var v = a.view;
	v.branch.overlay.child('o_settings').a('show');
};
me.a_link = function(a,cb){
	var v = a.view;
	v.branch.overlay.child('o_hostLink').a('show');
};
me.a_embedCode = function(a,cb){
	var v = a.view;
	v.branch.overlay.child('o_embedCode').a('show');
};
me.a_addCategory = function(a,cb){
	var v = a.view;
	v.branch.overlay.child('o_addCategory').a('show');
};
me.a_select = function(a,cb){
	var v = a.view;
	var ind = v.selected.indexOf(a.logoId);
	if (ind === -1) v.selected.push(a.logoId);
	v.a('set',{numSelected:v.selected.length});
};
me.a_deselect = function(a,cb){
	var v = a.view;
	var ind = v.selected.indexOf(a.logoId);
	if (ind !== -1) v.selected.splice(ind,1);
	v.a('set',{numSelected:v.selected.length});
};
me.a_selectAll = function(a,cb){
	var v = a.view;
	for (var i=0,len=v.activeAssets.length;i<len;i++){
		var shown = v.activeAssets[i];
		if (shown.view) shown.view.a('select');
		else v.a('select',{logoId:shown.id});
	}
	v.$deselectAll.show();
	v.$selectAll.hide();
};
me.a_deselectAll = function(a,cb){
	var v = a.view;
	for (var i=0,len=v.activeAssets.length;i<len;i++){
		var shown = v.activeAssets[i];
		if (shown.view) shown.view.a('deselect');
		else v.a('deselect',{logoId:shown.id});
	}
	v.$deselectAll.hide();
	v.$selectAll.show();
};
me.a_download = function(a,cb){
	var v = a.view;
	if (v.selected.length < 1) return v.branch.err('select a logo to download');
	v.branch.overlay.child('h_downloadSelected').a('show',{logos:v.selected});
};return module.exports(j,cb);};require.store["web/views/page/page.js"]=function(j,cb){var module = {};var view = 'page',jn;
var me = module.exports = function(j,cb){
	jn = j, jn.v[view] = me;
	cb.done();
};
me.a_build = function(a,cb){
	var v = a.view;

	//**** DEFINE VIEW HANDLES ****
	v.$annoying = v.$el.find('[area="annoying"]');
	v.$downloadPage = v.$el.find('[btn="downloadPage"]');
	v.$pageSettings = v.$el.find('[area="pageSettings"]');
	v.$leftShow = v.$el.find('[btn="leftShow"]');
	v.branch.$areaPage = v.$el.find('[area="page"]');

	//**** HIDE AREAS ****
	v.$annoying.hide();
	v.$downloadPage.hide();
	v.$leftShow.hide();
	v.$pageSettings.hide();

	//**** DEFINE OVERLAY ****
	v.branch.overlay = v.child('overlay');

	//**** DEFINE URI VARS *****
	v.uriVars = jn.uriVars();

	v.a('section'); //hide all section tags
	v.section = 'page';

	//**** CH ****
	jn.ch(function(d,ch){
		v.a('getPageId',ch);
	}).ch(function(d,ch){
		if (!v.id){ //no id found
			if (!v.branch.sessUser) return window.location = '/'; //go to home page
			v.section = 'noPage'; //if no view id, show no page
			v.a('section',{show:v.section});
			return cb.done();
		}
		v.branch.page = jn.m('pages',{id:v.id});
		v.a('model',{model:v.branch.page},ch); //bind to page
	}).ch(function(d,ch){ //get page access
		v.branch.page.a('access',ch);
	}).ch(function(d,ch){
		v.branch.access = v.a('getAccess',{access:d.access});
		v.branch.isAccess = function(acc){
			if (v.branch.access.indexOf(acc) !== -1) return true;
			return false;
		};
		if (v.branch.sessUser && v.branch.isAccess('public')) v.branch.access = ['user'];
		v.branch.page.access = v.branch.access;
		v.branch.page.isAccess = v.branch.isAccess;
		v.a('access',{access:v.branch.access});

		if (!v.branch.isAccess('team') && v.branch.page.rec.isPrivate && !v.allowedAccess) v.section = 'password';
		if (!v.branch.page.rec.company) return ch.fail('no company on page');
		
		v.branch.com = jn.m('company',{id:v.branch.page.rec.company});
		v.a('model',{model:v.branch.com,rec:function(){
			v.a('company');
		}},ch);
	}).ch(function(d,ch){
		if (v.section == 'page'){
			v.$downloadPage.show();
			v.$leftShow.show();
			if (v.branch.isAccess('team')) v.$pageSettings.show();
			else v.$pageSettings.hide();
			v.pageComplete = true;
		}
		v.a('section',{show:v.section});
		ch.done();
	}).ch(cb.done).fail(v.branch.err);
};

me.a_getPageId = function(a,cb){
	var v = a.view;
	if (v.id) return cb.done();
	if (v.uriVars.id){ //id defined in uri
		v.id = v.uriVars.id;
		return cb.done();
	}
	jn.ch(function(d,ch){ //check if page is a custom url
		var url = window.location.pathname;
		if (url.substr(0,1) == '/') url = url.substr(1);
		if (url.indexOf('page') === 0) return ch.done(); //if page, then skip
		jn.m('pages').a('customUrl',{customUrl:url},{
			fail:ch.fail,
			done:function(res){
				if (res.pageId) v.id = res.pageId;
				cb.done();
			}
		});
	}).ch(function(d,ch){
		if (!v.branch.sessUser) return ch.done(); //if user is not logged in, take them to the landing page
		//look for a page owned by this user, or a page that this user is shared on?
		jn.m('pages').a('getMain',{
			fail:ch.fail,
			done:function(res){
				if (res.main){
					v.id = res.main;
					return ch.done();
				}
				return ch.done();
			}
		});
	}).cb(cb);
};

me.a_rec = function(a,cb){
	var v = a.view;
	v.a('set',v.branch.page.rec);
	cb.done();
};

me.a_company = function(a,cb){
	var v = a.view;

	var com = v.branch.com.rec;

	jn.log('company rec:',com);
	if (!com) return cb.fail('no company rec found');
	var features;
	//jn.log('com:',b.com, b.com.rec);

	jn.ch(function(d,ch){
		if (com.grandfather && com.grandfather.features){
			features = com.grandfather.features;
		}
		if (com.plan && com.plan.features){
			if (features) features = jn.morph({t:features,merge:com.plan.features});
			else features = com.plan.features;
			v.branch.com.plan = com.plan.type;
		}
		if (!features) { //set for free features
			v.branch.com.plan = 'free';
			features = jn.m.company.plans.free.features;
		}
		v.branch.com.features = features;
		
		//jn.log('features:',v.branch.com.features);
		/*
		if (!v.branch.com.features || v.branch.com.features.annoying){
			var annoyingCookie = jn.web.getCookie({key:'annoyingShown'});
			if (annoyingCookie) return v.$annoying.hide();
			jn.web.setCookie({
				name:'annoyingShown',
				value:1,
				expires:1
			});
			v.$annoying.show();
		}
		else v.$annoying.hide();
		*/

		v.a('intercom'); //intercom
		ch.done();
	}).cb(cb);
};

me.a_intercom = function(a,cb){
	var v = a.view;
	var sess = jn.m('sess');
	//jn.log('intercom action');
	if (!sess.user) return cb.done();

	jn.ch(function(d,ch){
		jn.m('intercom').a('start',ch);
	}).ch(function(d,ch){
		if (v.branch.com.rec.owners.indexOf(sess.user.id) === -1) return cb.done();
		v.branch.com.a('getNumUsers',ch);
	}).ch(function(d,ch){
		jn.m('intercom').a('update',{users:d.numUsers,plan:v.branch.com.plan},ch);
	}).cb(cb);
};

me.a_bind = function(a,cb){ //bind user events and show childs
	var v = a.view;

	v.branch.alert.a('hide');
	v.a('btn');

	$('body').removeClass('site-nav-transition');

	if (v.section == 'noPage'){ //if no page
		v.$el.on('blur','[prop="name"]',function(){
			var vals = v.a('vals');
			var custom = jn.format({t:vals.name,lower:'all',trim:'nonAlphaNumeric'});
			jn.log('custom:',custom);
			v.a('set',{customUrl:custom});
		});
		return cb.done(); //if no page, exit
	}

	v.branch.left.a('show',{rebuild:true},v.branch);
	v.branch.pageNav.a('show',{rebuild:true},v.branch);

	jn.log('page:',v.branch.page.rec);
	
	var type = v.branch.page.rec.type;
	if (type && jn.v['p_'+type]){ //if type exists
		v.child('p_'+type).a('show');
	}

	if (v.branch.isAccess('team') && type == 'brand'){
		var uploadOpen;
		$('body').off('drag dragover drop').on('drag dragover',function(e){
			e.preventDefault();
			e.stopPropagation();
			if ($('body').hasClass('dropDisabled')) return;
			if (!v.branch.overlay.child('o_upload')._displayed) v.branch.overlay.child('o_upload').a('show');
		}).on('drop',function(e){
			e.preventDefault();
			e.stopPropagation();
			uploadOpen = false;
			//	this catch is used for our pricing upgrade screen
			//	without it, on drop the upgrade overlay is hidden
			if(!$('body').hasClass('dropDisabled')){
				v.branch.overlay.a('hide');				
			}
		});
	}

	cb.done();
};

//access considerations (if admin show owner down to team)
//admin > owner > team
//user
//public

me.a_getAccess = function(a,cb){
	var v = a.view;
	//if admin show access="admin"
	if (a.access == 'admin') return ['admin','owner','team'];
	else if (a.access == 'owner') return ['owner','team'];
	else if (a.access == 'team') return ['team'];
	else return ['public'];
};

/*
***** btn *****
*/
me.a_removeGuide = function(a,cb){
	var v = a.view;
	jn.ch(function(d,ch){
		v.branch.overlay.child('o_guideRemove').a('show');
	}).ch(cb.done).fail(v.branch.err);
};
me.a_add = function(a,cb){ //on click of add btn
	var v = a.view;
	var vals = v.a('vals');
	jn.ch(function(d,ch){
		jn.m('pages').a('add',vals,ch);
	}).ch(function(d,ch){
		jn.v('page',{parent:'base',id:d.rec.id}).a('go',ch);
	}).ch(cb.done).fail(v.branch.err);
};
me.a_enterPage = function(a,cb){
	var v = a.view;
	var vals = v.a('vals');
	jn.ch(function(d,ch){
		v.branch.page.a('checkPassword',{password:vals.enterPassword},{
			fail:function(res){
				jn.log('fail:',res);
				ch.fail(res);
			},
			done:function(){
				v.allowedAccess = true;
				v.a('show',{rebuild:true,rebind:true});
				ch.done();
			}
		});
	}).ch(cb.done).fail(v.branch.err);
};
me.a_pageSettings = function(a, cb) {
	var v = a.view;
	//	 don't allow public users access to the settings
	if(v.branch.access.length && v.branch.access[0] === 'public') return;
	v.branch.overlay.child('o_pageSettings').a('show',cb);
};
me.a_teamMembers = function(a, cb){
	var v = a.view;
	v.branch.overlay.child('o_teamMembers').a('show',cb);
};
me.a_share = function(a, cb){
	var v = a.view;
	v.branch.overlay.child('o_sharePage').a('show',cb);
};
me.a_downloadPage = function(a,cb){
	var v = a.view;
	window.location = 'downloadPage?id='+v.branch.page.id;
	cb.done();
};
me.a_requestAccess = function(a,cb){
	var v = a.view;
	v.a('section',{show:'requestAccess'},cb);
};
me.a_enterPassword = function(a,cb){
	var v = a.view;
	v.a('section',{show:'password'},cb);
};
me.a_goHome = function(a,cb){
	var v = a.view;
	window.location = '/';
	cb.done();
};
me.a_sendRequest = function(a,cb){
	var v = a.view;
	var vals = v.a('vals');
	jn.ch(function(d,ch){
		v.branch.page.a('requestAccess',vals,ch);
	}).ch(function(d,ch){
		v.a('section',{show:'requestAccessSent'},ch);
	}).ch(cb.done).fail(b.err);
};
me.a_selectPlan = function(a,cb){
	var v = a.view;
	v.branch.overlay.child('o_selectPlan').a('show',cb);
};
me.a_closeAnnoying = function(a,cb){
	var v = a.view;
	v.$el.find('[area="annoying"]').hide();
	cb.done();
};

return module.exports(j,cb);};require.store["web/views/host/h_addLogo.js"]=function(j,cb){var module = {};var vp = 'h_addLogo', jn;
var me = module.exports = function(j,cb){
	jn = j, jn.v[vp] = me;
	cb.done();
};

me.a_build = function(a,cb){
	var v = a.view;
	v.$isPage = v.$el.find('[area="isPage"]');
	cb.done();
};

me.a_bind = function(a,cb){
	var v = a.view;
	v.a('btn');
	v.a('reset');
	v.$isPage.hide();
	v.$el.on('keyup','[prop="link"]',function(e){
		if (e.keyCode == 13) v.a('link');
	});
	cb.done();
};

me.a_link = function(a,cb){
	var v = a.view;
	//crawl link for page custom url or id

	var pageId, page;
	jn.ch(function(d,ch){ //get page id
		v.a('getPageId',{
			fail:ch.fail,
			done:function(res){
				pageId = res.pageId;
				ch.done();
			}
		});
	}).ch(function(d,ch){ //get logos from page
		jn.log('get logos from:',pageId);
		page = jn.m('pages',{id:pageId});
		page.a('get',ch);
	}).ch(function(d,ch){
		jn.log('get logos from:',page);
		if (!page.rec.parts || !page.rec.parts.logos) return ch.fail('no logos on this page');
		v.pageName = page.rec.name;
		//loop through categories and show all logos
		var logoCats = page.rec.parts.logos;
		for (var i=0,len=logoCats.length;i<len;i++){
			if (logoCats[i].assets){
				for (var j=0,lenJ=logoCats[i].assets.length;j<lenJ;j++){
					var logoId = logoCats[i].assets[j].cmyk || logoCats[i].assets[j].rgb || logoCats[i].assets[j].id;
					jn.log('select logo:',logoId);
					v.child('h_selectLogo',{id:logoId}).a('show');
				}
			}
		}
		v.$isPage.show();
		ch.done();
	}).ch(cb.done).fail(v.branch.err);
};

me.a_getPageId = function(a,cb){
	var v = a.view;

	var vals = v.a('vals');

	if (!vals.link) return cb.fail('enter a link');

	var vars = {};
    var hashes = vals.link.slice(vals.link.indexOf('?') + 1).split('&');
    for(var i=0,len=hashes.length;i<len;i++){
        var hash = hashes[i].split('=');
        vars[hash[0]] = decodeURIComponent(hash[1]);
    }

	if (vars.id){ //id defined in uri
		return cb.done({pageId:vars.id});
	}
	jn.ch(function(d,ch){ //check if page is a custom url
		var url = vals.link;
		//if (url.substr(0,1) == '/') url = url.substr(1);

		var ind = url.lastIndexOf('/');
		url = url.substr(ind+1);

		jn.log('url:',url);
		if (url.indexOf('page') === 0) return ch.fail('no page id found'); //if page, then skip
		jn.m('pages').a('customUrl',{customUrl:url},{
			fail:ch.fail,
			done:function(res){
				cb.done(res);
			}
		});
	}).cb(cb);
};

me.a_add = function(a,cb){
	var v = a.view;

	jn.ch(function(d,ch){
		//find selected asset
		var $selected = v.$el.find('[v="h_selectLogo"].selected');
		if ($selected.length < 1) return ch.fail('no logo selected');
		var logoId = $selected.attr('logoId');
		var pageName = $selected.attr('pageName');
		var asset = jn.m('assets',{id:logoId});
		//v.parent.a('hide');
		//v.parent.parent.child('uploadComplete').a('show',{logo:v.asset});
		var submit = {asset:asset,noSource:true};
		submit.company = v.pageName;
		v.branch.page.a('submitAsset',submit,ch); //submit logo to convention page
	}).ch(function(d,ch){
		v.branch.overlay.a('hide',ch);
	}).ch(cb.done).fail(v.branch.err);	

};return module.exports(j,cb);};require.store["web/views/host/h_downloadSelected.js"]=function(j,cb){var module = {};var vp = 'h_downloadSelected', jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v[vp] = me;
	cb.done();
};
me.downloadSizes = {
	small:300,
	medium:600,
	large:1200
};
me.defaultSize = 'medium';
me.defaultFormat = 'png';
me.defaultNaming = 'company';

me.a_build = function(a,cb){
	var v = a.view;
	v.$sidebar = v.$el.find('[area="sidebar"]');
	v.$main = v.$el.find('[area="main"]');
	v.$imgShow = v.$el.find('[img="show"]');
	v.$imgHide = v.$el.find('[img="hide"]');
	v.$bgColor = v.$el.find('[area="bgColor"]');
	v.$img = v.$el.find('[prop="img"]');
	v.$size = v.$el.find('[area="size"]');
	v.$w = v.$el.find('[prop="w"]');
	v.$h = v.$el.find('[prop="h"]');

	jn.log('build logo overlay:',v.branch.page);

	v.enableKeys = true;

	v.branch.win.a('bind',{
		resize:function(){
			var dim = v.branch.win.a('dim');
			v.$el.find('.item-hldr').height(dim.h);

			//Adjust scroll sections
			var scrollOffset = 43;
			var wh = $(window).height(),
				$scrollDiv = v.$el.find('.scroll-hldr'),
				mh = v.$el.height();

		   	$scrollDiv.height(wh - scrollOffset);
			
			$scrollDiv.mCustomScrollbar('disable', true);
			$scrollDiv.mCustomScrollbar({
				theme: 'dark',
				autoHideScrollbar: false,
				contentTouchScroll:false,
				scrollInertia: 20,
				advanced:{
					updateOnContentResize: true,
					autoScrollOnFocus:false
				}
			});

			v.$main.find('.item-hldr').css('max-height', ( ( parseInt( v.$main.height() ) - 120 ) + 'px' ));
		}
	});

	cb.done();
};

me.a_bind = function(a,cb){ //bind user events here
	var v = a.view;

	v.a('btn');
	v.a('access',{access:v.branch.access});

	//must have array of selected logos attached
	if (!a.logos) return cb.fail('no logos selected');

	v.logos = a.logos;

	var str = (a.logos.length == 1)? '1 logo selected': a.logos.length+' logos selected';
	v.a('set',{numSelected:str});

	
	//size blur
	var prev = {};
	v.$el.on('blur','[prop="w"]',function(){
		var val = $(this).val();
		val = val.replace(/[^0-9]/g,'');
		if(!val.length || val < 1 || val > 10000){
			v.branch.err('dimensions must be between 0-10000');
			v.$w.val(prev.w);
			return;
		}
		if (prev.w == val) return;
		var h = Math.round(val/v.propWH);
		prev = {w:val,h:h};
		$(this).val(val);
		v.$h.val(h);
		v.a('embed');
	});

	v.$el.on('blur','[prop="h"]',function(){
		var val = $(this).val();
		val = val.replace(/[^0-9]/g,'');
		if(!val.length || val < 1 || val > 10000){
			v.branch.err('dimensions must be between 0-10000');
			v.$h.val(prev.h);
			return;
		}
		if (prev.h == val) return;
		var w = Math.round(val*v.propWH);
		prev = {w:w,h:val};
		$(this).val(val);
		v.$w.val(w);
		v.a('embed');
	});

	//to enable and disable left and right key navigation
	v.$el.on('focus','input',function(){
		v.enableKeys = false;
	});
	v.$el.on('blur','input',function(){
		v.enableKeys = true;
	});

	jn.ch(function(d,ch){
		v.$el.find('[size].active').removeClass('active');
		v.$el.find('[size="'+me.defaultSize+'"]').addClass('active');
		v.$el.find('[format].active').removeClass('active');
		v.$el.find('[format="'+me.defaultFormat+'"]').addClass('active');
		v.$el.find('[naming].active').removeClass('active');
		v.$el.find('[naming="'+me.defaultNaming+'"]').addClass('active');

		var dim = me.downloadSizes[me.defaultSize];
		v.a('set',{w:dim,h:dim});

		ch.done();
	}).ch(cb.done).fail(v.branch.err);
};

me.a_page = function(a,cb){
	var v = a.view;

	jn.log('build logo page');

};

me.a_format = function(a,cb){
	var v = a.view;
	var format = a.$btn.attr('format');
	v.$el.find('[btn="format"].active').removeClass('active');
};

me.a_size = function(a,cb){
	var v = a.view;
	var size = a.$btn.attr('size');
	v.$el.find('[size].active').removeClass('active');
	a.$btn.addClass('active');

	var dim = me.downloadSizes[size];
	v.a('set',{w:dim,h:dim});
};

me.a_format = function(a,cb){
	var v = a.view;
	a.$btn.siblings('.active').removeClass('active');
	a.$btn.addClass('active');
	var format = a.$btn.attr('format');
	if (format == 'png' || format == 'jpg'){
		v.$size.show();
	}
	else {
		v.$size.hide();
	}
};

me.a_naming = function(a,cb){
	var v = a.view;
	a.$btn.siblings('.active').removeClass('active');
	a.$btn.addClass('active');
};

me.a_display = function(a, cb){
	var v = a.view;
	v.$el.show();

	jn.log('DISPLAY');

	var scrollOffset = 43;
	var wh = $(window).height(),
		//childHeight = a.$child.height(),
		$scrollDiv = v.$el.find('.scroll-hldr'),
		mh = v.$el.height();

   	if ( mh >= wh ) {
   		$scrollDiv.height(wh - scrollOffset);
    }
	
	$scrollDiv.mCustomScrollbar('disable', true);
	$scrollDiv.mCustomScrollbar({
		theme: 'dark',
		autoHideScrollbar: false,
		//mouseWheel:false,
		contentTouchScroll:false,
		scrollInertia: 20,
		advanced:{
			updateOnContentResize: true,
			autoScrollOnFocus:false
		}
	});

	v.branch.win.a('touch');

	cb.done();
};

me.a_download = function(a,cb){
	var v = a.view;
	var vals = a.view.a('vals');

	var path = 'downloadPage?id='+v.branch.page.id;

	//get asset id
	var $format = v.$el.find('[format].active');
	var format = $format.attr('format');

	var $naming = v.$el.find('[naming].active');
	var naming = $naming.attr('naming');

	var logos;

	jn.ch(function(d,ch){ //get asset id
		logos = v.logos.join(',');
		path += '&format='+format+'&naming='+naming;
		ch.done();
	}).ch(function(d,ch){ //size
		if (format == 'png' || format == 'jpg'){
			if (vals.w) path += '&w='+vals.w;
			if (vals.h) path += '&h='+vals.h;
			return ch.done();
		}
		ch.done();
	}).ch(function(d,ch){
		var form = document.createElement('form');
	    form.setAttribute('method','post');
	    form.setAttribute('action',path);

        var hiddenField = document.createElement('input');
        hiddenField.setAttribute('type','hidden');
        hiddenField.setAttribute('name','logos');
        hiddenField.setAttribute('value',logos);

        form.appendChild(hiddenField);

	    document.body.appendChild(form);
	    form.submit();
	    ch.done();

	    /*
		jn.log('download path:',path);
		window.location = path;
		ch.done();
		*/
	}).ch(cb.done).fail(v.branch.err);
};

me.a_hide = function(a,cb){
	var v = a.view;
	v.branch.alert.a('hide');
	v.$el.find('.scroll-hldr').mCustomScrollbar('destroy');
	v.a('hide',{root:true},cb);
};


return module.exports(j,cb);};require.store["web/views/host/h_logoOverlay.js"]=function(j,cb){var module = {};var vp = 'h_logoOverlay', jn;
var me = module.exports = function(j,cb){
	jn = j;
	jn.v[vp] = me;
	cb.done();
};
me.downloadSizes = {
	small:300,
	medium:600,
	large:1200
};
me.defaultSize = 'medium';
me.defaultFormat = 'png';

me.a_build = function(a,cb){
	var v = a.view;
	v.$sidebar = v.$el.find('[area="sidebar"]');
	v.$main = v.$el.find('[area="main"]');
	v.$imgShow = v.$el.find('[img="show"]');
	v.$imgHide = v.$el.find('[img="hide"]');
	v.$bgColor = v.$el.find('[area="bgColor"]');
	v.$img = v.$el.find('[prop="img"]');
	v.$size = v.$el.find('[area="size"]');
	v.$w = v.$el.find('[prop="w"]');
	v.$h = v.$el.find('[prop="h"]');

	jn.log('build logo overlay:',v.branch.page);

	v.enableKeys = true;

	v.branch.win.a('bind',{
		resize:function(){
			var dim = v.branch.win.a('dim');
			v.$el.find('.item-hldr').height(dim.h);

			//Adjust scroll sections
			var scrollOffset = 43;
			var wh = $(window).height(),
				$scrollDiv = v.$el.find('.scroll-hldr'),
				mh = v.$el.height();

		   	$scrollDiv.height(wh - scrollOffset);
			
			$scrollDiv.mCustomScrollbar('disable', true);
			$scrollDiv.mCustomScrollbar({
				theme: 'dark',
				autoHideScrollbar: false,
				contentTouchScroll:false,
				scrollInertia: 20,
				advanced:{
					updateOnContentResize: true,
					autoScrollOnFocus:false
				}
			});

			v.$main.find('.item-hldr').css('max-height', ( ( parseInt( v.$main.height() ) - 120 ) + 'px' ));
		}
	});

	cb.done();
};

me.a_bind = function(a,cb){ //bind user events here
	var v = a.view;
	v.spot = a.spot;
	if (!v.spot) return v.branch.overlay.a('hide');
	v.id = v.spot.id;
	//if (!v.id) return cb.fail('no id defined');

	v.$el.find('[format="eps"]').hide();

	v.a('btn');
	v.a('access',{access:v.branch.access});

	v.$img.css({'background-image':'none'});

	//size blur
	var prev = {};
	v.$el.on('blur','[prop="w"]',function(){
		var val = $(this).val();
		val = val.replace(/[^0-9]/g,'');
		if(!val.length || val < 1 || val > 10000){
			v.branch.err('dimensions must be between 0-10000');
			v.$w.val(prev.w);
			return;
		}
		if (prev.w == val) return;
		var h = Math.round(val/v.propWH);
		prev = {w:val,h:h};
		$(this).val(val);
		v.$h.val(h);
		v.a('embed');
	});

	v.$el.on('blur','[prop="h"]',function(){
		var val = $(this).val();
		val = val.replace(/[^0-9]/g,'');
		if(!val.length || val < 1 || val > 10000){
			v.branch.err('dimensions must be between 0-10000');
			v.$h.val(prev.h);
			return;
		}
		if (prev.h == val) return;
		var w = Math.round(val*v.propWH);
		prev = {w:w,h:val};
		$(this).val(val);
		v.$w.val(w);
		v.a('embed');
	});

	//to enable and disable left and right key navigation
	v.$el.on('focus','input',function(){
		v.enableKeys = false;
	});
	v.$el.on('blur','input',function(){
		v.enableKeys = true;
	});

	jn.ch(function(d,ch){ //bind to page
		v.a('model',{model:v.branch.page,rec:function(){
			v.a('page',ch);
		}});
	}).ch(function(d,ch){
		v.$el.find('[size].active').removeClass('active');
		v.$el.find('[size="'+me.defaultSize+'"]').addClass('active');
		v.$el.find('[format].active').removeClass('active');
		v.$el.find('[format="'+me.defaultFormat+'"]').addClass('active');
		ch.done();
	}).ch(function(d,ch){
		v.a('embed');
		ch.done();
	}).ch(cb.done).fail(v.branch.err);
};

me.a_page = function(a,cb){
	var v = a.view;

	jn.log('build logo page');

	/*
	jn.log('pos:',v.pos);
	v.spot = v.branch.page.a('getPos',{pos:v.pos});
	if (!v.spot) return jn.log('no spot found');
	*/

	
	v.assets = {};
	jn.ch(function(d,ch){ //get cmyk asset rec
		if (!v.spot.id) return ch.done(); 
		v.$el.find('[format="eps"][colorspace="none"]').show();
		v.assets.logo = jn.m('assets',{id:v.spot.id});
		if (!v.assets.main) v.assets.main = v.assets.logo;
		//hide settings button
		v.$el.find('[btn="settings"]').hide();
		v.a('model',{model:v.assets.logo,
			rec:function(){
				v.a('logo',ch);
			}
		});
	}).ch(function(d,ch){
		if (v.assets.main){
			var src = /*(a.replace)? 'img?id='+v.assets.main.id+'&w=1200&h=1200':*/ jn.config.cdn+'img?id='+v.assets.main.id+'&w=1200&h=1200';
			v.$img.css({'background-image':'url("'+src+'")'});
		}
		else v.$img.css({'background-image':'url("")'});
		ch.done();
	}).ch(function(d,ch){
		v.a('initControls');
		ch.done();
		//v.a('colorspaces',ch);
	}).cb(cb);
};

me.a_resize = function(a,cb){
	var v = a.view;
	if (v.$sidebar.hasClass('closed')){
		v.$sidebar.removeClass('closed');
		v.$main.removeClass('fullscreen');
		v.$imgShow.show();
		v.$imgHide.hide();
	}
	else {
		v.$sidebar.addClass('closed');
		v.$main.addClass('fullscreen');
		v.$imgShow.hide();
		v.$imgHide.show();
		console.log( 'image hide: ' );
		console.log( v.$imgHide );
	}
};

me.a_format = function(a,cb){
	var v = a.view;
	var format = a.$btn.attr('format');
	v.$el.find('[btn="format"].active').removeClass('active');
};

me.a_size = function(a,cb){
	var v = a.view;
	var size = a.$btn.attr('size');
	v.$el.find('[size].active').removeClass('active');
	a.$btn.addClass('active');

	var dim = me.downloadSizes[size];
	if (v.propWH >= 1){
		w = dim;
		h = Math.round(dim/v.propWH);
	}
	else {
		h = dim;
		w = Math.round(dim*v.propWH);
	}
	if (w){
		v.a('set',{w:w,h:h});
	}
	v.a('embed');
};

me.a_settings = function(a,cb){
	var v = a.view;
	changeView('settings');
};

me.a_back = function(a,cb){
	changeView('back');
};

me.a_logo = function(a,cb){
	var v = a.view, b = v.branch, $el = v.$el;
	var logo = v.assets.logo;
	v.a('buildAsset',{asset:logo},cb);
};

me.a_buildAsset = function(a,cb){
	var v = a.view;
	var logo = a.asset;

	jn.log('logo:',logo);

	if (!logo.rec) return cb.done();

	

	//var src = 'img?id='+logo.id;
	//v.$el.find('[prop="imgCs"]').attr({src:src});
	var color = (logo.rec.data && logo.rec.data.bgColor)? logo.rec.data.bgColor: '#f9f9f9';

	var colorHex = color;
	if (colorHex.substring(0, 1) == '#') { 
		colorHex = colorHex.substring(1);
	}

	v.$el.find('[area="bgColor"]').css({'background-color':color});
	v.$el.removeClass('white black').addClass(getContrastYIQ(colorHex));
	v.a('set',logo.rec,{bgColor:color});

	if (logo.rec.data && logo.rec.data.bgColor){
		v.$el.find('[area="swatch"]').css({
			'background-color':logo.rec.data.bgColor
		});
	}

	var size = me.downloadSizes[me.defaultSize];
	var w,h;
	v.propWH = logo.rec.data.propWH;
	if (logo.rec.data.propWH >= 1){
		w = size;
		h = Math.round(size/logo.rec.data.propWH);
	}
	else {
		h = size;
		w = Math.round(size*logo.rec.data.propWH);
	}
	if (w){
		v.a('set',{w:w,h:h});
	}
	cb.done();
};

me.a_format = function(a,cb){
	var v = a.view;
	a.$btn.siblings('.active').removeClass('active');
	a.$btn.addClass('active');
	var format = a.$btn.attr('format');
	if (format == 'png' || format == 'jpg'){
		v.$size.show();
	}
	else {
		v.$size.hide();
	}
	v.a('embed');
};

me.a_display = function(a, cb){
	var v = a.view;
	v.$el.show();

	jn.log('DISPLAY');

	var scrollOffset = 43;
	var wh = $(window).height(),
		//childHeight = a.$child.height(),
		$scrollDiv = v.$el.find('.scroll-hldr'),
		mh = v.$el.height();

   	if ( mh >= wh ) {
   		$scrollDiv.height(wh - scrollOffset);
    }
	
	$scrollDiv.mCustomScrollbar('disable', true);
	$scrollDiv.mCustomScrollbar({
		theme: 'dark',
		autoHideScrollbar: false,
		//mouseWheel:false,
		contentTouchScroll:false,
		scrollInertia: 20,
		advanced:{
			updateOnContentResize: true,
			autoScrollOnFocus:false
		}
	});

	v.branch.win.a('touch');

	//jn.log('zclip:',v.$el.find('[zclip]').zclip);
	ZeroClipboard.config({swfPath:'flash/zeroClipboard.swf'});
	var zero = new ZeroClipboard(v.$el.find('[zclip]'));
	jn.log('zero:',zero);
	zero.on('aftercopy',function(e){
		v.branch.alert.a('show',{
			message:'Copied to clipboard',
			type:'success',
			hideAfter:1000
		})
    	//jn.log('Copied text to clipboard: '+e.data['text/plain']);
  	});
	zero.on('copy',function(e){
		//
		var val = v.$el.find('[prop="embed"]').val();
		jn.log('copy:',val);
		e.clipboardData.setData('text/plain',val);
	});

	cb.done();
};

var changeView = function( typeOfShift ){
	var shiftPanes = $('[data-pane="shift"]');
	var fadePanes = $('[data-pane="fade"]');

	if ( typeOfShift === 'settings' ){
		shiftPanes.addClass('shift-left');
		fadePanes.addClass('fade-on');
	}
	else if ( typeOfShift === 'back' || typeOfShift === 'reset' ){
		shiftPanes.removeClass('shift-left');
		fadePanes.removeClass('fade-on');
	}
};

var setBackgroundColor = function( colorVal, elementToChange ){
	var colorVal = colorVal.replace(/#/g, '');

	if ( colorVal.indexOf('rgb') != -1 ){
		elementToChange.css('background', colorVal);
	} 
	else {
		elementToChange.css('background', '#' + colorVal);
	}
};

me.a_bgColor = function(a,cb){
	var v = a.view;
	var color = a.$btn.data('color');
	v.a('set',{bgColor:color});
	
	v.a('saveColor');
	//v.$el.find('[area="bgColor"]').css({'background-color':color});

};

me.a_download = function(a,cb){
	var v = a.view;
	var vals = a.view.a('vals');

	//get asset id
	var $format = v.$el.find('[format].active');
	var path = 'downloadAsset?id='+v.branch.page.id;
	var format = $format.attr('format');
	jn.ch(function(d,ch){ //get asset id
		if (format == 'png' || format == 'jpg') var assetId = v.spot.rgb || v.spot.cmyk || v.spot.id;
		else if (format == 'pdf') var assetId = v.spot.cmyk || v.spot.rgb || v.spot.id;
		else if (format == 'eps'){
			var colorspace = $format.attr('colorspace');
			if (colorspace == 'none') var assetId = v.spot.id;
			else var assetId = v.spot[colorspace];
		}
		else return ch.fail('no format defined');
		if (!assetId) return ch.fail('no asset id');
		path += '&assetId='+assetId+'&format='+format;
		ch.done();
	}).ch(function(d,ch){ //size
		if (format == 'png' || format == 'jpg'){
			if (vals.w) path += '&w='+vals.w;
			if (vals.h) path += '&h='+vals.h;
			return ch.done();
		}
		ch.done();
	}).ch(function(d,ch){
		jn.log('download path:',path);
		window.location = path;
		ch.done();
	}).ch(cb.done).fail(v.branch.err);
};

me.a_embed = function(a,cb){
	var v = a.view;
	var vals = a.view.a('vals');
	var $format = v.$el.find('[format].active');
	var format = $format.attr('format');
	var path = jn.config.cdn;
	jn.ch(function(d,ch){ //get asset id
		if (format == 'png' || format == 'jpg') var assetId = v.spot.rgb || v.spot.cmyk || v.spot.id;
		else if (format == 'pdf') var assetId = v.spot.cmyk || v.spot.rgb || v.spot.id;
		else if (format == 'eps'){
			var colorspace = $format.attr('colorspace');
			if (colorspace == 'none') var assetId = v.spot.id;
			else var assetId = v.spot[colorspace];
		}
		else return ch.fail('no format defined');
		if (!assetId) return cb.done();
		if (format == 'png' || format == 'jpg') path += 'img?id='+assetId;
		else path += 'downloadAsset?id='+v.branch.page.id+'&assetId='+assetId;
		path += '&format='+format;
		ch.done();
	}).ch(function(d,ch){ //size
		if (format == 'png' || format == 'jpg'){
			if (vals.w) path += '&w='+vals.w;
			if (vals.h) path += '&h='+vals.h;
			return ch.done();
		}
		ch.done();
	}).ch(function(d,ch){
		v.a('set',{embed:path});
		ch.done();
	}).ch(cb.done).fail(v.branch.err);
};

me.a_prev = function(a,cb){
	var v = a.view;
	var pos = v.branch.page.a('search',{spot:v.spot});
	if (!pos) return cb.fail('no pos found');

	var posAry = pos.split('.');
	if (posAry.length < 3) return cb.fail('pos not complete');
	var part = posAry[0];
	var catInd = posAry[1];
	var assetInd = posAry[3];
	var catI = catInd;
	
	var spot;
	if (v.spot._gr){
		while (catI >= 0 && !spot){
			var cat = v.branch.page.rec.parts[part][catI];
			for (var i=0,len=cat.assets.length;i<len;i++){ //look in same cat
				var sp = cat.assets[i];
				if (sp._gr && v.spot._gr && ((sp._gr.x < v.spot._gr.x && sp._gr.y == v.spot._gr.y) || (sp._gr.y < v.spot._gr.y) || (catI < catInd)) && 
					(!spot || ((sp._gr.x > spot._gr.x && sp._gr.y == spot._gr.y) || (sp._gr.y > spot._gr.y)))
					){
					spot = sp;
				}
			}
			catI--;
		}
		if (spot){
			var newPos = v.branch.page.a('search',{spot:spot});
			jn.ch(function(d,ch){
				v.a('hide',ch);
			}).ch(function(d,ch){
				v.branch.overlay.child('o_logoOverlay').a('show',{spot:spot,pos:newPos},ch);
			}).cb(cb);
		}
	}

};

me.a_next = function(a,cb){
	var v = a.view;
	var pos = v.branch.page.a('search',{spot:v.spot});
	if (!pos) return cb.fail('no pos found');

	var posAry = pos.split('.');
	if (posAry.length < 3) return cb.fail('pos not complete');
	var part = posAry[0];
	var catInd = posAry[1];
	var assetInd = posAry[3];
	var catI = catInd;

	var spot;
	if (v.spot._gr){
		while (catI < v.branch.page.rec.parts[part].length && !spot){
			var cat = v.branch.page.rec.parts[part][catI];
			for (var i=0,len=cat.assets.length;i<len;i++){
				var sp = cat.assets[i];
				if (sp._gr && v.spot._gr && ((sp._gr.x > v.spot._gr.x && sp._gr.y == v.spot._gr.y) || (sp._gr.y > v.spot._gr.y) || (catI > catInd)) && 
					(!spot || ((sp._gr.x < spot._gr.x && sp._gr.y == spot._gr.y) || (sp._gr.y < spot._gr.y)))
					){
					spot = sp;
				}
			}
			catI++;
		}
		if (spot){
			jn.log('new pos:',newPos);
			var newPos = v.branch.page.a('search',{spot:spot});
			jn.ch(function(d,ch){
				v.a('hide',ch);
			}).ch(function(d,ch){
				v.branch.overlay.child('o_logoOverlay').a('show',{spot:spot,pos:newPos},ch);
			}).cb(cb);
		}
	}
};

me.a_initControls = function(a,cb){
	var v = a.view;

	var $next = v.$el.find('[btn="next"]');
	var $prev = v.$el.find('[btn="prev"]');

	$('body').on('keyup',function(e){
		if (!v.enableKeys) return;
		jn.log('keyup:',e.keyCode);
		if (e.keyCode == 39){
			v.a('next');
		}
		else if (e.keyCode == 37){
			v.a('prev');
		}
		else if (e.keyCode == 27){
			v.branch.overlay.a('hide');
		}
	});
};

me.a_hide = function(a,cb){
	var v = a.view;
	v.branch.alert.a('hide');
	$('body').removeClass('dropDisabled');
	$('body').off('keyup');
	v.$el.find('.scroll-hldr').mCustomScrollbar('destroy');
	v.a('hide',{root:true},cb);
};


return module.exports(j,cb);};require.store["web/views/host/h_logoRemove.js"]=function(j,cb){var module = {};var vp = 'h_logoRemove',jn;
var me = module.exports = function(j,cb){
	jn = j, jn.v[vp] = me;
	cb.done();
};
me.a_bind = function(a,cb){
	var v = a.view;
	v.spot = a.spot;
	v.a('btn');
	cb.done();
};
me.a_remove = function(a,cb){
	var v = a.view;
	var asset = jn.m('assets',{id:v.spot.id});
	jn.ch(function(d,ch){
		v.branch.page.a('unsubmitAsset',{asset:asset},ch);
	}).ch(function(d,ch){
		v.branch.overlay.a('hide',ch);
	}).ch(cb.done).fail(v.branch.err);
};
me.a_cancel = function(a,cb){
	var v = a.view;
	v.branch.overlay.a('hide',cb);
};return module.exports(j,cb);};require.store["web/views/host/h_logoRow.js"]=function(j,cb){var module = {};var vp = 'h_logoRow',jn;
var me = module.exports = function(j,cb){
	jn = j, jn.v[vp] = me;
	cb.done();
};

me.a_attach = function(a,cb){
	var v = a.view;
	if (a.isNew) return v.a('attach',{root:true,method:'prepend'},cb);
	return v.a('attach',{root:true},cb);
};

me.a_build = function(a,cb){
	var v = a.view;
	v.$img = v.$el.find('[prop="img"]');
	v.$icon = v.$el.find('[btn="logoIcon"]');
	v.$expand = v.$el.find('[area="logoExpand"]');
	cb.done();
};

me.a_bind = function(a,cb){
	var v = a.view;

	v.$icon.show();
	v.$expand.hide();

	v.spot = a.spot;

	v.a('btn');
	v.a('access',{access:v.branch.access});

	v.asset = jn.m('assets',{id:v.spot.id});
	v.a('model',{model:v.asset});

	if (a.selected) v.$el.addClass('active');
	else v.$el.removeClass('active');

	v.$img.css({'background-image':'url("/img?id='+v.spot.id+'&w=100&h=100")'});

	if (v.spot.updated){
		var updatedStr = jn.date({ts:v.spot.updated,get:'ago'});
		v.a('set',{updatedAgo:'submitted '+updatedStr});
	}

	if (v.spot.addedBy){
		v.a('set',{email:'added by admin'});
	}
	else if (v.spot.email){
		v.a('set',{email:v.spot.email});
	}

	//get company name
	v.a('set',{companyStr:v.spot.company,email:v.spot.email,logoId:v.spot.id,category:v.spot.category});

	cb.done();
};

me.a_hide = function(a,cb){
	var v = a.view;
	v.a('hide',{root:true},cb);
};

me.a_rec = function(a,cb){
	var v = a.view;

	//attach to company
	v.company = jn.m('company',{id:v.asset.rec.company});


	
	cb.done();
};

me.a_active = function(a,cb){
	var v = a.view;
	jn.log('active:',v.$el.hasClass('active'));
	if (v.$el.hasClass('active')){
		return v.a('deselect',cb);
	}
	v.a('select',cb);
};

me.a_select = function(a,cb){
	var v = a.view;
	v.branch.pageView.a('select',{logoId:v.spot.id});
	v.$el.addClass('active');
	cb.done();
};

me.a_deselect = function(a,cb){
	var v = a.view;
	v.branch.pageView.a('deselect',{logoId:v.spot.id});
	v.$el.removeClass('active');
	cb.done();
};


me.a_logoOverlay = function(a,cb){
	var v = a.view;
	v.branch.overlay.child('h_logoOverlay').a('show',{spot:v.spot},cb);
};

me.a_remove = function(a,cb){
	var v = a.view;
	v.branch.overlay.child('h_logoRemove').a('show',{spot:v.spot},cb);
};

me.a_logoIcon = function(a,cb){
	var v = a.view;
	v.$icon.hide();
	v.$expand.show();
	v.$el.find('[prop="logoId"]').select();
};
me.a_logoHide = function(a,cb){
	var v = a.view;
	v.$icon.show();
	v.$expand.hide();
};
return module.exports(j,cb);};require.store["web/views/host/h_selectLogo.js"]=function(j,cb){var module = {};var vp = 'h_selectLogo', jn;
var me = module.exports = function(j,cb){
	jn = j, jn.v[vp] = me;
	cb.done();
};
me.a_bind = function(a,cb){	
	var v = a.view;
	v.a('btn');
	v.asset = jn.m('assets',{id:v.id});
	v.a('model',{model:v.asset});
	v.$el.attr({logoId:v.id});
	cb.done();
};
me.a_rec = function(a,cb){
	var v = a.view;
	v.$el.css({'background-image':'url(img?id='+v.asset.id+'&w=720&h=618)'});
	cb.done();
};
me.a_select = function(a,cb){
	var v = a.view;
	v.parent.$el.find('[v="h_selectLogo"].selected').removeClass('selected');
	v.$el.addClass('selected');
	cb.done();
	/*
	jn.ch(function(d,ch){
		//v.parent.a('hide');
		//v.parent.parent.child('uploadComplete').a('show',{logo:v.asset});
		var submit = {asset:v.asset,noSource:true};
		submit.company = v.pageName;
		v.branch.page.a('submitAsset',submit,ch); //submit logo to convention page
	}).ch(function(d,ch){
		v.branch.overlay.a('hide',ch);
	}).ch(cb.done).fail(v.branch.err);
	*/
};return module.exports(j,cb);};var jnConfig = jnConfig || []; jnConfig.push({"domain":"brandisty.com","cookieDomain":".brandisty.com","cdn":"https://cdn.brandisty.com/","root":"","system":"web","socketPath":"https://brandisty.com:8001","testing":false,"query":"localStorage","vRoot":"base/"});setTimeout(function(){jn.loaded()},1);