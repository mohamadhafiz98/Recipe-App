import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView, // Import ScrollView
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';

const DisplayPage = ({route, navigation}) => {
  const {userId} = route.params; // Get the userId passed from the login screen
  const [recipes, setRecipes] = useState([]);
  const [selectedType, setSelectedType] = useState('All Recipes'); // Default to 'All Recipes'

  const types = [
    {id: 0, name: 'All Recipes', icon: require('../images/allrecipes.png')},
    {id: 1, name: 'Appetizer', icon: require('../images/appetizer.png')},
    {id: 2, name: 'Main Course', icon: require('../images/maincourse.png')},
    {id: 3, name: 'Dessert', icon: require('../images/dessert.png')},
  ];

  const softPaletteColors = [
    '#FFEBEE', // Light red
    '#FFF3E0', // Light orange
    '#E8F5E9', // Light green
    '#E3F2FD', // Light blue
    '#F3E5F5', // Light purple
  ];

  const fetchRecipes = async () => {
    try {
      let query = firestore()
        .collection('users')
        .doc(userId)
        .collection('recipes');

      // If "All Recipes" is selected, don't filter by type
      if (selectedType && selectedType !== 'All Recipes') {
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
  }, [userId, selectedType]);

  useFocusEffect(
    React.useCallback(() => {
      fetchRecipes();
    }, [selectedType]),
  );

  // Default image path
  const defaultImage = require('../images/default.png');

  const renderRecipe = ({item, index}) => (
    <TouchableOpacity
      style={[
        styles.recipeCard,
        {backgroundColor: softPaletteColors[index % softPaletteColors.length]},
      ]}
      onPress={() => navigation.navigate('RecipeDetail', {recipe: item})}>
      <View style={styles.recipeContent}>
        <Image
          source={item.image ? {uri: `file://${item.image}`} : defaultImage} // Correct file URI
          style={styles.recipeImage}
        />
        <View style={styles.recipeTextContainer}>
          <Text style={styles.recipeTitle}>{item.title}</Text>
          {/* Display the category (type) below the title */}
          <Text style={styles.recipeCategory}>{item.type}</Text>
          <Text>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.circleBackground}></View>
      <Text style={styles.pageTitle2}>Got a tasty dish</Text>
      <Text style={styles.pageTitle2}>in mind?</Text>
      <Text style={styles.pageTitle}>Categories</Text>
      <View style={styles.buttonContainer}>
        {/* Scrollable categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {types.map(type => (
            <TouchableOpacity
              key={type.id}
              style={styles.filterButton}
              onPress={() => setSelectedType(type.name)}>
              <Image source={type.icon} style={styles.typeIcon} />
              <Text
                style={[
                  styles.filterButtonText,
                  {color: selectedType === type.name ? '#25AE87' : '#7d7d7d'},
                ]}>
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddRecipe', {userId})}>
        <Text style={styles.addButtonText}>Add Recipe</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    marginTop: 50,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 30,
  },
  pageTitle2: {
    fontSize: 24,
    textAlign: 'left',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  typeIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    borderWidth: 0,
    borderColor: '#ddd',
  },
  recipeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  recipeTextContainer: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recipeCategory: {
    fontSize: 14,
    color: '#7d7d7d',
    marginVertical: 5,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  filterButton: {
    alignItems: 'center',
    marginBottom: 10,
    width: 80, // Adjust width to make buttons visually appealing in horizontal layout
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#25AE87',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 50,
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
