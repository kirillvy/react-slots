const path = require("path");

module.exports = ({config, mode}) => {
  console.log(path.join(__dirname, '../tsconfig.json'));
	config.module.rules.push(
		{
			test: /\.ts(x)?$/,
			include: [
				path.resolve(__dirname, '../../rest-api/src'),
				path.resolve(__dirname, '../../ui_system/src'),
				path.resolve(__dirname, "../src"),
			],
			use: [
        {
          loader: require.resolve("ts-loader"),
          options: {
            configFile: path.join(__dirname, '../tsconfig.json'),
          }
        },
        // {
        //   loader: require.resolve("react-docgen-typescript-loader"),
        //   options: {
        //     tsconfigPath: path.join(__dirname, '../tsconfig.json'),
        //   }
        // },
				
			],
		}
	);


	config.resolve.extensions.push(".ts", ".tsx");

		config.optimization = {
			splitChunks: {
				chunks: 'all'
			}
	  };

	return config;
};
