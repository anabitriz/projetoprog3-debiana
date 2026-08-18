import React from "react";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import * as Notifications from "expo-notifications";


// =====================================================
// CONFIGURAÇÃO DAS NOTIFICAÇÕES
// =====================================================

Notifications.setNotificationHandler({

  handleNotification: async () => ({

    shouldShowAlert: true,

    shouldPlaySound: true,

    shouldSetBadge: false,

    shouldShowBanner: true,

    shouldShowList: true,

  }),

});


// =====================================================
// SCREENS
// =====================================================

import CadastroScreen
  from "./screens/CadastroScreen";

import LoginScreen
  from "./screens/LoginScreen";

import EnviarNotificacaoScreen
  from "./screens/EnviarNotificacaoScreen";


// =====================================================
// NAVEGAÇÃO
// =====================================================

const Stack =
  createNativeStackNavigator();


// =====================================================
// APP
// =====================================================

export default function App() {

  return (

    <NavigationContainer>

      <Stack.Navigator

        initialRouteName="Cadastro"

        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}

      >

        <Stack.Screen
          name="Cadastro"
          component={CadastroScreen}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="EnviarNotificacao"
          component={EnviarNotificacaoScreen}
        />

      </Stack.Navigator>

    </NavigationContainer>

  );

}
