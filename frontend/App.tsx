import SafeView from "./src/components/SafeView";
import {
  AuthNavigator,
  MainNavigation,
} from "@utils/Exports";

export default function App() {
  return (
    <SafeView>
      <MainNavigation>
        <AuthNavigator />
      </MainNavigation>
      {/* <StatusBar style="dark" /> */}
    </SafeView>
  );
}
