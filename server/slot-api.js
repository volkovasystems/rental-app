var _ = require( "lodash" );

var Slot = SLOT;

APP.all( "/api/:accessID/slot/all",
	function onGetAllSlot( request, response, next ){
		Slot( )
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
						this.reply( response, 403, "failed", "no slot data" );
					}
				} ) 
			.populated( );
	} );
APP.get( "/api/:accessID/slot/all",
	function onGetAllSlot( request, response ){
		Slot( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, slots ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", slots );
					}
				} )
			.set( "accessID", accessID )
			.all( );
	} );

APP.all( "/api/:accessID/slot/:referenceID",
	function onGetSlot( request, response, next ){
		var referenceID = request.params.referenceID;

		Slot( )
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
						this.reply( response, 403, "failed", "slot data does not exists" );
					}
				} ) 
			.exists( referenceID );
	} );
APP.get( "/api/:accessID/slot/:referenceID",
	function onGetSlot( request, response ){
		var referenceID = request.params.referenceID;

		var accessID = request.params.accessID;

		Slot( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, slot ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", slot );
					}
				} )
			.set( "accessID", accessID )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/slot/only/:referenceID",
	function onGetSlotOnly( request, response, next ){
		var referenceID = request.params.referenceID;

		Slot( )
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
						this.reply( response, 403, "failed", "slot data does not exists" );
					}
				} ) 
			.exists( referenceID );
	} );
APP.get( "/api/:accessID/slot/only/:referenceID",
	function onGetSlotOnly( request, response ){
		var referenceID = request.params.referenceID;

		Slot( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, slot ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", slot );
					}
				} )
			.set( "slotOnly", true )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/slot/add",
	function onRegisterSlot( request, response, next ){
		var slot = request.body;

		Slot( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( existing ){
						this.reply( response, 200, "failed", "slot already exists" );
						
					}else{
						next( );
					}
				} )
			.createReferenceID( slot )
			.exists( );
	} );
APP.post( "/api/:accessID/slot/add",
	function onAddSlot( request, response ){
		var slot = request.body;

		Slot( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, slot ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": slot.referenceID } );
					}
				} )
			.createReferenceID( slot )
			.createSlotID( slot )
			.add( slot );
	} );

APP.put( "/api/:accessID/slot/update/:referenceID",
	function onUpdateSlot( request, response ){
		var referenceID = request.params.referenceID;

		var slot = request.body;

		Slot( )
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
			.update( slot, referenceID );
	} );

APP.put( "/api/:accessID/slot/edit/:referenceID",
	function onEditSlot( request, response ){
		var referenceID = request.params.referenceID;

		var slot = request.body;

		var property = Object.keys( slot )[ 0 ];
		var value = slot[ property ];

		Slot( )
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

APP.delete( "/api/:accessID/slot/remove/:referenceID",
	function onRemoveSlot( request, response ){
		var referenceID = request.params.referenceID;

		Slot( )
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
						this.reply( response, 200, "failed", "cannot delete slot" );
					}
				} )
			.exists( referenceID );
	} );
