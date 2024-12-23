import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const getCredentials = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('@user_email');
        const storedPassword = await AsyncStorage.getItem('@user_password');
        if (storedEmail && storedPassword) {
          setEmail(storedEmail);
          setPassword(storedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error reading credentials from AsyncStorage:', error);
      }
    };
    getCredentials();
  }, []);

  const loginUser = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const uid = userCredential.user.uid;

      if (rememberMe) {
        await AsyncStorage.setItem('@user_email', email);
        await AsyncStorage.setItem('@user_password', password);
      } else {
        await AsyncStorage.removeItem('@user_email');
        await AsyncStorage.removeItem('@user_password');
      }

      navigation.replace('DisplayPage', {userId: uid});
    } catch (err) {
      console.error('Login Error:', err);
      Alert.alert('Error', 'Invalid email or password.');
    }
  };

  return (
    <ImageBackground
      source={require('../images/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <LinearGradient
              colors={[
                'rgba(0, 0, 0, 0.6)',
                'rgba(0, 0, 0, 0.3)',
                'rgba(0, 0, 0, 0.6)',
              ]}
              style={styles.gradientOverlay}>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title1}>Login</Text>
                <Text style={styles.title}>
                  Save, access, and enjoy your favorite recipes effortlessly!
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#888"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor="#888"
                />
                <View style={styles.switchContainer}>
                  <Text style={styles.textWitchContainer}>Remember Me</Text>
                  <Switch value={rememberMe} onValueChange={setRememberMe} />
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.greenButton}
                    onPress={loginUser}>
                    <Text style={styles.buttonText}>Login</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.greenButton}
                    onPress={() => navigation.navigate('AuthPage')}>
                    <Text style={styles.buttonText}>
                      Don't have an account? Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </LinearGradient>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end', // Align content at the bottom of the screen
    alignItems: 'center',
    transform: [{scale: 1.1}],
  },
  container: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end', // Make sure the overlay stays at the bottom
  },
  gradientOverlay: {
    padding: 20,
    paddingBottom: 40,
    paddingHorizontal: 30, // Ensure there is space at the bottom for buttons
    width: '100%',
    borderRadius: 50,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end', // Ensure the content stays at the bottom
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#fff',
  },
  title1: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#000',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  textWitchContainer: {color: 'white'},
  buttonContainer: {
    marginBottom: 20,
  },
  greenButton: {
    backgroundColor: '#25AE87',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginPage;
