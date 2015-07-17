//: @administrator-mode:
var ManagePlaces = React.createClass( {
	"statics": {
		"bindElement": function bindElement( element ){
			if( element.data( "manage-places-component" ) ){
				return;
			}

			var managePlacesElement = element;

			managePlacesElement.data( "manage-places-component", true );

			var managePlacesComponent = <ManagePlaces component={ managePlacesElement } />

			React.render( managePlacesComponent, managePlacesElement[ 0 ] );
		},

		"attachElement": function attachElement( ){
			$( "[manage-places]" ).each( function onEachManagePlaces( ){
				ManagePlaces.bindElement( $( this ) );
			} );
		},

		"load": function load( ){
			$( "[manage-places]" ).ready( function onReady( ){
				ManagePlaces.attachElement( );
			} );

			PubSub.subscribe( "dom-changed",
				function onDOMChangedManagePlaces( ){
					ManagePlaces.attachElement( );
				} );
		}
	},

	"onOpenAddPlace": function onOpenAddPlace( ){
		
	},

	"onOpenAddPark": function onOpenAddPark( ){

	},

	"onOpenAddSlot": function onOpenAddSlot( ){

	},

	"onOpenAddPrice": function onOpenAddPrice( ){

	},

	"onCloseAddPlace": function onCloseAddPlace( ){

	},

	"onCloseAddPark": function onCloseAddPark( ){

	},

	"onCloseAddSlot": function onCloseAddSlot( ){

	},

	"onCloseAddPrice": function onCloseAddPrice( ){

	},

	"onAddPlace": function onAddPlace( place ){

	},

	"onAddPark": function onAddPark( park ){

	},

	"onAddSlot": function onAddSlot( slot ){

	},

	"onAddPrice": function onAddPrice( price ){

	},
	
	"onClose": function onClose( ){
		PubSub.publish( "close-manage-places" );
	},

	"showDashformBar": function showDashformBar( ){
		$( "[data-dashformbar]", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hideDashformBar": function hideDashformBar( ){
		$( "[data-dashformbar]", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"showManagePlaces": function showManagePlaces( ){
		$( "[data-page]", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hideManagePlaces": function hideManagePlaces( ){
		$( "[data-page]", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"clearManagePlacesData": function clearManagePlacesData( ){
		
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
			
		};
	},

	"render": function onRender( ){
		return; //: @template: template/manage-places.html
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		if( prevState.title != this.state.title ){
			this.setState( {
				"name": S( this.state.title.toLowerCase( ) ).dasherize( ).toString( )
			} );
		}
	},

	"componentDidMount": function componentDidMount( ){
		PubSub.subscribe( "close-manage-places",
			( function onCloseManagePlaces( ){
				this.hideManagePlaces( );

				this.clearManagePlacesData( );
			} ).bind( this ) );

		PubSub.subscribe( "show-manage-places",
			( function onShowManagePlaces( control ){
				this.showManagePlaces( );
			} ).bind( this ) );

		PubSub.subscribe( "show-manage-places-dashformbar",
			( function onShowManagePlacesDashformBar( ){
				this.showDashformBar( );
			} ).bind( this ) );

		PubSub.subscribe( "hide-manage-places-dashformbar",
			( function onHideManagePlacesDashformBar( ){
				this.hideDashformBar( );
			} ).bind( this ) );

		this.hideManagePlaces( );
	}
} );

ManagePlaces.load( );
//: @end-administrator-mode