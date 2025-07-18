import { useState } from 'react';
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
  Alert,
  
} from 'react-native';
import styles from '../../assets/styles/login.styles'; // Your custom styles
import { Ionicons } from '@expo/vector-icons'; // Ensure you have this package installed
import COLORS from '../../constants/colors'; // Your color constants
import { Link , useRouter } from 'expo-router'; // Ensure you have expo-router installed
import { useAuthStore } from '../../store/authStore';



export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { user, isLoading, login } = useAuthStore();


  // const router = useRouter();
  const handleLogin = async () => {
    console.log('Login function called');
    if ( !email || !password) {
          Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      const result = await login(email, password);
      if (!result.success) {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
    <View style={styles.container}>
      <View style={styles.topIllustration}>
        <Image
          source={require('../../assets/images/Car-accesories-bro.png')}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.card}>
        <View style={styles.formContainer}>
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
                placeholder="Enter your password"
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
              <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}

              </TouchableOpacity>
              <View style={styles.footer}> 
                <Text style={styles.footerText}>
                  Don't have an account? 
                  <Link href="/signup" style={styles.footerLink} asChild>
                    <Text style={styles.link}> Sign Up</Text>
                  </Link>
                </Text>
              </View>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
  );
}
