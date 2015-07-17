var _ = require( "lodash" );
var S = require( "string" );

var payOptions = [
	"cash",
	"paypal",
	"credit-card"
].map( function onEacPayOptions( payOption ){
	var payOptionString = S( payOption );

	return {
		"name": payOption,
		"title": payOptionString.humanize( ).toString( )
	};
} );

global.PAY_OPTIONS = ( function( ){
	var payOptionsData = { };

	var payOptionsLength = payOptions.length;
	var payOption = null;
	for( var index = 0; index < payOptionsLength; index++ ){
		payOption = payOptions[ index ];

		payOptionsData[ payOption.name ] = payOption;
	}

	return payOptionsData;
} )( );

APP.get( "/api/:accessID/price/pay/option/all",
	function onGetAllPricePayOption( request, response ){
		response
			.status( 200 )
			.json( {
				"status": "success",
				"data": payOptions
			} );
	} );