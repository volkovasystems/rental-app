//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "PLACE_SEARCH_URL", "http://place.parq.ph:11000/api/@accessID/place/search" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "PLACE_SEARCH_URL", "https://place.parq.ph:11000/api/@accessID/place/search" );
}
@end-administrator-production-mode */

PubSub.subscribe( "search-place",
	function onSearchPlace( value, handler ){
		handler = handler || function handler( ){ };

		qwest
			.post( PLACE_SEARCH_URL, { "value": value }, QWEST_OPTION )
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