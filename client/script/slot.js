/*: @administrator-development-mode:
setURL( "SLOT_ADD_URL", "http://slot.parq.ph:12000/api/@accessID/slot/add" );
@end-administrator-development-mode */

/*: @administrator-production-mode:
setURL( "SLOT_ADD_URL", "https://slot.parq.ph:12000/api/@accessID/slot/add" );
@end-administrator-production-mode */

var Slot = function Slot( ){
	if( this instanceof Slot ){

	}else{
		return new Slot( );
	}
};

Slot.prototype.add = function add( slot ){
	return Post( SLOT_ADD_URL )
		.body( {
			"title": slot.title,
			"name": slot.name,
			"description": slot.description,
			
			"status": slot.status,
			
			"park": slot.park,
			"place": slot.place
		} )
		.send( );
};

Slot.prototype.edit = function edit( ){

};

Slot.prototype.all = function all( ){

};