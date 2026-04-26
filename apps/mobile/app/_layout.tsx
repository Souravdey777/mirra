import { colors } from "@mirra/design";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { MirraQueryProvider } from "@/lib/queryClient";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <MirraQueryProvider>
        <StatusBar style="dark" backgroundColor={colors.cream} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.cream }
          }}
        />
      </MirraQueryProvider>
    </SafeAreaProvider>
  );
}
