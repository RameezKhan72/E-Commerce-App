import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean; // Add the optional disabled prop
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, style, disabled }) => {
  return (
    // Add a specific style when the button is disabled
    <TouchableOpacity
      style={[styles.buttonContainer, style, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: theme.colors.muted, // Change color when disabled
  },
});

export default CustomButton;

