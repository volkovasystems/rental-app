/*: @administrator-development-mode:
setURL( "LOGIN_URL", "http://user.parq.ph:9000/user/login" );

setURL( "REGISTER_URL", "http://user.parq.ph:9000/user/register" );
@end-administrator-development-mode */

/*: @administrator-production-mode:
setURL( "LOGIN_URL", "https://user.parq.ph:9000/user/login" );

setURL( "REGISTER_URL", "https://user.parq.ph:9000/user/register" );
@end-administrator-production-mode */

var User = function User( ){
	if( this instanceof User ){

	}else{
		return new User( );
	}
};

User.prototype.login = function login( user ){
	var passphrase = encodePassphrase( user.passphrase, user.eMail );

	return Post( LOGIN_URL )
		.body( {
			"eMail": user.eMail,
			"passphrase": passphrase
		} )
		.send( );
};

User.prototype.register = function register( user ){
	var birthDate = moment( user.birthDate, "MM-DD-YYYY" ).valueOf( );

	var passphrase = encodePassphrase( user.passphrase, user.eMail );

	return Post( REGISTER_URL )
		.body( {
			"firstName": user.firstName,
			"lastName": user.lastName,

			"mobileNumber": user.mobileNumber,

			"birthDate": birthDate,
			
			"eMail": user.eMail,
			"passphrase": passphrase
		} )
		.send( );
};