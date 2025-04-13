import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

/**
 * Root layout component that sets up the navigation stack and theme
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();

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
