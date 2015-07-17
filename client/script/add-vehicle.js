Component( "add-vehicle" ).load( "section[add-vehicle]",
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

			PubSub.publish( "add-vehicle-now" );
		},

		"request": function request( ){
			Vehicle( )
				.add( this.state )
				.onSuccess( function onSuccess( data ){
					Headbar.open( );

					PubSub.publish( "add-vehicle-success" );
				} )
				.onFailed( function onFailed( failureMessage ){
					Notify.now( "failure", "add-vehicle", failureMessage );

					AddUser.open( );

					PubSub.publish( "add-user-failed" );
				} )
				.onError( function onError( errorMessage ){
					Notify.now( "error", "add-vehicle", errorMessage );

					Home.open( );

					PubSub.publish( "add-vehicle-error" );
				} );
		},

		"getInitialState": function getInitialState( ){
			return {
				"user": "",
				"plateNumber": "",
				"model": "",
				"color": ""
			};
		},

		"render": function onRender( ){
			return; //: @template: template/add-vehicle.html
		},

		"componentDidMount": function componentDidMount( ){
			this.hide( );
		}
	} ) );