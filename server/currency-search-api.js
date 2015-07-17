var _ = require( "lodash" );

var Currency = CURRENCY;

/*:
	This is the search endpoint that 
		executes search within the search scope
		for values the contains and matches.
*/
APP.post( "/api/:accessID/currency/search",
	function onSearchCurrency( request, response ){
		var value = request.body.value;

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
			.search( value );
	} );

APP.post( "/api/:accessID/currency/search/contains",
	function onSearchContainsCurrency( request, response ){
		var value = request.body.value;

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
			.contains( values );
	} );

APP.post( "/api/:accessID/place/search/matches",
	function onSearchContainsCurrency( request, response ){
		var value = request.body.value;

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
			.matches( value );
	} );