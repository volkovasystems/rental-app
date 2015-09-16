var titlelize = require( "titlelize" );

var formatDisplayName = function formatDisplayName( firstName, middleName, lastName ){
	return [
		titlelize( firstName ),
		middleName ? "@middleInitial."
			.replace( "@middleInitial", 
				middleName.match( /^[a-z]/ )[ 0 ].toUpperCase( ) ) : "",
		titlelize( lastName )
	].join( " " ).replace( /\s+/, " " );
};

module.exports = formatDisplayName;