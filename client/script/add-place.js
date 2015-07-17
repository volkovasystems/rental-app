//: @administrator-mode:
Component( "add-place" ).load( "section[add-place]",
	React.createClass( {
		"mixins": [
			ComponentPropertyMixin,
			StateChangeMixin,
			TitleNameMixin,
			ShowHidePageMixin,
			ClearStateMixin,
			PageTraversalMixin,

			PageMixin,
			ContentMixin,
			AddPlaceMixin
		],

		"now": function now( ){
			this.request( );

			this.close( );

			PubSub.publish( "add-place-now" );
		},

		"open": function open( ){
			Dashbar.close( );

			Headbar.close( );

			Opbar.close( );
		},

		"request": function request( ){
			Place( )
				.add( this.state )
				.onSuccess( function onSuccess( data ){
					Headbar.open( );

					PubSub.publish( "add-place-success" );
				} )
				.onFailed( function onFailed( failureMessage ){
					Notify.now( "failure", "add-place", failureMessage );

					AddPlace.open( );

					PubSub.publish( "add-place-failed" );
				} )
				.onError( function onError( errorMessage ){
					Notify.now( "error", "add-place", errorMessage );

					Home.open( );

					PubSub.publish( "add-place-error" );
				} );
		},

		"getInitialState": function getInitialState( ){
			return {
				"name": "",
				"title": "",
				"description": "",

				"address": "",

				"latitude": 0,
				"longitude": 0,
				"zoom": 0,

				"amenities": [ ],
				"images": [ ],

				"instructions": "",
				"rate": ""
			};
		},

		"render": function render( ){
			return; //: @template: template/add-place.html
		},

		"componentDidMount": function componentDidMount( ){
			this.hide( );
		}
	} ) );
//: @end-administrator-mode
