import { Text, View } from "react-native";
import styles from "../styles";
import Balance from "./Balance";
import SendRequest from "./SendRequest";

const WalletScreen = ({ navigation }: { navigation: any }) => {
  const sendRequestHandler = () => {
    navigation.navigate("Send Request Screen");
  };
  return (
    <View style={styles.wallet}>
      <Balance />
      <SendRequest sendRequestHandler={sendRequestHandler} />
    </View>
  );
};

export default WalletScreen;
