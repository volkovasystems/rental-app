//: @administrator-mode:
var ViewPlaces = React.createClass( {
	"statics": {
		"load": function load( ){
			$( "[view-places]" ).ready( function onReady( ){
				var viewPlacesElement = $( "[view-places]" );

				var viewPlacesComponent = <ViewPlaces component={ viewPlacesElement } />

				React.render( viewPlacesComponent, viewPlacesElement[ 0 ] );
			} );
		}
	},

	"onClose": function onClose( ){
		PubSub.publish( "close-view-places" );
	},

	"showViewPlaces": function showViewPlaces( ){
		$( "[data-page]", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hideViewPlaces": function hideViewPlaces( ){
		$( "[data-page]", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"clearViewPlacesData": function clearViewPlacesData( ){
		this.setState( this.getInitialState( ) );
	},

	"onEachPlace": function onEachPlace( place ){

		var price = "Not Available";
		if( "price" in place &&
			!_.isEmpty( place.price ) &&
			"currency" in place.price &&
			!_.isEmpty( place.price.currency ) )
		{
			price = [ place.price.currency.symbol, place.price.amount ].join( ". " );
		}

		for( var key in place ){
			if( _.isEmpty( place[ key ] ) &&
				typeof place[ key ] != "object" &&
				typeof place[ key ] != "number" )
			{
				place[ key ] = "Not Available";
			}
		}

		if( place.instructions instanceof Array ){
			place.instructions.join( " " );
		}

		return; //: @template: template/view-place.html
	},

	"getDefaultProps": function getDefaultProps( ){
		return {
			"component": null
		};
	},

	"getInitialState": function getInitialState( ){
		return {
			"places": [ ]
		};
	},

	"render": function onRender( ){
		return; //: @template: template/view-places.html
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		
	},

	"componentDidMount": function componentDidMount( ){
		PubSub.subscribe( "close-view-places",
			( function onCloseViewPlaces( ){
				this.hideViewPlaces( );
			} ).bind( this ) );		

		PubSub.subscribe( "show-view-places",
			( function onShowViewPlaces( ){
				this.showViewPlaces( );
			} ).bind( this ) );

		PubSub.subscribe( "set-view-places",
			( function onSetViewPlaces( places ){
				this.setState( {
					"places": places
				} );
			} ).bind( this ) );

		this.hideViewPlaces( );
	}
} );

ViewPlaces.load( );
//: @end-administrator-mode