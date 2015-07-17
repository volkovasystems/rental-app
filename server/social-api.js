var _ = require( "lodash" );

var Social = SOCIAL;

APP.all( "/api/:accessID/social/all",
	function onGetAllSocial( request, response, next ){
		Social( )
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
						this.reply( response, 403, "failed", "no social data" );
					}
				} ) 
			.populated( );
	} );
APP.get( "/api/:accessID/social/all",
	function onGetAllSocial( request, response ){
		Social( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, socials ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", socials );
					}
				} )
			.all( );
	} );

APP.all( "/api/:accessID/social/:referenceID",
	function onGetSocial( request, response, next ){
		var referenceID = request.params.referenceID;

		Social( )
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
						this.reply( response, 403, "failed", "social data does not exists" );
					}
				} ) 
			.exists( referenceID );
	} );
APP.get( "/api/:accessID/social/:referenceID",
	function onGetSocial( request, response ){
		var referenceID = request.params.referenceID;

		Social( )
			.clone( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.self.flush( ).reply( response, 500, "error", error.message );
					
					}else if( existing ){
						this.self.notify( );
						
					}else{
						this.self.flush( ).reply( response, 200, "failed", "social data does not exists" );
					}
				} )
			.set( "referenceID", referenceID )
			.exists( )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, social ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", social );
					}
				} )
			.get( );
	} );

APP.all( "/api/:accessID/social/add",
	function onRegisterSocial( request, response, next ){
		var social = request.body;

		Social( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( existing ){
						this.reply( response, 200, "failed", "social data already exists" );
						
					}else{
						next( );
					}
				} )
			.createReferenceID( social )
			.exists( );
	} );
APP.post( "/api/:accessID/social/add",
	function onAddSocial( request, response ){
		var social = request.body;

		Social( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, social ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": social.referenceID } );
					}
				} )
			.createReferenceID( social )
			.createSocialID( social )
			.add( social );
	} );

APP.all( "/api/:accessID/social/update/:referenceID",
	function onUpdateSocial( request, response, next ){
		var referenceID = request.params.referenceID;

		Social( )
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
						this.reply( response, 403, "failed", "social data does not exists" );
					}
				} ) 
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/social/update/:referenceID",
	function onUpdateSocial( request, response ){
		var referenceID = request.params.referenceID;

		var social = request.body;

		Social( )
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
			.update( social, referenceID );
	} );

APP.all( "/api/:accessID/social/edit/:referenceID",
	function onEditSocial( request, response, next ){
		var referenceID = request.params.referenceID;

		Social( )
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
						this.reply( response, 403, "failed", "social data does not exists" );
					}
				} ) 
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/social/edit/:referenceID",
	function onEditSocial( request, response ){
		var referenceID = request.params.referenceID;

		var social = request.body;

		var property = Object.keys( social )[ 0 ];
		var value = social[ property ];

		Social( )
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

APP.all( "/api/:accessID/social/remove/:referenceID",
	function onRemoveSocial( request, response, next ){
		var referenceID = request.params.referenceID;

		Social( )
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
						this.reply( response, 403, "failed", "social data does not exists" );
					}
				} ) 
			.exists( referenceID );
	} );
APP.delete( "/api/:accessID/social/remove/:referenceID",
	function onRemoveSocial( request, response ){
		var referenceID = request.params.referenceID;

		Social( )
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
						this.reply( response, 200, "failed", "cannot delete social" );
					}
				} )
			.exists( referenceID );
	} );