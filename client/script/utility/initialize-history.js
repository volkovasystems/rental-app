History.Adapter
	.bind( window, "statechange",
		function onStateChange( ){ 
			var State = History.getState( );
		} );
