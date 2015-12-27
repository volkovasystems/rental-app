var _ = require( "lodash" );

APP.get( "/api/room/utility/type/:reference",
	function onGetRoomUtilityType( request, response ){
		var reference = request.params.reference;

		RoomUtilityType( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomUtilityType ){
					if( error ){
						this.response( 500, "error", error.message );

					}else if( _.isEmpty( roomUtilityType ) ){
						this.response( 410, "failed", "room utility type does not exists" );

					}else{
						this.response( 200, "success", roomUtilityType );
					}
				} )
			.set( "useCustomScope", true )
			.set( "scope", [
				"reference",
				"unitSuffix",
				"unitName",
				"unitTitle",
				"name",
				"title",
				"description",
				"tags"
			] )
			.refer( reference );
	} );

APP.all( "/api/:accessID/room/utility/type/all",
	function onGetAllRoomUtilityType( request, response, next ){
		RoomUtilityType( )
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
						this.response( 403, "failed", "no room utility types" );
					}
				} )
			.populated( );
	} );
APP.get( "/api/:accessID/room/utility/type/all",
	function onGetAllRoomUtilityType( request, response ){
		var sort = request.query.sort;
		var total = request.query.total;

		var limit = request.query.limit;
		var index = request.query.index;
		
		var page = request.query.page;
		var size = request.query.size;

		RoomUtilityType( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomUtilityTypes ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", roomUtilityTypes );
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

APP.all( "/api/:accessID/room/utility/type/add",
	function onAddRoomUtilityType( request, response, next ){
		var roomUtilityType = request.body;

		RoomUtilityType( )
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
						this.reply( response, 200, "failed", "room utility type already exists" );

					}else{
						next( );
					}
				} )
			.createReferenceID( roomUtilityType )
			.exists( );
	} );
APP.post( "/api/:accessID/room/utility/type/add",
	function onAddRoomUtilityType( request, response ){
		var roomUtilityType = request.body;

		RoomUtilityType( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomUtilityType ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", { "referenceID": roomUtilityType.referenceID } );
					}
				} )
			.createReferenceID( roomUtilityType )
			.createRoomUtilityTypeID( roomUtilityType )
			.add( roomUtilityType );
	} );

APP.all( "/api/:accessID/room/utility/type/:referenceID",
	function onGetRoomUtilityType( request, response, next ){
		var referenceID = request.params.referenceID;

		RoomUtilityType( )
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
						this.response( 410, "failed", "room utility type does not exists" );
					}
				} )
			.exists( );
	} );
APP.get( "/api/:accessID/room/utility/type/:referenceID",
	function onGetRoomUtilityType( request, response ){
		var referenceID = request.params.referenceID;

		RoomUtilityType( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomUtilityType ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", roomUtilityType );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/room/utility/type/update/:referenceID",
	function onUpdateRoomUtilityType( request, response, next ){
		var referenceID = request.params.referenceID;

		RoomUtilityType( )
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
						this.response( 403, "failed", "room utility type does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/room/utility/type/update/:referenceID",
	function onUpdateRoomUtilityType( request, response ){
		var referenceID = request.params.referenceID;

		var roomUtilityType = request.body;

		RoomUtilityType( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, roomUtilityType ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", { "referenceID": roomUtilityType.referenceID } );
					}
				} )
			.update( roomUtilityType, referenceID );
	} );

APP.all( "/api/:accessID/room/utility/type/edit/:referenceID",
	function onEditRoomUtilityType( request, response, next ){
		var referenceID = request.params.referenceID;

		RoomUtilityType( )
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
						this.response( 403, "failed", "room utility type does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/room/utility/type/edit/:referenceID",
	function onEditRoomUtilityType( request, response ){
		var referenceID = request.params.referenceID;

		var roomUtilityType = request.body;

		var property = Object.keys( roomUtilityType )[ 0 ];
		var value = roomUtilityType[ property ];

		RoomUtilityType( )
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
						this.response( 200, "success", { "referenceID": roomUtilityType.referenceID } );
					}
				} )
			.edit( property, value, referenceID );
	} );

APP.all( "/api/:accessID/room/utility/type/remove/:referenceID",
	function onRemoveRoomUtilityType( request, response, next ){
		var referenceID = request.params.referenceID;

		RoomUtilityType( )
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
						this.response( 403, "failed", "room utility type does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.delete( "/api/:accessID/room/utility/type/remove/:referenceID",
	function onRemoveRoomUtilityType( request, response ){
		var referenceID = request.params.referenceID;

		RoomUtilityType( )
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
						this.response( 403, "failed", "room utility type was either deleted or not" );
					}
				} )
			.exists( referenceID );
	} );
