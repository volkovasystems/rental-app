var _ = require( "lodash" );

APP.all( "/api/:accessID/invoice/all",
	function onGetAllInvoice( request, response, next ){
		Invoice( )
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
						this.reply( response, 403, "failed", "no amenities" );
					}
				} )
			.populated( );
	} );
APP.get( "/api/:accessID/invoice/all",
	function onGetAllInvoice( request, response ){
		var limit = request.query.limit;

		var index = request.query.index;

		var sort = request.query.sort;

		Invoice( )
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

APP.all( "/api/:accessID/invoice/:referenceID",
	function onGetInvoice( request, response, next ){
		var referenceID = request.params.referenceID;

		Invoice( )
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
						this.reply( response, 403, "failed", "invoice does not exists" );
					}
				} )
			.exists( );
	} );
APP.get( "/api/:accessID/invoice/:referenceID",
	function onGetInvoice( request, response ){
		var referenceID = request.params.referenceID;

		Invoice( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, invoice ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", invoice );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/invoice/add",
	function onAddInvoice( request, response, next ){
		var invoice = request.body;

		Invoice( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( existing ){
						this.reply( response, 200, "failed", "invoice already exists" );

					}else{
						next( );
					}
				} )
			.createReferenceID( invoice )
			.exists( );
	} );
APP.post( "/api/:accessID/invoice/add",
	function onAddInvoice( request, response ){
		var invoice = request.body;

		Invoice( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, invoice ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": invoice.referenceID } );
					}
				} )
			.createReferenceID( invoice )
			.createInvoiceID( invoice )
			.add( invoice );
	} );

APP.all( "/api/:accessID/invoice/update/:referenceID",
	function onUpdateInvoice( request, response, next ){
		var referenceID = request.params.referenceID;

		Invoice( )
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
						this.reply( response, 403, "failed", "invoice does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/invoice/update/:referenceID",
	function onUpdateInvoice( request, response ){
		var referenceID = request.params.referenceID;

		var invoice = request.body;

		Invoice( )
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
			.update( invoice, referenceID );
	} );

APP.all( "/api/:accessID/invoice/edit/:referenceID",
	function onEditInvoice( request, response, next ){
		var referenceID = request.params.referenceID;

		Invoice( )
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
						this.reply( response, 403, "failed", "invoice does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/invoice/edit/:referenceID",
	function onEditInvoice( request, response ){
		var referenceID = request.params.referenceID;

		var invoice = request.body;

		var property = Object.keys( invoice )[ 0 ];
		var value = invoice[ property ];

		Invoice( )
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

APP.all( "/api/:accessID/invoice/remove/:referenceID",
	function onRemoveInvoice( request, response, next ){
		var referenceID = request.params.referenceID;

		Invoice( )
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
						this.reply( response, 403, "failed", "invoice does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.delete( "/api/:accessID/invoice/remove/:referenceID",
	function onRemoveInvoice( request, response ){
		var referenceID = request.params.referenceID;

		Invoice( )
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
						this.reply( response, 200, "failed", "cannot delete invoice" );
					}
				} )
			.exists( referenceID );
	} );
