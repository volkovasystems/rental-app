//: @administrator-mode:

/*: @administrator-development-mode:
if( development ){
	setURL( "SLOT_STATUS_GET_ALL_URL", "http://slot.parq.ph:12000/api/@accessID/slot/status/all" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "SLOT_STATUS_GET_ALL_URL", "https://slot.parq.ph:12000/api/@accessID/slot/status/all" );
}
@end-administrator-production-mode */

PubSub.subscribe( "get-all-slot-status",
	function onGetAllSlotStatus( handler ){
		handler = handler || function handler( ){ };

		qwest
			.get( SLOT_STATUS_GET_ALL_URL, null, QWEST_OPTION )
			.then( function onResponse( result ){
				if( result.status == "success" ){
					handler( null, result.data );

				}else{
					handler( null, [ ] );
				}

				console.debug( "get-all-slot-status", result );
			} )
			.catch( function onError( error ){
				handler( error );

				console.debug( "get-all-slot-status", error );
			} );
	} );

//: @end-administrator-mode