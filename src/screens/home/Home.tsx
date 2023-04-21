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
