/*: @administrator-development-mode:
setURL( "CURRENCY_ADD_URL", "http://price.parq.ph:18000/api/@accessID/currency/add" );

setURL( "CURRENCY_GET_ALL_URL", "http://price.parq.ph:18000/api/@accessID/currency/all" );
@end-administrator-development-mode */

/*: @administrator-production-mode:
setURL( "CURRENCY_ADD_URL", "https://price.parq.ph:18000/api/@accessID/currency/add" );

setURL( "CURRENCY_GET_ALL_URL", "https://price.parq.ph:18000/api/@accessID/currency/all" );
@end-administrator-production-mode */

var Currency = function Currency( ){
	if( this instanceof Currency ){

	}else{
		return new Currency( );
	}
};

Currency.prototype.add = function add( currency ){
	return Post( CURRENCY_ADD_URL )
		.body( {
			"name": currency.name,
			"title": currency.title,
			"description": currency.description,
			"symbol": currency.symbol
		} )
		.send( );
};

Currency.prototype.all = function all( ){

};