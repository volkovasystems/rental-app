PubSub.subscribe( "right-headbar-control-clicked",
	function onRightHeadbarControlClicked( reference ){
		if( reference == "opbar" ){
			PubSub.publish( "show-opbar" );

			PubSub.publish( "hide-right-headbar-control" );
		}
	} );

PubSub.subscribe( "close-opbar",
	function onCloseOpbar( ){
		PubSub.publish( "show-right-headbar-control" );
	} );