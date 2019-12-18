const path = require('path');
const webpack = require('webpack');
module.exports = {  
	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
			// "window.jQuery": "jquery"
		}),

		// new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js', Infinity)
		new webpack.ProvidePlugin({
			d3: 'd3'
		}),
		new webpack.ProvidePlugin({
			d3Tip: 'd3-tip'
		}),
		new webpack.ProvidePlugin({
			dc: 'dc'
		}),
		new webpack.ProvidePlugin({
			crossfilter: 'crossfilter2'
		}),
		new webpack.ProvidePlugin({
			vis: 'vis'
		}),
		new webpack.ProvidePlugin({
			moment: 'moment'
		}),
		new webpack.ProvidePlugin({
			L: 'leaflet'
		}),
		new webpack.ProvidePlugin({
			request: 'request'
		})
	],
	resolve : {
		alias: {
			// bind version of jquery-ui
			// "jquery-ui": "jquery-ui/jquery-ui.js",      
			// bind to modules;
			modules: path.join(__dirname, "node_modules")
		}
	},
	entry: {
		app: './src/js/app.js',
		vendors: ['jquery', 'd3', 'd3-tip', 'dc', 'crossfilter2', 'moment', 'leaflet', 'request']
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	}, 
	// module: {
	// 	loaders: [
	// 		{ 
	// 			test: /\.json$/, 
	// 			loader: 'json-loader' 
	// 		}
	// 	]
	// },
	node: {
		console: true,
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	}
};