import { StyleSheet, Text, View } from 'react-native';

export default function CalculatorScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>SIMPLECALC</Text>
      <Text style={styles.note}>
        Scaffolded with Expo and Expo Router. The calculator arrives next.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  brand: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 6,
  },
  note: {
    fontSize: 14,
    textAlign: 'center',
  },
});
