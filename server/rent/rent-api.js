var _ = require( "lodash" );
var Room = require( "../room/room.js" );

APP.get( "/api/rent/:reference",
	function onGetRent( request, response ){
		var reference = request.params.reference;

		Rent( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, renter ){
					if( error ){
						this.response( 500, "error", error.message );

					}else if( _.isEmpty( renter ) ){
						this.response( 410, "failed", "rent does not exists" );

					}else{
						this.response( 200, "success", renter );
					}
				} )
			.set( "useCustomScope", true )
			.set( "scope", [
				"reference",
				"moveInDate",
				"duration.description",
				"roomPrice",
				
				"room.buildingNumber",
				"room.roomNumber",
				"room.roomSize",
				"room.name",
				"room.title",
				"room.description",
				"room.tags",
				
				"renter.displayName",
				"renter.guests.displayName",
				"renter.name",
				"renter.title",
				"renter.description",

				"name",
				"title",
				"description",
				"tags"
			] )
			.refer( reference );
	} );

APP.all( "/api/:accessID/rent/all",
	function onGetAllRent( request, response, next ){
		Rent( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, isPopulated ){
					if( error ){
						this.response( 500, "error", error.message );

					}else if( isPopulated ){
						next( );

					}else{
						this.response( 404, "failed", "no rents" );
					}
				} ) 
			.populated( );
	} );
APP.get( "/api/:accessID/rent/all",
	function onGetAllRent( request, response ){
		var sort = request.query.sort;
		var total = request.query.total;

		var limit = request.query.limit;
		var index = request.query.index;
		
		var page = request.query.page;
		var size = request.query.size;

		Rent( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, response ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", response );
					}
				} )
			.set( "sort", sort )
			.set( "limit", limit )
			.set( "index", index )
			.set( "page", page )
			.set( "size", size )
			.set( "total", total )
			.all( );
	} );

APP.all( "/api/:accessID/rent/add",
	function onAddRent( request, response, next ){
		var rent = request.body;

		Rent( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.response( 500, "error", error.message );
					
					}else if( existing ){
						this.response( 200, "failed", "rent already exists" );
						
					}else{
						next( );
					}
				} )
			.createReferenceID( rent )
			.exists( );
	} );
APP.all( "/api/:accessID/rent/add",
	function onAddRent( request, response, next ){
		var rent = request.body;

		Room( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.response( 500, "error", error.message );

					}else if( existing ){
						next( )

					}else{
						this.response( 403, "failed", "room does not exists" );
					}
				} )
			.exists( rent.room );
	} );
APP.all( "/api/:accessID/rent/add",
	function onAddRent( request, response, next ){
		var rent = request.body;

		Renter( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.response( 500, "error", error.message );

					}else if( existing ){
						next( )

					}else{
						this.response( 403, "failed", "renter does not exists" );
					}
				} )
			.exists( rent.renter );
	} );
APP.post( "/api/:accessID/rent/add",
	function onAddRent( request, response ){
		var rent = request.body;

		Rent( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, rent ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", { "referenceID": rent.referenceID } );
					}
				} )
			.createReferenceID( rent )
			.createRentID( rent )
			.add( rent );
	} );

APP.all( "/api/:accessID/rent/:referenceID",
	function onGetRent( request, response, next ){
		var referenceID = request.params.referenceID;

		Rent( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, existing ){
					if( error ){
						this.response( 500, "error", error.message );

					}else if( existing ){
						next( );

					}else{
						this.response( 410, "failed", "rent does not exists" );
					}
				} ) 
			.exists( );
	} );
APP.get( "/api/:accessID/rent/:referenceID",
	function onGetRent( request, response ){
		var referenceID = request.params.referenceID;

		Rent( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, rent ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", rent );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/rent/update/:referenceID",
	function onUpdateRent( request, response, next ){
		var referenceID = request.params.referenceID;

		Rent( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, existing ){
					if( error ){
						this.response( 500, "error", error.message );

					}else if( existing ){
						next( );

					}else{
						this.response( 403, "failed", "rent does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/rent/update/:referenceID",
	function onUpdateRent( request, response ){
		var referenceID = request.params.referenceID;

		var rent = request.body;

		Rent( )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success" );
					}
				} )
			.update( rent, referenceID );
	} );

APP.all( "/api/:accessID/rent/edit/:referenceID",
	function onEditRent( request, response, next ){
		var referenceID = request.params.referenceID;

		Rent( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, existing ){
					if( error ){
						this.response( 500, "error", error.message );

					}else if( existing ){
						next( );

					}else{
						this.response( 403, "failed", "rent does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/rent/edit/:referenceID",
	function onEditRent( request, response ){
		var referenceID = request.params.referenceID;

		var rent = request.body || { };

		var property = Object.keys( rent )[ 0 ] || request.body.property;
		var value = rent[ property ] || request.body.value;

		Rent( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success" );
					}
				} )
			.edit( property, value, referenceID );
	} );

APP.all( "/api/:accessID/rent/remove/:referenceID",
	function onRemoveRent( request, response, next ){
		var referenceID = request.params.referenceID;

		Rent( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, existing ){
					if( error ){
						this.response( 500, "error", error.message );

					}else if( existing ){
						next( );

					}else{
						this.response( 403, "failed", "rent does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.delete( "/api/:accessID/rent/remove/:referenceID",
	function onRemoveRent( request, response ){
		var referenceID = request.params.referenceID;

		Rent( )
			.setResponse( response )
			.clone( )
			.once( "error",
				function onError( error ){
					this.self.flush( ).response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error ){
					if( error ){
						this.self.flush( ).response( 500, "error", error.message );

					}else{
						this.self.notify( );
					}
				} )
			.remove( referenceID )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.response( 500, "error", error.message );

					}else if( !existing ){
						this.response( 200, "success", true );

					}else{
						this.response( 403, "failed", "rent was either deleted or not" );
					}
				} )
			.exists( referenceID );
	} );