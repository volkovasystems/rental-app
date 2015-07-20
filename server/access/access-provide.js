var _ = require( "lodash" );
var util = require( "util" );

/*:
	This will be used to restrict model-server to model-server
		interaction.
*/
Access.prototype.provideAccess = function provideAccess( domain, access ){
	
};

APP.post( "/access/provide/to/:domain",
	function onProvideAccessToDomain( request, response ){
		var domain = request.params.domain;

		var access = request.body;

		Access( )
			.once( "result",
				function onResult( error, access ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "referenceID": access.referenceID } );
					}
				} )
			.provideAccess( domain, access );
	} );