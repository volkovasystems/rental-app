var _ = require( "lodash" );
var S = require( "string" );

var slotStatus = [
	"available",
	"occupied",
	"pending",
	"closed"
].map( function onEachStatus( status ){
	return {
		"name": status,
		"title": S( status ).humanize( ).toString( )
	};
} );

global.SLOT_STATUS = ( function( ){
	var slotStatusData = { };

	var slotStatusLength = slotStatus.length;
	var status = null;
	for( var index = 0; index < slotStatusLength; index++ ){
		status = slotStatus[ index ];

		slotStatusData[ status.name ] = status;
	}

	return slotStatusData;
} )( );

APP.get( "/api/:accessID/slot/status/all",
	function onGetAllSlotStatus( request, response ){
		response
			.status( 200 )
			.json( {
				"status": "success",
				"data": slotStatus
			} );
	} );

var Slot = SLOT;

APP.put( "/api/:accessID/slot/:referenceID/set/available",
	function onSlotSetAvailable( request, response ){
		var referenceID = request.params.referenceID;

		Slot( )
			.clone( )
			.once( "error",
				function onError( error ){
					this.self.flush( ).reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error ){
					if( error ){
						this.self.flush( ).reply( response, 500, "error", error.message );

					}else{
						this.self.notify( );
					}
				} )
			.edit( "status", "available", referenceID )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, confirmed ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( confirmed ){
						this.reply( response, 200, "success" );

					}else{
						this.reply( response, 403, "failed", "failed to set slot to available" );
					}
				} )
			.confirm( {
				"referenceID": referenceID,
				"status": "available"
			} );
	} );

APP.put( "/api/:accessID/slot/:referenceID/set/pending",
	function onSlotSetPending( request, response ){
		var referenceID = request.params.referenceID;

		Slot( )
			.clone( )
			.once( "error",
				function onError( error ){
					this.self.flush( ).reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error ){
					if( error ){
						this.self.flush( ).reply( response, 500, "error", error.message );

					}else{
						this.self.notify( );
					}
				} )
			.edit( "status", "pending", referenceID )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, confirmed ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( confirmed ){
						this.reply( response, 200, "success" );

					}else{
						this.reply( response, 403, "failed", "failed to set slot to pending" );
					}
				} )
			.confirm( {
				"referenceID": referenceID,
				"status": "pending"
			} );
	} );

APP.put( "/api/:accessID/slot/:referenceID/set/occupied",
	function onSlotSetOccupied( request, response ){
		var referenceID = request.params.referenceID;

		Slot( )
			.clone( )
			.once( "error",
				function onError( error ){
					this.self.flush( ).reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error ){
					if( error ){
						this.self.flush( ).reply( response, 500, "error", error.message );

					}else{
						this.self.notify( );
					}
				} )
			.edit( "status", "occupied", referenceID )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, confirmed ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( confirmed ){
						this.reply( response, 200, "success" );

					}else{
						this.reply( response, 403, "failed", "failed to set slot to occupied" );
					}
				} )
			.confirm( {
				"referenceID": referenceID,
				"status": "occupied"
			} );
	} );

APP.put( "/api/:accessID/slot/:referenceID/set/closed",
	function onSlotSetClosed( request, response ){
		var referenceID = request.params.referenceID;

		Slot( )
			.clone( )
			.once( "error",
				function onError( error ){
					this.self.flush( ).reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error ){
					if( error ){
						this.self.flush( ).reply( response, 500, "error", error.message );

					}else{
						this.self.notify( );
					}
				} )
			.edit( "status", "closed", referenceID )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, confirmed ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( confirmed ){
						this.reply( response, 200, "success" );

					}else{
						this.reply( response, 403, "failed", "failed to set slot to closed" );
					}
				} )
			.confirm( {
				"referenceID": referenceID,
				"status": "closed"
			} );
	} );