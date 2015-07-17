//: @administrator-mode:
/*: @development-mode:
if( development ){
	setURL( "VEHICLE_ADD_MODEL_URL", "http://vehicle.parq.ph:10000/api/@accessID/vehicle/model/add" );
}
@end-development-mode */

/*: @production-mode:
if( production ){
	setURL( "VEHICLE_ADD_MODEL_URL", "https://vehicle.parq.ph:10000/api/@accessID/vehicle/model/add" );
}
@end-production-mode */

PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "add-vehicle-model" ){
			PubSub.publish( "show-add-vehicle-model" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "close-add-vehicle-model",
	function onCloseAddVehicle( ){
		PubSub.publish( "show-headbar" );
	} );

PubSub.subscribe( "add-vehicle-model",
	function onAddVehicleModel( vehicleModelData ){
		qwest
			.post( VEHICLE_ADD_MODEL_URL, {
				"name": vehicleModelData.name,
				"title": vehicleModelData.title,
				"description": vehicleModelData.description,
				"brand": vehicleModelData.brand
			}, QWEST_OPTION )
			.then( function onResponse( result ){
				if( result.status == "success" ){
					PubSub.publish( "notify", "success", "vehicle model successfully added", "add vehicle model" );	
				
				}else{
					PubSub.publish( "notify", "failure", "adding vehicle model failed", "add vehicle model" );
				}

				console.debug( "add-vehicle-model", result );
			} )
			.catch( function onError( error ){
				PubSub.publish( "notify", "error", this.response.data );

				console.debug( "add-vehicle-model", error, this );
			} );
	} );
//: @end-administrator-mode