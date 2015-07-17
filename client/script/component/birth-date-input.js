var BirthDateInput = React.createClass( {
    "mixins": [
		ComponentMixin,

        LabelMixin,
		InputMixin
	],

    "aggregate": function aggregate( ){

    },

    "selectMonth": function selectMonth( ){

    },

    "selectDay": function selectDay( ){

    },

    "selectYear": function selectYear( ){

    },

    "expand": function expand( ){

    },

    "getInitialState": function getInitialState( ){
        return {
            "month": 0,
            "day": 0,
            "year": 0
        };
    },

    "render": function render( ){
        var ID = this.getID( );

        return (
            <div
                id={ ID }
                data-birth-date-input={ this.props.name }
                data-vertical-align>

                <BasicInput
                    id={ "birth-date" }
                    name={ this.props.name }
                    label={ "birth-date" }
                    placeholder={ this.props.placeholder }
                    input={ this.props.input }
                    update={ this.aggregate }
                    click={ this.expand }>
                </BasicInput>

                <div
                    data-sub-input
                    data-vertical-align>
                    <BasicInput
                        name="birth-month"
                        label={ "month" }
                        placeholder="Enter your month of birth."
                        input={ this.state.month }
                        update={ this.aggregate }
                        click={ this.selectMonth }>
                    </BasicInput>

                    <BasicInput
                        name="birth-day"
                        label={ "day" }
                        placeholder="Enter your day of birth."
                        input={ this.state.day }
                        update={ this.aggregate }
                        click={ this.selectDay }>
                    </BasicInput>

                    <BasicInput
                        name="birth-year"
                        label={ "year" }
                        placeholder="Enter your year of birth."
                        input={ this.state.month }
                        update={ this.aggregate }
                        click={ this.selectYear }>
                    </BasicInput>
                </div>
            </div>
        );
    }
} );
