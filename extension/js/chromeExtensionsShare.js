/*
 * The background page is asking us to find userpics on the page.
 */

var _lastExport = 'text';
var _subject = 'Here are my selected Chrome Extensions';


function selectAll(select) {
	if (select) {
		$('.extension').addClass('selected');
	} else {
		$('.extension').removeClass('selected');
	}
}

function select(type) {
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

function reExport() {
	exportTo(_lastExport);
}

function sendTo(destination) {

	window.open('https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=' + _subject
			+ '&body=' + encodeURIComponent($('#export').val()));

}

function exportTo(type) {
	// chrome.management.getAll(function(extensionInfos) {
	console.log('exporting to:' + type);

	var descriptionOn = $('#description:checked').val();
	_lastExport = type;
	var selectedExtensions = new Array();

	// for ( var i in extensionInfos) {
	// var extensionInfo = extensionInfos[i];

	for ( var i in _extensionInfos) {
		var extensionInfo = _extensionInfos[i];
		if ($('#' + extensionInfo.id).hasClass('selected')) {
			// selectedExtensions
			console.log(extensionInfo);
			selectedExtensions[selectedExtensions.length] = extensionInfo;
		}
	}

	console.log(selectedExtensions);
	if (selectedExtensions == undefined || selectedExtensions.length == 0) {
		alert('Please select some extensions');
		return;
	}

	var code = '';

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
}

function populateExtensions(extensionInfos) {

	var counter = 0;
	for ( var i in extensionInfos) {
		var extensionInfo = extensionInfos[i];

		if (extensionInfo.enabled && !extensionInfo.isApp) {
			counter++;
			console.log(extensionInfo);

			var data = template;
			$('.extension', data).attr('id', extensionInfo.id);

			$('#name2', data).hide();
			$('#name', data).html(extensionInfo.name);

			$('.inspectPopupNote', data).html(extensionInfo.description);
			$('.extension-description', data).html(extensionInfo.description);

			$('#homepageUrl', data).attr(
					'href',
					'https://chrome.google.com/webstore/detail/'
							+ extensionInfo.id);

			$('#version', data).html(extensionInfo.version);
			$('#enabled', data).hide();
			$('#id', data).html(extensionInfo.id);

			var lastIconSize = 0;
			var lastIconUrl = 'images/extension_unknown.png';

			if (extensionInfo.icons != undefined && extensionInfo.icons.length) {
				for ( var j in extensionInfo.icons) {
					if (lastIconSize < extensionInfo.icons[j].size) {
						lastIconSize = extensionInfo.icons[j].size;
						lastIconUrl = extensionInfo.icons[j].url;
					}
				}
			}

			$('#icon', data).attr('src', lastIconUrl);

			$('.content').append(data.html());

			_extensionInfos[extensionInfo.id] = extensionInfo;

		}
	} // for

	return counter;
}

function generateBBCode(extensionInfos, descriptionOn) {
	var curdate = new Date();
	var result = '';

	result = result + '[b]Generated:[/b] ' + curdate.toGMTString() + '\n';
	result = result + '[b]User Agent:[/b] ' + navigator.userAgent + '\n';
	result = result + '\n';
	result = result + '[b]Extensions:[/b] ' + extensionInfos.length + '\n';

	for ( var i in extensionInfos) {
		var extensionInfo = extensionInfos[i];

		result = result + '- [url='
				+ 'https://chrome.google.com/webstore/detail/'
				+ extensionInfo.id + ']' + extensionInfo.name + '[/url] ' + 'v'
				+ extensionInfo.version + '\n';

		if (descriptionOn && extensionInfo.description != undefined
				&& extensionInfo.description != '') {
			result = result + ' [i]' + extensionInfo.description + '[/i]\n';
		}

		result = result + '\n';
	}

	return result;
}

function generateHTML(extensionInfos, descriptionOn) {
	var curdate = new Date();
	var result = '';
	result = result
			+ '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">\n';
	result = result + '<html><head><title>My Chrome Extension</title>\n';
	result = result
			+ '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n';
	result = result + '<base target="_blank">\n';
	result = result + '</head>\n';
	result = result + '<body>\n';
	result = result + '<b>Generated:</b> ' + curdate.toGMTString() + '<br>\n';
	result = result + '<b>User Agent:</b> ' + navigator.userAgent + '<br>\n';
	result = result + '<br>\n';
	result = result + '<b>Extensions:</b> ' + extensionInfos.length + '';
	result = result + '<ul>';

	for ( var i in extensionInfos) {
		var extensionInfo = extensionInfos[i];

		result = result + '<li> <a href="'
				+ 'https://chrome.google.com/webstore/detail/'
				+ extensionInfo.id + '" target="_blank">' + extensionInfo.name
				+ '</a> v' + extensionInfo.version;

		if (descriptionOn && extensionInfo.description != undefined
				&& extensionInfo.description != '') {
			result = result + '<br><i>' + extensionInfo.description + '</i>\n';
		}

		+'</li>\n';
	}

	result = result + '</ul>\n';
	result = result + '</body></html>\n';
	return result;

}

function generateText(extensionInfos, descriptionOn) {
	var curdate = new Date();
	var result = '';
	result = result + 'Generated: ' + curdate.toGMTString() + '\n';
	result = result + 'User Agent: ' + navigator.userAgent + '\n';
	result = result + '\n';
	result = result + 'Extensions: ' + extensionInfos.length + '\n';

	for ( var i in extensionInfos) {
		var extensionInfo = extensionInfos[i];

		/*
		result = result + '- ' + extensionInfo.name + ' v'
				+ extensionInfo.version + ': '
				+ 'https://chrome.google.com/webstore/detail/'
				+ extensionInfo.id + '\n';

		if (descriptionOn && extensionInfo.description != undefined
				&& extensionInfo.description != '') {
			result = result + '   ' + extensionInfo.description + '\n';
		}*/
		result = result + getDescriptionText(extensionInfo, descriptionOn);
		
	}

	return result;
}

function getDescriptionText(extensionInfo, descriptionOn) {
	var result = '- ' + extensionInfo.name + ' v' + extensionInfo.version
			+ ': ' + 'https://chrome.google.com/webstore/detail/'
			+ extensionInfo.id + '\n';

	result = result + '   ' + extensionInfo.description + '\n';

	return result;
}

function generateWiki(extensionInfos, descriptionOn) {
	var curdate = new Date();
	var result = '';
	result = result + "'''Generated:''' " + curdate.toGMTString() + '\n\n';
	result = result + "'''User Agent:''' " + navigator.userAgent + '\n';
	result = result + '\n';
	result = result + "'''Extensions:''' " + extensionInfos.length + "\n";

	for ( var i in extensionInfos) {
		var extensionInfo = extensionInfos[i];

		result = result + '* [' + 'https://chrome.google.com/webstore/detail/'
				+ extensionInfo.id + ' ' + extensionInfo.name + '] v'
				+ extensionInfo.version + '' + '\n';

		if (descriptionOn && extensionInfo.description != undefined
				&& extensionInfo.description != '') {
			result = result + ":''" + extensionInfo.description + "''\n";
		}
	}

	return result;
}
