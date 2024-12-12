import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import WheelPicker from '@quidone/react-native-wheel-picker'; // Import WheelPicker
import recipeTypes from '../data/recipetypes.json';
console.log(recipeTypes); // Ensure it logs the array

const AddRecipe = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [direction, setDirection] = useState('');
  const [image, setImage] = useState(null);
  const [selectedType, setSelectedType] = useState(recipeTypes[0].name); // Default to the first type

  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.error('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to select an image.');
      } else {
        const selectedImage = response.assets[0];

        const localPath =
          RNFS.DocumentDirectoryPath + '/' + selectedImage.fileName;

        try {
          await RNFS.copyFile(selectedImage.uri, localPath);
          setImage(localPath);
        } catch (error) {
          console.error('Error saving image locally: ', error);
          Alert.alert('Error', 'Failed to save the image locally.');
        }
      }
    });
  };

  const handleAddRecipe = async () => {
    if (!title || !ingredient || !direction || !image || !selectedType) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    const newRecipe = {
      title,
      ingredient,
      direction,
      image,
      type: selectedType,
    };

    try {
      const userId = auth().currentUser.uid;
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('recipes')
        .add(newRecipe);

      Alert.alert('Success', 'Recipe added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding recipe: ', error);
      Alert.alert('Error', 'Failed to add recipe. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter recipe title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Ingredients:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter ingredients"
        value={ingredient}
        onChangeText={setIngredient}
      />

      <Text style={styles.label}>Directions:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter directions"
        value={direction}
        onChangeText={setDirection}
      />

      <Text style={styles.label}>Recipe Type:</Text>
      <View style={styles.wheelPickerContainer}>
        <WheelPicker
          data={recipeTypes.map((type, index) => ({
            value: index,
            label: type.name,
          }))}
          value={recipeTypes.findIndex(type => type.name === selectedType)}
          onValueChanged={({item}) =>
            setSelectedType(recipeTypes[item.value].name)
          }
        />
      </View>

      <Text style={styles.label}>Image:</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
        <Text style={styles.imagePickerText}>
          {image ? 'Change Image' : 'Select Image'}
        </Text>
      </TouchableOpacity>
      {image && (
        <Image
          source={{uri: `file://${image}`}}
          style={styles.imagePreview}
          resizeMode="cover"
        />
      )}

      <Button title="Add Recipe" onPress={handleAddRecipe} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
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
  wheelPickerContainer: {
    height: 100, // Adjust as needed
    marginBottom: 100,
  },
  imagePicker: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default AddRecipe;
