var _ = require( "lodash" );
var unirest = require( "unirest" );
var URI = require( "URIjs" );
var util = require( "util" );

require( "./model.js" );

require( "./responsible.js" );

/*:
	Worker server is different, the basic rule of this server
		was to load all workers first and execute those that
		are already expired. Throwing errors to nothingness.
		Then re-executing the timer to check the expiration dates
		of every worker.
*/
var Worker = function Worker( ){
	if( this instanceof Worker ){
		MODEL.call( this, "Worker" );

		this.scopes = [ 
			"URL", 
			"data", 
			"query",
			"method",
			"expirationDate", 
			"referenceID",
			"accessID"
		];

		this.searches = [ 
			"URL", 
			"expirationDate", 
			"referenceID"
		];

		this.domains = {

		};

	}else{
		return new Worker( );
	}
};

util.inherits( Worker, MODEL );

RESPONSIBLE( ).compose( Worker );

Worker.prototype.add = function add( worker ){
	var workerData = _.extend( {
		"workerID": this.workerID,

		"URL": worker.URL,
		"data": worker.data,
		"query": worker.query,
		"method": worker.method,

		"expirationDate": worker.expirationDate,

		"accessID": this.accessID,

		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	MODEL.prototype.add.call( this, workerData );

	return this;
};

Worker.prototype.update = function update( worker, reference ){
	var workerData = _.extend( {
		"URL": worker.URL || null,
		"data": worker.data || null,
		"query": worker.query || null,
		"method": worker.method || null,

		"expirationDate": worker.expirationDate || null,

		"accessID": this.accessID || null,

		"scopes": this.scopes || null,
		"searches": this.searches || null,
		"domains": this.domains || null
	}, this.modelData );

	MODEL.prototype.update.call( this, workerData, reference );

	return this;
};

Worker.prototype.createReferenceID = function createReferenceID( worker ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			worker.URL,
			worker.data,
			worker.query
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

Worker.prototype.createWorkerID = function createWorkerID( worker ){
	worker = JSON.stringify( worker );

	var workerID = crypto.createHash( "sha512" )
		.update( workerData )
		.digest( "hex" )
		.toString( );

	this.references.push( workerID );

	this.workerID = workerID;

	return this;
};

Worker.prototype.requestForAccess = function requestForAccess( task ){
	unirest
		.post(  )
};

Worker.prototype.executeTask = function executeTask( task ){
	unirest[ task.method.toLowerCase( ) ]
		( new URI( task.URL.replace( "@accessID", accessID ) )
			.setQuery( task.query )
			.toString( ), task.data )

		.end( ( function onResponse( response ){
			if( "error" in response && 
				response.error )
			{
				this.result( new Error( response.error ) );

				return;
			}

			var status = response.body.status;

			if( status == "error" ){
				var error = new Error( response.body.data );

				this.result( error );
				
			}else if( status == "failed" ){
				this.result( null, false, response.body.data );

			}else{
				this.result( null, response.body.data );
			}
		} ).bind( this ) )

	return this;
};

global.WORKER = Worker;



