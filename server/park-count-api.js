var _ = require( "lodash" );

var Park = PARK;

APP.get( "/api/:accessID/park/count/in/place/:place",
	function onGetParkCountInPlace( request, response ){
		var place = request.params.place;

		Park( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, totalParkCount ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "totalParkCount": totalParkCount } );
					}
				} )
			.count( { "place": place } );
	} );