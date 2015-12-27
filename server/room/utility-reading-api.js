var _ = require( "lodash" );

APP.get( "/api/utility/reading/:reference",
	function onGetUtilityReading( request, response ){
		var reference = request.params.reference;

		UtilityReading( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, utilityReading ){
					if( error ){
						this.response( 500, "error", error.message );

					}else if( _.isEmpty( utilityReading ) ){
						this.response( 410, "failed", "utility reading does not exists" );

					}else{
						this.response( 200, "success", utilityReading );
					}
				} )
			.set( "useCustomScope", true )
			.set( "scope", [
				"reference",
				"name",
				"title",
				"description",
				"tags"
			] )
			.refer( reference );
	} );

APP.all( "/api/:accessID/utility/reading/all",
	function onGetAllUtilityReading( request, response, next ){
		UtilityReading( )
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
						this.response( 403, "failed", "no utility readings" );
					}
				} )
			.populated( );
	} );
APP.get( "/api/:accessID/utility/reading/all",
	function onGetAllUtilityReading( request, response ){
		var sort = request.query.sort;
		var total = request.query.total;

		var limit = request.query.limit;
		var index = request.query.index;
		
		var page = request.query.page;
		var size = request.query.size;

		UtilityReading( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, utilityReadings ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", utilityReadings );
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

APP.all( "/api/:accessID/utility/reading/add",
	function onAddUtilityReading( request, response, next ){
		var utilityReading = request.body;

		UtilityReading( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( existing ){
						this.reply( response, 200, "failed", "utility reading already exists" );

					}else{
						next( );
					}
				} )
			.createReferenceID( utilityReading )
			.exists( );
	} );
APP.post( "/api/:accessID/utility/reading/add",
	function onAddUtilityReading( request, response ){
		var utilityReading = request.body;

		UtilityReading( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, utilityReading ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", { "referenceID": utilityReading.referenceID } );
					}
				} )
			.createReferenceID( utilityReading )
			.createUtilityReadingID( utilityReading )
			.add( utilityReading );
	} );

APP.all( "/api/:accessID/utility/reading/:referenceID",
	function onGetUtilityReading( request, response, next ){
		var referenceID = request.params.referenceID;

		UtilityReading( )
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
						this.response( 410, "failed", "utility reading does not exists" );
					}
				} )
			.exists( );
	} );
APP.get( "/api/:accessID/utility/reading/:referenceID",
	function onGetUtilityReading( request, response ){
		var referenceID = request.params.referenceID;

		UtilityReading( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, utilityReading ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", utilityReading );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/utility/reading/update/:referenceID",
	function onUpdateUtilityReading( request, response, next ){
		var referenceID = request.params.referenceID;

		UtilityReading( )
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
						this.response( 403, "failed", "utility reading does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/utility/reading/update/:referenceID",
	function onUpdateUtilityReading( request, response ){
		var referenceID = request.params.referenceID;

		var utilityReading = request.body;

		UtilityReading( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, utilityReading ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", { "referenceID": utilityReading.referenceID } );
					}
				} )
			.update( utilityReading, referenceID );
	} );

APP.all( "/api/:accessID/utility/reading/edit/:referenceID",
	function onEditUtilityReading( request, response, next ){
		var referenceID = request.params.referenceID;

		UtilityReading( )
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
						this.response( 403, "failed", "utility reading does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/utility/reading/edit/:referenceID",
	function onEditUtilityReading( request, response ){
		var referenceID = request.params.referenceID;

		var utilityReading = request.body;

		var property = Object.keys( utilityReading )[ 0 ];
		var value = utilityReading[ property ];

		UtilityReading( )
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
						this.response( 200, "success", { "referenceID": utilityReading.referenceID } );
					}
				} )
			.edit( property, value, referenceID );
	} );

APP.all( "/api/:accessID/utility/reading/remove/:referenceID",
	function onRemoveUtilityReading( request, response, next ){
		var referenceID = request.params.referenceID;

		UtilityReading( )
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
						this.response( 403, "failed", "utility reading does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.delete( "/api/:accessID/utility/reading/remove/:referenceID",
	function onRemoveUtilityReading( request, response ){
		var referenceID = request.params.referenceID;

		UtilityReading( )
			.clone( )
			.setResponse( response )
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
			.setResponse( response )
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
						this.response( 403, "failed", "utility reading was either deleted or not" );
					}
				} )
			.exists( referenceID );
	} );
