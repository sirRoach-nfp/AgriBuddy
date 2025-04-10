import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
import { CropProvider } from './Context/CropContext';
import { UserProvider } from './Context/UserContext';
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (

    <UserProvider>



    

      <CropProvider>
        <SafeAreaProvider>


          <GestureHandlerRootView style={styles.container}>   
              
              
              
              <ThemeProvider 
                value={{
                  ...DefaultTheme,
                  colors: {
                    ...DefaultTheme.colors,
                    background: '#FFFFFF',  // Light gray background
                  }
                }}>
                <Stack screenOptions={{ headerShown: false }} />
                <StatusBar style="auto" />
              </ThemeProvider>
            
            
            
            
            
            </GestureHandlerRootView>



        </SafeAreaProvider>
      
      </CropProvider>

      

  </UserProvider>



  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});