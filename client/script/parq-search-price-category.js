//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "PRICE_CATEGORY_SEARCH_URL", "http://price.parq.ph:18000/api/@accessID/price/category/search" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "PRICE_CATEGORY_SEARCH_URL", "https://price.parq.ph:18000/api/@accessID/price/category/search" );
}
@end-administrator-production-mode */

PubSub.subscribe( "search-price-category",
	function onSearchPriceCategory( value, handler ){
		handler = handler || function handler( ){ };

		qwest
			.post( PRICE_CATEGORY_SEARCH_URL, { "value": value }, QWEST_OPTION )
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