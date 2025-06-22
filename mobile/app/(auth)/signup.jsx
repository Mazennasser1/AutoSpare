import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView
,  Platform,
  StyleSheet,

} from 'react-native';
import styles from '../../assets/styles/signup.styles'; // Your custom styles
import { Ionicons } from '@expo/vector-icons'; // Ensure you have this package installed
import COLORS from '../../constants/colors'; // Your color constants
import { Link } from 'expo-router'; // Ensure you have expo-router installed
import { useAuthStore } from '../../store/authStore';




export default function signup() {
  const [firstName, setFN] = useState('');
  const [lastName, setLN] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [user, isLoading,register] = useAuthStore();

  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Spare
            <Image source={require('../../assets/images/repairing-service.png')} style={{ width: 50, height: 50, marginLeft: 10 }} />
          </Text>
          <Text style={styles.subtitle}>change your auto parts</Text>    
        </View>
        <View style={styles.formContainer}>
          <View style={styles.nameContainer}>
            <View style={styles.nameInputGroup}>
              <Text style={styles.label}>First Name</Text>
              <View style={styles.nameInputContainer}>
                <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.nameInput}
                  placeholder="first name"
                  placeholderTextColor={COLORS.placeholderTextColor}
                  value={firstName}
                  onChangeText={setFN}
                />
              </View>
            </View>
            
            <View style={styles.nameInputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <View style={styles.nameInputContainer}>
                <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.nameInput}
                  placeholder="last name"
                  placeholderTextColor={COLORS.placeholderTextColor}
                  value={lastName}
                  onChangeText={setLN}
                />
              </View>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.placeholderTextColor}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ente your password"
                placeholderTextColor={COLORS.placeholderTextColor}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={COLORS.primary}
                style={styles.togglePasswordIcon}
                onPress={() => setShowPassword(!showPassword)}
              />
              </View>
              </View>
              <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Signup</Text>
                )}

              </TouchableOpacity>
              <View style={styles.footer}> 
                <Text style={styles.footerText}>
                  Already have an account? 
                  <Link href="/login" style={styles.footerLink} asChild>
                    <Text style={styles.link}> Login</Text>
                  </Link>
                </Text>
              </View>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
  );
}
