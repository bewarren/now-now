import {
  FlatList,
  SafeAreaView,
  TextInput,
  View,
  Text,
  Alert,
  ActivityIndicator,
  Pressable,
  StyleSheet,
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
import FloatingTextInput from "../components/FloatingTextInput";
import { Dropdown } from "react-native-element-dropdown";

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

const RequestScreen = ({
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
  const [friends, setFriends] = useState<any>([]);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);

  useEffect(() => {
    if (searchNameFocus && searchName !== "" && friends.length > 0) {
      getPeople(searchName);
    }
  }, [searchName]);

  useEffect(() => {
    getFriends();
  }, []);

  const getFriends = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("friendships")
      .select(
        `*, requester: requester_id (id, full_name), addressee: addressee_id (id, full_name)`
      )
      .or(
        `requester_id.eq.${session.user.id},and(addressee_id.eq.${session.user.id})`
      )
      .eq("accepted", true)
      .eq("rejected", false)
      .order("updated_at", { ascending: false });

    if (error) {
      Alert.alert(error.message);
    }

    if (data) {
      setFriends(
        data.map((friendship) => {
          const friendName =
            friendship.addressee.id === session.user.id
              ? friendship.requester.full_name
              : friendship.addressee.full_name;

          const friendId =
            friendship.addressee.id === session.user.id
              ? friendship.requester.id
              : friendship.addressee.id;

          return { id: friendId, full_name: friendName };
        })
      );
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const filterList = (list: any, searchValue: string) => {
    return list.filter((item: any) => {
      const fullName = `${item.full_name}`.toLowerCase();
      const trimmedSearchValue = searchValue.replace(/\s+/g, "").toLowerCase();
      return fullName.includes(trimmedSearchValue);
    });
  };

  const getPeople = async (name: string) => {
    setPeople(filterList(friends, name));
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

  const validate = (selectedPerson: any, amount: string) => {
    let selectedPersonError = false;
    let amountError = false;

    if (!selectedPerson) {
      selectedPersonError = true;
    }

    if (amount === "" || parseFloat(amount.replace(",", ".")) === 0) {
      amountError = true;
    }

    if (selectedPersonError || amountError) {
      return false;
    } else {
      return true;
    }
  };

  const request = async () => {
    // validate input
    if (validate(selectedPerson, amount)) {
      const { error } = await supabase.from("transactions").insert({
        created_at: new Date(),
        updated_at: new Date(),
        from_id: selectedPerson.id,
        to_id: session.user.id,
        description: description,
        paid: false,
        rejected: false,
        amount: parseFloat(amount.replace(",", ".").replace(/\s/g, "")),
      });

      if (error) {
        console.log(error);
      } else {
        navigation.navigate("Wallet Screen");
      }
    } else {
      console.log("false");
    }

    // add to database
    // navigate back to wallet
  };

  const handleSearchNameChange = (text: string) => {
    setSearchName(text);
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
  };

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = (text: string) => {
    if (value || isFocus) {
      return (
        <Text style={[newStyles.label, isFocus && { color: "#00db22" }]}>
          {text}
        </Text>
      );
    }
    return null;
  };

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        flexDirection: "column",
      }}
    >
      {/* search list */}
      <View style={newStyles.container}>
        {renderLabel("From")}
        <Dropdown
          style={[newStyles.dropdown, isFocus && { borderColor: "#00db22" }]}
          placeholderStyle={newStyles.placeholderStyle}
          selectedTextStyle={newStyles.selectedTextStyle}
          inputSearchStyle={newStyles.inputSearchStyle}
          iconStyle={newStyles.iconStyle}
          data={friends.map((f: any) => {
            return { label: f.full_name, value: f };
          })}
          search
          maxHeight={300}
          labelField="label"
          valueField="label"
          placeholder={!isFocus ? "From" : ""}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item: any) => {
            setSelectedPerson(item.value);
            setValue(item.label);
            setIsFocus(false);
          }}
        />
      </View>

      <FloatingTextInput
        label="Amount"
        keyboardType="numeric"
        value={amount}
        handleChange={handleChange}
      />
      <FloatingTextInput
        label="What is this for?"
        value={description}
        handleChange={handleDescriptionChange}
      />
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#61fa78" : "#8dfc9e",
          },
          styles.walletSendWrapper,
        ]}
        onPress={request}
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
              <Text style={styles.sendButton}>Request</Text>
            </View>
          );
        }}
      </Pressable>

      {/* list of friend request button on clicking */}
    </View>
  );
};

export default RequestScreen;

const newStyles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 65,
    borderColor: "#B9C4CA",

    borderWidth: 1,
    borderRadius: 12,
    margin: 5,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    color: "#B9C4CA",
    backgroundColor: "white",
    left: 32,
    top: 19,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#B9C4CA",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 8,
  },
});
