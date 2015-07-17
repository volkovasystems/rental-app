var _ = require( "lodash" );
var unirest = require( "unirest" );

var Place = PLACE;

/*:
	We need accessID here because we are requesting data
		to other servers.
*/
APP.all( "/api/:accessID/place/:referenceID/park/and/slot/all",
	function onGetAllParkAndSlotInPlace( request, response, next ){
		var referenceID = request.params.referenceID;

		Place( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( existing ){
						next( );

					}else{
						this.reply( response, 200, "failed", "place is not existing" );
					}
				} )
			.exists( referenceID );
	} );
APP.get( "/api/:accessID/place/:referenceID/park/and/slot/all",
	function onGetAllParkAndSlotInPlace( request, response ){
		var referenceID = request.params.referenceID;

		var accessID = request.params.accessID

		Place( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, parkAndSlot ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( _.isEmpty( parkAndSlot ) ){
						this.reply( response, 200, "failed", "no parks and slots" );

					}else{
						parkAndSlot.referenceID = referenceID;

						this.reply( response, 200, "success", parkAndSlot );
					}
				} )
			.set( "accessID", accessID )
			.getAllParkAndSlot( referenceID );
	} );