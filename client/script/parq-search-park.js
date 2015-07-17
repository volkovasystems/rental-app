//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "PARK_SEARCH_URL", "http://park.parq.ph:12000/api/@accessID/park/search" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "PARK_SEARCH_URL", "https://park.parq.ph:12000/api/@accessID/park/search" );
}
@end-administrator-production-mode */

PubSub.subscribe( "search-park",
	function onSearchPark( value, handler ){
		handler = handler || function handler( ){ };

		qwest
			.post( PARK_SEARCH_URL, { "value": value }, QWEST_OPTION )
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