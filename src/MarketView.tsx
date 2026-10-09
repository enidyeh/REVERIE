import { useEffect, useState } from 'react'
import { ArrowUpRight, Check, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { creatorProducts, shopEdit, shopGroups, type CreatorProduct, type ShopGroupId } from './data/market'
import './market.css'

type CartItem = { productId: string; quantity: number }
type ProductCategoryFilter = 'all' | ShopGroupId

type PriceOrder = 'featured' | 'ascending' | 'descending'

// 分类不是传统电商分类（服装 / 家居 / 配饰），而是项目方给的四个来源（独立创作者产品 / 艺术家周边 / 海外小众商品 / 自有原创产品）。
const productCategories: { id: ProductCategoryFilter; label: string }[] = [
  { id: 'all', label: '全部' },
  ...shopGroups,
]

const storageKey = 'unseen:market:v1'
const productIds = new Set(creatorProducts.map((product) => product.id))

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function loadCart(): CartItem[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (!isRecord(saved) || !Array.isArray(saved.items)) return []

    const quantities = new Map<string, number>()
    for (const item of saved.items) {
      if (!isRecord(item) || typeof item.productId !== 'string' || !productIds.has(item.productId)) continue
      if (typeof item.quantity !== 'number' || !Number.isFinite(item.quantity)) continue
      const quantity = Math.max(1, Math.min(99, Math.floor(item.quantity)))
      quantities.set(item.productId, Math.min(99, (quantities.get(item.productId) ?? 0) + quantity))
    }
    return [...quantities].map(([productId, quantity]) => ({ productId, quantity }))
  } catch {
    return []
  }
}

function ProductDetails({
  product,
  onClose,
  onAdd,
}: {
  product: CreatorProduct
  onClose: () => void
  onAdd: (productId: string) => void
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="market-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="market-product-dialog" role="dialog" aria-modal="true" aria-labelledby="market-product-title">
        <button className="market-dialog-close" type="button" onClick={onClose} aria-label="关闭商品详情"><X size={19} /></button>
        <div className="market-dialog-image"><img src={product.image} alt={product.imageAlt} /></div>
        <div className="market-dialog-copy">
          <p className="market-eyebrow">{product.category} <span>/</span> 演示商品</p>
          <p className="market-creator">{product.creator}</p>
          <h2 id="market-product-title">{product.title}</h2>
          <p className="market-product-subtitle">{product.subtitle}</p>
          <p className="market-product-description">{product.description}</p>
          <div className="market-creator-story"><span>CREATOR'S NOTE / 创作者手记</span><p>{product.creatorStory}</p><small>{product.objectDetails}</small></div>
          <p className="market-origin">{product.origin}</p>
          <div className="market-detail-buyline"><strong>{product.priceLabel}</strong><span>虚构演示商品</span></div>
          <button className="market-primary-action" type="button" onClick={() => onAdd(product.id)}><ShoppingBag size={16} />加入购物袋</button>
          <p className="market-demo-note">不涉及真实库存、发货或支付</p>
        </div>
      </section>
    </div>
  )
}

function ShoppingBagPanel({
  items,
  orderComplete,
  onClose,
  onChangeQuantity,
  onCheckout,
}: {
  items: CartItem[]
  orderComplete: boolean
  onClose: () => void
  onChangeQuantity: (productId: string, change: number) => void
  onCheckout: () => void
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const cartProducts = items.flatMap((item) => {
    const product = creatorProducts.find((entry) => entry.id === item.productId)
    return product ? [{ product, quantity: item.quantity }] : []
  })
  const subtotal = cartProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <div className="market-overlay market-cart-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="market-cart-panel" role="dialog" aria-modal="true" aria-labelledby="market-cart-title">
        <header className="market-cart-header">
          <div><p className="market-eyebrow">CREATOR MARKET / YOUR BAG</p><h2 id="market-cart-title">购物袋 <span>{cartProducts.reduce((sum, item) => sum + item.quantity, 0).toString().padStart(2, '0')}</span></h2></div>
          <button className="market-dialog-close" type="button" onClick={onClose} aria-label="关闭购物袋"><X size={19} /></button>
        </header>
        {orderComplete ? (
          <div className="market-order-success" role="status">
            <span className="market-success-mark"><Check size={22} /></span>
            <p className="market-eyebrow">DEMO / NOT A REAL ORDER</p>
            <h3>这次购买，只在演示里发生。</h3>
            <p>购物袋已清空。没有创建真实订单、扣款或安排发货。</p>
            <button className="market-primary-action" type="button" onClick={onClose}>继续逛集市 <ArrowUpRight size={16} /></button>
          </div>
        ) : cartProducts.length ? (
          <>
            <div className="market-cart-items">
              {cartProducts.map(({ product, quantity }) => (
                <article className="market-cart-item" key={product.id}>
                  <div className="market-cart-item-image"><img src={product.image} alt="" /></div>
                  <div className="market-cart-item-copy">
                    <p className="market-eyebrow">{product.creator}</p>
                    <h3>{product.title}</h3>
                    <div className="market-cart-item-bottom"><strong>{product.priceLabel}</strong>
                      <div className="market-quantity-control" aria-label={`${product.title}数量`}>
                        <button type="button" onClick={() => onChangeQuantity(product.id, -1)} aria-label={`减少${product.title}数量`}><Minus size={14} /></button>
                        <span aria-live="polite">{quantity}</span>
                        <button type="button" onClick={() => onChangeQuantity(product.id, 1)} aria-label={`增加${product.title}数量`}><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="market-cart-summary">
              <div><span>演示小计</span><strong>¥ {subtotal.toFixed(2)}</strong></div>
              <p>价格仅用于交互演示，不会产生实际扣款。</p>
              <button className="market-primary-action" type="button" onClick={onCheckout}>模拟下单 <ArrowUpRight size={16} /></button>
            </div>
          </>
        ) : (
          <div className="market-cart-empty">
            <ShoppingBag size={28} strokeWidth={1.3} />
            <h3>袋子还是空的。</h3>
            <p>逛到喜欢的创作者作品，可以先放进这里。</p>
            <button className="market-secondary-action" type="button" onClick={onClose}>回到集市</button>
          </div>
        )}
        <span className="market-cart-demo-label">LOCAL DEMO ONLY / NO PAYMENT</span>
      </section>
    </div>
  )
}

function MarketView() {
  const [cart, setCart] = useState<CartItem[]>(loadCart)
  const [selectedProduct, setSelectedProduct] = useState<CreatorProduct | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ProductCategoryFilter>('all')
  const [priceOrder, setPriceOrder] = useState<PriceOrder>('featured')

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ items: cart }))
    } catch {
      // Keep the current session usable when browser storage is unavailable.
    }
  }, [cart])

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const visibleProducts = creatorProducts
    .filter((product) => categoryFilter === 'all' || product.group === categoryFilter)
    .slice()
    .sort((first, second) => priceOrder === 'ascending'
      ? first.price - second.price
      : priceOrder === 'descending'
        ? second.price - first.price
        : creatorProducts.indexOf(first) - creatorProducts.indexOf(second))
  // 商品精选：当前筛选与排序下的第一件用大卡，其余进卡片网格，同一件商品不会重复出现。
  const [featuredProduct, ...gridProducts] = visibleProducts

  function addToCart(productId: string) {
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId)
      if (!existing) return [...current, { productId, quantity: 1 }]
      return current.map((item) => item.productId === productId
        ? { ...item, quantity: Math.min(99, item.quantity + 1) }
        : item)
    })
    const product = creatorProducts.find((item) => item.id === productId)
    setAnnouncement(product ? `${product.title}已加入购物袋` : '商品已加入购物袋')
  }

  function changeQuantity(productId: string, change: number) {
    setCart((current) => current.flatMap((item) => {
      if (item.productId !== productId) return [item]
      const quantity = Math.max(0, Math.min(99, item.quantity + change))
      return quantity ? [{ ...item, quantity }] : []
    }))
  }

  function openCart() {
    setOrderComplete(false)
    setCartOpen(true)
  }

  function finishDemoOrder() {
    setCart([])
    setOrderComplete(true)
  }

  return (
    <div className="market-page">
      <header className="market-heading">
        <div><p className="market-eyebrow">OBJECTS WITH A POINT OF VIEW / 01—03</p><h2>小小的东西，<br /><span>有很大的来处。</span></h2><p>从创作者手里，遇见另一种日常。</p></div>
        <button className="market-bag-trigger" type="button" onClick={openCart} aria-label={`打开购物袋，${itemCount} 件商品`}>
          <ShoppingBag size={17} /><span>购物袋</span><b>{itemCount.toString().padStart(2, '0')}</b>
        </button>
      </header>
      <div className="market-browse-controls">
        <div className="market-category-filters" role="group" aria-label="按商品类别筛选">
          {productCategories.map((category) => {
            const count = category.id === 'all' ? creatorProducts.length : creatorProducts.filter((product) => product.group === category.id).length
            return <button className={categoryFilter === category.id ? 'is-active' : ''} type="button" key={category.id} aria-pressed={categoryFilter === category.id} onClick={() => setCategoryFilter(category.id)}>{category.label}<span>{count.toString().padStart(2, '0')}</span></button>
          })}
        </div>
        <button className="market-sort-toggle" type="button" aria-label={priceOrder === 'featured' ? '精选排序，点击按价格由低到高' : priceOrder === 'ascending' ? '价格由低到高，点击按高到低' : '价格由高到低，点击恢复精选排序'} onClick={() => setPriceOrder((current) => current === 'featured' ? 'ascending' : current === 'ascending' ? 'descending' : 'featured')}>
          {priceOrder === 'featured' ? '精选排序' : priceOrder === 'ascending' ? '价格 ↑' : '价格 ↓'}
        </button>
      </div>

      {featuredProduct && (
        <article className="market-feature">
          <button className="market-feature-image" type="button" onClick={() => setSelectedProduct(featuredProduct)} aria-label={`查看商品详情：${featuredProduct.title}`}>
            <img src={featuredProduct.image} alt={featuredProduct.imageAlt} />
            <span>FEATURED / 商品精选</span>
            <b>{featuredProduct.creator}</b>
          </button>
          <div className="market-feature-copy">
            <p className="market-eyebrow">{featuredProduct.category}</p>
            <h3>{featuredProduct.title}</h3>
            <p className="market-product-subtitle">{featuredProduct.subtitle}</p>
            <p className="market-product-description">{featuredProduct.description}</p>
            <div className="market-creator-story"><span>{featuredProduct.creator} / 创作者手记</span><p>{featuredProduct.creatorStory}</p></div>
            <div className="market-feature-bottom"><strong>{featuredProduct.priceLabel}</strong>
              <div><button className="market-secondary-action" type="button" onClick={() => setSelectedProduct(featuredProduct)}>看作品</button><button className="market-add-action" type="button" onClick={() => addToCart(featuredProduct.id)} aria-label={`加入购物袋：${featuredProduct.title}`}><ShoppingBag size={16} /><span>加入购物袋</span></button></div>
            </div>
          </div>
        </article>
      )}

      <section className="market-card-grid" aria-label="创作者精选商品">
        {gridProducts.map((product) => (
          <article className="market-card" key={product.id}>
            <button className="market-card-image" type="button" onClick={() => setSelectedProduct(product)} aria-label={`查看商品详情：${product.title}`}>
              <img src={product.image} alt={product.imageAlt} />
            </button>
            <div className="market-card-body">
              <p className="market-card-meta">{product.category} / {product.creator}</p>
              <h3>{product.title}</h3>
              <p className="market-card-subtitle">{product.subtitle}</p>
              <p className="market-card-price">{product.priceLabel}</p>
              <button className="market-card-action" type="button" onClick={() => addToCart(product.id)} aria-label={`加入购物袋：${product.title}`}>
                <ShoppingBag size={14} aria-hidden="true" />加入购物车
              </button>
            </div>
          </article>
        ))}
      </section>
      <p className="market-note">{shopEdit.note}</p>
      <p className="market-footer-note">商品与创作者均为虚构演示内容 · 不代表真实在售</p>
      <p className="market-announcement" aria-live="polite">{announcement}</p>

      {selectedProduct && <ProductDetails product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />}
      {cartOpen && (
        <ShoppingBagPanel
          items={cart}
          orderComplete={orderComplete}
          onClose={() => setCartOpen(false)}
          onChangeQuantity={changeQuantity}
          onCheckout={finishDemoOrder}
        />
      )}
    </div>
  )
}

export default MarketView