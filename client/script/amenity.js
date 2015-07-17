/*: @administrator-development-mode:
setURL( "AMENITY_ADD_URL", "http://place.parq.ph:11000/api/@accessID/amenity/add" );
setURL( "AMENITY_GET_ALL_URL", "http://place.parq.ph:11000/api/@accessID/amenity/all" );
@end-administrator-development-mode */

/*: @administrator-production-mode:
setURL( "AMENITY_ADD_URL", "https://place.parq.ph:11000/api/@accessID/amenity/add" );
setURL( "AMENITY_GET_ALL_URL", "https://place.parq.ph:11000/api/@accessID/amenity/all" );
@end-administrator-production-mode */

var Amenity = function Amenity( ){
	if( this instanceof Amenity ){

	}else{
		return new Amenity( );
	}
};

Amenity.prototype.add = function add( amenity ){
	return Post( AMENITY_ADD_URL )
		.body( {
			"name": amenity.name,
			"title": amenity.title,
			"description": amenity.description,
			"image": amenity.image
		} )
		.send( );
};

Amenity.prototype.all = function all( ){

};