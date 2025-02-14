import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { ThemeContext } from "./index";
import { useLocalSearchParams } from "expo-router";

const CountryDetailsScreen = () => {
	const { countryFromRoute } = useLocalSearchParams();
	const country = JSON.parse(decodeURIComponent(countryFromRoute as string));

	// const { country } = route.params;
	const { isDarkTheme } = useContext(ThemeContext);

	return (
		<ScrollView style={[styles.container, isDarkTheme && { backgroundColor: "#333" }]}>
			<Text style={[styles.name, isDarkTheme && { color: "white" }]}>{country.name.common}</Text>

			{country.flags && country.flags.png && <Image source={{ uri: country.flags.png }} style={styles.flag} />}

			<Text style={[styles.label, isDarkTheme && { color: "white" }]}>Capital:</Text>
			<Text style={[styles.info, isDarkTheme && { color: "white" }]}>{country.capital ? country.capital[0] : "N/A"}</Text>

			<Text style={[styles.label, isDarkTheme && { color: "white" }]}>Population:</Text>
			<Text style={[styles.info, isDarkTheme && { color: "white" }]}>{country.population.toLocaleString()}</Text>

			<Text style={[styles.label, isDarkTheme && { color: "white" }]}>Continent:</Text>
			<Text style={[styles.info, isDarkTheme && { color: "white" }]}>{country.continents ? country.continents.join(", ") : "N/A"}</Text>

			<Text style={[styles.label, isDarkTheme && { color: "white" }]}>Country Code:</Text>
			<Text style={[styles.info, isDarkTheme && { color: "white" }]}>{country.cca2}</Text>

			{/* Additional details such as states/provinces, current president can be added if available from the API */}
		</ScrollView>
	);
};

export default CountryDetailsScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 15,
	},
	name: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 15,
	},
	flag: {
		width: "100%",
		height: 200,
		resizeMode: "contain",
		marginBottom: 15,
	},
	label: {
		fontSize: 16,
		fontWeight: "bold",
		marginTop: 10,
	},
	info: {
		fontSize: 16,
		marginBottom: 10,
	},
});
