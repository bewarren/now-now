import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";

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
import { dom } from "@fortawesome/fontawesome-svg-core";

type ItemProps = {
  name: string | null;
  send: () => void;
  request: () => void;
};

const Item = ({ name, send, request }: ItemProps) => {
  return (
    <View style={styles.requestItem}>
      <View style={styles.requestPerson}>
        <Text style={styles.friendName}>{name}</Text>
      </View>
    </View>
  );
};

interface FriendsProps {
  navigation: any;
  session: Session;
  params: any;
}

const FriendsScreen = ({ navigation, session, params }: FriendsProps) => {
  const [friends, setFriends] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [offSet, setOffSet] = useState<number>(20);

  const handleEnd = () => {
    if (friends.length >= 10) {
      setOffSet((prevState: number) => prevState + 10);
      getFriends(offSet + 10);
    }
  };

  const findFriends = () => {
    navigation.navigate("Find Friends");
  };

  const friendRequests = () => {
    navigation.navigate("Friend Requests");
  };

  const getFriends = async (offSet: number) => {
    setLoading(true);
    const formattedFriendData: any[] = [];
    const { data, error } = await supabase
      .from("friendships")
      .select(
        `*, requester: requester_id (full_name), addressee: addressee_id (full_name)`
      )
      .or(
        `requester_id.eq.${session.user.id},and(addressee_id.eq.${session.user.id})`
      )
      .eq("accepted", true)
      .eq("rejected", false)
      .order("updated_at", { ascending: false })
      .limit(offSet);

    console.log(data);

    // query foreign table up here
    if (data && !error) {
      setLoading(false);

      setFriends(
        data.map((d) => {
          return {
            ...d,
            requester_name: d.requester.full_name,
            addressee_name: d.addressee.full_name,
          };
        })
      );
    } else {
      setLoading(false);
    }
  };

  // need to send back a prop that triggers this

  // need a loading screen

  useEffect(() => {
    if (session) {
      if (!params) {
        getFriends(20);
      } else {
        const { reload } = params;
        if (reload) {
          getFriends(20);
        }
      }
    }
  }, [session, params]);

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

  if (loading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#00cc1f" />
      </View>
    );
  }

  const sendHandler = () => {
    navigation.navigate("Send Screen");
  };
  const requestHandler = () => {
    navigation.navigate("Request Screen");
  };

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
                name={friendName}
                send={sendHandler}
                request={requestHandler}
              />
            );
          }}
          keyExtractor={(item) => item.id}
          onEndReached={handleEnd}
        />
      )}
    </SafeAreaView>
  );
};

export default FriendsScreen;
