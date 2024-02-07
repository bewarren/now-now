import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FriendRequest from "../Friends/FriendRequest";
import FriendsScreen from "../Friends/FriendsScreen";
import { Session } from "@supabase/supabase-js";
import FriendRequestList from "../Friends/FriendRequestList";

const FriendsContainer = ({ session }: { session: Session }) => {
  const Stack = createNativeStackNavigator();

  const groupName = "Group Screen";
  const addGroupName = "Add Group";
  const addFriendsToGroup = "Add Friends";

  return (
    <Stack.Navigator initialRouteName={groupName}>
      <Stack.Screen
        name={groupName}
        options={{ headerShown: true, title: "My Groups" }}
      >
        {(props) => (
          <FriendsScreen
            navigation={props.navigation}
            key={session?.user.id}
            session={session}
            params={props.route.params}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name={addGroupName} options={{ headerShown: true }}>
        {(props) => (
          <FriendRequest
            key={session?.user.id}
            session={session}
            navigation={props.navigation}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name={addFriendsToGroup} options={{ headerShown: true }}>
        {(props) => (
          <FriendRequestList
            key={session?.user.id}
            session={session}
            navigation={props.navigation}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default FriendsContainer;
