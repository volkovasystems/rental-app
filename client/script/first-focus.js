( function module( ){
	var firstFocus = function firstFocus( container ){
		container.data( "first-focus-component", true );

		var timeout = setTimeout( function onTimeout( ){
			container.focus( );

			clearTimeout( timeout );
		}, 0 );

		handleDOMChange( container.parents( "[data-first-focus-indicator]" ), 
			function onDOMChangeFirstFocus( ){
				if( _.isEmpty( container.val( ) ) &&
					container.attr( "data-first-focus" ) == "true" )
				{
					container.focus( );
				}
			} );
	};

	var bindFirstFocus = function bindFirstFocus( ){
		$( "[data-first-focus]" )
			.each( function onEachFirstFocus( ){
				var container = $( this );

				if( !container.data( "first-focus-component" ) ){
					firstFocus( container );
				}
			} );
	};

	PubSub.subscribe( "dom-changed",
		function onDOMChangedFirstFocus( ){
			bindFirstFocus( );
		} );

	$( "[data-first-focus]" )
		.ready( function onReady( ){
			bindFirstFocus( );
		} );
} )( );
