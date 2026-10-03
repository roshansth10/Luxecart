import React from "react";
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { PRODUCTS, STORE_INFO } from "../data/luxecartData";

export interface CartItem {
  product: (typeof PRODUCTS)[0];
  quantity: number;
  color: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: CartItem[];
  onUpdateQuantity?: (id: string, delta: number) => void;
  onRemoveItem?: (id: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
}) => {
  if (!isOpen) return null;

  const subtotalNpr = cartItems.reduce(
    (sum, item) => sum + item.product.priceNpr * item.quantity,
    0
  );

  const isFreeShipping = subtotalNpr >= STORE_INFO.freeShippingThresholdNpr;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn font-body">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-neutral-950 border-l border-neutral-800 text-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-red-500 stroke-[1.5]" />
              <h2 className="font-heading text-lg tracking-wider font-bold uppercase">
                Your Bag ({cartItems.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-2.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 space-y-3 text-neutral-400">
                <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-neutral-600" />
                <p className="text-sm">Your luxury bag is currently empty.</p>
              </div>
            ) : (
              cartItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 pb-6 border-b border-neutral-900"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover bg-black border border-neutral-800"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-heading text-sm font-semibold text-white">
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => onRemoveItem && onRemoveItem(item.product.id)}
                          aria-label="Remove item"
                          className="text-neutral-500 hover:text-red-500 transition-colors p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4 stroke-[1.5]" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">
                        Color: {item.color}
                      </p>
                    </div>

                    <div className="flex justify-between items-end mt-3">
                      <div className="flex items-center border border-neutral-800 rounded bg-neutral-900">
                        <button
                          onClick={() => onUpdateQuantity && onUpdateQuantity(item.product.id, -1)}
                          className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white min-w-[36px] min-h-[36px] flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity && onUpdateQuantity(item.product.id, 1)}
                          className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white min-w-[36px] min-h-[36px] flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono text-sm font-bold text-white">
                        {item.product.formattedPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          <div className="p-5 sm:p-6 border-t border-neutral-900 bg-neutral-950 space-y-4">
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="text-white font-bold">Rs. {subtotalNpr.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Kathmandu & Nepal Express Delivery</span>
                <span className={isFreeShipping ? "text-emerald-400 font-bold" : "text-neutral-400"}>
                  {isFreeShipping ? "FREE" : "Rs. 500"}
                </span>
              </div>
              <div className="flex justify-between text-sm text-white font-bold pt-2 border-t border-neutral-900">
                <span>Total</span>
                <span>Rs. {(subtotalNpr + (isFreeShipping ? 0 : 500)).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert("Proceeding to secure checkout.");
                onClose();
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold font-mono text-xs uppercase tracking-widest py-3.5 rounded-none flex items-center justify-center gap-2 transition-all duration-300 min-h-[48px] cursor-pointer shadow-lg active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-neutral-500 font-mono">
              🔒 256-bit Encrypted Checkout • Durbar Marg, Kathmandu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
