var _ = require( "lodash" );
var async = require( "async" );
var unirest = require( "unirest" );
var util = require( "util" );

var Reserve = RESERVE;

/*:
	First we need to get the slot, place and park.

	By getting the slot data, we can also get the place and park data.

	This will let us extract the price.
*/
APP.all( "/api/:accessID/reserve/now",
	function onReserve( request, response, next ){
		var accessID = request.params.accessID;

		var reserve = request.body;

		Reserve( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, slot, failureMessage ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( slot ){
						request.session.slot = slot;

						next( );

					}else{
						this.reply( response, 403, "failed", failureMessage );
					}
				} )
			.set( "accessID", accessID )
			.getReservedSlot( reserve.slot );
	} );
/*:
	Next we compute for the price, the price
		may be positive or negative.
*/
APP.all( "/api/:accessID/reserve/now",
	function onReserve( request, response, next ){
		var slot = request.session.slot;

		slot.park = slot.park || { };
		slot.place = slot.place || { };

		var totalPrice = _.flatten( [
			[ slot.price ],
			slot.prices,
			[ slot.park.price ],
			slot.park.prices,
			[ slot.place.price ],
			slot.place.prices
		] ).map( function onEachPrice( price ){
			price = price || { };

			return price.amount || 0;

		} ).reduce( function onEachPrice( previousValue, currentValue ){
			return previousValue + currentValue;
		} );

		request.session.totalPrice = totalPrice;

		request.session.park = slot.park.referenceID;

		request.session.place = slot.place.referenceID;

		next( );
	} );
APP.post( "/api/:accessID/reserve/now",
	function onReserve( request, response ){
		var reserve = request.body;

		reserve.totalPrice = request.session.totalPrice;

		reserve.park = request.session.park;

		reserve.place = request.session.place;

		reserve.reservationDate = Date.now( );

		reserve.states = [ 
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
			.createReferenceID( reserve )
			.createReserveID( reserve )
			.add( reserve );
	} );

APP.all( "/api/:accessID/reserve/all",
	function onGetAllSlot( request, response, next ){
		Reserve( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, isPopulated ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( isPopulated ){
						next( );

					}else{
						this.reply( response, 403, "failed", "no reservation data" );
					}
				} ) 
			.populated( );
	} );
APP.get( "/api/:accessID/reserve/all",
	function onGetAllReserve( request, response ){
		var accessID = request.params.accessID;

		var limit = request.query.limit;

		var index = request.query.index;

		var sort = request.query.sort;

		Reserve( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, reserves ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", reserves );
					}
				} )
			.set( "limit", limit )
			.set( "index", index )
			.set( "sort", sort )
			.all( );
	} );

APP.all( "/api/:accessID/reserve/all/of/user/:user",
	function onGetAllReserveOfUser( request, response, next ){
		var user = request.params.user;

		Reserve( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, hasReservations ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( isPopulated ){
						next( );

					}else{
						this.reply( response, 403, "failed", "no reservation data" );
					}
				} )
			.has( user, "user" );
	} );
APP.get( "/api/:accessID/reserve/all/of/user/:user",
	function onGetAllReserveOfUser( request, response ){
		var user = request.params.user;

		var accessID = request.params.accessID;

		var limit = request.query.limit;

		var index = request.query.index;

		var sort = request.query.sort;

		Reserve( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, reserves ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", reserves );
					}
				} )
			.set( "limit", limit )
			.set( "index", index )
			.set( "sort", sort )
			.set( "accessID", accessID )
			.get( "user", user );
	} );

APP.all( "/api/:accessID/reserve/all/of/user",
	function onGetAllReserveOfUser( request, response, next ){
		var user = request.session.user.referenceID;

		Reserve( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, hasReservations ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( hasReservations ){
						next( );

					}else{
						this.reply( response, 403, "failed", "no reservation data" );
					}
				} )
			.has( user, "user" );
	} );
APP.get( "/api/:accessID/reserve/all/of/user",
	function onGetAllReserveOfUser( request, response ){
		var user = request.session.user.referenceID;

		var accessID = request.params.accessID;

		var limit = request.query.limit;

		var index = request.query.index;

		var sort = request.query.sort;

		Reserve( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, reserves ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", reserves );
					}
				} )
			.set( "limit", limit )
			.set( "index", index )
			.set( "sort", sort )
			.set( "accessID", accessID )
			.get( "user", user );
	} );

APP.all( "/api/:accessID/reserve/add",
	function onRegisterReserve( request, response, next ){
		var reserve = request.body;

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
						this.reply( response, 200, "failed", "reserve already exists" );
						
					}else{
						next( );
					}
				} )
			.createReferenceID( reserve )
			.exists( );
	} );
APP.post( "/api/:accessID/reserve/add",
	function onAddReserve( request, response ){
		var reserve = request.body;

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
			.createReferenceID( reserve )
			.createReserveID( reserve )
			.add( reserve );
	} );

APP.get( "/api/:accessID/reserve/:referenceID",
	function onGetReserve( request, response ){
		var referenceID = request.params.referenceID;

		Reserve( )
			.clone( )
			.once( "error",
				function onError( error ){
					this.self.flush( ).reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.self.flush( ).reply( response, 500, "error", error.message );
					
					}else if( existing ){
						this.self.notify( );
						
					}else{
						this.self.flush( ).reply( response, 200, "failed", "reserve does not exists" );
					}
				} )
			.exists( referenceID )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, reserve ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", reserve );
					}
				} )
			.pick( "referenceID", referenceID );
	} );

APP.put( "/api/:accessID/reserve/update/:referenceID",
	function onUpdateReserve( request, response ){
		var referenceID = request.params.referenceID;

		var reserve = request.body;

		Reserve( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success" );
					}
				} )
			.update( reserve, referenceID );
	} );

APP.put( "/api/:accessID/reserve/edit/:referenceID",
	function onEditReserve( request, response ){
		var referenceID = request.params.referenceID;

		var reserve = request.body;

		var property = Object.keys( reserve )[ 0 ];
		var value = reserve[ property ];

		Reserve( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success" );
					}
				} )
			.edit( property, value, referenceID );
	} );

APP.delete( "/api/:accessID/reserve/remove/:referenceID",
	function onRemoveReserve( request, response ){
		var referenceID = request.params.referenceID;

		Reserve( )
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
			.remove( referenceID )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( !existing ){
						this.reply( response, 200, "success" );
					
					}else{
						this.reply( response, 200, "failed", "cannot delete reserve" );
					}
				} )
			.exists( referenceID );
	} );
