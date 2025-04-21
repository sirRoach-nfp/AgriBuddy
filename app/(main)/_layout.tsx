import { Platform, StyleSheet, Text, View } from 'react-native'

import React from 'react'



import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import Octicons from '@expo/vector-icons/Octicons';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';


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
                  tabBarIcon: ({ color }) => <Entypo name="home" size={28} color={color} />,
                  headerShown:false,
           
                }}

      
      
      />
      <Tabs.Screen name = 'crops'
      
                options={{
                title: 'Crops',
                tabBarIcon: ({ color }) => <Entypo name="leaf" size={28} color={color} />,
                headerShown:false,
                }}
      
      
      />
      <Tabs.Screen name = 'records'
      
                options={{
                    title: 'discussions',
                    tabBarIcon: ({ color }) => <Octicons name="comment-discussion" size={28} color={color} />,
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
                    tabBarIcon: ({ color }) => <MaterialIcons name="account-box" size={28} color={color} /> ,
                    headerShown:false,
                }}
      
      
      />



    </Tabs>
  )
}

export default _mainlayout

const styles = StyleSheet.create({})