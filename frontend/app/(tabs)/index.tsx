import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, TextInput, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { API_URL } from '../../constants/config';
import ProductCard from '../../components/ProductCard';
import { theme } from '../../constants/theme';
import { Product } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const categories = ['All', 'Electronics', 'Books', 'Clothing', 'Home Goods'];

const ListHeaderComponent = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, user }: any) => {
    const { width } = useWindowDimensions();
    const headerHeight = 130;

    return (
        <>
            <View style={[styles.wavyHeaderWrapper, { height: headerHeight }]}>
                <Svg height={headerHeight} width={width} style={StyleSheet.absoluteFill}>
                    <Defs>
                        <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <Stop offset="0%" stopColor="#4c0a2a" />
                            <Stop offset="100%" stopColor="#2c003e" />
                        </LinearGradient>
                    </Defs>
                    <Path
                        d={`M0,0 L0,${headerHeight * 0.7} C${width * 0.25},${headerHeight * 1.1} ${width * 0.75},${headerHeight * 0.3} ${width},${headerHeight * 0.7} L${width},0 Z`}
                        fill="url(#grad)"
                    />
                </Svg>
                <View style={styles.headerContentContainer}>
                    {/* The Image component has been replaced with a title and icon */}
                    <View style={styles.headerTitleContainer}>
                        <Ionicons name="home-outline" size={28} color="white" style={{ marginRight: 10 }} />
                        <Text style={styles.headerTitle}>Home</Text>
                    </View>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={theme.colors.muted} style={styles.searchIcon} />
                <TextInput
                    placeholder="Search for products..."
                    placeholderTextColor={theme.colors.muted}
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <View>
                <Text style={styles.filterTitle}>Categories</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.filterButton,
                                selectedCategory === category && styles.filterButtonActive
                            ]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    selectedCategory === category && styles.filterTextActive
                                ]}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>
    );
};


export default function HomeScreen() {
    const [products, setProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedCategory, setSelectedCategory] = React.useState('All');
    const [searchQuery, setSearchQuery] = React.useState('');
    const { user } = useAuth();

    React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/products`);
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(p => selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase());

    if (loading) {
        return <ActivityIndicator size="large" style={styles.loader} />;
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <FlatList
                ListHeaderComponent={<ListHeaderComponent 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    user={user}
                />}
                data={filteredProducts}
                renderItem={({ item }) => <ProductCard product={item} />}
                keyExtractor={(item) => item._id}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<Text style={styles.emptyText}>No products found.</Text>}
                keyboardShouldPersistTaps="handled"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    wavyHeaderWrapper: {
        // This style was missing and has been re-added.
        marginHorizontal: -theme.spacing.m,
    },
    headerContentContainer: {
        flex: 1, // Changed to flex: 1 to use available space
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.l,
        paddingBottom: 15,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'left',
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'white',
        textAlign: 'left',
        marginTop: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginHorizontal: theme.spacing.l,
        marginTop: -10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: theme.colors.text,
        paddingVertical: 10,
        fontSize: 16,
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        margin: theme.spacing.l,
        marginBottom: theme.spacing.m,
    },
    filterContainer: {
        paddingHorizontal: theme.spacing.l,
    },
    filterButton: {
        backgroundColor: theme.colors.gray,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginRight: 10,
    },
    filterButtonActive: {
        backgroundColor: theme.colors.primary,
    },
    filterText: {
        color: theme.colors.text,
        fontWeight: '600',
    },
    filterTextActive: {
        color: 'white',
    },
    listContainer: {
        paddingHorizontal: theme.spacing.m,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: theme.colors.muted,
    }
});

