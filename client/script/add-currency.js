//: @administrator-mode:
Component( "add-currency" ).load( "section[add-currency]",
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

			PubSub.publish( "add-currency-now" );
		},

		"request": function request( ){
			Currency( )
				.add( this.state )
				.onSuccess( function onSuccess( data ){
					Headbar.open( );

					PubSub.publish( "add-currency-success" );
				} )
				.onFailed( function onFailed( failureMessage ){
					Notify.now( "failure", "add-currency", failureMessage );

					Currency.open( );

					PubSub.publish( "add-currency-failed" );
				} )
				.onError( function onError( errorMessage ){
					Notify.now( "error", "add-currency", errorMessage );

					Home.open( );

					PubSub.publish( "add-currency-error" );
				} );
		},

		"getInitialState": function getInitialState( ){
			return {
				"name": "",
				"title": "",
				"description": "",
				"symbol": ""
			};
		},

		"render": function onRender( ){
			return; //: @template: template/add-currency.html
		},

		"componentDidMount": function componentDidMount( ){
			this.hide( );
		}
	} ) );
//: @end-administrator-mode