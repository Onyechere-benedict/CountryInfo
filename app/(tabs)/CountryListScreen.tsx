import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Button } from "react-native";
import { ThemeContext } from "./App";
import { useRouter } from "expo-router";

const CountryListScreen = () => {
	const [countries, setCountries] = useState<Country[]>([]);
	const [loading, setLoading] = useState(true);
	const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

	const router = useRouter();

	interface Country {
		name: {
			common: string;
		};
		cca3: string;
	}

	useEffect(() => {
		fetch("https://restcountries.com/v3.1/all")
			.then((response) => response.json())
			.then((data: Country[]) => {
				// Sort countries alphabetically by common name
				const sorted = data.sort((a, b) => {
					const nameA = a.name.common.toUpperCase();
					const nameB = b.name.common.toUpperCase();
					return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
				});
				setCountries(sorted);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching countries:", error);
				setLoading(false);
			});
	}, []);

	if (loading) {
		return <ActivityIndicator style={{ flex: 1 }} size="large" />;
	}

	const renderItem = ({ item }: { item: Country }) => (
		// <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("CountryDetails", { country: item })}>
		// 	<Text style={[styles.title, isDarkTheme && { color: "white" }]}>{item.name.common}</Text>
		// </TouchableOpacity>
		<TouchableOpacity
			style={styles.item}
			onPress={() => router.push({ pathname: "/CountryDetails", params: { country: encodeURIComponent(JSON.stringify(item)) } })}
		>
			<Text style={[styles.title, isDarkTheme && { color: "white" }]}>{item.name.common}</Text>
		</TouchableOpacity>
	);

	return (
		<View style={[styles.container, isDarkTheme && { backgroundColor: "#333" }]}>
			<Button title={isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"} onPress={toggleTheme} />
			<FlatList data={countries} keyExtractor={(item) => item.cca3} renderItem={renderItem} />
		</View>
	);
};

export default CountryListScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
	},
	item: {
		padding: 15,
		marginVertical: 8,
		backgroundColor: "#ddd",
		borderRadius: 5,
	},
	title: {
		fontSize: 18,
	},
});
