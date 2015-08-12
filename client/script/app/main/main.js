var Main = React.createClass( {
	"mixins": [
		ComponentMixin,

		PageMixin
	],

	"render": function onRender( ){
		return; //: @template: template/main.html
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

Component( "main" ).load( "section[main]", <Main /> );
