import { Stack } from "expo-router";
import "./global.css"
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor='#2E7D32' />
        <Stack>

          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="addlog"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="backupRestore"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="edit/[id]"
            options={{
              headerShown: false,
            }}
          />


          <Stack.Screen
            name="log/[id]"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}