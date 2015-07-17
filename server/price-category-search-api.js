var _ = require( "lodash" );

var PriceCategory = PRICE_CATEGORY;

/*:
	This is the search endpoint that 
		executes search within the search scope
		for values the contains and matches.
*/
APP.post( "/api/:accessID/price/category/search",
	function onSearchPriceCategory( request, response ){
		var value = request.body.value;

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
			.search( value );
	} );

APP.post( "/api/:accessID/price/category/search/contains",
	function onSearchContainsPriceCategory( request, response ){
		var value = request.body.value;

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
			.contains( values );
	} );

APP.post( "/api/:accessID/price/category/search/matches",
	function onSearchContainsPriceCategory( request, response ){
		var value = request.body.value;

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
			.matches( value );
	} );