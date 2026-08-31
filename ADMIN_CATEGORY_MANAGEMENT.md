# Admin: Category-Specific Product Management Guide

## 🎯 Overview

You can now assign products to specific categories (Eyeglasses, Sunglasses, Contact Lens) directly from the admin panel. This makes it easy to organize which products appear on each category page.

---

## 📍 Where to Find This Feature

1. **Go to Admin Panel**: Navigate to `/admin`
2. **Select Categories & Products Tab** in the left sidebar
3. **Scroll to "Step 5"**: "Manage Products by Category"

---

## 🏗️ How It Works

### The Flow:

```
Create Product → Assign to Category → View on Category Page
(Step 2)         (Step 5)              (Auto-displays)
```

### Step 1: Create a Product
In **Step 2** of the admin panel:
1. Enter product details (Name, Slug, Price, Images, etc.)
2. **Select Category**: Choose from Eyeglasses, Sunglasses, Contact Lens, or any custom category
3. Click "Save Product to Catalogue"

### Step 2: Assign to Category Page
In **Step 5** "Manage Products by Category":
- You'll see **3 product panels**:
  - 🔵 **Eyeglasses** (Blue)
  - 🟠 **Sunglasses** (Amber)
  - 🩷 **Contact Lens** (Pink)

### Step 3: Add Products to Category
For each category panel:
1. Click **"Add"** button
2. Search for products by name or category
3. Click on a product to add it
4. Product appears in the "pinned" list below

### Step 4: Remove from Category
To remove a product from a category:
- Click the **✕** button next to the product in the pinned list

---

## 📊 Visual Overview

```
┌─────────────────────────────────────────────┐
│ Step 5: Manage Products by Category         │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  │ 🔵 Eyeglasses │  │ 🟠 Sunglasses │  │ 🩷 Contact  │
│  │               │  │               │  │   Lens     │
│  │ [+ Add]      │  │ [+ Add]       │  │ [+ Add]    │
│  │               │  │               │  │            │
│  │ ✓ Avery      │  │ ✓ Sienna      │  │ (empty)    │
│  │   Classic [✕]│  │   Round [✕]   │  │            │
│  │               │  │               │  │            │
│  │ ✓ Vantage    │  │ ✓ Maven       │  │            │
│  │   Square [✕] │  │   Aviator [✕] │  │            │
│  │               │  │               │  │            │
│  └──────────────┘  └──────────────┘  └──────────────┘
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎨 What Happens When You Assign Products?

### On the Category Pages:
- **Admin-assigned products appear FIRST** in the product listing
- **Other matching products appear after**, filtered by category
- Products show with all filters (Gender, Shape, Material)
- Users can still sort by price, newest, featured

### Data Flow:
```
Admin Panel                    Category Pages
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Eyeglasses Products ID List → /eyeglasses
  - frame-001                   ✓ Avery Classic (pinned first)
  - frame-003                   ✓ Vantage Square (pinned second)
  - frame-005                   🔹 Other eyeglasses below
                                   (filtered by category)

Sunglasses Products ID List → /sunglasses
  - frame-002                   ✓ Sienna Round (pinned first)
  - frame-004                   ✓ Maven Aviator (pinned second)
  - frame-008                   ✓ [Additional products]
                                🔹 Other sunglasses below
                                   (filtered by category)

Contact Lens Products ID List → /contact-lens
  - frame-006                   ✓ Contact lenses (pinned)
  - frame-007                   🔹 Other contact lens
                                   products below
```

---

## ⚙️ Advanced Features

### Auto-Cleanup
When you **delete a product** from the catalogue:
- It's automatically removed from ALL category assignments
- You don't need to manually remove it from each category

### Multiple Category Assignment
A **single product CAN belong to multiple categories**:
- Example: "UV Protection Glasses" can be in both Eyeglasses AND Sunglasses
- Just add it to multiple category panels

### View Assigned Products
- Products with **blue checkmarks (✓)** = assigned to that category
- Helps you see at a glance which products are pinned

---

## 📝 Best Practices

✅ **DO:**
- Assign at least 3-5 top products to each category for good UX
- Keep premium/best-selling items pinned at the top
- Use this alongside the product category field

❌ **DON'T:**
- Assign too many products (10+ per category gets cluttered)
- Assign irrelevant products to categories
- Forget to test the category pages after changes

---

## 🔄 How It Updates

### Real-time Sync:
1. Changes save immediately to browser storage
2. Click **"Save"** at top to sync to database (Supabase)
3. Category pages **auto-refresh** without page reload
4. Changes visible instantly if using same device

### Cross-Device Sync:
- On another device, refresh the category page
- Products appear in the newly assigned order

---

## 🚀 Example Workflow

### Scenario: Launch New Sunglasses Collection

1. **In Admin - Step 2**:
   - Add 5 new sunglasses products
   - Set Category = "Sunglasses"

2. **In Admin - Step 5**:
   - Open Sunglasses panel
   - Click Add
   - Search and select the 5 new products
   - They appear in pinned list

3. **Result**:
   - Users visit `/sunglasses`
   - See new products at the top
   - Can filter by style, gender, etc.
   - All in one organized place

---

## 🆘 Troubleshooting

### Products not showing on category page?
- ✓ Check: Is the product's category field set correctly?
- ✓ Check: Did you click Save at the top of the admin page?
- ✓ Check: Try refreshing the category page

### Can't find a product to add?
- ✓ Product might not be created yet (see Step 2)
- ✓ Try searching by partial name
- ✓ Check if product is already added to the category

### Product disappeared from category?
- ✓ Might have been deleted from catalogue
- ✓ Check Step 3: Product Inventory to verify it exists

---

## 📱 Mobile Responsive

All category pages are fully responsive:
- **Desktop**: Shows filters sidebar + products grid
- **Tablet**: Grid adjusts to 2 columns
- **Mobile**: Single column, filters in drawer

---

## 🔗 Related Pages

- **Eyeglasses Page**: `/eyeglasses`
- **Sunglasses Page**: `/sunglasses`
- **Contact Lens Page**: `/contact-lens`
- **Admin Panel**: `/admin`

---

## 💾 Data Storage

Category product assignments are stored in:
- **Local Storage**: `drishyam_site_content` (browser cache)
- **Supabase**: `site_content` table (cloud backup)

Fields:
- `eyeglassesProductIds`: `string[]` - Product IDs for eyeglasses
- `sunglassesProductIds`: `string[]` - Product IDs for sunglasses
- `contactLensProductIds`: `string[]` - Product IDs for contact lens

---

**Last Updated**: 2026-08-31
**Feature Version**: 1.0
