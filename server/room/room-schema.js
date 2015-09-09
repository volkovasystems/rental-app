var _ = require( "lodash" );
var async = require( "async" );
var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );
require( "./room-item.js" );

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

	"roomType": String,
	"roomSize": Number,

	"roomItems": [ 
		{
			"item": {
				"type": String,
				"ref": "RoomItem",
				"required": true
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

RoomSchema.pre( "save",
	function onSave( next, done ){
		async.parallel( this.roomItems
			.map( function onEachRoomItem( roomItem ){
				return function resolveRoomItem( callback ){
					RoomItem( )
						.once( "error",
							function onError( error ){
								callback( error );
							} )
						.once( "result",
							function onResult( error, result ){
								if( error ){
									this.self.flush( );

									callback( error );

								}else if( result ){
									this.self.flush( );

									/*:
										Replace item reference with referenceID
											because this should always be referenceID.
									*/
									roomItem.item = roomItem.referenceID;

									callback( );

								}else{
									this.self.notify( );
								}
							} )
						.refer( roomItem.item );
				};
			} ),
			function lastly( error ){
				done( error );
			} );

		next( );
	} );

mongoose.model( "Model" ).discriminator( "Room", RoomSchema );

global.RoomSchema = RoomSchema;
module.exports = RoomSchema;

