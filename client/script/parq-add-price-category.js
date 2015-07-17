//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "PRICE_CATEGORY_ADD_URL", "http://price.parq.ph:18000/api/@accessID/price/category/add" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "PRICE_CATEGORY_ADD_URL", "https://price.parq.ph:18000/api/@accessID/price/category/add" );
}
@end-administrator-production-mode */

PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "add-price-category" ){
			PubSub.publish( "show-add-price-category" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "close-add-price-category",
	function onCloseAddPriceCategory( ){
		PubSub.publish( "show-headbar" );
	} );

PubSub.subscribe( "add-price-category",
	function onAddPriceCategory( priceCategory ){
		qwest
			.post( PRICE_CATEGORY_ADD_URL, {
				"name": priceCategory.name,
				"title": priceCategory.title,
				"description": priceCategory.description
			}, QWEST_OPTION )

			.then( function onResponse( result ){
				if( result.status == "success" ){
					PubSub.publish( "notify", "success", "price category successfully added", "add price category" );	
				
				}else{
					PubSub.publish( "notify", "failure", "adding price category failed", "add price category" );
				}
				
				console.debug( "add-price-category", result );
			} )

			.catch( function onError( error ){
				PubSub.publish( "notify", "error", this.response.data );

				console.debug( "add-price-category", error, this );
			} );
	} );
//: @end-administrator-mode