import path from "path"
import BundleDeclarationsPlugin from "bundle-declarations-webpack-plugin"
import { EnvironmentPlugin } from "webpack";

export default async function (env: Record<string | symbol, string>) {
    const
        packageConfig = await import("./package.json"),
        outDir = path.resolve(__dirname, "lib");

    return {
        mode: "production",
        entry: path.resolve(__dirname, "src", "index.ts"),
        output: {
            library: {
                name: packageConfig.name,
                type: "umd"
            },
            path: outDir,
            filename: "index.js"
        },
        externals: {
            lodash: {
                commonjs: 'lodash',
                commonjs2: 'lodash',
                amd: 'lodash',
                root: '_',
            },
            react: "react",
            "react-dom": "react-dom",
            "styled-components": "styled-components"
        },
        resolve: {
            modules: [path.resolve(__dirname, "src"), "node_modules"],
            extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", "mjs", "cjs", ".scss", ".module.scss"],
            alias: {

            }
        },
        plugins: [
            new EnvironmentPlugin(),
            new BundleDeclarationsPlugin({
                entry: path.resolve(__dirname, "src", "index.ts"),
                outFile: "index.d.ts",
                removeRelativeReExport: true
            })
        ],
        module: {
            rules: [
                {
                    test: /(?<!\.(?:stories|test|spec))\.(?:[tj]sx?|[mc]js)$/i,
                    include: path.join(__dirname, "src"),
                    use: [
                        "ts-loader"
                    ]
                },
                {
                    test: /\.(?:jpe?g|png|gif|svg|eot|ttf|woff2?)$/i,
                    type: "asset" // file or data url depending on size
                },
                {
                    test: /\.(?:ico|txt|config|html|xml)$/i,
                    type: "asset/resource" // always file
                }
            ]
        },
        optimization: {
            usedExports: true
        }
    };
}