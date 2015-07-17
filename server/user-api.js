var _ = require( "lodash" );
var util = require( "util" );

var User = USER;

APP.all( "/api/:accessID/user/all",
	function onGetAllUser( request, response, next ){
		User( )
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
						this.reply( response, 403, "failed", "no users" );
					}
				} ) 
			.populated( );
	} );
APP.get( "/api/:accessID/user/all",
	function onGetAllUser( request, response ){
		User( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, users ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", users );
					}
				} )
			.all( );
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
						this.reply( response, 403, "failed", "user does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.get( "/api/:accessID/user/:referenceID",
	function onGetUser( request, response ){
		var referenceID = request.params.referenceID;

		User( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, user ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", user );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/user",
	function onGetUser( request, response, next ){
		var referenceID = request.session.user.referenceID;

		User( )
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
						this.reply( response, 403, "failed", "user does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.get( "/api/:accessID/user",
	function onGetUser( request, response ){
		var referenceID = request.session.user.referenceID;

		User( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, user ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", user );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/user/add",
	function onUserRegister( request, response, next ){
		var user = request.body;

		User( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, exists ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( exists ){
						this.reply( response, 403, "failed", "user already exists" );
						
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
			.register( user );
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

APP.put( "/api/:accessID/user/update/:referenceID",
	function onUpdateUser( request, response ){
		var referenceID = request.params.referenceID;

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
			.update( user, referenceID );
	} );

APP.put( "/api/:accessID/user/edit",
	function onEditUser( request, response ){
		var accessID = request.params.accessID;

		var user = request.body;

		var property = Object.keys( user )[ 0 ];
		var value = user[ property ];

		User( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, user ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success" );
					}
				} )
			.edit( property, value, accessID );
	} );

APP.put( "/api/:accessID/user/edit/:referenceID",
	function onEditUser( request, response ){
		var referenceID = request.params.referenceID;

		var user = request.body;

		var property = Object.keys( user )[ 0 ];
		var value = user[ property ];

		User( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, user ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success" );
					}
				} )
			.edit( property, value, referenceID );
	} );

APP.delete( "/api/:accessID/user/remove",
	function onRemoveUser( request, response ){
		var accessID = request.params.accessID;

		User( )
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
			.remove( accessID )
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
						this.reply( response, 200, "failed", "cannot delete user" );
					}
				} )
			.exists( accessID );
	} );

APP.delete( "/api/:accessID/user/remove/:referenceID",
	function onRemoveUser( request, response ){
		var referenceID = request.params.referenceID;

		User( )
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
						this.reply( response, 200, "failed", "cannot delete user" );
					}
				} )
			.exists( referenceID );
	} );
