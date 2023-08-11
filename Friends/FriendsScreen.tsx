import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Pressable, View } from "react-native";

import { faPersonCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faBell as faBellOutline } from "@fortawesome/free-regular-svg-icons";
import { useLayoutEffect } from "react";
import styles from "../styles";

interface FriendsProps {
  navigation: any;
}

const FriendsScreen = ({ navigation }: FriendsProps) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLargeTitle: false,
      headerLargeTitleShadowVisible: true,
      headerTransparent: false,
      headerLeft: () => {
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Pressable onPress={() => {}} style={{ marginHorizontal: 15 }}>
              <FontAwesomeIcon
                icon={faPersonCirclePlus}
                size={23}
                color="#2ad14e"
              />
            </Pressable>
          </View>
        );
      },

      headerRight: () => {
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Pressable onPress={() => {}} style={{ marginHorizontal: 15 }}>
              <FontAwesomeIcon
                icon={faBellOutline}
                size={21}
                color="#2ad14e"
                style={{ zIndex: 0 }}
              />
            </Pressable>
          </View>
        );
      },
    });
  }, [navigation]);

  return <View style={styles.container}></View>;
};

export default FriendsScreen;
