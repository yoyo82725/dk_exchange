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
 * It is this array that is passed to pre-submit callback functions provided to the�i�@ I�$I$q� ){�3�@ I�I$���S}�        �c`�V�?@q`#�m��j ]�Z*��l��%[�� y��.@����6l�x�  w�}E? 	�$�$t� v�_?@�۰��  ��N?@�mĶ����!5]޻?@��vl��� Vpq�?@�a۶a;�� �Q�\?@�m�F`۾�(:���b?@��l���b����?@�mێ���h���?@�m8vl]�  ߿~|?@�Î���� ��&? 	�$I�Խ [EgY?@�möc;��" .�]T?@6`۱a�:�  ���g?@��Ķ��΅ �~b �m�� !-�xP����:�*:�o��b�F̹�d >6����y���9n������ ��F)��7C�mۀ� ����]|
?�m۶�r��ڂ@ I�$I$D 0G�        k�9���        �uD��w�        ؼ� �9o?@�m۶m8�{ �WG@ A�$I�$�k �'Y� I�$I$s  g%%@ I�I�$�A  @�Q@ I�$H�$�� ]]�? I�$H��: m�        jq }        ntI]��@�m�m۬�a Vg]? I�$	�$[ ��Ԟ        � e]S        f�  ��? A�$I�$�#@ ��? I�$A�$�R ����        .s@ ��        �J lmQ�        �M  ��g? I�$I� �h� �e�e? I� H�$ `d�=�[        �2 jQN I�$I�$#�� fFV}? I�$I$@(�	 ѕ?@b۶m�
i� y{�?@�m�vl�m" edT�?�mێm�q@ �_%t@ I� I�$acFd��? I�$I�$bSXqu�? I�I�$3 n^]? 	�$I�$'[! uZ��?@�m؆m;h� O���        iZ  �QEm� I�4I���"Ue�        �R  ��U%?�m�vl��C ���9?@�möǪl@Y7�        �z A�@ 	�$I� Ms  �{M�?@�c۶m�i� 1eq        J;�0eo�? I� I�$%�` E�[�? H�$I�$�r�KMi@�m۶cbQ %�(?@�m؎m�Hl UT�ݔ I�$U�$�	g9��?@��ض���[���oy@ I�I�$K�" �u��@ A�$I$h�}���?@�m۱m�y� w]X�        �2  QWZE?@�m۱m�Hr  ���Y? 	� I�$@b�&�3?@�m۶��a� k8Ǖ        
i� �;v�� ��&I�$nl t�[?@�mö�h�" ��Y$?@6l$���s�њ+��][�e[�@�q1�? I�$	�$���f�ה M%M�$v�@ љu�? I�$I� �Qy��@ I�I�$�(��Y?@�m۶m�o�� �I�� I�$I�o�T<?��ضaҽ!G�Y�        �� QG}�?@vlǶm�̃  �a~D I�$I�$�{�{�A� I�$	�$ЌB��{}        ��$u��? 	�$I�$�����?@v۰m��A��Rr?@�m۶m�s ���`? I�$I�$V�  ӿ�[        *�% tt� Q�$I��M�#	ؚ��?@�a�v`؇K N��}?@�m۶���pD�8��        �b� �q	�?�m�6�؉��y�6�?�m�Fl�L�޷];        �a�v�1@��m۶aۉ� fd�R@ I�$I�1�C f7�t        �{ �Ml�?@�ێ� ���?@6b�m���@G�uՔ I��Q������5t? A�$I�$P�!+��d*��-ۮm��s 8:dz? H�$I�$ҳ�G���+��mײ-��{  z+�Q?6l;�m�Nc�\IE�? I�$I�$s��K? I�I�$�� CҶD? �$I�$��Cww��*��eٮ-�t�"kI��?@�mÆ��u�a�^{*��-ײ-���b0�۞?@�mێmؐ�!���� I�&j�&�C ��u]?@�m۶;��  ����@ 	�$I�$�� -_?@�۶;���1f[p�?�ضm��� ^�b�@ I� I�$��  5��u        �c ��&�? A�I� �  �rk?        ��H)�~�v@ I�$H�$���bK��?�m۱a��e1�j�b@ A$I���  �ߟ�@�m������O�g_@ I�$I� �[  6�z*��-K�m�ؽ"�{_%?@�؀m�7� _��?*��U[�m�w��)�f|�?@�c۶�Y~ GY�{        �u"
��?@��8N#[�! >�=�>�~a�f6� ���C*��]˖e����	M�U�� U��M�$7n v#�n@H� ��X� ʭ��@߀kl��»�D ��ͷ�J�вM���� s�}@O�?H$^ߢ ^�/��I�$��ǂ �]�b� I�$	)�ҕ �{|-@ 	�$I�$| Sv        �� ��ݍ?@�m۰mۤk  OYUu@ I�$H�$b@ �NX? H�$I� ���VO�?@l�vl�r  E�]�?@�c�m�hc �DEi        hT {��        *� 1�t�        +;  �Qwy        jS U�5� I�$H�$�4 (E��@ I�$I�,tA��E?@�mضc�@��ҏ�? A�$I�$R| �]�        
� ����? I�$I� �Z ���@ H�$I�$σw�]�@ I�$A�$p{ MGew@ 	�$I�$P< (�Y�E?@�m;�m�M#  ��]J?@�؆c�-@ &nj�@�m;�mۏC U��f?@�mضm�- �Ug? I�$I�$; C[e�?@���lۯ eUu� M�4Q���s! uUwE? H$I�$A� ��? H�$I�$&I dQ1D?@vb�6lۮcAo>        �  TYw�? I�$H�$ �0 ? I�$H�$�� G�=e? I�$I�${ ���? H�I�$�/ ? I�$I�$k -_�6        ��AWwݑ@ I�$H�$SY��? I�$I$'����3,        �b  �Bw        
k  Y�L�? I�$I�$�r ٵ|@ A�$I�$������        c  ���        { ����? H�$I�$Ji 	yX[h?@�mێm�ς��$Q� I�$��&pz ��@�m۱m��h� d�y?@�mñۦ���n        �"�_eE? I�$I�$Ƃ`SaO[? I�$	�$m�!}�Gu?@�m�vlÉz` �4r? H� I�$/{  ���? I�$I�j�Q5�?@�m�vl��" ���?@�ذm;	�B �}^? I�$	� �� g��+��-˶]�ϴNv�e@ I�I� �";���?�m۶m�l�# �G�? H�$I�$��b�e}        r�a7~]�        P� Eg�u? I�$I�$N�  ����?@�ضm�H�����?@��ضm����Eu? �$I�$���Dv@ 	�$I�$o�  ��Ҁ I� I�$������?@vlöm�+t` {�lh? A�$I�$l��C}J4@ H$I�$�s  �d�;        '���q�? I� I�$���Qj�?@�m;6l�j@ �w1�?�ۆc�y��]? I�$A$� ~w�|?@�a�vl�˻� ~_Y�?�m�6l�7{�(�]�e? I�$	�$Ƀ  ���i?@�ۆa;,Z  �6�        ��� n�7�?@ql�vl�s�  v_G�@ I�$I�$� FE��@ A�$I����Zd�?@�ضm�2� �E�9? I�$	�$p�AF�]�? I�$H�$��a Ǚa�@ I�$H� vŁ���G?�m�m�Lt!�@ I�$H�$��a �gWD@ I$I�$֮ 9�xߔ I�$Q�&�Z`�KH?@�۶m�� 0��z�?@�m۶8��@��N�?@�m۱m�ϛB.�=?@��vl��J@ ٥�I?@�۰Ps ���@�mۆ�L{  ��F�?@�۶m���! {љ@ I�$H$��g)����? A�$I�$�IJ�#5@ I�$I�$�!wߜ�?@�m۶�u�  ��O: H�$I�$��" �n�?@�m�0���� zb=�? I�$A�$��
:��R?@löm;��e H���� M�(i�$R���? I�$A�$5�@{mF�? H�$I�TtC �IYA?@�m۶m�{A�[]?@�m���� O���?@�mذm��� �s��+��l˶����c�@���1;�S )l�*��*[�-Y�$ {�}+�Vm��-I�� 7U��?@��؎���v >��o?@�Ķm���  ��c�*��l۪d���C �f��)��lٖ�Zw� =w�d+��dˮ���U ���*��mە%K� _j?�?�6bÀa��E ����*�Rmۖ-[�e$(�6�        
c�Z����        
c�Z����        �b�Z����        �b�Z����        
c�Z����        �b[����        
c�Z����        
c�Z����        �b[����        �b[����        �b[����        c�Z����        c�Z����        c�Z����        c�Z����        �b[����        �b[����        c�Z����        �b[����        c�Z����        �b[����        �b[����        �b[����        c�Z����        c�Z"�**        c�b *        +ccUU��        +cc���_        +k�Z����        k+[����        k,[����        k+c����        k+c����        k+c����        +kc����        +k,c����        +kLc����        Lk+k����        Lk+k����        Lk+k����        Lk+k����        Lk+k����        Lk+k����        Lk+k����        Lk+k����        Lk+k����        Lk+k����        Lk+k����        Lk+k����        Lk+k����        +sLk����        +sLk����        KsLk����        k{Lk����        Lskk����        Lskk����        ls+k ��� I�I�$lsKk 
��        lsKs �*�        l{ls�UUU        l{ls�_UU        l{ls�u�U        l{ls�w��        �{ls����        �{ls����        �{ls (*�        �{�{����        �{�{����        ̓�{���u        ���s����        ̓�{����        ̓�{����        ���{����        ���{����        ���{����        ���{����        ̋�{����        ̓������        ̋̓��u        �̓����        �̓����        �̓��*�        �̓   
        ����UU        ��_���        .�틯���        .�퓪���        .������        �.�����        M������        N����        N�.��*        n�N����]        n�N�����        o�M�����        o�M�����        n�N�����        o�M�����        ��n�����        ��n�+��        𴯬-�UU        Pů�
+��        q�� ���        q�� ���        ���*/��        �ݑͧ�=U        3�ͯ��{        3�͠��        3������X        ��P��x�z        q��_~�        0�ϴ����        �ϴ
��        P��/���        ���+��        �ݑͪ��U        �ݑ� �_U        3��+��U        �������        6�3����        W��� 
��        x������        x�V�����        W�����
�        6��Vp        �t� ��U        W��� *��        w���*�u        
c�Z����        �b�Z����        �b�Z����        
c�Z����        �b[����        
c�Z����        
c�Z����        �b[����        �b[����        �b[����        c�Z����        c�Z����        c�Z����        �b[����        c�Z����        c�Z����        c�Z����        c�Z���"        c�Z��*�        c�Z����        c�Z����        �b[����        �b[����        c�Z����        c�Z**�         c�b*         +ccwUUu        ,kcUUU�        +k�Z����        k,[����        k,[����        k+c����        k+c����        k+c����        +k,c����        +k,c����        +k,c����        +k,c����        Lk+k����        Lk+k����        Lk+k����        +kLc����        Lk+k����        Lk+k����        Lk+k����        Lk+k����        Lk+k����        Lk+k����        Lk+k����        Lk+k����        Lk+k����        Lk+k����        +sLk����        KsLk����        KsLk����        ls+k����        Lskk����        Lskk����        lsKs�*��        lsKk�*�        lsKk ���        lsKk  *�        �{lsuUUU        �{ls���]        �{ls����        �{ls����        �{ls**�        �{�s  *�        �{�{����        �{�{����        ���{����        ̓�{����        ̓�{����        ���{����        ���{����   