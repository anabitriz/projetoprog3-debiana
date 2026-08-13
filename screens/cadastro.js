import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

import { cadastrarUsuario } from "../api";

export default function Cadastro({ navigation }) {

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [token, setToken] = useState("");

  async function obterToken() {
    try {

      if (!Device.isDevice) {
        Alert.alert(
          "Atenção",
          "Use um dispositivo físico."
        );

        return null;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {

        const { status } =
          await Notifications.requestPermissionsAsync();

        finalStatus = status;
      }

      if (finalStatus !== "granted") {

        Alert.alert(
          "Atenção",
          "Permissão de notificação negada."
        );

        return null;
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ||
        Constants?.easConfig?.projectId;

      if (!projectId) {

        Alert.alert(
          "Erro",
          "ProjectId não encontrado. Verifique o app.json."
        );

        return null;
      }

      const pushToken =
        await Notifications.getExpoPushTokenAsync({
          projectId,
        });

      setToken(pushToken.data);

      console.log("EXPO PUSH TOKEN:");
      console.log(pushToken.data);

      return pushToken.data;

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Erro",
        "Não foi possível obter o token."
      );

      return null;
    }
  }

  async function cadastrar() {

    if (!nome || !email || !senha) {

      Alert.alert(
        "Atenção",
        "Preencha Nome, E-mail e Senha."
      );

      return;
    }

    try {

      // Obtém automaticamente o token
      const pushToken = await obterToken();

      if (!pushToken) {
        return;
      }

      const usuario = {
        nome: nome,
        email: email,
        senha: senha,
        token: pushToken,
      };

      console.log("USUÁRIO:");
      console.log(usuario);

      await cadastrarUsuario(usuario);

      Alert.alert(
        "Sucesso",
        "Usuário cadastrado com sucesso!"
      );

      setNome("");
      setEmail("");
      setSenha("");
      setToken("");

      navigation.navigate("Login");

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Erro",
        "Não foi possível cadastrar o usuário."
      );
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Cadastro
      </Text>

      <Text style={styles.subtitulo}>
        Crie sua conta para começar
      </Text>

      <Text style={styles.label}>
        Nome
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>
        E-mail
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>
        Senha
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Text style={styles.label}>
        Token de notificação
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Token será obtido automaticamente"
        value={token}
        editable={false}
      />

      <Text style={styles.info}>
        O token será obtido automaticamente pelo Expo.
      </Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={cadastrar}
      >
        <Text style={styles.textoBotao}>
          Cadastrar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.link}>
          Já tem conta? Entrar
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f7fb",
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },

  subtitulo: {
    textAlign: "center",
    color: "#777",
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#222",
    marginTop: 10,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d0d3dc",
    borderRadius: 7,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 13,
  },

  info: {
    fontSize: 11,
    color: "#777",
    marginTop: 6,
  },

  botao: {
    height: 46,
    backgroundColor: "#294dcc",
    borderRadius: 6,
    marginTop: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  textoBotao: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  link: {
    color: "#294dcc",
    textAlign: "center",
    marginTop: 15,
  },

});