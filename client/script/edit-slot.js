//: @administrator-mode:
var EditSlot = React.createClass( {
	"statics": {
		"bindElement": function bindElement( element ){
			if( element.data( "edit-slot-component" ) ){
				return;
			}

			var editSlotElement = element;

			editSlotElement.data( "edit-slot-component", true );

			var editSlotComponent = <EditSlot component={ editSlotElement } />

			React.render( editSlotComponent, editSlotElement[ 0 ] );
		},

		"attachElement": function attachElement( ){
			$( "[edit-slot]" ).each( function onEachEditSlot( ){
				EditSlot.bindElement( $( this ) );
			} );
		},

		"load": function load( ){
			$( "[edit-slot]" ).ready( function onReady( ){
				EditSlot.attachElement( );
			} );

			PubSub.subscribe( "dom-changed",
				function onDOMChangedEditSlot( ){
					EditSlot.attachElement( );
				} );
		}
	},

	"referenceHeight": "body",

	"slot": "",
	"slots": [ ],
	"selectedSlot": { },

	"status": "",
	"slotStatus": [ ],
	"selectedSlotStatus": { },

	"park": "",
	"parks": [ ],
	"selectedPark": { },

	"place": "",
	"places": [ ],
	"selectedPlace": { },

	"searchSlot": function searchSlot( event ){

	},

	"onSelectSlot": function onSelectSlot( event ){
		var slot = $( event.currentTarget ).attr( "data-slot" );

		slot = _.find( this.slot,
			function onEachSlot( slotData ){
				return slotData.referenceID == slot;
			} );

		if( this.selectedSlot.referenceID == slot.referenceID ){
			this.selectedSlot = { },
			
			this.slot = "",

			this.clearEditSlotData( );

			return;
		}

		this.selectedSlot = slot;

		this.slot = slot.title;

		this.setState( {
			"referenceID": slot.referenceID,
			"title": slot.title,
			"name": slot.name,
			"description": slot.description,
			"status": slot.status,
			"place": slot.place,
			"park": slot.park
		} );
	},

	"onEachSlot": function onEachSlot( slot ){
		var isSelected = "none";
		if( this.selectedSlot.referenceID == slot.referenceID ){
			isSelected = "selected";
		}

		return; //: @template: template/slot-selection.html
	},

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

			this.setState( {
				"park": ""
			} );

			return;
		}

		this.selectedPark = park;

		this.park = park.title;

		this.setState( {
			"park": park.referenceID
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

	"onSelectSlotStatus": function onSelectSlotStatus( event ){
		var slotStatus = $( event.currentTarget ).attr( "data-slot-status" );

		slotStatus = _.find( this.slotStatus,
			function onEachPark( slotStatusData ){
				return slotStatusData.name == slotStatus;
			} );

		if( this.selectedSlotStatus.name == slotStatus.name ){
			this.selectedSlotStatus = { },
			
			this.status = "",

			this.setState( {
				"status": ""
			} );

			return;
		}

		this.selectedSlotStatus = slotStatus;

		this.status = slotStatus.title;

		this.setState( {
			"status": slotStatus.name
		} );
	},

	"onEachSlotStatus": function onEachSlotStatus( slotStatus ){
		var isSelected = "none";
		if( this.selectedSlotStatus.name == slotStatus.name ){
			isSelected = "selected";
		}

		return; //: @template: template/slot-status-selection.html
	},

	"onEditSlot": function onEditSlot( ){
		PubSub.publish( "edit-slot", _.clone( this.state, true ),
			( function onResult( ){
				if( result ){
					this.props.handler( this.state );	
				}
			} ).bind( this ) );
		
		PubSub.publish( "close-edit-slot" );

		this.clearEditSlotData( );
	},

	"onCancel": function onCancel( ){
		PubSub.publish( "cancel-edit-slot" );
	},

	"showEditSlot": function showEditSlot( ){
		$( "[data-page]", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" )
	},

	"hideEditSlot": function hideEditSlot( ){
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

	"clearEditSlotData": function clearEditSlotData( ){
		this.park = "";
		this.selectedPark = { };

		this.place = "";
		this.selectedPlace = { };

		this.status = "";
		this.selectedSlotStatus = { };

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
			"status": "",
			"place": "",
			"park": ""
		};
	},

	"componentWillMount": function componentWillMount( ){
		if( this.props.isEmbedded ){
			this.referenceHeight = "@parent";

			this.forceUpdate( );
		}
	},

	"render": function onRender( ){
		return; //: @template: template/edit-slot.html
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
			$( "[data-edit-slot]", this.getDOMNode( ) )
				.css( {
					"width": "100%"
				} );
		
			this.hideCancelControl( );
		
		}else{
			this.showCancelControl( );
		}

		PubSub.subscribe( "close-edit-slot",
			( function onCloseEditSlot( ){
				this.hideEditSlot( );
			} ).bind( this ) );		

		PubSub.subscribe( "cancel-edit-slot",
			( function onCancelEditSlot( ){
				PubSub.publish( "close-edit-slot" );

				this.clearEditSlotData( );
			} ).bind( this ) );

		PubSub.subscribe( "show-edit-slot",
			( function onShowEditSlot( control ){
				this.showEditSlot( );
			} ).bind( this ) );

		PubSub.subscribe( "set-edit-slot-parks",
			( function onSetEditSlotParks( parks ){
				this.parks = parks;

				this.forceUpdate( );
			} ).bind( this ) );

		PubSub.subscribe( "set-edit-slot-places",
			( function onSetEditSlotPlaces( places ){
				this.places = places;

				this.forceUpdate( );
			} ).bind( this ) );

		PubSub.subscribe( "set-edit-slot-status",
			( function onSetEditSlotStatus( slotStatus ){
				this.slotStatus = slotStatus;

				this.forceUpdate( );
			} ).bind( this ) );

		this.hideEditSlot( );
	}
} );

EditSlot.load( );
//: @end-administrator-mode