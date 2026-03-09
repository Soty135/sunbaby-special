import React, { createContext, useContext, useCallback } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
        loading: false
      };
    case 'ADD_TO_CART':
      return {
        ...state,
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
        loading: false
      };
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
        loading: false
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
        loading: false
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalAmount: 0,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  totalAmount: 0,
  loading: false
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(cartReducer, initialState);

  // Clear dummy cart items on initial load
  React.useEffect(() => {
    const guestCart = localStorage.getItem('guestCart');
    if (guestCart) {
      try {
        const parsed = JSON.parse(guestCart);
        const filteredItems = parsed.items?.filter(item => 
          item.menuItem && 
          item.menuItem.name && 
          item.menuItem.name !== 'Unknown Item' &&
          item.menuItem.name !== 'Error Loading Item'
        );
        
        if (filteredItems && filteredItems.length !== parsed.items?.length) {
          localStorage.setItem('guestCart', JSON.stringify({
            ...parsed,
            items: filteredItems,
            totalAmount: filteredItems.reduce((total, item) => total + (item.price * item.quantity), 0)
          }));
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
        localStorage.removeItem('guestCart');
      }
    }
  }, []);

  const getCart = useCallback(async () => {
    try {
      // For guest cart, use localStorage
      const guestCart = localStorage.getItem('guestCart');
      const cartData = guestCart ? JSON.parse(guestCart) : { items: [], totalAmount: 0 };
      
      // Only keep items that have valid menuItem data
      const validItems = cartData.items.filter(item => item.menuItem && item.menuItem.name !== 'Error Loading Item');
      const filteredCart = {
        ...cartData,
        items: validItems,
        totalAmount: validItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      };
      
      dispatch({ type: 'SET_CART', payload: filteredCart });
      return filteredCart;
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch({ type: 'SET_CART', payload: { items: [], totalAmount: 0 } });
      return { items: [], totalAmount: 0 };
    }
  }, []);

  const addToCart = useCallback(async (menuItemId, quantity = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Get current cart from localStorage and clear dummy items first
      const guestCart = localStorage.getItem('guestCart');
      const currentCart = guestCart ? JSON.parse(guestCart) : { items: [], totalAmount: 0 };
      
      // Remove any dummy/invalid items first
      currentCart.items = currentCart.items.filter(item => 
        item.menuItem && 
        item.menuItem.name && 
        item.menuItem.name !== 'Unknown Item' &&
        item.menuItem.name !== 'Error Loading Item'
      );
      
      // Add item to cart
      const existingItemIndex = currentCart.items.findIndex(item => item.menuItemId === menuItemId);
      
      if (existingItemIndex >= 0) {
        currentCart.items[existingItemIndex].quantity += quantity;
      } else {
        // Fetch actual menu item details from API
        try {
          const response = await api.get('/api/menu');
          const allMenuItems = response.data;
          const menuItem = allMenuItems.find(item => item._id === menuItemId);
          
          if (menuItem && menuItem.price > 0) {
            currentCart.items.push({
              menuItemId: menuItemId,
              quantity,
              price: menuItem.price,
              menuItem: {
                _id: menuItem._id,
                name: menuItem.name,
                imageURL: menuItem.imageURL
              }
            });
          } else {
            throw new Error('Menu item not found or has no price');
          }
        } catch (fetchError) {
          console.error('Failed to fetch menu items:', fetchError);
          throw new Error('Failed to load menu item details');
        }
      }
      
      // Update total
      currentCart.totalAmount = currentCart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Save to localStorage
      localStorage.setItem('guestCart', JSON.stringify(currentCart));
      
      dispatch({ type: 'ADD_TO_CART', payload: currentCart });
      return currentCart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to add item to cart. Please try again.',
      });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  }, []);

  const updateCartItem = useCallback(async (menuItemId, quantity) => {
    if (quantity < 1) return;
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const guestCart = localStorage.getItem('guestCart');
      const currentCart = guestCart ? JSON.parse(guestCart) : { items: [], totalAmount: 0 };
      
      const existingItemIndex = currentCart.items.findIndex(item => item.menuItemId === menuItemId);
      
      if (existingItemIndex >= 0) {
        currentCart.items[existingItemIndex].quantity = quantity;
      }
      
      currentCart.totalAmount = currentCart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      localStorage.setItem('guestCart', JSON.stringify(currentCart));
      
      dispatch({ type: 'UPDATE_CART_ITEM', payload: currentCart });
      return currentCart;
    } catch (error) {
      console.error('Error updating cart item:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update cart. Please try again.',
      });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  }, []);

  const removeFromCart = useCallback(async (menuItemId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const guestCart = localStorage.getItem('guestCart');
      const currentCart = guestCart ? JSON.parse(guestCart) : { items: [], totalAmount: 0 };
      
      currentCart.items = currentCart.items.filter(item => item.menuItemId !== menuItemId);
      currentCart.totalAmount = currentCart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      localStorage.setItem('guestCart', JSON.stringify(currentCart));
      
      dispatch({ type: 'REMOVE_FROM_CART', payload: currentCart });
      return currentCart;
    } catch (error) {
      console.error('Error removing from cart:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to remove item from cart. Please try again.',
      });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      localStorage.removeItem('guestCart');
      
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to clear cart. Please try again.',
      });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        ...state,
        getCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};