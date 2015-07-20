var _ = require( "lodash" );
var util = require( "util" );

var Access = ACCESS;

APP.all( "/api/:accessID/access/all",
	function onGetAllAccess( request, response, next ){
		Access( )
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
						this.reply( response, 403, "failed", "no access data" );
					}
				} ) 
			.populated( );
	} );
APP.get( "/api/:accessID/access/all",
	function onGetAllAccess( request, response ){
		Access( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, accesses ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", accesses );
					}
				} )
			.all( );
	} );

APP.all( "/api/:accessID/access/:referenceID",
	function onGetAccess( request, response, next ){
		var referenceID = request.params.referenceID;

		Access( )
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
						this.reply( response, 403, "failed", "access data does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.get( "/api/:accessID/access/:referenceID",
	function onGetAccess( request, response ){
		var referenceID = request.params.referenceID;

		Access( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, access ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", access );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/access/add",
	function onAddAccess( request, response, next ){
		var access = request.body;

		Access( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( existing ){
						this.reply( response, 200, "failed", "access already exists" );
						
					}else{
						next( );
					}
				} )
			.createReferenceID( access )
			.exists( );
	} );
APP.post( "/api/:accessID/access/add",
	function onAddAccess( request, response ){
		var access = request.body;

		Access( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, access ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": access.referenceID } );
					}
				} )
			.createReferenceID( access )
			.createAccessID( access )
			.add( access );
	} );

APP.all( "/api/:accessID/access/update/:referenceID",
	function onUpdateAccess( request, response, next ){
		var referenceID = request.params.referenceID;

		Access( )
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
						this.reply( response, 403, "failed", "access data does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/access/update/:referenceID",
	function onUpdateAccess( request, response ){
		var referenceID = request.params.referenceID;

		var access = request.body;

		Access( )
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
			.update( access, referenceID );
	} );

APP.all( "/api/:accessID/access/edit/:referenceID",
	function onEditAccess( request, response, next ){
		var referenceID = request.params.referenceID;

		Access( )
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
						this.reply( response, 403, "failed", "access data does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/access/edit/:referenceID",
	function onEditAccess( request, response ){
		var referenceID = request.params.referenceID;

		var access = request.body;

		var property = Object.keys( access )[ 0 ];
		var value = access[ property ];

		Access( )
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

APP.all( "/api/:accessID/access/remove/:referenceID",
	function onRemoveAccess( request, response, next ){
		var referenceID = request.params.referenceID;

		Access( )
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
						this.reply( response, 403, "failed", "access data does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.delete( "/api/:accessID/access/remove/:referenceID",
	function onRemoveAccess( request, response ){
		var referenceID = request.params.referenceID;

		Access( )
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
						this.reply( response, 200, "failed", "cannot delete access data" );
					}
				} )
			.exists( referenceID );
	} );
