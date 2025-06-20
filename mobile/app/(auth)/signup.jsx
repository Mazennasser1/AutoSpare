import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';

export default function RegistrationScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!isFormValid) return;
    
    Alert.alert('Success', 'Account created successfully!', [
      { text: 'OK', onPress: () => console.log('Registration:', formData) }
    ]);
  };

  const handleSignIn = () => {
    Alert.alert('Sign In', 'Navigate to sign in screen');
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.password;

  const InputField = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    secureTextEntry = false,
    keyboardType = 'default',
    icon,
    showPasswordToggle = false
  }) => {
    const fieldName = placeholder.toLowerCase().includes('first') ? 'firstName' : 
                     placeholder.toLowerCase().includes('last') ? 'lastName' :
                     placeholder.toLowerCase().includes('email') ? 'email' : 'password';
    
    const isFocused = focusedField === fieldName;
    
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused
        ]}>
          <Text style={[styles.inputIcon, isFocused && styles.inputIconFocused]}>
            {icon}
          </Text>
          <TextInput
            style={styles.textInput}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            onFocus={() => setFocusedField(fieldName)}
            onBlur={() => setFocusedField('')}
            autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
          />
          {showPasswordToggle && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              <Text style={styles.passwordToggleText}>
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header with Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>🔧</Text>
          </View>
        </View>
        <View style={styles.brandContainer}>
          <Text style={styles.brandName}>AutoParts</Text>
          <View style={styles.brandUnderline} />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the marketplace for quality auto parts</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <InputField
            label="First Name"
            value={formData.firstName}
            onChangeText={(value) => handleInputChange('firstName', value)}
            placeholder="Enter your first name"
            icon="👤"
          />

          <InputField
            label="Last Name"
            value={formData.lastName}
            onChangeText={(value) => handleInputChange('lastName', value)}
            placeholder="Enter your last name"
            icon="👤"
          />

          <InputField
            label="Email Address"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Enter your email"
            keyboardType="email-address"
            icon="📧"
          />

          <InputField
            label="Password"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            placeholder="Create a password"
            secureTextEntry={!showPassword}
            icon="🔒"
            showPasswordToggle={true}
          />
        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={[
            styles.registerButton,
            isFormValid ? styles.registerButtonActive : styles.registerButtonInactive
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.registerButtonText,
            isFormValid ? styles.registerButtonTextActive : styles.registerButtonTextInactive
          ]}>
            Create Account
          </Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleSignIn} activeOpacity={0.7}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Decorative Elements */}
      <View style={styles.decorativeTop} />
      <View style={styles.decorativeBottom} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 12,
  },
  logo: {
    width: 64,
    height: 64,
    backgroundColor: '#FF6B00',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  brandContainer: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  brandUnderline: {
    width: 32,
    height: 2,
    backgroundColor: '#FF6B00',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputWrapperFocused: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FF6B00',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    fontSize: 20,
    color: '#9CA3AF',
    marginRight: 12,
  },
  inputIconFocused: {
    color: '#FF6B00',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
  },
  passwordToggle: {
    padding: 4,
    marginLeft: 8,
  },
  passwordToggleText: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  registerButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  registerButtonActive: {
    backgroundColor: '#FF6B00',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  registerButtonInactive: {
    backgroundColor: '#E5E7EB',
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  registerButtonTextActive: {
    color: '#FFFFFF',
  },
  registerButtonTextInactive: {
    color: '#9CA3AF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingBottom: 32,
  },
  loginText: {
    fontSize: 16,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B00',
  },
  decorativeTop: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 128,
    height: 128,
    backgroundColor: '#FFF7ED',
    borderBottomLeftRadius: 128,
  },
  decorativeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 96,
    height: 96,
    backgroundColor: '#F9FAFB',
    borderTopRightRadius: 96,
  },
});