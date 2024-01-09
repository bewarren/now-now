import { View, Text } from "react-native";
import styles from "../styles";

const Balance = () => {
  return (
    <View style={styles.balance}>
      <Text style={styles.yourBalance}>Amount owed</Text>
      <Text style={styles.balanceFont}>R 10</Text>
      {/* <Text>Total Incoming</Text>
      <Text style={styles.balanceFont}>R 5</Text>
      <Text>Total Outgoing</Text>
      <Text style={styles.balanceFont}>R 5</Text> */}
    </View>
  );
};

export default Balance;
