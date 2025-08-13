'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Trash2, Edit2, Package, DollarSign, Search, Filter, Camera, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface GearItem {
  id: string
  name: string
  category: string
  brand: string
  model: string
  serialNumber?: string
  purchaseDate?: string
  purchasePrice?: number
  currentValue?: number
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  location?: string
  notes?: string
  imageUrl?: string
  warrantyExpiry?: string
  lastService?: string
}

const categories = [
  'Guitars',
  'Bass',
  'Keyboards',
  'Drums',
  'Microphones',
  'Amplifiers',
  'Effects Pedals',
  'Audio Interfaces',
  'Monitors/Speakers',
  'Cables',
  'Accessories',
  'Recording Equipment',
  'Live Sound',
  'Other'
]

export default function GearListManager() {
  const [gearItems, setGearItems] = useState<GearItem[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<GearItem | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'date'>('name')

  const [formData, setFormData] = useState<Partial<GearItem>>({
    name: '',
    category: 'Guitars',
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    purchasePrice: 0,
    currentValue: 0,
    condition: 'Good',
    location: '',
    notes: '',
    warrantyExpiry: '',
    lastService: ''
  })

  useEffect(() => {
    const saved = localStorage.getItem('musicGearList')
    if (saved) {
      setGearItems(JSON.parse(saved))
    }
  }, [])

  const saveToLocalStorage = (items: GearItem[]) => {
    localStorage.setItem('musicGearList', JSON.stringify(items))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.brand) return

    const newItem: GearItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.name!,
      category: formData.category!,
      brand: formData.brand!,
      model: formData.model!,
      serialNumber: formData.serialNumber,
      purchaseDate: formData.purchaseDate,
      purchasePrice: formData.purchasePrice,
      currentValue: formData.currentValue,
      condition: formData.condition as GearItem['condition'],
      location: formData.location,
      notes: formData.notes,
      warrantyExpiry: formData.warrantyExpiry,
      lastService: formData.lastService
    }

    let updatedItems: GearItem[]
    if (editingItem) {
      updatedItems = gearItems.map(item => item.id === editingItem.id ? newItem : item)
    } else {
      updatedItems = [...gearItems, newItem]
    }

    setGearItems(updatedItems)
    saveToLocalStorage(updatedItems)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Guitars',
      brand: '',
      model: '',
      serialNumber: '',
      purchaseDate: '',
      purchasePrice: 0,
      currentValue: 0,
      condition: 'Good',
      location: '',
      notes: '',
      warrantyExpiry: '',
      lastService: ''
    })
    setShowAddForm(false)
    setEditingItem(null)
  }

  const deleteItem = (id: string) => {
    const updatedItems = gearItems.filter(item => item.id !== id)
    setGearItems(updatedItems)
    saveToLocalStorage(updatedItems)
  }

  const editItem = (item: GearItem) => {
    setFormData(item)
    setEditingItem(item)
    setShowAddForm(true)
  }

  const getTotalValue = () => {
    return gearItems.reduce((sum, item) => sum + (item.currentValue || 0), 0)
  }

  const getItemsByCategory = () => {
    const counts: Record<string, number> = {}
    gearItems.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1
    })
    return counts
  }

  const filteredAndSortedItems = () => {
    let filtered = gearItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.model.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'value':
          return (b.currentValue || 0) - (a.currentValue || 0)
        case 'date':
          return new Date(b.purchaseDate || 0).getTime() - new Date(a.purchaseDate || 0).getTime()
        default:
          return 0
      }
    })

    return filtered
  }

  const exportGearList = () => {
    const items = filteredAndSortedItems()
    let content = `Music Gear Inventory
Generated: ${new Date().toLocaleDateString()}
Total Items: ${items.length}
Total Value: $${getTotalValue().toFixed(2)}

GEAR LIST:
${items.map(item => `
${item.name}
Brand: ${item.brand} | Model: ${item.model}
Category: ${item.category}
Condition: ${item.condition}
Purchase Date: ${item.purchaseDate || 'N/A'}
Purchase Price: $${item.purchasePrice || 0}
Current Value: $${item.currentValue || 0}
Serial Number: ${item.serialNumber || 'N/A'}
Location: ${item.location || 'N/A'}
${item.notes ? `Notes: ${item.notes}` : ''}
---`).join('\n')}
`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'gear_inventory.txt'
    a.click()
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'text-green-600 bg-green-100'
      case 'Good': return 'text-blue-600 bg-blue-100'
      case 'Fair': return 'text-yellow-600 bg-yellow-100'
      case 'Poor': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const checkWarrantyExpiry = (date?: string) => {
    if (!date) return false
    const expiry = new Date(date)
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    return expiry <= thirtyDaysFromNow && expiry >= today
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tools
        </Link>

        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg mr-4">
                <Package className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gear List Manager</h1>
                <p className="text-gray-600 mt-1">Track your music equipment inventory</p>
              </div>
            </div>
            <button
              onClick={exportGearList}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Export List
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{gearItems.length}</p>
                </div>
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-green-600">${getTotalValue().toFixed(0)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-blue-600">{Object.keys(getItemsByCategory()).length}</p>
                </div>
                <Filter className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Warranties</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {gearItems.filter(item => checkWarrantyExpiry(item.warrantyExpiry)).length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search gear..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="name">Sort by Name</option>
              <option value="value">Sort by Value</option>
              <option value="date">Sort by Date</option>
            </select>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Gear
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                {editingItem ? 'Edit Gear Item' : 'Add New Gear'}
              </h3>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Studio, Home, Storage, etc."
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                  <input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Value</label>
                  <input
                    type="number"
                    value={formData.currentValue}
                    onChange={(e) => setFormData({ ...formData, currentValue: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Expiry</label>
                  <input
                    type="date"
                    value={formData.warrantyExpiry}
                    onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Service</label>
                  <input
                    type="date"
                    value={formData.lastService}
                    onChange={(e) => setFormData({ ...formData, lastService: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none h-20"
                    placeholder="Additional notes about this gear..."
                  />
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    {editingItem ? 'Update' : 'Add'} Gear
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Gear List */}
          <div className="space-y-4">
            {filteredAndSortedItems().length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {searchTerm || selectedCategory !== 'All' 
                    ? 'No gear found matching your filters.'
                    : 'No gear added yet. Start building your inventory!'}
                </p>
              </div>
            ) : (
              filteredAndSortedItems().map(item => (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getConditionColor(item.condition)}`}>
                          {item.condition}
                        </span>
                        {checkWarrantyExpiry(item.warrantyExpiry) && (
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Warranty expiring
                          </span>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>Brand: <span className="font-medium">{item.brand}</span></div>
                        <div>Model: <span className="font-medium">{item.model}</span></div>
                        <div>Category: <span className="font-medium">{item.category}</span></div>
                        {item.location && <div>Location: <span className="font-medium">{item.location}</span></div>}
                        {item.serialNumber && <div>Serial: <span className="font-medium">{item.serialNumber}</span></div>}
                        {item.purchaseDate && <div>Purchased: <span className="font-medium">{new Date(item.purchaseDate).toLocaleDateString()}</span></div>}
                      </div>
                      {item.notes && (
                        <p className="text-sm text-gray-500 mt-2">{item.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        {item.currentValue && (
                          <p className="text-lg font-semibold text-green-600">${item.currentValue}</p>
                        )}
                        {item.purchasePrice && item.currentValue && item.purchasePrice !== item.currentValue && (
                          <p className="text-xs text-gray-500">
                            {item.currentValue > item.purchasePrice ? '↑' : '↓'} 
                            ${Math.abs(item.currentValue - item.purchasePrice)}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => editItem(item)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}