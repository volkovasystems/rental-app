var _ = require( "lodash" );
var unirest = require( "unirest" );
var util = require( "util" );

var Reserve = RESERVE;

Reserve.prototype.reserveSlotAtPlace = function reserveSlotAtPlace( place ){
	unirest
		.get( SLOT_SERVER_URL
			.join( "api/@accessID/slot/available/reserve/at/place/@place"
				.replace( "@accessID", this.accessID )
				.replace( "@place", place ) )
			.path( ) )

		.end( ( function onResponse( response ){
			if( "error" in response && 
				response.error &&
				response.status >= 500 )
			{
				this.result( response.error );

				return;
			}

			var status = response.body.status;
			var slot = response.body.data;

			if( status == "error" ){
				var error = new Error( response.body.data );

				this.result( error );
				
			}else if( status == "failed" ){
				this.result( null, false, response.body.data );

			}else{
				this.result( null, slot );
			}
		} ).bind( this ) );

	return this;
};

APP.get( "/api/:accessID/reserve/slot/at/place/:place",
	function onReserveSlotAtPlace( request, response ){
		var accessID = request.params.accessID;
		
		var place = request.params.place;

		Reserve( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, slot, failureMessage ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( slot ){ 
						this.reply( response, 200, "success", { "referenceID": slot.referenceID } );

					}else{
						this.reply( response, 403, "failed", failureMessage );
					}
				} )
			.set( "accessID", accessID )
			.reserveSlotAtPlace( place );
	} );