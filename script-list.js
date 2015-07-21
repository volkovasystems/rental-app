var path = require( "path" );
var fs = require( "fs" );

var scriptList = [
	//: This should be loaded as much as possible in order.
	"utility/global.js",
	"utility/event-wrapper.js",
	"utility/qwest-option.js",
	"utility/set-url.js",
	"utility/set-access-id.js",
	"utility/encode-passphrase.js",
	"utility/decode-passphrase.js",
	"utility/get.js",
	"utility/post.js",
	"utility/put.js",
	"utility/component.js",
	"utility/page.js",

	"mixin/clear-state-mixin.js",
	"mixin/component-mixin.js",
	"mixin/content-mixin.js",
	"mixin/control-mixin.js",
	"mixin/icon-mixin.js",
	"mixin/input-mixin.js",
	"mixin/label-mixin.js",
	"mixin/state-change-mixin.js",
	"mixin/name-title-mixin.js",
	"mixin/notify-mixin.js",
	"mixin/page-mixin.js",
	"mixin/page-traversal-mixin.js",
	"mixin/paragraph-mixin.js",
	"mixin/show-hide-component-mixin.js",
	"mixin/show-hide-page-mixin.js",
	"mixin/state-change-mixin.js",
	"mixin/switch-control-mixin.js",
	"mixin/title-name-mixin.js",
	"mixin/placeholder-mixin.js",

	"component/label.js",
	"component/basic-label.js",
	"component/button-label.js",
	"component/input-label.js",
	"component/title-label.js",

	"component/paragraph.js",
	"component/description.js",

	"component/icon.js",
	"component/control.js",
	"component/icon-control.js",
	"component/switch-control.js",
	"component/switch-icon-control.js",
	"component/expand-control.js",

	"component/input.js",
	"component/basic-input.js",
	"component/passphrase-input.js",

	"component/notify.js",
	"component/user-notify.js",
	"component/task-notify.js",

	"component/headbar.js",
	"component/dashbar.js",
	"component/opbar.js",

	"app/main/login.js",
	"app/main/register.js",
	"app/main/home.js"
]
.map( function onEachScriptFile( scriptFile ){
	return path.resolve( ".", "client", "script", scriptFile );
} )
.filter( function onEachScriptFile( scriptFile ){
	return fs.existsSync( scriptFile );
} );

exports.scriptList = scriptList;
