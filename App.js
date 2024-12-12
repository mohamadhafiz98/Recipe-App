import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import RecipeList from './assets/page/RecipeList'; // Import RecipeList screen
import RecipeDetail from './assets/page/RecipeDetails'; // Import RecipeDetail screen
import AddRecipe from './assets/page/AddRecipe';
import AuthPage from './assets/page/AuthPage'; // Import AuthPage
import LoginPage from './assets/page/LoginPage';
import DisplayPage from './assets/page/DisplayPage';
import EditRecipe from './assets/page/EditRecipe';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="AuthPage" component={AuthPage} />
        <Stack.Screen name="DisplayPage" component={DisplayPage} />
        <Stack.Screen name="AddRecipe" component={AddRecipe} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetail} />
        <Stack.Screen name="EditRecipe" component={EditRecipe} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
