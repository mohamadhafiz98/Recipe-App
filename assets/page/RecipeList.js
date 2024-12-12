import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const RecipeList = ({navigation}) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const currentUser = auth().currentUser;

        if (currentUser) {
          const userId = currentUser.uid; // Get the logged-in user's UID

          const recipesSnapshot = await firestore()
            .collection('users')
            .doc(userId)
            .collection('recipes')
            .get();

          const fetchedRecipes = recipesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setRecipes(fetchedRecipes);
        }
      } catch (error) {
        console.error('Error fetching recipes: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', {recipe: item})}>
      <Image source={{uri: item.image}} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeSubtitle}>
          {item.ingredient.substring(0, 30)}...
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  listContainer: {
    padding: 10,
  },
  recipeCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  recipeImage: {
    width: 100,
    height: 100,
  },
  recipeInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recipeSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecipeList;
