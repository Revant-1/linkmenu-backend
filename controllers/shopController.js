import asyncHandler from 'express-async-handler';
import Shop from '../models/shopModel.js';

// @desc    Get all shops
// @route   GET /api/shops
// @access  Public
const getShops = asyncHandler(async (req, res) => {
  try {
    const shops = await Shop.find({});
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shops', error: error.message });
  }
});

// @desc    Get shop by slug
// @route   GET /api/shops/:slug
// @access  Public
const getShopBySlug = asyncHandler(async (req, res) => {
  const normalizedSlug = req.params.slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  try {
    let shop = await Shop.findOne({ slug: normalizedSlug });
    
    if (shop) {
      res.json(shop);
    } else {
      res.status(404).json({ message: 'Shop not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shop', error: error.message });
  }
});

// @desc    Create shop
// @route   POST /api/shops
// @access  Private
const createShop = asyncHandler(async (req, res) => {
  try {
    const slug = req.body.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, ''); // Slug generation

    // Check if slug already exists, if so append a number
    let existingShop = await Shop.findOne({ slug });
    if (existingShop) {
      slug += `-${Date.now()}`; // Append unique identifier
    }

    const shopData = {
      user: req.user._id,
      ...req.body,
      slug,
    };

    const shop = new Shop(shopData);
    const createdShop = await shop.save();

    res.status(201).json(createdShop);
  } catch (error) {
    res.status(500).json({ message: 'Error creating shop', error: error.message });
  }
});

// @desc    Update shop
// @route   PUT /api/shops/:id
// @access  Private
const updateShop = asyncHandler(async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }

    // Check authorization
    if (shop.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    // Generate new slug if name is changed
    const slug = req.body.name
      ? req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : shop.slug;

    const updatedData = {
      ...req.body,
      slug,
    };

    const updatedShop = await Shop.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });

    res.json(updatedShop);
  } catch (error) {
    res.status(500).json({ message: 'Error updating shop', error: error.message });
  }
});

// @desc    Delete shop
// @route   DELETE /api/shops/:id
// @access  Private
const deleteShop = asyncHandler(async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }

    if (shop.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    await shop.deleteOne();
    res.json({ message: 'Shop removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting shop', error: error.message });
  }
});

export {
  getShops,
  getShopBySlug,
  createShop,
  updateShop,
  deleteShop,
};