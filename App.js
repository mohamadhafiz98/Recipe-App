import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import RecipeDetail from './assets/page/RecipeDetails';
import AddRecipe from './assets/page/AddRecipe';
import AuthPage from './assets/page/AuthPage';
import LoginPage from './assets/page/LoginPage';
import DisplayPage from './assets/page/DisplayPage';
import EditRecipe from './assets/page/EditRecipe';
import {TouchableOpacity, Text} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {LinearGradient} from 'react-native-linear-gradient'; // Correct import

const Stack = createStackNavigator();

const App = () => {
  const handleLogout = navigation => {
    // Reset the navigation stack and navigate to LoginPage
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'LoginPage'}],
      }),
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{headerShown: true, title: 'Login'}}
        />
        <Stack.Screen
          name="AuthPage"
          component={AuthPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DisplayPage"
          component={DisplayPage}
          options={({navigation}) => ({
            headerTransparent: true,
            title: 'My Recipe',
            headerTitleAlign: 'center', // Center the title
            headerBackground: () => (
              <LinearGradient
                colors={['rgb(255, 255, 255)', 'rgb(255, 255, 255)']} // Gradient effect from opaque to transparent
                style={{flex: 1}}
              />
            ),
            headerRight: () => (
              <TouchableOpacity onPress={() => handleLogout(navigation)}>
                <Text style={{color: 'red', marginRight: 10}}>Logout</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="AddRecipe"
          component={AddRecipe}
          options={{
            headerTransparent: false,
            title: 'Add recipe',
          }}
        />
        <Stack.Screen
          name="RecipeDetail"
          component={RecipeDetail}
          options={{
            headerTransparent: false,
            title: 'Recipe detail',
          }}
        />
        <Stack.Screen
          name="EditRecipe"
          component={EditRecipe}
          options={{
            title: 'Edit recipe',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
