//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "AMENITY_GET_ALL_URL", "http://place.parq.ph:11000/api/@accessID/amenity/all" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "AMENITY_GET_ALL_URL", "https://place.parq.ph:11000/api/@accessID/amenity/all" );
}
@end-administrator-production-mode */

PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "view-amenities" ){
			PubSub.publish( "show-view-amenities" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "show-view-amenities",
	function onShowViewAmenities( ){
		PubSub.publish( "get-amenities",
			function onResult( error, amenities ){
				if( error ){
					PubSub.publish( "notify", "error", error );

				}else if( _.isEmpty( amenities ) ){
					PubSub.publish( "notify", "info", "no amenities retreived" );

				}else{
					PubSub.publish( "set-view-amenities", amenities );
				}
			} );
	} );

PubSub.subscribe( "close-view-amenities",
	function onCloseViewAmenities( ){
		PubSub.publish( "show-headbar" );
	} );

PubSub.subscribe( "get-amenities",
	function onGetAmenities( handler ){
		handler = handler || function handler( ){ };

		qwest
			.get( AMENITY_GET_ALL_URL, null, QWEST_OPTION )
			.then( function onResponse( result ){
				if( result.status == "success" ){
					handler( null, result.data );

				}else{
					handler( null, [ ] );
				}

				console.debug( "view-amenities", result );
			} )
			.catch( function onError( error ){
				handler( error );

				console.debug( "view-amenities", error );
			} );
	} );

//: @end-administrator-mode