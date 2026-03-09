import React, { useState, useEffect } from 'react';
import useCart from '../hooks/useCart';
import { getMediaUrl } from '../services/api';
import Swal from 'sweetalert2';

const Cart = () => {
  const { items, totalAmount, loading, getCart, updateCartItem, removeFromCart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    getCart();
  }, [getCart]);

  const handleQuantityChange = async (menuItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(menuItemId, newQuantity);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update quantity. Please try again.',
      });
    }
  };

  const handleRemoveItem = async (menuItemId, itemName) => {
    const result = await Swal.fire({
      title: 'Remove Item?',
      text: `Are you sure you want to remove ${itemName || 'this item'} from your cart?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await removeFromCart(menuItemId);
        Swal.fire({
          icon: 'success',
          title: 'Removed!',
          text: 'Item has been removed from your cart.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to remove item. Please try again.',
        });
      }
    }
  };

  const generateWhatsAppMessage = () => {
    const orderList = items.map((item, index) => 
      `${index + 1}. ${item.quantity}x ${item.menuItem?.name || 'Item'} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const message = `🍲 *New Order from Sunbaby Special*

${orderList}

💰 *Total: $${totalAmount.toFixed(2)}*

Please confirm my order. Thank you! 🙏`;
    
    const phoneNumber = '2347030462122';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cart Empty',
        text: 'Your cart is empty! Please add some items before checkout.',
      });
      setIsCheckingOut(false);
      return;
    }
    
    setIsCheckingOut(true);
    generateWhatsAppMessage();
    
    setTimeout(() => {
      Swal.fire({
        title: 'Order Placed!',
        text: 'Would you like to clear your cart after placing this order?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, clear cart',
        cancelButtonText: 'No, keep items'
      }).then((result) => {
        if (result.isConfirmed) {
          clearCart();
        }
      });
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-600">Processing your order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">🍲 Sunbaby Special</h1>
            <p className="text-xl text-gray-600">Guest Checkout</p>
          </div>
        
          {/* Cart Content */}
          <div className="space-y-6 mb-6">
            {items.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                <p className="text-xl text-gray-600">
                  Looks like you haven't added any delicious items to your cart yet!
                </p>
                <a
                  href="/menu"
                  className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
                >
                  Browse Menu
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                {items.map((item, index) => (
                  <div key={`${item.menuItemId}-${index}`} className="bg-white rounded-lg shadow-md p-6 mb-4">
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.menuItem?.imageURL ? (
                            <img 
                              src={getMediaUrl(item.menuItem.imageURL)} 
                              alt={item.menuItem?.name || 'Item'}
                              className="w-full h-full object-cover rounded-lg"
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <span className="text-2xl">🍽️</span>
                          )}
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="font-semibold text-gray-800">{item.menuItem?.name || 'Item'}</h3>
                          <p className="text-gray-600 text-sm">${item.price?.toFixed(2) || '0.00'} each</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.menuItemId, item.quantity - 1)}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-l w-8 h-8 flex items-center justify-center"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.menuItemId, item.quantity + 1)}
                            className="bg-green-500 hover:bg-green-600 text-white rounded-r w-8 h-8 flex items-center justify-center"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.menuItemId, item.menuItem?.name)}
                            className="bg-gray-500 hover:bg-gray-600 text-white rounded ml-2 w-8 h-8 flex items-center justify-center"
                            title="Remove item"
                          >
                            ×
                          </button>
                        </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span className="text-green-600">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={handleCheckout}
                        className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="ml-2">Placing order...</span>
                        ) : (
                          <span>Place Order via WhatsApp</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;