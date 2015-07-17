var _ = require( "lodash" );

var Slot = SLOT;

APP.all( "/api/:accessID/slot/available/reserve/at/place/:place",
	function onReserveAvailableSlotAtPlace( request, response, next ){
		var place = request.params.place;
		
		Slot( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, hasAvailableSlots ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( hasAvailableSlots ){
						next( );

					}else{
						this.reply( response, 403, "failed", "there are no slots available at that place" );
					}
				} )
			.confirm( {
				"place": place,
				"status": "available"
			} );
	} );
APP.get( "/api/:accessID/slot/available/reserve/at/place/:place",
	function onReserveAvailableSlotAtPlace( request, response ){
		var place = request.params.place;
		
		Slot( )
			.clone( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, slots ){
					if( error ){
						this.self.flush( ).reply( response, 500, "error", error.message );

					}else{
						var slot = _.first( slots );

						this.self.set( "referenceID", slot.referenceID );

						this.self.notify( );
					}
				} )
			.set( "query", { "place": place } )
			.set( "limit", 1 )
			.edit( "status", "pending" )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, slot ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", slot );
					}
				} )
			.pick( );
	} );