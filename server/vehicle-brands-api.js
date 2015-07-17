var _ = require( "lodash" );
var util = require( "util" );

var Vehicle = VEHICLE;

/*:
	Refers to all the vehicles in the database.

	This has administrative privilege.
	
	This will include all users bound to those vehicles.
*/
APP.all( "/api/:accessID/vehicle/brand/all",
	function onGetAllVehicle( request, response, next ){
		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, isPopulated ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( isPopulated ){
						next( );

					}else{
						this.reply( response, 403, "failed", "no vehicles" );
					}
				} ) 
			.populated( );
	} );
APP.get( "/api/:accessID/vehicle/brand/all",
	function onGetAllVehicle( request, response ){
		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, vehicles ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", vehicles );
					}
				} )
			.all( );
	} );