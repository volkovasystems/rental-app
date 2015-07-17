var fs = require( "fs" );

var local = {
	"PORT": 8000,
	"STATIC_DIRECTORY": "build"
};

for( var property in local ){
	global[ property ] = local[ property ];
}