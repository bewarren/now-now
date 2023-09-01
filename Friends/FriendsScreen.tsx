import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { FlatList, Pressable, SafeAreaView, Text, View } from "react-native";

import {
  faArrowRight,
  faArrowRotateLeft,
  faCheck,
  faPersonCirclePlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { faBell as faBellOutline } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useLayoutEffect, useState } from "react";
import styles from "../styles";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";

type ItemProps = {
  name: string | null;
  send: () => void;
  request: () => void;
};

const Item = ({ name, send, request }: ItemProps) => {
  return (
    <View style={styles.requestItem}>
      <View style={styles.requestPerson}>
        <Text style={styles.personSending}>{name}</Text>
      </View>
      <View style={styles.acceptReject}>
        <Pressable
          onPress={send}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#61fa78" : "#8dfc9e",
            },
            styles.sendWrapperCustom,
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
          onPress={request}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#61fa78" : "#8dfc9e",
            },
            styles.sendWrapperCustom,
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
                  size={22}
                  style={{ marginTop: 4.5 }}
                />
                <Text style={styles.sendButton}>Request</Text>
              </View>
            );
          }}
        </Pressable>
      </View>
    </View>
  );
};

interface FriendsProps {
  navigation: any;
  session: Session;
}

const FriendsScreen = ({ navigation, session }: FriendsProps) => {
  const [friends, setFriends] = useState<any>([]);
  const findFriends = () => {
    navigation.navigate("Find Friends");
  };

  const friendRequests = () => {
    navigation.navigate("Friend Requests");
  };

  const getFriends = async () => {
    const { data, error } = await supabase
      .from("friendships")
      .select()
      .or(
        `requester_id.eq.${session.user.id},and(addressee_id.eq.${session.user.id})`
      )
      .eq("accepted", true)
      .eq("rejected", false);

    if (!error) {
      setFriends(data);
    }
  };

  useEffect(() => {
    if (session) {
      getFriends();
    }
  }, [session]);

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
            <Pressable
              onPress={friendRequests}
              style={{ marginHorizontal: 15 }}
            >
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

  return (
    <SafeAreaView style={styles.listContainer}>
      {friends.length > 0 && (
        <FlatList
          key={1}
          data={friends}
          renderItem={({ item }) => {
            const friendName =
              item.addressee_id === session.user.id
                ? item.requester_name
                : item.addressee_name;
            return (
              <Item
                name={item?.requester_name}
                send={() => {}}
                request={() => {}}
              />
            );
          }}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  );
};

export default FriendsScreen;
