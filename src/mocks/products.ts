import type { Product, ProductConnection, Collection, CollectionConnection } from '@/types'

const mockProducts: Product[] = [
  {
    id: 'gid://shopify/Product/1',
    handle: 'classic-white-t-shirt',
    title: 'Classic White T-Shirt',
    description:
      'A timeless essential made from premium 100% organic cotton. Perfect for everyday wear with a comfortable regular fit.',
    descriptionHtml:
      '<p>A timeless essential made from premium 100% organic cotton. Perfect for everyday wear with a comfortable regular fit.</p><ul><li>100% organic cotton</li><li>Regular fit</li><li>Machine washable</li><li>Ethically produced</li></ul>',
    availableForSale: true,
    totalInventory: 150,
    priceRange: {
      minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '29.99', currencyCode: 'USD' },
    },
    images: {
      edges: [
        {
          node: {
            id: '1',
            url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20cotton%20t-shirt%20on%20plain%20background%20product%20photo&image_size=square_hd',
            altText: 'Classic White T-Shirt',
            width: 1024,
            height: 1024,
          },
        },
        {
          node: {
            id: '2',
            url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20tshirt%20back%20view%20product%20photography&image_size=square_hd',
            altText: 'Classic White T-Shirt Back',
            width: 1024,
            height: 1024,
          },
        },
      ],
    },
    featuredImage: {
      id: '1',
      url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20cotton%20t-shirt%20on%20plain%20background%20product%20photo&image_size=square_hd',
      altText: 'Classic White T-Shirt',
      width: 1024,
      height: 1024,
    },
    options: [
      { id: 'opt1', name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] },
      { id: 'opt2', name: 'Color', values: ['White'] },
    ],
    variants: {
      edges: [
        {
          node: {
            id: 'v1',
            title: 'XS / White',
            price: { amount: '29.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 30,
            selectedOptions: [
              { name: 'Size', value: 'XS' },
              { name: 'Color', value: 'White' },
            ],
          },
        },
        {
          node: {
            id: 'v2',
            title: 'S / White',
            price: { amount: '29.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 40,
            selectedOptions: [
              { name: 'Size', value: 'S' },
              { name: 'Color', value: 'White' },
            ],
          },
        },
        {
          node: {
            id: 'v3',
            title: 'M / White',
            price: { amount: '29.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 50,
            selectedOptions: [
              { name: 'Size', value: 'M' },
              { name: 'Color', value: 'White' },
            ],
          },
        },
        {
          node: {
            id: 'v4',
            title: 'L / White',
            price: { amount: '29.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 20,
            selectedOptions: [
              { name: 'Size', value: 'L' },
              { name: 'Color', value: 'White' },
            ],
          },
        },
        {
          node: {
            id: 'v5',
            title: 'XL / White',
            price: { amount: '29.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 10,
            selectedOptions: [
              { name: 'Size', value: 'XL' },
              { name: 'Color', value: 'White' },
            ],
          },
        },
      ],
    },
    collections: { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } },
    tags: ['tshirt', 'basics', 'mens', 'womens', 'new'],
    productType: 'T-Shirts',
    vendor: 'Ecommerce Brand',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-05-20T14:30:00Z',
  },
  {
    id: 'gid://shopify/Product/2',
    handle: 'slim-fit-denim-jeans',
    title: 'Slim Fit Denim Jeans',
    description:
      'Modern slim fit jeans crafted from premium Japanese denim. Features a classic five-pocket design and comfortable stretch.',
    descriptionHtml:
      '<p>Modern slim fit jeans crafted from premium Japanese denim. Features a classic five-pocket design and comfortable stretch.</p>',
    availableForSale: true,
    totalInventory: 80,
    priceRange: {
      minVariantPrice: { amount: '89.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '89.99', currencyCode: 'USD' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '119.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '119.99', currencyCode: 'USD' },
    },
    images: {
      edges: [
        {
          node: {
            id: '1',
            url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blue%20slim%20fit%20denim%20jeans%20product%20photo%20on%20white%20background&image_size=square_hd',
            altText: 'Slim Fit Denim Jeans',
            width: 1024,
            height: 1024,
          },
        },
      ],
    },
    featuredImage: {
      id: '1',
      url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blue%20slim%20fit%20denim%20jeans%20product%20photo%20on%20white%20background&image_size=square_hd',
      altText: 'Slim Fit Denim Jeans',
      width: 1024,
      height: 1024,
    },
    options: [
      { id: 'opt1', name: 'Size', values: ['28', '30', '32', '34', '36'] },
      { id: 'opt2', name: 'Color', values: ['Dark Blue', 'Light Blue'] },
    ],
    variants: {
      edges: [
        {
          node: {
            id: 'v1',
            title: '28 / Dark Blue',
            price: { amount: '89.99', currencyCode: 'USD' },
            compareAtPrice: { amount: '119.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 15,
            selectedOptions: [
              { name: 'Size', value: '28' },
              { name: 'Color', value: 'Dark Blue' },
            ],
          },
        },
        {
          node: {
            id: 'v2',
            title: '30 / Dark Blue',
            price: { amount: '89.99', currencyCode: 'USD' },
            compareAtPrice: { amount: '119.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 20,
            selectedOptions: [
              { name: 'Size', value: '30' },
              { name: 'Color', value: 'Dark Blue' },
            ],
          },
        },
        {
          node: {
            id: 'v3',
            title: '32 / Dark Blue',
            price: { amount: '89.99', currencyCode: 'USD' },
            compareAtPrice: { amount: '119.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 25,
            selectedOptions: [
              { name: 'Size', value: '32' },
              { name: 'Color', value: 'Dark Blue' },
            ],
          },
        },
        {
          node: {
            id: 'v4',
            title: '34 / Dark Blue',
            price: { amount: '89.99', currencyCode: 'USD' },
            compareAtPrice: { amount: '119.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 10,
            selectedOptions: [
              { name: 'Size', value: '34' },
              { name: 'Color', value: 'Dark Blue' },
            ],
          },
        },
        {
          node: {
            id: 'v5',
            title: '36 / Dark Blue',
            price: { amount: '89.99', currencyCode: 'USD' },
            compareAtPrice: { amount: '119.99', currencyCode: 'USD' },
            availableForSale: false,
            quantityAvailable: 0,
            selectedOptions: [
              { name: 'Size', value: '36' },
              { name: 'Color', value: 'Dark Blue' },
            ],
          },
        },
      ],
    },
    collections: { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } },
    tags: ['jeans', 'denim', 'mens', 'sale', 'featured'],
    productType: 'Pants',
    vendor: 'Ecommerce Brand',
    createdAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-05-25T09:15:00Z',
  },
  {
    id: 'gid://shopify/Product/3',
    handle: 'premium-leather-jacket',
    title: 'Premium Leather Jacket',
    description:
      'Handcrafted from genuine full-grain leather, this timeless jacket features a classic biker design with modern fit.',
    descriptionHtml:
      '<p>Handcrafted from genuine full-grain leather, this timeless jacket features a classic biker design with modern fit.</p>',
    availableForSale: true,
    totalInventory: 25,
    priceRange: {
      minVariantPrice: { amount: '299.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '299.99', currencyCode: 'USD' },
    },
    images: {
      edges: [
        {
          node: {
            id: '1',
            url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20premium%20leather%20jacket%20biker%20style%20product%20photo&image_size=square_hd',
            altText: 'Premium Leather Jacket',
            width: 1024,
            height: 1024,
          },
        },
      ],
    },
    featuredImage: {
      id: '1',
      url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20premium%20leather%20jacket%20biker%20style%20product%20photo&image_size=square_hd',
      altText: 'Premium Leather Jacket',
      width: 1024,
      height: 1024,
    },
    options: [
      { id: 'opt1', name: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { id: 'opt2', name: 'Color', values: ['Black', 'Brown'] },
    ],
    variants: {
      edges: [
        {
          node: {
            id: 'v1',
            title: 'S / Black',
            price: { amount: '299.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 5,
            selectedOptions: [
              { name: 'Size', value: 'S' },
              { name: 'Color', value: 'Black' },
            ],
          },
        },
        {
          node: {
            id: 'v2',
            title: 'M / Black',
            price: { amount: '299.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 8,
            selectedOptions: [
              { name: 'Size', value: 'M' },
              { name: 'Color', value: 'Black' },
            ],
          },
        },
        {
          node: {
            id: 'v3',
            title: 'L / Black',
            price: { amount: '299.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 7,
            selectedOptions: [
              { name: 'Size', value: 'L' },
              { name: 'Color', value: 'Black' },
            ],
          },
        },
        {
          node: {
            id: 'v4',
            title: 'XL / Black',
            price: { amount: '299.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 5,
            selectedOptions: [
              { name: 'Size', value: 'XL' },
              { name: 'Color', value: 'Black' },
            ],
          },
        },
      ],
    },
    collections: { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } },
    tags: ['jacket', 'leather', 'premium', 'featured', 'mens'],
    productType: 'Outerwear',
    vendor: 'Ecommerce Brand',
    createdAt: '2026-03-01T12:00:00Z',
    updatedAt: '2026-05-28T16:45:00Z',
  },
  {
    id: 'gid://shopify/Product/4',
    handle: 'wireless-bluetooth-earbuds',
    title: 'Wireless Bluetooth Earbuds',
    description:
      'True wireless earbuds with active noise cancellation, 30-hour battery life, and premium sound quality.',
    descriptionHtml:
      '<p>True wireless earbuds with active noise cancellation, 30-hour battery life, and premium sound quality.</p>',
    availableForSale: true,
    totalInventory: 200,
    priceRange: {
      minVariantPrice: { amount: '129.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '129.99', currencyCode: 'USD' },
    },
    images: {
      edges: [
        {
          node: {
            id: '1',
            url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20wireless%20bluetooth%20earbuds%20with%20charging%20case%20product%20photo&image_size=square_hd',
            altText: 'Wireless Bluetooth Earbuds',
            width: 1024,
            height: 1024,
          },
        },
      ],
    },
    featuredImage: {
      id: '1',
      url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20wireless%20bluetooth%20earbuds%20with%20charging%20case%20product%20photo&image_size=square_hd',
      altText: 'Wireless Bluetooth Earbuds',
      width: 1024,
      height: 1024,
    },
    options: [{ id: 'opt1', name: 'Color', values: ['White', 'Black', 'Blue'] }],
    variants: {
      edges: [
        {
          node: {
            id: 'v1',
            title: 'White',
            price: { amount: '129.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 80,
            selectedOptions: [{ name: 'Color', value: 'White' }],
          },
        },
        {
          node: {
            id: 'v2',
            title: 'Black',
            price: { amount: '129.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 70,
            selectedOptions: [{ name: 'Color', value: 'Black' }],
          },
        },
        {
          node: {
            id: 'v3',
            title: 'Blue',
            price: { amount: '129.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 50,
            selectedOptions: [{ name: 'Color', value: 'Blue' }],
          },
        },
      ],
    },
    collections: { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } },
    tags: ['electronics', 'audio', 'earbuds', 'new', 'featured'],
    productType: 'Electronics',
    vendor: 'Tech Audio',
    createdAt: '2026-04-15T09:00:00Z',
    updatedAt: '2026-05-30T11:20:00Z',
  },
  {
    id: 'gid://shopify/Product/5',
    handle: 'organic-cotton-hoodie',
    title: 'Organic Cotton Hoodie',
    description:
      'Cozy and sustainable hoodie made from 100% organic cotton. Features a relaxed fit and kangaroo pocket.',
    descriptionHtml:
      '<p>Cozy and sustainable hoodie made from 100% organic cotton. Features a relaxed fit and kangaroo pocket.</p>',
    availableForSale: true,
    totalInventory: 120,
    priceRange: {
      minVariantPrice: { amount: '59.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '59.99', currencyCode: 'USD' },
    },
    images: {
      edges: [
        {
          node: {
            id: '1',
            url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=gray%20organic%20cotton%20hoodie%20sweatshirt%20product%20photo&image_size=square_hd',
            altText: 'Organic Cotton Hoodie',
            width: 1024,
            height: 1024,
          },
        },
      ],
    },
    featuredImage: {
      id: '1',
      url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=gray%20organic%20cotton%20hoodie%20sweatshirt%20product%20photo&image_size=square_hd',
      altText: 'Organic Cotton Hoodie',
      width: 1024,
      height: 1024,
    },
    options: [
      { id: 'opt1', name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { id: 'opt2', name: 'Color', values: ['Gray', 'Navy', 'Green'] },
    ],
    variants: {
      edges: [
        {
          node: {
            id: 'v1',
            title: 'S / Gray',
            price: { amount: '59.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 20,
            selectedOptions: [
              { name: 'Size', value: 'S' },
              { name: 'Color', value: 'Gray' },
            ],
          },
        },
        {
          node: {
            id: 'v2',
            title: 'M / Gray',
            price: { amount: '59.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 25,
            selectedOptions: [
              { name: 'Size', value: 'M' },
              { name: 'Color', value: 'Gray' },
            ],
          },
        },
        {
          node: {
            id: 'v3',
            title: 'L / Gray',
            price: { amount: '59.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 20,
            selectedOptions: [
              { name: 'Size', value: 'L' },
              { name: 'Color', value: 'Gray' },
            ],
          },
        },
      ],
    },
    collections: { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } },
    tags: ['hoodie', 'sweatshirt', 'organic', 'mens', 'womens', 'new'],
    productType: 'Hoodies',
    vendor: 'Ecommerce Brand',
    createdAt: '2026-05-01T10:30:00Z',
    updatedAt: '2026-05-30T14:00:00Z',
  },
  {
    id: 'gid://shopify/Product/6',
    handle: 'minimalist-leather-wallet',
    title: 'Minimalist Leather Wallet',
    description:
      'Slim RFID-blocking wallet made from premium Italian leather. Holds up to 8 cards and cash.',
    descriptionHtml:
      '<p>Slim RFID-blocking wallet made from premium Italian leather. Holds up to 8 cards and cash.</p>',
    availableForSale: true,
    totalInventory: 300,
    priceRange: {
      minVariantPrice: { amount: '49.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '49.99', currencyCode: 'USD' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '69.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '69.99', currencyCode: 'USD' },
    },
    images: {
      edges: [
        {
          node: {
            id: '1',
            url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=brown%20minimalist%20leather%20wallet%20rfid%20product%20photo&image_size=square_hd',
            altText: 'Minimalist Leather Wallet',
            width: 1024,
            height: 1024,
          },
        },
      ],
    },
    featuredImage: {
      id: '1',
      url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=brown%20minimalist%20leather%20wallet%20rfid%20product%20photo&image_size=square_hd',
      altText: 'Minimalist Leather Wallet',
      width: 1024,
      height: 1024,
    },
    options: [{ id: 'opt1', name: 'Color', values: ['Tan', 'Black', 'Dark Brown'] }],
    variants: {
      edges: [
        {
          node: {
            id: 'v1',
            title: 'Tan',
            price: { amount: '49.99', currencyCode: 'USD' },
            compareAtPrice: { amount: '69.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 100,
            selectedOptions: [{ name: 'Color', value: 'Tan' }],
          },
        },
        {
          node: {
            id: 'v2',
            title: 'Black',
            price: { amount: '49.99', currencyCode: 'USD' },
            compareAtPrice: { amount: '69.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 100,
            selectedOptions: [{ name: 'Color', value: 'Black' }],
          },
        },
        {
          node: {
            id: 'v3',
            title: 'Dark Brown',
            price: { amount: '49.99', currencyCode: 'USD' },
            compareAtPrice: { amount: '69.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 100,
            selectedOptions: [{ name: 'Color', value: 'Dark Brown' }],
          },
        },
      ],
    },
    collections: { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } },
    tags: ['accessories', 'wallet', 'leather', 'sale', 'gifts'],
    productType: 'Accessories',
    vendor: 'LeatherCraft',
    createdAt: '2026-03-15T14:00:00Z',
    updatedAt: '2026-05-29T09:30:00Z',
  },
  {
    id: 'gid://shopify/Product/7',
    handle: 'stainless-steel-water-bottle',
    title: 'Stainless Steel Water Bottle',
    description:
      'Double-wall vacuum insulated bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free.',
    descriptionHtml:
      '<p>Double-wall vacuum insulated bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free.</p>',
    availableForSale: true,
    totalInventory: 500,
    priceRange: {
      minVariantPrice: { amount: '34.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '34.99', currencyCode: 'USD' },
    },
    images: {
      edges: [
        {
          node: {
            id: '1',
            url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=stainless%20steel%20water%20bottle%20insulated%20product%20photo&image_size=square_hd',
            altText: 'Stainless Steel Water Bottle',
            width: 1024,
            height: 1024,
          },
        },
      ],
    },
    featuredImage: {
      id: '1',
      url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=stainless%20steel%20water%20bottle%20insulated%20product%20photo&image_size=square_hd',
      altText: 'Stainless Steel Water Bottle',
      width: 1024,
      height: 1024,
    },
    options: [
      { id: 'opt1', name: 'Size', values: ['500ml', '750ml', '1L'] },
      { id: 'opt2', name: 'Color', values: ['Silver', 'Black', 'Blue', 'Pink'] },
    ],
    variants: {
      edges: [
        {
          node: {
            id: 'v1',
            title: '500ml / Silver',
            price: { amount: '29.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 100,
            selectedOptions: [
              { name: 'Size', value: '500ml' },
              { name: 'Color', value: 'Silver' },
            ],
          },
        },
        {
          node: {
            id: 'v2',
            title: '750ml / Silver',
            price: { amount: '34.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 150,
            selectedOptions: [
              { name: 'Size', value: '750ml' },
              { name: 'Color', value: 'Silver' },
            ],
          },
        },
        {
          node: {
            id: 'v3',
            title: '1L / Silver',
            price: { amount: '39.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 80,
            selectedOptions: [
              { name: 'Size', value: '1L' },
              { name: 'Color', value: 'Silver' },
            ],
          },
        },
      ],
    },
    collections: { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } },
    tags: ['home', 'kitchen', 'eco', 'gifts', 'new'],
    productType: 'Home & Kitchen',
    vendor: 'EcoHome',
    createdAt: '2026-04-01T11:00:00Z',
    updatedAt: '2026-05-28T15:45:00Z',
  },
  {
    id: 'gid://shopify/Product/8',
    handle: 'canvas-sneakers',
    title: 'Classic Canvas Sneakers',
    description:
      'Timeless canvas sneakers with comfortable rubber sole. Perfect for casual everyday wear.',
    descriptionHtml:
      '<p>Timeless canvas sneakers with comfortable rubber sole. Perfect for casual everyday wear.</p>',
    availableForSale: true,
    totalInventory: 180,
    priceRange: {
      minVariantPrice: { amount: '54.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '54.99', currencyCode: 'USD' },
    },
    images: {
      edges: [
        {
          node: {
            id: '1',
            url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20canvas%20sneakers%20shoes%20product%20photo&image_size=square_hd',
            altText: 'Classic Canvas Sneakers',
            width: 1024,
            height: 1024,
          },
        },
      ],
    },
    featuredImage: {
      id: '1',
      url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20canvas%20sneakers%20shoes%20product%20photo&image_size=square_hd',
      altText: 'Classic Canvas Sneakers',
      width: 1024,
      height: 1024,
    },
    options: [
      { id: 'opt1', name: 'Size', values: ['5', '6', '7', '8', '9', '10', '11', '12'] },
      { id: 'opt2', name: 'Color', values: ['White', 'Black', 'Navy', 'Red'] },
    ],
    variants: {
      edges: [
        {
          node: {
            id: 'v1',
            title: '7 / White',
            price: { amount: '54.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 20,
            selectedOptions: [
              { name: 'Size', value: '7' },
              { name: 'Color', value: 'White' },
            ],
          },
        },
        {
          node: {
            id: 'v2',
            title: '8 / White',
            price: { amount: '54.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 25,
            selectedOptions: [
              { name: 'Size', value: '8' },
              { name: 'Color', value: 'White' },
            ],
          },
        },
        {
          node: {
            id: 'v3',
            title: '9 / White',
            price: { amount: '54.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 20,
            selectedOptions: [
              { name: 'Size', value: '9' },
              { name: 'Color', value: 'White' },
            ],
          },
        },
      ],
    },
    collections: { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } },
    tags: ['shoes', 'sneakers', 'casual', 'mens', 'womens', 'best-seller'],
    productType: 'Footwear',
    vendor: 'StepUp Shoes',
    createdAt: '2026-02-20T13:00:00Z',
    updatedAt: '2026-05-30T10:15:00Z',
  },
]

export const mockCollections: Collection[] = [
  {
    id: 'gid://shopify/Collection/1',
    handle: 'featured-products',
    title: 'Featured Products',
    description: 'Our handpicked selection of featured products.',
    descriptionHtml: '<p>Our handpicked selection of featured products.</p>',
    products: {
      edges: mockProducts.filter((p) => p.tags.includes('featured')).map((p) => ({ node: p })),
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
    },
    updatedAt: '2026-05-30T12:00:00Z',
  },
  {
    id: 'gid://shopify/Collection/2',
    handle: 'new-arrivals',
    title: 'New Arrivals',
    description: 'Check out our latest products just in stock.',
    descriptionHtml: '<p>Check out our latest products just in stock.</p>',
    products: {
      edges: mockProducts.filter((p) => p.tags.includes('new')).map((p) => ({ node: p })),
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
    },
    updatedAt: '2026-05-30T12:00:00Z',
  },
  {
    id: 'gid://shopify/Collection/3',
    handle: 'sale',
    title: 'On Sale',
    description: 'Limited time offers and discounts on selected items.',
    descriptionHtml: '<p>Limited time offers and discounts on selected items.</p>',
    products: {
      edges: mockProducts.filter((p) => p.tags.includes('sale')).map((p) => ({ node: p })),
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
    },
    updatedAt: '2026-05-30T12:00:00Z',
  },
]

export function getMockProducts(
  filter: {
    first?: number
    sortKey?: string
    reverse?: boolean
    query?: string
    minPrice?: string
    maxPrice?: string
    tag?: string
    productType?: string
    vendor?: string
  } = {},
): ProductConnection {
  let products = [...mockProducts]

  if (filter.query) {
    const query = filter.query.toLowerCase()
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  }

  if (filter.minPrice) {
    const minPrice = parseFloat(filter.minPrice)
    products = products.filter((p) => parseFloat(p.priceRange.minVariantPrice.amount) >= minPrice)
  }

  if (filter.maxPrice) {
    const maxPrice = parseFloat(filter.maxPrice)
    products = products.filter((p) => parseFloat(p.priceRange.maxVariantPrice.amount) <= maxPrice)
  }

  if (filter.tag) {
    products = products.filter((p) => p.tags.includes(filter.tag!))
  }

  if (filter.productType) {
    products = products.filter((p) => p.productType === filter.productType)
  }

  if (filter.vendor) {
    products = products.filter((p) => p.vendor === filter.vendor)
  }

  if (filter.sortKey) {
    switch (filter.sortKey) {
      case 'TITLE':
        products.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'PRICE':
        products.sort(
          (a, b) =>
            parseFloat(a.priceRange.minVariantPrice.amount) -
            parseFloat(b.priceRange.minVariantPrice.amount),
        )
        break
      case 'CREATED':
        products.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'BEST_SELLING':
        products.sort((a, b) => b.totalInventory - a.totalInventory)
        break
    }
    if (filter.reverse) {
      products.reverse()
    }
  }

  const first = filter.first || products.length
  const paginatedProducts = products.slice(0, first)

  return {
    edges: paginatedProducts.map((p) => ({ node: p })),
    pageInfo: {
      hasNextPage: first < products.length,
      hasPreviousPage: false,
    },
  }
}

export function getMockProduct(handle: string): Product | null {
  return mockProducts.find((p) => p.handle === handle) || null
}

export function getMockProductRecommendations(productId: string): Product[] {
  const currentProduct = mockProducts.find((p) => p.id === productId)
  if (!currentProduct) return []

  const currentTags = new Set(currentProduct.tags)
  return mockProducts
    .filter((p) => p.id !== productId)
    .filter((p) => p.tags.some((tag) => currentTags.has(tag)))
    .slice(0, 4)
}

export function getMockCollections(): CollectionConnection {
  return {
    edges: mockCollections.map((c) => ({ node: c })),
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
    },
  }
}

export function getMockCollection(handle: string): Collection | null {
  return mockCollections.find((c) => c.handle === handle) || null
}

export function getAllMockProducts(): Product[] {
  return [...mockProducts]
}

export { mockProducts }
