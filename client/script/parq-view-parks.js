//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "PARK_GET_ALL_URL", "http://park.parq.ph:12000/api/@accessID/park/all" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "PARK_GET_ALL_URL", "https://park.parq.ph:12000/api/@accessID/park/all" );
}
@end-administrator-production-mode */

/*: @administrator-development-mode:
if( development ){
	setURL( "PARK_ONLY_GET_ALL_URL", "http://park.parq.ph:12000/api/@accessID/park/only/all" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "PARK_ONLY_GET_ALL_URL", "https://park.parq.ph:12000/api/@accessID/park/only/all" );
}
@end-administrator-production-mode */

PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "view-parks" ){
			PubSub.publish( "show-view-parks" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "show-view-parks",
	function onShowViewParks( ){
		PubSub.publish( "get-parks",
			function onResult( error, parks ){
				if( error ){
					PubSub.publish( "notify", "error", error );

				}else if( _.isEmpty( parks ) ){
					PubSub.publish( "notify", "info", "no parks retreived" );

				}else{
					PubSub.publish( "set-view-parks", parks );
				}
			} );
	} );

PubSub.subscribe( "close-view-parks",
	function onCloseViewParks( ){
		PubSub.publish( "show-headbar" );
	} );

PubSub.subscribe( "get-parks",
	function onGetParks( handler ){
		handler = handler || function handler( ){ };

		qwest
			.get( PARK_GET_ALL_URL, null, QWEST_OPTION )
			.then( function onResponse( result ){
				if( result.status == "success" ){
					handler( null, result.data );

				}else{
					handler( null, [ ] );
				}

				console.debug( "view-parks", result );
			} )
			.catch( function onError( error ){
				handler( error );

				console.debug( "view-parks", error );
			} );
	} );

PubSub.subscribe( "get-parks-only",
	function onGetParksOnly( handler ){
		handler = handler || function handler( ){ };

		qwest
			.get( PARK_ONLY_GET_ALL_URL, null, QWEST_OPTION )
			.then( function onResponse( result ){
				if( result.status == "success" ){
					handler( null, result.data );

				}else{
					handler( null, [ ] );
				}

				console.debug( "view-parks", result );
			} )
			.catch( function onError( error ){
				handler( error );

				console.debug( "view-parks", error );
			} );
	} );

//: @end-administrator-mode