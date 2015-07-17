var ControlMixin = {
    "click": function click( ){
        if( !_.isEmpty( this.props.click ) &&
            typeof this.props.click == "function" )
        {
            this.props.click.apply( null, _.toArray( arguments ) );
        }
    },

    "getDefaultProps": function getDefaultProps( ){
        return {
            "icon": "",
            "click": function click( ){ }
        }
    }
};
