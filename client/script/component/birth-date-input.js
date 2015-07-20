var BirthDateInput = React.createClass( {
    "type": "birth-date-input",

    "mixins": [
		ComponentMixin,
        ShowHideComponentMixin,

        LabelMixin,
		InputMixin
	],

    "render": function render( ){
        var ID = this.getID( );

        return (
            <div
                id={ ID }
                data-component
                data-birth-date-input={ this.props.name }>
                <DateInput
                    name={ this.props.name }
                    label="birth-date"
                    monthPlaceholder={ "Enter your month of birth." }
                    dayPlaceholder={ "Enter your day of birth." }
                    yearPlaceholder={ "Enter your year of birth." }
                    input={ this.props.input }
                    update={ this.update }>
                </DateInput>
            </div>
        );
    }
} );
