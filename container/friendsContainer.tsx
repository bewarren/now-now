import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FriendRequest from "../Friends/FriendRequest";
import FriendsScreen from "../Friends/FriendsScreen";
import { Session } from "@supabase/supabase-js";

const FriendsContainer = ({ session }: { session: Session }) => {
  const Stack = createNativeStackNavigator();

  const friendsListName = "Friends";
  const findFriendsName = "Find Friends";
  const sendFriendsName = "Send Friends";
  const requestFriendsName = "Request Friends";

  return (
    <Stack.Navigator initialRouteName={friendsListName}>
      <Stack.Screen
        name={friendsListName}
        component={FriendsScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen name={findFriendsName} options={{ headerShown: true }}>
        {(props) => <FriendRequest key={session?.user.id} session={session} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default FriendsContainer;
