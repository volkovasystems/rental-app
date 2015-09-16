require( "terraforma" )( {
	"appName": "rental-app",
	"libraryExceptions": [
		"bower_components/pubsub.js/src/pubsub.js",
		"bower_components/qwest/src/qwest.js",
		"bower_components/jsSHA/src/*.js",
		"bower_components/perfect-scrollbar/js/**/*.js",
		"bower_components/URIjs/src/*.js",
		"bower_components/webcomponentsjs/*.js",
		"bower_components/jquery-ui/themes/base/*.css",
		"bower_components/tag-it/js/*.js",
		"bower_components/svg-loaders/svg-loaders/*.svg",
		"bower_components/nouislider/distribute/*.*",
		"bower_components/nouislider/src/*.css",
		"bower_components/history.js/scripts/compressed/*.js",

		"!bower_components/pubsub.js/lib/**/*.js",
		"!bower_components/xxhash/benchmark/*.*",
		"!bower_components/xxhash/examples/*.*",
		"!bower_components/xxhash/lib/*.*",
		"!**/Gruntfile.js",
		"!**/index.js",
		"!**/main.css"
	]
} );