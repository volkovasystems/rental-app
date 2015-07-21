Component( "admin-page" ).load( "section[admin-page]",
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
			return; //: @template: template/admin-page.html
		},

		"componentDidMount": function componentDidMount( ){
			
		}
	} ) );
