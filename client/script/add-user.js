//: @administrator-mode:
Component( "add-user" ).load( "section[add-user]",
	React.createClass( {
		"mixins": [ 
			ComponentPropertyMixin,
			StateChangeMixin,
			ShowHidePageMixin,
			ClearStateMixin,
			PageTraversalMixin
		],

		"now": function now( ){
			this.request( );

			this.close( );

			PubSub.publish( "add-user-now" );
		},

		"request": function request( ){
			User( )
				.add( this.state )
				.onSuccess( function onSuccess( data ){
					Headbar.open( );

					PubSub.publish( "add-user-success" );
				} )
				.onFailed( function onFailed( failureMessage ){
					Notify.now( "failure", "add-user", failureMessage );

					AddUser.open( );

					PubSub.publish( "add-user-failed" );
				} )
				.onError( function onError( errorMessage ){
					Notify.now( "error", "add-user", errorMessage );

					Home.open( );

					PubSub.publish( "add-user-error" );
				} );
		},

		"getInitialState": function getInitialState( ){
			return {
				"firstName": "",
				"lastName": "",

				"mobileNumber": "",

				"birthDate": "",
				
				"eMail": "",
				"passphrase": ""
			};
		},

		"render": function render( ){
			return; //: @template: template/add-user.html
		},

		"componentDidMount": function componentDidMount( ){
			this.hide( );
		}
	} ) );
//: @end-administrator-mode