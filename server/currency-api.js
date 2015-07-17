var _ = require( "lodash" );

var Currency = CURRENCY;

APP.all( "/api/:accessID/currency/all",
	function onGetAllCurrency( request, response, next ){
		Currency( )
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
						this.reply( response, 403, "failed", "no currencies" );
					}
				} ) 
			.populated( );
	} );
APP.get( "/api/:accessID/currency/all",
	function onGetAllCurrency( request, response ){
		Currency( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, currencies ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", currencies );
					}
				} )
			.all( );
	} );

APP.all( "/api/:accessID/currency/:referenceID",
	function onGetCurrency( request, response, next ){
		var referenceID = request.params.referenceID;

		Currency( )
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
						this.reply( response, 200, "failed", "currency does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.get( "/api/:accessID/currency/:referenceID",
	function onGetCurrency( request, response ){
		var referenceID = request.params.referenceID;

		Currency( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, currency ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", currency );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.all( "/api/:accessID/currency/add",
	function onRegisterCurrency( request, response, next ){
		var currency = request.body;

		Currency( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( existing ){
						this.reply( response, 200, "failed", "currency already exists" );
						
					}else{
						next( );
					}
				} )
			.createReferenceID( currency )
			.exists( );
	} );

APP.post( "/api/:accessID/currency/add",
	function onAddCurrency( request, response ){
		var currency = request.body;

		Currency( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, currency ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": currency.referenceID } );
					}
				} )
			.createReferenceID( currency )
			.createCurrencyID( currency )
			.add( currency );
	} );

APP.put( "/api/:accessID/currency/update/:referenceID",
	function onUpdateCurrency( request, response ){
		var referenceID = request.params.referenceID;

		var currency = request.body;

		Currency( )
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
			.update( currency, referenceID );
	} );

APP.put( "/api/:accessID/currency/edit/:referenceID",
	function onEditCurrency( request, response ){
		var referenceID = request.params.referenceID;

		var currency = request.body;

		var property = Object.keys( currency )[ 0 ];
		var value = user[ currency ];

		Currency( )
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

APP.delete( "/api/:accessID/currency/remove/:referenceID",
	function onRemoveCurrency( request, response ){
		var referenceID = request.params.referenceID;

		Currency( )
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
						this.reply( response, 200, "failed", "cannot delete currency" );
					}
				} )
			.exists( referenceID );
	} );
