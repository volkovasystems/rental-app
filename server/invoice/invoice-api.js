var _ = require( "lodash" );
var Room = require( "../room/room.js" );

APP.get( "/api/invoice/:reference",
	function onGetInvoice( request, response ){
		var reference = request.params.reference;

		Invoice( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, invoiceer ){
					if( error ){
						this.response( 500, "error", error.message );

					}else if( _.isEmpty( invoiceer ) ){
						this.response( 410, "failed", "invoice does not exists" );

					}else{
						this.response( 200, "success", invoiceer );
					}
				} )
			.set( "useCustomScope", true )
			.set( "scope", [
				"reference",
				"moveInDate",
				"duration.description",
				"roomPrice",
				
				"room.buildingNumber",
				"room.roomNumber",
				"room.roomSize",
				"room.name",
				"room.title",
				"room.description",
				"room.tags",
				
				"invoiceer.displayName",
				"invoiceer.guests.displayName",
				"invoiceer.name",
				"invoiceer.title",
				"invoiceer.description",

				"name",
				"title",
				"description",
				"tags"
			] )
			.refer( reference );
	} );

APP.all( "/api/:accessID/invoice/all",
	function onGetAllInvoice( request, response, next ){
		Invoice( )
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
						this.response( 404, "failed", "no invoices" );
					}
				} ) 
			.populated( );
	} );
APP.get( "/api/:accessID/invoice/all",
	function onGetAllInvoice( request, response ){
		var sort = request.query.sort;
		var total = request.query.total;

		var limit = request.query.limit;
		var index = request.query.index;
		
		var page = request.query.page;
		var size = request.query.size;

		Invoice( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, response ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", response );
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

APP.all( "/api/:accessID/invoice/add",
	function onAddInvoice( request, response, next ){
		var invoice = request.body;

		Invoice( )
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
						this.response( 200, "failed", "invoice already exists" );
						
					}else{
						next( );
					}
				} )
			.createReferenceID( invoice )
			.exists( );
	} );
APP.all( "/api/:accessID/invoice/add",
	function onAddInvoice( request, response, next ){
		var invoice = request.body;

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
						next( )

					}else{
						this.response( 403, "failed", "room does not exists" );
					}
				} )
			.exists( invoice.room );
	} );
APP.all( "/api/:accessID/invoice/add",
	function onAddInvoice( request, response, next ){
		var invoice = request.body;

		Invoiceer( )
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
						next( )

					}else{
						this.response( 403, "failed", "invoiceer does not exists" );
					}
				} )
			.exists( invoice.invoiceer );
	} );
APP.post( "/api/:accessID/invoice/add",
	function onAddInvoice( request, response ){
		var invoice = request.body;

		Invoice( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, invoice ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", { "referenceID": invoice.referenceID } );
					}
				} )
			.createReferenceID( invoice )
			.createInvoiceID( invoice )
			.add( invoice );
	} );

APP.all( "/api/:accessID/invoice/:referenceID",
	function onGetInvoice( request, response, next ){
		var referenceID = request.params.referenceID;

		Invoice( )
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
						this.response( 410, "failed", "invoice does not exists" );
					}
				} ) 
			.exists( );
	} );
APP.get( "/api/:accessID/invoice/:referenceID",
	function onGetInvoice( request, response ){
		var referenceID = request.params.referenceID;

		Invoice( )
			.setResponse( response )
			.once( "error",
				function onError( error ){
					this.response( 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, invoice ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success", invoice );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/invoice/update/:referenceID",
	function onUpdateInvoice( request, response, next ){
		var referenceID = request.params.referenceID;

		Invoice( )
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
						this.response( 403, "failed", "invoice does not exists" );
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
					this.response( 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error ){
					if( error ){
						this.response( 500, "error", error.message );

					}else{
						this.response( 200, "success" );
					}
				} )
			.update( invoice, referenceID );
	} );

APP.all( "/api/:accessID/invoice/edit/:referenceID",
	function onEditInvoice( request, response, next ){
		var referenceID = request.params.referenceID;

		Invoice( )
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
						this.response( 403, "failed", "invoice does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.put( "/api/:accessID/invoice/edit/:referenceID",
	function onEditInvoice( request, response ){
		var referenceID = request.params.referenceID;

		var invoice = request.body || { };

		var property = Object.keys( invoice )[ 0 ] || request.body.property;
		var value = invoice[ property ] || request.body.value;

		Invoice( )
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
						this.response( 200, "success" );
					}
				} )
			.edit( property, value, referenceID );
	} );

APP.all( "/api/:accessID/invoice/remove/:referenceID",
	function onRemoveInvoice( request, response, next ){
		var referenceID = request.params.referenceID;

		Invoice( )
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
						this.response( 403, "failed", "invoice does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.delete( "/api/:accessID/invoice/remove/:referenceID",
	function onRemoveInvoice( request, response ){
		var referenceID = request.params.referenceID;

		Invoice( )
			.setResponse( response )
			.clone( )
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
						this.response( 403, "failed", "invoice was either deleted or not" );
					}
				} )
			.exists( referenceID );
	} );