//: @administrator-mode:
Component( "add-amenity" ).load( "section[add-amenity]",
	React.createClass( {
		"mixins": [ 
			ComponentPropertyMixin,
			StateChangeMixin, 
			TitleNameMixin,
			ShowHidePageMixin,
			ClearStateMixin,
			PageTraversalMixin
		],

		"onEachImage": function onEachImage( image ){
			return; //: @template: template/image-preview-grid-item.html
		},

		"removeImage": function removeImage( event ){
			this.setState( {
				"image": ""
			} );
		},

		"now": function now( ){
			this.request( );
			
			this.close( );

			PubSub.publish( "add-amenity-now" );
		},

		"request": function request( ){
			Amenity( )
				.add( this.state )
				.onSuccess( function onSuccess( data ){
					Headbar.open( );

					PubSub.publish( "add-amenity-success" );
				} )
				.onFailed( function onFailed( failureMessage ){
					Notify.now( "failure", "add-amenity", failureMessage );

					AddAmenity.open( );

					PubSub.publish( "add-amenity-failed" );
				} )
				.onError( function onError( errorMessage ){
					Notify.now( "error", "add-amenity", errorMessage );

					Home.open( );

					PubSub.publish( "add-amenity-error" );
				} );
		},

		"getInitialState": function getInitialState( ){
			return {
				"name": "",
				"title": "",
				"description": "",
				"image": ""
			};
		},

		"render": function onRender( ){
			return; //: @template: template/add-amenity.html
		},

		"componentDidMount": function componentDidMount( ){
			this.hide( );
		}
	} ) );
//: @end-administrator-mode