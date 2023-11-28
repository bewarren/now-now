import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import styles from "../styles";
import Balance from "./Balance";
import SendRequest from "./SendRequest";
import FloatingTextInput from "../components/FloatingTextInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const WalletScreen = ({ navigation }: { navigation: any }) => {
  const sendHandler = () => {
    navigation.navigate("Send Screen");
  };
  const requestHandler = () => {
    navigation.navigate("Request Screen");
  };
  return (
    <KeyboardAwareScrollView
      style={styles.wallet}
      contentContainerStyle={{
        alignContent: "space-between",
        justifyContent: "space-around",
      }}
    >
      <Balance />
      <SendRequest sendHandler={sendHandler} requestHandler={requestHandler} />
    </KeyboardAwareScrollView>
  );
};

export default WalletScreen;
