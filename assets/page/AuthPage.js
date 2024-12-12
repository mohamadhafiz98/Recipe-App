import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {NavigationContainer} from '@react-navigation/native';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '764354716938-2adk3pk3t0vit3m9vfivb5505djjm0f7.apps.googleusercontent.com',
    });
  }, []);

  const onGoogleButtonPress = async () => {
    try {
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      Alert.alert('Success', 'Signed in with Google!');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Error', 'Google Sign-In failed. Please try again.');
    }
  };

  const signUpUser = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert('User Created');
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Error', 'Failed to create user. Please try again.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button title="Submit" onPress={signUpUser} />
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
});

export default AuthPage;
