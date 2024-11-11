import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MypageScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const loadUserData = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      const name = await AsyncStorage.getItem('userName');
      setUserEmail(email || '');
      setUserName(name || '');
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userEmail');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>MY PAGE</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>이메일</Text>
          <Text style={styles.info}>{userEmail}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>사용자 이름</Text>
          <Text style={styles.info}>{userName}</Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  infoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    color: '#000',
    borderLeftWidth: 1,
    borderBottomWidth: 1.5,
    borderColor: '#000',
    borderBottomLeftRadius: 8,
    padding: 10,
  },
  button: {
    height: 45,
    width: 100,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 20,
  },
  buttonText: {
    color: '#000',
    textTransform: 'uppercase',
    fontSize: 14,
    letterSpacing: 2,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  backButton: {
    padding: 0,
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
  },
});

export default MypageScreen;