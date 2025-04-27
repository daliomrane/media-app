import { StyleSheet, TouchableOpacity, FlatList, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { galleryData } from '@/types/gallery';
import { useColorScheme } from 'react-native';
import { useNetworkStatus } from '../components/useNetworkStatus';

/**
 * Main gallery screen component that displays a grid of images
 * Each image is clickable and navigates to a detail view with audio player
 */
export default function GalleryScreen() {
  const isConnected = useNetworkStatus();
  const colorScheme = useColorScheme();

  // Filter items based on connectivity
  const filteredData = isConnected === false 
    ? galleryData.filter(item => typeof item.imageUrl === 'number')
    : galleryData;

  /**
   * Renders an individual gallery item
   * @param item The gallery item to render
   */
  const renderGalleryItem = ({ item }: { item: { id: string; title: string; imageUrl: string | number } }) => (
    <TouchableOpacity
      style={styles.galleryItem}
      onPress={() => router.push(`/image/${item.id}`)}
      accessibilityLabel={`View ${item.title}`}
      accessibilityHint="Opens image detail view with audio player">
      <Image
        source={item.imageUrl}
        style={styles.galleryImage}
        contentFit="cover"
        transition={1000}
      />
      <ThemedView style={styles.titleOverlay}>
        <ThemedText style={styles.imageTitle}>{item.title}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.headerContainer}>
        <ThemedText style={[
          styles.title,
          { color: colorScheme === 'dark' ? '#fff' : '#000' }
        ]}>
          Cozy Leaf
        </ThemedText>
        <ThemedText style={[
          styles.default,
          { color: colorScheme === 'dark' ? '#fff' : '#000' },
          { fontSize: 12 },
          { textAlign: 'right' },
        ]}>
          Alpha 1.0
        </ThemedText>
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderGalleryItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.galleryContainer}
        accessibilityLabel="Gallery grid"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0b101f',
  },
  galleryContainer: {
    gap: 16,
  },
  galleryItem: {
    flex: 1,
    margin: 8,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
  },
  imageTitle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  headerContainer: {
    paddingTop: 10, // Adjust this value based on your StatusBar height
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: 'light',
    textAlign: 'center',
  },
}); 