import { Text, View } from "react-native";
import styles from "../styles";
import Balance from "./Balance";
import SendRequest from "./SendRequest";
import FloatingTextInput from "../components/FloatingTextInput";

const WalletScreen = ({ navigation }: { navigation: any }) => {
  const sendHandler = () => {
    navigation.navigate("Send Screen");
  };
  const requestHandler = () => {
    navigation.navigate("Request Screen");
  };
  return (
    <View style={styles.wallet}>
      {/* <Balance /> */}
      <SendRequest sendHandler={sendHandler} requestHandler={requestHandler} />
    </View>
  );
};

export default WalletScreen;
