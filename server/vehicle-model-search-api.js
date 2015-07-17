var _ = require( "lodash" );

var VehicleModel = VEHICLE_MODEL;

/*:
	This is the search endpoint that 
		executes search within the search scope
		for values the contains and matches.
*/
APP.post( "/api/:accessID/vehicle/model/search",
	function onSearchVehicleModel( request, response ){
		var value = request.body.value;

		VehicleModel( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, vehicleModels ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", vehicleModels );
					}
				} )
			.search( value );
	} );

APP.post( "/api/:accessID/vehicle/model/search/contains",
	function onSearchContainsVehicleModel( request, response ){
		var value = request.body.value;

		VehicleModel( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, vehicleModels ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", vehicleModels );
					}
				} )
			.contains( values );
	} );

APP.post( "/api/:accessID/vehicle/model/search/matches",
	function onSearchContainsVehicleModel( request, response ){
		var value = request.body.value;

		VehicleModel( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, vehicleModels ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", vehicleModels );
					}
				} )
			.matches( value );
	} );