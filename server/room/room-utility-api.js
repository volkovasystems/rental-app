var _ = require( "lodash" );

APP.get( "/api/room/utility/:reference",
	function onGetRoomUtility( request, response ){
		var reference = request.params.reference;

		RoomUtility( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomUtility ){
					if( error ){
						this.response( 500, "error", error.message );

					}else if( _.isEmpty( roomUtility ) ){
						this.response( 410, "failed", "room utility does not exists" );

					}else{
						this.response( 200, "success", roomUtility );
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

APP.all( "/api/:accessID/room/utility/all",
	function onGetAllRoomUtility( request, response, next ){
		RoomUtility( )
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
						this.response( 403, "failed", "no room utilitys" );
					}
				} )
			.populated( );
	} );
APP.get( "/api/:accessID/room/utility/all",
	function onGetAllRoomUtility( request, response ){
		var sort = request.query.sort;
		var total = request.query.total;

		var limit = request.query.limit;
		var index = request.query.index;
		
		var page = request.query.page;
		var size = request.query.size;

		RoomUtility( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomUtilitys ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", roomUtilitys );
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

APP.all( "/api/:accessID/room/utility/add",
	function onAddRoomUtility( request, response, next ){
		var roomUtility = request.body;

		RoomUtility( )
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
						this.reply( response, 200, "failed", "room utility already exists" );

					}else{
						next( );
					}
				} )
			.createReferenceID( roomUtility )
			.exists( );
	} );
APP.post( "/api/:accessID/room/utility/add",
	function onAddRoomUtility( request, response ){
		var roomUtility = request.body;

		RoomUtility( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomUtility ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", { "referenceID": roomUtility.referenceID } );
					}
				} )
			.createReferenceID( roomUtility )
			.createRoomUtilityID( roomUtility )
			.add( roomUtility );
	} );

APP.all( "/api/:accessID/room/utility/:referenceID",
	function onGetRoomUtility( request, response, next ){
		var referenceID = request.params.referenceID;

		RoomUtility( )
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
						this.response( 410, "failed", "room utility does not exists" );
					}
				} )
			.exists( );
	} );
APP.get( "/api/:accessID/room/utility/:referenceID",
	function onGetRoomUtility( request, response ){
		var referenceID = request.params.referenceID;

		RoomUtility( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomUtility ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", roomUtility );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/room/utility/update/:referenceID",
	function onUpdateRoomUtility( request, response, next ){
		var referenceID = request.params.referenceID;

		RoomUtility( )
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
						this.response( 403, "failed", "room utility does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/room/utility/update/:referenceID",
	function onUpdateRoomUtility( request, response ){
		var referenceID = request.params.referenceID;

		var roomUtility = request.body;

		RoomUtility( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomUtility ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", { "referenceID": roomUtility.referenceID } );
					}
				} )
			.update( roomUtility, referenceID );
	} );

APP.all( "/api/:accessID/room/utility/edit/:referenceID",
	function onEditRoomUtility( request, response, next ){
		var referenceID = request.params.referenceID;

		RoomUtility( )
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
						this.response( 403, "failed", "room utility does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/room/utility/edit/:referenceID",
	function onEditRoomUtility( request, response ){
		var referenceID = request.params.referenceID;

		var roomUtility = request.body;

		var property = Object.keys( roomUtility )[ 0 ];
		var value = roomUtility[ property ];

		RoomUtility( )
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
						this.response( 200, "success", { "referenceID": roomUtility.referenceID } );
					}
				} )
			.edit( property, value, referenceID );
	} );

APP.all( "/api/:accessID/room/utility/remove/:referenceID",
	function onRemoveRoomUtility( request, response, next ){
		var referenceID = request.params.referenceID;

		RoomUtility( )
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
						this.response( 403, "failed", "room utility does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.delete( "/api/:accessID/room/utility/remove/:referenceID",
	function onRemoveRoomUtility( request, response ){
		var referenceID = request.params.referenceID;

		RoomUtility( )
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
						this.response( 403, "failed", "room utility was either deleted or not" );
					}
				} )
			.exists( referenceID );
	} );
