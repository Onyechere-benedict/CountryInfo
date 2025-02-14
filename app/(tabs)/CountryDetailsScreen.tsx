import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

const CountryDetailsScreen = () => {
	const { countryFromRoute } = useLocalSearchParams();
	const country = JSON.parse(decodeURIComponent(countryFromRoute as string));

	// const { country } = route.params;

	return (
		<ScrollView style={[styles.container && { backgroundColor: "#333" }]}>
			<Text style={[styles.name && { color: "white" }]}>{country.name.common}</Text>

			{country.flags && country.flags.png && <Image source={{ uri: country.flags.png }} style={styles.flag} />}

			<Text style={[styles.label && { color: "white" }]}>Capital:</Text>
			<Text style={[styles.info && { color: "white" }]}>{country.capital ? country.capital[0] : "N/A"}</Text>

			<Text style={[styles.label && { color: "white" }]}>Population:</Text>
			<Text style={[styles.info && { color: "white" }]}>{country.population.toLocaleString()}</Text>

			<Text style={[styles.label && { color: "white" }]}>Continent:</Text>
			<Text style={[styles.info && { color: "white" }]}>{country.continents ? country.continents.join(", ") : "N/A"}</Text>

			<Text style={[styles.label && { color: "white" }]}>Country Code:</Text>
			<Text style={[styles.info && { color: "white" }]}>{country.cca2}</Text>

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
