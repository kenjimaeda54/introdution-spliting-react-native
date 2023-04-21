import { useNavigation } from "@react-navigation/native"
import { View } from "react-native"
import { Container, Image, Text, Button } from "./introdution.styles"


export default function Introdution() {
  const { navigate } = useNavigation()

  const handleNavigation = () => navigate("home")

  return (
    <Container>
      <View>
        <Image resizeMode="contain" source={require("../../assets/images/bubble-gum-workflow.png")} />
        <Text>Ola seja bem vindo!!{`\n`}Esta aplicação e para demonstrar o uso de code spliting no React Native.{`\n`}Abordagem aplicada foi uso de bundle remotos.{`\n`}Que massa ne?{`\n`}Clica em ver, para navegar para outra tela.{`\n`}Esta tela sera carregada dinamicamente por um CDN, que possui o bundle necessário para carregar apenas ela.</Text>
      </View>
      <Button onPress={handleNavigation}>
        <Text>Ver</Text>
      </Button>
    </Container>
  )
}

