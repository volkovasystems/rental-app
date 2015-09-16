var titlelize = require( "titlelize" );

var formatFullName = function formatFullName( firstName, middleName, lastName ){
	return [
		titlelize( firstName ),
		titlelize( middleName ),
		titlelize( lastName )
	].join( " " ).replace( /\s+/, " " );
};

module.exports = formatFullName;