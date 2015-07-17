var _ = require( "lodash" );

var Amenity = AMENITY;

APP.all( "/api/:accessID/amenity/all",
	function onGetAllAmenity( request, response, next ){
		Amenity( )
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
APP.get( "/api/:accessID/amenity/all",
	function onGetAllAmenity( request, response ){
		var limit = request.query.limit;

		var index = request.query.index;

		var sort = request.query.sort;

		Amenity( )
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

APP.all( "/api/:accessID/amenity/:referenceID",
	function onGetAmenity( request, response, next ){
		var referenceID = request.params.referenceID;

		Amenity( )
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
						this.reply( response, 403, "failed", "amenity does not exists" );
					}
				} ) 
			.exists( );
	} );
APP.get( "/api/:accessID/amenity/:referenceID",
	function onGetAmenity( request, response ){
		var referenceID = request.params.referenceID;

		Amenity( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, amenity ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", amenity );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/amenity/add",
	function onAddAmenity( request, response, next ){
		var amenity = request.body;

		Amenity( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( existing ){
						this.reply( response, 200, "failed", "amenity already exists" );
						
					}else{
						next( );
					}
				} )
			.createReferenceID( amenity )
			.exists( );
	} );
APP.post( "/api/:accessID/amenity/add",
	function onAddAmenity( request, response ){
		var amenity = request.body;

		Amenity( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, amenity ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": amenity.referenceID } );
					}
				} )
			.createReferenceID( amenity )
			.createAmenityID( amenity )
			.add( amenity );
	} );

APP.all( "/api/:accessID/amenity/update/:referenceID",
	function onUpdateAmenity( request, response, next ){
		var referenceID = request.params.referenceID;

		Amenity( )
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
						this.reply( response, 403, "failed", "amenity does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/amenity/update/:referenceID",
	function onUpdateAmenity( request, response ){
		var referenceID = request.params.referenceID;

		var amenity = request.body;

		Amenity( )
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
			.update( amenity, referenceID );
	} );

APP.all( "/api/:accessID/amenity/edit/:referenceID",
	function onEditAmenity( request, response, next ){
		var referenceID = request.params.referenceID;

		Amenity( )
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
						this.reply( response, 403, "failed", "amenity does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/amenity/edit/:referenceID",
	function onEditAmenity( request, response ){
		var referenceID = request.params.referenceID;

		var amenity = request.body;

		var property = Object.keys( amenity )[ 0 ];
		var value = amenity[ property ];

		Amenity( )
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

APP.all( "/api/:accessID/amenity/remove/:referenceID",
	function onRemoveAmenity( request, response, next ){
		var referenceID = request.params.referenceID;

		Amenity( )
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
						this.reply( response, 403, "failed", "amenity does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.delete( "/api/:accessID/amenity/remove/:referenceID",
	function onRemoveAmenity( request, response ){
		var referenceID = request.params.referenceID;

		Amenity( )
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
						this.reply( response, 200, "failed", "cannot delete amenity" );
					}
				} )
			.exists( referenceID );
	} );
