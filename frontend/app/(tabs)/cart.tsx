import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    LayoutAnimation,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCart } from '../../contexts/CartContext';
import CustomButton from '../../components/CustomButton';
import WavyHeader from '../../components/WavyHeader';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

// The deprecated block for enabling LayoutAnimation on Android has been removed.

export default function CartScreen() {
    const { items, total, loading, removeFromCart, updateQuantity } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        router.push('/checkout');
    };

    const handleRemove = (productId: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        removeFromCart(productId);
    };

    const handleUpdate = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            return;
        }
        updateQuantity(productId, newQuantity);
    };

    const renderContent = () => {
        if (loading) {
            return <ActivityIndicator size="large" style={styles.loader} />;
        }
        if (items.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={80} color={theme.colors.muted} />
                    <Text style={styles.emptyText}>Your Cart is Empty</Text>
                    <Text style={styles.emptySubText}>Looks like you haven't added anything to your cart yet.</Text>
                    <CustomButton title="Start Shopping" onPress={() => router.replace('/')} />
                </View>
            );
        }
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.product._id}
                    renderItem={({ item }) => (
                        <View style={styles.cartItem}>
                            <Image source={{ uri: item.product.image_url }} style={styles.image} />
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
                                <Text style={styles.itemPrice}>${item.product.price.toFixed(2)}</Text>
                                <Text style={styles.itemSubtotal}>Subtotal: ${(item.product.price * item.quantity).toFixed(2)}</Text>
                            </View>
                            <View style={styles.actionsContainer}>
                                <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item.product._id)}>
                                    <Ionicons name="trash-bin-outline" size={20} color={theme.colors.muted} />
                                </TouchableOpacity>
                                <View style={styles.quantityContainer}>
                                    <TouchableOpacity style={styles.quantityButton} onPress={() => handleUpdate(item.product._id, item.quantity + 1)}>
                                        <Ionicons name="chevron-up-outline" size={22} color={theme.colors.primary} />
                                    </TouchableOpacity>
                                    <Text style={styles.quantityText}>{item.quantity}</Text>
                                    <TouchableOpacity style={styles.quantityButton} onPress={() => handleUpdate(item.product._id, item.quantity - 1)}>
                                        <Ionicons name="chevron-down-outline" size={22} color={theme.colors.primary} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                    contentContainerStyle={{ paddingHorizontal: theme.spacing.m, paddingTop: theme.spacing.m }}
                />
                <View style={styles.footer}>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalText}>${total.toFixed(2)}</Text>
                    </View>
                    <CustomButton title="Proceed to Checkout" onPress={handleCheckout} />
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <WavyHeader>
                <View style={styles.headerContentContainer}>
                    <View style={styles.headerTitleContainer}>
                        <Ionicons name="cart" size={28} color="white" style={{ marginRight: 10 }}/>
                        <Text style={styles.headerTitle}>Cart</Text>
                    </View>
                </View>
            </WavyHeader>
            {renderContent()}
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
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.l,
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
        textAlign: 'center',
        marginVertical: theme.spacing.m,
        marginBottom: theme.spacing.l,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginBottom: theme.spacing.m,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        position: 'relative',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: theme.spacing.m,
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'space-around',
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
    },
    itemPrice: {
        fontSize: 14,
        color: theme.colors.muted,
    },
    itemSubtotal: {
        fontSize: 15,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    actionsContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: theme.spacing.m,
    },
    removeButton: {
        alignSelf: 'flex-start',
        padding: 4,
    },
    quantityContainer: {
        alignItems: 'center',
    },
    quantityButton: {
        paddingVertical: 2,
    },
    quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 4,
    },
    footer: {
        backgroundColor: 'white',
        padding: theme.spacing.m,
        borderTopWidth: 1,
        borderColor: theme.colors.gray,
        paddingBottom: 30,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.m,
    },
    totalLabel: {
        fontSize: 16,
        color: theme.colors.muted,
        fontWeight: '600',
    },
    totalText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
});

