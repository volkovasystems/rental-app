//: @administrator-mode:
Component( "add-park" ).load( "section[add-park]",
	React.createClass( {
		"mixins": [ 
			ComponentPropertyMixin,
			StateChangeMixin, 
			TitleNameMixin,
			ShowHidePageMixin,
			ClearStateMixin,
			PageTraversalMixin
		],

		"now": function now( ){
			this.request( );

			this.close( );

			PubSub.publish( "add-park-now" );
		},

		"request": function request( ){
			Park( )
				.add( this.state )
				.onSuccess( function onSuccess( data ){
					Headbar.open( );

					PubSub.publish( "add-park-success" );
				} )
				.onFailed( function onFailed( failureMessage ){
					Notify.now( "failure", "add-park", failureMessage );

					AddPark.open( );

					PubSub.publish( "add-park-failed" );
				} )
				.onError( function onError( errorMessage ){
					Notify.now( "error", "add-park", errorMessage );

					Home.open( );

					PubSub.publish( "add-park-error" );
				} );
		},

		"getInitialState": function getInitialState( ){
			return {
				"title": "",
				"name": "",
				"description": "",

				"directions": "",
				"instructions": "",

				"place": "",
			};
		},

		"render": function onRender( ){
			return; //: @template: template/add-park.html
		},

		"componentDidMount": function componentDidMount( ){
			this.hide( );
		}
	} ) );
//: @end-administrator-mode