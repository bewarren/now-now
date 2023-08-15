import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Pressable, View } from "react-native";

import { faPersonCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faBell as faBellOutline } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useLayoutEffect } from "react";
import styles from "../styles";
import { supabase } from "../lib/supabase";

interface FriendsProps {
  navigation: any;
}

const FriendsScreen = ({ navigation }: FriendsProps) => {
  const findFriends = () => {
    navigation.navigate("Find Friends");
  };

  const getFriends = async () => {
    const { data, error } = await supabase.from("friendships").select();
    console.log(data);
  };

  useEffect(() => {
    getFriends();
  }, []);

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
            <Pressable onPress={findFriends} style={{ marginHorizontal: 15 }}>
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
