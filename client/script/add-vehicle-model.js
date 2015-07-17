//: @administrator-mode:
Component( "add-vehicle-model" ).load( "section[add-vehicle-model]",
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

			PubSub.publish( "add-vehicle-model-now" );
		},

		"request": function request( ){
			VehicleModel( )
				.add( this.state )
				.onSuccess( function onSuccess( data ){
					Headbar.open( );

					PubSub.publish( "add-vehicle-model-success" );
				} )
				.onFailed( function onFailed( failureMessage ){
					Notify.now( "failure", "add-vehicle-model", failureMessage );

					AddUser.open( );

					PubSub.publish( "add-user-failed" );
				} )
				.onError( function onError( errorMessage ){
					Notify.now( "error", "add-vehicle-model", errorMessage );

					Home.open( );

					PubSub.publish( "add-vehicle-model-error" );
				} );
		},

		"getInitialState": function getInitialState( ){
			return {
				"name": "",
				"title": "",
				"description": "",
				"brand": ""
			};
		},

		"render": function onRender( ){
			return; //: @template: template/add-vehicle-model.html
		},

		"componentDidMount": function componentDidMount( ){
			this.hide( );
		}
	} ) );
//: @end-administrator-mode