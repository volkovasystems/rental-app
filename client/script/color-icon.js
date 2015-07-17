( function module( ){
	var colorIcon = function colorIcon( container ){
		container.data( "color-icon-component", true );

		var rgb = container.attr( "data-color" );

		container.css( {
			"background-color": "rgb(@rgb)".replace( "@rgb", rgb )
		} );
	};

	var bindColorIcon = function bindColorIcon( ){
		$( "[data-color-icon]" )
			.each( function onEachColorIcon( ){
				var container = $( this );

				if( container.data( "color-icon-component" ) ){
					return;
				}

				colorIcon( container );
			} );
	};

	PubSub.subscribe( "dom-changed",
		function onDOMChangedColorIcon( ){
			bindColorIcon( );
		} );

	$( "[data-input]" )
		.ready( function onReady( ){
			bindColorIcon( );		
		} );
} )( );
