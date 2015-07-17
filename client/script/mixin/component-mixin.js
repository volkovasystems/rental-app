var ComponentMixin = {
	"getDefaultProps": function getDefaultProps( ){
		return {
			//: This will be used to reference the element of the component.
			"id": "",
			//: The name refers to the usage name of the component.
			"name": "",
			"element": null,
			"component": this
		};
	},

	"componentWillMount": function componentWillMount( ){
		if( _.isEmpty( this.props.name ) ){
			throw new Error( "component name was not initialized" );
		}

		if( typeof this.props.name != "string" ){
			throw new Error( "invalid component name data type" );
		}
	},

	"getID": function getID( ){
		if( !_.isEmpty( this.props.id ) ){
			return this.props.id;

		}else{
			return this.props.name;
		}
	},

	"getType": function getType( ){
		return this.type || "component";
	},

	"getElement": function getElement( ){
		return this.props.element || $( this.getDOMNode( ) );
	}
};
