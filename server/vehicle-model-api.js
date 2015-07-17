var _ = require( "lodash" );

var VehicleModel = VEHICLE_MODEL;

APP.all( "/api/:accessID/vehicle/model/all",
	function onGetAllVehicleModel( request, response, next ){
		VehicleModel( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, isPopulated ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( isPopulated ){
						next( );

					}else{
						this.reply( response, 403, "failed", "no vehicle models" );
					}
				} )
			.populated( );
	} );
APP.get( "/api/:accessID/vehicle/model/all",
	function onGetAllVehicleModel( request, response ){
		var limit = request.query.limit;

		var index = request.query.index;

		var sort = request.query.sort;

		VehicleModel( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, vehicleModels ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", vehicleModels );
					}
				} )
			.set( "limit", limit )
			.set( "index", index )
			.set( "sort", sort )
			.all( );
	} );

APP.all( "/api/:accessID/vehicle/model/add",
	function onRegisterVehicleModel( request, response, next ){
		var vehicleModel = request.body;

		VehicleModel( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( existing ){
						this.reply( response, 200, "failed", "vehicle model already exists" );
						
					}else{
						next( );
					}
				} )
			.createReferenceID( vehicleModel )
			.exists( );
	} );
APP.post( "/api/:accessID/vehicle/model/add",
	function onAddVehicleModel( request, response ){
		var vehicleModel = request.body;

		VehicleModel( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, vehicleModel ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": vehicleModel.referenceID } );
					}
				} )
			.createReferenceID( vehicleModel )
			.createVehicleModelID( vehicleModel )
			.add( vehicleModel );
	} );

APP.all( "/api/:accessID/vehicle/model/:referenceID",
	function onGetVehicleModel( request, response, next ){
		var referenceID = request.params.referenceID;
		
		VehicleModel( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( existing ){
						next( );
						
					}else{
						this.reply( response, 200, "failed", "vehicle model does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.get( "/api/:accessID/vehicle/model/:referenceID",
	function onGetVehicleModel( request, response ){
		var referenceID = request.params.referenceID;

		VehicleModel( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, vehicleModel ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", vehicleModel );
					}
				} )
			.pick( "referenceID", referenceID );
	} );


APP.put( "/api/:accessID/vehicle/model/update/:referenceID",
	function onUpdateVehicleModel( request, response ){
		var referenceID = request.params.referenceID;

		var vehicleModel = request.body;

		VehicleModel( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success" );
					}
				} )
			.update( vehicleModel, referenceID );
	} );

APP.put( "/api/:accessID/vehicle/model/edit/:referenceID",
	function onEditVehicleModel( request, response ){
		var referenceID = request.params.referenceID;

		var vehicleModel = request.body;

		var property = Object.keys( vehicleModel )[ 0 ];
		var value = vehicleModel[ property ];

		VehicleModel( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success" );
					}
				} )
			.edit( property, value, referenceID );
	} );

APP.delete( "/api/:accessID/vehicle/model/remove/:referenceID",
	function onRemoveVehicleModel( request, response ){
		var referenceID = request.params.referenceID;

		VehicleModel( )
			.clone( )
			.once( "error",
				function onError( error ){
					this.self.flush( ).reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error ){
					if( error ){
						this.self.flush( ).reply( response, 500, "error", error.message );

					}else{
						this.self.notify( );
					}
				} )
			.remove( referenceID )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( !existing ){
						this.reply( response, 200, "success" );
					
					}else{
						this.reply( response, 200, "failed", "cannot delete vehicle model" );
					}
				} )
			.exists( referenceID );
	} );
