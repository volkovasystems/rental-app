//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "AMENITY_UPDATE_URL", "http://place.parq.ph:11000/api/@accessID/amenity/update/@referenceID" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "AMENITY_UPDATE_URL", "https://place.parq.ph:11000/api/@accessID/amenity/update/@referenceID" );
}
@end-administrator-production-mode */

PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "edit-amenity" ){
			PubSub.publish( "show-edit-amenity" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "show-edit-amenity",
	function onShowEditAmenity( ){

		PubSub.publish( "get-amenities",
			function onGetAmenities( error, amenities ){
				if( error ){

				}else if( _.isEmpty( amenities ) ){
					
				}else{
					PubSub.publish( "set-edit-amenity-list", amenities );
				}
			} );
	} );

PubSub.subscribe( "close-edit-amenity",
	function onCloseEditPlace( ){
		PubSub.publish( "show-headbar" );
	} );

PubSub.subscribe( "edit-amenity",
	function onEditAmenity( amenity ){
		qwest
			.post( AMENITY_UPDATE_URL
				.replace( "@referenceID", amenity.referenceID ), {
				"name": amenity.name,
				"title": amenity.title,
				"description": amenity.description,
				"image": amenity.image
			}, QWEST_OPTION )

			.then( function onResponse( result ){
				if( result.status == "success" ){
					PubSub.publish( "notify", "success", "amenity successfully updated", "edit amenity" );	
				
				}else{
					PubSub.publish( "notify", "failure", "updating amenity failed", "edit amenity" );
				}

				console.debug( "edit-amenity", result );
			} )
			.catch( function onError( error ){
				PubSub.publish( "notify", "error", error );
				
				console.debug( "edit-amenity", error );
			} );
	} );
//: @end-administrator-mode