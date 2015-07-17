//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "SLOT_SEARCH_URL", "http://slot.parq.ph:13000/api/@accessID/slot/search" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "SLOT_SEARCH_URL", "https://slot.parq.ph:13000/api/@accessID/slot/search" );
}
@end-administrator-production-mode */

PubSub.subscribe( "search-slot",
	function onSearchSlot( value, handler ){
		handler = handler || function handler( ){ };

		qwest
			.post( SLOT_SEARCH_URL, { "value": value }, QWEST_OPTION )
			.then( function onResponse( response ){
				if( response.status == "success" ){
					handler( null, response.data );

				}else{
					handler( null, [ ] );
				}
			} )
			.catch( function onError( error ){
				handler( error );
			} );
	} );

//: @end-administrator-mode