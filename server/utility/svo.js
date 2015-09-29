var llamalize = require( "llamalize" );

var svo = function svo( type, action, data ){
	return (
		[
			[
				action,
				llamalize( type, true )
			].join( ":" ),
			
			"(@data)".replace( "@data", JSON.stringify( data ) )
		].join( "" )
	);
};

global.svo = svo;

module.exports = svo;