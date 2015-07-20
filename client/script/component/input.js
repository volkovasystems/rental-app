var Input = React.createClass( {
    "type": "input",

	"mixins": [
		ComponentMixin,

        LabelMixin,
		InputMixin,
        PlaceholderMixin,
	],

	"getDefaultProps": function getDefaultProps( ){
		return {
            "format": "text"
		};
	},

    "blur": function blur( ){
        this.hidePlaceholder( );

        this.props.blur( );
    },

    "focus": function focus( ){
        this.showPlaceholder( );

        this.props.focus( );
    },

	"render": function render( ){
        var ID = this.getID( );

		return (
            <div
                id={ ID }
                data-component
                data-input={ this.props.name }>
                <input
                    type={ this.props.format }
                    name={ this.props.name }
                    title={ this.state.title }
                    placeholder={ this.props.placeholder }
                    value={ this.props.input }
                    onFocus={ this.focus }
                    onBlur={ this.blur }
                    onChange={ this.update }/>
            </div>
		);
	},

    "componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
        if( this.props.input != prevProps.input ){
            if( !this.props.input ){
                this.hidePlaceholder( );

            }else{
                this.showPlaceholder( );
            }
        }
    }
} );
