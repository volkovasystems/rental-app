var _ = require( "lodash" );
var async = require( "async" );
var mongoose = require( "mongoose" );
var util = require( "util" );

require( "../model/model-schema.js" );
require( "./room-item.js" );
require( "./room-type.js" );

var RoomSchema = new ModelSchema( {
	"roomID": {
		"type": String,
		"unique": true,
		"required": true,
		"index": true
	},
	"buildingNumber": {
		"type": String,
		"required": true,
		"index": true,
		"default": ""
	},
	"roomNumber": {
		"type": String,
		"required": true,
		"index": true,
		"default": ""
	},
	"roomType": {
		"reference": {
			"type": String,
			"ref": "RoomType",
			"required": true,
			"default": ""
		},
		"name": {
			"type": String,
			"required": true,
			"default": ""
		},
		"title": {
			"type": String,
			"required": true,
			"default": ""
		},
		"description": {
			"type": String,
			"default": ""
		},
		"tags": {
			"type": [ String ],
			"default": [ ]
		}
	},
	"roomSize": {
		"type": Number,
		"default": 0.0
	},
	"roomItems": [ 
		{
			"item": {
				"reference": {
					"type": String,
					"ref": "RoomItem",
					"required": true,
					"default": ""
				},
				"name": {
					"type": String,
					"required": true,
					"default": ""
				},
				"title": {
					"type": String,
					"required": true,
					"default": ""
				},
			
				"description": {
					"type": String,
					"default": ""
				},
				"tags": {
					"type": [ String ],
					"default": [ ]
				}
			},
			"count": {
				"type": Number,
				"required": true,
				"default": 1
			}
		}
	],
	"occupantLimit": {
		"type": Number,
		"required": true,
		"default": 1
	}
} );

//: This will pre-fill other properties for room type.
RoomSchema.pre( "validate", true,
	function onValidate( next, done ){
		RoomType( )
			.clone( )
			.once( "error",
				function onError( error ){
					this.self.flush( );

					done( error );
				} )
			.once( "result",
				function onResult( error, exists ){
					if( error ){
						this.self.flush( );

						done( error );
					
					}else if( exists ){
						this.self.notify( );
					
					}else{
						this.self.flush( );

						done( new Error( "room type does not exists" ) );
					}
				} )
			.exists( this.roomType.reference )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					done( error );
				} )
			.once( "result",
				( function onResult( error, roomType ){
					if( error ){
						done( error );
						
					}else{
						this.roomType.name = roomType.name;
						
						this.roomType.title = roomType.title;

						this.roomType.description = roomType.description,
						
						this.roomType.tags = roomType.tags;

						done( )
					}
				} ).bind( this ) )
			.pick( "referenceID", this.roomType.reference );

		next( );
	} );

RoomSchema.pre( "validate", true,
	function onValidate( next, done ){
		async.parallel( this.roomItems
			.map( function onEachRoomItem( roomItem ){
				return function resolveRoomItem( callback ){
					RoomItem( )
						.clone( )
						.once( "error",
							function onError( error ){
								this.self.flush( );

								callback( error );
							} )
						.once( "result",
							function onResult( error, existing ){
								if( error ){
									this.self.flush( );

									callback( error );

								}else if( existing ){
									this.self.notify( );

								}else{
									callback( null, null );
								}
							} )
						.exists( roomItem.item.reference )
						.self
						.wait( )
						.once( "error",
							function onError( error ){
								callback( error );
							} )
						.once( "result",
							function onResult( error, item ){
								if( error ){
									callback( error );

								}else{
									roomItem.item.name = item.name;

									roomItem.item.title = item.title;

									roomItem.item.description = item.description;

									roomItem.item.tags = item.tags;

									callback( null, roomItem );
								}
							} )
						.pick( "referenceID", roomItem.item.reference );
				};
			} ),
			( function lastly( error, roomItems ){
				if( error ){
					done( error );	
				
				}else{
					this.roomItems = roomItems;

					done( );
				}
				
			} ).bind( this ) );

		next( );
	} );

/*:
	This will format the name of the room using
		the building number, room number and room type name.
*/
RoomSchema.pre( "validate", true,
	function onValidate( next, done ){
		if( this.name ){
			next( );
			
			done( );

			return;
		}

		RoomType( )
			.once( "error",
				function onError( error ){
					done( error );
				} )
			.once( "result",
				( function onResult( error, roomType ){
					if( error ){
						done( error );

					}else if( !_.isEmpty( roomType ) ){
						this.name = [
								this.buildingNumber,
								this.roomNumber,
								roomType.name
							].join( "-" ).toLowerCase( );

						done( );
						
					}else{
						done( new Error( "room name cannot be constructted" ) );
					}

				} ).bind( this ) )
			.pick( "referenceID", this.roomType.reference )

		next( );
	} );

RoomSchema.initializeModel( "room" );

global.RoomSchema = RoomSchema;
module.exports = RoomSchema;