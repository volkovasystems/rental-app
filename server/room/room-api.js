var _ = require( "lodash" );

APP.get( "/api/room/:reference",
	function onGetRoom( request, response ){
		var reference = request.params.reference;

		Room( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, room ){
					if( error ){
						this.response( 500, "error", error.message );

					}else if( _.isEmpty( room ) ){
						this.response( 410, "failed", "room does not exists" );

					}else{
						this.response( 200, "success", room );
					}
				} )
			.set( "useCustomScope", true )
			.set( "scope", [
				"reference",

				"buildingNumber",
				"roomNumber",

				"roomSize",

				"name",
				"title",
				"description"
			] )
			.refer( reference );
	} );

APP.all( "/api/:accessID/room/all",
	function onGetAllRoom( request, response, next ){
		Room( )
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
						this.response( 404, "failed", "no rooms" );
					}
				} )
			.populated( );
	} );
APP.get( "/api/:accessID/room/all",
	function onGetAllRoom( request, response ){
		var sort = request.query.sort;
		var total = request.query.total;

		var limit = request.query.limit;
		var index = request.query.index;
		
		var page = request.query.page;
		var size = request.query size;
		
		Room( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, rooms ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", rooms );
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

APP.all( "/api/:accessID/room/add",
	function onAddRoom( request, response, next ){
		var room = request.body;

		Room( )
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
						this.response( 403, "failed", "room already exists" );

					}else{
						next( );
					}
				} )
			.createReferenceID( room )
			.exists( );
	} );
APP.all( "/api/:accessID/room/add",
	function onAddRoom( request, response, next ){
		var room = request.body;

		/*:
			This will be a list of room items in this format:
			[
				{
					"item": String,
					"count": Number
				},
				...
			]

			We need to preserve the references.
		*/
		var roomItems = room.roomItems;

		RoomItem( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
			 	function onResult( error, roomItems ){
			 		if( error ){
			 			this.response( 500, "error", error.message );	
			 		
			 		}else{
			 			request.roomItems = roomItems;

			 			next( );
			 		}
				} )
			.resolveRoomItems( roomItems )
	} );
APP.all( "/api/:accessID/room/add",
	function onAddRoom( request, response, next ){
		var room = request.body;

		var roomType = room.roomType;

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
			 			request.roomType = roomType;

			 			next( );
			 		}
				} )
			.resolveRoomType( roomType )
	} );
APP.post( "/api/:accessID/room/add",
	function onAddRoom( request, response ){
		var room = request.body;

		room.roomItems = request.roomItems;

		room.roomType = request.roomType;

		Room( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, room ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", { "referenceID": room.referenceID } );
					}
				} )
			.createReferenceID( room )
			.createRoomID( room )
			.add( room );
	} );

APP.all( "/api/:accessID/room/:referenceID",
	function onGetRoom( request, response, next ){
		var referenceID = request.params.referenceID;

		Room( )
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
						this.response( 410, "failed", "room does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.get( "/api/:accessID/room/:referenceID",
	function onGetRoom( request, response ){
		var referenceID = request.params.referenceID;

		Room( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, room ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", room );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/room/update/:referenceID",
	function onUpdateRoom( request, response, next ){
		var referenceID = request.params.referenceID;

		Room( )
			.setResponse( response );
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
						this.response( 403, "failed", "room does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/room/update/:referenceID",
	function onUpdateRoom( request, response ){
		var referenceID = request.params.referenceID;

		var room = request.body;

		Room( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, room ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", { "referenceID": room.referenceID } );
					}
				} )
			.update( room, referenceID );
	} );

APP.all( "/api/:accessID/room/edit/:referenceID",
	function onEditRoom( request, response, next ){
		var referenceID = request.params.referenceID;

		Room( )
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
						this.response( 403, "failed", "room does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/room/edit/:referenceID",
	function onEditRoom( request, response ){
		var referenceID = request.params.referenceID;

		var room = request.body;

		var property = Object.keys( room )[ 0 ];
		var value = room[ property ];

		Room( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, room ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", { "referenceID": room.referenceID } );
					}
				} )
			.edit( property, value, referenceID );
	} );

APP.all( "/api/:accessID/room/remove/:referenceID",
	function onRemoveRoom( request, response, next ){
		var referenceID = request.params.referenceID;

		Room( )
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
						this.response( 403, "failed", "room does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.delete( "/api/:accessID/room/remove/:referenceID",
	function onRemoveRoom( request, response ){
		var referenceID = request.params.referenceID;

		Room( )
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
						this.response( 403, "failed", "room was either deleted or not" );
					}
				} )
			.exists( referenceID );
	} );
