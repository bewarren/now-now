import {
  View,
  Text,
  Alert,
  Pressable,
  Linking,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useCallback, useEffect, useState } from "react";
import styles from "../styles";
import * as Clipboard from "expo-clipboard";

import { Session } from "@supabase/supabase-js";
import FloatingTextInput from "../components/FloatingTextInput";
import { SelectList } from "react-native-dropdown-select-list";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";

const SendScreen = ({
  session,
  navigation,
}: {
  session: Session;
  navigation: any;
}) => {
  // search list of people with a name
  // limit and scroll on list for more

  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [screen, setScreen] = useState<string>("Pay");

  const [people, setPeople] = useState<any>([]);
  const [friends, setFriends] = useState<any>([]);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [bankDetails, setBankDetails] = useState<any>({});

  useEffect(() => {
    getFriends();
  }, []);

  const getBankDetails = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("bank, account_name, account_number")
      .eq("id", selectedPerson.id);

    if (data && !error) {
      setBankDetails(data[0]);
    } else {
      Alert.alert("Error getting bank details");
    }
  };

  useEffect(() => {
    if (screen === "Bank" && selectedPerson) {
      getBankDetails();
    }
  }, [screen, selectedPerson]);

  const handleNext = () => {
    setScreen((prevState) => {
      if (prevState === "Pay" && payment === "Bank EFT") {
        return "Bank";
      } else if (prevState === "Pay" && payment === "SnapScan") {
        if (selectedPerson.snapscan_link) {
          const valAmount: number = parseFloat(
            amount.replace(",", ".").replace(/\s/g, "")
          );
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
        return "SnapScan";
      } else if (prevState === "Pay" && payment === "SnapScan") {
        return "Cash";
      } else {
        return "Pay";
      }
    });
  };

  const handleBack = () => {
    setScreen("Pay");
  };

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
        payment_method: payment,
        amount: parseFloat(amount.replace(",", ".").replace(/\s/g, "")),
      });

      if (error) {
        Alert.alert("Error");
      } else {
        handleBack();
      }
    } else {
      Alert.alert("Please select all values");
    }

    // add to database
    // navigate back to wallet
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

  const [payment, setPayment] = useState<string>("");

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

  const [bankCopied, setBankCopied] = useState(false);
  const [accountNameCopied, setAccountNameCopied] = useState(false);
  const [accountNumberCopied, setAccountNumberCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
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
      {screen === "Pay" && (
        <View style={{ height: "100%" }}>
          <View style={newStyles.container}>
            {renderLabel("To")}
            <Dropdown
              style={[
                newStyles.dropdown,
                isFocus && { borderColor: "#00db22" },
              ]}
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
            onPress={handleNext}
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
      )}
      {screen === "SnapScan" && (
        <View style={{ height: "100%" }}>
          <KeyboardAwareScrollView
            style={{ flex: 1, width: "100%" }}
            contentContainerStyle={{
              alignContent: "center",
              justifyContent: "center",
              marginTop: "60%",
            }}
            keyboardShouldPersistTaps="always"
          >
            <Text style={{ fontSize: 20, textAlign: "center" }}>
              Did you complete the transaction on SnapScan?
            </Text>
            <View style={styles.awaitRow}>
              <TouchableOpacity style={styles.awaitButton} onPress={handleBack}>
                <Text style={styles.buttonTitle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.awaitButton} onPress={send}>
                <Text style={styles.buttonTitle}>Continue</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      )}
      {screen === "Bank" && (
        <View style={{ height: "100%" }}>
          <KeyboardAwareScrollView
            style={{ flex: 1, width: "100%" }}
            contentContainerStyle={{
              alignContent: "center",
              justifyContent: "center",
              marginTop: "20%",
            }}
            keyboardShouldPersistTaps="always"
          >
            <Text style={{ fontSize: 20, textAlign: "center" }}>
              Copy the details below and send on your banking app.
            </Text>
            <TouchableOpacity
              onPress={() => {
                copyToClipboard(bankDetails.bank);
                setBankCopied(true);
              }}
            >
              <View>
                <FloatingTextInput
                  label="Bank"
                  border={1}
                  value={bankDetails.bank || ""}
                  editable={false}
                  myColor={bankCopied ? "#8dfc9e" : "#B9C4CA"}
                  handleChange={() => {}}
                />
                <FontAwesomeIcon
                  icon={bankCopied ? faCheck : faCopy}
                  size={18}
                  color={bankCopied ? "#8dfc9e" : "#B9C4CA"}
                  style={{ position: "absolute", top: 45, marginLeft: 330 }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                copyToClipboard(bankDetails.account_name);
                setAccountNameCopied(true);
              }}
            >
              <View>
                <FloatingTextInput
                  label="Account Name"
                  border={1}
                  value={bankDetails.account_name || ""}
                  editable={false}
                  myColor={accountNameCopied ? "#8dfc9e" : "#B9C4CA"}
                  handleChange={() => {}}
                />
                <FontAwesomeIcon
                  icon={accountNameCopied ? faCheck : faCopy}
                  size={18}
                  color={accountNameCopied ? "#8dfc9e" : "#B9C4CA"}
                  style={{ position: "absolute", top: 45, marginLeft: 330 }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                copyToClipboard(bankDetails.account_number);
                setAccountNumberCopied(true);
              }}
            >
              <View>
                <FloatingTextInput
                  label="Account Number"
                  border={1}
                  value={bankDetails.account_number || ""}
                  editable={false}
                  myColor={accountNumberCopied ? "#8dfc9e" : "#B9C4CA"}
                  handleChange={() => {}}
                />
                <FontAwesomeIcon
                  icon={accountNumberCopied ? faCheck : faCopy}
                  size={18}
                  color={accountNumberCopied ? "#8dfc9e" : "#B9C4CA"}
                  style={{ position: "absolute", top: 45, marginLeft: 330 }}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.awaitRow}>
              <TouchableOpacity style={styles.awaitButton} onPress={handleBack}>
                <Text style={styles.buttonTitle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.awaitButton} onPress={send}>
                <Text style={styles.buttonTitle}>Send</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      )}
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
