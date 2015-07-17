var _ = require( "lodash" );

var ReserveState = RESERVE_STATE;

APP.get( "/api/:accessID/reserve/state/all",
	function onGetAllReserveState( request, response ){
		ReserveState( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, reserveStates ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( _.isEmpty( reserveStates ) ){
						this.reply( response, 200, "failed", "no reserve states" );

					}else{
						this.reply( response, 200, "success", reserveStates );
					}
				} )
			.all( );
	} );

APP.get( "/api/:accessID/reserve/state/:referenceID",
	function onGetReserveState( request, response ){
		var referenceID = request.params.referenceID;

		ReserveState( )
			.clone( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.self.flush( ).reply( response, 500, "error", error.message );
					
					}else if( existing ){
						this.self.notify( );
						
					}else{
						this.self.flush( ).reply( response, 200, "failed", "reserve state does not exists" );
					}
				} )
			.exists( referenceID )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, reserveState ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", reserveState );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/reserve/state/add",
	function onRegisterReserveState( request, response, next ){
		var reserveState = request.body;

		ReserveState( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( existing ){
						this.reply( response, 200, "failed", "reserve state already exists" );
						
					}else{
						next( );
					}
				} )
			.createReferenceID( reserveState )
			.exists( );
	} );
APP.post( "/api/:accessID/reserve/state/add",
	function onAddReserveState( request, response ){
		var reserveState = request.body;

		ReserveState( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, reserveState ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": reserveState.referenceID } );
					}
				} )
			.createReferenceID( reserveState )
			.createReserveID( reserveState )
			.add( reserveState );
	} );

APP.put( "/api/:accessID/reserve/state/update/:referenceID",
	function onUpdateReserve( request, response ){
		var referenceID = request.params.referenceID;

		var reserveState = request.body;

		ReserveState( )
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
			.update( reserveState, referenceID );
	} );

APP.put( "/api/:accessID/reserve/state/edit/:referenceID",
	function onEditReserveState( request, response ){
		var referenceID = request.params.referenceID;

		var reserveState = request.body;

		var property = Object.keys( reserveState )[ 0 ];
		var value = reserveState[ property ];

		ReserveState( )
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

APP.delete( "/api/:accessID/reserve/state/remove/:referenceID",
	function onRemoveReserveState( request, response ){
		var referenceID = request.params.referenceID;

		ReserveState( )
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
						this.reply( response, 200, "failed", "cannot delete reserve state" );
					}
				} )
			.exists( referenceID );
	} );
