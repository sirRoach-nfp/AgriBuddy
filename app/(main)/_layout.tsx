import { Platform, StyleSheet, Text, View } from 'react-native'

import React from 'react'



import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';




const _mainlayout = () => {

    const colorScheme = useColorScheme();


  return (
    <Tabs
        screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarLabelPosition:'below-icon',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    
    >




      <Tabs.Screen name = 'home' 

                options={{
                  title: 'Home',
                  tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                  headerShown:false,
           
                }}

      
      
      />
      <Tabs.Screen name = 'crops'
      
                options={{
                title: 'Crops',
                tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                headerShown:false,
                }}
      
      
      />
      <Tabs.Screen name = 'records'
      
                options={{
                    title: 'discussions',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                    headerShown:false,
                }}
      
      />
      <Tabs.Screen name = 'expenses'
      
                options={{
                    title: 'expenses',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                    headerShown:false,
                }}


      />
      <Tabs.Screen name = 'account' 
      
                options={{
                    title: 'account',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                    headerShown:false,
                }}
      
      
      />



    </Tabs>
  )
}

export default _mainlayout

const styles = StyleSheet.create({})