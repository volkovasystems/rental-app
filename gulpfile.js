var gulp = require( "gulp" );
var clean = require( "gulp-clean" );
var concat = require( "gulp-concat" );
var uglify = require( "gulp-uglify" );
var sourcemaps = require( "gulp-sourcemaps" );
var rename = require( "gulp-rename" );
var changed = require( "gulp-changed" );
var flatten = require( "gulp-flatten" );
var replace = require( "gulp-replace" );
var insert = require( "gulp-insert" );
var react = require( "gulp-react" );
var minifyCSS = require( "gulp-minify-css" );
var less = require( "gulp-less" );
var filter = require( "gulp-filter" );
var livereload = require( "gulp-livereload" );
var embedlr = require( "gulp-embedlr" );
var plumber = require( "gulp-plumber" );

var connect = require( "connect" );
var serveStatic = require( "serve-static" );
var map = require( "map-stream" );
var fs = require( "fs" );
var path = require( "path" );
var argv = require( "yargs" ).argv;

const INCLUDE_SCRIPT_PATTERN = /(?:\<\!\-\-\:)?(\s*).*?\@include\-script\:(\"[^\"]+?\").*?(\s*)(?:\-\-\>)?/g;
const INCLUDE_STYLE_PATTERN = /(?:\<\!\-\-\:)?(\s*).*?\@include\-style\:(\"[^\"]+?\").*?(\s*)(?:\-\-\>)?/g;

const MINIFIED_SCRIPT_PATTERN = /\.min\./g;
const MINIFIED_STYLE_PATTERN = /\.min\./g;

const INCLUDE_SCRIPT_REPLACER = "$1<script type=\"text/javascript\" src=$2></script>$3";
const INCLUDE_STYLE_REPLACER = "$1<link rel=\"stylesheet\" type=\"text/css\" href=$2>$3";

const REACTJS_DOM_FLAG = "/** @jsx React.DOM */\n";
const REACTJS_DOM_FLAG_PATTERN = /\/\*\*\s*\@jsx\s+React\.DOM\s*\*\/\n/g;
const REACTJS_DOM_FLAG_REPLACER = "";

const PRODUCTION_MODE_PATTERN = /(?:\{?\s*)?(?:\<\!\-\-\:|\/\*\:|\/\/\:)?(\s*).*?\@production\-mode\:(?:\s*\*\/ \}?)?\s*([^]+?)\s*(?:\{?\s*\/\*\s*|\/\/\:\s*)?\@end\-production\-mode.*?(\s*)(?:\-\-\>|\*\/)?(?: \}?)?/gm;
const PRODUCTION_MODE_REPLACER = "\n$1$2$3\n";

const DEVELOPMENT_MODE_PATTERN = /(?:\{?\s*)?(?:\<\!\-\-\:|\/\*\:|\/\/\:)?(\s*).*?\@development\-mode\:(?:\s*\*\/ \}?)?\s*([^]+?)\s*(?:\{?\s*\/\*\s*|\/\/\:\s*)?\@end\-development\-mode.*?(\s*)(?:\-\-\>|\*\/)?(?: \}?)?/gm;
const DEVELOPMENT_MODE_REPLACER = "\n$1$2$3\n";

const CLIENT_MODE_PATTERN = /(?:\{?\s*)?(?:\<\!\-\-\:|\/\*\:|\/\/\:)?(\s*).*?\@client\-mode\:(?:\s*\*\/ \}?)?\s*([^]+?)\s*(?:\{?\s*\/\*\s*|\/\/\:\s*)?\@end\-client\-mode.*?(\s*)(?:\-\-\>|\*\/)?(?: \}?)?/gm;
var CLIENT_MODE_REPLACER = "\n$1$2$3\n";

const ADMINISTRATOR_MODE_PATTERN = /(?:\{?\s*)?(?:\<\!\-\-\:|\/\*\:|\/\/\:)?(\s*).*?\@administrator\-mode\:(?:\s*\*\/ \}?)?\s*([^]+?)\s*(?:\{?\s*\/\*\s*|\/\/\:\s*)?\@end\-administrator\-mode.*?(\s*)(?:\-\-\>|\*\/)?(?: \}?)?/gm;
const ADMINISTRATOR_MODE_REPLACER = "\n$1$2$3\n";

const ADMINISTRATOR_DEVELOPMENT_MODE_PATTERN = /(?:\{?\s*)?(?:\<\!\-\-\:|\/\*\:|\/\/\:)?(\s*).*?\@administrator\-development\-mode\:(?:\s*\*\/ \}?)?\s*([^]+?)\s*(?:\{?\s*\/\*\s*|\/\/\:\s*)?\@end\-administrator\-development\-mode.*?(\s*)(?:\-\-\>|\*\/)?(?: \}?)?/gm;
const ADMINISTRATOR_DEVELOPMENT_MODE_REPLACER = "\n$1$2$3\n";

const ADMINISTRATOR_PRODUCTION_MODE_PATTERN = /(?:\{?\s*)?(?:\<\!\-\-\:|\/\*\:|\/\/\:)?(\s*).*?\@administrator\-production\-mode\:(?:\s*\*\/ \}?)?\s*([^]+?)\s*(?:\{?\s*\/\*\s*|\/\/\:\s*)?\@end\-administrator\-production\-mode.*?(\s*)(?:\-\-\>|\*\/)?(?: \}?)?/gm;
const ADMINISTRATOR_PRODUCTION_MODE_REPLACER = "\n$1$2$3\n";

const ADMINISTRATOR_ALL_MODE_PATTERN = new RegExp(
	"(?:\\{?\\s*)?(?:\\<\\!\\-\\-\\:|\\/\\*\\:|\\/\\/\\:)?(\\s*).*?"
		+ "\\@administrator\\-(?:development|production)\\-mode\\:"
			+ "(?:\\s*\\*\\/ \\}?)?\\s*"
				+ "([^]+?)\\s*"
			+ "(?:\\{?\\s*\\/\\*\\s*|\\/\\/\\:\\s*)?"
		+ "\\@end\\-administrator\\-(?:development|production)\\-mode"
	+ ".*?(\\s*)(?:\\-\\-\\>|\\*\\/)?(?: \\}?)?",
	"gm" );

const CLEAN_UP_PATTERN = new RegExp(
	"(?:\\{?\\s*)?(?:\\<\\!\\-\\-\\:|\\/\\*\\:)?(\\s*).*?"
		+ "\\@[a-z\\-]*[a-z]\\-mode\\:"
			+ "(?:\\s*\\*\\/ \\}?)?\\s*"
			+ "([^]+?)\\s*"
			+ "(?:\\{?\\s*\\/\\*\\s*|\\/\\/\\:\\s*)?"
		+ "\\@end\\-[a-z][a-z\\-]*[a-z]\\-mode"
	+ ".*?(\\s*)(?:\\-\\-\\>|\\*\\/)?(?: \\}?)?",
	"gm" );

const TEMPLATE_PATTERN = /(?:\{?\s*\/\*\:|\;\s*\/\/\:)?\s*\@template\:\s*([^\s]+)\s*(?:\*\/ \}?)?/;

const SUB_TEMPLATE_PATTERN = /(?:\{?\s*\/\*\:|\;\s*\/\/\:)?\s*\@sub-template\:\s*([^\s]+)\s*(?:\*\/ \}?)?/;

const APPLICATION_NAME = argv.appName || "rental-app";

if( argv.production ){
	var MODE_PATTERN = PRODUCTION_MODE_PATTERN;
	var MODE_REPLACER = PRODUCTION_MODE_REPLACER;

}else if( argv.development ){
	var MODE_PATTERN = DEVELOPMENT_MODE_PATTERN;
	var MODE_REPLACER = DEVELOPMENT_MODE_REPLACER;

}else{
	throw new Error( "no mode provided" );
}

if( argv.administrator ){
	var ADMINISTRATOR_GENERAL_MODE_PATTERN = ADMINISTRATOR_MODE_PATTERN;
	var ADMINISTRATOR_GENERAL_MODE_REPLACER = ADMINISTRATOR_MODE_REPLACER;
	CLIENT_MODE_REPLACER = "\n";

}else{
	var ADMINISTRATOR_GENERAL_MODE_PATTERN = ADMINISTRATOR_MODE_PATTERN;
	var ADMINISTRATOR_GENERAL_MODE_REPLACER = "\n";
}

if( argv.administrator && argv.production ){
	var ADMINISTRATOR_SPECIFIC_MODE_PATTERN = ADMINISTRATOR_PRODUCTION_MODE_PATTERN;
	var ADMINISTRATOR_SPECIFIC_MODE_REPLACER = ADMINISTRATOR_PRODUCTION_MODE_REPLACER;

}else if( argv.administrator && argv.development ){
	var ADMINISTRATOR_SPECIFIC_MODE_PATTERN = ADMINISTRATOR_DEVELOPMENT_MODE_PATTERN;
	var ADMINISTRATOR_SPECIFIC_MODE_REPLACER = ADMINISTRATOR_DEVELOPMENT_MODE_REPLACER;

}else{
	var ADMINISTRATOR_SPECIFIC_MODE_PATTERN = ADMINISTRATOR_ALL_MODE_PATTERN;
	var ADMINISTRATOR_SPECIFIC_MODE_REPLACER = "\n";
}

var customBuild = argv.custom || "";

const CUSTOM_MODE_REPLACER = "\n$1$2$3\n";

var CUSTOM_MODE_PATTERN = new RegExp(
	"(?:\\{?\\s*)?(?:\\<\\!\\-\\-\\:|\\/\\*\\:|\\/\\/\\:)?(\\s*).*?"
		+ "\\@custom\\-mode\\:(?:\\s*\\*\\/ \\}?)?\\s*([^]+?)\\s*"
			.replace( "custom", argv.custom )
		+ "(?:\\{?\\s*\\/\*\\s*|\\/\\/\\:\\s*)?\\@end\\-custom\\-mode"
			.replace( "custom", argv.custom )
		+ ".*?(\\s*)(?:\\-\\-\\>|\\*\\/)?(?: \\}?)?",
	"gm" );

var scriptList = require( "./script-list.js" );

gulp.task( "default", [
	"clean-library",
	"clean-build",
	"clean-deploy",

	"copy-library",
	"build-library",
	"deploy-library",

	"build-font",
	"deploy-font",

	"build-script",
	"deploy-script",

	"build-less",
	"build-style",
	"deploy-style",

	"build-image",
	"deploy-image",

	"build-index",
	"deploy-index"
] );

gulp.task( "clean", [
	"clean-library",
	"clean-build",
	"clean-deploy",
	"clean-temp"
] );

gulp.task( "clean-temp",
	function cleanTask( ){
		return gulp
			.src( "temp", { "read": false } )
			.pipe( plumber( ) )
			.pipe( clean( { "force": true } ) );
	} );

gulp.task( "link-library", [
	"clean-library",
	"copy-library"
] );

gulp.task( "clean-library",
	function cleanTask( ){
		return gulp
			.src( "client/library", { "read": false } )
			.pipe( plumber( ) )
			.pipe( clean( { "force": true } ) );
	} );

gulp.task( "copy-library",
	[ "clean-library" ],
	function copyTask( ){
		return gulp
			.src( [
				"bower_components/*/*.css",
				"bower_components/*/*.map",
				"bower_components/*/*.js",
				"bower_components/*/*.eot",
				"bower_components/*/*.svg",
				"bower_components/*/*.ttf",
				"bower_components/*/*.woff",

				"bower_components/*/dist/**/*.eot",
				"bower_components/*/dist/**/*.svg",
				"bower_components/*/dist/**/*.ttf",
				"bower_components/*/dist/**/*.woff",
				"bower_components/*/dist/**/*.css",
				"bower_components/*/dist/**/*.map",
				"bower_components/*/dist/**/*.js",

				"bower_components/*/lib/**/*.js",

				"bower_components/*/build/**/*.js",
				"bower_components/*/build/**/*.css",

				"bower_components/*/css/*.css",

				"bower_components/*/fonts/*.eot",
				"bower_components/*/fonts/*.svg",
				"bower_components/*/fonts/*.ttf",
				"bower_components/*/fonts/*.woff",

				//: @todo: This should be separated.
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
				"bower_components/history.js/scripts/compressed/*.js",

				"!bower_components/pubsub.js/lib/**/*.js",
				"!bower_components/xxhash/benchmark/*.*",
				"!bower_components/xxhash/examples/*.*",
				"!bower_components/xxhash/lib/*.*",
				"!**/Gruntfile.js",
				"!**/index.js",
				"!**/main.css"
			] )
			.pipe( plumber( ) )
			.pipe( flatten( ) )
			.pipe( gulp.dest( "client/library" ) );
	} );

gulp.task( "build", [
	"clean-build",
	"build-script",
	"build-library",
	"build-font",
	"build-less",
	"build-style",
	"build-image",
	"build-index"
] );

gulp.task( "clean-build",
	[ "clean-library", "copy-library" ],
	function cleanTask( ){
		var sourcePaths = [ "build" ];

		if( argv.custom ){
			sourcePaths.push( [ "build", argv.custom ].join( "-" ) );
		}

		return gulp
			.src( sourcePaths, { "read": false } )
			.pipe( plumber( ) )
			.pipe( clean( { "force": true } ) );
	} );

gulp.task( "build-script",
	[ "clean-build" ],
	function buildTask( ){
		var stream = gulp
			.src( scriptList )
			.pipe( plumber( ) )
			.pipe( map( function attachTemplate( file, callback ){
				var fileContent = file.contents.toString( "utf8" );

				var templateFilePath = ( fileContent.match( TEMPLATE_PATTERN ) || [ ] )[ 1 ];

				while( templateFilePath ){
					templateFilePath = path.resolve( ".", "client", templateFilePath );

					fileContent = fileContent.replace( TEMPLATE_PATTERN, [
						" (", fs.readFileSync( templateFilePath ), ");"
					].join( "\n" ) );

					templateFilePath = ( fileContent.match( TEMPLATE_PATTERN ) || [ ] )[ 1 ];
				}

				file.contents = new Buffer( fileContent );

				callback( null, file );
			} ) )
			.pipe( map( function attachSubTemplate( file, callback ){
				var fileContent = file.contents.toString( "utf8" );

				var templateFilePath = ( fileContent.match( SUB_TEMPLATE_PATTERN ) || [ ] )[ 1 ];

				while( templateFilePath ){
					templateFilePath = path.resolve( ".", "client", templateFilePath );

					fileContent = fileContent.replace( SUB_TEMPLATE_PATTERN, [
						"", fs.readFileSync( templateFilePath ), ""
					].join( "\n" ) );

					templateFilePath = ( fileContent.match( SUB_TEMPLATE_PATTERN ) || [ ] )[ 1 ];
				}

				file.contents = new Buffer( fileContent );

				callback( null, file );
			} ) )
			.pipe( react( ) )
			.pipe( replace( MODE_PATTERN, MODE_REPLACER ) )
			.pipe( replace( ADMINISTRATOR_SPECIFIC_MODE_PATTERN, ADMINISTRATOR_SPECIFIC_MODE_REPLACER ) )
			.pipe( replace( ADMINISTRATOR_GENERAL_MODE_PATTERN, ADMINISTRATOR_GENERAL_MODE_REPLACER ) )
			.pipe( replace( CLIENT_MODE_PATTERN, CLIENT_MODE_REPLACER ) );

		if( argv.custom ){
			stream = stream
				.pipe( replace( CUSTOM_MODE_PATTERN, CUSTOM_MODE_REPLACER ) )
		}

		stream = stream
			.pipe( replace( CLEAN_UP_PATTERN, "" ) )
			.pipe( sourcemaps.init( ) )
			.pipe( concat( [ APPLICATION_NAME, "js" ].join( "." ) ) )
			.pipe( gulp.dest( "build/script" ) );

		var customBuildPath = "";

		if( argv.custom ){
			customBuildPath = "build/script"
				.replace( "build",
					[ "build", argv.custom ].join( "-" ) );

			stream = stream
				.pipe( gulp.dest( customBuildPath ) );
		}

		stream = stream
			.pipe( uglify( ) )
			.pipe( rename( [ APPLICATION_NAME, "min", "js" ].join( "." ) ) )
			.pipe( sourcemaps.write( "./" ) )
			.pipe( gulp.dest( "build/script" ) );

		if( argv.custom ){
			return stream
				.pipe( gulp.dest( customBuildPath ) );

		}else{
			return stream;
		}
	} );

gulp.task( "build-library",
	[ "clean-library", "copy-library", "clean-build" ],
	function buildTask( ){
	 	var stream = gulp
			.src( "client/library/*.*" )
			.pipe( plumber( ) )
			.pipe( gulp.dest( "build/library" ) );

		if( argv.custom ){
			var customBuildPath = "build/library"
				.replace( "build",
					[ "build", argv.custom ].join( "-" ) );

			return stream
				.pipe( gulp.dest( customBuildPath ) );

		}else{
			return stream;
		}
	} );

gulp.task( "build-font",
	[ "build-library" ],
	function buildTask( ){
		var stream = gulp
			.src( [
				"client/library/*.eot",
				"client/library/*.svg",
				"client/library/*.ttf",
				"client/library/*.woff"
			] )
			.pipe( gulp.dest( "client/fonts" ) )
			.pipe( gulp.dest( "build/fonts" ) );

		if( argv.custom ){
			var customBuildPath = "build/fonts"
				.replace( "build",
					[ "build", argv.custom ].join( "-" ) );

			return stream
				.pipe( gulp.dest( customBuildPath ) );

		}else{
			return stream;
		}
	} );

gulp.task( "build-less",
	[ "clean-build" ],
	function buildTask( ){
		return gulp
			.src( "client/style/*.less" )
			.pipe( plumber( ) )
			.pipe( less( ) )
			.pipe( filter( [ "app.css" ] ) )
			.pipe( rename( [ APPLICATION_NAME, "css" ].join( "." ) ) )
			.pipe( gulp.dest( "temp/style" ) );
	} );

gulp.task( "build-style",
	[ "clean-build", "build-less" ],
	function buildTask( ){
		var stream = gulp
			.src( "temp/style/*.css" )
			.pipe( plumber( ) )
			.pipe( gulp.dest( "build/style" ) );

		var customBuildPath = "";
		if( argv.custom ){
			customBuildPath = "build/style"
				.replace( "build",
					[ "build", argv.custom ].join( "-" ) );

		 	stream = stream
				.pipe( gulp.dest( customBuildPath ) );
		}

		stream = stream
			.pipe( sourcemaps.init( ) )
			.pipe( minifyCSS( { "keepBreaks": true } ) )
			.pipe( rename( [ APPLICATION_NAME, "min", "css" ].join( "." ) ) )
			.pipe( sourcemaps.write( "./" ) )
			.pipe( gulp.dest( "build/style" ) );

		if( argv.custom ){
		 	return stream
				.pipe( gulp.dest( customBuildPath ) );

		}else{
			return stream;
		}
	} );

gulp.task( "build-image",
	[ "clean-build" ],
	function buildTask( ){
		var stream = gulp
			.src( "client/image/*.*" )
			.pipe( plumber( ) )
			.pipe( gulp.dest( "build/image" ) );

		if( argv.custom ){
			var customBuildPath = "build/image"
				.replace( "build",
					[ "build", argv.custom ].join( "-" ) );

			return stream
				.pipe( gulp.dest( customBuildPath ) );

		}else{
			return stream;
		}
	} );

gulp.task( "build-index",
	[ "clean-build" ],
	function buildTask( ){
		var stream = gulp
			.src( "client/index.html" )
			.pipe( plumber( ) )
			.pipe( replace( INCLUDE_SCRIPT_PATTERN, INCLUDE_SCRIPT_REPLACER ) )
			.pipe( replace( INCLUDE_STYLE_PATTERN, INCLUDE_STYLE_REPLACER ) )
			.pipe( replace( MINIFIED_SCRIPT_PATTERN, "." ) )
			.pipe( replace( MINIFIED_STYLE_PATTERN, "." ) )
			.pipe( replace( DEVELOPMENT_MODE_PATTERN, DEVELOPMENT_MODE_REPLACER ) )
			.pipe( replace( ADMINISTRATOR_SPECIFIC_MODE_PATTERN, ADMINISTRATOR_SPECIFIC_MODE_REPLACER ) )
			.pipe( replace( ADMINISTRATOR_GENERAL_MODE_PATTERN, ADMINISTRATOR_GENERAL_MODE_REPLACER ) )
			.pipe( replace( CLIENT_MODE_PATTERN, CLIENT_MODE_REPLACER ) );

		if( argv.custom ){
			stream = stream
				.pipe( replace( CUSTOM_MODE_PATTERN, CUSTOM_MODE_REPLACER ) );
		}

		stream = stream
			.pipe( replace( CLEAN_UP_PATTERN, "" ) )
			.pipe( embedlr( ) )
			.pipe( gulp.dest( "build" ) );

		if( argv.custom ){
			var customBuildPath = [ "build", argv.custom ].join( "-" );

			return stream
				.pipe( gulp.dest( customBuildPath ) );

		}else{
			return stream;
		}
	} );


gulp.task( "deploy", [
	"clean-deploy",
	"deploy-script",
	"deploy-library",
	"deploy-font",
	"deploy-style",
	"deploy-image",
	"deploy-index"
] );

gulp.task( "clean-deploy",
	[ "clean-library", "copy-library", "clean-build", "build-library" ],
	function cleanTask( ){
		var sourcePaths = [ "deploy" ];

		if( argv.custom ){
			sourcePaths.push( [ "deploy", argv.custom ].join( "-" ) );
		}

		return gulp
			.src( "deploy", { "read": false } )
			.pipe( plumber( ) )
			.pipe( clean( { "force": true } ) );
	} );

gulp.task( "deploy-script",
	[ "clean-build", "build-script", "clean-deploy" ],
	function deployTask( ){
		var stream = gulp
			.src( [
				"build/script/*.js",
				"build/script/*.map"
			] )
			.pipe( plumber( ) )
			.pipe( gulp.dest( "deploy/script" ) );

		if( argv.custom ){
			var customDeployPath = "deploy/script"
				.replace( "deploy",
					[ "deploy", argv.custom ].join( "-" ) );

			return stream
				.pipe( gulp.dest( customDeployPath ) );

		}else{
			return stream;
		}
	} );

gulp.task( "deploy-library",
	[ "clean-library", "copy-library", "clean-build", "build-library", "clean-deploy" ],
	function deployTask( ){
		var stream = gulp
			.src( "build/library/*.*" )
			.pipe( plumber( ) )
			.pipe( gulp.dest( "deploy/library" ) );

		if( argv.custom ){
			var customDeployPath = "deploy/library"
				.replace( "deploy",
					[ "deploy", argv.custom ].join( "-" ) );

			return stream
				.pipe( gulp.dest( customDeployPath ) );

		}else{
			return stream;
		}
	} );

gulp.task( "deploy-font",
	[ "deploy-library" ],
	function deployTask( ){
		var stream = gulp
			.src( [
				"build/library/*.eot",
				"build/library/*.svg",
				"build/library/*.ttf",
				"build/library/*.woff"
			] )
			.pipe( gulp.dest( "deploy/fonts" ) );

		if( argv.custom ){
			var customDeployPath = "deploy/fonts"
				.replace( "deploy",
					[ "deploy", argv.custom ].join( "-" ) );

			return stream
				.pipe( gulp.dest( customDeployPath ) );

		}else{
			return stream;
		}
	} );

gulp.task( "deploy-style",
	[ "clean-build", "build-less", "build-style", "clean-deploy" ],
	function deployTask( ){
		var stream = gulp
			.src( [
				"build/style/*.css",
				"build/style/*.map"
			] )
			.pipe( plumber( ) )
			.pipe( gulp.dest( "deploy/style" ) );

		if( argv.custom ){
			var customDeployPath = "deploy/style"
				.replace( "deploy",
					[ "deploy", argv.custom ].join( "-" ) );

			return stream
				.pipe( gulp.dest( customDeployPath ) );

		}else{
			return stream;
		}
	} );

gulp.task( "deploy-image",
	[ "clean-build", "clean-deploy" ],
	function deployTask( ){
		var stream = gulp
			.src( "build/image/*.*" )
			.pipe( plumber( ) )
			.pipe( gulp.dest( "deploy/image" ) );

		if( argv.custom ){
			var customDeployPath = "deploy/image"
				.replace( "deploy",
					[ "deploy", argv.custom ].join( "-" ) );

			return stream
				.pipe( gulp.dest( customDeployPath ) );

		}else{
			return stream;
		}
	} );

gulp.task( "deploy-index",
	[ "clean-deploy" ],
	function buildTask( ){
		var stream = gulp
			.src( "client/index.html" )
			.pipe( plumber( ) )
			.pipe( replace( INCLUDE_SCRIPT_PATTERN, INCLUDE_SCRIPT_REPLACER ) )
			.pipe( replace( INCLUDE_STYLE_PATTERN, INCLUDE_STYLE_REPLACER ) )
			.pipe( replace( PRODUCTION_MODE_PATTERN, PRODUCTION_MODE_REPLACER ) )
			.pipe( replace( ADMINISTRATOR_SPECIFIC_MODE_PATTERN, ADMINISTRATOR_SPECIFIC_MODE_REPLACER ) )
			.pipe( replace( ADMINISTRATOR_GENERAL_MODE_PATTERN, ADMINISTRATOR_GENERAL_MODE_REPLACER ) )
			.pipe( replace( CLIENT_MODE_PATTERN, CLIENT_MODE_REPLACER ) );

		if( argv.custom ){
			stream = stream
				.pipe( replace( CUSTOM_MODE_PATTERN, CUSTOM_MODE_REPLACER ) );
		}

		stream = stream
			.pipe( replace( CLEAN_UP_PATTERN, "" ) )
			.pipe( gulp.dest( "deploy" ) );

		if( argv.custom ){
			var customBuildPath = [ "deploy", argv.custom ].join( "-" );

			return stream
				.pipe( gulp.dest( customBuildPath ) );

		}else{
			return stream;
		}
	} );

gulp.task( "server-static",
	function serverTask( done ){
		var portNumber = process.config.port || process.env.PORT || 8000;
		var server = connect( );
		server
			.use( serveStatic( "build" ) )
			.listen( portNumber, "localhost", done );
	} )

var server = livereload( );

gulp.task( "reload", [ "build" ],
	function reloadTask( done ){
		server.changed( );
		done( );
	} );

gulp.task( "watch",
	[
		"clean-build",
		"build-script",
		"build-library",
		"build-font",
		"build-less",
		"build-style",
		"build-image",
		"build-index",
		"server-static"
	],
	function watchTask( ){
		gulp.watch( [
			"client/script/**",
			"client/style/**",
			"client/template/**",
			"client/index.html"
		],
		[ "reload" ] );
	} );

gulp.task( "serverless-watch",
	[
		"clean-build",
		"build-script",
		"build-library",
		"build-font",
		"build-less",
		"build-style",
		"build-image",
		"build-index"
	],
	function watchTask( ){
		gulp.watch( [
			"client/script/**",
			"client/style/**",
			"client/template/**",
			"client/index.html"
		],
		[ "reload" ] );
	} );
