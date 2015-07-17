/*: @development-mode:
if( development ){
	setURL( "VEHICLE_COLOR_GET_ALL_URL", "http://vehicle.parq.ph:10000/api/@accessID/vehicle/color/all" );
}
@end-development-mode */

/*: @production-mode:
if( production ){
	setURL( "VEHICLE_COLOR_GET_ALL_URL", "https://vehicle.parq.ph:10000/api/@accessID/vehicle/color/all" );
}

if( development ){
	setURL( "VEHICLE_COLOR_BASIC_GET_ALL_URL", "http://vehicle.parq.ph:10000/api/@accessID/vehicle/color/basic/all" );
}
@end-development-mode */

/*: @production-mode:
if( production ){
	setURL( "VEHICLE_COLOR_BASIC_GET_ALL_URL", "https://vehicle.parq.ph:10000/api/@accessID/vehicle/color/basic/all" );
}
@end-production-mode */

PubSub.subscribe( "get-vehicle-colors",
	function onGetVehicleColors( handler ){
		handler = handler || function handler( ){ };

		qwest
			.get( VEHICLE_COLOR_GET_ALL_URL, null, QWEST_OPTION )
			.then( function onResponse( result ){
				if( result.status == "success" ){
					handler( null, result.data );

				}else{
					handler( null, [ ] );
				}

				console.debug( "get-vehicle-colors", result );
			} )
			.catch( function onError( error ){
				handler( error );

				console.debug( "get-vehicle-colors", error );
			} );
	} );

PubSub.subscribe( "get-basic-vehicle-colors",
	function onGetBasicVehicleColors( handler ){
		handler = handler || function handler( ){ };

		qwest
			.get( VEHICLE_COLOR_BASIC_GET_ALL_URL, null, QWEST_OPTION )
			.then( function onResponse( result ){
				if( result.status == "success" ){
					handler( null, result.data );

				}else{
					handler( null, [ ] );
				}

				console.debug( "get-basic-vehicle-colors", result );
			} )
			.catch( function onError( error ){
				handler( error );

				console.debug( "get-basic-vehicle-colors", error );
			} );
	} );