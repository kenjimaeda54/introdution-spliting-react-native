# Spliting react native
Pequena aplicação para compreender splitting react native com webpack

## Motivação
Colocar em prática o uso de Webpack com React Native, usando recursos que normalmente aplicamos na web. </br>
Para conseguir usar o Webpack utilizei a LIB [repack](https://www.npmjs.com/package/@callstack/repack)

## Introdução
Code Splitting é um recurso disponível no React a partir da versão 17, por padrão React native não fornece esse recurso, pois o usamos o Metro.</br>
No desenvolvimento web usando React por muito tempo foi construído com Webpack, possibilitando utilizar todos os plugins disponíveis desse empacotador</br>
Por isso conseguimos utilizar também a questão de Micro Serviços com o uso do Module Federation, se desejar pode consultar alguns dos meus repos com uso do [Module Federation](https://github.com/kenjimaeda54/dashboard-micro-front-end) na Web</br>
Com a vinda do webpack para React Native podemos usar além do code spliting, usarmos outros plugins que são recursos do Webapck como Module Federation, ou seja Micro Serviços</br>
Este repo e sobre abordagem de code spliting usando bundles remotos, no Repack temos a possibilidade de usar bundels locais que  é o tradicional recomendado nas documentações do React e também remotos, que são bundles  hospedados  na Web e consumimos</br>
Escolhi essa abordagem por inúmeras vantagens que vejo como desenvolvedor mobile, sabemos que as aplicações conforme crescem se tornam difíceis de escalar, testar individualmente, qualquer erro de funcionaldiade não tratada prejudica todo o aplicativo além de o carregamento inicial ser demorado para carregar toda aplicação</br>
Com bundles remotos usando em conjunto o Erros Bondaries podemos isolar cada funcionalidade, e assim se uma falhar ela simplesmente não ira prejudicar todo APP  colocando um aviso que aquele bundle no momento não disponível, além de que nossa carga inicial para aplicação subir sera menor devido o restante das funcionalidades mais pesadas estão servidas em um CDN </br>
CDN que usei nesta aplicação foi o [Bunny](https://bunny.net/?/?pk_campaign=DynamicAD&pk_source=DynamicAD&pk_medium=DynamicAD&pk_keyword=&device=c&gclid=CjwKCAjw6IiiBhAOEiwALNqncVC4-0aPk1dTlwJWvpL5MQnAYQHB-eJ6OclOOP-cLU4ITBY62io2pRoCpb8QAvD_BwE)
**Ja parou para imaginar o poder  disso?** </br>

## Feature
- Para configurar e usar webpack ao invés do metro pode seguir essas documentações, [LogRocket](https://blog.logrocket.com/repack-large-scale-react-native-apps/) e [Repack](https://re-pack.netlify.app/)
- Inclusive com elas que consegui aplicar todo o código, porem eu vou criar um roteiro para se orientar usando o meu raciocínio que montei para construir essa aplicação
- Primeiramente e instalar as dependências elas estão disponíveis no Quick Start na dos do Repack, segundo fazer as configurações nativas para cada plataforma no IOS precisa indiciar no Build Phases e no Android no build.gradle, podem continuar os passos da documentação
- Terceiro foi criar um arquivo **react-native.config.js**

```typescript
// react-native.config.js

module.exports = {
  commands: require('@callstack/repack/commands'),
  assets: ['./assets/fonts/'],
};


```

- Quarto   altera o script para iniciar o projeto, já que não irei mais usar o metro

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
-  Quinto indicar   no app.json os nomes dos meus bundles 
-  Repare que **scr_screens_home_Home_tsx** e o caminho correto dos meus diretórios, isto não é coincidência, precisa indicar o caminho correto onde sera carregado o bundle, pelo menos foi a maneira mais confortável que encontrei


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
- Sexto seria criar o arquivo webpack.config.mjs e permitido criar outras extensões fica a seu critério, pode se orientar pela docs
- Este arquivo e bem particular, mas tem um boilerplate pronto com as configurações padrões [aqui](https://github.com/callstack/repack/blob/main/templates/webpack.config.mjs)
- Possivelmente este arquivo acima precisara ser alterado de acordo com seu projeto, abaixo irei mencionar as minhas mudanças para meu casso de uso
- Basicamente carreguei meu appJson, pois nele contem meus bundles, indiquei o publicPath onde esta os assets remotos também relacionado aos assetes, usei o auxiliaryAssetsPath para indicar uma pasta quando e gerado a build e por fim criei um extraChuncks e ali que estará o pacote remoto que iremos compartilhar na web para ser consumido na aplicação


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

- Ultima configuração e criar no index.js um caminho para desenvolvimento e prod, em vista que desenvolvimento podemos usar o próprio servidor que esta rodando no terminal
- Tabem cacheamos o scriptManager

```javscript
/**
 * @format
 */
import { ScriptManager, Script } from '@callstack/repack/client';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import AsyncStorage from "@react-native-async-storage/async-storage"

ScriptManager.shared.setStorage(AsyncStorage);


ScriptManager.shared.addResolver(async (scriptId) => {

  if (__DEV__) {
    return {
      url: Script.getDevServerURL(scriptId),
      cache: false,
    };
  }

  // se for em produção preciso usar um servidor
  return {
    url: Script.getRemoteURL(`https://storagekenji.b-cdn.net/${scriptId}`)
  };
});



AppRegistry.registerComponent(appName, () => App);



```

- Se você em algum momento já aplicou code spliting no React deve saber que normalmente isto é aplicado usando nas navegações, aqui foi feito da mesmo maneira
- Dentro da navegação eu chamo o meu modulo 
- De prefenrencia usar webpackChunkName para poder usar sua propria importação e exportação de chunks


```typescript
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeModule from "../modules/home/home_modules"
import Introdution from "../screens/introdution/Introdution"

const { Navigator, Screen } = createNativeStackNavigator()


export default function CoreRoutes() {

  return (
    <Navigator screenOptions={{
      headerShown: false
    }} initialRouteName="introdution" >
      <Screen name="home" component={HomeModule} />
      <Screen name="introdution" component={Introdution} />
    </Navigator>

  )

}


// modulo
import { Suspense, lazy } from "react"
import Loading from "../../components/loading/Loading"

//o caminho precisa ser correto da tela
const HomeLazy = lazy(() => import(/* webpackChunkName: "home" */  '../../screens/home/Home'))


export default function HomeModule() {
  return (
    <Suspense fallback={<Loading />} >
      <HomeLazy />
    </Suspense>
  )
}


// tela
import { Linking, TouchableOpacity, View } from "react-native"
import { Container, Image, Text, TextCodeSource, Button } from "./home.styles"
import { useCallback } from "react"
import FastImage from "react-native-fast-image"


export default function Home() {

  const handleOpenUrl = useCallback(async () => {
    const supported = await Linking.canOpenURL("https://github.com/kenjimaeda54/-introdution-spliting-react-native")

    if (supported) {
      await Linking.openURL("https://github.com/kenjimaeda54/-introdution-spliting-react-native")
    }
  }, [])

  return (
    <Container>
      <View>
        <FastImage
          style={{ width: 200, height: 200, alignSelf: "center" }}
          source={{
            uri: 'https://storagekenji.b-cdn.net/legos.png',
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text>
          Esta tela foi carregada dinamicamente.{`\n`}Sem duvidas agora react native se torna muito mais escalavel.{`\n`}Podemos compartilhar minis apps, diminuindo assim carga inicial para carregar aplicação,otimizando a performace e a escalibilidade{`\n`}
        </Text>
      </View>
      <Button onPress={handleOpenUrl}>
        <TextCodeSource>Code source</TextCodeSource>
      </Button>
    </Container>
  )
}



```

##  Dicas
- Vou compartilhar algumas dificuldades que tive ao longo do desenvolvimento.
- Minha tela home estava em um CDN e o mesmo possui cache, não resolve apenas mudar o código em desenvolvimento, buildar android é colocar o bundle na web e espera que tudo altere
- Então fique a dica, altere o código em desenvolvimento, gere a build normal no android estudio  ou terminal é substituia o bundle no storage do seu CDN e faz o Purge Cache , caso possua esse recurso para apagar os caches
- Use imagens remotas no bundle remoto, eu não consegui compartilhar as imagens locais para dentro dos modulos remotos
- Use um CDN que forneça uma URL e concatena o seu bundle  com essa url, para assim facilitar ao carregar os módulos na aplicação, se repara no **index.js** eu só tenho a base url, resto e dinâmico
- Restante nada muda que você  construí em React Native

## Glossario
### Bundle
Uma coleção de código processado (compilado, transformado), compactado em formato independente por um Bundler (por exemplo: Webpack, Rollup, etc). Inclui não apenas o código-fonte processado, mas todas as dependências necessárias e, geralmente, ativos estáticos.

### Main bundle
Uma forma especial de Bundle, que também é autoexecutável (independente). Ou seja, a execução do pacote principal dentro de uma máquina virtual JavaScript executará seu aplicativo.

Também conhecido como pacote de índice.
Aqui se refere aquele apk ou ipa que geramos

### Chunk
Uma versão mais leve de um pacote, projetado para ser puxado e usado junto com o pacote principal. Um chunk geralmente é adiado e carregado sob demanda pelo bundle principal ou outro chunk. Chunks geralmente podem compartilhar implicitamente e reutilizar dependências uns dos outros e do bundle principal.

Aqui normalmente sera os nossos bundles fornecidos via web por um cdn


### Async Chunk
Uma versão de um Chunk, que é carregado de maneira assíncrona. No contexto do React Native, todos os Chunks são carregados de forma assíncrona, então Chunk e Async chunk podem ser usados ​​de forma intercambiável.

No plural: os chunks assíncronos referem-se a uma abordagem de divisão de código.
E o conceito de carregar via lazy os nossos chunks


### Local Chunk
Um Chunk armazenado localmente em um sistema de arquivos (de um dispositivo móvel), ao contrário de um Chunk Remoto.

Forma tradicional de usar code splitting


### Remoto Chunk
Um Chunk armazenado remotamente no servidor, CDN ou qualquer outro local de rede, ao contrário de um Local chunk.

Maneira que usei neste repo

### Script
Arquivo arbitrário com código executável. Pode ser um Bundle criado por um Bundler (por exemplo: Webpack, Rollup, etc) ou manualmente.

### Container
Uma forma especial de Bundle, que é criada na configuração da Federação de Módulos e é usada pelo bundle Principal. Os contêineres também podem usar outros contêineres e pedaços.

Eu possuo alguns repos usando esse conceito, porem na Web so buscar na barra por micro e vira alguns








