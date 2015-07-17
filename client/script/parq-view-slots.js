//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "SLOT_GET_ALL_URL", "http://slot.parq.ph:12000/api/@accessID/slot/all" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "SLOT_GET_ALL_URL", "https://slot.parq.ph:12000/api/@accessID/slot/all" );
}
@end-administrator-production-mode */

PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "view-slots" ){
			PubSub.publish( "show-view-slots" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "show-view-slots",
	function onShowViewSlots( ){
		PubSub.publish( "get-slots",
			function onResult( error, slots ){
				if( error ){
					PubSub.publish( "notify", "error", error );

				}else if( _.isEmpty( slots ) ){
					PubSub.publish( "notify", "info", "no slots retreived" );

				}else{
					PubSub.publish( "set-view-slots", slots );
				}
			} );
	} );

PubSub.subscribe( "close-view-slots",
	function onCloseViewSlots( ){
		PubSub.publish( "show-headbar" );
	} );

PubSub.subscribe( "get-slots",
	function onGetSlots( handler ){
		handler = handler || function handler( ){ };

		qwest
			.get( SLOT_GET_ALL_URL, null, QWEST_OPTION )
			.then( function onResponse( result ){
				if( result.status == "success" ){
					handler( null, result.data );

				}else{
					handler( null, [ ] );
				}

				console.debug( "view-slots", result );
			} )
			.catch( function onError( error ){
				handler( error );

				console.debug( "view-slots", error );
			} );
	} );

//: @end-administrator-mode