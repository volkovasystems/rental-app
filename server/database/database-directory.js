var fs = require( "fs" );
var childprocess = require( "child_process" );
var os = require( "os" );
var path = require( "path" );

if( !( "DB_DIRECTORY" in global ) ){
	throw new Error( "database directory does not exists" );
}

var lockFilePath = path.resolve( DB_DIRECTORY, "mongod.lock" );

var removeLockFile = function removeLockFile( ){
	if( fs.existsSync( lockFilePath ) ){
		fs.unlinkSync( lockFilePath );
	}
};

if( !fs.existsSync( DB_DIRECTORY ) ){
	if( ( /^win/ ).test( os.platform( ) ) ){
		childprocess.execSync( [ "mkdir", DB_DIRECTORY ].join( " " ) );

	}else{
		childprocess.execSync( [ "mkdir", "-p", DB_DIRECTORY ].join( " " ) );
	}
}

removeLockFile( );

global.DB_LOG = path.resolve( DB_DIRECTORY, "database.log" );

global.DB_ERROR = path.resolve( DB_DIRECTORY, "error.log" );

process.on( "beforeExit",
	function onBeforeExit( ){
		removeLockFile( );
	} );

process.on( "exit",
	function onExit( ){
		removeLockFile( );
	} );

process.on( "uncaughtException",
	function onUncaughtException( ){
		removeLockFile( );
	} );