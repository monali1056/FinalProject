import { useState } from "react";

export function useWishlist() {
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rentease_wishlist") || "[]"); }
    catch { return []; }
  });

  const toggle = (id) => {
    setWishlist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem("rentease_wishlist", JSON.stringify(next));
      return next;
    });
  };

  return { wishlist, toggle };
}
