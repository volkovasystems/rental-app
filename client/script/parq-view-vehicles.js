/*: @development-mode:
if( development ){
	setURL( "VEHICLE_GET_ALL_URL", "http://vehicle.parq.ph:10000/api/@accessID/vehicle/all" );
}
@end-development-mode */

/*: @production-mode:
if( production ){
	setURL( "VEHICLE_GET_ALL_URL", "https://vehicle.parq.ph:10000/api/@accessID/vehicle/all" );
}
@end-production-mode */

PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "view-vehicles" ){
			PubSub.publish( "show-view-vehicles" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "show-view-vehicles",
	function onShowViewVehicles( ){
		PubSub.publish( "get-vehicles",
			function onResult( error, vehicles ){
				if( error ){
					PubSub.publish( "notify", "error", error );

				}else if( _.isEmpty( vehicles ) ){
					PubSub.publish( "notify", "info", "no vehicles retreived" );

				}else{
					PubSub.publish( "set-view-vehicles", vehicles );
				}
			} );
	} );

PubSub.subscribe( "close-view-vehicles",
	function onCloseViewVehicles( ){
		PubSub.publish( "show-headbar" );
	} );

PubSub.subscribe( "get-vehicles",
	function onGetVehicles( handler ){
		handler = handler || function handler( ){ };

		qwest
			.get( VEHICLE_GET_ALL_URL, null, QWEST_OPTION )
			.then( function onResponse( result ){
				if( result.status == "success" ){
					handler( null, result.data );

				}else{
					handler( null, [ ] );
				}

				console.debug( "view-vehicles", result );
			} )
			.catch( function onError( error ){
				handler( error );

				console.debug( "view-vehicles", error );
			} );
	} );