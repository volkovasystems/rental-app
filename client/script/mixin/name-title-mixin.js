/*:
    Name is in the props and we need to convert it
        to title form to the state.
*/
var NameTitleMixin = {
	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
        if( prevProps.name != this.props.name ){
			this.setState( {
				"title": titlelize( this.props.name )
			} );
		}
	}
};
