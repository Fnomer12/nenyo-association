'use client'

import { useMemo, useState } from 'react'

type Product = {
  id: string
  name: string
  price: number
  category?: string
  inStock?: boolean
}

export default function ShopPage() {
  const [query, setQuery] = useState('')
  const [cartCount, setCartCount] = useState(0)

  // Simple demo products (replace with DB later)
  const products: Product[] = [
    { id: '1', name: 'Nenyo T-Shirt', price: 120, category: 'Merch', inStock: true },
    { id: '2', name: 'Nenyo Cap', price: 70, category: 'Merch', inStock: true },
    { id: '3', name: 'Donation Support Pack', price: 50, category: 'Support', inStock: true },
    { id: '4', name: 'Sticker Pack', price: 25, category: 'Merch', inStock: false },
    { id: '5', name: 'Event Ticket (General)', price: 100, category: 'Tickets', inStock: true },
    { id: '6', name: 'Event Ticket (VIP)', price: 250, category: 'Tickets', inStock: true },
  ]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        (p.category ?? '').toLowerCase().includes(q)
      )
    })
  }, [query])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Shop</h1>
            <p className="text-sm text-gray-600 mt-1">
              Simple store for tickets, merch, and support items.
            </p>
          </div>

          <div className="bg-white rounded shadow px-4 py-2 text-sm">
            Cart: <span className="font-bold">{cartCount}</span>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded shadow p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full md:max-w-md border rounded px-3 py-2"
          />
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filtered.length}</span> items
          </div>
        </div>

        {/* Products */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded shadow p-5 flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold truncate">{p.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {p.category ?? 'General'}
                  </p>
                </div>

                <div className="text-lg font-bold">GHS {p.price}</div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    p.inStock ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {p.inStock ? 'In stock' : 'Out of stock'}
                </span>

                <button
                  disabled={!p.inStock}
                  onClick={() => setCartCount((c) => c + 1)}
                  className={`px-4 py-2 rounded text-white ${
                    p.inStock
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="text-sm text-gray-600">
          Next step: I can add a checkout flow (Paystack / Stripe), product details page, and real cart storage.
        </div>
      </div>
    </div>
  )
}
