Component( "home" ).load( "section[home]",
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

		"login": function login( ){
			this.close( );

			Login.open( );
		},

		"register": function register( ){
			this.close( );

			Register.open( );
		},

		"render": function onRender( ){
			return; //: @template: template/home.html
		},

		"componentDidMount": function componentDidMount( ){
			this.open( );
		}
	} ) );
