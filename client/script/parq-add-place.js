//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "PLACE_ADD_URL", "http://place.parq.ph:11000/api/@accessID/place/add" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "PLACE_ADD_URL", "https://place.parq.ph:11000/api/@accessID/place/add" );
}
@end-administrator-production-mode */

PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "add-place" ){
			PubSub.publish( "show-add-place" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "show-add-place",
	function onShowAddPlace( ){
		var timeout = setTimeout( function onTimeout( ){
			PubSub.publish( "regenerate-map-input", "add-place" );

			clearTimeout( timeout );
		}, 500 );

		PubSub.publish( "get-amenities",
			function onResult( error, amenities ){
				if( error ){
					PubSub.publish( "notify", "error", error );

				}else if( _.isEmpty( amenities ) ){
					PubSub.publish( "notify", "failure", "no amenities retreived" );

				}else{
					PubSub.publish( "set-add-place-amenities", amenities );
				}

				console.debug( "add-place", error, amenities );
			} );
	} );

PubSub.subscribe( "close-add-place",
	function onCloseAddPlace( ){
		PubSub.publish( "show-headbar" );
	} );

PubSub.subscribe( "map-place-search",
	function onSearchOverride( reference, address ){
		if( reference == "add-place" ){
			( new google.maps.Geocoder( ) )
				.geocode( { "address": address }, function onResult( result, status ){
					if( status == google.maps.GeocoderStatus.OK ){
						var location = result[ 0 ].geometry.location;

						PubSub.publish( "regenerate-map-input", "add-place", {
							"latitude": location.lat( ),
							"longitude": location.lng( )
						} );

					}else{
						PubSub.publish( "notify", "error", new Error( "cannot get address" ) );
					}
				} );
		}
	} );

PubSub.subscribe( "tags-place-amenities",
	function onTagsPlaceAmenities( reference, amenities ){
		if( reference == "add-place" &&
			amenities instanceof Array )
		{
			PubSub.publish( "set-add-place-input-amenities", "add-place", amenities );
		}
	} );

PubSub.subscribe( "tags-place-amenities",
	function onTagsPlaceAmenities( reference, callback ){
		if( reference == "add-place" &&
			typeof callback == "function"  )
		{
			PubSub.publish( "get-amenities",
				function onGetAmenities( error, amenities ){
					if( error ){
						callback( );

					}else{
						callback( amenities
							.map( function onEachAmenity( amenity ){
								return amenity.name;
							} ) );
					}
				} );
		}
	} );

PubSub.subscribe( "cancel-add-place",
	function onCancelAddPlace( ){
		PubSub.publish( "clear-map-input", "add-place" );

		PubSub.publish( "clear-map-search", "add-place" );

		PubSub.publish( "clear-tags-input", "add-place" );
	} );

PubSub.subscribe( "add-place",
	function onAddPlace( place, callback ){
		qwest
			.post( PLACE_ADD_URL, {
				"name": place.name,
				"title": place.title,
				"description": place.description,
				"address": place.address,

				"latitude": place.latitude,
				"longitude": place.longitude,
				"zoom": place.zoom,

				"amenities": place.amenities,
				"images": place.images,
				"instructions": place.instructions,
				"rate": place.rate
			}, QWEST_OPTION )
			.then( function onResponse( result ){
				if( result.status == "success" ){
					PubSub.publish( "notify", "success", "place successfully added", "add place" );

					callback( null, result );
				
				}else{
					PubSub.publish( "notify", "failure", "place category failed", "add place" );

					callback( null, false );
				}

				console.debug( "add-place", result );
			} )
			.catch( function onError( error ){
				PubSub.publish( "notify", "error", this.response.data );

				console.debug( "add-place", error, this );

				callback( error );
			} );

		PubSub.publish( "clear-map-input", "add-place" );

		PubSub.publish( "clear-map-search", "add-place" );

		PubSub.publish( "clear-tags-input", "add-place" );
	} );
//: @end-administrator-mode