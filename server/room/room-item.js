var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var util = require( "util" );
var shardize = require( "shardize" );
var titlelize = require( "titlelize" );

require( "../model/model.js" );

require( "../utility/responsible.js" );

var RoomItem = function RoomItem( ){
	if( this instanceof RoomItem ){
		Model.call( this, "RoomItem" );

		this.setScopes( );

		this.setSearches( );

		this.setDomains( );

	}else{
		return new RoomItem( );
	}
};

util.inherits( RoomItem, Model );

Responsible( ).compose( RoomItem );

RoomItem.prototype.add = function add( roomItem ){
	var roomItemData = this.resolveAddData( roomItem )
		( {
			"roomItemID": this.roomItemID
		} );

	Model.prototype.add.call( this, roomItemData );

	return this;
};

RoomItem.prototype.update = function update( roomItem, reference ){
	var roomItemData = this.resolveUpdateData( roomItem )( );

	Model.prototype.update.call( this, roomItemData, reference );

	return this;
};

RoomItem.prototype.createReferenceID = function createReferenceID( roomItem ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			roomItem.name,
			roomItem.title,
			roomItem.description
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

RoomItem.prototype.createRoomItemID = function createRoomItemID( roomItem ){
	var roomItemData = JSON.stringify( roomItem );

	var roomItemID = crypto.createHash( "sha512" )
		.update( roomItemData )
		.digest( "hex" )
		.toString( );

	this.references.push( roomItemID );

	this.roomItemID = roomItemID;

	return this;
};

RoomItem.prototype.resolveRoomItems = function resolveRoomItems( roomItems ){
	/*:
		We will search for room items that doesn't have documents.

		Extract them and save them.

		Note that the item must be a name not a referenceID.

		roomItems should be an array with the following format:
		[
			{
				"item": String,
				"count": Number
			},
			...
		]

		@todo:
			Make the query fast by introducing a custom query
				to get all room items not in the database.
		@end-todo
	*/
	async.parallel( roomItems
		.map( function onEachRoomItem( roomItem ){
			return function resolveRoomItem( callback ){
				var roomItemName = shardize( roomItem.item, true );

				RoomItem( )
					.promise( )
					.once( "error",
						function onError( error ){
							this.drop( );

							callback( error );
						} )
					.once( "result",
						function onResult( error, hasRoomItem ){
							if( error ){
								this.drop( );

								callback( error );

							}else if( hasRoomItem ){
								this.resolve( );

							}else{
								callback( null, roomItem );
							}
						} )
					.has( roomItemName, "name" )
					.then( function getRoomItem( ){
						this
							.once( "error",
								function onError( error ){
									this.drop( );

									callback( error );
								} )
							.once( "result",
								function onResult( error, thisRoomItem ){
									if( error ){
										this.drop( );

										callback( error );

									}else if( _.isEmpty( thisRoomItem ) ){
										callback( new Error( "room item cannot be determined for " + roomItemName ) );
									
									}else{
										roomItem.item = thisRoomItem.referenceID

										roomItem.resolved = true

										this.drop( );

										callback( null, roomItem );
									}
								} )
							.pick( "name", roomItemName );
					} );
			};
		} ),
		( function lastly( error, roomItems ){
			if( error ){
				this.result( error );

			}else{
				async.parallel( roomItems
					.map( function onEachRoomItem( roomItem ){
						return function addRoomItems( callback ){
							if( roomItem.resolved ){
								callback( null, roomItem );
								
								return;
							}

							var roomItemData = {
								"name": roomItem.item
							};

							RoomItem( )
								.once( "error",
									function onError( error ){
										callback( error )
									} )
								.once( "result",
									function onResult( error, thisRoomItem ){
										if( error ){
											callback( error );

										}else{
											roomItem.item = thisRoomItem.referenceID

											callback( null, roomItem );
										}
									} )
								.createReferenceID( roomItemData )
								.createRoomItemID( roomItemData )
								.add( roomItemData );
						};
					} ),
					( function lastly( error, roomItems ){
						this.result( error, roomItems );
					} ).bind( this ) );
			}
		} ).bind( this ) );

	return this;
};

global.RoomItem = RoomItem;
module.exports = RoomItem;
