import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';


type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
  Mypage: undefined;
};

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    try {
      const response = await fetch('YOUR_IP_ADDRESS/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('로그인 응답:', data);

      if (response.ok) {
        if (data.access_token) {
          await AsyncStorage.setItem('userToken', data.access_token);
          await AsyncStorage.setItem('userEmail', email);
          if (data.username) {
            console.log('저장할 사용자 이름:', data.username); // 디버깅용
            await AsyncStorage.setItem('userName', data.username);
          }
          navigation.replace('Mypage');
        } else {
          Alert.alert('오류', '토큰이 없습니다.');
        }
      } else {
        Alert.alert('오류', data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      Alert.alert('오류', '서버 연결에 실패했습니다.');
    }
  };

  const handleSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View>
          <View style={styles.card}>
            <Text style={styles.login}>LOG IN</Text>
            
            <View style={styles.inputBox}>
              <TextInput
                style={[
                  styles.input,
                  (isFocusedEmail || email) && styles.inputFocused
                ]}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setIsFocusedEmail(true)}
                onBlur={() => setIsFocusedEmail(false)}
              />
              <Text style={[
                styles.placeholder,
                (isFocusedEmail || email) && styles.placeholderFocused
              ]}>e-mail</Text>
            </View>

            <View style={styles.inputBox}>
              <TextInput
                style={[
                  styles.input,
                  (isFocusedPassword || password) && styles.inputFocused
                ]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setIsFocusedPassword(true)}
                onBlur={() => setIsFocusedPassword(false)}
              />
              <Text style={[
                styles.placeholder,
                (isFocusedPassword || password) && styles.placeholderFocused
              ]}>password</Text>
            </View>

            <TouchableOpacity 
              style={styles.enter}
              onPress={handleLogin}
            >
              <Text style={styles.enterText}>ENTER</Text>
            </TouchableOpacity>

            <Text style={[styles.signUpText, {marginTop: 100}]}>계정이 없으신가요? </Text>
          <TouchableOpacity 
            style={styles.signUpButton}
            onPress={handleSignUpPress}
          >
            
            <Text style={[styles.signUpText, {textDecorationLine: 'underline', fontSize: 15, padding: 0}]}>Sign Up</Text>
          </TouchableOpacity>
          </View>

          
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '100%',
    height: '80%',
    padding: '15%',
    backgroundColor: '#e3e3e3',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: '18%',
    marginLeft: '-10%',
    marginBottom: '2%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 5,
  },


  login: {
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '400',
    fontSize: 24,
    marginBottom: 35,
    marginLeft: '10%',
  },


  inputBox: {
    position: 'relative',
    width: 250,
    marginBottom: '18%',
    marginLeft: '10%',
  },
  input: {
    width: '100%',
    padding: 10,
    fontSize: 15,
    color: '#000',
    backgroundColor: 'transparent',
    borderLeftWidth: 1,
    borderBottomWidth: 1.5,
    borderColor: '#000',
    borderBottomLeftRadius: 8,
    fontWeight: '300',
  },
  inputFocused: {
    borderWidth: 2,
    borderRadius: 8,
  },
  placeholder: {
    position: 'absolute',
    left: '8%',
    top: '25%',
    fontSize: 14,
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 3,
    fontWeight: '400',
    marginLeft: '-3%',
  },
  placeholderFocused: {
    opacity: 0,
  },
  enter: {
    height: 45,
    width: 100,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 5,
    marginLeft: '10%',
  },
  enterText: {
    color: '#000',
    textTransform: 'uppercase',
    fontSize: 14,
    letterSpacing: 2,
    //marginLeft: '10%',
  },


  signUpButton: {
    //marginTop: 15,
    padding: 5,
    //marginLeft: '10%',
  },
  signUpText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    marginLeft: '10%',
    padding: 10,
    //textDecorationLine: 'underline',
  },
});

export default LoginScreen;
