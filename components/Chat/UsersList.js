import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { AppLoading } from "expo";

import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  useFonts,
  Roboto_100Thin,
  Roboto_400Regular,
  Roboto_500Medium,
} from "@expo-google-fonts/roboto";
import scroll from "../../styles/scroll";
import BackIcon from "../images/BackIcon";
import NewIcon from "../images/NewIcon";
import BinIcon from "../images/BinIcon";
import { TextInput } from "react-native-gesture-handler";
import SearchIcon from "../images/SearchIcon";

const QUERY = gql`
  query usuarios($where: JSON) {
    usuarios(where: $where) {
      nombre
      apellido
      especialidad
      laboratorio
      imagen
      _id
    }
  }
`;

const image = {
  uri:
    "https://www.hqts.com/wp-content/uploads/2020/04/Pharmaceutical-Materials-no-logo-01-1110x550.jpg",
};

export default function UsersList({ navigation }) {
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    console.log("e", e);
    setSearch(e);
  };

  const { loading, data, error, refetch } = useQuery(QUERY, {
    variables: {
      where: { rol: "User", nombre: { $regex: `.*${search}.*` } },
    },
  });

  let [fontsLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_400Regular,
    Roboto_500Medium,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  } else if (loading) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.inputCont}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.goBack()}
          >
            <BackIcon name="back" color="grey" size="24" />
          </TouchableOpacity>
          <TextInput
            placeholder="Buscar..."
            onChangeText={(search) => setSearch(search)}
            value={search}
            style={{
              height: 35,
              borderColor: "#c4c4c4",
              borderRadius: 20,
              borderWidth: 1,
              flex: 7,
              color: "#c4c4c4",
              paddingLeft: 20,
            }}
          />
          {/*<TouchableOpacity onPress={() => alert("buscar")}>
            <SearchIcon
              name="search"
              color="#c4c4c4"
              style={{
                flex: 1,
                marginLeft: 5,
                justifyContent: "center",
              }}
              size="22"
            />
            </TouchableOpacity>*/}
        </View>
        <ScrollView style={styles.scroll2}>
          {data
            ? data.usuarios.map((usuario) => (
                <TouchableOpacity
                  key={usuario._id}
                  onPress={() =>
                    navigation.navigate("ChatDetail", {
                      id: usuario._id,
                      nombre: usuario.nombre,
                      apellido: usuario.apellido,
                      imagen: usuario.imagen,
                      especialidad: usuario.especialidad,
                      laboratorio: usuario.laboratorio,
                    })
                  }
                >
                  <View style={styles.eventContainer}>
                    <View style={styles.imgContainer}>
                      <Image
                        source={usuario.imagen}
                        style={styles.image}
                      ></Image>
                    </View>

                    <View style={styles.eventDetail}>
                      <Text style={styles.titulo}>
                        {usuario.nombre + " " + usuario.apellido}
                      </Text>

                      <Text style={styles.text}>
                        {usuario.especialidad + " - " + usuario.laboratorio}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            : null}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "96%",
    display: "flex",
    borderWidth: 1,
    borderColor: "#f5f2f2",
    borderRadius: 20,
    marginTop: 100,
    marginLeft: "2%",
    marginRight: "2%",
    lineHeight: 800,
  },
  inputCont: {
    marginTop: 30,
    marginLeft: "10%",
    marginRight: "10%",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    marginTop: 5,
  },
  scroll2: {
    width: "96%",
    height: 470,
    marginLeft: "2%",
    marginRight: "2%",
    marginBottom: 30,
    padding: 2,
  },
  iconContainer: {
    justifyContent: "center",
    flex: 1,
  },
  eventContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#f5f2f2",
    borderRadius: 20,
    backgroundColor: "#7C88D5",
  },
  eventDetail: {
    flex: 4,
    flexWrap: "wrap",
    /* backgroundColor: "blue",*/

    paddingTop: 10,
    paddingLeft: 10,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    flexWrap: "wrap",
    paddingRight: 10,
  },

  image: {
    flex: 1,
    resizeMode: "cover",
    height: 40,
    width: 40,
    borderRadius: 70,
    marginRight: 15,
    margin: 7,
  },
  titulo: {
    fontFamily: "Roboto_400Regular",
    fontSize: 15,
    color: "white",
    flex: 1,
  },
  text: {
    fontFamily: "Roboto_100Thin",
    width: "100%",
    color: "white",
    fontSize: 10,
    flex: 2,
  },
});
