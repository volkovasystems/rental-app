var _ = require( "lodash" );

var Park = PARK;

APP.all( "/api/:accessID/park/all",
	function onGetAllPark( request, response, next ){
		Park( )
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
						this.reply( response, 403, "failed", "no park data" );
					}
				} ) 
			.populated( );
	} );
APP.get( "/api/:accessID/park/all",
	function onGetAllPark( request, response ){
		Park( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, parks ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", parks );
					}
				} )
			.set( "accessID", request.params.accessID )
			.all( );
	} );

APP.all( "/api/:accessID/park/only/all",
	function onGetAllPark( request, response, next ){
		Park( )
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
						this.reply( response, 403, "failed", "no park data" );
					}
				} ) 
			.populated( );
	} );
APP.get( "/api/:accessID/park/only/all",
	function onGetAllParkOnly( request, response ){
		Park( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, parks ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", parks );
					}
				} )
			.set( "parkOnly", true )
			.all( );
	} );

APP.all( "/api/:accessID/park/:referenceID",
	function onGetPark( request, response, next ){
		var referenceID = request.params.referenceID;

		Park( )
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
						this.reply( response, 403, "failed", "park data does not exists" );
					}
				} ) 
			.exists( referenceID );
	} );
APP.get( "/api/:accessID/park/:referenceID",
	function onGetPark( request, response ){
		var referenceID = request.params.referenceID;

		Park( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, park ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", park );
					}
				} )
			.set( "accessID", request.params.accessID )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/park/only/:referenceID",
	function onGetParkOnly( request, response, next ){
		var referenceID = request.params.referenceID;

		Park( )
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
						this.reply( response, 403, "failed", "park data does not exists" );
					}
				} ) 
			.exists( referenceID );
	} );
APP.get( "/api/:accessID/park/only/:referenceID",
	function onGetParkOnly( request, response ){
		var referenceID = request.params.referenceID;

		Park( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, park ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", park );
					}
				} )
			.set( "parkOnly", true )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/park/add",
	function onRegisterPark( request, response, next ){
		var park = request.body;

		Park( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( existing ){
						this.reply( response, 200, "failed", "park already exists" );
						
					}else{
						next( );
					}
				} )
			.createReferenceID( park )
			.exists( );
	} );
APP.post( "/api/:accessID/park/add",
	function onAddPark( request, response ){
		var park = request.body;

		Park( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, park ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": park.referenceID } );
					}
				} )
			.createReferenceID( park )
			.createParkID( park )
			.add( park );
	} );

APP.put( "/api/:accessID/park/update/:referenceID",
	function onUpdatePark( request, response ){
		var referenceID = request.params.referenceID;

		var park = request.body;

		Park( )
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
			.update( park, referenceID );
	} );

APP.put( "/api/:accessID/park/edit/:referenceID",
	function onEditPark( request, response ){
		var referenceID = request.params.referenceID;

		var park = request.body;

		var property = Object.keys( park )[ 0 ];
		var value = park[ property ];

		Park( )
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

APP.delete( "/api/:accessID/park/remove/:referenceID",
	function onRemovePark( request, response ){
		var referenceID = request.params.referenceID;

		Park( )
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
						this.reply( response, 200, "failed", "cannot delete park" );
					}
				} )
			.exists( referenceID );
	} );
