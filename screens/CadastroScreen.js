import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";


// =====================================================
// CONFIGURAÇÃO
// =====================================================

const SUPABASE_URL =
  "https://cgdkhufktnclezagrhek.supabase.co/rest/v1/usuario";

const SUPABASE_KEY =
  "sb_publishable_IPsf8cTazQXIOxTS-EvkdQ_G7bVSGCj";

const headersSupabase = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};


// =====================================================
// TOKEN PUSH
// =====================================================

async function obterTokenPush() {
  try {
    if (!Device.isDevice) {
      throw new Error(
        "As notificações push precisam ser testadas em um dispositivo físico."
      );
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
      throw new Error(
        "Permissão para notificações foi negada."
      );
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(
        "default",
        {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
        }
      );
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ||
      Constants?.easConfig?.projectId;

    if (!projectId) {
      throw new Error(
        "ProjectId não encontrado. Verifique o app.json."
      );
    }

    const pushToken =
      await Notifications.getExpoPushTokenAsync({
        projectId,
      });

    console.log("TOKEN DO DISPOSITIVO:");
    console.log(pushToken.data);

    return pushToken.data;

  } catch (error) {
    console.log("Erro ao obter token:", error);
    throw error;
  }
}


// =====================================================
// SCREEN
// =====================================================

export default function CadastroScreen({ navigation }) {

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [token, setToken] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [carregandoToken, setCarregandoToken] =
    useState(true);

  const [cadastrando, setCadastrando] =
    useState(false);


  useEffect(() => {

    async function carregarToken() {

      try {

        setCarregandoToken(true);

        const tokenObtido =
          await obterTokenPush();

        setToken(tokenObtido);

      } catch (error) {

        Alert.alert(
          "Notificação",
          error.message
        );

      } finally {

        setCarregandoToken(false);

      }
    }

    carregarToken();

  }, []);


  async function cadastrar() {

    if (!nome.trim()) {
      Alert.alert("Atenção", "Digite seu nome.");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Atenção", "Digite seu e-mail.");
      return;
    }

    if (!senha.trim()) {
      Alert.alert("Atenção", "Digite sua senha.");
      return;
    }

    if (senha.length < 6) {
      Alert.alert(
        "Atenção",
        "A senha deve possuir pelo menos 6 caracteres."
      );
      return;
    }

    if (!token) {
      Alert.alert(
        "Atenção",
        "O token de notificação ainda não foi obtido."
      );
      return;
    }

    try {

      setCadastrando(true);

      const verificar = await fetch(
        `${SUPABASE_URL}?email=eq.${encodeURIComponent(
          email.trim()
        )}&select=*`,
        {
          method: "GET",
          headers: headersSupabase,
        }
      );

      const usuariosExistentes =
        await verificar.json();

      if (usuariosExistentes.length > 0) {

        Alert.alert(
          "Cadastro",
          "Esse e-mail já está cadastrado."
        );

        return;
      }

      const novoUsuario = {
        nome: nome.trim(),
        email: email.trim(),
        senha: senha,
        token: token,
      };

      console.log("CADASTRO:");
      console.log(novoUsuario);

      const resposta = await fetch(
        SUPABASE_URL,
        {
          method: "POST",
          headers: {
            ...headersSupabase,
            Prefer: "return=representation",
          },
          body: JSON.stringify(novoUsuario),
        }
      );

      if (!resposta.ok) {

        const erro = await resposta.text();

        console.log("Erro Supabase:", erro);

        throw new Error(
          "Não foi possível realizar o cadastro."
        );
      }

      Alert.alert(
        "Cadastro realizado!",
        "Seu usuário foi cadastrado com sucesso.",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("Login"),
          },
        ]
      );

      setNome("");
      setEmail("");
      setSenha("");

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Erro",
        error.message
      );

    } finally {

      setCadastrando(false);

    }
  }


  return (

    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >

      <View style={styles.logoContainer}>

        <View style={styles.logo}>

          <Ionicons
            name="notifications-outline"
            size={38}
            color="#FFFFFF"
          />

        </View>

      </View>


      <Text style={styles.titulo}>
        Cadastro
      </Text>

      <Text style={styles.subtitulo}>
        Crie sua conta para começar
      </Text>


      <Text style={styles.label}>
        Nome
      </Text>

      <View style={styles.inputContainer}>

        <Ionicons
          name="person-outline"
          size={19}
          color="#9CA3AF"
        />

        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          placeholderTextColor="#9CA3AF"
          value={nome}
          onChangeText={setNome}
        />

      </View>


      <Text style={styles.label}>
        E-mail
      </Text>

      <View style={styles.inputContainer}>

        <Ionicons
          name="mail-outline"
          size={19}
          color="#9CA3AF"
        />

        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

      </View>


      <Text style={styles.label}>
        Senha
      </Text>

      <View style={styles.inputContainer}>

        <Ionicons
          name="lock-closed-outline"
          size={19}
          color="#9CA3AF"
        />

        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#9CA3AF"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
        />

        <TouchableOpacity
          onPress={() =>
            setMostrarSenha(!mostrarSenha)
          }
        >

          <Ionicons
            name={
              mostrarSenha
                ? "eye-outline"
                : "eye-off-outline"
            }
            size={19}
            color="#9CA3AF"
          />

        </TouchableOpacity>

      </View>


      <Text style={styles.label}>
        Token do aparelho
      </Text>

      <View style={styles.inputContainer}>

        <Ionicons
          name="phone-portrait-outline"
          size={19}
          color="#9CA3AF"
        />

        <TextInput
          style={[
            styles.input,
            styles.tokenInput,
          ]}
          placeholder="Obtendo token..."
          placeholderTextColor="#9CA3AF"
          value={token}
          editable={false}
        />

        {carregandoToken ? (

          <ActivityIndicator
            size="small"
            color="#1769E8"
          />

        ) : (

          <Ionicons
            name="checkmark-circle"
            size={20}
            color="#1769E8"
          />

        )}

      </View>


      <Text style={styles.tokenInfo}>

        <Ionicons
          name="information-circle-outline"
          size={14}
          color="#8A8A8A"
        />

        {"  "}
        Token capturado automaticamente do seu dispositivo

      </Text>


      <TouchableOpacity
        style={styles.botao}
        onPress={cadastrar}
        disabled={cadastrando}
      >

        {cadastrando ? (

          <ActivityIndicator
            color="#FFFFFF"
          />

        ) : (

          <Text style={styles.botaoTexto}>
            Cadastrar
          </Text>

        )}

      </TouchableOpacity>


      <View style={styles.linkContainer}>

        <Text style={styles.linkTexto}>
          Já tem uma conta?
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Login")
          }
        >

          <Text style={styles.link}>
            {" "}Entrar
          </Text>

        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}


// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 45,
    paddingBottom: 35,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 12,
  },

  logo: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#1769E8",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#1769E8",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },

  titulo: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "700",
    color: "#111827",
    marginTop: 2,
  },

  subtitulo: {
    textAlign: "center",
    fontSize: 13,
    color: "#7C8591",
    marginTop: 3,
    marginBottom: 25,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    marginTop: 11,
  },

  inputContainer: {
    height: 43,
    borderWidth: 1,
    borderColor: "#E0E4EA",
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },

  input: {
    flex: 1,
    marginLeft: 9,
    fontSize: 13,
    color: "#1F2937",
  },

  tokenInput: {
    fontSize: 10,
  },

  tokenInfo: {
    color: "#8A8A8A",
    fontSize: 9.5,
    marginTop: 6,
    marginBottom: 3,
  },

  botao: {
    height: 43,
    backgroundColor: "#1769E8",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,

    shadowColor: "#1769E8",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },

  botaoTexto: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },

  linkTexto: {
    fontSize: 11,
    color: "#7C8591",
  },

  link: {
    fontSize: 11,
    color: "#1769E8",
    fontWeight: "600",
  },

});
