var AddPlaceMixin = {
	"onAddAmenity": function onAddAmenity( ){
		PubSub.publish( "add-amenity-from-add-place" );
	},

	"addImage": function addImage( ){
		var imageURLInput = $( "[data-media-url-input]", this.props.component );
		var imageURL = imageURLInput.val( );

		imageURLInput.val( "" );

		var images = _.clone( this.state.images );

		if( _.contains( images, imageURL ) ){
			PubSub.publish( "notify", "warning", "image url already added" );
			return;

		}else{
			images.push( imageURL );
		}

		this.setState( {
			"images": images
		} );
	},

	"removeImage": function removeImage( event ){
		var imageURL = $( event.currentTarget ).attr( "data-image" );

		this.setState( {
			"images": _.without( this.state.images, imageURL )
		} );
	},

	"onEachImage": function onEachImage( image ){
		return; //: @template: template/image-preview-grid-item.html
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		if( !( this.state.latitude &&
			this.state.longitude &&
			this.state.zoom ) )
		{
			this.hidePreviewForMapInput( );
		}

		if( ( prevState.latitude != this.state.latitude ||
			prevState.longitude != this.state.longitude ||
			prevState.zoom != this.state.zoom ) &&
			"google" in window )
		{
			PubSub.publish( "map-place-address", this.namespace );

			PubSub.publish( "map-place-coordinate", this.namespace );

			this.showPreviewForMapInput( );
		}
	},

	"componentDidMount": function componentDidMount( ){
		if( !( "google" in window ) ){
			this.hideFormItemLocation( );
			this.hideFormItemMapPreview( );

		}else{
			this.showFormItemLocation( );
			this.showFormItemMapPreview( );
		}

		/*:
			This is for setting the user input amenities.
		*/
		PubSub.subscribe( "set-add-place-input-amenities",
			( function onSetAddPlaceInputAmenities( reference, amenities ){
				if( reference == this.namespace ){
					this.setState( {
						"amenities": amenities
					} );	
				}
			} ).bind( this ) );

		/*:
			This is for setting the already added amenities.
		*/
		PubSub.subscribe( "set-add-place-amenities",
			( function onSetAddPlaceAmenities( reference, amenities ){
				if( reference == this.namespace ){
					this.amenities = amenities;

					this.forceUpdate( );
				}
			} ).bind( this ) );

		PubSub.subscribe( "map-place-location",
			( function onMapPlaceLocation( reference, location, maximumZoom, minimumZoom, zoom ){
				if( reference == this.namespace ){
					if( !( location &&
						location.latitude && 
						location.longitude &&
						zoom ) )
					{
						return;
					}
					
					this.setState( {
						"latitude": location.latitude,
						"longitude": location.longitude,
						"zoom": zoom
					} );
				}
			} ).bind( this ) );
	},

	"showPreviewForMapInput": function showPreviewForMapInput( ){
		$( "[data-preview-for='map-input']", this.props.component )
			.addClass( "shown" )
			.removeClass( "hidden" );
	},

	"hidePreviewForMapInput": function hidePreviewForMapInput( ){
		$( "[data-preview-for='map-input']", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"showFormItemLocation": function showFormItemLocation( ){
		$( "[data-form-item='location']", this.props.component )
			.addClass( "shown" )
			.removeClass( "hidden" );
	},

	"hideFormItemLocation": function hideFormItemLocation( ){
		$( "[data-form-item='location']", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"showFormItemMapPreview": function showFormItemMapPreview( ){
		$( "[data-form-item='map-preview']", this.props.component )
			.addClass( "shown" )
			.removeClass( "hidden" );
	},

	"hideFormItemMapPreview": function hideFormItemMapPreview( ){
		$( "[data-form-item='map-preview']", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" );
	}
};