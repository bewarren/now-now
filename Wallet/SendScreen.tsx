import {
  FlatList,
  SafeAreaView,
  TextInput,
  View,
  Text,
  Alert,
  ActivityIndicator,
  Pressable,
  Linking,
  StyleSheet,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useCallback, useEffect, useState } from "react";
import styles from "../styles";

import { Session } from "@supabase/supabase-js";
import FloatingTextInput from "../components/FloatingTextInput";
import { SelectList } from "react-native-dropdown-select-list";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

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
  const [description, setDescription] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

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
        `*, requester: requester_id (id, full_name, snapscan_link), addressee: addressee_id (id, full_name, snapscan_link)`
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

          const snapscan_link =
            friendship.addressee.id === session.user.id
              ? friendship.requester.snapscan_link
              : friendship.addressee.snapscan_link;

          return {
            id: friendId,
            full_name: friendName,
            snapscan_link: snapscan_link,
          };
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

  const handleChange = (text: string) => {
    const amount = addSpace(handleDecimalsOnValue(removeNonNumeric(text)));
    // console.log(amount);

    setAmount(addSpace(handleDecimalsOnValue(removeNonNumeric(text))));
  };

  // function checkValue(text: string) {
  //   setAmount(handleDecimalsOnValue(text));
  // }

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

  const send = async () => {
    // validate input
    if (validate(selectedPerson, amount)) {
      const { error } = await supabase.from("transactions").insert({
        created_at: new Date(),
        updated_at: new Date(),
        to_id: selectedPerson.id,
        from_id: session.user.id,
        description: description,
        paid: true,
        rejected: false,
        amount: parseFloat(amount.replace(",", ".").replace(/\s/g, "")),
      });

      if (error) {
        Alert.alert("Error");
      } else {
        const valAmount: number = parseFloat(
          amount.replace(",", ".").replace(/\s/g, "")
        );

        // console.log(selectedPerson);
        if (selectedPerson.snapscan_link) {
          handlePress(selectedPerson, valAmount)
            .then(() => {
              navigation.navigate("Confirm Sending");
            })
            .catch((err) => {
              Alert.alert("Error sending");
            });
        } else {
          Alert.alert("Selected Person has no snapscan link");
        }
      }
    } else {
      Alert.alert("Please select all values");
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

  const handlePress = useCallback(
    async (selectedPerson: any, valAmount: number) => {
      // Checking if the link is supported for links with custom URL scheme.

      const supported = await Linking.canOpenURL(
        `${selectedPerson.snapscan_link}&amount=${valAmount}`
      );

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(
          `${selectedPerson.snapscan_link}&amount=${valAmount}`
        );
      } else {
        Alert.alert(
          `Don't know how to open this URL: ${selectedPerson.snapscan_link}`
        );
      }
    },
    [selectedPerson]
  );

  const data = [
    { label: "Bank EFT", value: "Bank EFT" },
    { label: "SnapScan", value: "SnapScan" },
    { label: "Cash", value: "Cash" },
  ];

  const [payment, setPayment] = useState<boolean>(false);

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isPaymentFocus, setIsPaymentFocus] = useState(false);

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

  const renderPaymentLabel = (text: string) => {
    if (payment || isPaymentFocus) {
      return (
        <Text style={[newStyles.label, isPaymentFocus && { color: "#00db22" }]}>
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
        backgroundColor: "white",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <View style={newStyles.container}>
        {renderLabel("To")}
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
          placeholder={!isFocus ? "To" : ""}
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

      {!searchNameFocus && (
        <FloatingTextInput
          label="Amount"
          keyboardType="numeric"
          value={amount}
          handleChange={handleChange}
        />
      )}
      {!searchNameFocus && (
        <FloatingTextInput
          label="What is this for?"
          value={description}
          handleChange={handleDescriptionChange}
        />
      )}

      <View style={newStyles.container}>
        {renderPaymentLabel("Payment Method")}
        <Dropdown
          style={[
            newStyles.dropdown,
            isPaymentFocus && { borderColor: "#00db22" },
          ]}
          placeholderStyle={newStyles.placeholderStyle}
          selectedTextStyle={newStyles.selectedTextStyle}
          inputSearchStyle={newStyles.inputSearchStyle}
          iconStyle={newStyles.iconStyle}
          data={data}
          search={false}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isPaymentFocus ? "Payment Method" : ""}
          value={payment}
          onFocus={() => setIsPaymentFocus(true)}
          onBlur={() => setIsPaymentFocus(false)}
          onChange={(item: any) => {
            setPayment(item.value);
            setIsPaymentFocus(false);
          }}
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#61fa78" : "#8dfc9e",
          },
          styles.walletSendWrapper,
        ]}
        onPress={send}
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
    </View>
  );
};

export default SendScreen;

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
