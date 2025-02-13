import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { colors } from "../styles/colors";
import { typography } from "../styles/typography";

interface RouteParams {
  id: string;
}

const TaskDetailScreen = () => {
  const route = useRoute();
  const { id } = route.params as RouteParams;

  return (
    <View style={styles.container}>
      <Text style={typography.title}>Détails de la tâche</Text>
      <Text style={typography.subtitle}>ID: {id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TaskDetailScreen;
