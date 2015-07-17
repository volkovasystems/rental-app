/*: @administrator-development-mode:
if( development ){
	setURL( "VEHICLE_MODEL_ADD_URL", "http://vehicle.parq.ph:10000/api/@accessID/vehicle/model/add" );
}
@end-administrator-development-mode */

/*: @administrator-production-mode:
if( production ){
	setURL( "VEHICLE_MODEL_ADD_URL", "https://vehicle.parq.ph:10000/api/@accessID/vehicle/model/add" );
}
@end-administrator-production-mode */

var VehicleModel = function VehicleModel( ){
	if( this instanceof VehicleModel ){

	}else{
		return new VehicleModel( );
	}
};

VehicleModel.prototype.add = function add( VehicleModel ){
	return Post( VEHICLE_ADD_MODEL_URL )
		.body( {
			"name": vehicleModelData.name,
			"title": vehicleModelData.title,
			"description": vehicleModelData.description,

			"brand": vehicleModelData.brand
		} )
		.send( );
};

VehicleModel.prototype.edit = function edit( ){

};

VehicleModel.prototype.all = function all( ){

};