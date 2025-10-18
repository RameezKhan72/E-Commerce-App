import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../constants/config';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import WavyHeader from '../components/WavyHeader';

// Define the types for our order data
interface OrderItem {
    product: {
        _id: string;
        name: string;
        image_url: string;
    } | null; // Product can now be null if it was deleted
    quantity: number;
    price: number;
}
interface Order {
    _id: string;
    totalAmount: number;
    status: string;
    orderDate: string;
    items: OrderItem[];
}

export default function MyOrdersScreen() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) return;
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/orders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    const renderOrder = ({ item }: { item: Order }) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderDate}>{new Date(item.orderDate).toLocaleDateString()}</Text>
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>
            <View style={styles.orderBody}>
                {item.items.map((orderItem, index) => {
                    // This explicit if/else structure resolves the TypeScript error
                    if (orderItem.product) {
                        return (
                            <View key={orderItem.product._id} style={styles.productItem}>
                                <TouchableOpacity onPress={() => router.push(`/product/${orderItem.product!._id}`)}>
                                    <Image source={{ uri: orderItem.product.image_url }} style={styles.productImage} />
                                </TouchableOpacity>
                                <View style={styles.productDetails}>
                                    <Text style={styles.productName} numberOfLines={1}>{orderItem.product.name}</Text>
                                    <Text style={styles.productInfo}>Qty: {orderItem.quantity} - ${orderItem.price.toFixed(2)}</Text>
                                </View>
                            </View>
                        );
                    } else {
                        return (
                            <View key={`deleted-${index}`} style={styles.productItem}>
                                <View style={styles.deletedProductImage}>
                                    <Ionicons name="alert-circle-outline" size={24} color={theme.colors.muted} />
                                </View>
                                <View style={styles.productDetails}>
                                    <Text style={styles.deletedProductName}>Product no longer available</Text>
                                </View>
                            </View>
                        );
                    }
                })}
            </View>
            <View style={styles.orderFooter}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>${item.totalAmount.toFixed(2)}</Text>
            </View>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" style={{ flex: 1, backgroundColor: theme.colors.background }} />;
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            <WavyHeader>
                <View style={styles.headerContentContainer}>
                    <View style={styles.headerTitleContainer}>
                        <Ionicons name="receipt-outline" size={28} color="white" style={{ marginRight: 10 }} />
                        <Text style={styles.headerTitle}>My Orders</Text>
                    </View>
                </View>
            </WavyHeader>

            <FlatList
                data={orders}
                renderItem={renderOrder}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="receipt-outline" size={80} color={theme.colors.muted} />
                        <Text style={styles.emptyText}>No Orders Found</Text>
                        <Text style={styles.emptySubText}>You haven't placed any orders yet.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerContentContainer: {
        width: '100%',
        paddingHorizontal: theme.spacing.l,
        justifyContent: 'center',
        flex: 1,
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
    listContainer: {
        padding: theme.spacing.m,
    },
    orderCard: {
        backgroundColor: 'white',
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.l,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray,
    },
    orderDate: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    statusContainer: {
        backgroundColor: theme.colors.secondary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 12,
    },
    orderBody: {
        padding: theme.spacing.m,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.m,
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: theme.spacing.m,
    },
    deletedProductImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: theme.spacing.m,
        backgroundColor: theme.colors.gray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
    },
    deletedProductName: {
        fontSize: 14,
        fontWeight: '600',
        fontStyle: 'italic',
        color: theme.colors.muted,
    },
    productInfo: {
        fontSize: 12,
        color: theme.colors.muted,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: theme.spacing.m,
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray,
    },
    totalLabel: {
        fontSize: 14,
        color: theme.colors.muted,
        marginRight: theme.spacing.s,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: theme.spacing.m,
    },
    emptySubText: {
        fontSize: 16,
        color: theme.colors.muted,
    }
});

