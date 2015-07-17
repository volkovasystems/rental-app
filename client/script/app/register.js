Component( "register" ).load( "section[register]",
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

			PubSub.publish( "register-now" );
		},

		"request": function request( ){
			User( )
				.register( this.state )
				.onSuccess( function onSuccess( data ){
					ACCESS_ID = data.accessID;

					Headbar.open( );

					PubSub.publish( "register-success" );
				} )
				.onFailed( function onFailed( failureMessage ){
					Notify.now( "failure", "login", failureMessage );

					Register.open( );

					PubSub.publish( "register-failed" );
				} )
				.onError( function onError( errorMessage ){
					Notify.now( "error", "login", errorMessage );

					Home.open( );

					PubSub.publish( "register-error" );
				} );
		},

		"register": function register( ){
			Register.now( );
		},

		"home": function home( ){
			this.close( );

			Home.open( );
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

		"render": function onRender( ){
			return; //: @template: template/register.html
		},

		"componentDidUpdate": function componentDidUpdate( ){

		},

		"componentDidMount": function componentDidMount( ){
			this.hide( );
		}
	} ) );
