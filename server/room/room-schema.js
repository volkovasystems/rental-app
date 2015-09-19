var _ = require( "lodash" );
var async = require( "async" );
var mongoose = require( "mongoose" );

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
		"index": true
	},
	"roomNumber": {
		"type": String,
		"required": true,
		"index": true
	},

	"roomType": {
		"reference": {
			"type": String,
			"ref": "RoomType",
			"required": true
		},
		"name": {
			"type": String,
			"required": true
		},
		"title": {
			"type": String,
			"required": true
		},
		"description": String,
		"tags": [ String ]
	},
	"roomSize": Number,

	"roomItems": [ 
		{
			"item": {
				"reference": {
					"type": String,
					"ref": "RoomItem",
					"required": true
				},
			
				//: These are searchable properties.
				"name": {
					"type": String,
					"required": true
				},
			
				"title": {
					"type": String,
					"required": true
				},
			
				"description": String,
			
				"tags": [ String ]
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

RoomSchema.pre( "save", true,
	function onSave( next, done ){
		var roomItems = this.roomItems
			.map( function onEachRoomItem( roomItem ){
				if( typeof roomItem.item == "string" ){
					roomItem.item = {
						"reference": roomItem.item
					};
				}

				return roomItem;
			} );

		this.roomItems = roomItems;
		
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
				}
				
			} ).bind( this ) );

		next( );
	} );

//: This will pre-fill other properties for room type.
RoomSchema.pre( "save", true,
	function onSave( next, done ){
		if( typeof this.roomType == "string" &&
			this.roomType )
		{
			this.roomType = {
				"reference": this.roomType
			};
		}

		if( !( typeof this.roomType == "object" &&
			"reference" in this.roomType &&
			typeof this.roomType.reference == "string" &&
			this.roomType.reference ) )
		{
			next( new Error( "invalid room type reference" ) );

			return;
		}

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

var constructName = function constructName( buildingNumber, roomNumber, roomTypeName ){
	return [
		buildingNumber,
		roomNumber,
		roomTypeName
	].join( "-" ).toLowerCase( );
};

/*:
	This will format the name of the room using
		the building number, room number and room type name.
*/
RoomSchema.pre( "save", true,
	function onSave( next, done ){
		if( this.name ){
			done( );
			next( );

			return;
		}

		if( typeof this.roomType == "string" ){
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
							this.name = constructName( this.buildingNumber, 
								this.roomNumber, 
								roomType.name );

						}else if( typeof this.roomType == "object" ){
							this.name = constructName( this.buildingNumber, 
								this.roomNumber, 
								this.roomType.name );

							done( );
						}else{
							done( new Error( "room name cannot be constructted" ) );
						}
					} ).bind( this ) )
				.pick( "name", shardize( this.roomType ) )

		}else if( typeof this.roomType == "object" ){
			this.name = constructName( this.buildingNumber, 
				this.roomNumber, 
				this.roomType.name );
		}

		next( );
	} );

RoomSchema.initializeModel( "room" );

global.RoomSchema = RoomSchema;
module.exports = RoomSchema;