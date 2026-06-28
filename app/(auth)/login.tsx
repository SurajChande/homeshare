/**
 * Cinematic login landing screen.
 *
 * Background video: replace LOGIN_VIDEO_SOURCE with
 *   require('@/assets/videos/login-bg.mp4')
 * once you have dropped your video file into assets/videos/.
 */

import { useCallback, useEffect } from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

// ─── Video source ────────────────────────────────────────────────────────────
// To use a local file instead: require('@/assets/videos/login-bg.mp4')
const LOGIN_VIDEO_SOURCE = require('@/assets/videos/login-bg.mp4');

// ─── Sub-components ──────────────────────────────────────────────────────────

function LoginBackgroundVideo() {
  const player = useVideoPlayer(LOGIN_VIDEO_SOURCE, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  useFocusEffect(
    useCallback(() => {
      player.play();
      return () => {
        player.pause();
      };
    }, [player])
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        contentFit="cover"
        nativeControls={false}
        allowsPictureInPicture={false}
      />
    </View>
  );
}

function GradientOverlay() {
  return (
    <LinearGradient
      colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.38)', 'rgba(0,0,0,0.84)']}
      locations={[0, 0.42, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />
  );
}

interface AnimProps {
  opacity: ReturnType<typeof useSharedValue<number>>;
  translateY: ReturnType<typeof useSharedValue<number>>;
}

function LoginHero({ opacity, translateY }: AnimProps) {
  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.hero, animStyle]}>
      <View style={styles.logoWrap}>
        <Ionicons name="home" size={26} color="#FFFFFF" />
      </View>

      <Text style={styles.wordmark}>homeshare</Text>

      <Text style={styles.headline}>
        Find your people.{'\n'}Find your home.
      </Text>

      <Text style={styles.subtitle}>
        Share homes. Split costs.{'\n'}Build meaningful connections.
      </Text>
    </Animated.View>
  );
}

function AuthButtons({ opacity, translateY }: AnimProps) {
  const router = useRouter();

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handleGoogleSignIn = () => {
    Alert.alert('Coming soon', 'Google Sign-In will be available in a future update.');
  };

  const handleAppleSignIn = () => {
    Alert.alert('Coming soon', 'Apple Sign-In will be available in a future update.');
  };

  return (
    <Animated.View style={[styles.authCard, animStyle]}>
      {/* Google */}
      <Pressable
        onPress={handleGoogleSignIn}
        style={({ pressed }) =>
          StyleSheet.flatten([styles.btn, styles.btnGoogle, pressed && styles.btnPressed])
        }
        accessibilityRole="button"
        accessibilityLabel="Continue with Google"
      >
        <Ionicons name="logo-google" size={19} color="#1F1F1F" />
        <Text style={styles.btnGoogleText}>Continue with Google</Text>
      </Pressable>

      {/* Apple — iOS only */}
      {Platform.OS === 'ios' && (
        <Pressable
          onPress={handleAppleSignIn}
          style={({ pressed }) =>
            StyleSheet.flatten([styles.btn, styles.btnApple, pressed && styles.btnPressed])
          }
          accessibilityRole="button"
          accessibilityLabel="Continue with Apple"
        >
          <Ionicons name="logo-apple" size={19} color="#FFFFFF" />
          <Text style={styles.btnAppleText}>Continue with Apple</Text>
        </Pressable>
      )}

      {/* OR divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Email */}
      <Pressable
        onPress={() => router.push('/(auth)/email-login')}
        style={({ pressed }) =>
          StyleSheet.flatten([styles.btn, styles.btnEmail, pressed && styles.btnEmailPressed])
        }
        accessibilityRole="button"
        accessibilityLabel="Continue with Email"
      >
        <Ionicons name="mail-outline" size={19} color="rgba(255,255,255,0.9)" />
        <Text style={styles.btnEmailText}>Continue with Email</Text>
      </Pressable>

      {/* Legal */}
      <Text style={styles.terms}>
        By continuing, you agree to our{' '}
        <Text style={styles.termsLink}>Terms</Text>
        {' & '}
        <Text style={styles.termsLink}>Privacy Policy</Text>
      </Text>
    </Animated.View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const heroOpacity = useSharedValue(0);
  const heroTranslateY = useSharedValue(28);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(44);

  useEffect(() => {
    const easing = Easing.out(Easing.exp);
    heroOpacity.value = withDelay(220, withTiming(1, { duration: 720, easing }));
    heroTranslateY.value = withDelay(220, withTiming(0, { duration: 720, easing }));
    buttonsOpacity.value = withDelay(480, withTiming(1, { duration: 640, easing }));
    buttonsTranslateY.value = withDelay(480, withTiming(0, { duration: 640, easing }));
  }, []);

  return (
    <View style={styles.root}>
      {/* Cinematic background */}
      <LoginBackgroundVideo />
      <GradientOverlay />

      {/* Foreground content */}
      <SafeAreaView style={styles.safeArea}>
        <LoginHero opacity={heroOpacity} translateY={heroTranslateY} />
        <AuthButtons opacity={buttonsOpacity} translateY={buttonsTranslateY} />
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  // Hero
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 14,
  },
  logoWrap: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  wordmark: {
    fontSize: 17,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.72)',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  headline: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -1,
    lineHeight: 46,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },

  // Auth card
  authCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: 'rgba(10,10,10,0.72)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    gap: 12,
  },

  // Buttons
  btn: {
    height: 56,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  btnPressed: {
    opacity: 0.82,
  },
  btnGoogle: {
    backgroundColor: '#FFFFFF',
  },
  btnGoogleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F1F1F',
    letterSpacing: -0.1,
  },
  btnApple: {
    backgroundColor: '#111111',
  },
  btnAppleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },
  btnEmail: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  btnEmailPressed: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  btnEmailText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.92)',
    letterSpacing: -0.1,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Terms
  terms: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.32)',
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 2,
  },
  termsLink: {
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '600',
  },
});
