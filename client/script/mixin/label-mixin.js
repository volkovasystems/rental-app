var LabelMixin = {
    "getDefaultProps": function getDefaultProps( ){
		return {
            "label": ""
		};
	},

    "getInitialState": function getInitialState( ){
        return {
            "title": ""
        }
    },

    "titlelizeLabel": function titlelizeLabel( ){
        this.setState( {
            "title": titlelize( this.props.label )
        } );
    },

    "componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
        if( prevProps.label != this.props.label ){
            this.titlelizeLabel( );
		}
    },

    "componentDidMount": function componentDidMount( ){
        this.titlelizeLabel( );
    }
};
