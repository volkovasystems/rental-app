//: @administrator-mode:
Component( "add-price-category" ).load( "section[add-price-category]",
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
				"description": ""
			};
		},

		"render": function onRender( ){
			return; //: @template: template/add-price-category.html
		},

		"componentDidMount": function componentDidMount( ){
			this.hide( );
		}
	} ) );
//: @end-administrator-mode
