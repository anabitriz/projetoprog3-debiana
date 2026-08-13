import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Cadastro from "./screens/Cadastro";
import Login from "./screens/Login";
import Notification from "./screens/Notification";

import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Cadastro">

        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{
            title: "Cadastro",
          }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: "Login",
          }}
        />

        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{
            title: "Enviar Notificação",
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}