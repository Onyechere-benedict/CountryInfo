import React, { useState, createContext } from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CountryListScreen from "./CountryListScreen";
import CountryDetailsScreen from "./CountryDetailsScreen";

export const ThemeContext = createContext();

const Stack = createStackNavigator();

export default function App() {
	const [isDarkTheme, setIsDarkTheme] = useState(false);

	const toggleTheme = () => {
		setIsDarkTheme((prev) => !prev);
	};

	return (
		<ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
			<NavigationContainer theme={isDarkTheme ? DarkTheme : DefaultTheme}>
				<Stack.Navigator>
					<Stack.Screen name="CountryList" component={CountryListScreen} options={{ title: "Countries" }} />
					<Stack.Screen name="CountryDetails" component={CountryDetailsScreen} options={{ title: "Country Details" }} />
				</Stack.Navigator>
			</NavigationContainer>
		</ThemeContext.Provider>
	);
}
