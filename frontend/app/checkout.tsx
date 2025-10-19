import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { theme } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { API_URL } from '../constants/config';

export default function CheckoutScreen() {
    const router = useRouter();
    const { user, token } = useAuth();
    const { total, clearCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

    const [address, setAddress] = useState({
        street: '', city: '', postalCode: '', country: '',
    });

    useEffect(() => {
        if (user?.address) {
            setAddress({
                street: user.address.street || '',
                city: user.address.city || '',
                postalCode: user.address.postalCode || '',
                country: user.address.country || '',
            });
        }
    }, [user]);

    const handleInputChange = (field: keyof typeof address, value: string) => {
        setAddress(prev => ({ ...prev, [field]: value }));
    };

    const handleConfirmOrder = async () => {
        if (!address.street || !address.city || !address.postalCode || !address.country) {
            return Alert.alert("Incomplete Address", "Please fill in all shipping details.");
        }
        if (!selectedPayment) {
            return Alert.alert("Payment Method Required", "Please select a payment method.");
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/orders`, { shippingAddress: address }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            clearCart();
            router.replace({ pathname: '/order-confirmation', params: { orderId: response.data._id } });
        } catch (error) {
            console.error("Failed to create order:", error);
            Alert.alert("Checkout Failed", "We were unable to process your order. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ title: 'Checkout' }} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={[styles.title, { marginTop: 0 }]}>Shipping Details</Text>
                <CustomInput placeholder="Street Address" value={address.street} onChangeText={(val) => handleInputChange('street', val)} />
                <CustomInput placeholder="City" value={address.city} onChangeText={(val) => handleInputChange('city', val)} />
                <CustomInput placeholder="Postal Code" value={address.postalCode} onChangeText={(val) => handleInputChange('postalCode', val)} keyboardType="numeric" />
                <CustomInput placeholder="Country" value={address.country} onChangeText={(val) => handleInputChange('country', val)} />

                <Text style={styles.title}>Payment Method</Text>
                <TouchableOpacity
                    style={[styles.paymentOption, selectedPayment === 'card' && styles.paymentOptionSelected]}
                    onPress={() => setSelectedPayment('card')}
                >
                    <Ionicons name="card-outline" size={24} color={selectedPayment === 'card' ? theme.colors.primary : theme.colors.text} />
                    <Text style={[styles.paymentText, selectedPayment === 'card' && styles.paymentTextSelected]}>Credit Card</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.paymentOption, selectedPayment === 'paypal' && styles.paymentOptionSelected]}
                    onPress={() => setSelectedPayment('paypal')}
                >
                    <Ionicons name="logo-paypal" size={24} color={selectedPayment === 'paypal' ? theme.colors.primary : theme.colors.text} />
                    <Text style={[styles.paymentText, selectedPayment === 'paypal' && styles.paymentTextSelected]}>PayPal</Text>
                </TouchableOpacity>


                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>Order Summary</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total</Text>
                        <Text style={styles.summaryTotal}>${total.toFixed(2)}</Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                     <CustomButton 
                        title={isLoading ? "Placing Order..." : `Pay $${total.toFixed(2)}`} 
                        onPress={handleConfirmOrder} 
                        disabled={isLoading}
                     />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContainer: {
        paddingHorizontal: theme.spacing.l,
        paddingTop: theme.spacing.m - 30, // Reduced top padding to move content up
        paddingBottom: theme.spacing.m + 35, // Increased bottom padding by 15
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: theme.spacing.l,
        marginBottom: theme.spacing.m,
        color: theme.colors.text,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.m,
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.m,
        borderWidth: 1,
        borderColor: theme.colors.gray,
        marginBottom: theme.spacing.m,
    },
    paymentOptionSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: '#FEF2F2',
    },
    paymentText: {
        marginLeft: theme.spacing.m,
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
    },
    paymentTextSelected: {
        color: theme.colors.primary,
    },
    summaryContainer: {
        marginTop: theme.spacing.l,
        padding: theme.spacing.m,
        backgroundColor: '#f5f5f5',
        borderRadius: theme.borderRadius.m,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: theme.spacing.m,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 16,
        color: theme.colors.muted,
    },
    summaryTotal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    buttonContainer: {
        marginTop: theme.spacing.l,
    }
});

