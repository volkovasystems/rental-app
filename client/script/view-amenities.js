//: @administrator-mode:
var ViewAmenities = React.createClass( {
	"statics": {
		"load": function load( ){
			$( "[view-amenities]" ).ready( function onReady( ){
				var viewAmenitiesElement = $( "[view-amenities]" );

				var viewAmenitiesComponent = <ViewAmenities component={ viewAmenitiesElement } />

				React.render( viewAmenitiesComponent, viewAmenitiesElement[ 0 ] );
			} );
		}
	},

	"onClose": function onClose( ){
		PubSub.publish( "close-view-amenities" );
	},

	"showViewAmenities": function showViewAmenities( ){
		$( "[data-page]", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hideViewAmenities": function hideViewAmenities( ){
		$( "[data-page]", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"clearViewAmenitiesData": function clearViewAmenitiesData( ){
		this.setState( this.getInitialState( ) );
	},

	"onEachImage": function onEachImage( image ){
		return; //: @template: template/image-preview-grid-item.html
	},

	"onEachAmenity": function onEachPlace( amenity ){
		for( var key in amenity ){
			if( _.isEmpty( amenity[ key ] ) &&
				typeof amenity[ key ] != "object" &&
				typeof amenity[ key ] != "number" )
			{
				amenity[ key ] = "Not Available";
			}
		}
		
		return; //: @template: template/view-amenity.html
	},

	"getDefaultProps": function getDefaultProps( ){
		return {
			"component": null
		};
	},

	"getInitialState": function getInitialState( ){
		return {
			"amenities": [ ]
		};
	},

	"render": function onRender( ){
		return; //: @template: template/view-amenities.html
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		
	},

	"componentDidMount": function componentDidMount( ){
		PubSub.subscribe( "close-view-amenities",
			( function onCloseViewAmenities( ){
				this.hideViewAmenities( );
			} ).bind( this ) );		

		PubSub.subscribe( "show-view-amenities",
			( function onShowViewAmenities( ){
				this.showViewAmenities( );
			} ).bind( this ) );

		PubSub.subscribe( "set-view-amenities",
			( function onSetViewAmenities( amenities ){
				this.setState( {
					"amenities": amenities
				} );
			} ).bind( this ) );

		this.hideViewAmenities( );
	}
} );

ViewAmenities.load( );
//: @end-administrator-mode