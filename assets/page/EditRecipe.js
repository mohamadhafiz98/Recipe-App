import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import WheelPicker from '@quidone/react-native-wheel-picker';
import recipeTypes from '../data/recipetypes.json';

const EditRecipe = ({route, navigation}) => {
  const {recipeId, recipe} = route.params;

  const [title, setTitle] = useState(recipe.title);
  const [ingredient, setIngredient] = useState(recipe.ingredient);
  const [direction, setDirection] = useState(recipe.direction);
  const [image, setImage] = useState(recipe.image);
  const [selectedType, setSelectedType] = useState(
    recipe.type || recipeTypes[0].name,
  );

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

  const handleUpdateRecipe = async () => {
    if (!title || !ingredient || !direction || !selectedType) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    try {
      const userId = auth().currentUser.uid;

      await firestore()
        .collection('users')
        .doc(userId)
        .collection('recipes')
        .doc(recipeId)
        .update({
          title,
          ingredient,
          direction,
          image,
          type: selectedType,
        });

      Alert.alert('Success', 'Recipe updated successfully!');
      navigation.navigate('RecipeDetail', {
        recipe: {
          id: recipeId,
          title,
          ingredient,
          direction,
          image,
          type: selectedType,
        },
      });
    } catch (error) {
      console.error('Error updating recipe: ', error);
      Alert.alert('Error', 'Failed to update recipe. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Title:</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Ingredients:</Text>
        <TextInput
          style={styles.input}
          value={ingredient}
          onChangeText={setIngredient}
        />

        <Text style={styles.label}>Directions:</Text>
        <TextInput
          style={styles.input}
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

        <Button title="Update Recipe" onPress={handleUpdateRecipe} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  container: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  wheelPickerContainer: {
    height: 100,
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

export default EditRecipe;
