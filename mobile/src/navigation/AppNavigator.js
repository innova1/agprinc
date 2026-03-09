import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import FrameworkScreen from '../screens/FrameworkScreen';
import DetailScreen from '../screens/DetailScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const COLORS = { primary: '#2c5f8a', accent: '#5ba3d9', white: '#fff' };

function FrameworksStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Frameworks" component={HomeScreen} options={{ title: 'Agile Frameworks' }} />
      <Stack.Screen name="Framework" component={FrameworkScreen} options={({ route }) => ({ title: route.params.frameworkdisplay })} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Principle Detail' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: '#888',
          tabBarStyle: { paddingBottom: 4 },
        }}
      >
        <Tab.Screen
          name="FrameworksTab"
          component={FrameworksStack}
          options={{ title: 'Frameworks', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text> }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchScreen}
          options={{ title: 'Search', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🔍</Text>,
            headerShown: true, headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: COLORS.white, headerTitle: 'Search Principles' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
