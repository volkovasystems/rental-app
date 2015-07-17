//: @administrator-mode:
var ViewSlots = React.createClass( {
	"statics": {
		"load": function load( ){
			$( "[view-slots]" ).ready( function onReady( ){
				var viewSlotsElement = $( "[view-slots]" );

				var viewSlotsComponent = <ViewSlots component={ viewSlotsElement } />

				React.render( viewSlotsComponent, viewSlotsElement[ 0 ] );
			} );
		}
	},

	"onClose": function onClose( ){
		PubSub.publish( "close-view-slots" );
	},

	"showViewSlots": function showViewSlots( ){
		$( "[data-page]", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hideViewSlots": function hideViewSlots( ){
		$( "[data-page]", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"clearViewSlotsData": function clearViewSlotsData( ){
		this.setState( this.getInitialState( ) );
	},

	"onEachSlot": function onEachSlot( slot ){
		for( var key in slot ){
			if( _.isEmpty( slot[ key ] ) &&
				typeof slot[ key ] != "object" &&
				typeof slot[ key ] != "number" )
			{
				slot[ key ] = "Not Available";
			}
		}
		
		return; //: @template: template/view-slot.html
	},

	"getDefaultProps": function getDefaultProps( ){
		return {
			"component": null
		};
	},

	"getInitialState": function getInitialState( ){
		return {
			"slots": [ ]
		};
	},

	"render": function onRender( ){
		return; //: @template: template/view-slots.html
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		
	},

	"componentDidMount": function componentDidMount( ){
		PubSub.subscribe( "close-view-slots",
			( function onCloseViewSlots( ){
				this.hideViewSlots( );
			} ).bind( this ) );		

		PubSub.subscribe( "show-view-slots",
			( function onShowViewSlots( ){
				this.showViewSlots( );
			} ).bind( this ) );

		PubSub.subscribe( "set-view-slots",
			( function onSetViewSlots( slots ){
				this.setState( {
					"slots": slots
				} );
			} ).bind( this ) );

		this.hideViewSlots( );
	}
} );

ViewSlots.load( );
//: @end-administrator-mode