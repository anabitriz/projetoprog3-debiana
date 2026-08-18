import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";


// =====================================================
// SUPABASE
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
// SCREEN
// =====================================================

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] =
    useState(false);

  const [entrando, setEntrando] =
    useState(false);


  async function login() {

    if (!email.trim() || !senha.trim()) {

      Alert.alert(
        "Atenção",
        "Preencha o e-mail e a senha."
      );

      return;
    }

    try {

      setEntrando(true);

      const url =
        `${SUPABASE_URL}` +
        `?email=eq.${encodeURIComponent(email.trim())}` +
        `&senha=eq.${encodeURIComponent(senha)}` +
        `&select=*`;

      console.log("CONSULTA LOGIN:");
      console.log(url);

      const resposta = await fetch(
        url,
        {
          method: "GET",
          headers: headersSupabase,
        }
      );

      if (!resposta.ok) {

        throw new Error(
          "Erro ao consultar o Supabase."
        );

      }

      const usuarios =
        await resposta.json();

      console.log(
        "USUÁRIOS ENCONTRADOS:",
        usuarios
      );

      if (usuarios.length > 0) {

        const usuario = usuarios[0];

        navigation.replace(
          "EnviarNotificacao",
          {
            usuario: usuario,
          }
        );

      } else {

        Alert.alert(
          "Login inválido",
          "O e-mail ou senha estão incorretos."
        );

      }

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Erro",
        "Não foi possível realizar o login."
      );

    } finally {

      setEntrando(false);

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
        Login
      </Text>

      <Text style={styles.subtitulo}>
        Acesse sua conta
      </Text>


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


      <TouchableOpacity
        style={styles.esqueci}
        onPress={() =>
          Alert.alert(
            "Recuperação",
            "A recuperação de senha não foi implementada nesta atividade."
          )
        }
      >

        <Text style={styles.esqueciTexto}>
          Esqueceu sua senha?
        </Text>

      </TouchableOpacity>


      <TouchableOpacity
        style={styles.botao}
        onPress={login}
        disabled={entrando}
      >

        {entrando ? (

          <ActivityIndicator
            color="#FFFFFF"
          />

        ) : (

          <Text style={styles.botaoTexto}>
            Entrar
          </Text>

        )}

      </TouchableOpacity>


      <View style={styles.linkContainer}>

        <Text style={styles.linkTexto}>
          Não tem uma conta?
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Cadastro")
          }
        >

          <Text style={styles.link}>
            {" "}Criar conta
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

  esqueci: {
    alignItems: "flex-end",
    marginTop: 7,
  },

  esqueciTexto: {
    color: "#1769E8",
    fontSize: 10,
    fontWeight: "500",
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
