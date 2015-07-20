window.fbAsyncInit = function( ){
	FB.init( {
		"appId": FACEBOOK_APP_ID,
		"xfbml": true,
		"cookie": true,
		"version": "v2.2"
	} );

	PubSub.publish( "facebook-sdk-loaded" );
};

( function( d, s, id ){
	var js, fjs = d.getElementsByTagName( s )[ 0 ];
	
	if( d.getElementById( id ) ){ return; }
	
	js = d.createElement( s ); js.id = id;
	
	js.src = "https://connect.facebook.net/en_US/sdk.js";
	
	fjs.parentNode.insertBefore( js, fjs );

}( document, "script", "facebook-jssdk" ) );