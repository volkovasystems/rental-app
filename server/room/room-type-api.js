var _ = require( "lodash" );

APP.get( "/api/room/type/:reference",
	function onGetRoomType( request, response ){
		var reference = request.params.reference;

		RoomType( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomType ){
					if( error ){
						this.response( 500, "error", error.message );

					}else if( _.isEmpty( roomType ) ){
						this.response( 410, "failed", "room type does not exists" );

					}else{
						this.response( 200, "success", roomType );
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

APP.all( "/api/:accessID/room/type/all",
	function onGetAllRoomType( request, response, next ){
		RoomType( )
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
						this.response( 403, "failed", "no room types" );
					}
				} )
			.populated( );
	} );
APP.get( "/api/:accessID/room/type/all",
	function onGetAllRoomType( request, response ){
		var sort = request.query.sort;
		var total = request.query.total;

		var limit = request.query.limit;
		var index = request.query.index;
		
		var page = request.query.page;
		var size = request.query.size;

		RoomType( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomTypes ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", roomTypes );
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

APP.all( "/api/:accessID/room/type/add",
	function onAddRoomType( request, response, next ){
		var roomType = request.body;

		RoomType( )
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
						this.reply( response, 200, "failed", "room type already exists" );

					}else{
						next( );
					}
				} )
			.createReferenceID( roomType )
			.exists( );
	} );
APP.post( "/api/:accessID/room/type/add",
	function onAddRoomType( request, response ){
		var roomType = request.body;

		RoomType( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomType ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", { "referenceID": roomType.referenceID } );
					}
				} )
			.createReferenceID( roomType )
			.createRoomTypeID( roomType )
			.add( roomType );
	} );

APP.all( "/api/:accessID/room/type/:referenceID",
	function onGetRoomType( request, response, next ){
		var referenceID = request.params.referenceID;

		RoomType( )
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
						this.response( 410, "failed", "room type does not exists" );
					}
				} )
			.exists( );
	} );
APP.get( "/api/:accessID/room/type/:referenceID",
	function onGetRoomType( request, response ){
		var referenceID = request.params.referenceID;

		RoomType( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomType ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", roomType );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/room/type/update/:referenceID",
	function onUpdateRoomType( request, response, next ){
		var referenceID = request.params.referenceID;

		RoomType( )
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
						this.response( 403, "failed", "room type does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/room/type/update/:referenceID",
	function onUpdateRoomType( request, response ){
		var referenceID = request.params.referenceID;

		var roomType = request.body;

		RoomType( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomType ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", { "referenceID": roomType.referenceID } );
					}
				} )
			.update( roomType, referenceID );
	} );

APP.all( "/api/:accessID/room/type/edit/:referenceID",
	function onEditRoomType( request, response, next ){
		var referenceID = request.params.referenceID;

		RoomType( )
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
						this.response( 403, "failed", "room type does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/room/type/edit/:referenceID",
	function onEditRoomType( request, response ){
		var referenceID = request.params.referenceID;

		var roomType = request.body;

		var property = Object.keys( roomType )[ 0 ];
		var value = roomType[ property ];

		RoomType( )
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
						this.response( 200, "success", { "referenceID": roomType.referenceID } );
					}
				} )
			.edit( property, value, referenceID );
	} );

APP.all( "/api/:accessID/room/type/remove/:referenceID",
	function onRemoveRoomType( request, response, next ){
		var referenceID = request.params.referenceID;

		RoomType( )
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
						this.response( 403, "failed", "room type does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.delete( "/api/:accessID/room/type/remove/:referenceID",
	function onRemoveRoomType( request, response ){
		var referenceID = request.params.referenceID;

		RoomType( )
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
						this.response( 403, "failed", "room type was either deleted or not" );
					}
				} )
			.exists( referenceID );
	} );
