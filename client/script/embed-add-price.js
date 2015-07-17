//: @administrator-mode:
var EmbedAddPrice = React.createClass( {
	"namespace": "embed-add-price",

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

		PubSub.publish( "add-price-now" );
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
		return; //: @template: template/embed-add-price.html
	},

	"componentDidMount": function componentDidMount( ){
		this.hide( );
	}
} );
//: @end-administrator-mode