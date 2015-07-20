var childprocess = require( "child_process" );
var fs = require( "fs" );
var path = require( "path" );

if( !( "DB_PORT" in global ) &&
	!( "DB_DIRECTORY" in global ) &&
	!( "DB_LOG" in global ) &&
	!( "DB_ERROR" in global ) )
{
	throw new Error( "incomplete database options" );
}

var taskCommand = "";

if( "DB_HOST" in global ){
	taskCommand = [
		"mongod",
			"--port", DB_PORT,
			"--bind_ip", DB_HOST,
			"--dbpath", DB_DIRECTORY,
			"--smallfiles"
	].join( " " );

}else{
	taskCommand = [
		"mongod",
			"--port", DB_PORT,
			"--dbpath", DB_DIRECTORY,
			"--smallfiles"
	].join( " " );
}

var task = childprocess.exec( taskCommand );

var killTask = function killTask( forceKill ){
	if( !task.killed ){
		task.killed = true;	

		if( forceKill ){
			task.kill( );
		}
	}
};

task.stdout.on( "data",
	function onData( data ){
		data = data.toString( );

		console.log( data );

		fs.appendFileSync( DB_LOG, data );
	} );

task.stderr.on( "data",
	function onData( data ){
		data = data.toString( );

		console.error( data );
		
		fs.appendFileSync( DB_ERROR, data );
	} );

task.on( "error",
	function onError( error ){
		killTask( true );

		console.log( "mongod encountered an error", error.message );

		fs.appendFileSync( DB_ERROR, error.message );
	} );

task.on( "exit",
	function onExit( ){
		killTask( );
		
		console.log( "mongod task has been killed" );

		fs.appendFileSync( DB_LOG, "mongod task has been killed" );
	} );

process.on( "beforeExit",
	function onBeforeExit( ){
		killTask( true );
	} );

process.on( "exit",
	function onExit( ){
		killTask( true );
	} );

process.on( "uncaughtException",
	function onUncaughtException( error ){
		killTask( true );

		console.log( "mongod encountered an uncaught exception", error.message );

		fs.appendFileSync( DB_ERROR, error.message );
	} );