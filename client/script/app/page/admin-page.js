var AdminPage = React.createClass( {
	"mixins": [
		ComponentMixin,

		PageMixin
	],

	"render": function onRender( ){
		return; //: @template: template/admin-page.html
	},

	"getInitialState": function getInitialState( ){
		return {

		};
	},

	"update": function update( event ){
		
	},

	"componentDidMount": function componentDidMount( ){
		this.hide( );
	}
} );

Component( "admin-page" ).load( "section[admin-page]", <AdminPage /> );
