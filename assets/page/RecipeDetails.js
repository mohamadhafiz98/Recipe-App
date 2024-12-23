import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const RecipeDetail = ({route}) => {
  const {recipe} = route.params || {}; // Safely access the recipe

  // Return an early exit if the recipe doesn't exist
  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No recipe data found.</Text>
      </SafeAreaView>
    );
  }

  const navigation = useNavigation();

  const handleEditRecipe = () => {
    navigation.navigate('EditRecipe', {recipeId: recipe.id, recipe});
  };

  const handleDeleteRecipe = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this recipe?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const currentUser = auth().currentUser;
              if (!currentUser) {
                Alert.alert(
                  'Error',
                  'You must be logged in to delete a recipe.',
                );
                return;
              }

              const userId = currentUser.uid;
              await firestore()
                .collection('users')
                .doc(userId)
                .collection('recipes')
                .doc(recipe.id)
                .delete();

              Alert.alert('Success', 'Recipe deleted successfully!');
              navigation.navigate('DisplayPage');
            } catch (error) {
              console.error('Error deleting recipe: ', error);
              Alert.alert(
                'Error',
                'Failed to delete recipe. Please try again.',
              );
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {recipe.image && (
        <ImageBackground
          source={{uri: `file://${recipe.image}`}}
          style={styles.imageBackground}
        />
      )}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.scrollInner}>
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.categoryText}>Category: {recipe.type}</Text>
          <Text style={styles.label}>Ingredients:</Text>
          <Text style={styles.contentText}>{recipe.ingredient}</Text>
          <Text style={styles.label}>Directions:</Text>
          <Text style={styles.contentText}>{recipe.direction}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditRecipe}>
            <Text style={styles.buttonText}>Edit Recipe</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteRecipe}>
            <Text style={styles.buttonText}>Delete Recipe</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageBackground: {
    width: '100%',
    height: 250,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  scrollContent: {
    paddingTop: 220, // To prevent content overlap with the image
  },
  scrollInner: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 10,
    color: '#555',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  contentText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecipeDetail;
