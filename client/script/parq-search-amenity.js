//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "AMENITY_SEARCH_URL", "http://place.parq.ph:11000/api/@accessID/amenity/search" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "AMENITY_SEARCH_URL", "https://place.parq.ph:11000/api/@accessID/amenity/search" );
}
@end-administrator-production-mode */

PubSub.subscribe( "search-amenity",
	function onSearchAmenity( value, handler ){
		handler = handler || function handler( ){ };

		qwest
			.post( AMENITY_SEARCH_URL, { "value": value }, QWEST_OPTION )
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