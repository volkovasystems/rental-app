var _ = require( "lodash" );

APP.all( "/api/:accessID/analytics/all",
	function onGetAllAnalytics( request, response, next ){
		Analytics( )
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
						this.reply( response, 403, "failed", "no amenities" );
					}
				} ) 
			.populated( );
	} );
APP.get( "/api/:accessID/analytics/all",
	function onGetAllAnalytics( request, response ){
		var limit = request.query.limit;

		var index = request.query.index;

		var sort = request.query.sort;

		Analytics( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, amenities ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", amenities );
					}
				} )
			.set( "limit", limit )
			.set( "index", index )
			.set( "sort", sort )
			.all( );
	} );

APP.all( "/api/:accessID/analytics/:referenceID",
	function onGetAnalytics( request, response, next ){
		var referenceID = request.params.referenceID;

		Analytics( )
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
						this.reply( response, 403, "failed", "analytics does not exists" );
					}
				} ) 
			.exists( );
	} );
APP.get( "/api/:accessID/analytics/:referenceID",
	function onGetAnalytics( request, response ){
		var referenceID = request.params.referenceID;

		Analytics( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, analytics ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", analytics );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/analytics/add",
	function onAddAnalytics( request, response, next ){
		var analytics = request.body;

		Analytics( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( existing ){
						this.reply( response, 200, "failed", "analytics already exists" );
						
					}else{
						next( );
					}
				} )
			.createReferenceID( analytics )
			.exists( );
	} );
APP.post( "/api/:accessID/analytics/add",
	function onAddAnalytics( request, response ){
		var analytics = request.body;

		Analytics( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, analytics ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": analytics.referenceID } );
					}
				} )
			.createReferenceID( analytics )
			.createAnalyticsID( analytics )
			.add( analytics );
	} );

APP.all( "/api/:accessID/analytics/update/:referenceID",
	function onUpdateAnalytics( request, response, next ){
		var referenceID = request.params.referenceID;

		Analytics( )
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
						this.reply( response, 403, "failed", "analytics does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/analytics/update/:referenceID",
	function onUpdateAnalytics( request, response ){
		var referenceID = request.params.referenceID;

		var analytics = request.body;

		Analytics( )
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
			.update( analytics, referenceID );
	} );

APP.all( "/api/:accessID/analytics/edit/:referenceID",
	function onEditAnalytics( request, response, next ){
		var referenceID = request.params.referenceID;

		Analytics( )
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
						this.reply( response, 403, "failed", "analytics does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/analytics/edit/:referenceID",
	function onEditAnalytics( request, response ){
		var referenceID = request.params.referenceID;

		var analytics = request.body;

		var property = Object.keys( analytics )[ 0 ];
		var value = analytics[ property ];

		Analytics( )
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

APP.all( "/api/:accessID/analytics/remove/:referenceID",
	function onRemoveAnalytics( request, response, next ){
		var referenceID = request.params.referenceID;

		Analytics( )
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
						this.reply( response, 403, "failed", "analytics does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.delete( "/api/:accessID/analytics/remove/:referenceID",
	function onRemoveAnalytics( request, response ){
		var referenceID = request.params.referenceID;

		Analytics( )
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
						this.reply( response, 200, "failed", "cannot delete analytics" );
					}
				} )
			.exists( referenceID );
	} );