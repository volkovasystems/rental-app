var ViewVehicles = React.createClass( {
	"statics": {
		"load": function load( ){
			$( "[view-vehicles]" ).ready( function onReady( ){
				var viewVehiclesElement = $( "[view-vehicles]" );

				var viewVehiclesComponent = <ViewVehicles component={ viewVehiclesElement } />

				React.render( viewVehiclesComponent, viewVehiclesElement[ 0 ] );
			} );
		}
	},

	"onClose": function onClose( ){
		PubSub.publish( "close-view-vehicles" );
	},

	"showViewVehicles": function showViewVehicles( ){
		$( "[data-page]", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hideViewVehicles": function hideViewVehicles( ){
		$( "[data-page]", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"clearViewVehiclesData": function clearViewVehiclesData( ){
		this.setState( this.getInitialState( ) );
	},

	"onEachVehicle": function onEachVehicle( vehicle ){
		for( var key in vehicle ){
			if( _.isEmpty( vehicle[ key ] ) &&
				typeof vehicle[ key ] != "object" &&
				typeof vehicle[ key ] != "number" )
			{
				vehicle[ key ] = "Not Available";
			}
		}
		
		return; //: @template: template/view-vehicle.html
	},

	"getDefaultProps": function getDefaultProps( ){
		return {
			"component": null
		};
	},

	"getInitialState": function getInitialState( ){
		return {
			"vehicles": [ ]
		};
	},

	"render": function onRender( ){
		return; //: @template: template/view-vehicles.html
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		
	},

	"componentDidMount": function componentDidMount( ){
		PubSub.subscribe( "close-view-vehicles",
			( function onCloseViewVehicles( ){
				this.hideViewVehicles( );
			} ).bind( this ) );		

		PubSub.subscribe( "show-view-vehicles",
			( function onShowViewVehicles( ){
				this.showViewVehicles( );
			} ).bind( this ) );

		PubSub.subscribe( "set-view-vehicles",
			( function onSetViewVehicles( vehicles ){
				this.setState( {
					"vehicles": vehicles
				} );
			} ).bind( this ) );

		this.hideViewVehicles( );
	}
} );

ViewVehicles.load( );