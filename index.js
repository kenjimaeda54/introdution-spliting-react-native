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
