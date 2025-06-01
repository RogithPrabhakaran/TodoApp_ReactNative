import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/context/ThemeContext";
import { useFonts, Montserrat_500Medium } from "@expo-google-fonts/montserrat";
import { View, Text } from "react-native";
export default function RootLayout() {

  const [fontsLoaded, fontError] =  useFonts({
          Montserrat_500Medium,
  });
  
  if(!fontsLoaded && !fontError){
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;
  }
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="index" />
          <Stack.Screen name="todos/[id]" />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
