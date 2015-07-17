var _ = require( "lodash" );

var VehicleModel = VEHICLE_MODEL;

APP.get( "/api/:accessID/vehicle/model/count",
	function onGetVehicleModelCount( request, response ){

		VehicleModel( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, vehicleModelCount ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "vehicleModelCount": vehicleModelCount } );
					}
				} )
			.count( );
	} );