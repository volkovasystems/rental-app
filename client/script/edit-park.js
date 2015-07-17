//: @administrator-mode:
var EditPark = React.createClass( {
	"statics": {
		"bindElement": function bindElement( element ){
			if( element.data( "edit-park-component" ) ){
				return;
			}

			var editParkElement = element;

			editParkElement.data( "edit-park-component", true );

			var editParkComponent = <EditPark component={ editParkElement } />

			React.render( editParkComponent, editParkElement[ 0 ] );
		},

		"attachElement": function attachElement( ){
			$( "[edit-park]" ).each( function onEachEditPark( ){
				EditPark.bindElement( $( this ) );
			} );
		},

		"load": function load( ){
			$( "[edit-park]" ).ready( function onReady( ){
				EditPark.attachElement( );
			} );

			PubSub.subscribe( "dom-changed",
				function onDOMChangedEditPark( ){
					EditPark.attachElement( );
				} );
		}
	},

	"referenceHeight": "body",

	"park": "",
	"parks": [ ],
	"selectedPark": { },

	"place": "",
	"places": [ ],
	"selectedPlace": { },

	"searchPark": function searchPark( event ){

	},

	"onSelectPark": function onSelectPark( event ){
		var park = $( event.currentTarget ).attr( "data-park" );

		park = _.find( this.parks,
			function onEachPark( parkData ){
				return parkData.referenceID == park;
			} );

		if( this.selectedPark.referenceID == park.referenceID ){
			this.selectedPark = { },
			
			this.park = "",

			this.clearEditParkData( );

			return;
		}

		this.selectedPark = park;

		this.park = park.title;

		this.setState( {
			"referenceID": park.referenceID,
			"title": park.title,
			"name": park.name,
			"description": park.description,
			"directions": park.directions,
			"instructions": park.instructions,
			"place": park.place,
		} );
	},

	"onEachPark": function onEachPark( park ){
		var isSelected = "none";
		if( this.selectedPark.referenceID == park.referenceID ){
			isSelected = "selected";
		}

		return; //: @template: template/park-selection.html
	},

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

			this.setState( {
				"place": ""
			} );

			return;
		}

		this.selectedPlace = place;

		this.place = place.title;

		this.setState( {
			"place": place.referenceID
		} );
	},

	"onEachPlace": function onEachPlace( place ){
		var isSelected = "none";
		if( this.selectedPlace.referenceID == place.referenceID ){
			isSelected = "selected";
		}

		return; //: @template: template/place-selection.html
	},

	"onEditPark": function onEditPark( ){
		PubSub.publish( "edit-park", _.clone( this.state, true ),
			( function onResult( ){
				if( result ){
					this.props.handler( this.state );	
				}
			} ).bind( this ) );

		PubSub.publish( "close-edit-park" );

		this.clearEditParkData( );
	},
	
	"onCancel": function onCancel( ){
		PubSub.publish( "cancel-edit-park" );
	},

	"showEditPark": function showEditPark( ){
		$( "[data-page]", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" )
	},

	"hideEditPark": function hideEditPark( ){
		$( "[data-page]", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" )
	},

	"showCancelControl": function showCancelControl( ){
		$( "[data-cancel-control]", this.getDOMNode( ) )
			.addClass( "shown" )
			.removeClass( "hidden" );
	},

	"hideCancelControl": function hideCancelControl( ){
		$( "[data-cancel-control]", this.getDOMNode( ) )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"clearEditParkData": function clearEditParkData( ){
		this.place = "";
		this.selectedPlace = { };

		this.setState( this.getInitialState( ) );
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
			"title": "",
			"name": "",
			"description": "",
			"directions": "",
			"instructions": "",
			"place": "",
		};
	},

	"componentWillMount": function componentWillMount( ){
		if( this.props.isEmbedded ){
			this.referenceHeight = "@parent";

			this.forceUpdate( );
		}
	},

	"render": function onRender( ){
		return; //: @template: template/edit-park.html
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		if( prevState.title != this.state.title ){
			this.setState( {
				"name": S( this.state.title.toLowerCase( ) ).dasherize( ).toString( )
			} );
		}
	},

	"componentDidMount": function componentDidMount( ){
		if( _.isEmpty( this.props.component ) ){
			this.props.component = $( this.getDOMNode( ) );
		}

		if( this.props.isEmbedded ){
			$( "[data-edit-park]", this.getDOMNode( ) )
				.css( {
					"width": "100%"
				} );
		
			this.hideCancelControl( );
		
		}else{
			this.showCancelControl( );
		}

		PubSub.subscribe( "close-edit-park",
			( function onCloseEditPark( ){
				this.hideEditPark( );
			} ).bind( this ) );		

		PubSub.subscribe( "cancel-edit-park",
			( function onCancelEditPark( ){
				PubSub.publish( "close-edit-park" );

				this.clearEditParkData( );
			} ).bind( this ) );

		PubSub.subscribe( "show-edit-park",
			( function onShowEditPark( control ){
				this.showEditPark( );
			} ).bind( this ) );

		PubSub.subscribe( "set-edit-park-places",
			( function onSetEditParkPlaces( places ){
				this.places = places

				this.forceUpdate( );
			} ).bind( this ) );

		this.hideEditPark( );
	}
} );


EditPark.load( );
//: @end-administrator-mode