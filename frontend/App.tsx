import React, { useState, useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, CardStyleInterpolators, StackNavigationOptions} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StackCardInterpolationProps } from '@react-navigation/stack';

import MainScreen from './src/screens/MainScreen';
import CameraScreen from './src/screens/CameraScreen';
import ModelSelectionScreen from './src/screens/ModelSelectionScreen';
import TestScreen from './src/screens/TestScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import MypageScreen from './src/screens/MypageScreen';
import SpeedCameraScreen from './src/screens/SpeedCameraScreen';


const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
      } catch (e) {
        console.error('토큰 로딩 실패:', e);
      }
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
          transitionSpec: {
            open: {
              animation: 'timing',
              config: { duration: 800 },
            },
            close: {
              animation: 'timing',
              config: { duration: 800 },
            },
          },
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={MainScreen} 
          options={({ navigation }): StackNavigationOptions => ({
            cardStyleInterpolator: (props: StackCardInterpolationProps) => {
              const nextScreen = navigation.getState().routes[navigation.getState().index]?.name;
              const prevScreen = navigation.getState().routes[navigation.getState().index - 1]?.name;
              
              if (nextScreen === 'Login' || nextScreen === 'ModelSelection') {
                const { current, layouts } = props;
                return {
                  cardStyle: {
                    transform: [
                      {
                        translateX: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.width * 0.3, 0],
                        }),
                      },
                    ],
                    opacity: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                };
              } else if (prevScreen === 'Login' || prevScreen === 'ModelSelection') {
                const { current, layouts } = props;
                return {
                  cardStyle: {
                    transform: [
                      {
                        translateX: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-layouts.screen.width * 0.3, 0],
                        }),
                      },
                    ],
                    opacity: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                };
              }
              return CardStyleInterpolators.forFadeFromCenter(props);
            },
          })}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
                overlayStyle: {
                  opacity: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5],
                  }),
                },
              };
            },
          }}
        />
        <Stack.Screen 
          name="ModelSelection" 
          component={ModelSelectionScreen}
          options={{
            cardStyleInterpolator: ({ current, layouts, next }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
                overlayStyle: {
                  opacity: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5],
                  }),
                },
              };
            },
          }}
        />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Test" component={TestScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Mypage" component={MypageScreen} />
        <Stack.Screen name="SpeedCamera" component={SpeedCameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
