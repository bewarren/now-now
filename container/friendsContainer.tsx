import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FriendRequest from "../Friends/FriendRequest";
import FriendsScreen from "../Friends/FriendsScreen";
import { Session } from "@supabase/supabase-js";
import FriendRequestList from "../Friends/FriendRequestList";

const FriendsContainer = ({ session }: { session: Session }) => {
  const Stack = createNativeStackNavigator();

  const friendsListName = "Friends";
  const findFriendsName = "Find Friends";
  const requestFriendsName = "Friend Requests";

  return (
    <Stack.Navigator initialRouteName={friendsListName}>
      <Stack.Screen
        name={friendsListName}
        options={{ headerShown: true, title: "My Friends" }}
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
      <Stack.Screen name={findFriendsName} options={{ headerShown: true }}>
        {(props) => (
          <FriendRequest
            key={session?.user.id}
            session={session}
            navigation={props.navigation}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name={requestFriendsName} options={{ headerShown: true }}>
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
