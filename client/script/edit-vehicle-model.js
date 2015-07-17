//: @administrator-mode:
var EditVehicleModel = React.createClass( {
	"statics": {
		"load": function load( ){
			$( "section[edit-vehicle-model]" ).ready( function onReady( ){
				var editVehicleModelElement = $( "section[edit-vehicle-model]" );

				var editVehicleModelComponent = <EditVehicleModel component={ editVehicleModelElement } />

				React.render( editVehicleModelComponent, editVehicleModelElement[ 0 ] );
			} );
		}
	},

	"vehicleModel": "",
	"vehicleModels": [ ],
	"selectedVehicleModel": "",

	"onSelectVehicleModel": function onSelectVehicleModel( event ){
		var vehicleModel = $( event.currentTarget ).attr( "data-vehicle-model" );

		vehicleModel = _.find( this.vehicleModels,
			function onEachVehicleModel( vehicleModelData ){
				return vehicleModelData.referenceID == vehicleModel;
			} );

		if( this.selectedVehicleModel.referenceID == vehicleModel.referenceID ){
			this.selectedVehicleModel = { },
			
			this.vehicleModel = "",

			this.clearEditVehicleModelData( );

			return;
		}

		this.selectedVehicleModel = vehicleModel;

		this.vehicleModel = vehicleModel.title;

		this.setState( {
			"referenceID": vehicleModel.referenceID,
			"name": vehicleModel.name,
			"title": vehicleModel.title,
			"description": vehicleModel.description,
			"brand": vehicleModel.brand
		} );
	},

	"onEachVehicleModel": function onEachVehicleModel( vehicleModel ){
		var isSelected = "none";
		if( this.selectedVehicleModel.referenceID == vehicleModel.referenceID ){
			isSelected = "selected";
		}

		return; //: @template: template/vehicle-model-selection.html
	},

	"onEditVehicleModel": function onEditVehicleModel( ){
		PubSub.publish( "edit-vehicle-model", _.clone( this.state, true ) );
		
		PubSub.publish( "close-edit-vehicle-model" );

		this.clearEditVehicleModelData( );
	},

	"onCancel": function onCancel( ){
		PubSub.publish( "cancel-edit-vehicle-model" );
	},

	"showEditVehicleModelFormGroup": function showEditVehicleModelFormGroup( ){
		$( "[data-form-group='vehicle-model-edit-form']", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hideEditVehicleModelFormGroup": function hideEditVehicleModelFormGroup( ){
		$( "[data-form-group='vehicle-model-edit-form']", this.props.component )
			.removeClass( "shown" )
			.addClass( "hidden" );
	},

	"showEditVehicleModel": function showEditVehicleModel( ){
		$( "[data-page]", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hideEditVehicleModel": function hideEditVehicleModel( ){
		$( "[data-page]", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"clearEditVehicleModelData": function clearEditVehicleModelData( ){
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
			"brand": ""
		};
	},

	"render": function onRender( ){
		return; //: @template: template/edit-vehicle-model.html
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		if( prevState.title != this.state.title ){
			this.setState( {
				"name": S( this.state.title.toLowerCase( ) ).dasherize( ).toString( )
			} );
		}

		if( this.state.referenceID ){
			this.showEditVehicleModelFormGroup( );

		}else{
			this.hideEditVehicleModelFormGroup( );
		}
	},

	"componentDidMount": function componentDidMount( ){
		PubSub.subscribe( "close-edit-vehicle-model",
			( function onCloseEditVehicleModel( ){
				this.hideEditVehicleModel( );
			} ).bind( this ) );		

		PubSub.subscribe( "cancel-edit-vehicle-model",
			( function onCancelEditVehicleModel( ){
				PubSub.publish( "close-edit-vehicle-model" );

				this.clearEditVehicleModelData( );
			} ).bind( this ) );

		PubSub.subscribe( "show-edit-vehicle-model",
			( function onShowEditVehicleModel( control ){
				this.showEditVehicleModel( );
			} ).bind( this ) );

		PubSub.subscribe( "set-edit-vehicle-model-list",
			( function onSetEditVehicleModelsList( vehicleModels ){
				this.vehicleModels = vehicleModels;

				this.forceUpdate( );
			} ).bind( this ) );

		this.hideEditVehicleModel( );

		this.hideEditVehicleModelFormGroup( );
	}
} );

EditVehicleModel.load( );
//: @end-administrator-mode