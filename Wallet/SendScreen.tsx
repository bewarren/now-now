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
  faDollar,
  faFileText,
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
  const [searchNameFocus, setSearchNameFocus] = useState<boolean>(false);

  const [amount, setAmount] = useState<string>("");
  const [amountFocus, setAmountFocus] = useState<boolean>(false);

  const [description, setDescription] = useState<string>("");
  const [descriptionFocus, setDescriptionFocus] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

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
    setSelectedPerson(item);
    setSearchName(item.full_name);
    setSearchNameFocus(false);
  };

  const addSpace = (text: string) => text.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const removeNonNumeric = (text: string) => text.replace(/[^0-9$.,]/g, "");

  const handleChange = (text: string) =>
    setAmount(addSpace(handleDecimalsOnValue(removeNonNumeric(text))));

  function checkValue(text: string) {
    setAmount(handleDecimalsOnValue(text));
  }

  function handleDecimalsOnValue(value: string) {
    const regex = /([0-9]*[\.|\,]{0,1}[0-9]{0,2})/s;
    const valueMatch = value.match(regex);
    if (valueMatch) {
      return valueMatch[0];
    } else {
      return "";
    }
  }

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "white",
        flexDirection: "column",
        height: "100%",
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
            if (people.length === 0 || searchName === "") {
              setSelectedPerson(null);
              setSearchNameFocus(false);
              setSearchName("");
            }
          }}
          value={searchName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
      </View>
      {!searchNameFocus && (
        <View style={amountFocus ? styles.inputFocus : styles.input}>
          <FontAwesomeIcon
            icon={faDollar}
            color={amountFocus ? "#8dfc9e" : "#aaaaaa"}
          />

          <TextInput
            placeholder="Amount"
            keyboardType="numeric"
            style={{ paddingLeft: 10, height: "100%", width: "100%" }}
            placeholderTextColor={amountFocus ? "#8dfc9e" : "#aaaaaa"}
            onChangeText={(text) => {
              handleChange(text);
            }}
            onFocus={() => {
              setAmountFocus(true);
            }}
            onBlur={() => {
              setAmountFocus(false);
            }}
            value={amount}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
      )}
      {!searchNameFocus && (
        <View
          style={descriptionFocus ? { ...styles.inputFocus } : styles.input}
        >
          <FontAwesomeIcon
            icon={faFileText}
            color={descriptionFocus ? "#8dfc9e" : "#aaaaaa"}
          />

          <TextInput
            placeholder="Description"
            style={{ paddingLeft: 10, height: "100%", width: "100%" }}
            placeholderTextColor={descriptionFocus ? "#8dfc9e" : "#aaaaaa"}
            onChangeText={(text) => setDescription(text)}
            onFocus={() => {
              setDescriptionFocus(true);
            }}
            onBlur={() => {
              setDescriptionFocus(false);
            }}
            value={description}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
      )}
      {!searchNameFocus && (
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#61fa78" : "#8dfc9e",
            },
            styles.walletSendWrapper,
          ]}
        >
          {({ pressed }) => {
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row-reverse",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.sendButton}>Send</Text>
              </View>
            );
          }}
        </Pressable>
      )}
      {/* list of people */}

      {searchNameFocus && (
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
      )}

      {/* list of friend request button on clicking */}
    </View>
  );
};

export default SendScreen;
