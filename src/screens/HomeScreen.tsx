import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { colors } from "../styles/colors";
import { typography } from "../styles/typography";
import { spacing } from "../styles/spacing";

// Pas besoin de props pour cet écran, mais on type quand même
interface HomeScreenProps {}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(800)} style={styles.container}>
        <Text style={typography.title}>Gestionnaire de Tâches</Text>
        <Text style={typography.subtitle}>
          Organise tes projets comme un pro
        </Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Créer une nouvelle tâche</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.large,
  },
  button: {
    marginTop: spacing.large,
    backgroundColor: colors.primary,
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.extraLarge,
    borderRadius: 10,
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  buttonText: {
    ...typography.button,
    textAlign: "center",
  },
});

export default HomeScreen;
