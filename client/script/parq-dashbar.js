PubSub.subscribe( "left-headbar-control-clicked",
	function onLeftHeadbarControlClicked( reference ){
		if( reference == "dashbar" ){
			PubSub.publish( "show-dashbar" );

			PubSub.publish( "hide-left-headbar-control" );
		}
	} );

PubSub.subscribe( "close-dashbar",
	function onCloseDashbar( ){
		PubSub.publish( "show-left-headbar-control" );
	} );