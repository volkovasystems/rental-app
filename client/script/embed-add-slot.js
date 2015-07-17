//: @administrator-mode:
var EmbedAddSlot = React.createClass( {
	"namespace": "embed-add-slot",

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

		PubSub.publish( "add-slot-now" );
	},

	"open": function open( ){
	},

	"request": function request( ){

	},

	"getInitialState": function getInitialState( ){
		return {
			"title": "",
			"name": "",
			"description": "",

			"directions": "",
			"instructions": "",

			"place": "",
		};
	},

	"render": function render( ){
		return; //: @template: template/embed-add-slot.html
	},

	"componentDidMount": function componentDidMount( ){
		this.hide( );
	}
} );
//: @end-administrator-mode