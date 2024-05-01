const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const htmlPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    devtool: 'cheap-module-source-map',
    entry: {
        popup: path.resolve("./src/popup/popup.jsx"),
    },
    module: {
        rules: [
            {
                use: "ts-loader",
                test: /\.tsx?$/,
                exclude: /node_modules/
            },
            {
                use: ['style-loader', 'css-loader'],
                test: /\.css$/,
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-react"]
                    }
                }
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.resolve("src/assets/manifest.json"), to: path.resolve('dist') },
                { from: path.resolve("src/assets/icon.png"), to: path.resolve('dist') }
            ]
        }),
        new htmlPlugin({
            title: "ReactJS boilerplate",
            filename: "popup.html",
            chunks: ["popup"]
        })
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx"],
        alias: {
            components: path.resolve(__dirname, 'src/components/') // Add alias to access components folder
        }
    },
    output: {
        filename: '[name].js'
    }
};
