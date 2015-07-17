//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "PLACE_GET_ALL_URL", "http://place.parq.ph:11000/api/@accessID/place/all" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "PLACE_GET_ALL_URL", "https://place.parq.ph:11000/api/@accessID/place/all" );
}
@end-administrator-production-mode */

PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "view-places" ){
			PubSub.publish( "show-view-places" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "show-view-places",
	function onShowViewPlaces( ){
		PubSub.publish( "get-places",
			function onResult( error, places ){
				if( error ){
					PubSub.publish( "notify", "error", error );

				}else if( _.isEmpty( places ) ){
					PubSub.publish( "notify", "info", "no places retreived" );

				}else{
					PubSub.publish( "set-view-places", places );
				}
			} );
	} );

PubSub.subscribe( "close-view-places",
	function onCloseViewPlaces( ){
		PubSub.publish( "show-headbar" );
	} );

PubSub.subscribe( "get-places",
	function onGetPlaces( handler ){
		handler = handler || function handler( ){ };

		qwest
			.get( PLACE_GET_ALL_URL, null, QWEST_OPTION )
			.then( function onResponse( result ){
				if( result.status == "success" ){
					handler( null, result.data );

				}else{
					handler( null, [ ] );
				}

				console.debug( "view-places", result );
			} )
			.catch( function onError( error ){
				handler( error );

				console.debug( "view-places", error );
			} );
	} );

//: @end-administrator-mode