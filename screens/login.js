import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

import { loginUsuario } from "../api";

export default function Login({ navigation }) {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function entrar() {

    if (!email || !senha) {

      Alert.alert(
        "Atenção",
        "Digite o e-mail e a senha."
      );

      return;
    }

    try {

      const usuarios =
        await loginUsuario(email, senha);

      if (usuarios.length > 0) {

        Alert.alert(
          "Sucesso",
          "Login realizado!"
        );

        navigation.navigate("Notification");

      } else {

        Alert.alert(
          "Erro",
          "E-mail ou senha estão incorretos."
        );
      }

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Erro",
        "Não foi possível realizar o login."
      );
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Login
      </Text>

      <Text style={styles.subtitulo}>
        Acesse sua conta
      </Text>

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

      <TouchableOpacity
        style={styles.botao}
        onPress={entrar}
      >
        <Text style={styles.textoBotao}>
          Entrar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Cadastro")}
      >
        <Text style={styles.link}>
          Não tem uma conta? Criar conta
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
    marginTop: 12,
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

  botao: {
    height: 46,
    backgroundColor: "#294dcc",
    borderRadius: 6,
    marginTop: 25,
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