//: @administrator-mode:
/*: @administrator-development-mode:
if( development ){
	setURL( "PLACE_UPDATE_URL", "http://place.parq.ph:11000/api/@accessID/place/update/@referenceID" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "PLACE_UPDATE_URL", "https://place.parq.ph:11000/api/@accessID/place/update/@referenceID" );
}
@end-administrator-production-mode */

PubSub.subscribe( "dash-item-clicked",
	function onDashItemClicked( reference ){
		if( reference == "edit-place" ){
			PubSub.publish( "show-edit-place" );

			PubSub.publish( "close-dashbar" );

			PubSub.publish( "close-headbar" );
		}
	} );

PubSub.subscribe( "show-edit-place",
	function onShowEditPlace( ){
		var timeout = setTimeout( function onTimeout( ){
			PubSub.publish( "regenerate-map-input", "edit-place" );

			clearTimeout( timeout );
		}, 500 );

		PubSub.publish( "get-amenities",
			function onResult( error, amenities ){
				if( error ){
					PubSub.publish( "notify", "error", error );

				}else if( _.isEmpty( amenities ) ){
					PubSub.publish( "notify", "failure", "no amenities retreived" );

				}else{
					PubSub.publish( "set-edit-place-amenities", amenities );
				}

				console.debug( "edit-place", error, amenities );
			} );

		PubSub.publish( "get-places",
			function onResult( error, places ){
				if( error ){
					PubSub.publish( "notify", "error", error );

				}else if( _.isEmpty( places ) ){
					PubSub.publish( "notify", "failure", "no places retreived" );

				}else{
					PubSub.publish( "set-edit-place-list", places );
				}

				console.debug( "edit-place", error, places );
			} );
	} );

PubSub.subscribe( "close-edit-place",
	function onCloseEditPlace( ){
		PubSub.publish( "show-headbar" );
	} );

PubSub.subscribe( "map-data-changed",
	function onMapDataChanged( ){
		PubSub.publish( "map-place-address", "edit-place" );

		PubSub.publish( "map-place-coordinate", "edit-place" );
	} );

PubSub.subscribe( "map-place-search",
	function onSearchOverride( reference, address ){
		if( reference == "edit-place" ){
			( new google.maps.Geocoder( ) )
				.geocode( { "address": address }, function onResult( result, status ){
					if( status == google.maps.GeocoderStatus.OK ){
						var location = result[ 0 ].geometry.location;

						PubSub.publish( "regenerate-map-input", "edit-place", {
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
		if( reference == "edit-place" &&
			amenities instanceof Array )
		{
			PubSub.publish( "set-amenities", amenities );
		}
	} );

PubSub.subscribe( "tags-place-amenities",
	function onTagsPlaceAmenities( reference, callback ){
		if( reference == "edit-place" &&
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

PubSub.subscribe( "cancel-edit-place",
	function onCancelEditPlace( ){
		PubSub.publish( "clear-map-input", "edit-place" );

		PubSub.publish( "clear-map-search", "edit-place" );

		PubSub.publish( "clear-tags-input", "edit-place" );
	} );

PubSub.subscribe( "edit-place",
	function onEditPlace( place ){
		qwest
			.post( PLACE_UPDATE_URL
					.replace( "@referenceID", place.referenceID ), 

			{
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
					PubSub.publish( "notify", "success", "place successfully updated", "edit place" );	
				
				}else{
					PubSub.publish( "notify", "failure", "place updating failed", "edit place" );
				}

				console.debug( "edit-place", result );
			} )
			.catch( function onError( error ){
				PubSub.publish( "notify", "error", error );

				console.debug( "edit-place", error );
			} );

		PubSub.publish( "clear-map-input", "edit-place" );

		PubSub.publish( "clear-map-search", "edit-place" );

		PubSub.publish( "clear-tags-input", "edit-place" );
	} );
//: @end-administrator-mode