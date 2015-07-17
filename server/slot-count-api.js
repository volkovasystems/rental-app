var _ = require( "lodash" );

var Slot = SLOT;

APP.all( "/api/:accessID/slot/count/at/place/:place",
	function onGetSlotCountAtPlace( request, response, next ){
		var place = request.params.place;

		Slot( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, placeHasSlots ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( placeHasSlots ){
						next( );

					}else{
						this.reply( response, 403, "failed", "there are no slots at this place" );
					}
				} )
			.has( place, "place" );
	} );
APP.get( "/api/:accessID/slot/count/at/place/:place",
	function onGetSlotCountAtPlace( request, response ){
		var place = request.params.place;

		Slot( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, totalSlotCount ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "totalSlotCount": totalSlotCount } );
					}
				} )
			.count( { "place": place } );
	} );

/*:
	This is an unsecured access.

	@todo:
		Please provide domain restriction.

		Only the place server and the admin
			can access this endpoint.
	@end-todo
*/
APP.all( "/slot/count/available/at/place/:place",
	function onGetSlotCountAtPlace( request, response, next ){
		var place = request.params.place;

		Slot( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, placeHasSlots ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( placeHasSlots ){
						next( );

					}else{
						this.reply( response, 403, "failed", "there are no slots at this place" );
					}
				} )
			.has( place, "place" );
	} );
APP.get( "/slot/count/available/at/place/:place",
	function onGetAvailableSlotCountAtPlace( request, response ){
		var place = request.params.place;

		Slot( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, availableSlotCount ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "availableSlotCount": availableSlotCount } );
					}
				} )
			.count( { 
				"place": place,
				"status": "available"
			} );
	} );

APP.all( "/api/:accessID/slot/count/available/at/place/:place",
	function onGetSlotCountAtPlace( request, response, next ){
		var place = request.params.place;

		Slot( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, placeHasSlots ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( placeHasSlots ){
						next( );

					}else{
						this.reply( response, 403, "failed", "there are no slots at this place" );
					}
				} )
			.has( place, "place" );
	} );
APP.get( "/api/:accessID/slot/count/available/at/place/:place",
	function onGetAvailableSlotCountAtPlace( request, response ){
		var place = request.params.place;

		Slot( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, availableSlotCount ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "availableSlotCount": availableSlotCount } );
					}
				} )
			.count( { 
				"place": place,
				"status": "available"
			} );
	} );

APP.all( "/api/:accessID/slot/count/occupied/at/place/:place",
	function onGetSlotCountAtPlace( request, response, next ){
		var place = request.params.place;

		Slot( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, placeHasSlots ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( placeHasSlots ){
						next( );

					}else{
						this.reply( response, 403, "failed", "there are no slots at this place" );
					}
				} )
			.has( place, "place" );
	} );
APP.get( "/api/:accessID/slot/count/occupied/at/place/:place",
	function onGetAvailableSlotCountAtPlace( request, response ){
		var place = request.params.place;

		Slot( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, occupiedSlotCount ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "occupiedSlotCount": occupiedSlotCount } );
					}
				} )
			.count( { 
				"place": place,
				"status": "occupied"
			} );
	} );

APP.all( "/api/:accessID/slot/count/pending/at/place/:place",
	function onGetSlotCountAtPlace( request, response, next ){
		var place = request.params.place;

		Slot( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, placeHasSlots ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( placeHasSlots ){
						next( );

					}else{
						this.reply( response, 403, "failed", "there are no slots at this place" );
					}
				} )
			.has( place, "place" );
	} );
APP.get( "/api/:accessID/slot/count/pending/at/place/:place",
	function onGetAvailableSlotCountAtPlace( request, response ){
		var place = request.params.place;

		Slot( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, pendingSlotCount ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "pendingSlotCount": pendingSlotCount } );
					}
				} )
			.count( { 
				"place": place,
				"status": "pending"
			} );
	} );