//: @administrator-mode:
Component( "add-reserve-state" ).load( "section[add-reserve-state]",
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
			return; //: @template: template/add-reserve-state.html
		},

		"componentDidMount": function componentDidMount( ){
			this.hide( );
		}
	} ) );
//: @end-administrator-mode