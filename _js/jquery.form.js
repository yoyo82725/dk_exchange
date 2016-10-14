/*!
 * jQuery Form Plugin
 * version: 2.63 (29-JAN-2011)
 * @requires jQuery v1.3.2 or later
 *
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
;(function($) {

/*
	Usage Note:
	-----------
	Do not use both ajaxSubmit and ajaxForm on the same form.  These
	functions are intended to be exclusive.  Use ajaxSubmit if you want
	to bind your own submit handler to the form.  For example,

	$(document).ready(function() {
		$('#myForm').bind('submit', function(e) {
			e.preventDefault(); // <-- important
			$(this).ajaxSubmit({
				target: '#output'
			});
		});
	});

	Use ajaxForm when you want the plugin to manage all the event binding
	for you.  For example,

	$(document).ready(function() {
		$('#myForm').ajaxForm({
			target: '#output'
		});
	});

	When using ajaxForm, the ajaxSubmit function will be invoked for you
	at the appropriate time.
*/

/**
 * ajaxSubmit() provides a mechanism for immediately submitting
 * an HTML form using AJAX.
 */
$.fn.ajaxSubmit = function(options) {
	// fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
	if (!this.length) {
		log('ajaxSubmit: skipping submit process - no element selected');
		return this;
	}

	if (typeof options == 'function') {
		options = { success: options };
	}

	var action = this.attr('action');
	var url = (typeof action === 'string') ? $.trim(action) : '';
	if (url) {
		// clean url (don't include hash vaue)
		url = (url.match(/^([^#]+)/)||[])[1];
	}
	url = url || window.location.href || '';

	options = $.extend(true, {
		url:  url,
		type: this[0].getAttribute('method') || 'GET', // IE7 massage (see issue 57)
		iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
	}, options);

	// hook for manipulating the form data before it is extracted;
	// convenient for use with rich editors like tinyMCE or FCKEditor
	var veto = {};
	this.trigger('form-pre-serialize', [this, options, veto]);
	if (veto.veto) {
		log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
		return this;
	}

	// provide opportunity to alter form data before it is serialized
	if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
		log('ajaxSubmit: submit aborted via beforeSerialize callback');
		return this;
	}

	var n,v,a = this.formToArray(options.semantic);
	if (options.data) {
		options.extraData = options.data;
		for (n in options.data) {
			if(options.data[n] instanceof Array) {
				for (var k in options.data[n]) {
					a.push( { name: n, value: options.data[n][k] } );
				}
			}
			else {
				v = options.data[n];
				v = $.isFunction(v) ? v() : v; // if value is fn, invoke it
				a.push( { name: n, value: v } );
			}
		}
	}

	// give pre-submit callback an opportunity to abort the submit
	if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
		log('ajaxSubmit: submit aborted via beforeSubmit callback');
		return this;
	}

	// fire vetoable 'validate' event
	this.trigger('form-submit-validate', [a, this, options, veto]);
	if (veto.veto) {
		log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
		return this;
	}

	var q = $.param(a);

	if (options.type.toUpperCase() == 'GET') {
		options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
		options.data = null;  // data is null for 'get'
	}
	else {
		options.data = q; // data is the query string for 'post'
	}

	var $form = this, callbacks = [];
	if (options.resetForm) {
		callbacks.push(function() { $form.resetForm(); });
	}
	if (options.clearForm) {
		callbacks.push(function() { $form.clearForm(); });
	}

	// perform a load on the target only if dataType is not provided
	if (!options.dataType && options.target) {
		var oldSuccess = options.success || function(){};
		callbacks.push(function(data) {
			var fn = options.replaceTarget ? 'replaceWith' : 'html';
			$(options.target)[fn](data).each(oldSuccess, arguments);
		});
	}
	else if (options.success) {
		callbacks.push(options.success);
	}

	options.success = function(data, status, xhr) { // jQuery 1.4+ passes xhr as 3rd arg
		var context = options.context || options;   // jQuery 1.4+ supports scope context 
		for (var i=0, max=callbacks.length; i < max; i++) {
			callbacks[i].apply(context, [data, status, xhr || $form, $form]);
		}
	};

	// are there files to upload?
	var fileInputs = $('input:file', this).length > 0;
	var mp = 'multipart/form-data';
	var multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);

	// options.iframe allows user to force iframe mode
	// 06-NOV-09: now defaulting to iframe mode if file input is detected
   if (options.iframe !== false && (fileInputs || options.iframe || multipart)) {
	   // hack to fix Safari hang (thanks to Tim Molendijk for this)
	   // see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
	   if (options.closeKeepAlive) {
		   $.get(options.closeKeepAlive, fileUpload);
		}
	   else {
		   fileUpload();
		}
   }
   else {
		$.ajax(options);
   }

	// fire 'notify' event
	this.trigger('form-submit-notify', [this, options]);
	return this;


	// private function for handling file uploads (hat tip to YAHOO!)
	function fileUpload() {
		var form = $form[0];

		if ($(':input[name=submit],:input[id=submit]', form).length) {
			// if there is an input with a name or id of 'submit' then we won't be
			// able to invoke the submit fn on the form (at least not x-browser)
			alert('Error: Form elements must not have name or id of "submit".');
			return;
		}
		
		var s = $.extend(true, {}, $.ajaxSettings, options);
		s.context = s.context || s;
		var id = 'jqFormIO' + (new Date().getTime()), fn = '_'+id;
		var $io = $('<iframe id="' + id + '" name="' + id + '" src="'+ s.iframeSrc +'" />');
		var io = $io[0];

		$io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });

		var xhr = { // mock object
			aborted: 0,
			responseText: null,
			responseXML: null,
			status: 0,
			statusText: 'n/a',
			getAllResponseHeaders: function() {},
			getResponseHeader: function() {},
			setRequestHeader: function() {},
			abort: function() {
				this.aborted = 1;
				$io.attr('src', s.iframeSrc); // abort op in progress
			}
		};

		var g = s.global;
		// trigger ajax global events so that activity/block indicators work like normal
		if (g && ! $.active++) {
			$.event.trigger("ajaxStart");
		}
		if (g) {
			$.event.trigger("ajaxSend", [xhr, s]);
		}

		if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
			if (s.global) { 
				$.active--;
			}
			return;
		}
		if (xhr.aborted) {
			return;
		}

		var timedOut = 0;

		// add submitting element to data if we know it
		var sub = form.clk;
		if (sub) {
			var n = sub.name;
			if (n && !sub.disabled) {
				s.extraData = s.extraData || {};
				s.extraData[n] = sub.value;
				if (sub.type == "image") {
					s.extraData[n+'.x'] = form.clk_x;
					s.extraData[n+'.y'] = form.clk_y;
				}
			}
		}

		// take a breath so that pending repaints get some cpu time before the upload starts
		function doSubmit() {
			// make sure form attrs are set
			var t = $form.attr('target'), a = $form.attr('action');

			// update form attrs in IE friendly way
			form.setAttribute('target',id);
			if (form.getAttribute('method') != 'POST') {
				form.setAttribute('method', 'POST');
			}
			if (form.getAttribute('action') != s.url) {
				form.setAttribute('action', s.url);
			}

			// ie borks in some cases when setting encoding
			if (! s.skipEncodingOverride) {
				$form.attr({
					encoding: 'multipart/form-data',
					enctype:  'multipart/form-data'
				});
			}

			// support timout
			if (s.timeout) {
				setTimeout(function() { timedOut = true; cb(); }, s.timeout);
			}

			// add "extra" data to form if provided in options
			var extraInputs = [];
			try {
				if (s.extraData) {
					for (var n in s.extraData) {
						extraInputs.push(
							$('<input type="hidden" name="'+n+'" value="'+s.extraData[n]+'" />')
								.appendTo(form)[0]);
					}
				}

				// add iframe to doc and submit the form
				$io.appendTo('body');
                io.attachEvent ? io.attachEvent('onload', cb) : io.addEventListener('load', cb, false);
				form.submit();
			}
			finally {
				// reset attrs and remove "extra" input elements
				form.setAttribute('action',a);
				if(t) {
					form.setAttribute('target', t);
				} else {
					$form.removeAttr('target');
				}
				$(extraInputs).remove();
			}
		}

		if (s.forceSync) {
			doSubmit();
		}
		else {
			setTimeout(doSubmit, 10); // this lets dom updates render
		}
	
		var data, doc, domCheckCount = 50;

		function cb() {
			doc = io.contentWindow ? io.contentWindow.document : io.contentDocument ? io.contentDocument : io.document;
			if (!doc || doc.location.href == s.iframeSrc) {
				// response not received yet
				return;
			}
            io.detachEvent ? io.detachEvent('onload', cb) : io.removeEventListener('load', cb, false);

			var ok = true;
			try {
				if (timedOut) {
					throw 'timeout';
				}

				var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
				log('isXml='+isXml);
				if (!isXml && window.opera && (doc.body == null || doc.body.innerHTML == '')) {
					if (--domCheckCount) {
						// in some browsers (Opera) the iframe DOM is not always traversable when
						// the onload callback fires, so we loop a bit to accommodate
						log('requeing onLoad callback, DOM not available');
						setTimeout(cb, 250);
						return;
					}
					// let this fall through because server response could be an empty document
					//log('Could not access iframe DOM after mutiple tries.');
					//throw 'DOMException: not available';
				}

				//log('response detected');
				xhr.responseText = doc.body ? doc.body.innerHTML : doc.documentElement ? doc.documentElement.innerHTML : null; 
				xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
				xhr.getResponseHeader = function(header){
					var headers = {'content-type': s.dataType};
					return headers[header];
				};

				var scr = /(json|script)/.test(s.dataType);
				if (scr || s.textarea) {
					// see if user embedded response in textarea
					var ta = doc.getElementsByTagName('textarea')[0];
					if (ta) {
						xhr.responseText = ta.value;
					}
					else if (scr) {
						// account for browsers injecting pre around json response
						var pre = doc.getElementsByTagName('pre')[0];
						var b = doc.getElementsByTagName('body')[0];
						if (pre) {
							xhr.responseText = pre.textContent;
						}
						else if (b) {
							xhr.responseText = b.innerHTML;
						}
					}			  
				}
				else if (s.dataType == 'xml' && !xhr.responseXML && xhr.responseText != null) {
					xhr.responseXML = toXml(xhr.responseText);
				}
				
				data = httpData(xhr, s.dataType, s);
			}
			catch(e){
				log('error caught:',e);
				ok = false;
				xhr.error = e;
				s.error.call(s.context, xhr, 'error', e);
				g && $.event.trigger("ajaxError", [xhr, s, e]);
			}
			
			if (xhr.aborted) {
				log('upload aborted');
				ok = false;
			}

			// ordering of these callbacks/triggers is odd, but that's how $.ajax does it
			if (ok) {
				s.success.call(s.context, data, 'success', xhr);
				g && $.event.trigger("ajaxSuccess", [xhr, s]);
			}
			
			g && $.event.trigger("ajaxComplete", [xhr, s]);

			if (g && ! --$.active) {
				$.event.trigger("ajaxStop");
			}
			
			s.complete && s.complete.call(s.context, xhr, ok ? 'success' : 'error');

			// clean up
			setTimeout(function() {
				$io.removeData('form-plugin-onload');
				$io.remove();
				xhr.responseXML = null;
			}, 100);
		}

		var toXml = $.parseXML || function(s, doc) { // use parseXML if available (jQuery 1.5+)
			if (window.ActiveXObject) {
				doc = new ActiveXObject('Microsoft.XMLDOM');
				doc.async = 'false';
				doc.loadXML(s);
			}
			else {
				doc = (new DOMParser()).parseFromString(s, 'text/xml');
			}
			return (doc && doc.documentElement && doc.documentElement.nodeName != 'parsererror') ? doc : null;
		};
		var parseJSON = $.parseJSON || function(s) {
			return window['eval']('(' + s + ')');
		};
		
		var httpData = function( xhr, type, s ) { // mostly lifted from jq1.4.4
			var ct = xhr.getResponseHeader('content-type') || '',
				xml = type === 'xml' || !type && ct.indexOf('xml') >= 0,
				data = xml ? xhr.responseXML : xhr.responseText;

			if (xml && data.documentElement.nodeName === 'parsererror') {
				$.error && $.error('parsererror');
			}
			if (s && s.dataFilter) {
				data = s.dataFilter(data, type);
			}
			if (typeof data === 'string') {
				if (type === 'json' || !type && ct.indexOf('json') >= 0) {
					data = parseJSON(data);
				} else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
					$.globalEval(data);
				}
			}
			return data;
		};
	}
};

/**
 * ajaxForm() provides a mechanism for fully automating form submission.
 *
 * The advantages of using this method instead of ajaxSubmit() are:
 *
 * 1: This method will include coordinates for <input type="image" /> elements (if the element
 *	is used to submit the form).
 * 2. This method will include the submit element's name/value data (for the element that was
 *	used to submit the form).
 * 3. This method binds the submit() method to the form for you.
 *
 * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
 * passes the options argument along after properly binding events for submit elements and
 * the form itself.
 */
$.fn.ajaxForm = function(options) {
	// in jQuery 1.3+ we can fix mistakes with the ready state
	if (this.length === 0) {
		var o = { s: this.selector, c: this.context };
		if (!$.isReady && o.s) {
			log('DOM not ready, queuing ajaxForm');
			$(function() {
				$(o.s,o.c).ajaxForm(options);
			});
			return this;
		}
		// is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
		log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
		return this;
	}
	
	return this.ajaxFormUnbind().bind('submit.form-plugin', function(e) {
		if (!e.isDefaultPrevented()) { // if event has been canceled, don't proceed
			e.preventDefault();
			$(this).ajaxSubmit(options);
		}
	}).bind('click.form-plugin', function(e) {
		var target = e.target;
		var $el = $(target);
		if (!($el.is(":submit,input:image"))) {
			// is this a child element of the submit el?  (ex: a span within a button)
			var t = $el.closest(':submit');
			if (t.length == 0) {
				return;
			}
			target = t[0];
		}
		var form = this;
		form.clk = target;
		if (target.type == 'image') {
			if (e.offsetX != undefined) {
				form.clk_x = e.offsetX;
				form.clk_y = e.offsetY;
			} else if (typeof $.fn.offset == 'function') { // try to use dimensions plugin
				var offset = $el.offset();
				form.clk_x = e.pageX - offset.left;
				form.clk_y = e.pageY - offset.top;
			} else {
				form.clk_x = e.pageX - target.offsetLeft;
				form.clk_y = e.pageY - target.offsetTop;
			}
		}
		// clear form vars
		setTimeout(function() { form.clk = form.clk_x = form.clk_y = null; }, 100);
	});
};

// ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
$.fn.ajaxFormUnbind = function() {
	return this.unbind('submit.form-plugin click.form-plugin');
};

/**
 * formToArray() gathers form element data into an array of objects that can
 * be passed to any of the following ajax functions: $.get, $.post, or load.
 * Each object in the array has both a 'name' and 'value' property.  An example of
 * an array for a simple login form might be:
 *
 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * It is this array that is passed to pre-submit callback functions provided to the¶iÉ@ I’$I$qÅ ){¢3±@ I’I$µÕS}æ        c`V¶?@q`#¶mÇïj ]§Z*”–l»¶%[÷½ yÙı.@€¶íØ6lÛx¶  wç}E? 	’$’$t€ vñ_?@¶Û°¶  ñÈN?@¶mÄ¶íØ×Í!5]Ş»?@¶ÛvlØ÷ Vpq©?@¶aÛ¶a;˜¾ ¯Q¾\?@¶mÛF`Û¾÷(:Øââb?@¶ØlØÿÿb×Ş×Ó?@¶mÛÛö½h‹Ÿ?@°m8vl]Ï  ß¿~|?@ÃíØôÅ ò¾ò&? 	‚$I’Ô½ [EgY?@¶mÃ¶c;÷¥" .Õ]T?@6`Û±aÛ:Æ  ¼‹¿g?@°íÄ¶ÃÚÎ… Õ~Â™b †mÛ÷ !-•xPà°ëÂ:ÿ*:ÖoşébØFÌ¹Îd >6öÜ¶yïç9n‡´Ë¶Ø ßïF)Õè7C¶mÛ€ ş÷‚õ]|
?¶mÛ¶Ãr„õÚ‚@ I’$I$D 0Gû        k 9ÅÈû        èuD‘ÿwÙ        Ø¼å Û9o?@¶mÛ¶m8¥{ ûWG@ A’$I’$…k µ'Yä I’$I$s  g%%@ I’I’$ÁA  @™Q@ I’$H’$‘ó ]]•? I’$H’í: mæ        jq }        ntI]÷ş@±m¶mÛ¬ºa Vg]? I’$	’$[ íÔ        ¬ e]S        f‚  ıŞ? A’$I’$Ë#@ ÷Ÿ? I’$A’$R Ô×Åõ        .s@ ™ñ·        ËJ lmQ—        óM  ›çg? I’$I‚ âh€ ”e¦e? I‚ H’$ `d¬=¹[        2 jQN I$I’$#¡€ fFV}? I$I$@(é	 Ñ•?@bÛ¶mÛ
iÀ y{š?@†mØvlÛm" edTÖ?¶mÛm©q@ õ_%t@ I’ I’$acFdèí? I’$I‚$bSXquÖ? I’I’$3 n^]? 	’$I’$'[! uZÒß?@¶mØ†m;hƒ O¶ôÆ        iZ  ÕQEm” I”4I’¤â"Ue™        §R  –U%?¶mØvlÛÄC õåæ9?@¶mÃ¶Çªl@Y7        ªz AÚ@ 	’$I’ Ms  Ú{M–?@¶cÛ¶m©i  1eq        J;€0eoê? I’ I’$%Ì` Eù[Ù? H’$I$årÜKMi@¶mÛ¶cbQ %Õ(?@±mØmÛHl UTíİ” I’$UÒ$ï²	g9÷ù?@¶Ø¶íØò[À‘İoy@ I’I$K›" ÔuõÑ@ A‚$I$h£}¢ñì?@¶mÛ±mÃyÀ w]Xù        à2  QWZE?@†mÛ±mÛHr  îÑËY? 	’ I’$@b &¼3?@±mÛ¶Ûëa  k8Ç•        
iÀ Ú;vö” ‰š&I’$nl t¶[?@¶mÃ¶Øh‚" šŞY$?@6l$¶ÛësÈÑš+”¶][¶e[ƒ@Éq1é? I’$	’$¯œf÷×” M%M’$v»@ Ñ™uö? I’$I’ ğ¥QyŸ¦@ I’I’$î½(ÔıY?@mÛ¶mØoƒ€ ĞIñå I’$I’o”T<?¶íØ¶aÒ½!GÕYİ        “¼ QG}Ÿ?@vlÇ¶mØÌƒ  åa~D I’$I$Î{À{ŞAŸ I’$	’$ĞŒBÅÔ{}        ¯½$uöä»? 	’$I’$ÏÄ¶ÚÕ?@vÛ°mÛìŒAµ”Rr?@¶mÛ¶m«s ˜`? I$I’$V  Ó¿í[        *­% ttê” Q’$I’´M£#	Øšù±?@¶aÛv`Ø‡K N–’}?@†mÛ¶íØÂpD·8‚á        b  èq	´?¶mÛ6ìØ‰›Àyÿ6Ô?¶mÛFlÛL”Ş·];        ï£aİvÒ1@€mÛ¶aÛ‰“ fd¿R@ I’$I’1®C f7÷t        ‹{ –Mlµ?@¶Ûó» ™ŸÔ?@6b†mÛïî@G™uÕ” I’¤Q’¤¯£ î5t? A’$I’$P„!+‘÷d*•–-Û®mËîs 8:dz? H’$I’$Ò³ Göß÷+”–m×²-Ûí{  z+Q?6l;¶mÛNc€\IEã? I’$I$s®äK? II$„ CÒ¶D? ’$I’$ù­CwwÙÔ*”–eÙ®-Ût½"kIıÿ?@¶mÃ†ÄuÅaÛ^{*•¶-×²-ÛôÍb0êÛ?@mÛmØŒ!áÕ“” I’&jÒ&ËC ½Üu]?@†mÛ¶;º÷  —·Çí@ 	’$I’$ØÆ -_?@¶Û¶;şÿ…1f[pë?¶Ø¶mÃúæ ^Ób©@ I’ I’$ûŞ  5ıûu        ®c –¨&‰? A’I’ ß  ¼rk?        ıßH)×~‡v@ I’$H‚$œïébK©‡?¶mÛ±aúÿe1ûjúb@ A$Iö­  ¾ßŸÓ@¶mÀ¶íÀ—­O²g_@ I’$I’ [  6§z*•¶-KµmÛØ½"ø{_%?@ˆØ€mÛ7× _×Ä?*–¶U[–mÙw¥É)õf|‰?@¶cÛ¶ÛY~ GYš{        øu"
ê¹ö?@¶í8N#[Ç! >ƒ=İ>í~aÆf6† §¿ŞC*•¶]Ë–eÛÿŸˆ	MıUŸ” U«¤M’$7n v#ğn@H’ ¶ÛX Ê­˜á@ß€kl†ëÂ»ÎD ÊüÍ·ÜJÂĞ²MÚİçÅ sı}@O‚?H$^ß¢ ^‚/·íI’$‰™Ç‚ ]übÜ I’$	)ÚÒ• ı{|-@ 	’$I’$| Sv        †¤ Õİ?@±mÛ°mÛ¤k  OYUu@ I’$H’$b@ —NX? H’$I’ ²›÷VO—?@lÛvlÛr  EÅ]µ?@¶c¶mÃhc ôDEi        hT {ÕÆ        *‹ 1ëtÛ        +;  Qwy        jS U£5å€ I’$H’$¬4 (Eµ™@ I’$I’,tA›ÑE?@mØ¶cÛ@‡›ÒÁ? A’$I’$R| ™]‘        
£ öûœ÷? I’$I’ èZ Ûö•@ H’$I’$ÏƒwÕ]Ñ@ I’$A’$p{ MGew@ 	’$I’$P< (ñY¾E?@†m;¶mÛM#  ú˜]J?@¶Ø†cÛ-@ &njÒ@°m;¶mÛC U—¤f?@mØ¶mÛ- ä‘Ug? I’$I$; C[e×?@¶íØlÛ¯ eUu” MÓ4Q“¤Òs! uUwE? H$I’$AÀ ’ö? H’$I’$&I dQ1D?@vbÛ6lÛ®cAo>        ì‚  TYwù? I’$H’$ Ç0 ? I’$H’$„ Gõ=e? I’$I${ ñåÆ? H’I’$ / ? I’$I$k -_¥6        ËÕAWwİ‘@ I’$H’$SY÷? I$I$'ƒÔ×3,        æb  é©Bw        
k  Y™Lâ? I’$I$ær Ùµ|@ A’$I’$ŠŠ öÙí        c  ŞôÑ        { ö—Æñ? H’$I$Ji 	yX[h?@°mÛmÛÏ‚¡¼$Qí” IÒ$‰’&pz Ñ@¶mÛ±mÃêh  dÚy?@¶mÃ±Û¦“ßÚn        ×"Õ_eE? I’$I$Æ‚`SaO[? I’$	$m¾!}µGu?@¶mÛvlÃ‰z` ¾4r? H’ I’$/{  œœ¹? I’$I’j”Q5›?@¶mÛvlØÆ" ûõ×?@±Ø°m;	»B Õ}^? I’$	’ ±µ g–§+”¶-Ë¶]ÙÏ´NvÛe@ I’I’ ¾";ÛÙÿ?ˆmÛ¶mÛlµ# ¾Gæ? H’$I’$ïÖbõe}        r¤a7~]™        Pí‚ Egµu? I’$I$N³  ¹óæù?@¶Ø¶mÛH”¢‘üı?@íØ¶mÃÿÛÖEu? ’$I’$ª„ÒDv@ 	’$I’$oœ  ››Ò€ I’ I’$¬ õ–µ?@vlÃ¶mÛ+t` {lh? A’$I’$lƒƒC}J4@ H$I’$ªs  òdº;        '´Åíq•? I’ I’$¤ÇQj†?@°m;6lÛj@ ßw1í?¶Û†cÇyô¥]? I‚$A$î´ ~w—|?@¶aÇvlÛË»Â ~_YÜ?¶mÇ6lÛ7{à(ö]Ôe? I’$	’$Éƒ  ¹”Ûi?@°Û†a;,Z  µ6ä        ğ„À nç7©?@qlÛvlÃsÕ  v_Gÿ@ I’$I‚$Í FEù÷@ A’$I’óÆ×ZdŸ?@±Ø¶mÛ2 ïE™9? I’$	’$p´AF–]ß? I’$H’$±„a Ç™aı@ I’$H’ vÅ—–õG?¶m±mÛLt!¬@ I’$H’$íËa ãgWD@ I$I’$Ö® 9úxß” I’$QÒ&ÎZ`ÙKH?@°Û¶mÛ 0çÑzî?@mÛ¶8”­@ßÿNä?@mÛ±mÛÏ›B.ó=?@¶ÛvlÀÎJ@ Ù¥éI?@±Û°Ps ¥‘’@¶mÛ†ÛL{  µ–FÊ?@±Û¶mÛõµ! {Ñ™@ I’$H$ßÿg)›ıÇ? A’$I$ÎIJ#5@ I’$I‚$óµ!wßœœ?@mÛ¶Ûu¾  ŸšO: H’$I’$²¬" ×nä¤?@¶mÛ0ìÿÁ zb=Ù? I’$A’$¿ÿ
:–ıR?@lÃ¶m;»÷e H€ ˆ• Mš(i›$R½ìœò ? I’$A‚$5½@{mFŸ? H’$I’TtC ùIYA?@±mÛ¶mÑ{A´[]?@±mÃÛ÷­ Oéåï?@¶mØ°mÇİß ªs¾ÿ+”’lË¶íÚö­cğ¡®@¶áØ1;S )l*–’*[¶-Yó•$ {á—}+”Vm©¶-Iù 7UŞÛ?@±ãØØÜv >»Ûo?@¶Ä¶mÛı¦  ùËcÎ*–¶lÛªdÛÿŸC ífŒ)•²lÙ–ÕZw =wïd+”²dË®¬Ê×U ¨¼î*”–mÛ•%K _j?¿?¾6bÃ€aÃØE îÖêô*”RmÛ–-[¸e$(Ì6Ê        
cÌZªªªª        
cÌZªªªª        ìbêZÿÿÿÿ        êbìZªªªª        
cÌZªªªª        êb[ªªªª        
cÌZªªªª        
cÌZªªªª        êb[ªªªª        êb[ªªªª        ëb[ªªªª        cëZªºªª        cëZªªªª        cëZ¢ªª¨        cëZªªªª        ëb[ªªªª        êb[ªªªª        cëZªªªª        ëb[ªªªª        cëZªªªª        ëb[ªªªª        ëb[ªªªª        êb[ªªªª        cëZªªªª        cëZ"¢**        cëb *        +ccUUÕÕ        +ccııÿ_        +këZªªªª        k+[ªªªª        k,[ªªªª        k+cÿÿÿÿ        k+cÿÿÿÿ        k+cÿÿÿÿ        +kcªªªª        +k,cªªªª        +kLcªªªª        Lk+kÿÿÿÿ        Lk+kÿÿÿ¿        Lk+kÿÿ¿ï        Lk+kÿÿÿÿ        Lk+kÿÿÿÿ        Lk+kÿÿÿÿ        Lk+kÿÿÿÿ        Lk+kÿşÿÿ        Lk+k¾ÿûş        Lk+kïúëï        Lk+kúûûÿ        Lk+kÿÿÿÿ        Lk+k¯ÿÿÿ        +sLkÿÿÿÿ        +sLkÿÿÿÿ        KsLkÿÿÿÿ        k{Lkÿÿÿÿ        Lskkªªªª        Lskkªªªª        ls+k ªªª I’I’$lsKk 
Šª        lsKs ‚*ª        l{lsÕUUU        l{lsİ_UU        l{lsıuÕU        l{lsÿwıõ        Œ{ls««ÿï        Œ{lsªªªª        Œ{ls (*¨        «{{ÿÿÿÿ        ­{Œ{ïÿÿÿ        ÍƒŒ{ÿÿßu        ¬ƒsªªªª        ÍƒŒ{ÿÿÿ÷        ÍƒŒ{¿¿ÿÿ        ­ƒ¬{ª¯ÿ¿        ­ƒ¬{ªªª®        ­ƒÌ{ªªªª        ­ƒÌ{ªªªª        Ì‹­{ïÿÿÿ        Íƒ¬ƒªª««        Ì‹Íƒıÿu        í‹Íƒ¿¿÷ÿ        í‹Íƒª«¿»        í‹Íƒ‚ª*ª        í‹Íƒ   
        ”í‹÷ÿUU        ”í‹_÷İÕ        .”í‹¯ÿÿı        .”í“ª«¯»        .””ªª®«        œ.”ÿÿÿÿ        Mœ”¿ÿÿÿ        Nœ”ªª        Nœ.œŠ*        n¤Nœÿ÷ı]        n¤Nœ¯ÿ¿õ        o¤Mœªªªº        o¤Mœªªªª        n¤Nœªªúû        o¤Mœªªªª        ¬nœ«¯¿¿        ¯¬n¤+¯¿        ğ´¯¬-µUU        PÅ¯¬
+ÿõ        qÍï´ ªÿÕ        qÍ½ ªµÕ        ‘Í½*/¿ı        òİ‘Í§=U        3æ‘Í¯¿Ş{        3æ±Í Âµ        3æÒÕğû×X        òİPÅúxøz        qÍï´_~è         0ÅÏ´ıÿ«ª        ½Ï´
Šú        PÅ½/ÿõõ        ±Õ½+­­        òİ‘ÍªÿÿU        òİ‘Í «_U        3æ±Õ+ıõU        ”îÑÕ«½Õ        6÷3æ¯ıÕ        Wÿ´î 
¯µ        xÿõöª«½        xÿV÷¨úúÿ        WÿÕîèà
ª        6÷”îª¿Vp        ÷tî «ßU        Wÿ”î *¿õ        wÿõö*ÿu        
cÌZªªªª        ìbêZÿÿÿÿ        ìbêZÿÿÿÿ        
cÌZªªªª        êb[ªªªª        
cÌZªªªª        
cÌZªªªª        êb[ªªªª        êb[ªªªª        êb[ªªªª        cëZªªªª        cëZªªªª        cëZª®ªê        ëb[ªªªª        cëZªªªª        cëZª«ªª        cëZªªªª        cëZªªª"        cëZªª*         cëZªªª¨        cëZªªªª        ëb[ªªªª        ëb[ªªªª        cëZªªªª        cëZ**ª         cëb*         +ccwUUu        ,kcUUUÕ        +këZªªªª        k,[ªªªª        k,[ªªªª        k+cÿÿÿÿ        k+cÿÿÿÿ        k+cÿÿÿÿ        +k,cªªªª        +k,cªªªª        +k,cªªªª        +k,cªªªª        Lk+kÿÿÿÿ        Lk+kş»ÿï        Lk+kÿúûÿ        +kLcªªªª        Lk+kÿÿÿÿ        Lk+kÿ¿ïï        Lk+kÿÿ¯ª        Lk+k¿«îê        Lk+k¿ÿûş        Lk+kÿÿÿÿ        Lk+kïÿÿÿ        Lk+k¯şÿÿ        Lk+k®¿ÿÿ        Lk+k®®ú¿        +sLkÿÿÿÿ        KsLkÿÿÿÿ        KsLkÿÿÿÿ        ls+kªª«¾        Lskkªªªª        Lskkªªªª        lsKsª*ªŠ        lsKk‚*ª        lsKk ˆŠª        lsKk  *ª        Œ{lsuUUU        Œ{lsÿıõ]        Œ{ls¯¯ÿÿ        Œ{lsªª«¯        Œ{ls**ª        Œ{Œs  *ª        «{{ÿÿÿÿ        «{{ÿÿÿÿ        ­ƒŒ{ÿÿõı        ÍƒŒ{ÿıÿÿ        ÍƒŒ{¿ÿÿÿ        ­ƒ¬{«®ÿÿ        ­ƒ¬{««®¿   