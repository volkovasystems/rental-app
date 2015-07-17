//: @administrator-mode:
var EmbedAddPlace = React.createClass( {
	"namespace": "embed-add-place",

	"mixins": [ 
		ComponentPropertyMixin,
		StateChangeMixin, 
		TitleNameMixin,
		ShowHidePageMixin,
		ClearStateMixin,
		PageTraversalMixin,

		AddPlaceMixin
	],

	"now": function now( ){
		this.request( );

		this.close( );

		PubSub.publish( "add-place-now" );
	},

	"open": function open( ){
	},

	"request": function request( ){

	},

	"getInitialState": function getInitialState( ){
		return {
			"name": "",
			"title": "",
			"description": "",
			
			"address": "",

			"latitude": 0,
			"longitude": 0,
			"zoom": 0,

			"amenities": [ ],
			"images": [ ],

			"instructions": "",
			"rate": ""
		};
	},

	"render": function render( ){
		return; //: @template: template/embed-add-place.html
	},

	"componentDidMount": function componentDidMount( ){
		this.hide( );
	}
} );
//: @end-administrator-mode