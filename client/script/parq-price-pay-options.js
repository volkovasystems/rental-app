//: @administrator-mode:
/*: @development-mode:
if( development ){
	setURL( "PRICE_PAY_OPTION_GET_ALL_URL", "http://price.parq.ph:18000/api/@accessID/price/pay/option/all" );
}
@end-development-mode */

/*: @production-mode:
if( production ){
	setURL( "PRICE_PAY_OPTION_GET_ALL_URL", "https://price.parq.ph:18000/api/@accessID/price/pay/option/all" );
}
@end-production-mode */

PubSub.subscribe( "get-price-pay-options",
	function onGetPricePayOptions( handler ){
		handler = handler || function handler( ){ };

		qwest
			.get( PRICE_PAY_OPTION_GET_ALL_URL, null, QWEST_OPTION )
			.then( function onResponse( result ){
				if( result.status == "success" ){
					handler( null, result.data );

				}else{
					handler( null, 0 );
				}

				console.debug( "price-pay-options", result );
			} )
			.catch( function onError( error ){
				handler( error );

				console.debug( "price-pay-options", error );
			} );
	} );

//: @end-administrator-mode