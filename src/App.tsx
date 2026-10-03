import React, { useState, useEffect } from "react";
import { usePathname } from "./routing";
import Lenis from "lenis";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CartDrawer, CartItem } from "./components/CartDrawer";
import { SearchModal } from "./components/SearchModal";
import { Product } from "./data/luxecartData";

import { HomePage } from "./pages/HomePage";
import { CollectionsPage } from "./pages/CollectionsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { CategoryDetailPage } from "./pages/CategoryDetailPage";
import { AboutPage } from "./pages/AboutPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { MembershipPage } from "./pages/MembershipPage";
import { JournalIndexPage } from "./pages/JournalIndexPage";
import { JournalDetailPage } from "./pages/JournalDetailPage";
import { ContactPage } from "./pages/ContactPage";
import { FaqPage } from "./pages/FaqPage";

export default function App() {
  const pathname = usePathname();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Cart starts empty — items are added only when user explicitly adds them
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Lenis Smooth Scroll Initialization
  useEffect(() => {
    // Respect prefers-reduced-motion
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Scroll to top and set title on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    const baseTitle = "LuxeCart — Durbar Marg, Kathmandu";
    if (pathname === "/") document.title = baseTitle;
    else if (pathname.startsWith("/collections/")) {
      const slug = pathname.replace("/collections/", "");
      document.title = `${slug.replace(/-/g, " ").toUpperCase()} — LuxeCart`;
    } else if (pathname.startsWith("/categories/")) {
      const slug = pathname.replace("/categories/", "");
      document.title = `${slug.replace(/-/g, " ").toUpperCase()} — LuxeCart`;
    } else if (pathname.startsWith("/journal/")) {
      const slug = pathname.replace("/journal/", "");
      document.title = `${slug.replace(/-/g, " ").toUpperCase()} — Luxe Journal`;
    } else {
      const pageName = pathname.slice(1).replace(/-/g, " ");
      document.title = `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} — LuxeCart`;
    }
  }, [pathname]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number, color: string) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.color === color
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, color }];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Route Matching Logic
  let pageContent: React.ReactNode;

  if (pathname === "/") {
    pageContent = <HomePage />;
  } else if (pathname === "/collections") {
    pageContent = <CollectionsPage />;
  } else if (pathname.startsWith("/collections/")) {
    const slug = pathname.replace("/collections/", "");
    pageContent = (
      <ProductDetailPage
        slug={slug}
        onAddToCart={handleAddToCart}
      />
    );
  } else if (pathname === "/categories") {
    pageContent = <CategoriesPage />;
  } else if (pathname.startsWith("/categories/")) {
    const slug = pathname.replace("/categories/", "");
    pageContent = <CategoryDetailPage slug={slug} />;
  } else if (pathname === "/about") {
    pageContent = <AboutPage />;
  } else if (pathname === "/reviews") {
    pageContent = <ReviewsPage />;
  } else if (pathname === "/membership") {
    pageContent = <MembershipPage />;
  } else if (pathname === "/journal") {
    pageContent = <JournalIndexPage />;
  } else if (pathname.startsWith("/journal/")) {
    const slug = pathname.replace("/journal/", "");
    pageContent = <JournalDetailPage slug={slug} />;
  } else if (pathname === "/contact") {
    pageContent = <ContactPage />;
  } else if (pathname === "/faq") {
    pageContent = <FaqPage />;
  } else {
    pageContent = <HomePage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white font-body selection:bg-red-600 selection:text-white">
      {/* Shared Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Main Page Content */}
      <div className="flex-1">{pageContent}</div>

      {/* Shared Footer */}
      <Footer />

      {/* Slide-over Cart & Search Modals */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
