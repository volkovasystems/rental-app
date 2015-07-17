/*: @development-mode:
if( development ){
	setURL( "SOCIAL_ACCOUNT_LOGIN_URL", "http://social.parq.ph:20000/social/@type/account/login" );
}
@end-development-mode */

/*: @production-mode:
if( production ){
	setURL( "SOCIAL_ACCOUNT_LOGIN_URL", "https://social.parq.ph:20000/social/@type/account/login" );
}
@end-production-mode */

PubSub.subscribe( "login-social-account",
	function onLoginSocialAccount( socialData ){
		qwest
			.post( SOCIAL_ACCOUNT_LOGIN_URL
					.replace( "@type", socialData.type ), {
				"type": socialData.type,
				
				"firstName": socialData.firstName,
				"lastName": socialData.lastName,
				
				"birthDate": socialData.birthDate,
				"eMail": socialData.eMail,
				
				"accountID": socialData.accountID,
				"accessToken": socialData.accessToken,

				"profileURL": socialData.profileURL,
				"profileImage": socialData.profileImage
			}, QWEST_OPTION )

			.then( function onResponse( result ){
				if( "accessID" in result.data ){
					ACCESS_ID = result.data.accessID;

					PubSub.publish( "logged-in" );

				}else{
					PubSub.publish( "notify", "error", "we've encountered a fatal error" );
				}		

				console.debug( "social-login", result );		
			} )
			.catch( function onError( error ){
				PubSub.publish( "notify", "error", error );

				PubSub.publish( "login-failed" );

				console.debug( "social-login", error );
			} );
	} );