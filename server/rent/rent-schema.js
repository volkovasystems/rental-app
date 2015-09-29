var moment = require( "moment" );
var mongoose = require( "mongoose" );
var shardize = require( "shardize" );

require( "moment-duration-format" );

require( "../model/model-schema.js" );
require( "../renter/renter.js" );
require( "../room/room.js" );

var RentSchema = new ModelSchema( {
	"rentID": {
		"type": String,
		"unique": true,
		"required": true,
		"index": true
	},
	"room": {
		"reference": {
			"type": String,
			"ref": "Room",
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
				"required": true
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
			"required": true,
			"index": true,
			"default": 0.0
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
	"moveInDate": {
		"type": Date,
		"required": true
	},
	"moveOutDate": {
		"type": Date,
		"required": true
	},
	"duration": {
		"range": {
			"type": Number,
			"default": 0
		},
		"description": {
			"type": String,
			"default": ""
		}
	},
	"waterMeterValue": {
		"type": Number,
		"required": true,
		"default": 0.0
	},
	"electricMeterValue": {
		"type": Number,
		"required": true,
		"default": 0.0
	},
	"depositPayment": {
		"type": Number,
		"required": true,
		"default": 0.0
	},
	"roomPrice": {
		"type": Number,
		"required": true,
		"default": 0.0
	},
	"renter": {
		"reference": {
			"type": String,
			"ref": "Renter",
			"required": true,
			"index": true
		},
		"fullName": {
			"type": String,
			"required": true,
			"index": true,
			"default": ""
		},
		"idNumber": {
			"type": String,
			"required": true,
			"index": true,
			"default": ""
		},
		"eMail": {
			"type": String,
			"required": true,
			"index": true,
			"default": ""
		},
		"contactNumber": {
			"type": String,
			"required": true,
			"index": true,
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
		},
		"guests": [ 
			{
				"displayName": {
					"type": String,
					"required": true,
					"index": true,
					"default": ""
				},
				"fullName": {
					"type": String,
					"required": true,
					"index": true,
					"default": ""
				},
				"contactNumber": {
					"type": String,
					"required": true,
					"index": true,
					"default": ""
				}
			}
		]
	}
} );

/*:
	This will prefill the duration data.
*/
RentSchema.pre( "validate",
	function onValidate( next ){
		//: Remove the time from the date.
		this.moveInDate = new Date( moment( this.moveInDate ).format( "LL" ) );

		this.moveOutDate = new Date( moment( this.moveOutDate ).format( "LL" ) );

		var range = Math.abs( this.moveOutDate.valueOf( ) - this.moveInDate.valueOf( ) );

		var description = moment.duration( range, "milliseconds" )
			.format( "M [months], W [weeks], D [days]," );

		this.duration = {
			"range": range,
			"description": description
		};

		next( );
	} );

//: This will pre-fill other properties for room.
RentSchema.pre( "validate", true,
	function onValidate( next, done ){
		Room( )
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

						done( new Error( "room does not exists" ) );
					}
				} )
			.exists( this.room.reference )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					done( error );
				} )
			.once( "result",
				( function onResult( error, room ){
					if( error ){
						done( error );
						
					}else{
						this.room.buildingNumber = room.buildingNumber;

						this.room.roomNumber = room.roomNumber;

						this.room.roomType = room.roomType;

						this.room.roomSize = room.roomSize;

						this.room.name = room.name;
						
						this.room.title = room.title;

						this.room.description = room.description,
						
						this.room.tags = room.tags;

						done( )
					}
				} ).bind( this ) )
			.pick( "referenceID", this.room.reference );

		next( );
	} );

//: This will pre-fill other properties for renter.
RentSchema.pre( "validate", true,
	function onValidate( next, done ){
		Renter( )
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

						done( new Error( "renter does not exists" ) );
					}
				} )
			.exists( this.renter.reference )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					done( error );
				} )
			.once( "result",
				( function onResult( error, renter ){
					if( error ){
						done( error );
						
					}else{
						this.renter.fullName = renter.fullName;

						this.renter.idNumber = renter.idNumber;
						
						this.renter.eMail = renter.eMail;
						
						this.renter.contactNumber = renter.contactNumber;

						this.renter.name = renter.name;
						
						this.renter.title = renter.title;

						this.renter.description = renter.description,
						
						this.renter.tags = renter.tags;

						this.renter.guests = renter.guests
							.map( function onEachGuest( guest ){
								return {
									"displayName": guest.displayName,
									"fullName": guest.fullName,
									"contactNumber": guest.contactNumber
								};
							} );

						done( )
					}
				} ).bind( this ) )
			.pick( "referenceID", this.renter.reference );

		next( );
	} );

/*:
	This will prefill the name of the rent using the
		renter name, room name and the move in date.
*/
RentSchema.pre( "validate", true,
	function onValidate( next, done ){
		if( this.name ){
			next( );

			done( );

			return;
		}

		async.waterfall( [
			( function getRoom( callback ){
				Room( )
					.once( "error",
						function onError( error ){
							callback( error );
						} )
					.once( "result",
						function onResult( error, room ){
							if( error ){
								callback( error );

							}else if( !_.isEmpty( room ) ){
								callback( null, room.name );
							
							}else{
								callback( new Error( "cannot extract room name for rent name" ) );
							}
						} )
					.pick( "referenceID", this.room.reference );
				
			} ).bind( this ),

			( function getRenter( roomName, callback ){
				Renter( )
					.once( "error",
						function onError( error ){
							callback( error );
						} )
					.once( "result",
						function onResult( error, renter ){
							if( error ){
								callback( error );

							}else if( !_.isEmpty( renter ) ){
								callback( null, renter.name );
							
							}else{
								callback( new Error( "cannot extract renter name for rent name" ) );
							}
						} )
					.pick( "referenceID", this.renter.reference )	

			} ).bind( this ),

			( function constructName( roomName, renterName, callback ){
				callback( null, [
						roomName,
						renterName,
						moment( new Date( this.moveInDate ) ).format( "YYYY-DD-MM" )
					].join( "-" ).toLowerCase( ) );
			} ).bind( this ),

			( function saveRentName( rentName, callback ){
				this.name = rentName;

				callback( );
			} ).bind( this )
		],
		
		function lastly( error ){
			done( error );
		} );

		next( );
	} );

RentSchema.initializeModel( "rent" );

global.RentSchema = RentSchema;
module.exports = RentSchema;