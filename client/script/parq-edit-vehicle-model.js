//: @administrator-mode:
/*: @development-mode:
if( development ){
	setURL( "VEHICLE_MODEL_UPDATE_URL", "http://vehicle.parq.ph:10000/api/@accessID/vehicle/model/update/@referenceID" );
}
@end-development-mode */

/*: @production-mode:
if( production ){
	setURL( "VEHICLE_MODEL_UPDATE_URL", "https://vehicle.parq.ph:10000/api/@accessID/vehicle/model/update/@referenceID" );
}
@end-production-mode */

PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "edit-vehicle-model" ){
			PubSub.publish( "show-edit-vehicle-model" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "close-edit-vehicle-model",
	function onCloseEditVehicleModel( ){
		PubSub.publish( "show-headbar" );
	} );

PubSub.subscribe( "edit-vehicle-model",
	function onEditVehicleModel( vehicleModelData ){
		qwest
			.post( VEHICLE_MODEL_UPDATE_URL
					.replace( "@referenceID", vehicleModelData.referenceID ), {
				"name": vehicleModelData.name,
				"title": vehicleModelData.title,
				"description": vehicleModelData.description,
				"brand": vehicleModelData.brand
			}, QWEST_OPTION )

			.then( function onResponse( result ){
				if( result.status == "success" ){
					PubSub.publish( "notify", "success", "vehicle model successfully updated", "edit vehicle model" );	
				
				}else{
					PubSub.publish( "notify", "failure", "updating vehicle model failed", "edit vehicle model" );
				}

				console.debug( "edit-vehicle-model", result );
			} )
			.catch( function onError( error ){
				PubSub.publish( "notify", "error", error );

				console.debug( "edit-vehicle-model", error );
			} );
	} );
//: @end-administrator-mode