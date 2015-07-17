var _ = require( "lodash" );

var Place = PLACE;

APP.all( "/place/preview/all",
	function onGetAllPlacePreview( request, response, next ){
		Place( )
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
						this.reply( response, 403, "failed", "no places" );
					}
				} ) 
			.populated( );
	} );
APP.get( "/place/preview/all",
	function onGetAllPlacePreview( request, response ){
		Place( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result", 
				function onResult( error, places ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( _.isEmpty( places ) ){
						this.reply( response, 200, "failed", "no places" );

					}else{
						this.reply( response, 200, "success", places );
					}
				} )
			.set( "enableAppendAvailableSlotCount", true )
			.all( );
	} );