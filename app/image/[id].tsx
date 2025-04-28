import { useLocalSearchParams, router } from 'expo-router';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, Dimensions, BackHandler } from 'react-native';
import { Image } from 'expo-image';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { galleryData } from '@/types/gallery';
import { useNetworkStatus } from '@/components/useNetworkStatus';
import CustomStatusBar from '@/components/CustomStatusBar';
import * as NavigationBar from 'expo-navigation-bar';

/**
 * Detail screen component that displays a full-screen image with audio controls
 */
export default function ImageDetailScreen() {
  const { id } = useLocalSearchParams();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const galleryItem = galleryData.find(item => item.id === id);
  const isConnected = useNetworkStatus();

  /**
   * Cleanup audio resources
   */
  const cleanupAudio = async () => {
    try {
      if (sound) {
        setSound(null);
        setIsPlaying(false);
        await sound.stopAsync();
        await sound.unloadAsync();
      }
    } catch (error) {
      console.error('Error cleaning up audio:', error);
    }
  };

  /**
   * Handle back navigation
   */
  const handleBackPress = async () => {
    await cleanupAudio();
    router.back();
    return true;
  };

  // Use useFocusEffect instead of useEffect
  useFocusEffect(
    useCallback(() => {
      let backHandler: any;
      NavigationBar.setVisibilityAsync('hidden');
      const setupScreen = async () => {
        // Setup audio
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false
        });

        // Setup back handler
        backHandler = BackHandler.addEventListener('hardwareBackPress', async () => {
          await cleanupAudio();
          router.back();
          return true;
        });
      };

      setupScreen();

      return () => {
        if (backHandler) {
          backHandler.remove();
        }
      };
    }, [sound])
  );

  /**
   * Handles playing and pausing audio
   */
  const handleAudioPlayback = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        setIsLoading(true);
        const source = typeof galleryItem.audioUrl === 'string'
          ? { uri: galleryItem.audioUrl }
          : galleryItem.audioUrl;

        const { sound: newSound } = await Audio.Sound.createAsync(
          source,
          {
            shouldPlay: true,
            isLooping: true,
            volume: 1.0,
            progressUpdateIntervalMillis: 1000,
          }
        );

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
          }
        });

        setSound(newSound);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error handling audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isConnected ? (
    <ThemedView style={styles.container}>
      {/* <StatusBar style="auto" /> */}
      <CustomStatusBar backgroundColor="rgba(0, 0, 0, 0.3)" barStyle="light-content" />
      
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackPress}
        accessibilityLabel="Go back to gallery"
        accessibilityHint="Returns to the gallery view">
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      {/* Background Image */}
      <Image
        source={galleryItem.imageUrl}
        style={styles.backgroundImage}
        contentFit="fill"
      />

      {/* Overlay Content */}
      <ThemedView style={styles.overlay}>
        <ThemedText style={styles.title}>{galleryItem.title}</ThemedText>
        <TouchableOpacity
          onPress={handleAudioPlayback}
          style={styles.playButton}
          disabled={isLoading}
          accessibilityLabel={isPlaying ? "Pause audio" : "Play audio"}
          accessibilityHint="Toggles audio playback">
          <Ionicons
            name={isLoading ? 'hourglass' : isPlaying ? 'pause' : 'play'}
            size={32}
            color="white"
          />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  ) : (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      <ThemedText style={styles.noInternetText}>No internet connection</ThemedText>
    </ThemedView>
  ));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: Dimensions.get('window').width,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 50,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  title: {
    color: 'white',
    fontSize: 24,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noInternetText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 100,
  },
});