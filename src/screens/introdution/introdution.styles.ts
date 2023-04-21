import styled from "@emotion/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.primary};
  justify-content: space-between;
  align-items: center;
  padding: 80px 20px;
`

export const Image = styled.Image`
  width: 200px;
  height: 200px;
  align-self: center;
`

export const Text = styled.Text`
 font-family: 'Poppins-LightItalic';
 font-size: 19px;
 color: ${({ theme }) => theme.pewter}; 
 line-height: 25px; 
`

export const Button = styled.TouchableOpacity`
  width: 120px;
  padding: 10px 25px;
  margin-top: 25px;
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 17px;
  align-items: center;
`
