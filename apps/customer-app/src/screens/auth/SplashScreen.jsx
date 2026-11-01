// Customer App — Professional Clean Splash Screen

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';

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
        <View style={styles.iconCircle}>
          <Text style={{ fontSize: 44 }}>⚡</Text>
        </View>

        <Text style={styles.brandTitle}>
          Quick<Text style={{ color: '#FF6B35' }}>Kart</Text>
        </Text>
        
        <View style={styles.badge}>
          <Text style={styles.badgeText}>HYPERLOCAL EXPRESS • 10-15 MINS</Text>
        </View>

        <Text style={styles.subTagline}>
          Groceries, Fresh Produce & Daily Essentials
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <ActivityIndicator size="small" color="#FF6B35" style={{ marginBottom: 12 }} />
        <Text style={styles.loadingText}>Connecting to nearby neighborhood stores...</Text>
        <Text style={styles.versionText}>QuickKart v1.2.0 • Ultra-Fast Hyperlocal Platform</Text>
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
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 53, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
    marginTop: 6,
  },
  badgeText: {
    color: '#FF6B35',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  subTagline: {
    fontSize: 14,
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
