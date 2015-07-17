//: @administrator-mode:
/*: @development-mode:
if( development ){
	setURL( "VEHICLE_MODEL_COUNT_URL", "http://vehicle.parq.ph:10000/api/@accessID/vehicle/model/count" );
}
@end-development-mode */

/*: @production-mode:
if( production ){
	setURL( "VEHICLE_MODEL_COUNT_URL", "https://vehicle.parq.ph:10000/api/@accessID/vehicle/model/count" );
}
@end-production-mode */

PubSub.subscribe( "get-vehicle-model-count",
	function onGetVehicleModelCount( handler ){
		handler = handler || function handler( ){ };

		qwest
			.get( VEHICLE_MODEL_COUNT_URL, null, QWEST_OPTION )
			.then( function onResponse( result ){
				if( result.status == "success" ){
					handler( null, result.data.vehicleModelCount );

				}else{
					handler( null, 0 );
				}

				console.debug( "view-vehicle-model-count", result );
			} )
			.catch( function onError( error ){
				handler( error );

				console.debug( "view-vehicle-model-count", error );
			} );
	} );

//: @end-administrator-mode