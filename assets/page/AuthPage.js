import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';

import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const AuthPage = () => {
  const navigation = useNavigation();
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
      .then(async () => {
        const userId = auth().currentUser.uid;

        const defaultUserData = {
          name: 'New User',
          profilePicture: '',
          favoriteRecipeType: 'Vegetarian',
        };

        await firestore().collection('users').doc(userId).set(defaultUserData);

        const defaultRecipes = [
          {
            title: 'Salad',
            ingredient: 'Lettuce, Tomato, Cucumber, Olive Oil, Lemon Juice',
            direction: [
              'Wash and chop the lettuce, tomato, and cucumber into bite-sized pieces.',
              'In a large bowl, combine all the chopped vegetables.',
              'Drizzle olive oil over the vegetables.',
              'Squeeze fresh lemon juice on top of the salad.',
              'Toss the ingredients together to evenly coat the salad with the olive oil and lemon juice.',
              'Serve immediately and enjoy a fresh, healthy appetizer.',
            ],
            image: '../images/salad.png',
            type: 'Appetizer',
          },
          {
            title: 'Pasta',
            ingredient: 'Pasta, Tomato Sauce, Garlic, Olive Oil, Basil',
            direction: [
              'Boil a pot of water with a pinch of salt and cook the pasta according to the package instructions.',
              'While the pasta is cooking, heat olive oil in a pan over medium heat.',
              'Add minced garlic to the pan and sauté until fragrant (about 1-2 minutes).',
              'Pour in the tomato sauce and stir to combine with the garlic.',
              'Simmer the sauce for 5-7 minutes, stirring occasionally.',
              'Drain the pasta and add it to the pan with the tomato sauce.',
              'Stir the pasta in the sauce until evenly coated.',
              'Add fresh basil leaves to the pasta and give it a final stir.',
              'Serve the pasta hot with extra basil or grated cheese if desired.',
            ],
            image: '../images/pasta.png',
            type: 'Main Course',
          },
          {
            title: 'Chocolate Cake',
            ingredient:
              'Flour, Cocoa Powder, Sugar, Eggs, Butter, Chocolate Chips',
            direction: [
              'Preheat your oven to 350°F (175°C).',
              'Grease and flour a cake pan or line it with parchment paper.',
              'In a large mixing bowl, sift together the flour, cocoa powder, and sugar.',
              'In another bowl, whisk the eggs and melted butter together until smooth.',
              'Slowly add the wet ingredients to the dry ingredients and mix until well combined.',
              'Stir in the chocolate chips.',
              'Pour the batter into the prepared cake pan.',
              'Bake in the preheated oven for 25-30 minutes, or until a toothpick inserted into the center comes out clean.',
              'Let the cake cool in the pan for 10 minutes before transferring it to a wire rack to cool completely.',
              'Once cooled, frost or serve the cake plain.',
            ],
            image: '../images/chocolate_cake.png',
            type: 'Dessert',
          },
        ];

        const batch = firestore().batch();
        defaultRecipes.forEach(recipe => {
          const recipeRef = firestore()
            .collection('users')
            .doc(userId)
            .collection('recipes')
            .doc();
          batch.set(recipeRef, recipe);
        });

        await batch.commit();

        Alert.alert('User Created, Welcome!');
        navigation.navigate('LoginPage');
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Error', 'Failed to create user. Please try again.');
      });
  };

  return (
    <ImageBackground
      source={require('../images/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={styles.title1}>Sign Up</Text>

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
          style={[styles.input, {fontSize: 18, paddingVertical: 12}]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholderTextColor="#888"
        />

        <TextInput
          style={[styles.input, {fontSize: 18, paddingVertical: 12}]}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          placeholderTextColor="#888"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.greenButton} onPress={signUpUser}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    transform: [{scale: 1.1}],
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 40,
    marginTop: 20,
    paddingTop: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  title1: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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

  buttonContainer: {
    marginBottom: 20,
  },
  greenButton: {
    backgroundColor: '#25AE87',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AuthPage;
