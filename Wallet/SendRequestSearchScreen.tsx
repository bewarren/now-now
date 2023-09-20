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
import { Session } from "@supabase/supabase-js";

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

const SendRequestSearchScreen = ({
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
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from("profiles")
        .select()
        .neq("id", session?.user.id)
        .ilike("full_name", `%${name}%`);
      if (error && status !== 406) {
        throw error;
      }

      const { data: friendshipData, error: errorSelect } = await supabase
        .from("friendships")
        .select()
        .in("requester_id", data ? data.map((d) => d.id) : [])
        .eq("addressee_id", session?.user.id)
        .single();

      const { data: friendshipDataTwo, error: errorSelectTwo } = await supabase
        .from("friendships")
        .select()
        .in("addressee_id", data ? data.map((d) => d.id) : [])
        .eq("requester_id", session?.user.id)
        .single();

      if (!friendshipData && !friendshipDataTwo && data) {
        setPeople(data);
        setLoading(false);
      } else {
        setPeople(
          data?.filter((d) => {
            const exists =
              d.id === friendshipData?.addressee_id ||
              d.id === friendshipDataTwo?.requester_id;
            return exists;
          })
        );
        setLoading(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
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
    navigation.navigate("Friends", { reload: true });
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
      <View style={searchNameFocus ? styles.inputFocus : styles.input}>
        <FontAwesomeIcon
          icon={faSearch}
          color={searchNameFocus ? "#8dfc9e" : "#aaaaaa"}
        />
        <TextInput
          placeholder="Search"
          style={{ paddingLeft: 10, height: "100%", width: "100%" }}
          placeholderTextColor={searchNameFocus ? "#8dfc9e" : "#aaaaaa"}
          onChangeText={(text) => setSearchName(text)}
          onFocus={() => {
            setSearchNameFocus(true);
          }}
          onBlur={() => {
            setSearchNameFocus(false);
          }}
          value={searchName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
      </View>
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

export default SendRequestSearchScreen;
