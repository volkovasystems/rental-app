//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "PRICE_GET_ALL_URL", "http://price.parq.ph:18000/api/@accessID/price/all" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "PRICE_GET_ALL_URL", "https://price.parq.ph:18000/api/@accessID/price/all" );
}
@end-administrator-production-mode */

PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "view-prices" ){
			PubSub.publish( "show-view-prices" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "show-view-prices",
	function onShowViewPrices( ){
		PubSub.publish( "get-prices",
			function onResult( error, prices ){
				if( error ){
					PubSub.publish( "notify", "error", error );

				}else if( _.isEmpty( prices ) ){
					PubSub.publish( "notify", "info", "no prices retreived" );

				}else{
					PubSub.publish( "set-view-prices", prices );
				}
			} );
	} );

PubSub.subscribe( "close-view-prices",
	function onCloseViewPrices( ){
		PubSub.publish( "show-headbar" );
	} );

PubSub.subscribe( "get-prices",
	function onGetPrices( handler ){
		handler = handler || function handler( ){ };

		qwest
			.get( PRICE_GET_ALL_URL, null, QWEST_OPTION )
			.then( function onResponse( result ){
				if( result.status == "success" ){
					handler( null, result.data );

				}else{
					handler( null, [ ] );
				}

				console.debug( "view-prices", result );
			} )
			.catch( function onError( error ){
				handler( error );

				console.debug( "view-prices", error );
			} );
	} );

//: @end-administrator-mode