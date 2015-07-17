( function module( ){
	var updateCoordinate = function updateCoordinate( container ){
		var latitude = container.attr( "data-latitude" );
		var longitude = container.attr( "data-longitude" );

		if( !( latitude && longitude ) ){
			return;
		}

		$( "[data-info]", container ).html( [ latitude, longitude ].join( ", " ) );
	};

	var mapCoordinate = function mapCoordinate( container ){
		PubSub.subscribe( container.attr( "data-handler" ),
			function onCoordinateChanged( reference ){
				if( reference == container.attr( "data-reference" ) ){
					updateCoordinate( container );
				}
			} );	
	};

	$( "[data-map-coordinate]" )
		.ready( function onReady( ){
			$( "[data-map-coordinate]" )
				.each( function onEachMapCoordinate( ){
					mapCoordinate( $( this ) );
				} );
		} );
} )( );

