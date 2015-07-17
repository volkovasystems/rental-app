var _ = require( "lodash" );
var util = require( "util" );

var Vehicle = VEHICLE;

/*:
	Refers to all the vehicles in the database.

	This has administrative privilege.
	
	This will include all users bound to those vehicles.
*/
APP.all( "/api/:accessID/vehicle/all",
	function onGetAllVehicle( request, response, next ){
		Vehicle( )
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
						this.reply( response, 403, "failed", "no vehicles" );
					}
				} ) 
			.populated( );
	} );
APP.get( "/api/:accessID/vehicle/all",
	function onGetAllVehicle( request, response ){
		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, vehicles ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", vehicles );
					}
				} )
			.all( );
	} );

/*:
	This refers to getting the users' vehicle data.
	
	This has administrative privilege.

	This will return all users binded to this vehicle data.
*/
APP.all( "/api/:accessID/vehicle/:referenceID",
	function onGetVehicle( request, response, next ){
		var referenceID = request.params.referenceID;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, exists ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( exists ){
						next( );

					}else{
						this.reply( response, 403, "failed", "vehicle does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.get( "/api/:accessID/vehicle/:referenceID",
	function onGetVehicle( request, response ){
		var referenceID = request.params.referenceID;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, vehicle ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", vehicle );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

/*:
	This refers to the user's vehicle 
		if he want to get all his vehicle data.

	This is for the owner only.
*/
APP.all( "/api/:accessID/vehicle/all/of/owner",
	function onGetOwnerVehicles( request, response, next ){
		var user = request.session.user.referenceID;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, hasVehicles ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( hasVehicles ){
						next( );

					}else{
						this.reply( response, 403, "failed", "user does not own any vehicle" );
					}
				} )
			.has( user, "users" );
	} );
APP.get( "/api/:accessID/vehicle/all/of/owner",
	function onGetOwnerVehicles( request, response ){
		var user = request.session.user.referenceID;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, vehicle ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", vehicle );
					}
				} )
			.set( "disableOtherUsers", true )
			.get( "users", user );
	} );

/*:
	This will get all vehicles of the user.
	
	This has administrative privilege.
	
	Note that this will also return all users bound 
		to those vehicles.
*/
APP.get( "/api/:accessID/vehicle/all/of/:user",
	function onGetAllVehicleOfUser( request, response ){
		var user = request.params.user;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, vehicles ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( _.isEmpty( vehicles ) ){
						this.reply( response, 200, "failed", "no vehicles for that user" );

					}else{
						this.reply( response, 200, "success", vehicles );
					}
				} )
			.get( "users", user );
	} );

/*:
	This refers to getting the users' vehicle data.
	
	This has administrative privilege.

	This will return all users binded to this vehicle data.
*/
APP.all( "/api/:accessID/vehicle/:referenceID/of/:user",
	function onGetVehicleOfUser( request, response, next ){
		var referenceID = request.params.referenceID;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, exists ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( exists ){
						next( );

					}else{
						this.reply( response, 403, "failed", "vehicle does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.all( "/api/:accessID/vehicle/:referenceID/of/:user",
	function onGetVehicleOfUser( request, response, next ){
		var referenceID = request.params.referenceID;

		var user = request.session.user.referenceID;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, ownerVerified ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( ownerVerified ){
						next( );

					}else{
						this.reply( response, 403, "failed", "vehicle is not owned by this user" );
					}
				} )
			.set( "referenceID", referenceID )
			.confirm( { "users": user } );
	} );
APP.get( "/api/:accessID/vehicle/:referenceID/of/:user",
	function onGetVehicleOfUser( request, response ){
		var referenceID = request.params.referenceID;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, vehicle ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", vehicle );
					}
				} )
			.set( "disableOtherUsers", true )
			.pick( "referenceID", referenceID );
	} );

/*:
	Note we don't add as body parameter the referenceID of the user.

	This has administrative privilege.
*/
APP.all( "/api/:accessID/vehicle/add/:user",
	function onAddVehicle( request, response, next ){
		var vehicle = request.body;

		var user = request.params.user;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, vehicleIsAlreadyOwned ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( vehicleIsAlreadyOwned ){
						this.reply( response, 403, "failed", "vehicle is already owned" );

					}else{
						next( );	
					}
				} )
			.createReferenceID( vehicle )
			.confirm( { "users": user } );
	} );
APP.all( "/api/:accessID/vehicle/add/:user",
	function onAddVehicle( request, response, next ){
		var vehicle = request.body;

		var accessID = request.params.accessID;

		var user = request.params.user;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( existing ){
						//: This is an update.
						var redirectURL = "/api/@accessID/vehicle/update/@referenceID/@user"
							.replace( "@referenceID", this.referenceID )
							.replace( "@accessID", accessID )
							.replace( "@user", user );

						response.redirect( 301, redirectURL );

					}else{
						next( );	
					}
				} )
			.createReferenceID( vehicle )
			.exists( );
	} );
APP.post( "/api/:accessID/vehicle/add/:user",
	function onAddVehicle( request, response ){
		var vehicle = request.body;

		vehicle.user = request.params.user;

		Vehicle( )
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
			.createReferenceID( vehicle )
			.createVehicleID( vehicle )	
			.add( vehicle );	
	} );

APP.all( "/api/:accessID/vehicle/update/:referenceID/:user",
	function onUpdateVehicle( request, response, next ){
		var referenceID = request.params.referenceID;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, exists ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( exists ){
						next( );

					}else{
						this.reply( response, 403, "failed", "vehicle does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.all( "/api/:accessID/vehicle/update/:referenceID/:user",
	function onUpdateVehicle( request, response, next ){
		var referenceID = request.params.referenceID;

		var user = request.params.user;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, ownerVerified ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( ownerVerified ){
						next( );

					}else{
						this.reply( response, 403, "failed", "vehicle is not owned by this user" );	
					}
				} )
			.createReferenceID( vehicle )
			.confirm( { "users": user } );
	} );
APP.put( "/api/:accessID/vehicle/update/:referenceID/:user",
	function onUpdateVehicle( request, response ){
		var referenceID = request.params.referenceID;

		var user = request.params.user;

		var vehicle = request.body;

		vehicle.user = user;

		Vehicle( )
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
			.update( vehicle, referenceID );
	} );

APP.all( "/api/:accessID/vehicle/edit/:referenceID/:user",
	function onUpdateVehicle( request, response, next ){
		var referenceID = request.params.referenceID;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, exists ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( exists ){
						next( );

					}else{
						this.reply( response, 403, "failed", "vehicle does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.all( "/api/:accessID/vehicle/edit/:referenceID/:user",
	function onUpdateVehicle( request, response, next ){
		var referenceID = request.params.referenceID;

		var user = request.params.user;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, ownerVerified ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( ownerVerified ){
						next( );

					}else{
						this.reply( response, 403, "failed", "vehicle is not owned by this user" );	
					}
				} )
			.createReferenceID( vehicle )
			.confirm( { "users": user } );
	} );
APP.put( "/api/:accessID/vehicle/edit/:referenceID/:user",
	function onEditVehicle( request, response ){
		var referenceID = request.params.referenceID;

		var vehicle = request.body;

		var property = Object.keys( vehicle )[ 0 ];
		var value = vehicle[ property ];

		Vehicle( )
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

APP.delete( "/api/:accessID/vehicle/remove/all/of/:user",
	function onRemoveVehicle( request, response ){
		var user = request.params.user;

		Vehicle( )
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
			.remove( user )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					this.self.flush( ).reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( !existing ){
						this.reply( response, 200, "success" );
					
					}else{
						this.reply( response, 200, "failed" );
					}
				} )
			.exists( user );
	} );

/*:
	Note we don't need to pass the user referenceID here anymore.
	
	The accessID is enough.

	This is for the owner only.
*/
APP.all( "/api/:accessID/vehicle/owner/add",
	function onAddVehicle( request, response, next ){
		var vehicle = request.body;

		var user = request.session.user.referenceID;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, vehicleIsAlreadyOwned ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( vehicleIsAlreadyOwned ){
						this.reply( response, 200, "failed", "vehicle is already owned" );
						
					}else{
						next( );
					}
				} )
			.createReferenceID( vehicle )
			.confirm( { "users": user } );
	} );
APP.all( "/api/:accessID/vehicle/owner/add",
	function onAddVehicle( request, response, next ){
		var vehicle = request.body;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( existing ){
						//: This is an update.
						var redirectURL = "/api/@accessID/vehicle/owner/update/@referenceID"
							.replace( "@referenceID", this.referenceID )
							.replace( "@accessID", accessID );

						response.redirect( 301, redirectURL );

					}else{
						next( );
					}
				} )
			.createReferenceID( vehicle )
			.exists( );
	} );
APP.post( "/api/:accessID/vehicle/owner/add",
	function onAddVehicle( request, response ){
		var vehicle = request.body;

		vehicle.user = request.session.user.referenceID;

		Vehicle( )
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
			.createReferenceID( vehicle )
			.createVehicleID( vehicle )	
			.add( vehicle );	
	} );

/*:
	This refers to the user's vehicle 
		if he want to get a single vehicle data.

	This is for the owner only.
*/
APP.all( "/api/:accessID/vehicle/owner/:referenceID",
	function onGetOwnerVehicle( request, response, next ){
		var referenceID = request.params.referenceID;

		Vehicle( )
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
						this.reply( response, 200, "failed", "vehicle does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.all( "/api/:accessID/vehicle/owner/:referenceID",
	function onGetOwnerVehicle( request, response, next ){
		var referenceID = request.params.referenceID;

		var user = request.session.user.referenceID;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, ownerVerified ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( ownerVerified ){
						next( );
						
					}else{
						this.reply( response, 200, "failed", "vehicle is not owned by this user" );
					}
				} )
			.set( "referenceID", referenceID )
			.confirm( { "users": user } );
	} );
APP.get( "/api/:accessID/vehicle/owner/:referenceID",
	function onGetOwnerVehicle( request, response ){
		var referenceID = request.params.referenceID;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, vehicle ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", vehicle );
					}
				} )
			.set( "disableOtherUsers", true )
			.set( "referenceID", referenceID )
			.get( );
	} );

APP.all( "/api/:accessID/vehicle/owner/update/:referenceID",
	function onUpdateOwnerVehicle( request, response, next ){
		var referenceID = request.params.referenceID;

		var vehicle = request.body;

		Vehicle( )
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
			.update( vehicle, referenceID );
	} );
APP.all( "/api/:accessID/vehicle/owner/update/:referenceID",
	function onUpdateOwnerVehicle( request, response, next ){
		var referenceID = request.params.referenceID;

		var user = request.session.user.referenceID;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, ownerVerified ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( ownerVerified ){
						next( );
						
					}else{
						this.reply( response, 200, "failed", "vehicle is not owned by this user" );
					}
				} )
			.set( "referenceID", referenceID )
			.confirm( { "users": user } );
	} );
APP.put( "/api/:accessID/vehicle/owner/update/:referenceID",
	function onUpdateVehicle( request, response ){
		var referenceID = request.params.referenceID;

		var vehicle = request.body;

		Vehicle( )
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
			.update( vehicle, referenceID );
	} );

APP.all( "/api/:accessID/vehicle/owner/edit/:referenceID",
	function onEditVehicle( request, response, next ){
		var referenceID = request.params.referenceID;

		var vehicle = request.body;

		var property = Object.keys( vehicle )[ 0 ];
		var value = vehicle[ property ];

		Vehicle( )
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
APP.all( "/api/:accessID/vehicle/owner/edit/:referenceID",
	function onEditOwnerVehicle( request, response, next ){
		var referenceID = request.params.referenceID;

		var user = request.session.user.referenceID;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, ownerVerified ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( ownerVerified ){
						next( );
						
					}else{
						this.reply( response, 200, "failed", "vehicle is not owned by this user" );
					}
				} )
			.set( "referenceID", referenceID )
			.confirm( { "users": user } );
	} );
APP.put( "/api/:accessID/vehicle/owner/edit/:referenceID",
	function onEditVehicle( request, response ){
		var referenceID = request.params.referenceID;

		var vehicle = request.body;

		var property = Object.keys( vehicle )[ 0 ];
		var value = vehicle[ property ];

		Vehicle( )
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

APP.all( "/api/:accessID/vehicle/owner/remove/:referenceID",
	function onRemoveVehicle( request, response, next ){
		var referenceID = request.params.referenceID;

		Vehicle( )
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
						this.reply( response, 403, "failed", "vehicle does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.all( "/api/:accessID/vehicle/owner/remove/:referenceID",
	function onRemoveOwnerVehicle( request, response, next ){
		var referenceID = request.params.referenceID;

		var user = request.session.user.referenceID;

		Vehicle( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, ownerVerified ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( ownerVerified ){
						next( );
						
					}else{
						this.reply( response, 200, "failed", "vehicle is not owned by this user" );
					}
				} )
			.set( "referenceID", referenceID )
			.confirm( { "users": user } );
	} );
APP.delete( "/api/:accessID/vehicle/owner/remove/:referenceID",
	function onRemoveVehicle( request, response ){
		var referenceID = request.params.referenceID;

		Vehicle( )
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
						this.reply( response, 200, "failed" );
					}
				} )
			.exists( referenceID );
	} );