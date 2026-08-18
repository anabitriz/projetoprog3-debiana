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
  Modal,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";


const SUPABASE_URL =
  "https://cgdkhufktnclezagrhek.supabase.co/rest/v1/usuario";

const SUPABASE_KEY =
  "sb_publishable_IPsf8cTazQXIOxTS-EvkdQ_G7bVSGCj";

const headersSupabase = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

export default function EnviarNotificacaoScreen({
  navigation,
  route,
}) {

  const usuarioLogado =
    route.params?.usuario;


  const [usuarios, setUsuarios] =
    useState([]);

  const [usuarioSelecionado, setUsuarioSelecionado] =
    useState(null);

  const [titulo, setTitulo] =
    useState("");

  const [mensagem, setMensagem] =
    useState("");

  const [carregando, setCarregando] =
    useState(true);

  const [enviando, setEnviando] =
    useState(false);

  const [mostrarUsuarios, setMostrarUsuarios] =
    useState(false);



  useEffect(() => {

    buscarUsuarios();

  }, []);


  async function buscarUsuarios() {

    try {

      setCarregando(true);

      const resposta = await fetch(
        `${SUPABASE_URL}?select=id,nome,email,token`,
        {
          method: "GET",
          headers: headersSupabase,
        }
      );

      if (!resposta.ok) {

        throw new Error(
          "Erro ao carregar usuários."
        );

      }

      const dados =
        await resposta.json();

      const outrosUsuarios =
        dados.filter(
          (item) =>
            item.email !== usuarioLogado?.email
        );

      setUsuarios(outrosUsuarios);

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Erro",
        "Não foi possível carregar os usuários."
      );

    } finally {

      setCarregando(false);

    }
  }

  async function enviarNotificacao() {

    if (!usuarioSelecionado) {

      Alert.alert(
        "Atenção",
        "Selecione um usuário."
      );

      return;
    }

    if (!titulo.trim()) {

      Alert.alert(
        "Atenção",
        "Digite o título da notificação."
      );

      return;
    }

    if (!mensagem.trim()) {

      Alert.alert(
        "Atenção",
        "Digite a mensagem."
      );

      return;
    }

    if (!usuarioSelecionado.token) {

      Alert.alert(
        "Erro",
        "Esse usuário não possui um token de notificação."
      );

      return;
    }

    try {

      setEnviando(true);

      const resposta = await fetch(
        "https://exp.host/--/api/v2/push/send",
        {
          method: "POST",

          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            to: usuarioSelecionado.token,

            sound: "default",

            title: titulo.trim(),

            body: mensagem.trim(),

            data: {
              enviadoPor:
                usuarioLogado?.nome ||
                "Usuário",
            },
          }),
        }
      );

      const resultado =
        await resposta.json();

      console.log(
        "RESPOSTA EXPO:",
        resultado
      );

      if (!resposta.ok) {

        throw new Error(
          "O Expo não conseguiu enviar a notificação."
        );

      }

      if (
        resultado?.data?.status === "error"
      ) {

        throw new Error(
          resultado?.data?.message ||
          "Erro no envio da notificação."
        );

      }

      Alert.alert(
        "Notificação enviada!",
        `A notificação foi enviada para ${usuarioSelecionado.nome}.`
      );

      setTitulo("");
      setMensagem("");
      setUsuarioSelecionado(null);

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Erro",
        error.message ||
        "Não foi possível enviar a notificação."
      );

    } finally {

      setEnviando(false);

    }
  }


  return (

    <View style={styles.telaNotificacao}>

      <ScrollView
        contentContainerStyle={
          styles.scrollNotificacao
        }
        keyboardShouldPersistTaps="handled"
      >

        {/* CABEÇALHO */}

        <View style={styles.header}>

          <TouchableOpacity
            onPress={() =>
              navigation.replace("Login")
            }
            style={styles.voltar}
          >

            <Ionicons
              name="arrow-back"
              size={25}
              color="#111827"
            />

          </TouchableOpacity>


          <View>

            <Text style={styles.tituloNotificacao}>
              Enviar Notificação
            </Text>

            <Text style={styles.subtituloNotificacao}>
              Envie uma notificação push para um usuário
            </Text>

          </View>

        </View>


        {/* USUÁRIO */}

        <Text style={styles.labelNotificacao}>
          Selecionar usuário
        </Text>


        <TouchableOpacity
          style={styles.select}
          onPress={() =>
            setMostrarUsuarios(true)
          }
        >

          <Ionicons
            name="person-outline"
            size={20}
            color="#8C96A3"
          />

          <Text
            style={[
              styles.selectTexto,
              !usuarioSelecionado &&
                styles.placeholder,
            ]}
          >

            {usuarioSelecionado
              ? usuarioSelecionado.nome
              : "Escolha um usuário"}

          </Text>


          <Ionicons
            name="chevron-down"
            size={20}
            color="#8C96A3"
          />

        </TouchableOpacity>


        {/* TÍTULO */}

        <Text style={styles.labelNotificacao}>
          Título
        </Text>

        <View style={styles.inputNotificacao}>

          <Ionicons
            name="text-outline"
            size={21}
            color="#8C96A3"
          />

          <TextInput
            style={styles.inputGrande}
            placeholder="Digite o título da notificação"
            placeholderTextColor="#9CA3AF"
            value={titulo}
            onChangeText={setTitulo}
          />

        </View>


        {/* MENSAGEM */}

        <Text style={styles.labelNotificacao}>
          Mensagem
        </Text>

        <View
          style={[
            styles.inputNotificacao,
            styles.mensagemContainer,
          ]}
        >

          <Ionicons
            name="chatbubble-ellipses-outline"
            size={21}
            color="#8C96A3"
          />

          <TextInput
            style={[
              styles.inputGrande,
              styles.mensagemInput,
            ]}
            placeholder="Digite a mensagem da notificação"
            placeholderTextColor="#9CA3AF"
            value={mensagem}
            onChangeText={setMensagem}
            multiline
            maxLength={200}
            textAlignVertical="top"
          />

          <Text style={styles.contador}>
            {mensagem.length}/200
          </Text>

        </View>


        {/* AVISO */}

        <View style={styles.aviso}>

          <Ionicons
            name="information-circle-outline"
            size={19}
            color="#4384E8"
          />

          <Text style={styles.avisoTexto}>
            O token será usado automaticamente
          </Text>

        </View>


        {/* BOTÃO */}

        <TouchableOpacity
          style={styles.botaoNotificacao}
          onPress={enviarNotificacao}
          disabled={enviando}
        >

          {enviando ? (

            <ActivityIndicator
              color="#FFFFFF"
            />

          ) : (

            <>

              <Ionicons
                name="paper-plane-outline"
                size={21}
                color="#FFFFFF"
              />

              <Text style={styles.botaoTexto}>
                Enviar notificação
              </Text>

            </>

          )}

        </TouchableOpacity>

      </ScrollView>


      {/* lista de usuarios */}

      <Modal
        visible={mostrarUsuarios}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setMostrarUsuarios(false)
        }
      >

        <TouchableOpacity
          style={styles.modalFundo}
          activeOpacity={1}
          onPress={() =>
            setMostrarUsuarios(false)
          }
        >

          <View
            style={styles.modalContainer}
            onStartShouldSetResponder={() =>
              true
            }
          >

            <Text style={styles.modalTitulo}>
              Escolha um usuário
            </Text>


            {carregando ? (

              <ActivityIndicator
                size="large"
                color="#1769E8"
                style={{ margin: 20 }}
              />

            ) : usuarios.length === 0 ? (

              <Text style={styles.semUsuarios}>
                Nenhum outro usuário cadastrado.
              </Text>

            ) : (

              <ScrollView
                style={styles.listaUsuarios}
                contentContainerStyle={
                  styles.listaUsuariosConteudo
                }
                showsVerticalScrollIndicator={true}
                persistentScrollbar={true}
                nestedScrollEnabled={true}
              >

                {usuarios.map((item) => (

                  <TouchableOpacity
                    key={
                      item.id ||
                      item.email
                    }
                    style={styles.usuarioItem}
                    onPress={() => {

                      setUsuarioSelecionado(item);

                      setMostrarUsuarios(false);

                    }}
                  >

                    <Ionicons
                      name="person-outline"
                      size={21}
                      color="#8C96A3"
                    />

                    <View
                      style={{
                        flex: 1,
                      }}
                    >

                      <Text
                        style={styles.usuarioNome}
                      >
                        {item.nome}
                      </Text>

                      <Text
                        style={styles.usuarioEmail}
                      >
                        {item.email}
                      </Text>

                    </View>

                  </TouchableOpacity>

                ))}

              </ScrollView>

            )}

          </View>

        </TouchableOpacity>

      </Modal>

    </View>
  );
}


const styles = StyleSheet.create({

  telaNotificacao: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollNotificacao: {
    paddingHorizontal: 22,
    paddingTop: 50,
    paddingBottom: 35,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 27,
  },

  voltar: {
    marginRight: 18,
    marginTop: 2,
  },

  tituloNotificacao: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  subtituloNotificacao: {
    fontSize: 12,
    color: "#7C8591",
    marginTop: 3,
  },

  labelNotificacao: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 7,
    marginTop: 8,
  },

  select: {
    height: 45,
    borderWidth: 1,
    borderColor: "#D7DCE3",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    marginBottom: 8,
  },

  selectTexto: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: "#374151",
  },

  placeholder: {
    color: "#9CA3AF",
  },

  inputNotificacao: {
    minHeight: 45,
    borderWidth: 1,
    borderColor: "#D7DCE3",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    marginBottom: 9,
  },

  inputGrande: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: "#374151",
  },

  mensagemContainer: {
    height: 80,
    alignItems: "flex-start",
    paddingTop: 13,
    position: "relative",
  },

  mensagemInput: {
    height: 60,
    paddingTop: 0,
  },

  contador: {
    position: "absolute",
    right: 10,
    bottom: 7,
    fontSize: 10,
    color: "#8C96A3",
  },

  aviso: {
    height: 34,
    backgroundColor: "#EAF3FF",
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    marginTop: 3,
    marginBottom: 12,
  },

  avisoTexto: {
    color: "#5F7FAE",
    fontSize: 10.5,
    marginLeft: 7,
  },

  botaoNotificacao: {
    height: 45,
    backgroundColor: "#1769E8",
    borderRadius: 7,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,

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

  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 18,
    maxHeight: "70%",
  },

  modalTitulo: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  listaUsuarios: {
    maxHeight: 350,
  },

  listaUsuariosConteudo: {
    paddingBottom: 5,
  },

  usuarioItem: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F1F3",
    gap: 12,
  },

  usuarioNome: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },

  usuarioEmail: {
    fontSize: 10,
    color: "#8A929E",
    marginTop: 2,
  },

  semUsuarios: {
    color: "#8A929E",
    textAlign: "center",
    padding: 20,
  },

});
