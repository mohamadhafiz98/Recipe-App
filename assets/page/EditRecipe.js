import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import WheelPicker from '@quidone/react-native-wheel-picker';
import recipeTypes from '../data/recipetypes.json';

const EditRecipe = ({route, navigation}) => {
  const {recipeId, recipe} = route.params;
  const [ingredientHeight, setIngredientHeight] = useState(90); // Minimum height
  const [directionHeight, setDirectionHeight] = useState(90);
  const [title, setTitle] = useState(recipe.title);
  const [ingredient, setIngredient] = useState(recipe.ingredient);
  const [direction, setDirection] = useState(recipe.direction);
  const [image, setImage] = useState(recipe.image);
  const [selectedType, setSelectedType] = useState(
    recipe.type || recipeTypes[0]?.name,
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
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
          <View style={styles.container}>
            <Text style={styles.label}>Title:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter recipe title"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Ingredients:</Text>
            <TextInput
              style={[styles.input, {height: Math.max(40, ingredientHeight)}]}
              placeholder="Enter ingredients"
              value={ingredient}
              onChangeText={setIngredient}
              multiline={true}
              onContentSizeChange={event =>
                setIngredientHeight(event.nativeEvent.contentSize.height)
              }
            />

            <Text style={styles.label}>Directions:</Text>
            <TextInput
              style={[styles.input, {height: Math.max(40, directionHeight)}]}
              placeholder="Enter directions"
              value={direction}
              onChangeText={setDirection}
              multiline={true}
              onContentSizeChange={event =>
                setDirectionHeight(event.nativeEvent.contentSize.height)
              }
            />

            <Text style={styles.label}>Recipe Type:</Text>
            <View style={styles.wheelPickerContainer}>
              {recipeTypes && recipeTypes.length > 0 ? (
                <WheelPicker
                  data={recipeTypes.map((type, index) => ({
                    value: index,
                    label: type.name,
                  }))}
                  value={recipeTypes.findIndex(
                    type => type.name === selectedType,
                  )}
                  onValueChanged={({item}) =>
                    setSelectedType(
                      recipeTypes[item.value]?.name || 'Default Type',
                    )
                  }
                />
              ) : (
                <Text style={styles.label}>No recipe types available.</Text>
              )}
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
                resizeMode="contain"
              />
            )}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleUpdateRecipe}>
              <Text style={styles.submitButtonText}>Update Recipe</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    //paddingTop: 60,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
    textAlignVertical: 'top', // Ensures text starts at the top
  },
  wheelPickerContainer: {
    height: 120,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePicker: {
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 8,
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
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#25AE87',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditRecipe;
