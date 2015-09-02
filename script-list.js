require( "script-lister" ).bind( module )( [
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
	
] );
