//: @client-mode:
/*: @development-mode:
if( development ){
	setURL( "VEHICLE_ADD_URL", "http://vehicle.parq.ph:10000/api/@accessID/vehicle/owner/add" );
}
@end-development-mode */

/*: @production-mode:
if( production ){
	setURL( "VEHICLE_ADD_URL", "https://vehicle.parq.ph:10000/api/@accessID/vehicle/owner/add" );
}
@end-production-mode */
//: @end-client-mode

//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "VEHICLE_ADD_URL", "http://vehicle.parq.ph:10000/api/@accessID/vehicle/add/@user" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "VEHICLE_ADD_URL", "https://vehicle.parq.ph:10000/api/@accessID/vehicle/add/@user" );
}
@end-administrator-production-mode */
//: @end-administrator-mode

PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "add-vehicle" ||
			reference == "register-vehicle" )
		{
			PubSub.publish( "show-add-vehicle" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "show-add-vehicle",
	function onShowAddVehicle( ){
		PubSub.publish( "get-add-vehicle-query-vehicle-models",
			function onGetAddVehicleQueryForVehicleModels( query ){
				PubSub.publish( "get-vehicle-models",
					function onGetVehicleModels( error, vehicleModels ){
						if( error ){

						}else if( _.isEmpty( vehicleModels ) ){
							PubSub.publish( "notify", "info", "no vehicle models retreived" );

						}else{
							PubSub.publish( "set-add-vehicle-models", vehicleModels );
						}
					}, query );
			} );

		PubSub.publish( "get-vehicle-model-count",
			function onResult( error, vehicleModelCount ){
				if( error ){
					PubSub.publish( "notify", "error", error );

				}else{
					PubSub.publish( "set-add-vehicle-total-count-vehicle-models", vehicleModelCount );
				}
			} );

		PubSub.publish( "get-vehicle-colors",
			function onGetVehicleColors( error, vehicleColors ){
				if( error ){

				}else if( _.isEmpty( vehicleColors ) ){
					
				}else{
					PubSub.publish( "set-add-vehicle-colors", vehicleColors );
				}
			} );

		//: @administrator-mode:
		PubSub.publish( "get-users",
			function onGetUsers( error, users ){
				if( error ){

				}else if( _.isEmpty( users ) ){
					
				}else{
					PubSub.publish( "set-add-vehicle-users", users );
				}
			} );
		//: @end-administrator-mode
	} );

PubSub.subscribe( "update-add-vehicle",
	function onUpdateAddVehicle( ){
		PubSub.publish( "get-add-vehicle-query-vehicle-models",
			function onGetAddVehicleQueryForVehicleModels( query ){
				PubSub.publish( "get-vehicle-models",
					function onGetVehicleModels( error, vehicleModels ){
						if( error ){

						}else if( _.isEmpty( vehicleModels ) ){
							PubSub.publish( "notify", "info", "no vehicle models retreived" );

						}else{
							PubSub.publish( "set-add-vehicle-models", vehicleModels );
						}
					}, query );
			} );
	} );

PubSub.subscribe( "close-add-vehicle",
	function onCloseAddVehicle( ){
		PubSub.publish( "show-headbar" );
	} );

PubSub.subscribe( "add-vehicle",
	function onAddVehicle( vehicleData ){
		qwest
			.post( VEHICLE_ADD_URL.replace( "@user", vehicleData.user ), {
				"plateNumber": vehicleData.plateNumber,
				"model": vehicleData.model,
				"color": vehicleData.color
			}, QWEST_OPTION )
			.then( function onResponse( result ){
				if( result.status == "success" ){
					PubSub.publish( "notify", "success", "vehicle successfully added", "add vehicle" );	
				
				}else{
					PubSub.publish( "notify", "failure", "adding vehicle failed", "add vehicle" );
				}

				console.debug( "add-vehicle", result );
			} )
			.catch( function onError( error ){
				PubSub.publish( "notify", "error", this.response.data );

				console.debug( "add-vehicle", error, this );
			} );
	} );

