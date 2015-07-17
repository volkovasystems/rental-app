var ClearStateMixin = {
	/*:
		This will fix clearState because getInitialState is missing.
		So we provided defaults.
	*/
	"getInitialState": function getInitialState( ){
		return { };
	},

	"clearState": function clearState( ){
		this.setState( this.getInitialState( ) );
	}
};
