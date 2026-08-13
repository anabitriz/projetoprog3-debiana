import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

import { buscarUsuarios } from "../api";

export default function Notification({ expoPushToken }) {

  const [usuarios, setUsuarios] = useState([]);

  const [token, setToken] = useState(
    expoPushToken || ""
  );

  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {

    try {

      const dados = await buscarUsuarios();

      console.log("USUÁRIOS:");
      console.log(dados);

      setUsuarios(dados);

      if (dados.length > 0) {
        setToken(dados[0].token);
      }

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Erro",
        "Não foi possível carregar os usuários."
      );
    }
  }

  function selecionarUsuario(valor) {
    setToken(valor);
  }

  async function enviarNotificacao() {

    if (!token.trim()) {

      Alert.alert(
        "Atenção",
        "Selecione um usuário."
      );

      return;
    }

    if (!mensagem.trim()) {

      Alert.alert(
        "Atenção",
        "Digite uma mensagem."
      );

      return;
    }

    try {

      const resposta = await fetch(
        "https://exp.host/--/api/v2/push/send",
        {
          method: "POST",

          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            to: token,
            sound: "default",
            title: titulo || "Nova notificação",
            body: mensagem,

            data: {
              origem: "painel",
            },
          }),
        }
      );

      const resultado =
        await resposta.json();

      console.log(resultado);

      Alert.alert(
        "Sucesso",
        "Notificação enviada!"
      );

      setTitulo("");
      setMensagem("");

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Erro",
        "Não foi possível enviar a notificação."
      );
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Enviar Notificação
      </Text>

      <Text style={styles.label}>
        Selecionar usuário
      </Text>

      <View style={styles.pickerContainer}>

        <Picker
          selectedValue={token}
          onValueChange={selecionarUsuario}
        >

          {usuarios.map((usuario) => (

            <Picker.Item
              key={usuario.token}
              label={usuario.nome}
              value={usuario.token}
            />

          ))}

        </Picker>

      </View>

      <Text style={styles.descricao}>
        Escolha o usuário que receberá a notificação.
      </Text>

      <Text style={styles.label}>
        Título
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: Promoção Especial"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.descricao}>
        Título que aparecerá na notificação.
      </Text>

      <Text style={styles.label}>
        Mensagem
      </Text>

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Digite sua mensagem..."
        value={mensagem}
        onChangeText={setMensagem}
        multiline
        textAlignVertical="top"
      />

      <Text style={styles.descricao}>
        Mensagem que será enviada na notificação.
      </Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={enviarNotificacao}
      >

        <Text style={styles.textoBotao}>
          ➤ Enviar Notificação
        </Text>

      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#294dcc",
    marginHorizontal: -20,
    marginTop: -20,
    paddingVertical: 20,
    textAlign: "center",
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginTop: 12,
    marginBottom: 8,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#d0d3dc",
    borderRadius: 7,
    backgroundColor: "#fff",
    overflow: "hidden",
  },

  input: {
    borderWidth: 1,
    borderColor: "#d0d3dc",
    borderRadius: 7,
    paddingHorizontal: 14,
    height: 44,
    fontSize: 14,
    color: "#333",
  },

  descricao: {
    fontSize: 11,
    color: "#777",
    marginTop: 7,
    lineHeight: 16,
  },

  textArea: {
    height: 140,
    paddingTop: 14,
  },

  botao: {
    height: 46,
    backgroundColor: "#294dcc",
    borderRadius: 6,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  textoBotao: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },

});