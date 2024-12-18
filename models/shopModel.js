import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  imageUrl: {
    type: String,
    required: false,
  }
});

const themeSchema = new mongoose.Schema({
  primary: {
    type: String,
    required: true,
    default: '#4A5568'
  },
  secondary: {
    type: String,
    required: true,
    default: '#F7FAFC'
  },
  accent: {
    type: String,
    required: true,
    default: '#ED8936'
  },
  background: {
    type: String,
    required: true,
    default: 'from-gray-50 to-gray-100'
  },
  text: {
    type: String,
    required: true,
    default: '#2D3748'
  }
});

const socialSchema = new mongoose.Schema({
  instagram: String,
  facebook: String,
  twitter: String,
  youtube: String,
  tiktok: String,
  linkedin: String,
  website: String,
  reviews: String
});

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  items: {
    type: [menuItemSchema],
    default: []
  }
});

const shopSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  hours: {
    type: String,
    required: true,
  },
  established: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  orderUrl: {
    type: String,
    required: true,
  },
  locationUrl: {
    type: String,
    required: true,
  },
  social: {
    type: socialSchema,
    default: {},
  },
  theme: {
    type: themeSchema,
    required: true,
  },
  menu: {
    type: [categorySchema],
    default: []
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

// Create slug from name before saving
shopSchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  // More robust slug generation
  this.slug = this.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')   // Replace non-alphanumeric with dash
    .replace(/^-+|-+$/g, '');       // Remove leading/trailing dashes
  next();
});

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;