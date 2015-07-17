//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "PARK_UPDATE_URL", "http://park.parq.ph:12000/api/@accessID/park/update/@referenceID" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "PARK_UPDATE_URL", "https://park.parq.ph:12000/api/@accessID/park/update/@referenceID" );
}
@end-administrator-production-mode */

PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "edit-park" ){
			PubSub.publish( "show-edit-park" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "close-edit-park",
	function onCloseEditPark( ){
		PubSub.publish( "show-headbar" );
	} );

PubSub.subscribe( "show-edit-park",
	function onShowEditPark( ){

		PubSub.publish( "get-places",
			function onGetPlaces( error, places ){
				if( error ){

				}else if( _.isEmpty( places ) ){
					
				}else{
					PubSub.publish( "set-edit-park-places", places );
				}
			} );
	} );

PubSub.subscribe( "edit-park",
	function onEditPark( park, callback ){
		qwest
			.post( PARK_UPDATE_URL
					.replace( "@referenceID", park.referenceID ),
			{
				"title": park.title,
				"name": park.name,
				"description": park.description,
				"directions": park.directions,
				"instructions": park.instructions,
				"place": park.place,
			}, QWEST_OPTION )
			
			.then( function onResponse( result ){
				if( result.status == "success" ){
					PubSub.publish( "notify", "success", "park successfully updated", "edit park" );	
					
					callback( null, result );

				}else{
					PubSub.publish( "notify", "failure", "updating park failed", "edit park" );

					callback( null, false );
				}

				console.debug( "edit-park", result );
			} )
			.catch( function onError( error ){
				PubSub.publish( "notify", "error", error );
				
				console.debug( "edit-park", error );

				callback( error );
			} );
	} );
//: @end-administrator-mode