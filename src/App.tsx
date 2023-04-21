
import { ThemeProvider } from "@emotion/react"
import { NavigationContainer } from "@react-navigation/native"
import { theme } from "./global/theme"
import CoreRoutes from "./routes/Core.routes"



export default function App() {
  return (
    <ThemeProvider theme={theme} >
      <NavigationContainer>
        <CoreRoutes />
      </NavigationContainer>
    </ThemeProvider>
  )

}
