/*: @administrator-development-mode:
setURL( "RESERVE_ADD_URL", "http://reserve.parq.ph:12000/api/@accessID/reserve/add" );
@end-administrator-development-mode */

/*: @administrator-production-mode:
setURL( "RESERVE_ADD_URL", "https://reserve.parq.ph:12000/api/@accessID/reserve/add" );
@end-administrator-production-mode */

var Reserve = function Reserve( ){
	if( this instanceof Reserve ){

	}else{
		return new Reserve( );
	}
};

Reserve.prototype.add = function add( reserve ){
	return Post( RESERVE_ADD_URL )
		.body( {
			"title": reserve.title,
			"name": reserve.name,
			"description": reserve.description
		} )
		.send( );
};

Reserve.prototype.edit = function edit( ){

};

Reserve.prototype.all = function all( ){

};