function UserExtensions() {
    this.enabled = Object();
    this.disabled = Object();
    this.apps = Object();
    this.countSelected = function () {
        return Object.keys(this.enabled).length + Object.keys(this.disabled).length + Object.keys(this.apps).length;
    };
    this.countEnabled = function () {
        return Object.keys(this.enabled).length;
    };
    this.countDisabled = function () {
        return Object.keys(this.disabled).length;
    };
    this.countApps = function () {
        return Object.keys(this.apps).length;
    };

    this.getImageUrl = function (extensionInfo) {

        var lastIconSize = 0;
        var lastIconUrl = 'images/extension.png';

        if (extensionInfo.enabled && extensionInfo.icons != undefined
            && extensionInfo.icons.length) {
            for (var j in extensionInfo.icons) {
                if (lastIconSize < extensionInfo.icons[j].size) {
                    lastIconSize = extensionInfo.icons[j].size;
                    lastIconUrl = extensionInfo.icons[j].url;
                }
            }
        }

        return lastIconUrl;
    };

}

function ExtensionsShare() {
    this._extensionInfos = new UserExtensions();
    this._lastExportType = 'text';
    this._template = null;
    this.setTemplate = function (template) {
        this._template = template;
    };
    this.exportTo = function (type) {
        // chrome.management.getAll(function(extensionInfos) {
        console.log('exporting to:' + type);

        var descriptionOn = $('#description:checked').val();
        var versionOn = $('#export_include_version:checked').val();
        this._lastExportType = type;
        var selectedExtensions = new UserExtensions();

        // for ( var i in extensionInfos) {
        // var extensionInfo = extensionInfos[i];

        var i = null;
        var extensionInfo = null;
        for (i in this._extensionInfos.enabled) {
            extensionInfo = this._extensionInfos.enabled[i];
            if ($('#' + extensionInfo.id).hasClass('selected')) {
                selectedExtensions.enabled[extensionInfo.id] = extensionInfo;
            }
        } // for

        for (i in this._extensionInfos.disabled) {
            extensionInfo = this._extensionInfos.disabled[i];
            if ($('#' + extensionInfo.id).hasClass('selected')) {
                selectedExtensions.disabled[extensionInfo.id] = extensionInfo;
            }
        } // for

        for (i in this._extensionInfos.apps) {
            extensionInfo = this._extensionInfos.apps[i];
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
            '/extensions/export/' + type + '/' + selectedExtensions.countSelected()
            + '/']);

        switch (type) {
            case 'bbcode':
                code = generateBBCode(selectedExtensions, descriptionOn, versionOn);
                break;
            case 'html':
                code = generateHTML(selectedExtensions, descriptionOn, versionOn);
                break;
            case 'text':
                code = generateText(selectedExtensions, descriptionOn, versionOn);
                break;
            case 'wiki':
                code = generateWiki(selectedExtensions, descriptionOn, versionOn);
                break;
            case 'markdown':
                code = generateMarkDown(selectedExtensions, descriptionOn, versionOn);
                break;
            default:
                break;
        }

        var $nav2 = $('#nav2');
        $nav2.find('li.selected').removeClass('selected');

        if (code != undefined && code != '') {
            $('#export').val(code);
            $nav2.find('li.' + type).addClass('selected');

            $("#dialog-modal").dialog({
                modal: true,
                draggable: false,
                position: 'center',
                width: 800,
                height: 600,
                closeOnEscape: true
            });

            // $('#dialog-modal').dialog('open');
        }

        // });
    };

    this.reExport = function () {
        this.exportTo(this._lastExportType);
    };

    this.populateExtensions = function (extensionInfos) {

        this._extensionInfos = new UserExtensions();

        for (var i in extensionInfos) {
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

        $('.content').append(getSectionHeader(_i18n('section_header_title_enabled_extensions'), this._extensionInfos.countEnabled(), 'enabled'));
        for (var i in this._extensionInfos.enabled) {
            $('.content').append(this.populateData($(this._template).clone(), this._extensionInfos.enabled[i]));
            //break;
        }

        $('.content').append(getSectionHeader(_i18n('section_header_title_disabled_extensions'), this._extensionInfos.countDisabled(), 'disabled'));
        for (var i in this._extensionInfos.disabled) {
            $('.content').append(this.populateData(this._template, this._extensionInfos.disabled[i]));
            //break;
        }


        $('.content').append(getSectionHeader(_i18n('section_header_title_apps'), this._extensionInfos.countApps(), 'app'));
        for (var i in this._extensionInfos.apps) {
            $('.content').append(this.populateData(this._template, this._extensionInfos.apps[i]));
            //break;
        }

        return this._extensionInfos.countSelected();
    };


    this.getLastExportType = function () {
        return this._lastExportType;
    };

    this.getExtensionInfoById = function (id) {

        if (typeof(this._extensionInfos.enabled[id]) != 'undefined') {
            return this._extensionInfos.enabled[id];
        }

        if (typeof(this._extensionInfos.disabled[id]) != 'undefined') {
            return this._extensionInfos.disabled[id];
        }

        if (typeof(this._extensionInfos.apps[id]) != 'undefined') {
            return this._extensionInfos.apps[id];
        }

    };


    this.populateData = function (data, extensionInfo) {
        //var data = template;
        $('.extension', data).attr('id', extensionInfo.id);

        if (extensionInfo.isApp) {
            $('#icon', data).attr('src', this._extensionInfos.getImageUrl(extensionInfo));
            $('.extension', data).addClass('app').removeClass('enabled').removeClass('disabled');
            $('#action_disable', data).addClass('hd');
            $('#action_enable', data).addClass('hd');

        } else {
            if (!extensionInfo.enabled) {
                $('#icon', data).attr('src', 'images/extension_unknown.png');
                $('.extension', data).addClass('disabled');
                $('.extension', data).removeClass('enabled');
                $('#action_disable', data).addClass('hd');
                $('#action_enable', data).removeClass('hd');
            } else {
                $('#icon', data).attr('src', this._extensionInfos.getImageUrl(extensionInfo));
                $('.extension', data).addClass('enabled');
                $('.extension', data).removeClass('disabled');
                $('#action_disable', data).removeClass('hd');
                $('#action_enable', data).addClass('hd');
            }
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

        return data.html();
    };

    this.getImageUrl = function (extensionInfo) {
        return this._extensionInfos.getImageUrl(extensionInfo);
    };

}

function selectAll(select) {
    if (select) {
        $('.extension').addClass('selected');
    } else {
        $('.extension').removeClass('selected');
    }
}

function selectExtensions(type) {
    console.log('select', type);
    _gaq.push(['_trackPageview', '/extensions/select/' + type + '/']);

    var $extension = $('.extension');
    switch (type) {
        case 'all':
            $extension.addClass('selected');
            break;
        case 'none':
            $extension.removeClass('selected');
            break;
        case 'revert':
            $extension.each(function () {
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

    var body = encodeURIComponent($('#export').val());
    console.log(body.length);

    var answer = true;

    if (body.length > 1793) {
        answer = confirm(_i18n('export_mail_size_warning'));
    }


    if (answer) {
        _gaq.push(['_trackPageview', '/extensions/export/gmail/']);
        window.open('https://mail.google.com/mail/?view=cm&fs=1&tf=1&su='
            + encodeURIComponent(_i18n('title_export_mail')) + '&body=' + body);
    }


    return false;

}


function generateBBCode(extensionInfos, descriptionOn, versionOn) {
    var curdate = new Date();
    var result = '';

    result = result + '[b]' + _i18n('label_export_generated') + '[/b] '
        + curdate.toGMTString() + '\n';
    result = result + '[b]' + _i18n('label_export_user_agent') + '[/b] '
        + navigator.userAgent + '\n';
    result = result + '\n';

    result = result + '[b]' + _i18n('label_export_extensions') + '[/b] '
        + Object.keys(extensionInfos.enabled).length + '\n';


    for (var i in extensionInfos.enabled) {
        var extensionInfo = extensionInfos.enabled[i];
        result = result + getBBCodeData(extensionInfo, descriptionOn, versionOn);
    }

    result = result + '[b]' + _i18n('label_export_extensions_disabled')
        + '[/b] ' + Object.keys(extensionInfos.disabled).length + '\n';

    for (var i in extensionInfos.disabled) {
        var extensionInfo = extensionInfos.disabled[i];
        result = result + getBBCodeData(extensionInfo, descriptionOn, versionOn);
    }

    result = result + '[b]' + _i18n('label_export_apps') + '[/b] '
        + Object.keys(extensionInfos.apps).length + '\n';

    for (var i in extensionInfos.apps) {
        var extensionInfo = extensionInfos.apps[i];
        result = result + getBBCodeData(extensionInfo, descriptionOn, versionOn);
    }

    result = result + '\n' +
        '[url=https://chrome.google.com/webstore/detail/' + _i18n('extension_id') + ']'
        + _i18n('ext_name_full') + '[/url]\n';

    return result;
}
function getBBCodeData(extensionInfo, descriptionOn, versionOn) {
    var result = '- [url=' + 'https://chrome.google.com/webstore/detail/'
        + extensionInfo.id + ']' + extensionInfo.name + '[/url] ';

    if (versionOn) {
        result = result + 'v' + extensionInfo.version;
    }

    result = result + '\n';


    if (descriptionOn && extensionInfo.description != undefined
        && extensionInfo.description != '') {
        result = result + ' [i]' + extensionInfo.description + '[/i]\n';
    }

    result = result + '\n';
    return result;
}

function generateHTML(extensionInfos, descriptionOn, versionOn) {
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

    for (var i in extensionInfos.enabled) {
        var extensionInfo = extensionInfos.enabled[i];
        result = result + getHTMLData(extensionInfo, descriptionOn, versionOn);
    }
    result = result + '</ul>\n';

    result = result + '<br>\n';
    result = result + '<b>' + _i18n('label_export_extensions_disabled') + '</b> '
        + Object.keys(extensionInfos.disabled).length + '';
    result = result + '<ul>';
    for (var i in extensionInfos.disabled) {
        var extensionInfo = extensionInfos.disabled[i];
        result = result + getHTMLData(extensionInfo, descriptionOn, versionOn);
    }
    result = result + '</ul>\n';

    result = result + '<br>\n';
    result = result + '<b>' + _i18n('label_export_apps') + '</b> '
        + Object.keys(extensionInfos.apps).length + '';
    result = result + '<ul>';
    for (var i in extensionInfos.apps) {
        var extensionInfo = extensionInfos.apps[i];
        result = result + getHTMLData(extensionInfo, descriptionOn, versionOn);
    }
    result = result + '</ul>\n';

    result = result + '<br><br>'
        + _i18n('exported_via') + ' <a href=\"https://chrome.google.com/webstore/detail/'
        + _i18n('extension_id') + '\" target=\"_blank\">' + _i18n('ext_name_full') + '</a>'
        + '\n';

    result = result + '</body></html>\n';
    return result;

}

function getHTMLData(extensionInfo, descriptionOn, versionOn) {
    var result = '<li> <a href="'
        + 'https://chrome.google.com/webstore/detail/'
        + extensionInfo.id + '" target="_blank">' + extensionInfo.name
        + '</a> ';

    if (versionOn) {
        result = result + 'v' + extensionInfo.version;
    }

    result = result + '\n';

    if (descriptionOn && extensionInfo.description != undefined
        && extensionInfo.description != '') {
        result = result + '<br><i>' + extensionInfo.description + '</i>';
    }

    result = result + '</li>\n';

    result = result + '\n';
    return result;
}


function generateText(extensionInfos, descriptionOn, versionOn) {
    var curdate = new Date();
    var result = '';
    result = result + _i18n('label_export_generated') + ' '
        + curdate.toGMTString() + '\n';
    result = result + _i18n('label_export_user_agent') + ' '
        + navigator.userAgent + '\n';
    result = result + '\n';
    result = result + _i18n('label_export_extensions') + ' '
        + extensionInfos.countEnabled() + '\n';

    for (var i in extensionInfos.enabled) {
        var extensionInfo = extensionInfos.enabled[i];
        result = result + getDescriptionText(extensionInfo, descriptionOn, versionOn);
    }

    result = result + '\n' + _i18n('label_export_extensions_disabled') + ' '
        + extensionInfos.countDisabled() + '\n';

    for (var i in extensionInfos.disabled) {
        var extensionInfo = extensionInfos.disabled[i];
        result = result + getDescriptionText(extensionInfo, descriptionOn, versionOn);
    }

    result = result + '\n' + _i18n('label_export_apps') + ' '
        + extensionInfos.countApps() + '\n';

    for (var i in extensionInfos.apps) {
        var extensionInfo = extensionInfos.apps[i];
        result = result + getDescriptionText(extensionInfo, descriptionOn, versionOn);
    }

    result = result + '\n\n'
        + _i18n('exported_via') + ' ' + _i18n('ext_name_full')
        + ' - https://chrome.google.com/webstore/detail/'
        + _i18n('extension_id') + '\n';

    return result;
}

function getDescriptionText(extensionInfo, descriptionOn, versionOn) {
    var result = '- ' + extensionInfo.name;

    if (versionOn) {
        result = result + ' v' + extensionInfo.version;
    }

    result = result + ': ' + 'https://chrome.google.com/webstore/detail/'
        + extensionInfo.id + '\n';


    if (descriptionOn) {
        result = result + '   ' + extensionInfo.description + '\n';
    }

    return result;
}

function generateWiki(extensionInfos, descriptionOn, versionOn) {
    var curdate = new Date();
    var result = '';
    result = result + "'''" + _i18n('label_export_generated') + "''' "
        + curdate.toGMTString() + '\n';
    result = result + "'''" + _i18n('label_export_user_agent') + "''' "
        + navigator.userAgent + '\n';
    result = result + '\n';
    result = result + "'''" + _i18n('label_export_extensions') + " " + extensionInfos.countEnabled() + "''' \n";

    for (var i in extensionInfos.enabled) {
        var extensionInfo = extensionInfos.enabled[i];
        result = result + getWikiData(extensionInfo, descriptionOn, versionOn);
    }

    result = result + "\n'''" + _i18n('label_export_extensions_disabled') + ' ' + extensionInfos.countDisabled() + "'''\n";

    for (var i in extensionInfos.disabled) {
        var extensionInfo = extensionInfos.disabled[i];
        result = result + getWikiData(extensionInfo, descriptionOn, versionOn);
    }

    result = result + "\n'''" + _i18n('label_export_apps') + ' ' + extensionInfos.countApps() + "'''\n";

    for (var i in extensionInfos.apps) {
        var extensionInfo = extensionInfos.apps[i];
        result = result + getWikiData(extensionInfo, descriptionOn, versionOn);
    }

    result = result + '\n\n'
        + _i18n('exported_via') + ' [https://chrome.google.com/webstore/detail/'
        + _i18n('extension_id') + ' ' + _i18n('ext_name_full') + ']'
        + '\n';

    return result;
}

function getWikiData(extensionInfo, descriptionOn, versionOn) {
    var result = '* [' + 'https://chrome.google.com/webstore/detail/'
        + extensionInfo.id + ' ' + extensionInfo.name + '] ';

    if (versionOn) {
        result = result + 'v'
            + extensionInfo.version;
    }
    result = result + '\n';

    if (descriptionOn && extensionInfo.description != undefined
        && extensionInfo.description != '') {
        result = result + ":''" + extensionInfo.description + "''\n";
    }

    result = result + '\n';
    return result;
}

function generateMarkDown(extensionInfos, descriptionOn, versionOn) {
    var curdate = new Date();
    var result = '';
    result = result + "**" + _i18n('label_export_generated') + "** "
        + curdate.toGMTString() + '\n';
    result = result + "**" + _i18n('label_export_user_agent') + "** "
        + navigator.userAgent + '\n\n';

    result = result + "**" + _i18n('label_export_extensions') + "** " + extensionInfos.countEnabled() + "\n\n";

    var i, extensionInfo = null;
    for (i in extensionInfos.enabled) {
        extensionInfo = extensionInfos.enabled[i];
        result = result + generateMarkDownData(extensionInfo, descriptionOn, versionOn);
    }

    result = result + "\n**" + _i18n('label_export_extensions_disabled') + '** ' + extensionInfos.countDisabled() + "\n";

    for (i in extensionInfos.disabled) {
        extensionInfo = extensionInfos.disabled[i];
        result = result + generateMarkDownData(extensionInfo, descriptionOn, versionOn);
    }

    result = result + "\n**" + _i18n('label_export_apps') + '** ' + extensionInfos.countApps() + "\n";

    for (i in extensionInfos.apps) {
        extensionInfo = extensionInfos.apps[i];
        result = result + generateMarkDownData(extensionInfo, descriptionOn, versionOn);
    }

    result = result + '\n\n'
        + _i18n('exported_via') + ' [' + _i18n('ext_name_full') + ']'
        + '(https://chrome.google.com/webstore/detail/'
        + _i18n('extension_id') + ')'
        + '\n';

    return result;
}

function generateMarkDownData(extensionInfo, descriptionOn, versionOn) {
    var result = ' - [' + extensionInfo.name + ']'
        + '(https://chrome.google.com/webstore/detail/' + extensionInfo.id + ') ';

    if (versionOn) {
        result = result + 'v'
            + extensionInfo.version;
    }

    if (descriptionOn && extensionInfo.description != undefined
        && extensionInfo.description != '') {
        result = result + ": *" + extensionInfo.description + "*";
    }

    result = result + '\n';
    return result;
}

function getSectionHeader(title, count, set) {
    var header = $('#splitter-template').clone();

    $(header).removeClass('template');
    $(header).attr('id', 'splitter-' + set);
    $('#extensions_title', header).html(title);
    $('#extensions_length', header).html(count);
    return header;
}

chrome.management.onDisabled.addListener(function (extensionInfo) {
    _gaq.push(['_trackPageview', '/extensions/action/disable/' + extensionInfo.id + '/' + extensionInfo.name]);

    //$('#' + extensionInfo.id).hide('blind');

    $('#' + extensionInfo.id + ' #icon').attr('src', 'images/extension_unknown.png');


    $('#action_enable', $('#' + extensionInfo.id)).show();

    extensionsShare._extensionInfos.disabled[extensionInfo.id] = extensionsShare._extensionInfos.enabled[extensionInfo.id];
    delete extensionsShare._extensionInfos.enabled[extensionInfo.id];

});

chrome.management.onEnabled.addListener(function (extensionInfo) {
    _gaq.push(['_trackPageview', '/extensions/action/enable/' + extensionInfo.id + '/' + extensionInfo.name]);

    //$('#' + extensionInfo.id).hide('blind');
    $('#action_disable', $('#' + extensionInfo.id)).show();

    $('#' + extensionInfo.id + ' #icon').attr('src', extensionsShare.getImageUrl(extensionInfo));


    extensionsShare._extensionInfos.enabled[extensionInfo.id] = extensionsShare._extensionInfos.disabled[extensionInfo.id];
    delete extensionsShare._extensionInfos.disabled[extensionInfo.id];
});

///////////////////////// html JS /////////////////////////////////

function doI18n() {

    $('[nodeName=title]').html(_i18n('default_title'));

    $('.i18n').each(function () {
        $(this).html(_i18n($(this).attr('id')));
    });

    $('.i18nt').each(function () {
        $(this).attr('title', _i18n($(this).attr('id')));
    });

}


function addListeners() {
    $('.Wp').toggle(function () {
        $(this).addClass('Wo').removeClass('Wi');
        $('.extension.' + $(this).parents('.splitter').attr('id').replace("splitter-", "")).addClass('hd');

    }, function () {
        $(this).addClass('Wi').removeClass('Wo');
        $('.extension.' + $(this).parents('.splitter').attr('id').replace("splitter-", "")).removeClass('hd');

    });

    $(".action").tipTip({maxWidth: "auto", edgeOffset: 2, fadeIn: 0, fadeOut: 0});

    $('#description').click(function () {

        _gaq.push(['_trackPageview', '/option/description/' + extensionsShare.getLastExportType() + '/' + $('#description').val()]);

        extensionsShare.reExport();
    });

    $('#export_include_version').click(function () {

        _gaq.push(['_trackPageview', '/option/include_version/' + extensionsShare.getLastExportType() + '/' + $('#export_include_version').val()]);

        extensionsShare.reExport();
    });


    /*
     * close dialog on widget overlay click
     */
    $('.ui-widget-overlay').live("click", function () {
        $("#dialog-modal").dialog("close");
    });


    $('.extension').hover(function () {
        $('.extension-actions', this).show();
    }, function () {
        $('.extension-actions', this).hide();
    }).click(function () {

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            $(this).addClass('selected');
        }

    });

    $('.stars').toggle(function () {
        $(this).addClass('selected');
        $(this).parents('.extension').addClass('selected');

    }, function () {
        $(this).removeClass('selected');
        $(this).parents('.extension').removeClass('selected');
    });

    $('span#share_twitter').click(function () {

        var extensionInfo = extensionsShare.getExtensionInfoById($(this).parents('.extension').attr('id'));

        if (extensionInfo == null) {
            return;
        }
        var subject = ' Chrome Extension';
        if (extensionInfo.isApp) {
            subject = ' Chrome App';
        }

        _gaq.push(['_trackPageview', '/extensions/share/twitter/' + extensionInfo.id + '/' + extensionInfo.name]);

        var text = encodeURIComponent(extensionInfo.name + subject) + '&url=' + encodeURIComponent('https://chrome.google.com/webstore/detail/' + extensionInfo.id);
        var via = 'ShareExtensions';
        window.open('http://twitter.com/share?_=1299226766058&count=horizontal&text=' + text + '&via=' + via);

        return false;
    });

    $('span#share_buzz').click(function () {
        var extensionInfo = extensionsShare.getExtensionInfoById($(this).parents('.extension').attr('id'));

        if (extensionInfo == null) {
            return;
        }

        var subject = ' Chrome Extension';
        if (extensionInfo.isApp) {
            subject = ' Chrome App';
        }

        _gaq.push(['_trackPageview', '/extensions/share/buzz/' + extensionInfo.id + '/' + extensionInfo.name]);
        window.open('http://www.google.com/buzz/post?message=' + encodeURIComponent(extensionInfo.name + subject) + '&imageurl=' + encodeURIComponent('https://chrome.google.com/webstore/img/' + extensionInfo.id + '/2323432/logo128') + '&url=' + encodeURIComponent('https://chrome.google.com/webstore/detail/' + extensionInfo.id));
        return false;
    });

    $('span#share_gmail').click(function () {
        var extensionInfo = extensionsShare.getExtensionInfoById($(this).parents('.extension').attr('id'));

        if (extensionInfo == null) {
            return;
        }

        var subject = _i18n('title_export_mail');
        if (extensionInfo.isApp) {
            subject = _i18n('title_export_mail_app');
        }

        _gaq.push(['_trackPageview', '/extensions/share/mail/' + extensionInfo.id + '/' + extensionInfo.name]);
        window.open('https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=' + encodeURIComponent(subject)
            + '&body=' + encodeURIComponent(getDescriptionText(extensionInfo, true)));

        return false;
    });

    $('span#share_glist').click(function () {
        var extensionInfo = extensionsShare.getExtensionInfoById($(this).parents('.extension').attr('id'));

        if (extensionInfo == null) {
            return;
        }

        var subject = _i18n('title_export_mail');
        if (extensionInfo.isApp) {
            subject = _i18n('title_export_mail_app');
        }

        _gaq.push(['_trackPageview', '/extensions/share/glist/' + extensionInfo.id + '/' + extensionInfo.name]);

        window.open('https://www.google.com/bookmarks/api/bookmarklet?output=popup'
            + '&srcUrl=' + encodeURIComponent('https://chrome.google.com/webstore/detail/' + extensionInfo.id)
            + '&snippet=' + encodeURIComponent(extensionInfo.description)
            + '&title=' + encodeURIComponent(extensionInfo.name));

        return false;
    });


    $('span#action_enable').click(function () {

        $(this).hide();

        chrome.management.setEnabled($(this).parents('.extension').attr('id'), true);

        return false;
    });

    $('span#action_disable').click(function () {
        $(this).hide();

        chrome.management.setEnabled($(this).parents('.extension').attr('id'), false);

        return false;
    });


}
