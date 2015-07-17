/*:
	Name and title are state properties and we need
		to convert human input title into name format.
*/
var TitleNameMixin = {
	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		if( "title" in prevState &&
			"title" in this.state &&
			prevState.title != this.state.title )
		{
			this.setState( {
				"name": S( this.state.title.toLowerCase( ) ).dasherize( ).toString( )
			} );
		}
	}
};
