import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Retrieve email from AsyncStorage when the component mounts
  useEffect(() => {
    const getEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('@user_email');
        if (storedEmail) {
          setEmail(storedEmail);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error reading email from AsyncStorage:', error);
      }
    };
    getEmail();
  }, []);

  // Function to fetch user data from Firestore
  const fetchUserData = async uid => {
    try {
      const userDoc = await firestore().collection('users').doc(uid).get();
      if (userDoc.exists) {
        return userDoc.data();
      } else {
        Alert.alert('Error', 'No user data found.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to fetch user data.');
      return null;
    }
  };

  // Login function
  const loginUser = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const uid = userCredential.user.uid;

      if (rememberMe) {
        await AsyncStorage.setItem('@user_email', email);
      } else {
        await AsyncStorage.removeItem('@user_email');
      }

      navigation.replace('DisplayPage', {userId: uid}); // Pass userId to DisplayPage
    } catch (err) {
      console.error('Login Error:', err);
      Alert.alert('Error', 'Invalid email or password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Remember Me Switch */}
      <View style={styles.switchContainer}>
        <Text>Remember Me</Text>
        <Switch value={rememberMe} onValueChange={setRememberMe} />
      </View>

      <Button title="Login" onPress={loginUser} />
      <Button
        title="Don't have an account? Sign Up"
        onPress={() => navigation.navigate('AuthPage')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
});

export default LoginPage;
