//: @administrator-mode:
var EditPlace = React.createClass( {
	"statics": {
		"bindElement": function bindElement( element ){
			if( element.data( "edit-place-component" ) ){
				return;
			}

			var editPlaceElement = element;

			editPlaceElement.data( "edit-place-component", true );

			var editPlaceComponent = <EditPlace component={ editPlaceElement } />

			React.render( editPlaceComponent, editPlaceElement[ 0 ] );
		},

		"attachElement": function attachElement( ){
			$( "[edit-place]" ).each( function onEachEditPlace( ){
				EditPlace.bindElement( $( this ) );
			} );
		},

		"load": function load( ){
			$( "[edit-place]" ).ready( function onReady( ){
				EditPlace.attachElement( );
			} );

			PubSub.subscribe( "dom-changed",
				function onDOMChangedEditPlace( ){
					EditPlace.attachElement( );
				} );
		}
	},

	"referenceHeight": "body",

	"place": "",
	"places": [ ],
	"selectedPlace": { },

	"searchPlace": function searchPlace( event ){

	},

	"onSelectPlace": function onSelectPlace( event ){
		var place = $( event.currentTarget ).attr( "data-place" );

		place = _.find( this.places,
			function onEachPlace( placeData ){
				return placeData.referenceID == place;
			} );

		if( this.selectedPlace.referenceID == place.referenceID ){
			this.selectedPlace = { },
			
			this.place = "",

			this.clearEditPlaceData( );

			return;
		}

		this.selectedPlace = place;

		this.place = place.title;

		this.setState( {
			"referenceID": place.referenceID,
			
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
		} );
	},

	"onEachPlace": function onEachPlace( place ){
		var isSelected = "none";
		if( this.selectedPlace.referenceID == place.referenceID ){
			isSelected = "selected";
		}

		return; //: @template: template/place-selection.html
	},

	"addImage": function addImage( ){
		var imageURLInput = $( "[data-media-url-input]", this.getDOMNode( ) );
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

	"onEditPlace": function onEditPlace( ){
		PubSub.publish( "edit-place", _.clone( this.state, true ) );
		
		PubSub.publish( "close-edit-place" );

		this.clearEditPlaceData( );
	},

	"onCancel": function onCancel( ){
		PubSub.publish( "cancel-edit-place" );
	},

	"showEditPlaceFormGroup": function showEditPlaceFormGroup( ){
		$( "[data-form-group='place-edit-form']", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hideEditPlaceFormGroup": function hideEditPlaceFormGroup( ){
		$( "[data-form-group='place-edit-form']", this.props.component )
			.removeClass( "shown" )
			.addClass( "hidden" );
	},

	"showEditPlace": function showEditPlace( ){
		$( "[data-page]", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hideEditPlace": function hideEditPlace( ){
		$( "[data-page]", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"showPreviewForMapInput": function showPreviewForMapInput( ){
		$( "[data-preview-for='map-input']", this.getDOMNode( ) )
			.addClass( "shown" )
			.removeClass( "hidden" );
	},

	"hidePreviewForMapInput": function hidePreviewForMapInput( ){
		$( "[data-preview-for='map-input']", this.getDOMNode( ) )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"clearEditPlaceData": function clearEditPlaceData( ){
		this.setState( this.getInitialState( ) );

		this.hidePreviewForMapInput( );
	},

	"onChange": function onChange( event ){
		var state = { };

		state[ event.target.name ] = event.target.value;

		this.setState( state );
	},

	"getDefaultProps": function getDefaultProps( ){
		return {
			"component": null,
			"isEmbedded": false,
			"handler": function handler( ){ }
		};
	},

	"getInitialState": function getInitialState( ){
		return {
			"referenceID": "",
			"name": "",
			"title": "",
			"description": "",
			"address": "",

			"latitude": 0,
			"longitude": 0,
			"zoom": 0,

			"amenities": [ ],
			"images": [ ],
			"instructions": "",
			"rate": ""
		};
	},

	"componentWillMount": function componentWillMount( ){
		if( this.props.isEmbedded ){
			this.referenceHeight = "@parent";

			this.forceUpdate( );
		}
	},

	"render": function onRender( ){
		return; //: @template: template/edit-place.html
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		if( prevState.latitude != this.state.latitude ||
			prevState.longitude != this.state.longitude ||
			prevState.zoom != this.state.zoom )
		{
			PubSub.publish( "map-data-changed" );

			this.showPreviewForMapInput( );
		}

		if( prevState.title != this.state.title ){
			this.setState( {
				"name": S( this.state.title.toLowerCase( ) ).dasherize( ).toString( )
			} );
		}

		if( this.state.referenceID ){
			this.showEditPlaceFormGroup( );

		}else{
			this.hideEditPlaceFormGroup( );
		}
	},

	"componentDidMount": function componentDidMount( ){
		PubSub.subscribe( "close-edit-place",
			( function onCloseEditPlace( ){
				this.hideEditPlace( );
			} ).bind( this ) );		

		PubSub.subscribe( "cancel-edit-place",
			( function onCancelEditPlace( ){
				PubSub.publish( "close-edit-place" );

				this.clearEditPlaceData( );
			} ).bind( this ) );

		PubSub.subscribe( "show-edit-place",
			( function onShowEditPlace( control ){
				this.showEditPlace( );
			} ).bind( this ) );

		PubSub.subscribe( "map-place-location",
			( function onMapPlaceLocation( reference, location, maximumZoom, minimumZoom, zoom ){
				if( reference == "edit-place" ){
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

		if( !( this.state.latitude &&
			this.state.longitude &&
			this.state.zoom ) )
		{
			this.hidePreviewForMapInput( );
		}

		PubSub.subscribe( "set-edit-place-amenities",
			( function onSetEditPlaceAmenities( amenities ){
				this.amenities = amenities;

				this.forceUpdate( );
			} ).bind( this ) );

		/*:
			This is for setting the user defined amenities.
		*/
		PubSub.subscribe( "set-amenities",
			( function onSetAmenities( amenities ){
				this.setState( {
					"amenities": amenities
				} );
			} ).bind( this ) );

		PubSub.subscribe( "set-edit-place-list",
			( function onSetEditPlaceList( places ){
				this.places = places

				this.forceUpdate( );
			} ).bind( this ) );

		this.hideEditPlace( );

		this.hideEditPlaceFormGroup( );
	}
} );


EditPlace.load( );
//: @end-administrator-mode