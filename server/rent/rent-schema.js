var mongoose = require( "mongoose" );

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

		//: These are searchable items.
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
		"roomSize": {
			"type": Number,
			"required": true,
			"index": true
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
		"range": Number,
		"description": String
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
		"required": true
	},
	"roomPrice": {
		"type": Number,
		"required": true
	},

	"renter": {
		"reference": {
			"type": String,
			"ref": "Renter",
			"required": true,
			"index": true
		},
		//: These are searchable items.
		"fullName": {
			"type": String,
			"required": true,
			"index": true
		},
		"idNumber": {
			"type": String,
			"required": true,
			"index": true
		},
		"eMail": {
			"type": String,
			"required": true,
			"index": true
		},
		"contactNumber": {
			"type": String,
			"required": true,
			"index": true
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
		"guests": [ 
			{
				"displayName": {
					"type": String,
					"required": true,
					"index": true
				},
				"fullName": {
					"type": String,
					"required": true,
					"index": true
				},
				"contactNumber": {
					"type": String,
					"required": true,
					"index": true
				}
			}
		]
	}
} );

//: This will pre-fill other properties for room.
RentSchema.pre( "save", true,
	function onSave( next, done ){
		if( typeof this.room == "string" &&
			this.room )
		{
			this.room = {
				"reference": this.room
			};
		}

		if( !( typeof this.room == "object" &&
			"reference" in this.room &&
			typeof this.room.reference == "string" &&
			this.room.reference ) )
		{
			next( new Error( "invalid room reference" ) );

			return;
		}

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
RentSchema.pre( "save", true,
	function onSave( next, done ){
		if( typeof this.renter == "string" &&
			this.renter )
		{
			this.renter = {
				"reference": this.renter
			};
		}

		if( !( typeof this.renter == "object" &&
			"reference" in this.renter &&
			typeof this.renter.reference == "string" &&
			this.renter.reference ) )
		{
			next( new Error( "invalid renter reference" ) );

			return;
		}

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

mongoose.model( "Model" ).discriminator( "Rent", RentSchema );

global.RentSchema = RentSchema;
module.exports = RentSchema;