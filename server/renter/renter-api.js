var _ = require( "lodash" );

APP.get( "/api/renter/:reference",
	function onGetRenter( request, response ){
		var reference = request.params.reference;

		Renter( )
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
						this.response( 410, "failed", "renter does not exists" );

					}else{
						this.response( 200, "success", renter );
					}
				} )
			.set( "useCustomScope", true )
			.set( "scope", [
				"reference",
				"displayName",
				"eMail",
				"profilePicture",
				"guests",
				"name",
				"title",
				"description"
			] )
			.refer( reference );
	} );

APP.all( "/api/:accessID/renter/all",
	function onGetAllRenter( request, response, next ){
		Renter( )
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
						this.reply( response, 403, "failed", "no renters" );
					}
				} )
			.populated( );
	} );
APP.get( "/api/:accessID/renter/all",
	function onGetAllRenter( request, response ){
		var sort = request.query.sort;
		var total = request.query.total;

		var limit = request.query.limit;
		var index = request.query.index;
		
		var page = request.query.page;
		var size = request.query size;

		Renter( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, renters ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", renters );
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

APP.all( "/api/:accessID/renter/add",
	function onAddRenter( request, response, next ){
		var renter = request.body;

		Renter( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( existing ){
						this.reply( response, 200, "failed", "renter already exists" );

					}else{
						next( );
					}
				} )
			.createReferenceID( renter )
			.exists( );
	} );
APP.post( "/api/:accessID/renter/add",
	function onAddRenter( request, response ){
		var renter = request.body;

		Renter( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, renter ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": renter.referenceID } );
					}
				} )
			.createReferenceID( renter )
			.createRenterID( renter )
			.add( renter );
	} );

APP.all( "/api/:accessID/renter/:referenceID",
	function onGetRenter( request, response, next ){
		var referenceID = request.params.referenceID;

		Renter( )
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
						this.reply( response, 403, "failed", "renter does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.get( "/api/:accessID/renter/:referenceID",
	function onGetRenter( request, response ){
		var referenceID = request.params.referenceID;

		Renter( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, renter ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", renter );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/renter/update/:referenceID",
	function onUpdateRenter( request, response, next ){
		var referenceID = request.params.referenceID;

		Renter( )
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
						this.reply( response, 403, "failed", "renter does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/renter/update/:referenceID",
	function onUpdateRenter( request, response ){
		var referenceID = request.params.referenceID;

		var renter = request.body;

		Renter( )
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
			.update( renter, referenceID );
	} );

APP.all( "/api/:accessID/renter/edit/:referenceID",
	function onEditRenter( request, response, next ){
		var referenceID = request.params.referenceID;

		Renter( )
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
						this.reply( response, 403, "failed", "renter does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/renter/edit/:referenceID",
	function onEditRenter( request, response ){
		var referenceID = request.params.referenceID;

		var renter = request.body;

		var property = Object.keys( renter )[ 0 ];
		var value = renter[ property ];

		Renter( )
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

APP.all( "/api/:accessID/renter/remove/:referenceID",
	function onRemoveRenter( request, response, next ){
		var referenceID = request.params.referenceID;

		Renter( )
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
						this.reply( response, 403, "failed", "renter does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.delete( "/api/:accessID/renter/remove/:referenceID",
	function onRemoveRenter( request, response ){
		var referenceID = request.params.referenceID;

		Renter( )
			.clone( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
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
						this.reply( response, 200, "failed", "cannot delete renter" );
					}
				} )
			.exists( referenceID );
	} );
