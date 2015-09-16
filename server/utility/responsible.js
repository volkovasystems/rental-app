var events = require( "events" );
var util = require( "util" );

require( "./composite.js" );

var Responsible = function Responsible( ){
	return Composite.call( this, Responsible );
};

util.inherits( Responsible, Composite );

Responsible.prototype.reply = function reply( response, code, type, data ){
	if( this.hasReplied || 
		response.hasReplied )
	{
		return this;
	}

	this.hasReplied = true;
	response.hasReplied = true;

	response
		.status( code )
		.json( {
			"status": type,
			"data": data
		} );

	return this;
};

Responsible.prototype.setResponse = function setResponse( response ){
	this.serverResponse = response;

	return this;
};

Resposible.prototype.response = function response( code, type, data ){
	return this.reply( this.serverResponse, code, type, data );
};

global.Responsible = Responsible;
module.exports = Responsible;