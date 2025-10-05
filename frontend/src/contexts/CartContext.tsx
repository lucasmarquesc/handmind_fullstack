// src/contexts/CartContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';


interface CartContextType {
    itemsCount: number;
    addToCart: () => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps { children: ReactNode; }

export function CartProvider({ children }: CartProviderProps) {
    const [itemsCount, setItemsCount] = useState<number>(0);
    const addToCart = () => setItemsCount(prev => prev + 1);
    const clearCart = () => setItemsCount(0);
    const contextValue: CartContextType = { itemsCount, addToCart, clearCart };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart deve ser usado dentro de um CartProvider');
    }
    return context;
}