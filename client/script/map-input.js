//: @administrator-mode:
( function module( ){
	var createPointer = function createPointer( container, map ){
		if( !( "google" in window ) ){
			return;
		}

		var pointer = new google.maps.Marker( {
			"map": map,
			"draggable": true,
			"position": map.getCenter( ),
			"optimized": false
		} );

		container.data( "pointer", pointer );

		google.maps.event.addListener( pointer, "mouseup",
			function onMouseUp( ){
				var location = pointer.getPosition( );

				map.setCenter( location );

				PubSub.publish( container.attr( "data-handler" ),
					container.attr( "data-reference" ),
					{
						"latitude": location.lat( ),
						"longitude": location.lng( )
					},
					container.data( "maximumZoom" ), 
					container.data( "minimumZoom" ), 
					container.data( "zoom" ) );
			} );

		google.maps.event.addListener( map, "center_changed",
			function onCenterChanged( ){
				var timeout = setTimeout( function onTimeout( ){
					pointer.setPosition( map.getCenter( ) );

					clearTimeout( timeout );
				}, 300 );
			} );
	};

	var generateMap = function generateMap( container, location, maximumZoom, minimumZoom, zoom ){
		if( !( "google" in window ) ){
			return null;
		}

		container.empty( );

		var latitude = DEFAULT_LATITUDE;
		var longitude = DEFAULT_LONGITUDE;
		if( !_.isEmpty( location ) ){
			latitude = location.latitude;
			longitude = location.longitude;
		}

		var map = new google.maps.Map( container[ 0 ], {
			"center": new google.maps.LatLng( latitude, longitude ),
			"zoom": zoom || minimumZoom || DEFAULT_MINIMUM_ZOOM,
			"minZoom": minimumZoom || DEFAULT_MINIMUM_ZOOM,
			"maxZoom": maximumZoom || DEFAULT_MAXIMUM_ZOOM,
			"mapTypeControl": false,
			"overviewMapControl": false,
			"panControl": false,
			"streetViewControl": false,
			"scaleControl": false,
			"disableDefaultUI": true
		} );

		container.data( "map", map );
		container.data( "location", location );
		container.data( "maximumZoom", map.maxZoom );
		container.data( "minimumZoom", map.minZoom );
		container.data( "zoom", map.getZoom( ) );

		google.maps.event.addListener( map, "tilesloaded",
			function onTilesLoaded( event ){
				
			} );

		google.maps.event.addListener( map, "zoom_changed",
			function onZoomChanged( ){
				PubSub.publish( container.attr( "data-handler" ),
					container.attr( "data-reference" ),
					container.data( "location" ),
					container.data( "maximumZoom" ), 
					container.data( "minimumZoom" ), 
					map.getZoom( ) );
			} );

		google.maps.event.addListener( map, "center_changed",
			function onCenterChanged( ){
				var location = map.getCenter( );

				PubSub.publish( container.attr( "data-handler" ),
					container.attr( "data-reference" ),
					{
						"latitude": location.lat( ),
						"longitude": location.lng( )
					},
					container.data( "maximumZoom" ), 
					container.data( "minimumZoom" ), 
					container.data( "zoom" ) );
			} );

		return map;
	};

	var mapInput = function mapInput( container ){
		container.height( "250px" );

		PubSub.subscribe( container.attr( "data-handler" ),
			function onLocationChanged( reference, location, maximumZoom, minimumZoom, zoom, forceGenerate ){
				if( reference == container.attr( "data-reference" ) ){
					if( !_.isEmpty( container.data( "map" ) ) &&
						( _.isEqual( container.data( "location" ), location ) ||
						_.isEqual( container.data( "zoom" ), zoom ) ) &&
						!forceGenerate )
					{
						return;
					}

					var map = generateMap( container, location, maximumZoom, minimumZoom, zoom );

					createPointer( container, map );
				}
			} );

		PubSub.subscribe( "regenerate-map-input",
			function onRegenerateMapInput( reference, location, maximumZoom, minimumZoom, zoom ){
				if( reference == container.attr( "data-reference" ) ){
					PubSub.publish( container.attr( "data-handler" ),
						reference,
						location || container.data( "location" ),
						maximumZoom || container.data( "maximumZoom" ), 
						minimumZoom || container.data( "minimumZoom" ), 
						zoom || container.data( "zoom" ),
						true );
				}
			} );

		PubSub.subscribe( "clear-map-input",
			function onClearMapInput( reference ){
				if( reference == container.attr( "data-reference" ) ){
					PubSub.publish( container.attr( "data-handler" ), reference, null, 0, 0, 0, true );
				}
			} );
	};

	$( "[data-map-input]" )
		.ready( function onReady( ){
			$( "[data-map-input]" )
				.each( function onEachMapInput( ){
					mapInput( $( this ) );
				} );
		} );
} )( );
//: @end-administrator-mode

