//: @administrator-mode:
/*: @development-mode:
if( development ){
	setURL( "VEHICLE_MODEL_GET_ALL_URL", "http://vehicle.parq.ph:10000/api/@accessID/vehicle/model/all" );
}
@end-development-mode */

/*: @production-mode:
if( production ){
	setURL( "VEHICLE_MODEL_GET_ALL_URL", "https://vehicle.parq.ph:10000/api/@accessID/vehicle/model/all" );
}
@end-production-mode */

PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "view-vehicle-models" ){
			PubSub.publish( "show-view-vehicle-models" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "update-view-vehicle-models",
	function onUpdateViewVehicleModels(  ){
		PubSub.publish( "get-view-vehicle-models",
			function onResult( error, vehicleModels ){
				if( error ){
					PubSub.publish( "notify", "error", error );

				}else if( _.isEmpty( vehicleModels ) ){
					PubSub.publish( "notify", "info", "no vehicle models retreived" );

				}else{
					PubSub.publish( "set-view-vehicle-models", vehicleModels );
				}
			} );
	} );

PubSub.subscribe( "show-view-vehicle-models",
	function onShowViewVehicleModels( ){
		PubSub.publish( "get-view-vehicle-models",
			function onResult( error, vehicleModels ){
				if( error ){
					PubSub.publish( "notify", "error", error );

				}else if( _.isEmpty( vehicleModels ) ){
					PubSub.publish( "notify", "info", "no vehicle models retreived" );

				}else{
					PubSub.publish( "set-view-vehicle-models", vehicleModels );
				}
			} );

		PubSub.publish( "get-vehicle-model-count",
			function onResult( error, vehicleModelCount ){
				if( error ){
					PubSub.publish( "notify", "error", error );

				}else{
					PubSub.publish( "set-view-vehicle-models-total-count", vehicleModelCount );
				}
			} );
	} );

PubSub.subscribe( "close-view-vehicle-models",
	function onCloseViewVehicleModels( ){
		PubSub.publish( "show-headbar" );
	} );

PubSub.subscribe( "get-view-vehicle-models",
	function onGetViewVehicleModels( handler ){
		PubSub.publish( "get-view-models-query",
			function onGetViewModelsQuery( query ){
				PubSub.publish( "get-vehicle-models",
					function onGetVehicleModels( error, vehicleModels ){
						handler( error, vehicleModels );
					}, query );
			} );
	} );

PubSub.subscribe( "get-vehicle-models",
	function onGetVehicleModels( handler, query ){
		handler = handler || function handler( ){ };

		query = query || { };

		/*:
			We need to transform the pageIndex to document index.
		*/
		var index = query.pageSize * ( query.pageIndex - 1 );

		qwest
			.get( ( new URI( VEHICLE_MODEL_GET_ALL_URL ) )
					.setQuery( "limit", query.pageSize )
					.setQuery( "index", index )
					.toString( ), 
				null, QWEST_OPTION )

			.then( function onResponse( result ){
				if( result.status == "success" ){
					handler( null, result.data );

				}else{
					handler( null, [ ] );
				}

				console.debug( "view-vehicle-models", result );
			} )
			.catch( function onError( error ){
				handler( error );

				console.debug( "view-vehicle-models", error );
			} );
	} );

//: @end-administrator-mode