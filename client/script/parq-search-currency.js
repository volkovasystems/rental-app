//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "CURRENCY_SEARCH_URL", "http://price.parq.ph:18000/api/@accessID/currency/search" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "CURRENCY_SEARCH_URL", "https://price.parq.ph:18000/api/@accessID/currency/search" );
}
@end-administrator-production-mode */

PubSub.subscribe( "search-currency",
	function onSearchAmenity( value, handler ){
		handler = handler || function handler( ){ };

		qwest
			.post( CURRENCY_SEARCH_URL, { "value": value }, QWEST_OPTION )
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