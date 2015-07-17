var _ = require( "lodash" );
var unirest = require( "unirest" );
var util = require( "util" );

var Access = ACCESS;

APP.use( "/api/:accessID/*",
	function onAPIAccess( request, response, next ){
		var accessID = request.params.accessID;

		Access( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, verified ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( verified ){
						next( );

					}else{
						this.reply( response, 403, "failed", "invalid access" );
					}
				} )
			.verifyAccess( accessID );
	} );