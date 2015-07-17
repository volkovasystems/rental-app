( function module( ){
	var getMaximumZoom = function getMaximumZoom( location, callback ){
		( new google.maps.MaxZoomService( ) )
			.getMaxZoomAtLatLng( new google.maps.LatLng( location.latitude, location.longitude ),
				function onResult( result ){
					if( result.status === google.maps.MaxZoomStatus.ERROR ){
						callback( new Error( "problem contacting google servers" ), DEFAULT_MAXIMUM_ZOOM );

					}else{
						callback( null, result.zoom );
					}
				} );
	};

	var defaultMapLocation = function defaultMapLocation( element ){
		var handler = element.attr( "data-handler" );
		var reference = element.attr( "data-reference" );

		if( navigator.geolocation ){
			navigator.geolocation
				.getCurrentPosition( function onCurrentPosition( position ){
					var location = {
						"latitude": position.coords.latitude,
						"longitude": position.coords.longitude
					};

					getMaximumZoom( location,
						function onResult( error, maximumZoom ){
							if( error ){
								console.debug( "default-map-location", error );
							}

							PubSub.publish( handler, reference, location, maximumZoom );	
						} );
				} );

		}else{
			var location = {
				"latitude": DEFAULT_LATITUDE,
				"longitude": DEFAULT_LONGITUDE
			};

			getMaximumZoom( location,
				function onResult( error, maximumZoom ){
					if( error ){
						console.debug( "default-map-location", error );
					}
					
					PubSub.publish( handler, reference, location, maximumZoom );		
				} );
		}
	};

	$( "[data-default-map-location]" )
		.ready( function onReady( ){
			$( "[data-default-map-location]" )
				.each( function onEachDefaultMapLocation( ){
					defaultMapLocation( $( this ) );
				} );
		} );
} )( );

