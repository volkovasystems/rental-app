var Headbar = React.createClass( {
	"mixins": [
		ComponentMixin,
		StateChangeMixin,
		ShowHidePageMixin,
		ClearStateMixin,
		PageTraversalMixin,

		PageMixin
	],

	"getDefaultProps": function getDefaultProps( ){
		return {
			"tab": "",
			"tabs": [ ]
		};
	},

	"getInitialState": function getInitialState( ){
		return {
			"tab": ""
		};
	},

	"onEachTab": function onEachTab( tab ){
		var tabPage = S( [ "-", tab, "-page" ].join( "" ) ).camelize( ).toString( );

		return (
			<div
				data-tab-item>
				<Control
					name={ tab }
					click={ window[ tabPage ].open }>
				</Control>
			</div>
		);
	},

	"render": function onRender( ){
		var ID = this.getID( );

		var tab = this.state.tab;

		var tabs = _.without( this.props.tabs, tab );

		return (
			<div
				id={ ID }
				data-component
				data-page>
				<div
					data-headbar>
					<div
						data-dashbar-header>
						<ExpandControl
							name={ tab }
							openIcon="menu"
							closeIcon="close"
							expanded={ false }
							open={ Dashbar.of( tab ).open }
							close={ Dashbar.of( tab ).close }>
						</ExpandControl>
					</div>

					<div
						data-tab-list>
						{ tabs.map( this.onEachTab ) }
					</div>

					<div
						data-opbar-header>
						<IconControl
							name={ tab }
							icon="more_vert"
							click={ Opbar.of( tab ).open }>
						</IconControl>
					</div>
				</div>
			</div>
		);
	},

	"componentDidUpdate": function componentDidUpdate( ){

	},

	"componentDidMount": function componentDidMount( ){
		this.hide( );
	}
} );
