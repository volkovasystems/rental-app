/*: @administrator-development-mode:
setURL( "PLACE_ADD_URL", "http://place.parq.ph:11000/api/@accessID/place/add" );
@end-administrator-development-mode */

/*: @administrator-production-mode:
setURL( "PLACE_ADD_URL", "https://place.parq.ph:11000/api/@accessID/place/add" );
@end-administrator-production-mode */

var Place = function Place( ){
	if( this instanceof Place ){


	}else{
		return new Place( );
	}
};

Place.prototype.add = function add( place ){
	return Post( PLACE_ADD_URL )
		.body( {
			"name": place.name,
			"title": place.title,
			"description": place.description,
			"address": place.address,

			"latitude": place.latitude,
			"longitude": place.longitude,
			"zoom": place.zoom,

			"amenities": place.amenities,
			"images": place.images,
			"instructions": place.instructions,
			"rate": place.rate
		} )
		.send( );
};

Place.prototype.edit = function edit( ){

};

Place.prototype.all = function all( ){

};