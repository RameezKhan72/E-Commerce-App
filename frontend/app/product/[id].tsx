import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { API_URL } from '../../constants/config';
import { theme } from '../../constants/theme';
import { Product, Review } from '../../types';
import CustomButton from '../../components/CustomButton';
import WavyHeader from '../../components/WavyHeader';

// Reusable Star rating component
const StarRating = ({ rating }: { rating: number }) => (
    <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
                key={star}
                name={rating >= star ? 'star' : rating >= star - 0.5 ? 'star-half' : 'star-outline'}
                size={18}
                color="#FFC107"
            />
        ))}
    </View>
);

export default function ProductDetailsScreen() {
    const { id } = useLocalSearchParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [myRating, setMyRating] = useState(0);
    const [myComment, setMyComment] = useState('');
    const { addToCart } = useCart();
    const { token } = useAuth();

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error("Failed to fetch product:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            Alert.alert('Success', `${product.name} has been added to your cart.`);
        }
    };
    
    const submitReview = async () => {
        if (myRating === 0 || !myComment) {
            return Alert.alert('Incomplete', 'Please provide a rating and a comment.');
        }
        try {
            await axios.post(`${API_URL}/products/${id}/reviews`, 
                { rating: myRating, comment: myComment },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setReviewModalVisible(false);
            setMyRating(0);
            setMyComment('');
            fetchProduct(); // Refresh product data to show new review
            Alert.alert('Success', 'Your review has been submitted!');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to submit review.';
            Alert.alert('Error', message);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    if (!product) {
        return <View style={styles.container}><Text>Product not found.</Text></View>;
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            <WavyHeader>
                <View style={styles.headerContentContainer}>
                    <View style={styles.headerTitleContainer}>
                        <Ionicons name="cube-outline" size={28} color="white" style={{ marginRight: 10 }} />
                        <Text style={styles.headerTitle}>Product Details</Text>
                    </View>
                </View>
            </WavyHeader>

            <ScrollView>
                <Image source={{ uri: product.image_url }} style={styles.image} />
                <View style={styles.detailsContainer}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <View style={styles.ratingContainer}>
                        <StarRating rating={product.rating || 0} />
                        <Text style={styles.reviewCount}>({product.numReviews || 0} reviews)</Text>
                    </View>
                    <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    <Text style={styles.description}>{product.description}</Text>
                </View>

                <View style={styles.reviewsSection}>
                    <Text style={styles.sectionTitle}>Customer Reviews</Text>
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((review: Review) => (
                            <View key={review._id} style={styles.reviewCard}>
                                <Text style={styles.reviewName}>{review.name}</Text>
                                <StarRating rating={review.rating} />
                                <Text style={styles.reviewComment}>{review.comment}</Text>
                                <Text style={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noReviewsText}>No reviews yet. Be the first to write one!</Text>
                    )}
                    <CustomButton title="Write a Review" onPress={() => setReviewModalVisible(true)} style={{ marginTop: 20 }} />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton title="Add to Cart" onPress={handleAddToCart} />
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={reviewModalVisible}
                onRequestClose={() => setReviewModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>What's your rating?</Text>
                        <View style={styles.modalStarContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setMyRating(star)}>
                                    <Ionicons name={myRating >= star ? 'star' : 'star-outline'} size={40} color="#FFC107" />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TextInput
                            style={styles.reviewInput}
                            placeholder="Share your thoughts..."
                            multiline
                            value={myComment}
                            onChangeText={setMyComment}
                        />
                        <CustomButton title="Submit Review" onPress={submitReview} />
                        <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    headerContentContainer: { width: '100%', paddingHorizontal: theme.spacing.l, justifyContent: 'center', flex: 1 },
    headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'left' },
    image: { width: '100%', height: 300 },
    detailsContainer: { padding: theme.spacing.l },
    productName: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.s },
    ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.m },
    starContainer: { flexDirection: 'row' },
    reviewCount: { marginLeft: theme.spacing.s, color: theme.colors.muted },
    price: { fontSize: 22, fontWeight: 'bold', color: theme.colors.primary, marginBottom: theme.spacing.m },
    description: { fontSize: 16, color: theme.colors.text, lineHeight: 24 },
    footer: { padding: theme.spacing.m, paddingBottom: 45, borderTopWidth: 1, borderTopColor: theme.colors.gray, backgroundColor: theme.colors.white },
    reviewsSection: { padding: theme.spacing.l, borderTopWidth: 1, borderTopColor: theme.colors.gray },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: theme.spacing.m },
    reviewCard: { backgroundColor: '#f9f9f9', padding: theme.spacing.m, borderRadius: theme.borderRadius.m, marginBottom: theme.spacing.m },
    reviewName: { fontWeight: 'bold', marginBottom: 4 },
    reviewComment: { marginTop: 4, color: theme.colors.text },
    reviewDate: { fontSize: 12, color: theme.colors.muted, textAlign: 'right', marginTop: 8 },
    noReviewsText: { color: theme.colors.muted, fontStyle: 'italic' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: '90%', backgroundColor: 'white', borderRadius: theme.borderRadius.l, padding: theme.spacing.l, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: theme.spacing.m },
    modalStarContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '80%', marginBottom: theme.spacing.l },
    reviewInput: { width: '100%', height: 100, borderWidth: 1, borderColor: theme.colors.gray, borderRadius: theme.borderRadius.m, padding: theme.spacing.m, textAlignVertical: 'top', marginBottom: theme.spacing.l },
    cancelText: { color: theme.colors.muted, marginTop: theme.spacing.m },
});

