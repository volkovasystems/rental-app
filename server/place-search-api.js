var _ = require( "lodash" );

var Place = PLACE;

/*:
	This is the search endpoint that 
		executes search within the search scope
		for values the contains and matches.
*/
APP.post( "/api/:accessID/place/search",
	function onSearchPlace( request, response ){
		var value = request.body.value;

		Place( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, places ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", places );
					}
				} )
			.search( value );
	} );

APP.post( "/api/:accessID/place/search/contains",
	function onSearchContainsPlace( request, response ){
		var value = request.body.value;

		Place( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, places ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", places );
					}
				} )
			.contains( values );
	} );

APP.post( "/api/:accessID/place/search/matches",
	function onSearchContainsPlace( request, response ){
		var value = request.body.value;

		Place( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, places ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", places );
					}
				} )
			.matches( value );
	} );

/*:
	This search uses geolocation values with
		queries for longitude, latitude and distance radius.
*/
APP.post( "/api/:accessID/place/search/within",
	function onSearchContainsPlace( request, response ){
		var place = request.body;

		Place( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, places ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", places );
					}
				} );
	} );