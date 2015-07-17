Object.defineProperty( window, "QWEST_OPTION",
	{
		"enumerable": false,
		"configurable": false,
		"get": function get( ){
			return { 
				"dataType": "json", 
				"timeout": 10000, 
				"attempts": 1,
				"responseType": "json"
			};
		},
		"set": function set( ){ }
	} );