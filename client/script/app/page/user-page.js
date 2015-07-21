Component( "user-page" ).load( "section[user-page]",
	React.createClass( {
		"mixins": [
			ComponentMixin,
			StateChangeMixin,
			ClearStateMixin,
			
			ShowHidePageMixin,
			PageTraversalMixin,

			PageMixin,
			ContentMixin
		],

		"render": function onRender( ){
			return; //: @template: template/user-page.html
		},

		"componentDidMount": function componentDidMount( ){
			
		}
	} ) );
