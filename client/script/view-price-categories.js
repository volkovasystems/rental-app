//: @administrator-mode:
var ViewPriceCategories = React.createClass( {
	"statics": {
		"load": function load( ){
			$( "[view-price-categories]" ).ready( function onReady( ){
				var viewPriceCategoriesElement = $( "[view-price-categories]" );

				var viewPriceCategoriesComponent = <ViewPriceCategories component={ viewPriceCategoriesElement } />

				React.render( viewPriceCategoriesComponent, viewPriceCategoriesElement[ 0 ] );
			} );
		}
	},

	"onClose": function onClose( ){
		PubSub.publish( "close-view-price-categories" );
	},

	"showViewPriceCategories": function showViewPriceCategories( ){
		$( "[data-page]", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hideViewPriceCategories": function hideViewPriceCategories( ){
		$( "[data-page]", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"clearViewPriceCategoriesData": function clearViewPriceCategoriesData( ){
		this.setState( this.getInitialState( ) );
	},

	"onEachPriceCategory": function onEachPlace( priceCategory ){
		for( var key in priceCategory ){
			if( _.isEmpty( priceCategory[ key ] ) &&
				typeof priceCategory[ key ] != "object" &&
				typeof priceCategory[ key ] != "number" )
			{
				priceCategory[ key ] = "Not Available";
			}
		}
		
		return; //: @template: template/view-price-category.html
	},

	"getDefaultProps": function getDefaultProps( ){
		return {
			"component": null
		};
	},

	"getInitialState": function getInitialState( ){
		return {
			"priceCategories": [ ]
		};
	},

	"render": function onRender( ){
		return; //: @template: template/view-price-categories.html
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		
	},

	"componentDidMount": function componentDidMount( ){
		PubSub.subscribe( "close-view-price-categories",
			( function onCloseViewPriceCategories( ){
				this.hideViewPriceCategories( );
			} ).bind( this ) );		

		PubSub.subscribe( "show-view-price-categories",
			( function onShowViewPriceCategories( ){
				this.showViewPriceCategories( );
			} ).bind( this ) );

		PubSub.subscribe( "set-view-price-categories",
			( function onSetViewPriceCategories( priceCategories ){
				this.setState( {
					"priceCategories": priceCategories
				} );
			} ).bind( this ) );

		this.hideViewPriceCategories( );
	}
} );

ViewPriceCategories.load( );
//: @end-administrator-mode