var _ = require( "lodash" );

APP.all( "/api/:accessID/media/all",
	function onGetAllMedia( request, response, next ){
		Media( )
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
APP.get( "/api/:accessID/media/all",
	function onGetAllMedia( request, response ){
		var limit = request.query.limit;

		var index = request.query.index;

		var sort = request.query.sort;

		Media( )
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

APP.all( "/api/:accessID/media/:referenceID",
	function onGetMedia( request, response, next ){
		var referenceID = request.params.referenceID;

		Media( )
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
						this.reply( response, 403, "failed", "media does not exists" );
					}
				} ) 
			.exists( );
	} );
APP.get( "/api/:accessID/media/:referenceID",
	function onGetMedia( request, response ){
		var referenceID = request.params.referenceID;

		Media( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, media ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", media );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/media/add",
	function onAddMedia( request, response, next ){
		var media = request.body;

		Media( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( existing ){
						this.reply( response, 200, "failed", "media already exists" );
						
					}else{
						next( );
					}
				} )
			.createReferenceID( media )
			.exists( );
	} );
APP.post( "/api/:accessID/media/add",
	function onAddMedia( request, response ){
		var media = request.body;

		Media( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, media ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": media.referenceID } );
					}
				} )
			.createReferenceID( media )
			.createMediaID( media )
			.add( media );
	} );

APP.all( "/api/:accessID/media/update/:referenceID",
	function onUpdateMedia( request, response, next ){
		var referenceID = request.params.referenceID;

		Media( )
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
						this.reply( response, 403, "failed", "media does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/media/update/:referenceID",
	function onUpdateMedia( request, response ){
		var referenceID = request.params.referenceID;

		var media = request.body;

		Media( )
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
			.update( media, referenceID );
	} );

APP.all( "/api/:accessID/media/edit/:referenceID",
	function onEditMedia( request, response, next ){
		var referenceID = request.params.referenceID;

		Media( )
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
						this.reply( response, 403, "failed", "media does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/media/edit/:referenceID",
	function onEditMedia( request, response ){
		var referenceID = request.params.referenceID;

		var media = request.body;

		var property = Object.keys( media )[ 0 ];
		var value = media[ property ];

		Media( )
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

APP.all( "/api/:accessID/media/remove/:referenceID",
	function onRemoveMedia( request, response, next ){
		var referenceID = request.params.referenceID;

		Media( )
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
						this.reply( response, 403, "failed", "media does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.delete( "/api/:accessID/media/remove/:referenceID",
	function onRemoveMedia( request, response ){
		var referenceID = request.params.referenceID;

		Media( )
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
						this.reply( response, 200, "failed", "cannot delete media" );
					}
				} )
			.exists( referenceID );
	} );