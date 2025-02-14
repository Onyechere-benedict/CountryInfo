import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSearchParams, useRouter } from "expo-router";

export default function CountryDetailsScreen() {
    const router = useRouter();
    // Grab the "country" param from the previous screen
    const { country } = useSearchParams();

    // Parse the JSON string into an object
    const parsedCountry = country ? JSON.parse(country) : {};

    // Extract data from the parsed country object
    const countryName = parsedCountry?.name?.common || "N/A";
    const flagUrl = parsedCountry?.flags?.png || null; // for reference
    const population = parsedCountry?.population?.toLocaleString() || "N/A";
    const region = parsedCountry?.region || "N/A";
    const capital = parsedCountry?.capital?.[0] || "N/A";
    const timeZone = parsedCountry?.timezones?.[0] || "N/A";
    const area = parsedCountry?.area
        ? `${parsedCountry.area.toLocaleString()} km²`
        : "N/A";

    // Combine all languages into a comma-separated string
    const languages = parsedCountry?.languages
        ? Object.values(parsedCountry.languages).join(", ")
        : "N/A";

    // Combine calling code (IDD root + suffix)
    const callingCode =
        parsedCountry?.idd?.root && parsedCountry?.idd?.suffixes
            ? parsedCountry.idd.root + parsedCountry.idd.suffixes[0]
            : "N/A";

    // Combine currency codes/names
    // (If multiple currencies exist, join them)
    let currency = "N/A";
    if (parsedCountry?.currencies) {
        const currencyArray = Object.keys(parsedCountry.currencies).map(
            (code) => code
        );
        currency = currencyArray.join(", ");
    }

    // Placeholder fields (because REST Countries doesn’t provide them):
    const motto = "Virtus unita fortior";
    const officialLanguages = languages; // from above
    const ethnicGroup = "Andorran, Spanish, Portuguese"; // placeholder
    const religion = "Christianity"; // placeholder
    const government = "Parliamentary democracy"; // placeholder
    const independence = "8th September, 1278"; // placeholder
    const dateFormat = "dd/mm/yyyy"; // placeholder
    const gdp = "US$3.4 billion"; // placeholder
    const drivingSide = "Right"; // placeholder

    return (
        <View style={styles.container}>
            {/* Top bar with a back button (if you want a manual back button) */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{countryName}</Text>
                <View style={{ width: 24 }} /> {/* Placeholder to center title */}
            </View>

            <ScrollView style={styles.scrollContainer}>
                {/* Country Map Placeholder */}
                <Image
                    style={styles.mapImage}
                    source={{
                        uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Andorra_topographic_map-fr.svg/640px-Andorra_topographic_map-fr.svg.png",
                    }}
                // If you don't have a map image, you can use the country's flag or omit this entirely
                />

                {/* Basic Info */}
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Population: </Text>
                    {population}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Region: </Text>
                    {region}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Capital: </Text>
                    {capital}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Motto: </Text>
                    {motto}
                </Text>

                {/* Additional Info */}
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Official language: </Text>
                    {officialLanguages}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Ethnic group: </Text>
                    {ethnicGroup}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Religion: </Text>
                    {religion}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Government: </Text>
                    {government}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Independence: </Text>
                    {independence}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Area: </Text>
                    {area}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Date format: </Text>
                    {dateFormat}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Currency: </Text>
                    {currency}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>GDP: </Text>
                    {gdp}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Time zone: </Text>
                    {timeZone}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Driving code: </Text>
                    {callingCode}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Driving side: </Text>
                    {drivingSide}
                </Text>
            </ScrollView>
        </View>
    );
}

// ===================== Styles =====================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: "space-between",
        backgroundColor: "#fff",
        elevation: 2, // subtle shadow on Android
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
    },
    scrollContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    mapImage: {
        width: "100%",
        height: 200,
        resizeMode: "contain",
        marginBottom: 16,
    },
    infoText: {
        fontSize: 16,
        color: "#333",
        marginBottom: 8,
        lineHeight: 22,
    },
    label: {
        fontWeight: "bold",
        color: "#000",
    },
});
