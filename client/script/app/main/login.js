Component( "login" ).load( "section[login]",
	React.createClass( {
		"mixins": [
			ComponentMixin,

			StateChangeMixin,
			ClearStateMixin,

			ShowHidePageMixin,
			PageTraversalMixin,

			PageMixin,
			ContentMixin
		],

		"now": function now( ){
			this.request( );

			this.close( );

			PubSub.publish( "login-now" );
		},

		"request": function request( ){
			User( )
				.login( this.state )
				.onSuccess( function onSuccess( data ){
					ACCESS_ID = data.accessID;

					Headbar.open( );

					PubSub.publish( "login-success" );
				} )
				.onFailed( function onFailed( failureMessage ){
					Notify.now( "failure", "login", failureMessage );

					Login.open( );

					PubSub.publish( "login-failed" );
				} )
				.onError( function onError( errorMessage ){
					Notify.now( "error", "login", errorMessage );

					Home.open( );

					PubSub.publish( "login-error" );
				} );
		},

		"register": function register( ){
			this.close( );

			Register.open( );
		},

		"login": function login( ){
			Login.now( );
		},

		"home": function home( ){
			this.close( );

			Home.open( );
		},

		"getInitialState": function getInitialState( ){
			return {
				"eMail": "",
				"passphrase": ""
			};
		},

		"render": function onRender( ){
			return; //: @template: template/login.html
		},

		"componentDidMount": function componentDidMount( ){
			this.hide( );
		}
	} ) );
