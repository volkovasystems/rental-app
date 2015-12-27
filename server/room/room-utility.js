var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var util = require( "util" );
var shardize = require( "shardize" );
var titlelize = require( "titlelize" );

require( "../model/model.js" );

require( "../utility/responsible.js" );

var RoomUtility = function RoomUtility( ){
	if( this instanceof RoomUtility ){
		Model.call( this, "RoomUtility" );

		this.setScopes( );

		this.setSearches( );

		this.setDomains( );

	}else{
		return new RoomUtility( );
	}
};

util.inherits( RoomUtility, Model );

Responsible( ).compose( RoomUtility );

RoomUtility.prototype.add = function add( roomUtility ){
	var roomUtilityData = this.resolveAddData( roomUtility )
		( {
			"roomUtilityID": this.roomUtilityID
		} );

	Model.prototype.add.call( this, roomUtilityData );

	return this;
};

RoomUtility.prototype.update = function update( roomUtility, reference ){
	var roomUtilityData = this.resolveUpdateData( roomUtility )( );

	Model.prototype.update.call( this, roomUtilityData, reference );

	return this;
};

RoomUtility.prototype.createReferenceID = function createReferenceID( roomUtility ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			roomUtility.name,
			roomUtility.title,
			roomUtility.description
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

RoomUtility.prototype.createRoomUtilityID = function createRoomUtilityID( roomUtility ){
	var roomUtilityData = JSON.stringify( roomUtility );

	var roomUtilityID = crypto.createHash( "sha512" )
		.update( roomUtilityData )
		.digest( "hex" )
		.toString( );

	this.references.push( roomUtilityID );

	this.roomUtilityID = roomUtilityID;

	return this;
};

RoomUtility.prototype.resolveRoomUtility = function resolveRoomUtility( roomUtility ){
	/*:
		We will search for room types that doesn't have documents.

		Extract them and save them.

		@todo:
			Make the query fast by introducing a custom query
				to get all room types not in the database.
		@end-todo
	*/
	var roomUtilityName = shardize( roomUtility, true );

	RoomUtility( )
		.set( "mainSelf", this )
		.promise( )
		.clone( )
		.once( "error",
			function onError( error ){
				this.self.flush( ).drop( ).mainSelf.result( error );
			} )
		.once( "result",
			function onResult( error, hasRoomUtility ){
				if( error ){
					this.self.flush( ).drop( ).mainSelf.result( error );

				}else if( hasRoomUtility ){
					this.self.drop( ).notify( );

				}else{
					this.self.flush( ).resolve( );
				}
			} )
		.has( roomUtilityName, "name" )
		.self
		.wait( )
		.once( "error",
			function onError( error ){
				this.drop( ).mainSelf.result( error );
			} )
		.once( "result",
			function onResult( error, roomUtility ){
				if( error ){
					this.drop( ).mainSelf.result( error );

				}else{
					this.drop( ).mainSelf.result( null, roomUtility.referenceID );
				}
			} )
		.pick( "name", roomUtilityName )
		.then( function addRoomUtility( ){
			var roomUtilityData = {
				"name": roomUtilityName
			};

			this
				.clone( )
				.once( "error",
					function onError( error ){
						this.mainSelf.drop( ).result( error );
					} )
				.once( "result",
					function onResult( error, roomUtility ){
						if( error ){
							this.mainSelf.drop( ).result( error );

						}else{
							this.mainSelf.drop( ).result( null, roomUtility.referenceID );
						}
					} )
				.createReferenceID( roomUtilityData )
				.createRoomUtilityID( roomUtilityData )
				.add( roomUtilityData );
		} );
	
	return this;
};

global.RoomUtility = RoomUtility;
module.exports = RoomUtility;