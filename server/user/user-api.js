var _ = require( "lodash" );
var util = require( "util" );

APP.get( "/api/user/:reference",
	function onGetUser( request, response ){
		var reference = request.params.reference;

		User( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, user ){
					if( error ){
						this.response( 500, "error", error.message );

					}else if( _.isEmpty( roomItem ) ){
						this.response( 410, "failed", "user does not exists" );

					}else{
						this.response( 200, "success", user );
					}
				} )
			.set( "useCustomScope", true )
			.set( "scope", [
				"reference",
				"displayName",
				"name",
				"title",
				"description",
				"tags"
			] )
			.refer( reference );
	} );

APP.all( "/api/:accessID/user/all",
	function onGetAllUser( request, response, next ){
		User( )
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
						this.response( 404, "failed", "no users" );
					}
				} )
			.populated( );
	} );
APP.get( "/api/:accessID/user/all",
	function onGetAllUser( request, response ){
		var sort = request.query.sort;
		var total = request.query.total;

		var limit = request.query.limit;
		var index = request.query.index;
		
		var page = request.query.page;
		var size = request.query.size;

		User( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, users ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", users );
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

APP.all( "/api/:accessID/user",
	function onGetUser( request, response, next ){
		var accessID = request.params.accessID;

		User( )
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
						this.response( 410, "failed", "user does not exists" );
					}
				} )
			.exists( accessID );
	} );
APP.get( "/api/:accessID/user",
	function onGetUser( request, response ){
		var accessID = request.params.accessID;

		User( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, user ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", user );
					}
				} )
			.pick( "accessID", accessID );
	} );

APP.all( "/api/:accessID/user/add",
	function onAddUser( request, response, next ){
		var user = request.body;

		User( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, exists ){
					if( error ){
						this.response( 500, "error", error.message );

					}else if( exists ){
						this.response( 403, "failed", "user already exists" );

					}else{
						next( );
					}
				} )
			.createReferenceID( user )
			.exists( );
	} );
APP.post( "/api/:accessID/user/add",
	function onAddUser( request, response ){
		var user = request.body;

		User( )
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
			.register( user );
	} );

APP.all( "/api/:accessID/user/update",
	function onUpdateUser( request, response, next ){
		var accessID = request.params.accessID;

		User( )
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
						this.response( 403, "failed", "user does not exists" );
					}
				} )
			.exists( accessID );
	} );
APP.put( "/api/:accessID/user/update",
	function onUpdateUser( request, response ){
		var accessID = request.params.accessID;

		var user = request.body;

		User( )
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
			.update( user, accessID );
	} );

APP.all( "/api/:accessID/user/update/:referenceID",
	function onUpdateUser( request, response, next ){
		var referenceID = request.params.referenceID;

		User( )
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
						this.response( 403, "failed", "user does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/user/update/:referenceID",
	function onUpdateUser( request, response ){
		var referenceID = request.params.referenceID;

		var user = request.body;

		User( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, user ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", { "referenceID": user.referenceID } );
					}
				} )
			.update( user, referenceID );
	} );

APP.all( "/api/:accessID/user/edit",
	function onEditUser( request, response, next ){
		var accessID = request.params.accessID;

		User( )
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
						this.response( 403, "failed", "user does not exists" );
					}
				} )
			.exists( accessID );
	} );
APP.put( "/api/:accessID/user/edit",
	function onEditUser( request, response ){
		var accessID = request.params.accessID;

		var user = request.body;

		var property = Object.keys( user )[ 0 ];
		var value = user[ property ];

		User( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, user ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", { "referenceID": user.referenceID } );
					}
				} )
			.edit( property, value, accessID );
	} );

APP.all( "/api/:accessID/user/edit/:referenceID",
	function onEditUser( request, response, next ){
		var referenceID = request.params.referenceID;

		User( )
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
						this.response( 403, "failed", "user does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/user/edit/:referenceID",
	function onEditUser( request, response ){
		var referenceID = request.params.referenceID;

		var user = request.body;

		var property = Object.keys( user )[ 0 ];
		var value = user[ property ];

		User( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, user ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success" );
					}
				} )
			.edit( property, value, referenceID );
	} );

APP.delete( "/api/:accessID/user/remove",
	function onRemoveUser( request, response ){
		var accessID = request.params.accessID;

		User( )
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
			.remove( accessID )
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
						this.response( 403, "failed", "user was either deleted or not" );
					}
				} )
			.exists( accessID );
	} );

/*:
	This will get the user information through
		the referenceID.

	This has administrative privileges.
*/
APP.all( "/api/:accessID/user/:referenceID",
	function onGetUser( request, response, next ){
		var referenceID = request.params.referenceID;

		User( )
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
						this.response( 410, "failed", "user does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.get( "/api/:accessID/user/:referenceID",
	function onGetUser( request, response ){
		var referenceID = request.params.referenceID;

		User( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, user ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", user );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/user/remove/:referenceID",
	function onRemoveUser( request, response, next ){
		var referenceID = request.params.referenceID;

		User( )
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
						this.response( 403, "failed", "user does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.delete( "/api/:accessID/user/remove/:referenceID",
	function onRemoveUser( request, response ){
		var referenceID = request.params.referenceID;

		User( )
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
						this.response( 403, "failed", "cannot delete user" );
					}
				} )
			.exists( referenceID );
	} );
