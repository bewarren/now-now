import { Pressable, View, Text } from "react-native";
import styles from "../styles";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faArrowRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

const SendRequest = ({
  sendRequestHandler,
}: {
  sendRequestHandler: () => void;
}) => {
  return (
    <View style={styles.sendRequestRow}>
      <Pressable
        onPress={sendRequestHandler}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#61fa78" : "#8dfc9e",
          },
          styles.wrapperCustom,
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
              <FontAwesomeIcon
                icon={faArrowRight}
                size={22}
                style={{ marginTop: 4.5 }}
              />
              <Text style={styles.sendButton}>Send</Text>
            </View>
          );
        }}
      </Pressable>
      <Pressable
        onPress={() => {}}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#61fa78" : "#8dfc9e",
          },
          styles.wrapperCustom,
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
              <FontAwesomeIcon
                icon={faArrowRotateLeft}
                size={20}
                style={{ marginTop: 5.5 }}
              />
              <Text style={styles.sendButton}>Request</Text>
            </View>
          );
        }}
      </Pressable>
    </View>
  );
};

export default SendRequest;
