/*
 * The background page is asking us to find userpics on the page.
 */

chrome.extension.sendRequest({
	'action' : 'fetchTabInfo'
}, fetchTabInfo);

function fetchTabInfo(backgroundPage) {
	console.log('content_scripts.fetchTabInfo:' + backgroundPage);
}

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

function exportTo(type) {
	chrome.management.getAll(function(extensionInfos) {
		console.log('exporting to:' + type);

		var selectedExtensions = new Array();

		for ( var i in extensionInfos) {
			var extensionInfo = extensionInfos[i];

			if ($('#' + extensionInfo.id).hasClass('selected')) {
				// selectedExtensions
				console.log(extensionInfo);
				selectedExtensions[selectedExtensions.length] = extensionInfo;
			}
		}

		console.log(selectedExtensions);

		var code = '';
		switch (type) {
		case 'bbcode':
			code = generateBBCode(selectedExtensions);
			break;
		case 'html':
			code = generateHTML(selectedExtensions);
			break;
		case 'text':
			code = generateText(selectedExtensions);
			break;
		default:
			break;
		}

		console.log(code);

	});
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
			var lastIconUrl = 'images/extension.png';

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

			/*
			 * $('.content').append( '<div>' + extensionInfo.isApp + '</div>' + '<div>' +
			 * extensionInfo.id + '</div>' + '<div>' + extensionInfo.name + '</div>' + '<div>' +
			 * extensionInfo.description + '</div>');
			 */

		}
	} // for

	return counter;
}
function generateBBCode(extensionInfos) {
	var curdate = new Date();
	var result = '';

	result = result + '[b]Generated:[/b] ' + curdate.toGMTString() + '\n';
	result = result + '[b]User Agent:[/b] ' + navigator.userAgent + '\n';
	result = result + '\n';
	result = result + '[b]Extensions:[/b] [' + extensionInfos.length + ']\n';

	for ( var i in extensionInfos) {
		var extensionInfo = extensionInfos[i];

		result = result + '- [url='
				+ 'https://chrome.google.com/webstore/detail/'
				+ extensionInfo.id + ']' + extensionInfo.name + '[/url] '
				+ extensionInfo.version + '\n';
		result = result + '\n';
	}

	/*
	 * result = result + '[b]Disabled Extensions:[/b] [3]\n'; result = result + '-
	 * [url=http://www.conduit.com]Conduit Engine[/url] 3.2.5.2\n'; result =
	 * result + '\n'; result = result + '[b]Total Extensions: 34[/b]\n'; result =
	 * result + '\n'; result = result + '[b]Installed Themes:[/b] [1]\n'; result =
	 * result + '- [b][url=http://www.mozilla.org/]Default[/url][/b]\n'; result =
	 * result + '\n'; result = result + ' [b]Installed Plugins:[/b] (21)\n';
	 * result = result + ' - Adobe Acrobat\n';
	 */

	return result;
}

function generateHTML(extensionInfos) {
	var curdate = new Date();
	var result = '';
	result = result
			+ '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">\n';
	result = result + '<html><head><title>My Config - default</title>\n';
	result = result
			+ '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n';
	result = result + '<style type="text/css">\n';
	result = result
			+ 'body { background: #FFFFFF; color: #1F007F; font-family:Arial; font-size: 12px;} ul {margin-left: 0; padding-left: 1.25em;} .ExtensionHeader {font-weight: bold; } .ExtensionDisabledHeader  {font-weight: bold; } .ThemeHeader {font-weight: bold; } .PluginHeader {font-weight: bold; }.GeneratedHeader {font-weight: bold; } .UserAgentHeader {font-weight: bold; } .BuildIDHeader {font-weight: bold; }\n';
	result = result + '</style>\n';
	result = result + '<base target="_blank">\n';
	result = result + '</head>\n';
	result = result + '<body>\n';
	result = result + '<span class="GeneratedHeader">Generated:</span> '
			+ curdate.toGMTString() + '<br>\n';
	result = result + '<span class="UserAgentHeader">User Agent:</span> '
			+ navigator.userAgent + '<br>\n';
	result = result + '<br>\n';

	result = result + '<span class="ExtensionHeader">Extensions:</span> ['
			+ extensionInfos.length + ']';
	result = result + '<ul>';

	for ( var i in extensionInfos) {
		var extensionInfo = extensionInfos[i];

		result = result + '<li> <a href="'
				+ 'https://chrome.google.com/webstore/detail/'
				+ extensionInfo.id + '" target="_blank">' + extensionInfo.name
				+ '</a> ' + extensionInfo.version + '</li>\n';

	}

	result = result + '</ul><br>\n';

	/*
	 * result = result + '<span class="ExtensionDisabledHeader">Disabled
	 * Extensions:</span> [3]\n'; result = result + '<ul>\n'; result = result + '<li>
	 * <a href="http://www.conduit.com" target="_blank">Conduit Engine</a>
	 * 3.2.5.2</li>\n'; result = result + '...\n'; result = result + '</ul><br>\n';
	 * result = result + '<span class="ExtensionHeader">Total Extensions: 34</span><br>\n';
	 * result = result + '<br>\n'; result = result + '<span
	 * class="ThemeHeader">Installed Themes:</span> [1]<ul><li> <b><a
	 * href="http://www.mozilla.org/" target="_blank">Default</a></b></li>\n';
	 * result = result + '</ul><br>\n'; result = result + '<span
	 * class="PluginHeader">Installed Plugins:</span> (21)<ul><li> Adobe
	 * Acrobat</li>\n'; result = result + '<li> DivX Web Player</li>\n';
	 * result = result + '...\n'; result = result + '</ul><br>\n';
	 */
	result = result + '</body></html>\n';
	return result;

}

function generateText(extensionInfos) {
	var curdate = new Date();
	var result = '';
	result = result + 'Generated: ' + curdate.toGMTString() + '\n';
	result = result + 'User Agent: ' + navigator.userAgent + '\n';
	result = result + '\n';
	result = result + 'Enabled Extensions: [' + extensionInfos.length + ']\n';

	for ( var i in extensionInfos) {
		var extensionInfo = extensionInfos[i];

		result = result + '- ' + extensionInfo.name + ' '
				+ extensionInfo.version + ': '
				+ 'https://chrome.google.com/webstore/detail/'
				+ extensionInfo.id + '\n';
	}
	/*
	 * result = result + '\n'; result = result + 'Disabled Extensions: [3]\n';
	 * result = result + '- Conduit Engine 3.2.5.2: http:// www.conduit.com\n';
	 * result = result + '...\n'; result = result + '\n'; result = result +
	 * 'Total Extensions: 34\n'; result = result + '\n'; result = result +
	 * 'Installed Themes: [1]\n'; result = result + '- Default: http://
	 * www.mozilla.org/\n'; result = result + '\n'; result = result + 'Installed
	 * Plugins: (21)\n'; result = result + '- Adobe Acrobat\n'; result = result +
	 * '...\n';
	 */
	return result;

}