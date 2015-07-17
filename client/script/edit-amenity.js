//: @administrator-mode:
var EditAmenity = React.createClass( {
	"statics": {
		"load": function load( ){
			$( "section[edit-amenity]" ).ready( function onReady( ){
				var editAmenityElement = $( "section[edit-amenity]" );

				var editAmenityComponent = <EditAmenity component={ editAmenityElement } />

				React.render( editAmenityComponent, editAmenityElement[ 0 ] );
			} );
		}
	},

	"amenity": "",
	"amenities": [ ],
	"selectedAmenity": { },

	"searchAmenity": function searchAmenity( event ){

	},

	"onSelectAmenity": function onSelectAmenity( event ){
		var amenity = $( event.currentTarget ).attr( "data-amenity" );

		amenity = _.find( this.amenities,
			function onEachAmenity( amenityData ){
				return amenityData.referenceID == amenity;
			} );

		if( this.selectedAmenity.referenceID == amenity.referenceID ){
			this.selectedAmenity = { },
			
			this.amenity = "";

			this.clearEditAmenityData( );

			return;
		}

		this.selectedAmenity = amenity;

		this.amenity = amenity.title;

		this.setState( {
			"referenceID": amenity.referenceID,
			"title": amenity.title,
			"name": amenity.name,
			"description": amenity.description,
			"image": amenity.image
		} );
	},

	"onEachAmenity": function onEachAmenity( amenity ){
		var isSelected = "none";
		if( this.selectedAmenity.referenceID == amenity.referenceID ){
			isSelected = "selected";
		}

		return; //: @template: template/amenity-selection.html
	},

	"onEachImage": function onEachImage( image ){
		return; //: @template: template/image-preview-grid-item.html
	},

	"removeImage": function removeImage( event ){
		this.setState( {
			"image": ""
		} );
	},

	"onEditAmenity": function onEditAmenity( ){
		PubSub.publish( "edit-amenity", _.clone( this.state, true ) );
		
		PubSub.publish( "close-edit-amenity" );

		this.clearEditAmenityData( );
	},

	"onCancel": function onCancel( ){
		PubSub.publish( "cancel-edit-amenity" );
	},

	"showEditAmenityFormGroup": function showEditAmenityFormGroup( ){
		$( "[data-form-group='amenity-edit-form']", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hideEditAmenityFormGroup": function hideEditAmenityFormGroup( ){
		$( "[data-form-group='amenity-edit-form']", this.props.component )
			.removeClass( "shown" )
			.addClass( "hidden" );
	},

	"showEditAmenity": function showEditAmenity( ){
		$( "[data-page]", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hideEditAmenity": function hideEditAmenity( ){
		$( "[data-page]", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"clearEditAmenityData": function clearEditAmenityData( ){
		this.setState( this.getInitialState( ) );
	},

	"onChange": function onChange( event ){
		var state = { };

		state[ event.target.name ] = event.target.value;

		this.setState( state );
	},

	"getDefaultProps": function getDefaultProps( ){
		return {
			"component": null
		};
	},

	"getInitialState": function getInitialState( ){
		return {
			"referenceID": "",
			"name": "",
			"title": "",
			"description": "",
			"image": ""
		};
	},

	"render": function onRender( ){
		return; //: @template: template/edit-amenity.html
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		if( prevState.title != this.state.title ){
			this.setState( {
				"name": S( this.state.title.toLowerCase( ) ).dasherize( ).toString( )
			} );
		}

		if( this.state.referenceID ){
			this.showEditAmenityFormGroup( );

		}else{
			this.hideEditAmenityFormGroup( );
		}
	},

	"componentDidMount": function componentDidMount( ){
		PubSub.subscribe( "close-edit-amenity",
			( function onCloseEditAmenity( ){
				this.hideEditAmenity( );
			} ).bind( this ) );		

		PubSub.subscribe( "cancel-edit-amenity",
			( function onCancelEditAmenity( ){
				PubSub.publish( "close-edit-amenity" );

				this.clearEditAmenityData( );
			} ).bind( this ) );

		PubSub.subscribe( "show-edit-amenity",
			( function onShowEditAmenity( control ){
				this.showEditAmenity( );
			} ).bind( this ) );

		PubSub.subscribe( "set-edit-amenity-list",
			( function onSetEditAmenityList( amenities ){
				this.amenities = amenities

				this.forceUpdate( );
			} ).bind( this ) );

		this.hideEditAmenity( );

		this.hideEditAmenityFormGroup( );
	}
} );

EditAmenity.load( );
//: @end-administrator-mode