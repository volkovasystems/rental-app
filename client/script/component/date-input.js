var DateInput = React.createClass( {
	"type": "date-input",

	"mixins": [
		ComponentMixin,
		ClearStateMixin,
		ShowHideComponentMixin,

		LabelMixin,
		InputMixin
	],

	"aggregate": function aggregate( event ){
		var name = event.target.name;

		var value = event.target.value;

		var state = { };
		state[ name ] = value;

		this.setState( state );
	},

	"showMonthSelection": function showMonthSelection( ){
		this.months.openList( );
	},

	"hideMonthSelection": function hideMonthSelection( ){
		this.months.closeList( );
	},

	"selectMonth": function selectMonth( month ){
		this.setState( {
			"month": month
		} );
	},

	"showDaySelection": function showDaySelection( ){
		this.days.openList( );
	},

	"hideDaySelection": function hideDaySelection( ){
		this.days.closeList( );
	},

	"selectDay": function selectDay( day ){
		this.setState( {
			"day": day
		} );
	},

	"showYearSelection": function showYearSelection( ){
		this.years.openList( );
	},

	"hideYearSelection": function hideYearSelection( ){
		this.years.closeList( );
	},

	"selectYear": function selectYear( year ){
		this.setState( {
			"year": year
		} );
	},

	"done": function done( ){
		this.collapse( );
	},

	"collapse": function collapse( ){
		this.showMainInput( );

		this.hideSubInput( );
	},

	"expand": function expand( ){
		this.showSubInput( );

		this.hideMainInput( );

		this.date.blur( );

		this.month.focus( );
	},

	"showMainInput": function showMainInput( ){
		this.date.showComponent( );
	},

	"hideMainInput": function hideMainInput( ){
		this.date.hideComponent( );
	},

	"showSubInput": function showSubInput( ){
		$( "[data-sub-input]", this.getElement( ) )
			.addClass( "shown" )
			.removeClass( "hidden" );
	},

	"hideSubInput": function hideSubInput( ){
		$( "[data-sub-input]", this.getElement( ) )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"getDefaultProps": function getDefaultProps( ){
		return {
			"yearStartLimit": 18,
			"yearEndLimit": 100,
			"monthPlaceholder": "",
			"dayPlaceholder": "",
			"yearPlaceholder": ""
		}
	},

	"getInitialState": function getInitialState( ){
		return {
			"month": "",
			"day": "",
			"year": "",
			"date": ""
		};
	},

	"render": function render( ){
		var ID = this.getID( );

		var months = moment.months( );

		var yearToday = moment( ).year( );
		var endYear = yearToday - this.props.yearStartLimit;
		var startYear = yearToday - this.props.yearEndLimit;
		var years = _.range( startYear, endYear ).reverse( );

		var year = this.state.year || yearToday;
		var month = this.state.month || months[ moment( ).month( ) ];

		var dayCount = moment( [ year, month ], "YYYY-MMMM" ).daysInMonth( );
		var days = _.range( 1, dayCount );
		
		return (
			<div
				id={ ID }
				data-component
				data-date-input={ this.props.name }
				data-align-vertical
				data-align-center>

				<BasicInput
					id="date"
					name="date"
					label={ this.props.label }
					input={ this.props.input }
					update={ this.aggregate }
					click={ this.expand }
					focus={ this.expand }>
				</BasicInput>

				<div
					data-sub-input
					data-align-vertical
					data-align-center>

					<InputHeaderLabel
						name={ this.props.name }
						label={ this.props.label }>
					</InputHeaderLabel>

					<BasicInput
						id="month"
						name="month"
						label="month"
						placeholder={ this.props.monthPlaceholder }
						input={ this.state.month }
						update={ this.aggregate }
						click={ this.showMonthSelection }
						focus={ this.showMonthSelection }
						blur={ this.hideMonthSelection }>
					</BasicInput>

					<ListSelection
						id="months"
						name="months"
						items={ months }
						select={ this.selectMonth }>
					</ListSelection>

					<BasicInput
						name="day"
						label="day"
						placeholder={ this.props.dayPlaceholder }
						input={ this.state.day }
						update={ this.aggregate }
						click={ this.showDaySelection }
						focus={ this.showDaySelection }
						blur={ this.hideDaySelection }>
					</BasicInput>

					<ListSelection
						id="days"
						name="days"
						items={ days }
						select={ this.selectDay }>
					</ListSelection>

					<BasicInput
						name="year"
						label="year"
						placeholder={ this.props.yearPlaceholder }
						input={ this.state.year }
						update={ this.aggregate }
						click={ this.showYearSelection }
						focus={ this.showYearSelection }
						blur={ this.hideYearSelection }>
					</BasicInput>

					<ListSelection
						id="years"
						name="years"
						items={ years }
						select={ this.selectYear }>
					</ListSelection>

					<Control
						name={ this.props.name }
						label="done"
						click={ this.done }>
					</Control>
				</div>
			</div>
		);
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		if( !this.props.input &&
			prevProps.input != this.props.input )
		{
			this.clearState( );
		}

		if( this.state.date &&
			this.state.date != prevState.date )
		{
			this.props.update( EventWrapper( this.props.name, this.state.date ) );
		}

		if( this.state.month &&
			this.state.day &&
			this.state.year &&
			( this.state.month != prevState.month ||
				this.state.day != prevState.day ||
				this.state.year != prevState.year ) )
		{
			this.setState( {
				"date": moment( [
					this.state.month, 
					this.state.day,
					this.state.year
				], "MMMM-DD-YYYY" ).format( "MMMM DD, YYYY" )
			} );
		}
	},

	"componentDidMount": function componentDidMount( ){
		if( !this.props.input ){
			this.clearState( );
		}

		this.hideSubInput( );
	}
} );
