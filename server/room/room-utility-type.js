var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var util = require( "util" );
var shardize = require( "shardize" );
var titlelize = require( "titlelize" );

require( "../model/model.js" );

require( "../utility/responsible.js" );

var RoomUtilityType = function RoomUtilityType( ){
	if( this instanceof RoomUtilityType ){
		Model.call( this, "RoomUtilityType" );

		this.setScopes( );

		this.setSearches( );

		this.setDomains( );

	}else{
		return new RoomUtilityType( );
	}
};

util.inherits( RoomUtilityType, Model );

Responsible( ).compose( RoomUtilityType );

RoomUtilityType.prototype.add = function add( roomUtilityType ){
	var roomUtilityTypeData = this.resolveAddData( roomUtilityType )
		( {
			"roomUtilityTypeID": this.roomUtilityTypeID,

			"unitValue": roomUtilityType.unitValue,
			"unitName" roomUtilityType.unitName
		} );

	Model.prototype.add.call( this, roomUtilityTypeData );

	return this;
};

RoomUtilityType.prototype.update = function update( roomUtilityType, reference ){
	var roomUtilityTypeData = this.resolveUpdateData( roomUtilityType )( );

	Model.prototype.update.call( this, roomUtilityTypeData, reference );

	return this;
};

RoomUtilityType.prototype.createReferenceID = function createReferenceID( roomUtilityType ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			roomUtilityType.unitName,
			roomUtilityType.name,
			roomUtilityType.title,
			roomUtilityType.description
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

RoomUtilityType.prototype.createRoomUtilityTypeID = function createRoomUtilityTypeID( roomUtilityType ){
	var roomUtilityTypeData = JSON.stringify( roomUtilityType );

	var roomUtilityTypeID = crypto.createHash( "sha512" )
		.update( roomUtilityTypeData )
		.digest( "hex" )
		.toString( );

	this.references.push( roomUtilityTypeID );

	this.roomUtilityTypeID = roomUtilityTypeID;

	return this;
};

RoomUtilityType.prototype.resolveRoomUtilityType = function resolveRoomUtilityType( roomUtilityType ){
	/*:
		We will search for room types that doesn't have documents.

		Extract them and save them.

		@todo:
			Make the query fast by introducing a custom query
				to get all room types not in the database.
		@end-todo
	*/
	var roomUtilityTypeName = shardize( roomUtilityType, true );

	RoomUtilityType( )
		.set( "mainSelf", this )
		.promise( )
		.clone( )
		.once( "error",
			function onError( error ){
				this.self.flush( ).drop( ).mainSelf.result( error );
			} )
		.once( "result",
			function onResult( error, hasRoomUtilityType ){
				if( error ){
					this.self.flush( ).drop( ).mainSelf.result( error );

				}else if( hasRoomUtilityType ){
					this.self.drop( ).notify( );

				}else{
					this.self.flush( ).resolve( );
				}
			} )
		.has( roomUtilityTypeName, "name" )
		.self
		.wait( )
		.once( "error",
			function onError( error ){
				this.drop( ).mainSelf.result( error );
			} )
		.once( "result",
			function onResult( error, roomUtilityType ){
				if( error ){
					this.drop( ).mainSelf.result( error );

				}else{
					this.drop( ).mainSelf.result( null, roomUtilityType.referenceID );
				}
			} )
		.pick( "name", roomUtilityTypeName )
		.then( function addRoomUtilityType( ){
			var roomUtilityTypeData = {
				"name": roomUtilityTypeName
			};

			this
				.clone( )
				.once( "error",
					function onError( error ){
						this.mainSelf.drop( ).result( error );
					} )
				.once( "result",
					function onResult( error, roomUtilityType ){
						if( error ){
							this.mainSelf.drop( ).result( error );

						}else{
							this.mainSelf.drop( ).result( null, roomUtilityType.referenceID );
						}
					} )
				.createReferenceID( roomUtilityTypeData )
				.createRoomUtilityTypeID( roomUtilityTypeData )
				.add( roomUtilityTypeData );
		} );
	
	return this;
};

global.RoomUtilityType = RoomUtilityType;
module.exports = RoomUtilityType;