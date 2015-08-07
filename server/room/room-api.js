var _ = require( "lodash" );

APP.all( "/api/:accessID/room/all",
	function onGetAllRoom( request, response, next ){
		Room( )
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
						this.reply( response, 403, "failed", "no rooms" );
					}
				} )
			.populated( );
	} );
APP.get( "/api/:accessID/room/all",
	function onGetAllRoom( request, response ){
		var limit = request.query.limit;

		var index = request.query.index;

		var sort = request.query.sort;

		Room( )
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

APP.all( "/api/:accessID/room/add",
	function onAddRoom( request, response, next ){
		var room = request.body;

		Room( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( existing ){
						this.reply( response, 200, "failed", "room already exists" );

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

		var roomItems = room.roomItems;

		RoomItem( )
			.once( "result",
			 	function onResult( ){

				} )
			.resolveRoomItems( roomItems )
	} );
APP.post( "/api/:accessID/room/add",
	function onAddRoom( request, response ){
		var room = request.body;

		Room( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, room ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": room.referenceID } );
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
						this.reply( response, 403, "failed", "room does not exists" );
					}
				} )
			.exists( );
	} );
APP.get( "/api/:accessID/room/:referenceID",
	function onGetRoom( request, response ){
		var referenceID = request.params.referenceID;

		Room( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, room ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", room );
					}
				} )
			.pick( "referenceID", referenceID );
	} );



APP.all( "/api/:accessID/room/update/:referenceID",
	function onUpdateRoom( request, response, next ){
		var referenceID = request.params.referenceID;

		Room( )
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
						this.reply( response, 403, "failed", "room does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/room/update/:referenceID",
	function onUpdateRoom( request, response ){
		var referenceID = request.params.referenceID;

		var room = request.body;

		Room( )
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
			.update( room, referenceID );
	} );

APP.all( "/api/:accessID/room/edit/:referenceID",
	function onEditRoom( request, response, next ){
		var referenceID = request.params.referenceID;

		Room( )
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
						this.reply( response, 403, "failed", "room does not exists" );
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

APP.all( "/api/:accessID/room/remove/:referenceID",
	function onRemoveRoom( request, response, next ){
		var referenceID = request.params.referenceID;

		Room( )
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
						this.reply( response, 403, "failed", "room does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.delete( "/api/:accessID/room/remove/:referenceID",
	function onRemoveRoom( request, response ){
		var referenceID = request.params.referenceID;

		Room( )
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
						this.reply( response, 200, "failed", "cannot delete room" );
					}
				} )
			.exists( referenceID );
	} );
