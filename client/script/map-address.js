( function module( ){
	var getMapAddress = function getMapAddress( container ){
		if( !( "google" in window ) ){
			return;
		}
		
		var latitude = parseFloat( container.attr( "data-latitude" ) );
		var longitude = parseFloat( container.attr( "data-longitude" ) );

		( new google.maps.Geocoder( ) )
			.geocode( {
				"location": new google.maps.LatLng( latitude, longitude )
			}, function onResult( result, status ){
				if( status == google.maps.GeocoderStatus.OK ){
					$( "[data-info]", container ).html( result[ 0 ].formatted_address );

				}else{
					console.debug( "map-address", new Error( "cannot get address" ), result, status );
				}
			} );
	};

	var mapAddress = function mapAddress( container ){
		PubSub.subscribe( container.attr( "data-handler" ),
			function onAddressChanged( reference ){
				if( reference == container.attr( "data-reference" ) ){
					getMapAddress( container );
				}
			} );
	};

	$( "[data-map-address]" )
		.ready( function onReady( ){
			$( "[data-map-address]" )
				.each( function onEachMapAddress( ){
					mapAddress( $( this ) );
				} );
		} );
} )( );

