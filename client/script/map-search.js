//: @administrator-mode:
( function module( ){
	var mapSearch = function mapSearch( container ){
		if( !( "google" in window ) ){
			return;
		}

		var searchInput = new google.maps.places.Autocomplete( container[ 0 ], { "types": [ "geocode" ] } );
		
		google.maps.event.addListener( searchInput, "place_changed",
			function onPlaceChanged( ){
				PubSub.publish( container.attr( "data-handler" ),
					container.attr( "data-reference" ), 
					searchInput.getPlace( ).formatted_address );
			} );

		PubSub.subscribe( container.attr( "data-handler" ),
			function onSearchOverride( reference, address ){
				if( reference == container.attr( "data-reference" ) &&
					searchInput.getPlace( ).formatted_address != address )
				{
					container.val( address );

					( new google.maps.Geocoder( ) )
						.geocode( { "address": address }, function onResult( result, status ){
							if( status == google.maps.GeocoderStatus.OK ){
								container.val( result[ 0 ].formatted_address );

							}else{
								PubSub.publish( "notify", "error", new Error( "cannot get address" ) );
							}
						} );
				}
			} );

		PubSub.subscribe( "clear-map-search",
			function onClearMapSearch( reference ){
				if( reference == container.attr( "data-reference" ) ){
					container.val( "" );
				}
			} );
	};

	$( "[data-map-search]" )
		.ready( function onReady( ){
			$( "[data-map-search]" )
				.each( function onEachMapInput( ){
					mapSearch( $( this ) );
				} );
		} );
} )( );
//: @end-administrator-mode

