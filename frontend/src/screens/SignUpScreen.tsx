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
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [isFocusedUsername, setIsFocusedUsername] = useState(false);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Username:', username);

    if (!password) {
      Alert.alert('오류', '비밀번호를 입력하세요.');
      return;
    }

    try {
      const response = await fetch('YOUR_API_ADRESS/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();
      
      if (response.ok) {
        Alert.alert('성공', '회원가입이 완료되었습니다.', [
          { text: '확인', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('오류', data.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '서버 연결에 실패했습니다.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View>
          <View style={styles.card}>
            <Text style={styles.title}>SIGN UP</Text>
            
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
                autoCapitalize="none"
                keyboardType="email-address"
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
                  (isFocusedUsername || username) && styles.inputFocused
                ]}
                value={username}
                onChangeText={setUsername}
                onFocus={() => setIsFocusedUsername(true)}
                onBlur={() => setIsFocusedUsername(false)}
              />
              <Text style={[
                styles.placeholder,
                (isFocusedUsername || username) && styles.placeholderFocused
              ]}>username</Text>
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
              onPress={handleSignUp}
            >
              <Text style={styles.enterText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.loginText, {marginTop: 10}]}>이미 계정이 있으신가요? </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.loginText, {textDecorationLine: 'underline', fontSize: 15, padding: 0}]}>
              Log in
            </Text>
          </TouchableOpacity>
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
    width: 300,
    padding: 35,
    backgroundColor: '#e3e3e3',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: '18%',
    marginLeft: '2%',
    marginBottom: '2%',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 16,
    },
    shadowOpacity: 0.5,
    shadowRadius: 32,
    elevation: 5,
  },
  title: {
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '400',
    fontSize: 24,
    marginBottom: 35,
  },
  inputBox: {
    position: 'relative',
    width: 250,
    marginBottom: '18%',
  },
  input: {
    width: '100%',
    padding: 10,
    fontSize: 20,
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
  },
  enterText: {
    color: '#000',
    textTransform: 'uppercase',
    fontSize: 14,
    letterSpacing: 2,
  },
  loginButton: {
    padding: 5,
  },
  loginText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    marginLeft: '3%',
    padding: 10,
  },
});

export default SignUpScreen;
