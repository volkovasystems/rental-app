var _ = require( "lodash" );
var util = require( "util" );

var Price = PRICE;

APP.all( "/api/:accessID/price/all",
	function onGetAllPrice( request, response, next ){
		Price( )
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
						this.reply( response, 403, "failed", "no prices" );
					}
				} ) 
			.populated( );
	} );
APP.get( "/api/:accessID/price/all",
	function onGetAllPrice( request, response ){
		Price( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, prices ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", prices );
					}
				} )
			.all( );
	} );

APP.get( "/api/:accessID/price/:referenceID",
	function onGetPrice( request, response ){
		var referenceID = request.params.referenceID;

		Price( )
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
						this.self.flush( ).reply( response, 200, "failed", "price does not exists" );
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
				function onResult( error, price ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", price );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.get( "/price/bound/to/:bound",
	function onGetPrice( request, response ){
		var bound = request.params.bound;

		Price( )
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
						this.self.flush( ).reply( response, 200, "failed", "price does not exists" );
					}
				} )
			.exists( bound )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, price ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", price );
					}
				} )
			.get( "references", bound );
	} );

APP.get( "/api/:accessID/price/bound/to/:bound",
	function onGetPrice( request, response ){
		var bound = request.params.bound;

		Price( )
			.clone( )
			.once( "error",
				function onError( error ){
					this.self.flush( ).reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.self.flush( ).reply( response, 500, "error", error.message );
					
					}else if( existing ){
						this.self.notify( );
						
					}else{
						this.self.flush( ).reply( response, 200, "failed", "price does not exists" );
					}
				} )
			.exists( bound )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, price ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", price );
					}
				} )
			.get( "references", bound );
	} );

APP.all( "/api/:accessID/price/add",
	function onRegisterPrice( request, response, next ){
		var price = request.body;

		Price( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( existing ){
						this.reply( response, 200, "failed", "price already exists" );
						
					}else{
						next( );
					}
				} )
			.createReferenceID( price )
			.exists( );
	} );

APP.post( "/api/:accessID/price/add",
	function onAddPrice( request, response ){
		var price = request.body;

		Price( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, price ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": price.referenceID } );
					}
				} )
			.createReferenceID( price )
			.createPriceID( price )
			.referenceBounds( price )
			.add( price );
	} );

APP.put( "/api/:accessID/price/update/:referenceID",
	function onUpdatePrice( request, response ){
		var referenceID = request.params.referenceID;

		var price = request.body;

		Price( )
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
			.referenceBounds( price )
			.update( price, referenceID );
	} );

APP.put( "/api/:accessID/price/edit/:referenceID",
	function onEditPrice( request, response ){
		var referenceID = request.params.referenceID;

		var price = request.body;

		var property = Object.keys( price )[ 0 ];
		var value = user[ price ];

		Price( )
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

APP.delete( "/api/:accessID/price/remove/:referenceID",
	function onRemovePrice( request, response ){
		var referenceID = request.params.referenceID;

		Price( )
			.clone( )
			.once( "error",
				function onError( error ){
					this.self.flush( ).reply( response, 500, "error", error.message );
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
						this.reply( response, 200, "failed", "cannot delete price" );
					}
				} )
			.exists( referenceID );
	} );

