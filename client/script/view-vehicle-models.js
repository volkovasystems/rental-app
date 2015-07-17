//: @administrator-mode:
var ViewVehicleModels = React.createClass( {
	"statics": {
		"load": function load( ){
			$( "[view-vehicle-models]" ).ready( function onReady( ){
				var viewVehicleModelsElement = $( "[view-vehicle-models]" );

				var viewVehicleModelsComponent = <ViewVehicleModels component={ viewVehicleModelsElement } />

				React.render( viewVehicleModelsComponent, viewVehicleModelsElement[ 0 ] );
			} );
		}
	},

	"onPageIndexChange": function onPageIndexChange( index ){
		this.setState( {
			"pageIndex": index
		},
			function onStateChanged( ){
				PubSub.publish( "update-view-vehicle-models" );
			} );
	},

	"onPageSizeChange": function onPageSizeChange( size ){
		this.setState( {
			"pageSize": size
		},
			function onStateChanged( ){
				PubSub.publish( "update-view-vehicle-models" );
			} );
	},

	"onClose": function onClose( ){
		PubSub.publish( "close-view-vehicle-models" );
	},

	"showViewVehicleModels": function showViewVehicleModels( ){
		$( "[data-page]", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hideViewVehicleModels": function hideViewVehicleModels( ){
		$( "[data-page]", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"clearViewVehicleModelsData": function clearViewVehicleModelsData( ){
		this.setState( this.getInitialState( ) );
	},

	"onEachVehicleModel": function onEachVehicleModel( vehicleModel ){
		for( var key in vehicleModel ){
			if( _.isEmpty( vehicleModel[ key ] ) &&
				typeof vehicleModel[ key ] != "object" &&
				typeof vehicleModel[ key ] != "number" )
			{
				vehicleModel[ key ] = "Not Available";
			}
		}
		
		return; //: @template: template/view-vehicle-model.html
	},

	"getDefaultProps": function getDefaultProps( ){
		return {
			"component": null
		};
	},

	"getInitialState": function getInitialState( ){
		return {
			"vehicleModels": [ ],

			"totalCount": 0,
			"pageIndex": 0,
			"pageSize": 5
		};
	},

	"render": function onRender( ){
		return; //: @template: template/view-vehicle-models.html
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){

	},

	"componentDidMount": function componentDidMount( ){
		PubSub.subscribe( "close-view-vehicle-models",
			( function onCloseViewVehicleModels( ){
				this.hideViewVehicleModels( );
			} ).bind( this ) );		

		PubSub.subscribe( "show-view-vehicle-models",
			( function onShowViewVehicleModels( ){
				this.showViewVehicleModels( );
			} ).bind( this ) );

		PubSub.subscribe( "set-view-vehicle-models",
			( function onSetViewVehicleModels( vehicleModels ){
				this.setState( {
					"vehicleModels": vehicleModels
				} );
			} ).bind( this ) );

		PubSub.subscribe( "set-view-vehicle-models-total-count",
			( function onSetViewVehicleModelsTotalCount( totalCount ){
				this.setState( {
					"totalCount": totalCount
				} );
			} ).bind( this ) );

		PubSub.subscribe( "get-view-vehicle-models-query",
			( function onGetViewVehicleModelsQuery( callback ){
				callback( {
					"pageSize": this.state.pageSize,
					"pageIndex": this.state.pageIndex
				} );
			} ).bind( this ) );

		this.hideViewVehicleModels( );
	}
} );

ViewVehicleModels.load( );
//: @end-administrator-mode