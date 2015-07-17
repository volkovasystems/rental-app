//: @administrator-mode:
Component( "add-reserve" ).load( "section[add-reserve]",
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
			};
		},

		"render": function onRender( ){
			return; //: @template: template/add-reserve.html
		},

		"componentDidMount": function componentDidMount( ){
			this.hide( );
		}
	} ) );
//: @end-administrator-mode