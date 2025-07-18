import { create } from 'zustand';

export const useCartStore = create((set) => ({
  items: [],
  total: 0,
  
  // Add item to cart
  addItem: (product) => set((state) => {
    const existingItem = state.items.find(item => item._id === product._id);
    
    if (existingItem) {
      return {
        items: state.items.map(item =>
          item._id === product._id 
            ? { ...item, quantity: item.quantity + product.quantity } 
            : item
        ),
        total: state.total + (product.price * product.quantity)
      };
    }
    
    return {
      items: [...state.items, { ...product, quantity: product.quantity || 1 }],
      total: state.total + (product.price * (product.quantity || 1))
    };
  }),
  
  // Remove item from cart
  removeItem: (productId) => set((state) => {
    const itemToRemove = state.items.find(item => item._id === productId);
    if (!itemToRemove) return state;
    
    return {
      items: state.items.filter(item => item._id !== productId),
      total: state.total - (itemToRemove.price * itemToRemove.quantity)
    };
  }),
  
  // Update item quantity
  updateQuantity: (productId, newQuantity) => set((state) => {
    const itemToUpdate = state.items.find(item => item._id === productId);
    if (!itemToUpdate || newQuantity < 1 || newQuantity > itemToUpdate.availableQuantity) return state;
    
    const quantityDiff = newQuantity - itemToUpdate.quantity;
    
    return {
      items: state.items.map(item =>
        item._id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      ),
      total: state.total + (itemToUpdate.price * quantityDiff)
    };
  }),
  
  // Clear cart
  clearCart: () => set({ items: [], total: 0 })
}));