//: @administrator-mode:
var ViewCurrencies = React.createClass( {
	"statics": {
		"load": function load( ){
			$( "[view-currencies]" ).ready( function onReady( ){
				var viewCurrenciesElement = $( "[view-currencies]" );

				var viewCurrenciesComponent = <ViewCurrencies component={ viewCurrenciesElement } />

				React.render( viewCurrenciesComponent, viewCurrenciesElement[ 0 ] );
			} );
		}
	},

	"onClose": function onClose( ){
		PubSub.publish( "close-view-currencies" );
	},

	"showViewCurrencies": function showViewCurrencies( ){
		$( "[data-page]", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hideViewCurrencies": function hideViewCurrencies( ){
		$( "[data-page]", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"clearViewCurrenciesData": function clearViewCurrenciesData( ){
		this.setState( this.getInitialState( ) );
	},

	"onEachCurrency": function onEachPlace( currency ){
		for( var key in currency ){
			if( _.isEmpty( currency[ key ] ) &&
				typeof currency[ key ] != "object" &&
				typeof currency[ key ] != "number" )
			{
				currency[ key ] = "Not Available";
			}
		}
		
		return; //: @template: template/view-currency.html
	},

	"getDefaultProps": function getDefaultProps( ){
		return {
			"component": null
		};
	},

	"getInitialState": function getInitialState( ){
		return {
			"currencies": [ ]
		};
	},

	"render": function onRender( ){
		return; //: @template: template/view-currencies.html
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		
	},

	"componentDidMount": function componentDidMount( ){
		PubSub.subscribe( "close-view-currencies",
			( function onCloseViewCurrencies( ){
				this.hideViewCurrencies( );
			} ).bind( this ) );		

		PubSub.subscribe( "show-view-currencies",
			( function onShowViewCurrencies( ){
				this.showViewCurrencies( );
			} ).bind( this ) );

		PubSub.subscribe( "set-view-currencies",
			( function onSetViewCurrencies( currencies ){
				this.setState( {
					"currencies": currencies
				} );
			} ).bind( this ) );

		this.hideViewCurrencies( );
	}
} );

ViewCurrencies.load( );
//: @end-administrator-mode