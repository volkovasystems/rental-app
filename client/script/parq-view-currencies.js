//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "CURRENCY_GET_ALL_URL", "http://price.parq.ph:18000/api/@accessID/currency/all" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "CURRENCY_GET_ALL_URL", "https://price.parq.ph:18000/api/@accessID/currency/all" );
}
@end-administrator-production-mode */

PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "view-currencies" ){
			PubSub.publish( "show-view-currencies" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "show-view-currencies",
	function onShowViewCurrencies( ){
		PubSub.publish( "get-currencies",
			function onResult( error, currencies ){
				if( error ){
					PubSub.publish( "notify", "error", error );

				}else if( _.isEmpty( currencies ) ){
					PubSub.publish( "notify", "info", "no currencies retreived" );

				}else{
					PubSub.publish( "set-view-currencies", currencies );
				}
			} );
	} );

PubSub.subscribe( "close-view-currencies",
	function onCloseViewCurrencies( ){
		PubSub.publish( "show-headbar" );
	} );

PubSub.subscribe( "get-currencies",
	function onGetCurrencies( handler ){
		handler = handler || function handler( ){ };

		qwest
			.get( CURRENCY_GET_ALL_URL, null, QWEST_OPTION )
			.then( function onResponse( result ){
				if( result.status == "success" ){
					handler( null, result.data );

				}else{
					handler( null, [ ] );
				}

				console.debug( "view-currencies", result );
			} )
			.catch( function onError( error ){
				handler( error );

				console.debug( "view-currencies", error );
			} );
	} );

//: @end-administrator-mode