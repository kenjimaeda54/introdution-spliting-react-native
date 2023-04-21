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
