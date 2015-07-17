var _ = require( "lodash" );

var Slot = SLOT;

/*:
	Get all slot at the specific place.
*/
APP.all( "/api/:accessID/slot/all/at/place/:place",
	function onGetAllSlotAtPlace( request, response, next ){
		var place = request.params.place;

		Slot( )
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
						this.reply( response, 200, "failed", "there are no slots in that place" );
					}
				} )
			.confirm( { "place": place } );
	} );
APP.get( "/api/:accessID/slot/all/at/place/:place",
	function onGetAllSlotAtPlace( request, response ){
		var place = request.params.place;

		Slot( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, slots ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", slots );
					}
				} )
			.set( "disableAppendParks", true )
			.set( "disableAppendPlaces", true )
			.get( "place", place );
	} );

/*:
	Get all slot available at the specific place.
*/
APP.all( "/api/:accessID/slot/available/all/at/place/:place",
	function onGetAvailableSlotAtPlace( request, response, next ){
		var place = request.params.place;

		Slot( )
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
						this.reply( response, 200, "failed", "there are no slots in that place" );
					}
				} )
			.confirm( { "place": place } );
	} );
APP.all( "/api/:accessID/slot/available/all/at/place/:place",
	function onGetAvailableSlotAtPlace( request, response, next ){
		var place = request.params.place;

		Slot( )
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
						this.reply( response, 200, "failed", "there are no available slots in that place" );
					}
				} )
			.confirm( { 
				"place": place,
				"status": "available" 
			} );
	} );
APP.get( "/api/:accessID/slot/available/all/at/place/:place",
	function onGetAvailableSlotAtPlace( request, response ){
		var place = request.params.place;

		Slot( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, slots ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", slots );
					}
				} )
			.set( "disableAppendParks", true )
			.set( "disableAppendPlaces", true )
			.set( "count", 1 )
			.get( "place", place );
	} );