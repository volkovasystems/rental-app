var _ = require( "lodash" );

APP.get( "/api/room/item/:reference",
	function onGetRoomItem( request, response ){
		var reference = request.params.reference;

		RoomItem( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomItem ){
					if( error ){
						this.response( 500, "error", error.message );

					}else if( _.isEmpty( roomItem ) ){
						this.response( 410, "failed", "room item does not exists" );

					}else{
						this.response( 200, "success", roomItem );
					}
				} )
			.set( "useCustomScope", true )
			.set( "scope", [
				"reference",
				"name",
				"title",
				"description"
			] )
			.refer( reference );
	} );

APP.all( "/api/:accessID/room/item/all",
	function onGetAllRoomItem( request, response, next ){
		RoomItem( )
			.setResponse( response );
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
						this.response( 403, "failed", "no room items" );
					}
				} )
			.populated( );
	} );
APP.get( "/api/:accessID/room/item/all",
	function onGetAllRoomItem( request, response ){
		var sort = request.query.sort;
		var total = request.query.total;

		var limit = request.query.limit;
		var index = request.query.index;
		
		var page = request.query.page;
		var size = request.query size;

		RoomItem( )
			.setResponse( response );
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomItems ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", roomItems );
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

APP.all( "/api/:accessID/room/item/add",
	function onAddRoomItem( request, response, next ){
		var roomItem = request.body;

		RoomItem( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( existing ){
						this.reply( response, 200, "failed", "room item already exists" );

					}else{
						next( );
					}
				} )
			.createReferenceID( roomItem )
			.exists( );
	} );
APP.post( "/api/:accessID/room/item/add",
	function onAddRoomItem( request, response ){
		var roomItem = request.body;

		RoomItem( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomItem ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": roomItem.referenceID } );
					}
				} )
			.createReferenceID( roomItem )
			.createRoomItemID( roomItem )
			.add( roomItem );
	} );

APP.all( "/api/:accessID/room/item/:referenceID",
	function onGetRoomItem( request, response, next ){
		var referenceID = request.params.referenceID;

		RoomItem( )
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
						this.response( 410, "failed", "room item does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.get( "/api/:accessID/room/item/:referenceID",
	function onGetRoomItem( request, response ){
		var referenceID = request.params.referenceID;

		RoomItem( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomItem ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", roomItem );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/room/item/update/:referenceID",
	function onUpdateRoomItem( request, response, next ){
		var referenceID = request.params.referenceID;

		RoomItem( )
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
						this.response( 403, "failed", "room item does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/room/item/update/:referenceID",
	function onUpdateRoomItem( request, response ){
		var referenceID = request.params.referenceID;

		var roomItem = request.body;

		RoomItem( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomItem ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", { "referenceID": roomItem.referenceID } );
					}
				} )
			.update( roomItem, referenceID );
	} );

APP.all( "/api/:accessID/room/item/edit/:referenceID",
	function onEditRoomItem( request, response, next ){
		var referenceID = request.params.referenceID;

		RoomItem( )
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
						this.response( 403, "failed", "room item does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/room/item/edit/:referenceID",
	function onEditRoomItem( request, response ){
		var referenceID = request.params.referenceID;

		var roomItem = request.body;

		var property = Object.keys( roomItem )[ 0 ];
		var value = roomItem[ property ];

		RoomItem( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomItem ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", { "referenceID": roomItem.referenceID } );
					}
				} )
			.edit( property, value, referenceID );
	} );

APP.all( "/api/:accessID/room/item/remove/:referenceID",
	function onRemoveRoomItem( request, response, next ){
		var referenceID = request.params.referenceID;

		RoomItem( )
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
						this.response( 403, "failed", "room item does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.delete( "/api/:accessID/room/item/remove/:referenceID",
	function onRemoveRoomItem( request, response ){
		var referenceID = request.params.referenceID;

		RoomItem( )
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
						this.response( 403, "failed", "room item was either deleted or not" );
					}
				} )
			.exists( referenceID );
	} );
