//: @administrator-mode:
var EmbedAddPark = React.createClass( {
	"namespace": "embed-add-park",

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

		PubSub.publish( "add-park-now" );
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
		return; //: @template: template/embed-add-park.html
	},

	"componentDidMount": function componentDidMount( ){
		this.hide( );
	}
} );
//: @end-administrator-mode