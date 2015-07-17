var _ = require( "lodash" );

var Park = PARK;

APP.all( "/api/:accessID/park/all/at/place/:place",
	function onGetAllParkAtPlace( request, response, next ){
		var place = request.params.place;

		Park( )
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
						this.reply( response, 200, "failed", "there are no parks in that place" );
					}
				} )
			.confirm( { "place": place } );
	} );
APP.get( "/api/:accessID/park/all/at/place/:place",
	function onGetAllParkAtPlace( request, response ){
		var place = request.params.place;

		Park( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, parks ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", parks );
					}
				} )
			.set( "disableAppendPlaces", true )
			.get( "place", place );
	} );