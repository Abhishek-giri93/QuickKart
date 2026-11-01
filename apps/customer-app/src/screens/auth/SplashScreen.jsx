// Customer App — Professional Splash Screen with Official Logo

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, ActivityIndicator } from 'react-native';

const SplashScreen = ({ navigation, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else if (navigation?.replace) {
        navigation.replace('Home');
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigation, onComplete]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      <View style={styles.centerCard}>
        {/* Official QuickKart Brand Logo */}
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeDot}>⚡</Text>
            <Text style={styles.badgeText}>HYPERLOCAL EXPRESS</Text>
          </View>
        </View>

        <Text style={styles.subTagline}>
          Groceries, Food & Essentials in 10-15 Minutes
        </Text>
      </View>

      {/* Bottom Loading Indicator & Version */}
      <View style={styles.bottomSection}>
        <ActivityIndicator size="small" color="#FF6B35" style={{ marginBottom: 12 }} />
        <Text style={styles.loadingText}>Connecting to nearby stores...</Text>
        <Text style={styles.versionText}>QuickKart v1.2.0 • Made with ❤️</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  centerCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoImage: {
    width: 280,
    height: 100,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  badgeDot: {
    fontSize: 12,
    marginRight: 6,
  },
  badgeText: {
    color: '#FF6B35',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  subTagline: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomSection: {
    alignItems: 'center',
    width: '100%',
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
    fontWeight: '500',
  },
  versionText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
});

export default SplashScreen;
