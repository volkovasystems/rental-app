var events = require( "events" );
var util = require( "util" );

require( "./composite.js" );

var Responsible = function Responsible( ){
	return Composite.call( this, Responsible );
};

util.inherits( Responsible, Composite );

Responsible.prototype.reply = function reply( response, code, type, data ){
	if( this.hasReplied ){
		return this;
	}

	this.hasReplied = true;
	response
		.status( code )
		.json( {
			"status": type,
			"data": data
		} );

	return this;
};

global.Responsible = Responsible;