import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const RecipeDetail = ({route}) => {
  const {recipe} = route.params; // Get the recipe passed from DisplayPage
  const navigation = useNavigation(); // Initialize the navigation hook

  const handleEditRecipe = () => {
    navigation.navigate('EditRecipe', {recipeId: recipe.id, recipe});
  };

  const handleDeleteRecipe = async () => {
    // Show a confirmation alert before deleting
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
              const userId = auth().currentUser.uid; // Get the current logged-in userId

              // Delete the recipe document from Firestore using the recipeId
              await firestore()
                .collection('users')
                .doc(userId) // Use the current user's ID
                .collection('recipes')
                .doc(recipe.id) // Use the correct document ID here
                .delete();

              Alert.alert('Success', 'Recipe deleted successfully!');
              navigation.goBack(); // Navigate back to the previous screen after deleting
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>

      {/* Display Category */}
      <Text style={styles.categoryText}>
        Category: {recipe.type}
        {/* Ensure the recipe has a category field */}
      </Text>

      {recipe.image && (
        <Image source={{uri: `file://${recipe.image}`}} style={styles.image} />
      )}
      <Text style={styles.label}>Ingredients:</Text>
      <Text>{recipe.ingredient}</Text>
      <Text style={styles.label}>Directions:</Text>
      <Text>{recipe.direction}</Text>

      <TouchableOpacity style={styles.editButton} onPress={handleEditRecipe}>
        <Text style={styles.editButtonText}>Edit Recipe</Text>
      </TouchableOpacity>

      {/* Delete button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteRecipe}>
        <Text style={styles.deleteButtonText}>Delete Recipe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: '#dc3545', // Red color for delete
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default RecipeDetail;
