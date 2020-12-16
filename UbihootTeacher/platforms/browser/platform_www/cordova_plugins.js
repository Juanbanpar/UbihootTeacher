cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-browsertab/www/browsertab.js",
        "id": "cordova-plugin-browsertab.BrowserTab",
        "pluginId": "cordova-plugin-browsertab",
        "clobbers": [
            "cordova.plugins.browsertab"
        ]
    },
    {
        "file": "plugins/cordova-plugin-buildinfo/www/buildinfo.js",
        "id": "cordova-plugin-buildinfo.BuildInfo",
        "pluginId": "cordova-plugin-buildinfo",
        "clobbers": [
            "BuildInfo"
        ]
    },
    {
        "file": "plugins/cordova-plugin-buildinfo/src/browser/BuildInfoProxy.js",
        "id": "cordova-plugin-buildinfo.BuildInfoProxy",
        "pluginId": "cordova-plugin-buildinfo",
        "merges": [
            ""
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open"
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/src/browser/InAppBrowserProxy.js",
        "id": "cordova-plugin-inappbrowser.InAppBrowserProxy",
        "pluginId": "cordova-plugin-inappbrowser",
        "runs": true
    },
    {
        "file": "plugins/cordova-universal-links-plugin/www/universal_links.js",
        "id": "cordova-universal-links-plugin.universalLinks",
        "pluginId": "cordova-universal-links-plugin",
        "clobbers": [
            "universalLinks"
        ]
    },
    {
        "file": "plugins/cordova-plugin-qrcodejs/www/qrcodejsPlugin.js",
        "id": "cordova-plugin-qrcodejs.QRCodeJS",
        "pluginId": "cordova-plugin-qrcodejs",
        "clobbers": [
            "cordova.plugins.qrcodejs"
        ]
    },
    {
        "file": "plugins/cordova-plugin-qrcodejs/www/qrcode.js",
        "id": "cordova-plugin-qrcodejs.QRCcodeJSImpl",
        "pluginId": "cordova-plugin-qrcodejs",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-qrcodejs/www/qrcodejsPluginProxy.js",
        "id": "cordova-plugin-qrcodejs.QRCcodeJSProxy",
        "pluginId": "cordova-plugin-qrcodejs",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-browsertab": "0.2.0",
    "cordova-plugin-buildinfo": "4.0.0",
    "cordova-plugin-inappbrowser": "4.1.0",
    "cordova-plugin-whitelist": "1.3.4",
    "cordova-universal-links-plugin": "1.2.1",
    "cordova-plugin-qrcodejs": "1.0.0"
}
// BOTTOM OF METADATA
});