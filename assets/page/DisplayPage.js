import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';

const DisplayPage = ({route, navigation}) => {
  const {userId} = route.params; // Get the userId passed from the login screen
  const [recipes, setRecipes] = useState([]);
  const [selectedType, setSelectedType] = useState(''); // Store selected type
  const types = [
    {id: 1, name: 'Appetizer'},
    {id: 2, name: 'Main Course'},
    {id: 3, name: 'Dessert'},
  ];

  const fetchRecipes = async () => {
    try {
      let query = firestore()
        .collection('users')
        .doc(userId)
        .collection('recipes');

      if (selectedType) {
        query = query.where('type', '==', selectedType);
      }

      const snapshot = await query.get();

      if (!snapshot.empty) {
        const recipeList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(recipeList);
      } else {
        setRecipes([]); // Clear recipes if no matches found
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      Alert.alert('Error', 'Failed to fetch recipes.');
    }
  };

  useEffect(() => {
    if (userId) {
      fetchRecipes(); // Fetch recipes when userId or selectedType changes
    }
  }, [userId, selectedType]); // Refetch recipes when selectedType changes

  // Use useFocusEffect to fetch recipes again when the page comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchRecipes(); // Fetch recipes when returning to this screen
    }, [selectedType]), // Refetch when selectedType changes
  );

  const renderRecipe = ({item}) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', {recipe: item})} // Navigate to RecipeDetail screen with the recipe data
    >
      <View style={styles.recipeContent}>
        {/* Display image on the left if it exists */}
        {item.image && (
          <Image
            source={{uri: `file://${item.image}`}} // Correctly handle local image paths
            style={styles.recipeImage}
          />
        )}
        <View style={styles.recipeTextContainer}>
          <Text style={styles.recipeTitle}>{item.title}</Text>
          <Text>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Your Recipes</Text>

      {/* Filter Buttons for Recipe Type */}
      <View style={styles.buttonContainer}>
        {types.map(type => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.filterButton,
              selectedType === type.name && styles.selectedButton, // Highlight selected button
            ]}
            onPress={() => setSelectedType(type.name)} // Set selected type
          >
            <Text style={styles.filterButtonText}>{type.name}</Text>
          </TouchableOpacity>
        ))}
        {/* Button to show all recipes */}
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedType === '' && styles.selectedButton,
          ]} // Highlight when "All Recipes" is selected
          onPress={() => setSelectedType('')} // Clear type filter to show all
        >
          <Text style={styles.filterButtonText}>All Recipes</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={item => item.id}
      />

      {/* Add Recipe Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddRecipe', {userId})}>
        <Text style={styles.addButtonText}>Add Recipe</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  recipeContent: {
    flexDirection: 'row', // Align image and text horizontally
    alignItems: 'center', // Vertically align the content in the center
  },
  recipeImage: {
    width: 80, // Set a fixed width for the image
    height: 80, // Set a fixed height for the image
    borderRadius: 5, // Optional: to round corners of the image
    marginRight: 15, // Space between the image and text
  },
  recipeTextContainer: {
    flex: 1, // Take up remaining space
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  filterButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#28a745', // Green color when selected
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DisplayPage;
