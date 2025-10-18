import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Product } from '../types';
import { theme } from '../constants/theme';

interface ProductCardProps {
  product: Product;
}

// Get the screen width to calculate item size
const { width } = Dimensions.get('window');
// Calculate the size for each card to fit 2 columns with margin
const cardWidth = width / 2 - (theme.spacing.m + theme.spacing.s);

const ProductCard = ({ product }: ProductCardProps) => {
    const router = useRouter();

    const handlePress = () => {
        router.push(`/product/${product._id}`);
    };

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={handlePress}>
            <Image source={{ uri: product.image_url }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={2}>{product.name}</Text>
                <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: cardWidth, // Use a fixed calculated width instead of flex: 1
        margin: theme.spacing.s,
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.m,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        aspectRatio: 1,
    },
    infoContainer: {
        padding: theme.spacing.m,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        minHeight: 34,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginTop: 4,
    },
});

export default ProductCard;

