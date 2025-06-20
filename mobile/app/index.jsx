import { Link } from "expo-router";
import { Pressable, Button, Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ color: 'red', marginBottom: 20 }}>
        Edit app/index.tsx to edit this screen.
      </Text>

      {/* Signup Link */}
      <Link href="/(auth)/signup" asChild>
        <Pressable style={styles.linkButton}>
          <Text style={styles.linkText}>Sign Up</Text>
        </Pressable>
      </Link>

      {/* Login Link */}
      <Link href="/(auth)/login" asChild>
        <Pressable style={styles.linkButton}>
          <Text style={styles.linkText}>Login</Text>
        </Pressable>
      </Link>

      {/* Normal Button */}
      <Button
        title="Cick Me"
        onPress={() => alert("Button Pressed!")}
        color="#FF6B00"
      />

      {/* Custom Pressable Button */}
      <Pressable
        onPress={() => alert("Pressable Pressed!")}
        style={({ pressed }) => [
          styles.pressableButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.pressableText}>Pressable Button</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  linkButton: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderColor: '#FF6B00',
    borderWidth: 1,
    borderRadius: 8,
  },
  linkText: {
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  pressableButton: {
    marginTop: 20,
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#e55d00', // darker when pressed
  },
  pressableText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
