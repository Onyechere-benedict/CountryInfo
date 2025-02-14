import React, { useEffect, useState } from "react";
import {
	SafeAreaView,
	View,
	Text,
	StyleSheet,
	TextInput,
	FlatList,
	ActivityIndicator,
	Image,
	TouchableOpacity,
	Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

export default function CountryListScreen() {
	const [countries, setCountries] = useState([]);
	const [filteredCountries, setFilteredCountries] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [loading, setLoading] = useState(true);

	// Manage visibility for three modals:
	const [filterVisible, setFilterVisible] = useState(false);
	const [continentModalVisible, setContinentModalVisible] = useState(false);
	const [timeZoneModalVisible, setTimeZoneModalVisible] = useState(false);

	// Track selected continents and time zones
	const [selectedContinents, setSelectedContinents] = useState([]);
	const [selectedTimeZones, setSelectedTimeZones] = useState([]);

	const { theme, toggleTheme } = useTheme();
	const router = useRouter();

	// Fetch all countries on mount
	useEffect(() => {
		fetch("https://restcountries.com/v3.1/all")
			.then((response) => response.json())
			.then((data) => {
				// Sort countries alphabetically by common name
				const sorted = data.sort((a, b) =>
					a.name.common.localeCompare(b.name.common)
				);
				setCountries(sorted);
				setFilteredCountries(sorted);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching countries:", error);
				setLoading(false);
			});
	}, []);

	// Filter countries by search text
	useEffect(() => {
		if (!searchText) {
			setFilteredCountries(countries);
		} else {
			const lowerSearch = searchText.toLowerCase();
			const filtered = countries.filter((country) =>
				country.name.common.toLowerCase().includes(lowerSearch)
			);
			setFilteredCountries(filtered);
		}
	}, [searchText, countries]);

	// Loading spinner while data is fetched
	if (loading) {
		return (
			<SafeAreaView style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#000" />
			</SafeAreaView>
		);
	}

	// Render each country row
	const renderItem = ({ item }) => {
		const countryName = item?.name?.common || "Unknown";
		const flagUrl = item?.flags?.png;
		const capital = item?.capital?.[0] || "N/A";

		return (
			<TouchableOpacity
				style={styles.itemContainer}
				onPress={() =>
					router.push({
						pathname: "/CountryDetails",
						params: { country: encodeURIComponent(JSON.stringify(item)) },
					})
				}
			>
				{flagUrl && <Image source={{ uri: flagUrl }} style={styles.flag} />}
				<View style={styles.textContainer}>
					<Text style={styles.countryName}>{countryName}</Text>
					<Text style={styles.capital}>{capital}</Text>
				</View>
			</TouchableOpacity>
		);
	};

	// ====== CONTINENT LOGIC ======
	const CONTINENTS = [
		"Africa",
		"Antarctica",
		"Asia",
		"Australia",
		"Europe",
		"North America",
		"South America",
	];

	const toggleContinent = (continent) => {
		if (selectedContinents.includes(continent)) {
			// Remove it
			setSelectedContinents((prev) =>
				prev.filter((item) => item !== continent)
			);
		} else {
			// Add it
			setSelectedContinents((prev) => [...prev, continent]);
		}
	};

	const resetContinents = () => {
		setSelectedContinents([]);
	};

	// ====== TIME ZONE LOGIC ======
	const TIMEZONES = [
		"GMT+1:00",
		"GMT+2:00",
		"GMT+3:00",
		"GMT+4:00",
		"GMT+5:00",
		"GMT+6:00",
		"GMT+7:00",
		"GMT+8:00",
		"GMT+9:00",
		"GMT+10:00",
		"GMT+11:00",
		"GMT+12:00",
	];

	const toggleTimeZone = (tz) => {
		if (selectedTimeZones.includes(tz)) {
			setSelectedTimeZones((prev) => prev.filter((item) => item !== tz));
		} else {
			setSelectedTimeZones((prev) => [...prev, tz]);
		}
	};

	const resetTimeZones = () => {
		setSelectedTimeZones([]);
	};

	return (
		<SafeAreaView
			style={[
				styles.container,
				theme === "light" ? styles.lightBackground : styles.darkBackground,
			]}
		>
			{/* Header: Logo + Theme Toggle */}
			<View style={styles.header}>
				<Text style={styles.logo}>&explore.</Text>

				<TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
					<Ionicons
						name={theme === "light" ? "moon" : "sunny"}
						size={20}
						color={theme === "light" ? "#000" : "#fff"}
					/>
					<Text
						style={[
							styles.themeToggleText,
							theme === "light" ? styles.darkText : styles.lightText,
						]}
					>
						{theme === "light" ? "Dark" : "Light"} Mode
					</Text>
				</TouchableOpacity>
			</View>

			{/* Search & Filter Section */}
			<View style={styles.searchFilterContainer}>
				{/* Search Input */}
				<View style={styles.searchContainer}>
					<Ionicons name="search" size={16} color="#999" style={styles.searchIcon} />
					<TextInput
						style={styles.searchInput}
						placeholder="Search Country"
						placeholderTextColor="#999"
						value={searchText}
						onChangeText={setSearchText}
					/>
				</View>

				{/* Filter Button => Show first modal */}
				<TouchableOpacity
					style={styles.filterButton}
					onPress={() => setFilterVisible(true)}
				>
					<Ionicons name="filter" size={16} color="#000" />
					<Text style={styles.filterText}>Filter</Text>
				</TouchableOpacity>
			</View>

			{/* Country List */}
			<FlatList
				data={filteredCountries}
				keyExtractor={(item) => item.cca3}
				renderItem={renderItem}
				contentContainerStyle={styles.listContent}
			/>

			{/* ====== FILTER MODAL ====== */}
			<Modal
				visible={filterVisible}
				animationType="slide"
				transparent
				onRequestClose={() => setFilterVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						{/* Close Button */}
						<TouchableOpacity
							style={styles.closeButton}
							onPress={() => setFilterVisible(false)}
						>
							<Ionicons name="close" size={20} color="#000" />
						</TouchableOpacity>

						<Text style={styles.modalTitle}>Filter</Text>

						{/* Continent */}
						<TouchableOpacity
							style={styles.filterOption}
							onPress={() => {
								setFilterVisible(false);
								setContinentModalVisible(true);
							}}
						>
							<Text style={styles.filterOptionText}>Continent</Text>
							<Ionicons name="chevron-down" size={16} color="#000" />
						</TouchableOpacity>

						{/* Time Zone */}
						<TouchableOpacity
							style={styles.filterOption}
							onPress={() => {
								setFilterVisible(false);
								setTimeZoneModalVisible(true);
							}}
						>
							<Text style={styles.filterOptionText}>Time Zone</Text>
							<Ionicons name="chevron-down" size={16} color="#000" />
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			{/* ====== CONTINENT MODAL ====== */}
			<Modal
				visible={continentModalVisible}
				animationType="slide"
				transparent
				onRequestClose={() => setContinentModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						{/* Close Button */}
						<TouchableOpacity
							style={styles.closeButton}
							onPress={() => setContinentModalVisible(false)}
						>
							<Ionicons name="close" size={20} color="#000" />
						</TouchableOpacity>

						<Text style={styles.modalTitle}>Continent</Text>

						{/* List of continents with checkboxes */}
						{CONTINENTS.map((continent) => {
							const selected = selectedContinents.includes(continent);
							return (
								<TouchableOpacity
									key={continent}
									style={styles.filterOption}
									onPress={() => toggleContinent(continent)}
								>
									<Text style={styles.filterOptionText}>{continent}</Text>
									<Ionicons
										name={selected ? "checkbox" : "checkbox-outline"}
										size={20}
										color="#000"
									/>
								</TouchableOpacity>
							);
						})}

						{/* Footer Buttons */}
						<View style={styles.modalFooter}>
							<TouchableOpacity
								style={styles.resetButton}
								onPress={resetContinents}
							>
								<Text style={styles.resetText}>Reset</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.showResultsButton}
								onPress={() => {
									// Filter logic or just close the modal
									setContinentModalVisible(false);
								}}
							>
								<Text style={styles.showResultsText}>Show results</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* ====== TIME ZONE MODAL ====== */}
			<Modal
				visible={timeZoneModalVisible}
				animationType="slide"
				transparent
				onRequestClose={() => setTimeZoneModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						{/* Close Button */}
						<TouchableOpacity
							style={styles.closeButton}
							onPress={() => setTimeZoneModalVisible(false)}
						>
							<Ionicons name="close" size={20} color="#000" />
						</TouchableOpacity>

						<Text style={styles.modalTitle}>Time Zone</Text>

						{/* List of time zones with checkboxes */}
						{TIMEZONES.map((tz) => {
							const selected = selectedTimeZones.includes(tz);
							return (
								<TouchableOpacity
									key={tz}
									style={styles.filterOption}
									onPress={() => toggleTimeZone(tz)}
								>
									<Text style={styles.filterOptionText}>{tz}</Text>
									<Ionicons
										name={selected ? "checkbox" : "checkbox-outline"}
										size={20}
										color="#000"
									/>
								</TouchableOpacity>
							);
						})}

						{/* Footer Buttons */}
						<View style={styles.modalFooter}>
							<TouchableOpacity
								style={styles.resetButton}
								onPress={resetTimeZones}
							>
								<Text style={styles.resetText}>Reset</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.showResultsButton}
								onPress={() => {
									// Filter logic or just close the modal
									setTimeZoneModalVisible(false);
								}}
							>
								<Text style={styles.showResultsText}>Show results</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
}

// ====== Styles =======
const styles = StyleSheet.create({
	// Loading Spinner
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},

	// Main Container
	container: {
		flex: 1,
	},
	lightBackground: {
		backgroundColor: "#fff",
	},
	darkBackground: {
		backgroundColor: "#333",
	},

	// Header
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 12,
		justifyContent: "space-between",
	},
	logo: {
		fontSize: 24,
		fontWeight: "bold",
	},
	themeToggle: {
		flexDirection: "row",
		alignItems: "center",
	},
	themeToggleText: {
		marginLeft: 4,
		fontSize: 14,
	},
	darkText: {
		color: "#000",
	},
	lightText: {
		color: "#fff",
	},

	// Search & Filter
	searchFilterContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingBottom: 8,
	},
	searchContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "#F2F2F2",
		borderRadius: 8,
		alignItems: "center",
		paddingHorizontal: 8,
		marginRight: 8,
	},
	searchIcon: {
		marginRight: 4,
	},
	searchInput: {
		flex: 1,
		height: 40,
		fontSize: 14,
		color: "#000",
	},
	filterButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#E8E8E8",
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderRadius: 8,
	},
	filterText: {
		marginLeft: 4,
		fontSize: 14,
		color: "#000",
	},

	// List
	listContent: {
		paddingHorizontal: 16,
		paddingBottom: 16,
	},

	// Individual Item
	itemContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFF",
		marginVertical: 4,
		padding: 8,
		borderRadius: 8,
	},
	flag: {
		width: 40,
		height: 25,
		resizeMode: "cover",
		borderRadius: 3,
		marginRight: 10,
	},
	textContainer: {
		flex: 1,
	},
	countryName: {
		fontSize: 16,
		fontWeight: "600",
		color: "#000",
	},
	capital: {
		fontSize: 14,
		color: "#666",
	},

	// Modal (shared for Filter, Continent, TimeZone)
	modalContainer: {
		flex: 1,
		justifyContent: "flex-end",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		backgroundColor: "#fff",
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		padding: 16,
	},
	closeButton: {
		alignSelf: "flex-end",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 12,
	},
	filterOption: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 12,
		borderBottomColor: "#eee",
		borderBottomWidth: 1,
	},
	filterOptionText: {
		fontSize: 16,
		color: "#000",
	},

	// Footer for Continent & Time Zone modals
	modalFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 16,
	},
	resetButton: {
		backgroundColor: "#f2f2f2",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 8,
	},
	resetText: {
		fontSize: 14,
		color: "#000",
	},
	showResultsButton: {
		backgroundColor: "#ff7f32",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 8,
	},
	showResultsText: {
		fontSize: 14,
		color: "#fff",
	},
});
