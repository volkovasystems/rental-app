//: @administrator-mode:
var ViewParks = React.createClass( {
	"statics": {
		"load": function load( ){
			$( "[view-parks]" ).ready( function onReady( ){
				var viewParksElement = $( "[view-parks]" );

				var viewParksComponent = <ViewParks component={ viewParksElement } />

				React.render( viewParksComponent, viewParksElement[ 0 ] );
			} );
		}
	},

	"onClose": function onClose( ){
		PubSub.publish( "close-view-parks" );
	},

	"showViewParks": function showViewParks( ){
		$( "[data-page]", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hideViewParks": function hideViewParks( ){
		$( "[data-page]", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"clearViewParksData": function clearViewParksData( ){
		this.setState( this.getInitialState( ) );
	},

	"onEachPark": function onEachPark( park ){
		for( var key in park ){
			if( _.isEmpty( park[ key ] ) &&
				typeof park[ key ] != "object" &&
				typeof park[ key ] != "number" )
			{
				park[ key ] = "Not Available";
			}
		}

		if( park.directions instanceof Array ){
			park.directions.join( " " );
		}

		if( park.instructions instanceof Array ){
			park.instructions.join( " " );
		}
		
		return; //: @template: template/view-park.html
	},

	"getDefaultProps": function getDefaultProps( ){
		return {
			"component": null
		};
	},

	"getInitialState": function getInitialState( ){
		return {
			"parks": [ ]
		};
	},

	"render": function onRender( ){
		return; //: @template: template/view-parks.html
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		
	},

	"componentDidMount": function componentDidMount( ){
		PubSub.subscribe( "close-view-parks",
			( function onCloseViewParks( ){
				this.hideViewParks( );
			} ).bind( this ) );		

		PubSub.subscribe( "show-view-parks",
			( function onShowViewParks( ){
				this.showViewParks( );
			} ).bind( this ) );

		PubSub.subscribe( "set-view-parks",
			( function onSetViewParks( parks ){
				this.setState( {
					"parks": parks
				} );
			} ).bind( this ) );

		this.hideViewParks( );
	}
} );

ViewParks.load( );
//: @end-administrator-mode