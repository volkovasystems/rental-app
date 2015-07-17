var _ = require( "lodash" );
var unirest = require( "unirest" );
var util = require( "util" );

var Reserve = RESERVE;

APP.all( "/api/:accessID/reserve/:referenceID/transaction/done",
	function onDoneReserveTransaction( request, response, next ){
		var referenceID = request.params.referenceID

		console.log( "TRANSACTION DONE!", referenceID );

		Reserve( )
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
						this.reply( response, 403, "failed", "reservation data does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.post( "/api/:accessID/reserve/:referenceID/transaction/done",
	function onDoneReserveTransaction( request, response ){
		var referenceID = request.params.referenceID

		var reserve = {
			"transaction": request.body.transaction || request.body.paymentID,
			"states": [ 
				"payment-done",
				"reservation-ready",
				"parking-applicable"
			]
		};

		reserve.states.exempt = [ 
			"reservation-pending", 
			"parking-on-hold",
			"payment-pending"
		];

		console.log( "TRANSACTION UPDATING!", request.body );

		Reserve( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, reserve ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": reserve.referenceID } );
					}

					console.log( "TRANSACTION UPDATED!", util.inspect( reserve ) );
				} )
			.update( reserve, referenceID );
	} );

APP.all( "/api/:accessID/reserve/:referenceID/transaction/failed",
	function onFailedReserveTransaction( request, response, next ){
		var referenceID = request.params.referenceID

		Reserve( )
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
						this.reply( response, 403, "failed", "reservation data does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.all( "/api/:accessID/reserve/:referenceID/transaction/failed",
	function onFailedReserveTransaction( request, response, next ){
		var referenceID = request.params.referenceID;

		var accessID = request.params.accessID;

		Reserve( )
			.set( "accessID", accessID )
			.clone( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, transaction ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.self.notify( transaction );
					}
				} )
			.pick( "referenceID", referenceID )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, result, failureMessage ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( result ){
						this.reply( response, 200, "success" );
					
					}else{
						this.reply( response, 403, "failed", failureMessage );
					}
				} )
			.execute( function revertSlotToAvailable( transaction ){
				unirest
					.put( SLOT_SERVER_URL
						.join( "/api/@accessID/slot/@slot/set/available"
							.replace( "@accessID", this.accessID )
							.replace( "@slot", transaction.slot ) )
						.path( ) )

					.end( ( function onResponse( response ){
						if( "error" in response && 
							response.error &&
							response.status >= 500 )
						{
							var error = new Error( response.error );

							this.result( error );

							return;
						}

						var status = response.body.status;

						if( status == "error" ){
							var error = new Error( response.body.data );

							this.result( error );
							
						}else if( status == "failed" ){
							this.result( null, false, response.body.data );

						}else{
							this.result( null, response.body.data );
						}
					} ).bind( this ) );
			} );
	} );
APP.post( "/api/:accessID/reserve/:referenceID/transaction/failed",
	function onFailedReserveTransaction( request, response ){
		var referenceID = request.params.referenceID;

		var reserve = {
			"transaction": request.body.transaction || request.body.paymentID,
			"states": "payment-failed"
		};

		Reserve( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, reserve ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": reserve.referenceID } );
					}
				} )
			.update( reserve, referenceID );
	} );

APP.all( "/api/:accessID/reserve/:referenceID/transaction/aborted",
	function onAbortedReserveTransaction( request, response, next ){
		var referenceID = request.params.referenceID

		Reserve( )
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
						this.reply( response, 403, "failed", "reservation data does not exists" );
					}
				} )
			.exists( referenceID );
	} );
APP.all( "/api/:accessID/reserve/:referenceID/transaction/aborted",
	function onFailedReserveTransaction( request, response, next ){
		var referenceID = request.params.referenceID;

		var accessID = request.params.accessID;

		Reserve( )
			.set( "accessID", accessID )
			.clone( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, transaction ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.self.notify( transaction );
					}
				} )
			.pick( "referenceID", referenceID )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, result, failureMessage ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( result ){
						this.reply( response, 200, "success" );
					
					}else{
						this.reply( response, 403, "failed", failureMessage );
					}
				} )
			.execute( function revertSlotToAvailable( transaction ){
				unirest
					.put( SLOT_SERVER_URL
						.join( "/api/@accessID/slot/@slot/set/available"
							.replace( "@accessID", this.accessID )
							.replace( "@slot", transaction.slot ) )
						.path( ) )

					.end( ( function onResponse( response ){
						if( "error" in response && 
							response.error &&
							response.status >= 500 )
						{
							var error = new Error( response.error );

							this.result( error );

							return;
						}

						var status = response.body.status;

						if( status == "error" ){
							var error = new Error( response.body.data );

							this.result( error );
							
						}else if( status == "failed" ){
							this.result( null, false, response.body.data );

						}else{
							this.result( null, response.body.data );
						}
					} ).bind( this ) );
			} );
	} );
APP.post( "/api/:accessID/reserve/:referenceID/transaction/aborted",
	function onAbortedReserveTransaction( request, response ){
		var referenceID = request.params.referenceID

		var reserve = {
			"transaction": request.body.transaction || request.body.paymentID,
			"states": [ 
				"payment-aborted",
				"reservation-closed"
			]
		};

		reserve.states.exempt = [ 
			"reservation-pending", 
			"parking-on-hold",
			"payment-pending"
		];

		Reserve( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, reserve ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": reserve.referenceID } );
					}
				} )
			.update( reserve, referenceID );
	} );