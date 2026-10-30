// Seller App — Product & Inventory Management Screen

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, TextInput, Modal, StatusBar, Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadow } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

const ProductsScreen = () => {
  const [products, setProducts] = useState([
    { id: '1', name: 'Amul Full Cream Milk', category: 'Dairy', price: 66, unit: '1 Litre', inStock: true, stockCount: 42 },
    { id: '2', name: 'Fresh Tomatoes', category: 'Vegetables', price: 30, unit: '500g', inStock: true, stockCount: 18 },
    { id: '3', name: 'Tata Salt Vacuum Evaporated', category: 'Groceries', price: 20, unit: '1 Kg', inStock: true, stockCount: 85 },
    { id: '4', name: 'Fortune Sunlite Sunflower Oil', category: 'Groceries', price: 145, unit: '1 Litre', inStock: false, stockCount: 0 },
    { id: '5', name: 'Aashirvaad Superior MP Atta', category: 'Groceries', price: 235, unit: '5 Kg', inStock: true, stockCount: 7 },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Groceries');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductUnit, setNewProductUnit] = useState('');
  const [newProductStock, setNewProductStock] = useState('20');

  const toggleStock = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const handleAddProduct = () => {
    if (!newProductName || !newProductPrice || !newProductUnit) {
      Alert.alert('Incomplete details', 'Please fill name, price, and unit.');
      return;
    }

    const newProd = {
      id: String(Date.now()),
      name: newProductName,
      category: newProductCategory,
      price: parseFloat(newProductPrice) || 0,
      unit: newProductUnit,
      inStock: true,
      stockCount: parseInt(newProductStock, 10) || 10,
    };

    setProducts([newProd, ...products]);
    setModalVisible(false);
    setNewProductName('');
    setNewProductPrice('');
    setNewProductUnit('');
    Alert.alert('Product Added! 🎉', `${newProd.name} is now visible in your store catalog.`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Screen Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Store Inventory</Text>
          <Text style={styles.headerSubtitle}>{products.length} products listed • {products.filter((p) => p.inStock).length} active in-stock</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addBtnText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {products.map((item) => (
          <View key={item.id} style={styles.productCard}>
            <View style={styles.productLeft}>
              <View style={styles.productIconBox}>
                <Text style={{ fontSize: 24 }}>🛍️</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productCategory}>{item.category} • {item.unit}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.priceText}>₹{item.price}</Text>
                  <Text style={[styles.stockBadge, item.stockCount < 10 && item.inStock ? styles.lowStock : null]}>
                    {item.inStock ? `Stock: ${item.stockCount} left` : 'Out of Stock'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Toggle Availability Switch */}
            <View style={styles.productRight}>
              <Text style={[styles.toggleLabel, { color: item.inStock ? '#16A34A' : '#94A3B8' }]}>
                {item.inStock ? 'In Stock' : 'Out'}
              </Text>
              <Switch
                value={item.inStock}
                onValueChange={() => toggleStock(item.id)}
                trackColor={{ false: '#CBD5E1', true: '#16A34A' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Product Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Product to Store</Text>

            <Text style={styles.inputLabel}>Product Title</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="e.g. Fortune Sunflower Oil"
              value={newProductName}
              onChangeText={setNewProductName}
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Price (₹)</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="e.g. 120"
                  keyboardType="numeric"
                  value={newProductPrice}
                  onChangeText={setNewProductPrice}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Unit / Weight</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="e.g. 1 Kg / 500ml"
                  value={newProductUnit}
                  onChangeText={setNewProductUnit}
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>Initial Stock Quantity</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="e.g. 25"
              keyboardType="numeric"
              value={newProductStock}
              onChangeText={setNewProductStock}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleAddProduct}
              >
                <Text style={styles.submitBtnText}>Add Product</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { fontSize: FontSize.xs, color: '#A7F3D0', marginTop: 2 },
  addBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addBtnText: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.xs },

  scrollContent: { padding: Spacing.md, gap: Spacing.sm },

  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadow.xs,
  },
  productLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  productIconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text.primary },
  productCategory: { fontSize: 11, color: Colors.text.tertiary, marginTop: 1 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  priceText: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary },
  stockBadge: { fontSize: 10, color: Colors.text.secondary, backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  lowStock: { color: '#B45309', backgroundColor: '#FEF3C7' },

  productRight: { alignItems: 'center', marginLeft: 10 },
  toggleLabel: { fontSize: 10, fontWeight: '700', marginBottom: 2 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    ...Shadow.lg,
  },
  modalTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text.primary, marginBottom: Spacing.md },
  inputLabel: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.text.primary, marginBottom: 4, marginTop: 8 },
  inputBox: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: FontSize.sm,
    backgroundColor: '#F8FAFC',
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: Spacing.lg },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  cancelBtnText: { color: Colors.text.secondary, fontWeight: '600', fontSize: FontSize.sm },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  submitBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSize.sm },
});

export default ProductsScreen;
