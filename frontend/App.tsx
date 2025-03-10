import { Provider } from "react-redux";
import SafeView from "./src/components/SafeView";
import store from "src/store";
import AppNavigation from "@navigation/AppNavigation";

export default function App() {
  return (
    <Provider store={store}>
      <SafeView>
        {/* <MainNavigation> */}
        {/* <Toast/> */}
        <AppNavigation />
        {/* </MainNavigation> */}
      </SafeView>
    </Provider>
  );
}
