//: @administrator-mode:
var ViewPrices = React.createClass( {
	"statics": {
		"load": function load( ){
			$( "[view-prices]" ).ready( function onReady( ){
				var viewPricesElement = $( "[view-prices]" );

				var viewPricesComponent = <ViewPrices component={ viewPricesElement } />

				React.render( viewPricesComponent, viewPricesElement[ 0 ] );
			} );
		}
	},

	"onClose": function onClose( ){
		PubSub.publish( "close-view-prices" );
	},

	"showViewPrices": function showViewPrices( ){
		$( "[data-page]", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hideViewPrices": function hideViewPrices( ){
		$( "[data-page]", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"clearViewPricesData": function clearViewPricesData( ){
		this.setState( this.getInitialState( ) );
	},

	"onEachPrice": function onEachPrice( price ){

		var amount = "Not Available";
		if( "currency" in price &&
			!_.isEmpty( price.currency ) )
		{
			amount = [ price.currency.symbol, price.amount ].join( ". " );
		}

		var duration = "Not Available";
		if( typeof price.duration == "number" ){
			duration = price.duration;
		}

		for( var key in price ){
			if( _.isEmpty( price[ key ] ) &&
				typeof price[ key ] != "object" &&
				typeof price[ key ] != "number" )
			{
				price[ key ] = "Not Available";
			}
		}

		return; //: @template: template/view-price.html
	},

	"getDefaultProps": function getDefaultProps( ){
		return {
			"component": null
		};
	},

	"getInitialState": function getInitialState( ){
		return {
			"prices": [ ]
		};
	},

	"render": function onRender( ){
		return; //: @template: template/view-prices.html
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		
	},

	"componentDidMount": function componentDidMount( ){
		PubSub.subscribe( "close-view-prices",
			( function onCloseViewPrices( ){
				this.hideViewPrices( );
			} ).bind( this ) );		

		PubSub.subscribe( "show-view-prices",
			( function onShowViewPrices( ){
				this.showViewPrices( );
			} ).bind( this ) );

		PubSub.subscribe( "set-view-prices",
			( function onSetViewPrices( prices ){
				this.setState( {
					"prices": prices
				} );
			} ).bind( this ) );

		this.hideViewPrices( );
	}
} );

ViewPrices.load( );
//: @end-administrator-mode