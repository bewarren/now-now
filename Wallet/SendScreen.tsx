import {
  FlatList,
  SafeAreaView,
  TextInput,
  View,
  Text,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "../styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowRight,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Session } from "@supabase/supabase-js";

type ItemProps = {
  name: string | null;
  select: () => void;
};

const Item = ({ name, select }: ItemProps) => {
  return (
    <View style={styles.friendItem}>
      <Text style={styles.personSending}>{name}</Text>
      <Pressable
        onPress={select}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#61fa78" : "#8dfc9e",
          },
          styles.friendWrapperCustom,
        ]}
      >
        {({ pressed }) => {
          return (
            <View
              style={{
                flex: 1,
                flexDirection: "row-reverse",
                justifyContent: "space-around",
              }}
            >
              <Text style={styles.sendButton}>Select</Text>
            </View>
          );
        }}
      </Pressable>
    </View>
  );
};

const SendScreen = ({
  session,
  navigation,
}: {
  session: Session;
  navigation: any;
}) => {
  // search list of people with a name
  // limit and scroll on list for more

  const [searchName, setSearchName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchNameFocus, setSearchNameFocus] = useState<boolean>(false);
  const [people, setPeople] = useState<any>([]);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);

  useEffect(() => {
    if (searchNameFocus && searchName !== "") {
      getPeople(searchName);
    }
  }, [searchName]);

  const getPeople = async (name: string) => {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from("profiles")
        .select()
        .neq("id", session?.user.id)
        .ilike("full_name", `%${name}%`);
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setPeople(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
  };

  const selectHandler = (item: any) => {
    console.log("here");
    console.log(item);
    setSelectedPerson(item);
    setSearchName(item.full_name);
  };

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "white",
      }}
    >
      {/* search list */}
      <View style={searchNameFocus ? styles.inputFocus : styles.input}>
        <FontAwesomeIcon
          icon={faSearch}
          color={searchNameFocus ? "#8dfc9e" : "#aaaaaa"}
        />
        <TextInput
          placeholder="To"
          style={{ paddingLeft: 10, height: "100%", width: "100%" }}
          placeholderTextColor={searchNameFocus ? "#8dfc9e" : "#aaaaaa"}
          onChangeText={(text) => setSearchName(text)}
          onFocus={() => {
            setSearchNameFocus(true);
          }}
          onBlur={() => {
            setSearchNameFocus(false);
          }}
          value={searchName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
      </View>
      {/* list of people */}
      <SafeAreaView style={styles.listContainer}>
        {people.length > 0 && searchName !== "" && (
          <FlatList
            nestedScrollEnabled
            key={1}
            data={people}
            renderItem={({ item }) => {
              return (
                <Item
                  name={item?.full_name}
                  select={() => {
                    selectHandler(item);
                  }}
                />
              );
            }}
            keyExtractor={(item) => item.id}
          />
        )}
        {loading && (
          <View style={[styles.horizontal]}>
            <ActivityIndicator size="large" color="#00cc1f" />
          </View>
        )}
      </SafeAreaView>
      {/* list of friend request button on clicking */}
    </View>
  );
};

export default SendScreen;
