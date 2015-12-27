var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var util = require( "util" );
var shardize = require( "shardize" );
var titlelize = require( "titlelize" );

require( "../model/model.js" );

require( "../utility/responsible.js" );

var UtilityReading = function UtilityReading( ){
	if( this instanceof UtilityReading ){
		Model.call( this, "UtilityReading" );

		this.setScopes( );

		this.setSearches( );

		this.setDomains( );

	}else{
		return new UtilityReading( );
	}
};

util.inherits( UtilityReading, Model );

Responsible( ).compose( UtilityReading );

UtilityReading.prototype.add = function add( utilityReading ){
	var utilityReadingData = this.resolveAddData( utilityReading )
		( {
			"utilityReadingID": this.utilityReadingID
		} );

	Model.prototype.add.call( this, utilityReadingData );

	return this;
};

UtilityReading.prototype.update = function update( utilityReading, reference ){
	var utilityReadingData = this.resolveUpdateData( utilityReading )( );

	Model.prototype.update.call( this, utilityReadingData, reference );

	return this;
};

UtilityReading.prototype.createReferenceID = function createReferenceID( utilityReading ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			utilityReading.name,
			utilityReading.title,
			utilityReading.description
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

UtilityReading.prototype.createUtilityReadingID = function createUtilityReadingID( utilityReading ){
	var utilityReadingData = JSON.stringify( utilityReading );

	var utilityReadingID = crypto.createHash( "sha512" )
		.update( utilityReadingData )
		.digest( "hex" )
		.toString( );

	this.references.push( utilityReadingID );

	this.utilityReadingID = utilityReadingID;

	return this;
};

UtilityReading.prototype.resolveUtilityReading = function resolveUtilityReading( utilityReading ){
	/*:
		We will search for room types that doesn't have documents.

		Extract them and save them.

		@todo:
			Make the query fast by introducing a custom query
				to get all room types not in the database.
		@end-todo
	*/
	var utilityReadingName = shardize( utilityReading, true );

	UtilityReading( )
		.set( "mainSelf", this )
		.promise( )
		.clone( )
		.once( "error",
			function onError( error ){
				this.self.flush( ).drop( ).mainSelf.result( error );
			} )
		.once( "result",
			function onResult( error, hasUtilityReading ){
				if( error ){
					this.self.flush( ).drop( ).mainSelf.result( error );

				}else if( hasUtilityReading ){
					this.self.drop( ).notify( );

				}else{
					this.self.flush( ).resolve( );
				}
			} )
		.has( utilityReadingName, "name" )
		.self
		.wait( )
		.once( "error",
			function onError( error ){
				this.drop( ).mainSelf.result( error );
			} )
		.once( "result",
			function onResult( error, utilityReading ){
				if( error ){
					this.drop( ).mainSelf.result( error );

				}else{
					this.drop( ).mainSelf.result( null, utilityReading.referenceID );
				}
			} )
		.pick( "name", utilityReadingName )
		.then( function addUtilityReading( ){
			var utilityReadingData = {
				"name": utilityReadingName
			};

			this
				.clone( )
				.once( "error",
					function onError( error ){
						this.mainSelf.drop( ).result( error );
					} )
				.once( "result",
					function onResult( error, utilityReading ){
						if( error ){
							this.mainSelf.drop( ).result( error );

						}else{
							this.mainSelf.drop( ).result( null, utilityReading.referenceID );
						}
					} )
				.createReferenceID( utilityReadingData )
				.createUtilityReadingID( utilityReadingData )
				.add( utilityReadingData );
		} );
	
	return this;
};

global.UtilityReading = UtilityReading;
module.exports = UtilityReading;