var _ = require( "lodash" );
var colors = require( "color-name" );
var S = require( "string" );

var vehicleColors = [
	"LightPink",
	"Pink",
	"Crimson",
	"LavenderBlush",
	"PaleVioletRed",
	"HotPink",
	"DeepPink",
	"MediumVioletRed",
	"Orchid",
	"Thistle",
	"Plum",
	"Violet",
	"Magenta",
	"Fuchsia",
	"DarkMagenta",
	"Purple",
	"MediumOrchid",
	"DarkViolet",
	"DarkOrchid",
	"Indigo",
	"BlueViolet",
	"MediumPurple",
	"MediumSlateBlue",
	"SlateBlue",
	"DarkSlateBlue",
	"Lavender",
	"GhostWhite",
	"Blue",
	"MediumBlue",
	"MidnightBlue",
	"DarkBlue",
	"Navy",
	"RoyalBlue",
	"CornflowerBlue",
	"LightSteelBlue",
	"LightSlateGray",
	"SlateGray",
	"DodgerBlue",
	"AliceBlue",
	"SteelBlue",
	"LightSkyBlue",
	"SkyBlue",
	"DeepSkyBlue",
	"LightBlue",
	"PowderBlue",
	"CadetBlue",
	"Azure",
	"LightCyan",
	"PaleTurquoise",
	"Cyan",
	"Aqua",
	"DarkTurquoise",
	"DarkSlateGray",
	"DarkCyan",
	"Teal",
	"MediumTurquoise",
	"LightSeaGreen",
	"Turquoise",
	"Aquamarine",
	"MediumAquamarine",
	"MediumSpringGreen",
	"MintCream",
	"SpringGreen",
	"MediumSeaGreen",
	"SeaGreen",
	"Honeydew",
	"LightGreen",
	"PaleGreen",
	"DarkSeaGreen",
	"LimeGreen",
	"Lime",
	"ForestGreen",
	"Green",
	"DarkGreen",
	"Chartreuse",
	"LawnGreen",
	"GreenYellow",
	"DarkOliveGreen",
	"YellowGreen",
	"OliveDrab",
	"Beige",
	"LightGoldenrodYellow",
	"Ivory",
	"LightYellow",
	"Yellow",
	"Olive",
	"DarkKhaki",
	"LemonChiffon",
	"PaleGoldenrod",
	"Khaki",
	"Gold",
	"Cornsilk",
	"Goldenrod",
	"DarkGoldenrod",
	"FloralWhite",
	"OldLace",
	"Wheat",
	"Moccasin",
	"Orange",
	"PapayaWhip",
	"BlanchedAlmond",
	"NavajoWhite",
	"AntiqueWhite",
	"Tan",
	"BurlyWood",
	"Bisque",
	"DarkOrange",
	"Linen",
	"Peru",
	"PeachPuff",
	"SandyBrown",
	"Chocolate",
	"SaddleBrown",
	"Seashell",
	"Sienna",
	"LightSalmon",
	"Coral",
	"OrangeRed",
	"DarkSalmon",
	"Tomato",
	"MistyRose",
	"Salmon",
	"Snow",
	"LightCoral",
	"RosyBrown",
	"IndianRed",
	"Red",
	"Brown",
	"FireBrick",
	"DarkRed",
	"Maroon",
	"White",
	"WhiteSmoke",
	"Gainsboro",
	"LightGrey",
	"Silver",
	"DarkGray",
	"Gray",
	"DimGray",
	"Black"
].map( function onEachColor( colorName ){
	var colorString = S( colorName );

	return {
		"name": colorString.dasherize( ).toString( ).replace( /^\-/, "" ),
		"title": colorString.humanize( ).toString( ),
		"rgb": colors[ colorName.toLowerCase( ) ]
	};
} );

var basicColors = [ 
	"black", 
	"blue",  
	"gray", 
	"green", 
	"red", 
	"silver", 
	"white", 
	"yellow",
	"brown",
	"gold",
	"beige"
];
var vehicleBasicColors = vehicleColors.filter( function onEachColor( colorData ){
	return _.contains( basicColors, colorData.name );
} );

global.VEHICLE_COLORS = ( function( ){
	var vehicleColorsData = { };

	var vehicleColorsLength = vehicleColors.length;
	var vehicleColor = null;
	for( var index = 0; index < vehicleColorsLength; index++ ){
		vehicleColor = vehicleColors[ index ];

		vehicleColorsData[ vehicleColor.name ] = vehicleColor;
	}

	return vehicleColorsData;
} )( );

APP.get( "/api/:accessID/vehicle/color/all",
	function onGetAllColor( request, response ){
		response
			.status( 200 )
			.json( {
				"status": "success",
				"data": vehicleColors
			} );
	} );

APP.get( "/api/:accessID/vehicle/color/basic/all",
	function onGetAllColor( request, response ){
		response
			.status( 200 )
			.json( {
				"status": "success",
				"data": vehicleBasicColors
			} );
	} );