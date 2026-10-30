// Customer App — Store Detail Screen

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, StatusBar, Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadow } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';
import { mockStores } from '../../mock-data/stores';
import { mockProducts } from '../../mock-data/products';
import { useCartStore } from '../../store/cartStore';

const StoreDetailScreen = ({ storeId = 'store_001', navigation, onGoToCart }) => {
  const store = mockStores.find((s) => s.id === storeId) || mockStores[0];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart Store hooks
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQty = useCartStore((state) => state.updateQty);
  const clearCart = useCartStore((state) => state.clearCart);

  const cartItemCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartSubtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Products from this store
  const storeProducts = mockProducts.filter((p) => p.storeId === store.id || !p.storeId);

  // Extract unique categories for filter
  const categories = ['All', ...new Set(storeProducts.map((p) => p.category))];

  const filteredProducts = storeProducts.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    const res = addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        imageUrl: product.imageUrl,
      },
      store.id,
      store.name
    );

    if (res?.storeConflict) {
      Alert.alert(
        'Start New Cart?',
        'Your cart already contains items from another store. Do you want to discard them and add this item?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes, Start New',
            onPress: () => {
              clearCart();
              addItem(
                {
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  unit: product.unit,
                },
                store.id,
                store.name
              );
            },
          },
        ]
      );
    }
  };

  const getItemQty = (productId) => {
    const found = cartItems.find((i) => i.productId === productId);
    return found ? found.qty : 0;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation?.goBack?.()}
          >
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{store.name}</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Store Info Card */}
        <View style={styles.storeCard}>
          <View style={styles.storeRow}>
            <View style={styles.storeEmojiBox}>
              <Text style={{ fontSize: 32 }}>🏪</Text>
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={styles.storeName}>{store.name}</Text>
              <Text style={styles.storeAddress} numberOfLines={1}>{store.address}</Text>
              <View style={styles.storeBadges}>
                <View style={styles.badgeRating}>
                  <Text style={styles.badgeRatingText}>⭐ {store.rating}</Text>
                </View>
                <Text style={styles.storeDot}>•</Text>
                <Text style={styles.storeMetaText}>🕒 {store.deliveryTime} mins</Text>
                <Text style={styles.storeDot}>•</Text>
                <Text style={styles.storeMetaText}>📍 {store.distance} km</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Category Pills */}
      <View style={styles.categoryBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: 8 }}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catPill, selectedCategory === cat && styles.catPillActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.catPillText, selectedCategory === cat && styles.catPillTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products List */}
      <ScrollView contentContainerStyle={styles.productList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeading}>
          {selectedCategory === 'All' ? 'All Products' : selectedCategory} ({filteredProducts.length})
        </Text>

        {filteredProducts.map((product) => {
          const qty = getItemQty(product.id);

          return (
            <View key={product.id} style={styles.productCard}>
              {/* Product Info */}
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productUnit}>{product.unit}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.productPrice}>₹{product.price}</Text>
                  {product.originalPrice > product.price && (
                    <Text style={styles.productOriginalPrice}>₹{product.originalPrice}</Text>
                  )}
                  {product.discount > 0 && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{product.discount}% OFF</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.productDesc} numberOfLines={2}>
                  {product.description}
                </Text>
              </View>

              {/* Product Action */}
              <View style={styles.productAction}>
                <View style={styles.productImageBox}>
                  <Text style={{ fontSize: 32 }}>🛍️</Text>
                </View>

                {qty === 0 ? (
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => handleAddToCart(product)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addBtnText}>+ ADD</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.stepperContainer}>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => updateQty(product.id, qty - 1)}
                    >
                      <Text style={styles.stepperBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepperQty}>{qty}</Text>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => updateQty(product.id, qty + 1)}
                    >
                      <Text style={styles.stepperBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        })}
        <View style={{ height: cartItemCount > 0 ? 90 : 20 }} />
      </ScrollView>

      {/* Floating View Cart Bar */}
      {cartItemCount > 0 && (
        <View style={styles.floatingCartBar}>
          <View>
            <Text style={styles.cartBarCount}>{cartItemCount} {cartItemCount === 1 ? 'ITEM' : 'ITEMS'}</Text>
            <Text style={styles.cartBarPrice}>₹{cartSubtotal} <Text style={styles.cartBarPlusTax}>plus taxes</Text></Text>
          </View>
          <TouchableOpacity
            style={styles.cartBarBtn}
            onPress={() => onGoToCart?.()}
            activeOpacity={0.8}
          >
            <Text style={styles.cartBarBtnText}>View Cart 🛒 →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  headerBanner: {
    backgroundColor: Colors.primary,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl + 20,
    paddingHorizontal: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  headerTitle: { color: '#FFFFFF', fontSize: FontSize.md, fontWeight: '700' },

  storeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadow.md,
    marginBottom: -35,
  },
  storeRow: { flexDirection: 'row', alignItems: 'center' },
  storeEmojiBox: {
    width: 54,
    height: 54,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text.primary },
  storeAddress: { fontSize: FontSize.xs, color: Colors.text.secondary, marginTop: 2 },
  storeBadges: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  badgeRating: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeRatingText: { color: '#166534', fontSize: FontSize.xs, fontWeight: '700' },
  storeDot: { marginHorizontal: 6, color: Colors.text.tertiary },
  storeMetaText: { fontSize: FontSize.xs, color: Colors.text.secondary },

  categoryBar: {
    backgroundColor: '#FFFFFF',
    paddingTop: 45,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    backgroundColor: '#F1F5F9',
  },
  catPillActive: { backgroundColor: Colors.primary },
  catPillText: { fontSize: FontSize.sm, color: Colors.text.secondary, fontWeight: '500' },
  catPillTextActive: { color: '#FFFFFF', fontWeight: '700' },

  productList: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  sectionHeading: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.text.primary, marginBottom: Spacing.sm },

  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.xs,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  productDetails: { flex: 1, paddingRight: Spacing.md },
  productName: { fontSize: FontSize.base, fontWeight: FontWeight.semiBold, color: Colors.text.primary },
  productUnit: { fontSize: FontSize.xs, color: Colors.text.tertiary, marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 },
  productPrice: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text.primary },
  productOriginalPrice: { fontSize: FontSize.sm, color: Colors.text.tertiary, textDecorationLine: 'line-through' },
  discountBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 3 },
  discountText: { color: '#B45309', fontSize: 10, fontWeight: '700' },
  productDesc: { fontSize: FontSize.xs, color: Colors.text.secondary, marginTop: 6, lineHeight: 16 },

  productAction: { alignItems: 'center', width: 90 },
  productImageBox: {
    width: 75,
    height: 75,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  addBtn: {
    backgroundColor: '#FFF5F0',
    borderColor: Colors.primary,
    borderWidth: 1.5,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  addBtnText: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.sm },

  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 6,
    overflow: 'hidden',
  },
  stepperBtn: { paddingHorizontal: 10, paddingVertical: 4 },
  stepperBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  stepperQty: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSize.sm, paddingHorizontal: 4 },

  floatingCartBar: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: '#0F172A',
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadow.lg,
  },
  cartBarCount: { color: '#94A3B8', fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  cartBarPrice: { color: '#FFFFFF', fontSize: FontSize.base, fontWeight: '700' },
  cartBarPlusTax: { color: '#94A3B8', fontSize: 11, fontWeight: '400' },
  cartBarBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cartBarBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSize.sm },
});

export default StoreDetailScreen;
