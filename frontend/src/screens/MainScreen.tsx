import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Animated, Easing} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import LiquidButton from '../components/LiquidLogo';
import GlowButton from '../components/GlowButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useNavigationState } from '@react-navigation/native';

type RootStackParamList = {
  Main: undefined;
  Camera: { selectedModel: any };
  ModelSelection: undefined;
  Test: undefined;
  HeatmapScreen: undefined;
  Login: undefined;
  Mypage: undefined;
};

type MainScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Main'
>;

type Props = {
  navigation: MainScreenNavigationProp;
};

const MainScreen: React.FC<Props> = ({ navigation }) => {
  const translateX = React.useRef(new Animated.Value(0)).current;
  const navigationState = useNavigationState(state => state);

  React.useEffect(() => {
    const currentRoute = navigationState.routes[navigationState.index];
    if (currentRoute.name === 'ModelSelection' || currentRoute.name === 'Login') {
      Animated.timing(translateX, {
        toValue: -600,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }).start();
    } else if (currentRoute.name === 'Main') {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }).start();
    }
  }, [navigationState]);

  const handleMypagePress = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      navigation.navigate('Mypage');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>MI'</Text>
            <Text style={styles.logoText}>Ra</Text>
            <Text style={styles.logoText}>GE</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('ModelSelection')}>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>S</Text>
                <Text style={styles.buttonText}>t</Text>
                <Text style={styles.buttonText}>a</Text>
                <Text style={styles.buttonText}>r</Text>
                <Text style={styles.buttonText}>t</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('Test')}>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>I</Text>
                <Text style={styles.buttonText}>n</Text>
                <Text style={styles.buttonText}>f</Text>
                <Text style={styles.buttonText}>o</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={handleMypagePress}>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>L</Text>
                <Text style={styles.buttonText}>o</Text>
                <Text style={styles.buttonText}>g</Text>
                <Text style={styles.buttonText}>i</Text>
                <Text style={styles.buttonText}>n</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.settingContainer}>
            <TouchableOpacity>
              <Text style={styles.settingText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.settingText}>Help</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Animated.View 
          style={[
            styles.box,
            {
              transform: [
                { translateX: translateX }
              ]
            }
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },


  leftSection: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 1,
  },
  logoContainer: {
    marginLeft: '8%',
    marginTop: '-15%',
    gap: 0,
    //letterSpacing: 100,
    
  },
  logoText: {
    color: 'black',
    fontSize: 22,
    fontWeight: '700',
  },


  buttonContainer: {
    marginTop: '50%',
    marginLeft: '0%',
    //flexDirection: 'row',
    gap: 0,
    alignItems: 'flex-start',
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginVertical: 0,
    //width: '80%',
    alignItems: 'center',
  },
  buttonTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  buttonText: {
    color: '#1a1a1a',
    fontSize: 38,
    fontWeight: '300',
  },

  settingContainer: {
    marginTop: '8%',
    marginLeft: '7%',
  },
  settingText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '300',
    paddingVertical: 4,
  },

  box: {
    position: 'absolute',
    left: '55%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    top: '13.7%',
    width: '160%',
    height: '71.4%',
    backgroundColor: '#e3e3e3',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: -8,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 5,
  },
});

export default MainScreen;
