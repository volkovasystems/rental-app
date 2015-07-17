//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "PRICE_CATEGORY_GET_ALL_URL", "http://price.parq.ph:18000/api/@accessID/price/category/all" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "PRICE_CATEGORY_GET_ALL_URL", "https://price.parq.ph:18000/api/@accessID/price/category/all" );
}
@end-administrator-production-mode */

PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "view-price-categories" ){
			PubSub.publish( "show-view-price-categories" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "show-view-price-categories",
	function onShowViewPriceCategories( ){
		PubSub.publish( "get-price-categories",
			function onResult( error, priceCategories ){
				if( error ){
					PubSub.publish( "notify", "error", error );

				}else if( _.isEmpty( priceCategories ) ){
					PubSub.publish( "notify", "info", "no price categories retreived" );

				}else{
					PubSub.publish( "set-view-price-categories", priceCategories );
				}
			} );
	} );

PubSub.subscribe( "close-view-price-categories",
	function onCloseViewPriceCategories( ){
		PubSub.publish( "show-headbar" );
	} );

PubSub.subscribe( "get-price-categories",
	function onGetPriceCategories( handler ){
		handler = handler || function handler( ){ };

		qwest
			.get( PRICE_CATEGORY_GET_ALL_URL, null, QWEST_OPTION )
			.then( function onResponse( result ){
				if( result.status == "success" ){
					handler( null, result.data );

				}else{
					handler( null, [ ] );
				}

				console.debug( "view-price-categories", result );
			} )
			.catch( function onError( error ){
				handler( error );

				console.debug( "view-price-categories", error );
			} );
	} );

//: @end-administrator-mode