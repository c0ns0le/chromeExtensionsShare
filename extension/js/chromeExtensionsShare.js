/*
 * The background page is asking us to find userpics on the page.
 */

chrome.extension.sendRequest({
	'action' : 'fetchTabInfo'
}, fetchTabInfo);

function fetchTabInfo(backgroundPage) {
	console.log('content_scripts.fetchTabInfo:' + backgroundPage);

}

function generateBBCode(extensionInfos) {
	var result = '';

	result = result + '[b]Generated:[/b] Thu Mar 03 2011 12:25:01 GMT+0100\n';
	result = result
			+ '[b]User Agent:[/b] Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.14) Gecko/20110218 Firefox/3.6.14\n';
	result = result + '\n';
	result = result + '[b]Enabled Extensions:[/b] [31]\n';
	result = result
			+ '- [url=http://www.google.com/search?q=Firefox%20Add-on%20Compatibility%20Reporter]Add-on Compatibility Reporter[/url] 0.6\n';
	result = result + '\n';
	result = result + '[b]Disabled Extensions:[/b] [3]\n';
	result = result
			+ '- [url=http://www.conduit.com]Conduit Engine[/url] 3.2.5.2\n';
	result = result + '\n';
	result = result + '[b]Total Extensions: 34[/b]\n';
	result = result + '\n';
	result = result + '[b]Installed Themes:[/b] [1]\n';
	result = result + '- [b][url=http://www.mozilla.org/]Default[/url][/b]\n';
	result = result + '\n';
	result = result + ' [b]Installed Plugins:[/b] (21)\n';
	result = result + ' - Adobe Acrobat\n';

	return result;
}

function generateHTML(extensionInfos) {
	var result = '';
	result = result
			+ '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">\n';
	result = result + '<html><head><title>My Config- default</title>\n';
	result = result
			+ '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n';
	result = result + '<style type="text/css">\n';
	result = result
			+ 'body { background: #FFFFFF; color: #1F007F; font-family:Arial; font-size: 12px;} ul {margin-left: 0; padding-left: 1.25em;} .ExtensionHeader {font-weight: bold; } .ExtensionDisabledHeader  {font-weight: bold; } .ThemeHeader {font-weight: bold; } .PluginHeader {font-weight: bold; }.GeneratedHeader {font-weight: bold; } .UserAgentHeader {font-weight: bold; } .BuildIDHeader {font-weight: bold; }\n';
	result = result + '</style>\n';
	result = result + '<base target="_blank">\n';
	result = result + '</head>\n';
	result = result + '<body>\n';
	result = result
			+ '<span class="GeneratedHeader">Generated:</span> Thu Mar 03 2011 12:25:34 GMT+0100<br>\n';
	result = result
			+ '<span class="UserAgentHeader">User Agent:</span> Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.14) Gecko/20110218 Firefox/3.6.14<br>\n';
	result = result
			+ '<span class="BuildIDHeader">Build ID:</span> 20110218125750<br>\n';
	result = result + '<br>\n';
	result = result
			+ '<span class="ExtensionHeader">Enabled Extensions:</span> [31]<ul><li> <a href="http://www.google.com/search?q=Firefox%20Add-on%20Compatibility%20Reporter" target="_blank">Add-on Compatibility Reporter</a> 0.6</li>\n';
	result = result
			+ '<li> <a href="http://www.anchorfree.com/" target="_blank">afurladvisor</a> 1.0</li>\n';
	result = result + '...\n';
	result = result + '</ul><br>\n';
	result = result
			+ '<span class="ExtensionDisabledHeader">Disabled Extensions:</span> [3]\n';
	result = result + '<ul>\n';
	result = result
			+ '<li> <a href="http://www.conduit.com" target="_blank">Conduit Engine</a> 3.2.5.2</li>\n';
	result = result + '...\n';
	result = result + '</ul><br>\n';
	result = result
			+ '<span class="ExtensionHeader">Total Extensions: 34</span><br>\n';
	result = result + '<br>\n';
	result = result
			+ '<span class="ThemeHeader">Installed Themes:</span> [1]<ul><li> <b><a href="http://www.mozilla.org/" target="_blank">Default</a></b></li>\n';
	result = result + '</ul><br>\n';
	result = result
			+ '<span class="PluginHeader">Installed Plugins:</span> (21)<ul><li> Adobe Acrobat</li>\n';
	result = result + '<li> DivX Web Player</li>\n';
	result = result + '...\n';
	result = result + '</ul><br>\n';
	result = result + '</body></html>\n';
	return result;

}

function generateText(extensionInfos) {
	var result = '';
	result = result + 'Generated: Thu Mar 03 2011 12:25:23 GMT+0100\n';
	result = result
			+ 'User Agent: Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.14) Gecko/20110218 Firefox/3.6.14\n';
	result = result + 'Build ID: 20110218125750\n';
	result = result + '\n';
	result = result + 'Enabled Extensions: [31]\n';
	result = result
			+ '- Add-on Compatibility Reporter 0.6: http:// www.google.com/search?q=Firefox%20Add-on%20Compatibility%20Reporter\n';
	result = result + '...\n';
	result = result + '\n';
	result = result + 'Disabled Extensions: [3]\n';
	result = result + '- Conduit Engine 3.2.5.2: http:// www.conduit.com\n';
	result = result + '...\n';
	result = result + '\n';
	result = result + 'Total Extensions: 34\n';
	result = result + '\n';
	result = result + 'Installed Themes: [1]\n';
	result = result + '- Default: http:// www.mozilla.org/\n';
	result = result + '\n';
	result = result + 'Installed Plugins: (21)\n';
	result = result + '- Adobe Acrobat\n';
	result = result + '...\n';
	return result;

}