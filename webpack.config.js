const { composePlugins, withNx } = require("@nrwl/webpack");
const { withReact } = require("@nrwl/react");

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
	// Update the webpack config as needed here.
	// e.g. config.plugins.push(new MyPlugin());
	config.module.rules.forEach((rule) => {
		if (String(rule.test).includes("css")) {
			rule.use.push({
				loader: "postcss-loader",
				options: {
					postcssOptions: {
						config: require.resolve("../../postcss.config.js"),
					},
				},
			});
		}
	});
	return config;
});
