import {
  FlatList,
  SafeAreaView,
  TextInput,
  View,
  Text,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "../styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { err } from "react-native-svg/lib/typescript/xml";
import { Session } from "@supabase/supabase-js";
import FloatingTextInput from "../components/FloatingTextInput";

type ItemProps = {
  name: string | null;
  addFriend: () => void;
};

const Item = ({ name, addFriend }: ItemProps) => {
  return (
    <View style={styles.friendItem}>
      <Text style={styles.personSending}>{name}</Text>
      <Pressable
        onPress={addFriend}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#61fa78" : "#8dfc9e",
          },
          styles.friendWrapperCustom,
        ]}
      >
        {({ pressed }) => {
          return (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <FontAwesomeIcon
                icon={faPlus}
                size={22}
                style={{ marginTop: 4.5 }}
              />
              <Text style={styles.sendButton}>Add</Text>
            </View>
          );
        }}
      </Pressable>
    </View>
  );
};

const FriendRequest = ({
  session,
  navigation,
}: {
  session: Session;
  navigation: any;
}) => {
  // search list of people with a name
  // limit and scroll on list for more

  const [searchName, setSearchName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchNameFocus, setSearchNameFocus] = useState<boolean>(false);
  const [people, setPeople] = useState<any>([]);

  useEffect(() => {
    if (searchName !== "") {
      getPeople(searchName);
    }
  }, [searchName]);

  const getPeople = async (name: string) => {
    setLoading(true);

    // get all of a users friends
    const { data: friendsData, error: friendsError } = await supabase
      .from("friendships")
      .select(
        `*, requester: requester_id (id, full_name), addressee: addressee_id (id, full_name)`
      )
      .or(
        `requester_id.eq.${session.user.id},and(addressee_id.eq.${session.user.id})`
      )
      // .eq("accepted", true) // removed these as it is a bug that you may both send a friend request and then double count
      // .eq("rejected", false)
      .order("updated_at", { ascending: false });

    // get ids of their friends
    if (!friendsError) {
      const friends = friendsData
        ? friendsData.map((friendship) => {
            const friendId =
              friendship.addressee.id === session.user.id
                ? friendship.requester.id
                : friendship.addressee.id;

            return friendId;
          })
        : [];

      // get all people that are not your friends
      const { data, error, status } = await supabase
        .from("profiles")
        .select()
        .not("id", "in", `(${friends})`)
        .neq("id", session?.user.id)
        .ilike("full_name", `%${name}%`);

      if (data && !error) {
        setPeople(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const addFriendHandler = async (addresseeId: number) => {
    const { data, error: errorSelect } = await supabase
      .from("friendships")
      .select()
      .eq("requester_id", session.user.id)
      .eq("addressee_id", addresseeId);

    // if friend request
    if (data && !errorSelect) {
      if (data.length === 0) {
        const { error } = await supabase.from("friendships").insert({
          created_at: new Date(),
          requester_id: session.user.id,
          addressee_id: addresseeId,
        });
      }
    }
    navigation.navigate("Friends");
  };

  const handleChangeSearchName = (text: string) => {
    setSearchName(text);
  };

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "white",
      }}
    >
      {/* search list */}
      <FloatingTextInput
        label="Search"
        value={searchName}
        handleChange={handleChangeSearchName}
      />

      {/* list of people */}
      <SafeAreaView style={styles.listContainer}>
        {people.length > 0 && searchName !== "" && (
          <FlatList
            nestedScrollEnabled
            key={1}
            data={people}
            renderItem={({ item }) => {
              return (
                <Item
                  name={item?.full_name}
                  addFriend={() => {
                    addFriendHandler(item.id);
                  }}
                />
              );
            }}
            keyExtractor={(item) => item.id}
          />
        )}
        {loading && (
          <View style={[styles.horizontal]}>
            <ActivityIndicator size="large" color="#00cc1f" />
          </View>
        )}
      </SafeAreaView>
      {/* list of friend request button on clicking */}
    </View>
  );
};

export default FriendRequest;
