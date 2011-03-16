function UserExtensions() {
	this.enabled = Object();
	this.disabled = Object();
	this.apps = Object();
	this.countSelected = function(){
		return Object.keys(this.enabled).length + Object.keys(this.disabled).length + Object.keys(this.apps).length;
	};
	this.countEnabled = function(){
		return Object.keys(this.enabled).length;
	};
	this.countDisabled = function(){
		return Object.keys(this.disabled).length;
	};
	this.countApps = function(){
		return Object.keys(this.apps).length;
	};

}

function ExtensionsShare() {
	this._extensionInfos = new UserExtensions();
	this._lastExportType = 'text';
	this._template = null;
	this.setTemplate = function(template){
		this._template = template;
	};
	this.exportTo = function(type) {
		// chrome.management.getAll(function(extensionInfos) {
		console.log('exporting to:' + type);

		var descriptionOn = $('#description:checked').val();
		this._lastExportType = type;
		var selectedExtensions = new UserExtensions();

		// for ( var i in extensionInfos) {
		// var extensionInfo = extensionInfos[i];

		for ( var i in this._extensionInfos.enabled) {
			var extensionInfo = this._extensionInfos.enabled[i];
			if ($('#' + extensionInfo.id).hasClass('selected')) {
				selectedExtensions.enabled[extensionInfo.id] = extensionInfo;
			}
		} // for

		for ( var i in this._extensionInfos.disabled) {
			var extensionInfo = this._extensionInfos.disabled[i];
			if ($('#' + extensionInfo.id).hasClass('selected')) {
				selectedExtensions.disabled[extensionInfo.id] = extensionInfo;
			}
		} // for

		for ( var i in this._extensionInfos.apps) {
			var extensionInfo = this._extensionInfos.apps[i];
			if ($('#' + extensionInfo.id).hasClass('selected')) {
				selectedExtensions.apps[extensionInfo.id] = extensionInfo;
			}
		} // for

		// console.log(selectedExtensions);
		if (selectedExtensions.countSelected() == 0) {
			alert(_i18n('alert_no_extensions_selected'));
			return;
		}

		var code = '';

		_gaq.push([
		           '_trackPageview',
		           '/extensions/export/' + type + '/' + selectedExtensions.length
		           + '/' ]);

		switch (type) {
		case 'bbcode':
			code = generateBBCode(selectedExtensions, descriptionOn);
			break;
		case 'html':
			code = generateHTML(selectedExtensions, descriptionOn);
			break;
		case 'text':
			code = generateText(selectedExtensions, descriptionOn);
			break;
		case 'wiki':
			code = generateWiki(selectedExtensions, descriptionOn);
			break;
		default:
			break;
		}

		$('#nav2 li.selected').removeClass('selected');

		if (code != undefined && code != '') {
			$('#export').val(code);
			$('#nav2 li.' + type).addClass('selected');

			$("#dialog-modal").dialog({
				modal : true,
				draggable : false,
				position : 'center',
				width : 800,
				height : 600,
				closeOnEscape : true
			});

			// $('#dialog-modal').dialog('open');
		}

		// });
	};

	this.reExport = function() {
		this.exportTo(this._lastExportType);
	};

	this.populateExtensions = function(extensionInfos) {

		this._extensionInfos = new UserExtensions();

		for ( var i in extensionInfos) {
			var extensionInfo = extensionInfos[i];

			if (!extensionInfo.isApp) {

				if (extensionInfo.enabled) {
					this._extensionInfos.enabled[extensionInfo.id] = extensionInfo;
				} else {
					this._extensionInfos.disabled[extensionInfo.id] = extensionInfo;
				}
			} else {
				this._extensionInfos.apps[extensionInfo.id] = extensionInfo;
			}
		} // for

		$('.extension', this._template).removeClass('enabled').removeClass('app').removeClass('disabled');
		$('.content').append(getSectionHeader(_i18n('section_header_title_enabled_extensions'), this._extensionInfos.countEnabled()));
		for ( var i in this._extensionInfos.enabled) {
			$('.content').append(populateData(this._template, this._extensionInfos.enabled[i]));
			//break;
		}

		$('.extension', this._template).removeClass('enabled').removeClass('app').removeClass('disabled');
		$('.content').append(getSectionHeader(_i18n('section_header_title_disabled_extensions'), this._extensionInfos.countDisabled()));

		for ( var i in this._extensionInfos.disabled) {
			$('.content').append(populateData(this._template, this._extensionInfos.disabled[i]));
			//break;
		}


		$('.extension', this._template).removeClass('enabled').removeClass('app').removeClass('disabled');
		$('.content').append(getSectionHeader(_i18n('section_header_title_apps'), this._extensionInfos.countApps()));

		for ( var i in this._extensionInfos.apps) {
			$('.content').append(populateData(this._template, this._extensionInfos.apps[i]));
			//break;
		}

		return this._extensionInfos.countSelected();
	};


	this.getLastExportType = function(){
		return this._lastExportType;
	};

	this.getExtensionInfoById = function(id){

		if(typeof(this._extensionInfos.enabled[id]) != 'undefined'){
			return this._extensionInfos.enabled[id];
		}

		if(typeof(this._extensionInfos.disabled[id]) != 'undefined'){
			return this._extensionInfos.disabled[id];
		}

		if(typeof(this._extensionInfos.apps[id]) != 'undefined'){
			return this._extensionInfos.apps[id];
		}

	};

}

function selectAll(select) {
	if (select) {
		$('.extension').addClass('selected');
	} else {
		$('.extension').removeClass('selected');
	}
}

function select(type) {

	_gaq.push([ '_trackPageview', '/extensions/select/' + type + '/' ]);

	switch (type) {
	case 'all':
		$('.extension').addClass('selected');
		break;
	case 'none':
		$('.extension').removeClass('selected');
		break;
	case 'reverse':
		$('.extension').each(function() {
			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
			} else {
				$(this).addClass('selected');
			}
		});
		break;
	default:
		break;
	}
	return false;
}

function sendTo(destination) {
	_gaq.push([ '_trackPageview', '/extensions/export/gmail/' ]);
	window.open('https://mail.google.com/mail/?view=cm&fs=1&tf=1&su='
			+ _subject + '&body=' + encodeURIComponent($('#export').val()));

}

function populateData(template, extensionInfo) {
	var data = template;
	$('.extension', data).attr('id', extensionInfo.id);

	if (!extensionInfo.enabled) {
		$('.extension', data).addClass('disabled');
//		$('#action_enable', data).removeClass('hd');
//		$('#action_disable', data).addClass('hd');

	} else {
		$('.extension', data).addClass('enabled');
//		$('#action_disable', data).addClass('hd');
//		$('#action_enable', data).removeClass('hd');
	}

	if (!extensionInfo.isApp) {
		$('.extension', data).addClass('app');
//		$('#action_enable', data).addClass('hd');
//		$('#action_disable', data).addClass('hd');

	}

	$('#name2', data).hide();
	$('#name', data).html(extensionInfo.name);

	$('.inspectPopupNote', data).html(extensionInfo.description);
	$('.extension-description', data).html(extensionInfo.description);

	$('#homepageUrl', data).attr('href',
			'https://chrome.google.com/webstore/detail/' + extensionInfo.id);

	$('#version', data).html(extensionInfo.version);
	$('#enabled', data).hide();
	$('#id', data).html(extensionInfo.id);

	var lastIconSize = 0;
	var lastIconUrl = 'images/extension_unknown.png';

	if (extensionInfo.enabled && extensionInfo.icons != undefined
			&& extensionInfo.icons.length) {
		for ( var j in extensionInfo.icons) {
			if (lastIconSize < extensionInfo.icons[j].size) {
				lastIconSize = extensionInfo.icons[j].size;
				lastIconUrl = extensionInfo.icons[j].url;
			}
		}
	}

	$('#icon', data).attr('src', lastIconUrl);

	return data.html();
}

function generateBBCode(extensionInfos, descriptionOn) {
	var curdate = new Date();
	var result = '';

	result = result + '[b]' + _i18n('label_export_generated') + '[/b] '
	+ curdate.toGMTString() + '\n';
	result = result + '[b]' + _i18n('label_export_user_agent') + '[/b] '
	+ navigator.userAgent + '\n';
	result = result + '\n';

	result = result + '[b]' + _i18n('label_export_extensions') + '[/b] '
	+ Object.keys(extensionInfos.enabled).length + '\n';


	for ( var i in extensionInfos.enabled) {
		var extensionInfo = extensionInfos.enabled[i];
		result = result + getBBCodeData(extensionInfo, descriptionOn);
	}

	result = result + '[b]' + _i18n('label_export_extensions_disabled')
	+ '[/b] ' + Object.keys(extensionInfos.disabled).length + '\n';

	for ( var i in extensionInfos.disabled) {
		var extensionInfo = extensionInfos.disabled[i];
		result = result + getBBCodeData(extensionInfo, descriptionOn);
	}

	result = result + '[b]' + _i18n('label_export_apps') + '[/b] '
	+ Object.keys(extensionInfos.apps).length + '\n';

	for ( var i in extensionInfos.apps) {
		var extensionInfo = extensionInfos.apps[i];
		result = result + getBBCodeData(extensionInfo, descriptionOn);
	}

	result = result + '\n' + _i18n('label_exported_via_bbcode') + '\n';

	return result;
}
function getBBCodeData(extensionInfo, descriptionOn) {
	var result = '- [url=' + 'https://chrome.google.com/webstore/detail/'
	+ extensionInfo.id + ']' + extensionInfo.name + '[/url] ' + 'v'
	+ extensionInfo.version + '\n';

	if (descriptionOn && extensionInfo.description != undefined
			&& extensionInfo.description != '') {
		result = result + ' [i]' + extensionInfo.description + '[/i]\n';
	}

	result = result + '\n';
	return result;
}

function generateHTML(extensionInfos, descriptionOn) {
	var curdate = new Date();
	var result = '';
	result = result
	+ '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">\n';
	result = result + '<html><head><title>' + _i18n('title_export_html')
	+ '</title>\n';
	result = result
	+ '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n';
	result = result + '<base target="_blank">\n';
	result = result + '</head>\n';
	result = result + '<body>\n';
	result = result + '<b>' + _i18n('label_export_generated') + '</b> '
	+ curdate.toGMTString() + '<br>\n';
	result = result + '<b>' + _i18n('label_export_user_agent') + '</b> '
	+ navigator.userAgent + '<br>\n';

	result = result + '<br>\n';
	result = result + '<b>' + _i18n('label_export_extensions') + '</b> '
	+ Object.keys(extensionInfos.enabled).length + '';
	result = result + '<ul>';
	for ( var i in extensionInfos.enabled) {
		var extensionInfo = extensionInfos.enabled[i];
		result = result + getHTMLData(extensionInfo, descriptionOn);
	}
	result = result + '</ul>\n';

	result = result + '<br>\n';
	result = result + '<b>' + _i18n('label_export_extensions_disabled') + '</b> '
	+ Object.keys(extensionInfos.disabled).length + '';
	result = result + '<ul>';
	for ( var i in extensionInfos.disabled) {
		var extensionInfo = extensionInfos.disabled[i];
		result = result + getHTMLData(extensionInfo, descriptionOn);
	}
	result = result + '</ul>\n';

	result = result + '<br>\n';
	result = result + '<b>' + _i18n('label_export_apps') + '</b> '
	+ Object.keys(extensionInfos.apps).length + '';
	result = result + '<ul>';
	for ( var i in extensionInfos.apps) {
		var extensionInfo = extensionInfos.apps[i];
		result = result + getHTMLData(extensionInfo, descriptionOn);
	}
	result = result + '</ul>\n';	



	result = result + '<br><br>' + _i18n('label_exported_via_html') + '\n';

	result = result + '</body></html>\n';
	return result;

}

function getHTMLData(extensionInfo, descriptionOn) {
	var result = '<li> <a href="'
		+ 'https://chrome.google.com/webstore/detail/'
		+ extensionInfo.id + '" target="_blank">' + extensionInfo.name
		+ '</a> v' + extensionInfo.version;

	if (descriptionOn && extensionInfo.description != undefined
			&& extensionInfo.description != '') {
		result = result + '<br><i>' + extensionInfo.description + '</i>';
	}

	result = result + '</li>\n';

	result = result + '\n';
	return result;
}


function generateText(extensionInfos, descriptionOn) {
	var curdate = new Date();
	var result = '';
	result = result + _i18n('label_export_generated') + ' '
	+ curdate.toGMTString() + '\n';
	result = result + _i18n('label_export_user_agent') + ' '
	+ navigator.userAgent + '\n';
	result = result + '\n';
	result = result + _i18n('label_export_extensions') + ' '
	+ extensionInfos.countEnabled() + '\n';

	for ( var i in extensionInfos.enabled) {
		var extensionInfo = extensionInfos.enabled[i];
		result = result + getDescriptionText(extensionInfo, descriptionOn);
	}

	result = result + '\n' + _i18n('label_export_extensions_disabled') + ' '
	+ extensionInfos.countDisabled() + '\n';

	for ( var i in extensionInfos.disabled) {
		var extensionInfo = extensionInfos.disabled[i];
		result = result + getDescriptionText(extensionInfo, descriptionOn);
	}

	result = result + '\n' + _i18n('label_export_apps') + ' '
	+ extensionInfos.countApps() + '\n';

	for ( var i in extensionInfos.apps) {
		var extensionInfo = extensionInfos.apps[i];
		result = result + getDescriptionText(extensionInfo, descriptionOn);
	}

	result = result + '\n\n' + _i18n('label_exported_via_text') + '\n';

	return result;
}

function getDescriptionText(extensionInfo, descriptionOn) {
	var result = '- ' + extensionInfo.name + ' v' + extensionInfo.version
	+ ': ' + 'https://chrome.google.com/webstore/detail/'
	+ extensionInfo.id + '\n';

	if (descriptionOn) {
		result = result + '   ' + extensionInfo.description + '\n';
	}
	return result;
}
function getTextData(extensionInfo, descriptionOn) {
	var result = '- [url=' + 'https://chrome.google.com/webstore/detail/'
	+ extensionInfo.id + ']' + extensionInfo.name + '[/url] ' + 'v'
	+ extensionInfo.version + '\n';

	if (descriptionOn && extensionInfo.description != undefined
			&& extensionInfo.description != '') {
		result = result + ' [i]' + extensionInfo.description + '[/i]\n';
	}

	result = result + '\n';
	return result;
}
function generateWiki(extensionInfos, descriptionOn) {
	var curdate = new Date();
	var result = '';
	result = result + "'''" + _i18n('label_export_generated') + "''' "
	+ curdate.toGMTString() + '\n\n';
	result = result + "'''" + _i18n('label_export_user_agent') + "''' "
	+ navigator.userAgent + '\n';
	result = result + '\n';
	result = result + "'''" + _i18n('label_export_extensions') + " " + extensionInfos.countEnabled() + "''' \n";

	for ( var i in extensionInfos.enabled) {
		var extensionInfo = extensionInfos.enabled[i];
		result = result + getWikiData(extensionInfo, descriptionOn);
	}

	result = result + "\n'''" + _i18n('label_export_extensions_disabled') + ' '	+ extensionInfos.countDisabled() + "'''\n";

	for ( var i in extensionInfos.disabled) {
		var extensionInfo = extensionInfos.disabled[i];
		result = result + getWikiData(extensionInfo, descriptionOn);
	}

	result = result + "\n'''" + _i18n('label_export_apps') + ' ' + extensionInfos.countApps() + "'''\n";

	for ( var i in extensionInfos.apps) {
		var extensionInfo = extensionInfos.apps[i];
		result = result + getWikiData(extensionInfo, descriptionOn);
	}

	result = result + '\n\n' + _i18n('label_exported_via_wiki') + '\n';

	return result;
}

function getWikiData(extensionInfo, descriptionOn) {
	var result = '* [' + 'https://chrome.google.com/webstore/detail/'
	+ extensionInfo.id + ' ' + extensionInfo.name + '] v'
	+ extensionInfo.version + '' + '\n';

	if (descriptionOn && extensionInfo.description != undefined
			&& extensionInfo.description != '') {
		result = result + ":''" + extensionInfo.description + "''\n";
	}

	result = result + '\n';
	return result;
}

function getSectionHeader(title, count){
	return '<div id="container" class="vbox-container" style="font-size: 100%;"> <div class="wbox" style="padding-right: 5px;"> <div class="section-header">       <table cellpadding="0" cellspacing="0" width="100%">      <tbody><tr valign="center">         <td>           <span class="section-header-title">' + title + '</span>          <span class="section-header-title">(<span id="extensions_length">' + count + '</span>)</span>        </td>        <td width="18" padding=""></td>         <td width="50" align="right">         </td>      </tr>       </tbody></table></div></div></div>';
}
