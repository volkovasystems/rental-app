( function module( ){
	var toggleSwitch = function toggleSwitch( container ){
		container.data( "toggle-switch-component", true );

		

	};

	var bindToggleSwitch = function bindToggleSwitch( ){
		$( "[data-toggle-switch]" )
			.each( function onEachToggleSwitch( ){
				if( !$( this ).data( "toggle-switch-component" ) ){
					toggleSwitch( $( this ) );
				}
			} );
	};

	PubSub.subscribe( "dom-changed",
		function onDOMChangedToggleSwitch( ){
			bindToggleSwitch( );
		} );

	$( "[data-toggle-switch]" )
		.ready( function onReady( ){
			bindToggleSwitch( );
		} );

} )( );