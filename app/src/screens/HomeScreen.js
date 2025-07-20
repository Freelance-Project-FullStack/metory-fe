import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StoryCard from "../components/StoryCard";
import { stories } from "../data/mockData";

const { height: screenHeight } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const videoCardHeight = screenHeight * 0.8 + 8; // 80% screen height + marginVertical

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Metory</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <Ionicons name="search-outline" size={26} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ marginLeft: 16 }}
            onPress={() => navigation.navigate("Profile")}
          >
            <Ionicons name="person-circle-outline" size={30} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Video Feed */}
      <FlatList
        data={stories}
        renderItem={({ item, index }) => (
          <StoryCard
            story={item}
            onPress={() => navigation.navigate("VideoFeed", { 
              stories: stories, 
              initialIndex: index 
            })}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={1}
        pagingEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={videoCardHeight}
        decelerationRate="fast"
        getItemLayout={(data, index) => ({
          length: videoCardHeight,
          offset: videoCardHeight * index,
          index,
        })}
      />
      {/* Floating Create Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => {
          /* Navigate to Create Story Screen */
        }}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 0,
    paddingBottom: 100,
  },
  createButton: {
    position: "absolute",
    right: 15,
    bottom: 120,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF3A57",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF3A57",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 65,
  },
});

export default HomeScreen;
