PubSub.subscribe( "initiate-facebook-login",
	function onInitiateFacebookLogin( ){
		async.waterfall( [
			function checkFacebookLogin( callback ){
				PubSub.publish( "check-facebook-login",
					function onCheckFacebookLogin( error, accessData ){
						if( error ){
							callback( error );

						}else if( accessData ){
							callback( null, accessData );

						}else{
							callback( true );
						}
					} );
			},

			function getFacebookProfile( accessData, callback ){
				PubSub.publish( "get-facebook-profile",
					function onGetFacebookProfile( error, profile ){
						if( error ){
							callback( error );

						}else if( profile ){
							callback( null, profile, accessData );

						}else{
							callback( true );
						}
					} );
			},

			function loginFacebookSocial( profile, accessData, callback ){
				PubSub.publish( "login-social-account", {
					"type": accessData.type,
					
					"firstName": profile.firstName,
					"lastName": profile.lastName,
					"birthDate": profile.birthDate,
					"eMail": profile.eMail,

					"accountID": accessData.accountID,
					"accessToken": accessData.accessToken,

					"profileURL": profile.profileURL,
					"profileImage": profile.profileImage
				} );

				callback( );
			}
		],
			function lastly( state ){
				PubSub.publish( "login-using-facebook" );
			} );
	} );

PubSub.subscribe( "check-facebook-login",
	function onCheckFacebookLogin( callback ){
		FB.getLoginStatus( function onReponseLoginStatus( response ){
			if( response.error ){
				callback( response.error );

			}else if( response.status === "connected" &&
				response.authResponse &&
				response.authResponse.userID &&
				response.authResponse.accessToken )
			{
				callback( null, {
					"type": "facebook",
					"accountID": response.authResponse.userID,
					"accessToken": response.authResponse.accessToken
				} );

			}else{
				callback( null, false );
			}
		} );
	} );

PubSub.subscribe( "login-using-facebook",
	function onLoginUsingFacebook( ){
		var socialFootprint = uuid.v4( );

		localforage.setItem( "social-footprint", { 
			"footprint": socialFootprint, 
			"type": "facebook",
			//: Adding timestamp let us limit the process within 3 minutes.
			"timestamp": Date.now( )
		},
			function onSaved( error ){
				if( error ){

				}else{
					var redirectURL = [ 
						"https://www.facebook.com/dialog/oauth/?",
						[ 
							[ "client_id" , FACEBOOK_APP_ID ].join( "=" ),
							[ "redirect_uri", ( new URI( ) ).toString( ) ].join( "=" ),
							[ "state", socialFootprint ].join( "=" ),
							[ "scope", 
								[ "email", "user_birthday" ].join( "," ) 
							].join( "=" )
						].join( "&" )
					].join( "" );

					window.location = redirectURL;
				}
			} );
	} );

PubSub.subscribe( "get-facebook-profile",
	function onGetFacebookProfile( callback ){
		var profile = { };

		async.parallel( [
			function requestProfileData( callback ){
				FB.api( "/me",
					function onResponse( response ){
						if( "error" in response &&
							response.error )
						{
							callback( new Error( response.error ) );

						}else if( response.first_name &&
							response.last_name &&
							response.link &&
							response.email &&
							response.birthday )
						{
							profile.firstName = response.first_name;
							profile.lastName = response.last_name;
							profile.profileURL = response.link;
							profile.eMail = response.email;
							profile.birthDate = moment( response.birthday, "MM-DD-YYYY" ).valueOf( );

							callback( );

						}else{
							callback( );
						}
					} );
			},

			function requestProfilePhoto( callback ){
				FB.api( "/me/picture", {
						"redirect": false,
						"height": 128,
						"type": "square",
						"width": 128
					},
					function onResponse( response ){
						if( "error" in response &&
							response.error )
						{
							callback( new Error( response.error ) );

						}else if( response.data &&
							response.data.url )
						{
							profile.profileImage = response.data.url;

							callback( );
						
						}else{
							callback( );
						}
					} );
			}
		],
			function lastly( error ){
				if( error ){
					callback( error );

				}else if( _.isEmpty( profile ) ){
					callback( null, false );

				}else if( profile.firstName &&
					profile.lastName &&
					profile.profileURL &&
					profile.eMail &&
					profile.birthDate &&
					profile.profileImage )
				{
					callback( null, profile );

				}else{
					callback( new Error( "incomplete facebook data" ) );
				}
			} );
	} );

( function module( ){
	async.waterfall( [
		/*:
			By getting the social footprint
				we are ensured that the login process
				has been initialized.
		*/
		function getSocialFootprint( callback ){
			localforage.getItem( "social-footprint",
				function onGetSocialFootprint( error, socialFootprint ){
					if( error ){
						callback( error );

					}else if( socialFootprint && 
						socialFootprint.type == "facebook" )
					{
						callback( null, socialFootprint );
						
					}else{
						callback( true );
					}
				} );
		},

		function removeSocialFootprint( socialFootprint, callback ){
			localforage.removeItem( "social-footprint",
				function onRemoveSocialFootprint( error ){
					if( error ){
						callback( error );

					}else{
						callback( null, socialFootprint );
					}
				} );
		},

		function verifySocialFootprint( socialFootprint, callback ){
			var queryData = URI.parseQuery( ( new URI( ) ).search( ) );

			if( queryData.state == socialFootprint.footprint &&
				( Date.now( ) - socialFootprint.timestamp ) <= 180000 )
			{
				callback( );

			}else{
				callback( true );
			}

			History.pushState( null, null, "/" );
		},

		function checkFacebookLogin( callback ){
			PubSub.publish( "check-facebook-login",
				function onCheckFacebookLogin( error, accessData ){
					if( error ){
						callback( error );

					}else if( accessData ){
						callback( null, accessData );

					}else{
						callback( true );
					}
				} );
		},

		function getFacebookProfile( accessData, callback ){
			PubSub.publish( "get-facebook-profile",
				function onGetFacebookProfile( error, profile ){
					if( error ){
						callback( error );

					}else if( profile ){
						callback( null, profile, accessData );

					}else{
						callback( true );
					}
				} );
		},

		function loginFacebookSocial( profile, accessData, callback ){
			PubSub.publish( "login-social-account", {
				"type": accessData.type,
				
				"firstName": profile.firstName,
				"lastName": profile.lastName,
				"birthDate": profile.birthDate,
				"eMail": profile.eMail,

				"accountID": accessData.accountID,
				"accessToken": accessData.accessToken,

				"profileURL": profile.profileURL,
				"profileImage": profile.profileImage
			} );

			callback( );
		}
	],
		function lastly( state ){
			History.pushState( null, null, "/" );

			if( state instanceof Error ){

			}else if( typeof state == "boolean" ){
				//: Do nothing?

			}else{

			}
		} );
} )( );