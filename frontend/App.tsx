import { Provider } from "react-redux";
import SafeView from "./src/components/SafeView";
import { AuthNavigator, MainNavigation } from "@utils/Exports";
import store from "src/store";
import AppNavigation from "@navigation/AppNavigation";

export default function App() {
  return (
    <Provider store={store}>
      <SafeView>
        {/* <MainNavigation> */}
        <AppNavigation />
        {/* </MainNavigation> */}
      </SafeView>
    </Provider>
  );
}
