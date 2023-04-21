# Spliting react native
Pequena aplicação para compreender splitting react native com webpack

## Motivação
Colocar em pratica o uso de Webpack com react native, usando recursos que normalmente aplicamos na web.
Para conseguir usar o Webpack utilizei a lib [repack](https://www.npmjs.com/package/@callstack/repack)

## Introdução
Code Splitting e um recurso disponivel no React a partir da versão 17, por padrão React native não fornece esse recurso pois o usamos o Metro.</br>
No desenvolvimento Web React por muito tempo foi construido com Webpack , possibilitando utilizar todos os plugins disponiveis desse empacotador</br>
Por isso conseguimos utilizar tambem a questão de Micro Serviços com o uso do Module Federation, se desejar pode consultar alguns dos meus repos com uso do [Module Federation](https://github.com/kenjimaeda54/dashboard-micro-front-end) na Web</br>
Com a vinda do webpack para React Native podemos usar alem do code spliting,usarmos outros plugins que são recursos do Webapck como Module Federation ou seja Micro Serviços</br>
Este repo e abordagem de code spliting usando bundles remotos, no Repack temos a posiblidade de usar bundels locais que e o tradicional recomendado nas documentações do React e tambem remotos que são bundles que serviços na Web e consumimos</br>
Escolhi essa abordagem por inumeras vantagems que vejo como desenvolvidor mobile, sabemos que as aplicações conforme cresecem se tornam dificeis de escalar, testar individual, qualquer erro de feature não tratada prejudica todo o aplicativo alem de o bundle inicial ser deniradi oara carregar toda aplicação</br>
Com bundles remotos usando em conjunto o Erros Bondaries podemos isolar cada feature, e assim se uma falhar ela simplemente não ira prejudicar todo app, podemos colocar um aviso que aquele bundle no momenot não disponivel, alem de que nossa carga inicial para aplicação subir sera menor devido o restante das features mais pessadas estão servidas em um CDN </br>
**Ja parou para imaginar o pder  disso?** </br>

## Feature
- Para configurar e usar webpack ao inves do metro pode seguir essas documentações, [LogRocket](https://blog.logrocket.com/repack-large-scale-react-native-apps/) e [Repack](https://re-pack.netlify.app/)
- Inclusive com elas que consegui aplicar todo o codigo, porem eu vou criar um roteiro para se orientar usando o meu racicio que montei para construir essa aplicação
- Primeiramente e instalar as dependencias elas estão disponiveis no Quick Start na dos do Repack,segundo fazer as configurações nativas para cada plataforma no IOS precisa indiciar no Build Phases e no Android no build.gradle,podem continuar os passos da documentação
- Terceiro foi criar um arquivo **react-native.config.js**

```typescript
// react-native.config.js

module.exports = {
  commands: require('@callstack/repack/commands'),
  assets: ['./assets/fonts/'],
};


```

- Quarto   altera o script para iniciar o projeto, ja que não irei mais usar o metro


```json
// packjson

 "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native webpack-start",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx"
  },

```
-  Quinto indicar o nome no app.json do meus bundles, eu escolhi usar remoto 
-  Reapare que **scr_screens_home_Home_tsx** e o caminho correto dos meus diretorios,isto não e concidencia precisa indicar o caminhoo correto onde sera carregado o bundle


```json

 | scr
 | screens
   | home
    | Home.tsx


app.json 


{
  "name": "code_spliting",
  "displayName": "code_spliting",
  "remoteChunks": [
    "src_screens_home_Home_tsx"
  ],
   
}

```
- Sexta no caso ultima configuração, seria criar o arquivo webpack.config.mjs e permitido criar outras extensões fica a seu creterio,pode se orientar pela docs
- Este arquivo e bem paticular mas tem um boilerplate pronto com as configurações padroes [aqui](https://github.com/callstack/repack/blob/main/templates/webpack.config.mjs)
- Possivelmente este arquivo acima precisara ser alterado de acordo com seu projeto abaixo irei mencionar as minhas mudanças para meu casso de uso
- Basciamente carreguei meu appJson pois nele contem meus bundles,indiquei o publicPath onde esta os assets remotos tambem relacionado aos assetes usei o auxiliaryAssetsPath para indicar uma pasta quando e gerado o build e por fim criei um extraChuncks e ali que estara o pacote remoto que iremos compartilhar na web para ser consumido na aplicação

```javascript
import path from 'path';
import fs from 'fs';
import TerserPlugin from 'terser-webpack-plugin';
import * as Repack from '@callstack/repack';


/**
 * More documentation, installation, usage, motivation and differences with Metro is available at:
 * https://github.com/callstack/repack/blob/main/README.md
 *
 * The API documentation for the functions and plugins used in this file is available at:
 * https://re-pack.netlify.app/
 */

/**
 * Webpack configuration.
 * You can also export a static object or a function returning a Promise.
 *
 * @param env Environment options passed from either Webpack CLI or React Native CLI
 *            when running with `react-native start/bundle`.
 */


const loadJSON = (_path) => JSON.parse(fs.readFileSync(new URL(_path, import.meta.url))); 
const appJson = loadJSON('./app.json');   // carreguei o app.json , nele esta as configurações dos bundles remotos

export default (env) => {
  const {
    mode = 'development',
    context = Repack.getDirname(import.meta.url),
    entry = './index.js',
    platform = process.env.PLATFORM,
    minimize = mode === 'production',
    devServer = undefined,
    bundleFilename = undefined,
    sourceMapFilename = undefined,
    assetsPath = undefined,
    reactNativePath = new URL('./node_modules/react-native', import.meta.url)
      .pathname,
  } = env;
  const dirname = Repack.getDirname(import.meta.url);

  if (!platform) {
    throw new Error('Missing platform');
  }

  /**
 * Using Module Federation might require disabling hmr.
 * Uncomment below to set `devServer.hmr` to `false`.
 *
 * Keep in mind that `devServer` object is not available
 * when running `webpack-bundle` command. Be sure
 * to check its value to avoid accessing undefined value,
 * otherwise an error might occur.
 */
  // if (devServer) {
  //   devServer.hmr = false;
  // }

  /**
   * Depending on your Babel configuration you might want to keep it.
   * If you don't use `env` in your Babel config, you can remove it.
   *
   * Keep in mind that if you remove it you should set `BABEL_ENV` or `NODE_ENV`
   * to `development` or `production`. Otherwise your production code might be compiled with
   * in development mode by Babel.
   */
  process.env.BABEL_ENV = mode;

  return {
    mode,
    /**
     * This should be always `false`, since the Source Map configuration is done
     * by `SourceMapDevToolPlugin`.
     */
    devtool: false,
    context,
    /**
     * `getInitializationEntries` will return necessary entries with setup and initialization code.
     * If you don't want to use Hot Module Replacement, set `hmr` option to `false`. By default,
     * HMR will be enabled in development mode.
     */
    entry: [
      ...Repack.getInitializationEntries(reactNativePath, {
        hmr: devServer && devServer.hmr,
      }),
      entry,
    ],
    resolve: {
      /**
       * `getResolveOptions` returns additional resolution configuration for React Native.
       * If it's removed, you won't be able to use `<file>.<platform>.<ext>` (eg: `file.ios.js`)
       * convention and some 3rd-party libraries that specify `react-native` field
       * in their `package.json` might not work correctly.
       */
      ...Repack.getResolveOptions(platform),

      /**
       * Uncomment this to ensure all `react-native*` imports will resolve to the same React Native
       * dependency. You might need it when using workspaces/monorepos or unconventional project
       * structure. For simple/typical project you won't need it.
       */
      alias: {
        'react-native': reactNativePath,
        '@babel/runtime': path.join(dirname, 'node_modules/@babel/runtime'),
      },

    },
    /**
     * Configures output.
     * It's recommended to leave it as it is unless you know what you're doing.
     * By default Webpack will emit files into the directory specified under `path`. In order for the
     * React Native app use them when bundling the `.ipa`/`.apk`, they need to be copied over with
     * `Repack.OutputPlugin`, which is configured by default inside `Repack.RepackPlugin`.
     */
    output: {
      clean: true,
      hashFunction: 'xxhash64',
      path: path.join(dirname, 'build/generated', platform),
      filename: 'index.bundle',
      chunkFilename: '[name].chunk.bundle',
      publicPath: Repack.getPublicPath({ platform, devServer }),
    },
    /**
     * Configures optimization of the built bundle.
     */
    optimization: {
      /** Enables minification based on values passed from React Native CLI or from fallback. */
      minimize,
      /** Configure minimizer to process the bundle. */
      minimizer: [
        new TerserPlugin({
          test: /\.(js)?bundle(\?.*)?$/i,
          /**
           * Prevents emitting text file with comments, licenses etc.
           * If you want to gather in-file licenses, feel free to remove this line or configure it
           * differently.
           */
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
      chunkIds: 'named',
    },
    module: {
      /**
       * This rule will process all React Native related dependencies with Babel.
       * If you have a 3rd-party dependency that you need to transpile, you can add it to the
       * `include` list.
       *
       * You can also enable persistent caching with `cacheDirectory` - please refer to:
       * https://github.com/babel/babel-loader#options
       */
      rules: [
        {
          test: /\.[jt]sx?$/,
          include: [
            /node_modules(.*[/\\])+react/,
            /node_modules(.*[/\\])+@react-native/,
            /node_modules(.*[/\\])+@react-navigation/,
            /node_modules(.*[/\\])+@react-native-community/,
            /node_modules(.*[/\\])+@expo/,
            /node_modules(.*[/\\])+pretty-format/,
            /node_modules(.*[/\\])+metro/,
            /node_modules(.*[/\\])+abort-controller/,
            /node_modules(.*[/\\])+@callstack\/repack/,
          ],
          use: 'babel-loader',
        },
        /**
         * Here you can adjust loader that will process your files.
         *
         * You can also enable persistent caching with `cacheDirectory` - please refer to:
         * https://github.com/babel/babel-loader#options
         */
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              /** Add React Refresh transform only when HMR is enabled. */
              plugins:
                devServer && devServer.hmr
                  ? ['module:react-refresh/babel']
                  : undefined,
            },
          },
        },
        /**
         * This loader handles all static assets (images, video, audio and others), so that you can
         * use (reference) them inside your application.
         *
         * If you wan to handle specific asset type manually, filter out the extension
         * from `ASSET_EXTENSIONS`, for example:
         * ```
         * Repack.ASSET_EXTENSIONS.filter((ext) => ext !== 'svg')
         * ```
         */
        {
          test: Repack.getAssetExtensionsRegExp(Repack.ASSET_EXTENSIONS),
          use: {
            loader: '@callstack/repack/assets-loader',
            options: {
              platform,
              devServerEnabled: Boolean(devServer),
              /**
               * Defines which assets are scalable - which assets can have
               * scale suffixes: `@1x`, `@2x` and so on.
               * By default all images are scalable.
               */
              scalableAssetExtensions: Repack.SCALABLE_ASSETS,
              remote: {
                enabled: true,
                publicPath: "https://storagekenji.b-cdn.net",    //indiquei onde esta os assets remotos
              },
            },
          },
        },
      ],
    },
    plugins: [
      /**
       * Configure other required and additional plugins to make the bundle
       * work in React Native and provide good development experience with
       * sensible defaults.
       *
       * `Repack.RepackPlugin` provides some degree of customization, but if you
       * need more control, you can replace `Repack.RepackPlugin` with plugins
       * from `Repack.plugins`.
       */
      new Repack.RepackPlugin({
        context,
        mode,
        platform,
        devServer,
        output: {
          bundleFilename,
          sourceMapFilename,
          assetsPath,
          auxiliaryAssetsPath: path.join("build/output", platform, "remote"), //indiquei uma pasta com os assets gerados do build
        },
        extraChunks: [
          {
            include: appJson.remoteChunks,
            type: 'remote',
            outputPath: path.join('build/output', platform, 'remote'), // indiquei uma pasta onde sera a saida dos bundles remotos e este bundle que jogo no servidor
          },
        ],
      }),
    ],
  };
};






```










