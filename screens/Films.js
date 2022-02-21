import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import { FormatSections } from "../includes/Functions_partagees";
import SearchBox from "../components/Search-box";
import Card from "../components/Card";

const REACT_APP_BACKEND_URL = "https://greta-bibliotheque-jh.herokuapp.com/api";

export default function Films() {
  const [isLoading, setLoading] = useState(true); // booléen qui change après un fetch
  const [data, setData] = useState([]); // toutes les données
  const [dataSearch, setDataSearch] = useState([]); // les données filtrées via search box
  const [searchField, setSearchField] = useState(""); // search box
  //
  const TYPEOFMEDIA = "films";

  useEffect(() => {
    fetch(REACT_APP_BACKEND_URL + "/" + TYPEOFMEDIA)
      .then((response) => response.json())
      .then((json) => {
        let temp_array = FormatSections(json[TYPEOFMEDIA], TYPEOFMEDIA);
        setData(temp_array); // copie globale
        setDataSearch(temp_array); // partie filtrée ...
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      var temp_array = [];
      temp_array = data[0].data.filter((adata) =>
        adata.text.toLowerCase().includes(searchField.toLowerCase())
      );
      var trav = {
        title: data[0].title,
        data: temp_array,
      };
      setDataSearch([trav]);
    }
  }, [searchField]);

  const onSearchChange = (textSearched) => {
    setSearchField(textSearched);
  };

  return (
    <View style={styles.container}>
      <SearchBox onSearch={onSearchChange} message="Rechercher un titre" />
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        {isLoading ? (
          <Text>Chargement...</Text>
        ) : (
          <SectionList
            contentContainerStyle={{ paddingHorizontal: 10 }}
            stickySectionHeadersEnabled={false}
            sections={dataSearch}
            renderSectionHeader={({ section }) => (
              <>
                <Text style={styles.sectionHeader}>
                  Listing avec {section.data.length} occurence(s)
                </Text>
              </>
            )}
            renderItem={({ item }) => {
              return <Card item={item} />;
            }}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  sectionHeader: {
    fontWeight: "800",
    fontSize: 18,
    color: "#f4f4f4",
    marginTop: 20,
    marginBottom: 5,
  },
});
