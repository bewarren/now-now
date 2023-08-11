import { View } from "react-native";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

const FriendRequest = () => {
  // search list of people with a name
  // limit and scroll on list for more

  const [searchName, setSearchName] = useState<string>("");
  const [people, setPeople] = useState<any>([]);

  useEffect(() => {
    getPeople(searchName);
  }, [searchName]);

  const getPeople = async (name: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .ilike("full_name", `%${name}%`);
    setPeople(data);
  };

  return (
    <View>
      {/* search list */}
      {/* list of people */}
      {/* list of friend request button on clicking */}
    </View>
  );
};

export default FriendRequest;
