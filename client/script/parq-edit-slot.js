//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "SLOT_UPDATE_URL", "http://slot.parq.ph:12000/api/@accessID/slot/update/@referenceID" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "SLOT_UPDATE_URL", "https://slot.parq.ph:12000/api/@accessID/slot/update/@referenceID" );
}
@end-administrator-production-mode */

PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "edit-slot" ){
			PubSub.publish( "show-edit-slot" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "close-edit-slot",
	function onCloseEditSlot( ){
		PubSub.publish( "show-headbar" );
	} );

PubSub.subscribe( "show-edit-slot",
	function onShowAddSlot( ){
		PubSub.publish( "get-all-slot-status",
			function onGetAllSlotStatus( error, slotStatus ){
				if( error ){

				}else if( _.isEmpty( slotStatus ) ){
					
				}else{
					PubSub.publish( "set-edit-slot-status", slotStatus );
				}
			} );

		PubSub.publish( "get-places",
			function onGetPlaces( error, places ){
				if( error ){

				}else if( _.isEmpty( places ) ){
					
				}else{
					PubSub.publish( "set-edit-slot-places", places );
				}
			} );

		PubSub.publish( "get-parks-only",
			function onGetParksOnly( error, parks ){
				if( error ){

				}else if( _.isEmpty( parks ) ){
					
				}else{
					PubSub.publish( "set-edit-slot-parks", parks );
				}
			} );
	} );

PubSub.subscribe( "edit-slot",
	function onEditSlot( slot ){
		qwest
			.post( SLOT_UPDATE_URL
					.replace( "@referenceID", slot.referenceID ), 

			{
				"title": slot.title,
				"name": slot.name,
				"description": slot.description,
				"status": slot.status,
				"park": slot.park,
				"place": slot.place
			}, QWEST_OPTION )
			
			.then( function onResponse( result ){
				if( result.status == "success" ){
					PubSub.publish( "notify", "success", "slot successfully updated", "edit slot" );	
				
				}else{
					PubSub.publish( "notify", "failure", "updating slot failed", "edit slot" );
				}

				console.debug( "edit-slot", result );
			} )
			.catch( function onError( error ){
				PubSub.publish( "notify", "error", error );
				
				console.debug( "edit-slot", error );
			} );
	} );
//: @end-administrator-mode