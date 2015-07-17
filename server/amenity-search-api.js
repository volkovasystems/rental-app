var _ = require( "lodash" );

var Amenity = AMENITY;

/*:
	This is the search endpoint that 
		executes search within the search scope
		for values the contains and matches.
*/
APP.post( "/api/:accessID/amenity/search",
	function onSearchAmenity( request, response ){
		var value = request.body.value;

		Amenity( )
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
			.search( value );
	} );

APP.post( "/api/:accessID/amenity/search/contains",
	function onSearchContainsAmenity( request, response ){
		var value = request.body.value;

		Amenity( )
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
			.contains( values );
	} );

APP.post( "/api/:accessID/amenity/search/matches",
	function onSearchContainsAmenity( request, response ){
		var value = request.body.value;

		Amenity( )
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
			.matches( value );
	} );