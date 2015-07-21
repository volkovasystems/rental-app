var _ = require( "lodash" );


APP.all( "/api/:accessID/worker/all",
	function onGetAllVehicle( request, response, next ){
		Worker( )
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
						this.reply( response, 403, "failed", "no workers" );
					}
				} ) 
			.populated( );
	} );
APP.get( "/api/:accessID/worker/all",
	function onGetAllWorker( request, response ){
		Worker( )
			.once( "result", 
				function onResult( error, workers ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", workers );
					}
				} )
			.all( );
	} );

APP.all( "/api/:accessID/worker/:referenceID",
	function onGetVehicle( request, response, next ){
		var referenceID = request.params.referenceID;

		Worker( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, exists ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( exists ){
						next( );

					}else{
						this.reply( response, 403, "failed", "worker does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.get( "/api/:accessID/worker/:referenceID",
	function onGetWorker( request, response ){
		Worker( )
			.once( "result",
				function onResult( error, worker ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", worker );
					}
				} )
			.get( "referenceID", request.params.referenceID );
	} );

APP.all( "/api/:accessID/worker/add",
	function onRegisterWorker( request, response ){
		var worker = request.body;

		Worker( )
			.once( "result",
				function onResult( error, exists ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( exists ){
						this.reply( response, 200, "failed", "worker-exists" );
						
					}else{
						next( );
					}
				} )
			.createReferenceID( worker )
			.exists( );
	} );
APP.post( "/api/:accessID/worker/add",
	function onAddWorker( request, response ){
		var worker = request.body;

		Worker( )
			.once( "result",
				function onResult( error ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success" );
					}
				} )
			.createReferenceID( worker )
			.createWorkerID( worker )	
			.add( worker );	
	} );

APP.put( "/api/:accessID/worker/update/:referenceID",
	function onUpdateWorker( request, response ){
		var referenceID = request.params.referenceID;

		var worker = request.body;

		Worker( )
			.once( "result", 
				function onResult( error ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success" );
					}
				} )
			.update( worker, referenceID );
	} );

APP.put( "/api/:accessID/worker/edit/:referenceID",
	function onEditWorker( request, response ){
		var referenceID = request.params.referenceID;

		var worker = request.body;

		var property = Object.keys( worker )[ 0 ];
		var value = worker[ property ];

		Worker( )
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

APP.delete( "/api/:accessID/worker/remove/:referenceID",
	function onRemoveWorker( request, response ){
		var referenceID = request.params.referenceID;

		Worker( )
			.clone( )
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
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( !existing ){
						this.reply( response, 200, "success" );
					
					}else{
						this.reply( response, 200, "failed" );
					}
				} )
			.exists( referenceID );
	} );