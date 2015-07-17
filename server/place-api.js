var _ = require( "lodash" );

var Place = PLACE;

/*:
	We need accessID here because we are requesting data
		to other servers.
*/
APP.all( "/api/:accessID/place/all",
	function onGetAllPlace( request, response, next ){
		Place( )
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
						this.reply( response, 403, "failed", "no places" );
					}
				} ) 
			.populated( );
	} );
APP.get( "/api/:accessID/place/all",
	function onGetAllPlace( request, response ){
		Place( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, places ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( _.isEmpty( places ) ){
						this.reply( response, 200, "failed", "no places" );

					}else{
						this.reply( response, 200, "success", places );
					}
				} )
			.set( "accessID", request.params.accessID )
			.all( );
	} );

/*:
	We need accessID here because we are requesting data
		to other servers.
*/
APP.get( "/api/:accessID/place/:referenceID",
	function onGetPlace( request, response ){
		var referenceID = request.params.referenceID;

		Place( )
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
						this.self.flush( ).reply( response, 200, "failed", "place does not exists" );
					}
				} )
			.exists( referenceID )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, place ){
					if( place instanceof Array ){
						place = _.first( place );
					}

					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", place );
					}
				} )
			.set( "accessID", request.params.accessID )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/place/add",
	function onRegisterPlace( request, response, next ){
		var place = request.body;

		Place( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( existing ){
						this.reply( response, 200, "failed", "place already exists" );
						
					}else{
						next( );
					}
				} )
			.createReferenceID( place )
			.exists( );
	} );
APP.post( "/api/:accessID/place/add",
	function onAddPlace( request, response ){
		var place = request.body;

		Place( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, place ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": place.referenceID } );
					}
				} )
			.createReferenceID( place )
			.createPlaceID( place )
			.add( place );
	} );

APP.put( "/api/:accessID/place/update/:referenceID",
	function onUpdatePlace( request, response ){
		var referenceID = request.params.referenceID;

		var place = request.body;

		Place( )
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
			.update( place, referenceID );
	} );

APP.put( "/api/:accessID/place/edit/:referenceID",
	function onEditPlace( request, response ){
		var referenceID = request.params.referenceID;

		var place = request.body;

		var property = Object.keys( place )[ 0 ];
		var value = place[ property ];

		Place( )
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

APP.delete( "/api/:accessID/place/remove/:referenceID",
	function onRemovePlace( request, response ){
		var referenceID = request.params.referenceID;

		Place( )
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
						this.reply( response, 200, "failed", "cannot delete place" );
					}
				} )
			.exists( referenceID );
	} );
