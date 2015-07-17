var _ = require( "lodash" );

var PriceCategory = PRICE_CATEGORY;

APP.all( "/api/:accessID/price/category/all",
	function onGetAllPriceCategory( request, response, next ){
		PriceCategory( )
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
						this.reply( response, 403, "failed", "no price categories" );
					}
				} ) 
			.populated( );
	} );
APP.get( "/api/:accessID/price/category/all",
	function onGetAllPriceCategory( request, response ){
		PriceCategory( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, priceCategories ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", priceCategories );
					}
				} )
			.all( );
	} );

APP.all( "/api/:accessID/price/category/:referenceID",
	function onGetPriceCategory( request, response, next ){
		var referenceID = request.params.referenceID;

		PriceCategory( )
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
						this.reply( response, 403, "failed", "price category does not exists" );
					}
				} ) 
			.exists( );
	} );
APP.get( "/api/:accessID/price/category/:referenceID",
	function onGetPriceCategory( request, response ){
		var referenceID = request.params.referenceID;

		PriceCategory( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, priceCategory ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", priceCategory );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/price/category/add",
	function onAddPriceCategory( request, response, next ){
		var priceCategory = request.body;

		PriceCategory( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( existing ){
						this.reply( response, 200, "failed", "price category already exists" );
						
					}else{
						next( );
					}
				} )
			.createReferenceID( priceCategory )
			.exists( );
	} );
APP.post( "/api/:accessID/price/category/add",
	function onAddPriceCategory( request, response ){
		var priceCategory = request.body;

		PriceCategory( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, priceCategory ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": priceCategory.referenceID } );
					}
				} )
			.createReferenceID( priceCategory )
			.createPriceCategoryID( priceCategory )
			.add( priceCategory );
	} );

APP.put( "/api/:accessID/price/category/update/:referenceID",
	function onUpdatePriceCategory( request, response ){
		var referenceID = request.params.referenceID;

		var priceCategory = request.body;

		PriceCategory( )
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
			.update( priceCategory, referenceID );
	} );

APP.put( "/api/:accessID/price/category/edit/:referenceID",
	function onEditPriceCategory( request, response ){
		var referenceID = request.params.referenceID;

		var priceCategory = request.body;

		var property = Object.keys( priceCategory )[ 0 ];
		var value = priceCategory[ property ];

		PriceCategory( )
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

APP.delete( "/api/:accessID/price/category/remove/:referenceID",
	function onRemovePriceCategory( request, response ){
		var referenceID = request.params.referenceID;

		PriceCategory( )
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
						this.reply( response, 200, "failed", "cannot delete price category" );
					}
				} )
			.exists( referenceID );
	} );
