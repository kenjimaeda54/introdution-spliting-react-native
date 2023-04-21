import { useTheme } from "@emotion/react";
import { ActivityIndicator } from "react-native";
import { Container } from "./loading.styles"

export default function Loading() {
  const theme = useTheme()

  return (
    <Container >
      <ActivityIndicator size="large" color={theme.pewter} />
    </Container>
  )
}
