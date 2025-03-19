import { Provider } from "react-redux";
import SafeView from "./src/components/SafeView";
import store from "src/store";
import AppNavigation from "@navigation/AppNavigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import 'react-native-gesture-handler';

const queryClient = new QueryClient();

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeView>
          <AppNavigation />
        </SafeView>
      </QueryClientProvider>
    </Provider>
  );
}
