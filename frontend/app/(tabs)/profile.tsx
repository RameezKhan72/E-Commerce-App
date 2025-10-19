import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import WavyHeader from '../../components/WavyHeader';
import { theme } from '../../constants/theme';
import { API_URL } from '../../constants/config';

// A reusable component for each item in the profile list
const ProfileListItem = ({ icon, text, onPress }: { icon: any; text: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
        <Ionicons name={icon} size={24} color={theme.colors.primary} />
        <Text style={styles.listItemText}>{text}</Text>
        <Ionicons name="chevron-forward-outline" size={24} color={theme.colors.muted} />
    </TouchableOpacity>
);

export default function ProfileScreen() {
    const { user, logout, token, reloadUser } = useAuth();
    const router = useRouter();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(user?.name || '');
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [newPhone, setNewPhone] = useState(user?.phone || '');

    useEffect(() => {
        if (user?.profileImageUrl) {
            const serverBaseUrl = API_URL.replace('/api', '');
            setProfileImage(`${serverBaseUrl}${user.profileImageUrl}`);
        }
        if (user?.name) {
            setNewName(user.name);
        }
        if (user?.phone) {
            setNewPhone(user.phone);
        }
    }, [user]);

    // --- Complete Function Implementations ---

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            uploadImage(uri);
        }
    };

    const uploadImage = async (uri: string) => {
        const formData = new FormData();
        formData.append('profileImage', {
            uri, name: `photo_${Date.now()}.jpg`, type: 'image/jpeg',
        } as any);

        try {
            await axios.post(`${API_URL}/users/profile/picture`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` },
            });
            await reloadUser(); // Refresh the user data after upload
            Alert.alert('Success', 'Profile picture updated!');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to upload image.');
        }
    };

    const handleSaveName = async () => {
        try {
            await axios.put(`${API_URL}/users/profile/name`, { name: newName }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            await reloadUser(); // Refresh the user data after saving name
            Alert.alert("Success", "Your name has been updated.");
            setIsEditingName(false);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to update name.");
        }
    };
    
    const handleSavePhone = async () => {
        try {
            await axios.put(`${API_URL}/users/profile/phone`, { phone: newPhone }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            await reloadUser();
            Alert.alert("Success", "Your phone number has been updated.");
            setIsEditingPhone(false);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to update phone number.");
        }
    };

    const handleFeatureAlert = (featureName: string) => {
        Alert.alert("Coming Soon", `The ${featureName} feature is not yet implemented.`);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <WavyHeader>
                <View style={styles.headerContentContainer}>
                    <View style={styles.headerTitleContainer}>
                        <Ionicons name="person-outline" size={28} color="white" style={{ marginRight: 10 }} />
                        <Text style={styles.headerTitle}>Profile</Text>
                    </View>
                </View>
            </WavyHeader>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileInfoContainer}>
                    {/* --- Profile Picture and Name Section --- */}
                    <View style={styles.profilePicWrapper}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profilePic} />
                        ) : (
                            <Ionicons name="person-circle-outline" size={100} color={theme.colors.primary} />
                        )}
                        <TouchableOpacity style={styles.editPicButton} onPress={pickImage}>
                            <Ionicons name="pencil" size={18} color={theme.colors.white} />
                        </TouchableOpacity>
                    </View>
                    
                    {isEditingName ? (
                        <View style={styles.editContainer}>
                            <TextInput value={newName} onChangeText={setNewName} style={styles.input} autoFocus />
                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.saveButton} onPress={handleSaveName}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>
                                <TouchableOpacity style={[styles.saveButton, styles.cancelButton]} onPress={() => setIsEditingName(false)}><Text style={styles.buttonText}>Cancel</Text></TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.name}>{user?.name}</Text>
                            <TouchableOpacity onPress={() => setIsEditingName(true)}><Text style={styles.editText}>Edit Name</Text></TouchableOpacity>
                        </>
                    )}

                    {/* --- Email and Phone Section --- */}
                    <View style={styles.infoSection}>
                        <View style={styles.infoRow}>
                            <Ionicons name="mail-outline" size={20} color={theme.colors.muted} />
                            <Text style={styles.infoText}>{user?.email}</Text>
                        </View>
                        {isEditingPhone ? (
                            <View style={styles.editContainer}>
                                <TextInput value={newPhone} onChangeText={setNewPhone} style={styles.input} autoFocus keyboardType="phone-pad" />
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity style={styles.saveButton} onPress={handleSavePhone}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>
                                    <TouchableOpacity style={[styles.saveButton, styles.cancelButton]} onPress={() => setIsEditingPhone(false)}><Text style={styles.buttonText}>Cancel</Text></TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.infoRow}>
                                <Ionicons name="call-outline" size={20} color={theme.colors.muted} />
                                <Text style={styles.infoText}>{user?.phone || 'Add phone number'}</Text>
                                <TouchableOpacity onPress={() => setIsEditingPhone(true)}><Text style={styles.editText}>Edit</Text></TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                {/* --- Options List and Logout Button --- */}
                <View style={styles.listContainer}>
                    <ProfileListItem icon="list-outline" text="My Orders" onPress={() => router.push('/my-orders')} />
                    <ProfileListItem icon="help-circle-outline" text="Help" onPress={() => handleFeatureAlert("Help")} />
                    <ProfileListItem icon="headset-outline" text="Support" onPress={() => handleFeatureAlert("Support")} />
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Ionicons name="log-out-outline" size={24} color={theme.colors.primary} />
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    headerContentContainer: { width: '100%', paddingHorizontal: theme.spacing.l, justifyContent: 'center', flex: 1 },
    headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'left' },
    scrollContent: { paddingBottom: 50 },
    profileInfoContainer: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
    profilePicWrapper: { position: 'relative', marginBottom: 10 },
    profilePic: { width: 100, height: 100, borderRadius: 50 },
    editPicButton: { position: 'absolute', bottom: 5, right: 5, backgroundColor: theme.colors.primary, borderRadius: 15, padding: 6, borderWidth: 2, borderColor: theme.colors.white },
    name: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
    editText: { color: theme.colors.primary, fontSize: 14, marginTop: 6, textDecorationLine: 'underline' },
    infoSection: { marginTop: theme.spacing.l, width: '80%' },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.s },
    infoText: { flex: 1, marginLeft: 10, fontSize: 16, color: theme.colors.text },
    editContainer: { alignItems: 'center', width: '100%', marginTop: theme.spacing.m },
    input: { width: '100%', borderBottomWidth: 1, borderColor: theme.colors.primary, padding: 8, fontSize: 16, textAlign: 'left' },
    buttonRow: { flexDirection: 'row', marginTop: 10 },
    saveButton: { backgroundColor: theme.colors.primary, paddingVertical: 8, paddingHorizontal: 25, borderRadius: theme.borderRadius.m, marginHorizontal: 5 },
    cancelButton: { backgroundColor: theme.colors.muted },
    buttonText: { color: theme.colors.white, fontWeight: 'bold' },
    listContainer: { marginHorizontal: theme.spacing.l, backgroundColor: theme.colors.white, borderRadius: theme.borderRadius.l, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.gray },
    listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: theme.colors.gray },
    listItemText: { flex: 1, marginLeft: 20, fontSize: 16, color: theme.colors.text },
    logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: theme.spacing.l, marginTop: 30, backgroundColor: '#FEE2E2', paddingVertical: 15, borderRadius: theme.borderRadius.l },
    logoutButtonText: { marginLeft: 10, fontSize: 16, color: theme.colors.primary, fontWeight: 'bold' },
});

