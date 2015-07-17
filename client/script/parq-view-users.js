//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "USER_GET_ALL_URL", "http://user.parq.ph:9000/api/@accessID/user/all" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "USER_GET_ALL_URL", "https://user.parq.ph:9000/api/@accessID/user/all" );
}
@end-administrator-production-mode */

PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "view-users" ){
			PubSub.publish( "show-view-users" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "show-view-users",
	function onShowViewUsers( ){
		PubSub.publish( "get-users",
			function onResult( error, users ){
				if( error ){
					PubSub.publish( "notify", "error", error );

				}else if( _.isEmpty( users ) ){
					PubSub.publish( "notify", "info", "no users retreived" );

				}else{
					PubSub.publish( "set-view-users", users );
				}
			} );
	} );

PubSub.subscribe( "close-view-users",
	function onCloseViewUsers( ){
		PubSub.publish( "show-headbar" );
	} );

PubSub.subscribe( "get-users",
	function onGetUsers( handler ){
		handler = handler || function handler( ){ };

		qwest
			.get( USER_GET_ALL_URL, null, QWEST_OPTION )
			.then( function onResponse( result ){
				if( result.status == "success" ){
					handler( null, result.data );

				}else{
					handler( null, [ ] );
				}

				console.debug( "view-users", result );
			} )
			.catch( function onError( error ){
				handler( error );

				console.debug( "view-users", error );
			} );
	} );

//: @end-administrator-mode