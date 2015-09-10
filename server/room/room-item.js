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

		this.scopes = [
			"referenceID",

			"name",
			"title",
			"description"
		];

		this.searches = [
			"name",
			"title",
			"description"
		];

		this.domains = {

		};

	}else{
		return new RoomItem( );
	}
};

util.inherits( RoomItem, Model );

Responsible( ).compose( RoomItem );

RoomItem.prototype.add = function add( roomItem ){
	var roomItemData = _.extend( {
		"roomItemID": this.roomItemID,

		"name": roomItem.name,
		"title": roomItem.title,
		"description": roomItem.description,

		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	Model.prototype.add.call( this, roomItemData );

	return this;
};

RoomItem.prototype.update = function update( roomItem, reference ){
	var roomItemData = _.extend( {
		"name": roomItem.name || null,
		"title": roomItem.title || null,
		"description": roomItem.description || null,

		"scopes": this.scopes || null,
		"searches": this.searches || null,
		"domains": this.domains || null
	}, this.modelData );

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
	async.parallel( roomItems.map( function onEachRoomItem( roomItem ){
			return function resolveRoomItem( callback ){
				RoomItem( )
					.clone( )
					.once( "result",
						function onResult( error, hasRoomItem ){
							if( error ){
								this.self.flush( );

								callback( error );

							}else if( hasRoomItem ){
								this.self.flush( );

								callback( );

							}else{
								this.self.notify( );
							}
						} )
					.has( roomItem, "name" )
					.self
					.wait( )
					.once( "result",
						function onResult( error, hasRoomItem ){
							if( error ){
								callback( error );

							}else if( hasRoomItem ){
								callback( )

							}else{
								callback( null, roomItem );
							}
						} )
					.has( roomItem, "references" );
			};
		} ),
		( function lastly( error, roomItems ){
			if( error ){
				this.result( error );

			}else{
				async.parallel( _( roomItems )
					.compact( )
					.map( function onEachRoomItem( roomItem ){
						return {
							"name": shardize( roomItem ),
							"title": titlelize( roomItem )
						};
					} )
					.map( function onEachRoomItem( roomItem ){
						return function addRoomItems( callback ){
							RoomItem( )
								.once( "error",
									function onError( error ){
										callback( error )
									} )
								.once( "result",
									function onResult( error, roomItem ){
										callback( error, roomItem );
									} )
								.createReferenceID( roomItem )
								.createRoomItemID( roomItem )
								.add( roomItem );
						}
					} )
					.value( ),
					( function lastly( error, roomItems ){
						this.result( error, roomItems );
					} ).bind( this ) );
			}
		} ).bind( this ) );
};

global.RoomItem = RoomItem;
