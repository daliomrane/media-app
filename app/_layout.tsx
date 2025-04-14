import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

/**
 * Root layout component that sets up the navigation stack and theme
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    'PixelifySans': require('../assets/fonts/PixelifySans-VariableFont_wght.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Hide splash screen once fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ 
      headerShown: false // This will hide the header bar completely
    }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          //title: 'Cozey Leaf',
          headerShown: false,
          //headerStyle: {
          //  backgroundColor: colorScheme === 'dark' ? '#1D3D47' : '#A1CEDC',
          //},
          //headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        }} 
      />
      <Stack screenOptions={{ 
      headerShown: false // This will hide the header bar completely
    }}>
      <Stack.Screen name="[id]" />
      </Stack>

    </Stack>
  );
}
