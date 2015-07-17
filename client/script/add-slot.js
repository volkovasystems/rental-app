//: @administrator-mode:
Component( "add-slot" ).load( "section[add-slot]",
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
				"title": "",
				"name": "",
				"description": "",
				"status": "",
				"place": "",
				"park": ""
			};
		},

		"render": function onRender( ){
			return; //: @template: template/add-slot.html
		},

		"componentDidMount": function componentDidMount( ){
			this.hide( );
		}
	} ) );
//: @end-administrator-mode