//: @administrator-mode:
Component( "add-price" ).load( "section[add-price]",
	React.createClass( {
		"mixins": [ 
			ComponentPropertyMixin,
			StateChangeMixin, 
			TitleNameMixin,
			ShowHidePageMixin,
			ClearStateMixin,
			PageTraversalMixin
		],

		"getInitialState": function getInitialState( ){
			return {
				"name": "",
				"title": "",
				"description": "",
					
				"types": [ ],
				"bounds": [ ],

				"amount": "",
				"currency": "",

				"duration": "",

				"payOptions": [ ]
			};
		},

		"render": function onRender( ){
			return; //: @template: template/add-price.html
		},

		"componentDidMount": function componentDidMount( ){
			this.hide( );
		}
	} ) );
//: @end-administrator-mode