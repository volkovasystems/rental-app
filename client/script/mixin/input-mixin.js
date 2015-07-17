var InputMixin = {
    "update": function update( event ){
        this.props.update( event );
    },

	"getDefaultProps": function getDefaultProps( ){
		return {
            //: This will be the initial input.
			"input": "",
            "placeholder": "",
			"update": function update( ){ },
            "click": function click( ){ }
		};
	},

    "componentWillMount": function componentWillMount( ){
        if( _.isEmpty( this.props.update ) ){
            throw new Error( "input update method was not initialized" );
        }

        if( typeof this.props.update != "function" ){
            throw new Error( "invalid input update method data type" );
        }
    }
};
