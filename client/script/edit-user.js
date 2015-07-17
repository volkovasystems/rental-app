//: @administrator-mode:
Component( "edit-user" ).load( "section[edit-user]",
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

			PubSub.publish( "edit-user-now" );
		},

		"request": function request( ){
			User( )
				.edit( this.state.referenceID, this.state )
				.onSuccess( function onSuccess( data ){
					Headbar.open( );

					PubSub.publish( "edit-user-success" );
				} )
				.onFailed( function onFailed( failureMessage ){
					Notify.now( "failure", "edit-user", failureMessage );

					EditUser.open( );

					PubSub.publish( "edit-user-failed" );
				} )
				.onError( function onError( errorMessage ){
					Notify.now( "error", "edit-user", errorMessage );

					Home.open( );

					PubSub.publish( "edit-user-error" );
				} );
		},

		"getInitialState": function getInitialState( ){
			return {
				"referenceID": "",

				"firstName": "",
				"lastName": "",

				"mobileNumber": "",

				"birthDate": "",
				
				"eMail": "",
				"passphrase": ""
			};
		},

		"render": function render( ){
			return; //: @template: template/edit-user.html
		},

		"componentDidMount": function componentDidMount( ){
			this.hide( );
		}
	} ) );
//: @end-administrator-mode