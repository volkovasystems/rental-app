//: @administrator-mode:


PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "manage-places" ){
			PubSub.publish( "show-manage-places" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "show-manage-places",
	function onShowManagePlaces( ){
		
	} );

PubSub.subscribe( "close-manage-places",
	function onCloseManagePlaces( ){
		PubSub.publish( "show-headbar" );
	} );

//: @end-administrator-mode