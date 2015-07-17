//: @administrator-mode:
/*: @administrator-development-mode:
setURL( "PARK_ADD_URL", "http://park.parq.ph:12000/api/@accessID/park/add" );

setURL( "PARK_GET_ALL_URL", "http://park.parq.ph:12000/api/@accessID/park/all" );

setURL( "PARK_ONLY_GET_ALL_URL", "http://park.parq.ph:12000/api/@accessID/park/only/all" );
@end-administrator-development-mode */

/*: @administrator-production-mode:
setURL( "PARK_ADD_URL", "https://park.parq.ph:12000/api/@accessID/park/add" );

setURL( "PARK_GET_ALL_URL", "https://park.parq.ph:12000/api/@accessID/park/all" );

setURL( "PARK_ONLY_GET_ALL_URL", "https://park.parq.ph:12000/api/@accessID/park/only/all" );
@end-administrator-production-mode */

var Park = function Park( ){
	if( this instanceof Park ){

	}else{
		return new Park( );
	}
}; 

Park.prototype.add = function add( park ){
	return Post( PARK_ADD_URL )
		.body( {
			"title": park.title,
			"name": park.name,
			"description": park.description,

			"directions": park.directions,
			"instructions": park.instructions,
			
			"place": park.place,
		} )
		.send( );
};

Park.prototype.all = function all( ){

};

Park.prototype.edit = function edit( referenceID, park ){

};
//: @end-administrator-mode