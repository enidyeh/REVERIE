import { useEffect, useState } from 'react'
import { ArrowUpRight, Check, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { creatorProducts, shopEdit, shopGroups, type CreatorProduct, type ShopGroupId } from './data/market'
import { marketCopy as copy } from './i18n/market'
import type { Localized } from './i18n/messages'
import { useLocale } from './i18n/use-locale'
import './market.css'

type CartItem = { productId: string; quantity: number }
type ProductCategoryFilter = 'all' | ShopGroupId

type PriceOrder = 'featured' | 'ascending' | 'descending'

// 分类不是传统电商分类（服装 / 家居 / 配饰），而是项目方给的四个来源（独立创作者产品 / 艺术家周边 / 海外小众商品 / 自有原创产品）。
const productCategories: { id: ProductCategoryFilter; label: Localized }[] = [
  { id: 'all', label: copy.categoryAll },
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
  const { t } = useLocale()

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
        <button className="market-dialog-close" type="button" onClick={onClose} aria-label={t(copy.dialogClose)}><X size={19} /></button>
        <div className="market-dialog-image"><img src={product.image} alt={t(product.imageAlt)} /></div>
        <div className="market-dialog-copy">
          <p className="market-eyebrow">{t(product.category)} <span>/</span> {t(copy.dialogDemoTag)}</p>
          <p className="market-creator">{t(product.creator)}</p>
          <h2 id="market-product-title">{t(product.title)}</h2>
          <p className="market-product-subtitle">{t(product.subtitle)}</p>
          <p className="market-product-description">{t(product.description)}</p>
          <div className="market-creator-story"><span>{t(copy.creatorNote)}</span><p>{t(product.creatorStory)}</p><small>{t(product.objectDetails)}</small></div>
          <p className="market-origin">{t(product.origin)}</p>
          <div className="market-detail-buyline"><strong>{t(product.priceLabel)}</strong><span>{t(copy.dialogDemoProduct)}</span></div>
          <button className="market-primary-action" type="button" onClick={() => onAdd(product.id)}><ShoppingBag size={16} />{t(copy.addToBag)}</button>
          <p className="market-demo-note">{t(copy.dialogDemoNote)}</p>
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
  const { t } = useLocale()

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
          <div><p className="market-eyebrow">{t(copy.cartEyebrow)}</p><h2 id="market-cart-title">{t(copy.bagLabel)} <span>{cartProducts.reduce((sum, item) => sum + item.quantity, 0).toString().padStart(2, '0')}</span></h2></div>
          <button className="market-dialog-close" type="button" onClick={onClose} aria-label={t(copy.cartClose)}><X size={19} /></button>
        </header>
        {orderComplete ? (
          <div className="market-order-success" role="status">
            <span className="market-success-mark"><Check size={22} /></span>
            <p className="market-eyebrow">{t(copy.orderEyebrow)}</p>
            <h3>{t(copy.orderHeading)}</h3>
            <p>{t(copy.orderBody)}</p>
            <button className="market-primary-action" type="button" onClick={onClose}>{t(copy.keepBrowsing)} <ArrowUpRight size={16} /></button>
          </div>
        ) : cartProducts.length ? (
          <>
            <div className="market-cart-items">
              {cartProducts.map(({ product, quantity }) => (
                <article className="market-cart-item" key={product.id}>
                  <div className="market-cart-item-image"><img src={product.image} alt="" /></div>
                  <div className="market-cart-item-copy">
                    <p className="market-eyebrow">{t(product.creator)}</p>
                    <h3>{t(product.title)}</h3>
                    <div className="market-cart-item-bottom"><strong>{t(product.priceLabel)}</strong>
                      <div className="market-quantity-control" aria-label={t(copy.quantityAria)(t(product.title))}>
                        <button type="button" onClick={() => onChangeQuantity(product.id, -1)} aria-label={t(copy.decreaseAria)(t(product.title))}><Minus size={14} /></button>
                        <span aria-live="polite">{quantity}</span>
                        <button type="button" onClick={() => onChangeQuantity(product.id, 1)} aria-label={t(copy.increaseAria)(t(product.title))}><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="market-cart-summary">
              <div><span>{t(copy.subtotalLabel)}</span><strong>¥ {subtotal.toFixed(2)}</strong></div>
              <p>{t(copy.subtotalNote)}</p>
              <button className="market-primary-action" type="button" onClick={onCheckout}>{t(copy.placeOrder)} <ArrowUpRight size={16} /></button>
            </div>
          </>
        ) : (
          <div className="market-cart-empty">
            <ShoppingBag size={28} strokeWidth={1.3} />
            <h3>{t(copy.emptyHeading)}</h3>
            <p>{t(copy.emptyBody)}</p>
            <button className="market-secondary-action" type="button" onClick={onClose}>{t(copy.backToMarket)}</button>
          </div>
        )}
        <span className="market-cart-demo-label">{t(copy.cartDemoLabel)}</span>
      </section>
    </div>
  )
}

function MarketView() {
  const { t } = useLocale()
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
    setAnnouncement(product ? t(copy.addedNotice)(t(product.title)) : t(copy.addedGeneric))
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
        <div>
          {t(copy.headingEyebrow) && <p className="market-eyebrow">{t(copy.headingEyebrow)}</p>}
          <h2>{t(copy.headingLines)[0]}<br /><span>{t(copy.headingLines)[1]}</span></h2>
          <p>{t(copy.headingLead)}</p>
        </div>
        <button className="market-bag-trigger" type="button" onClick={openCart} aria-label={t(copy.bagAria)(itemCount)}>
          <ShoppingBag size={17} /><span>{t(copy.bagLabel)}</span><b>{itemCount.toString().padStart(2, '0')}</b>
        </button>
      </header>
      <div className="market-browse-controls">
        <div className="market-category-filters" role="group" aria-label={t(copy.categoryGroupLabel)}>
          {productCategories.map((category) => {
            const count = category.id === 'all' ? creatorProducts.length : creatorProducts.filter((product) => product.group === category.id).length
            return <button className={categoryFilter === category.id ? 'is-active' : ''} type="button" key={category.id} aria-pressed={categoryFilter === category.id} onClick={() => setCategoryFilter(category.id)}>{t(category.label)}<span>{count.toString().padStart(2, '0')}</span></button>
          })}
        </div>
        <button
          className="market-sort-toggle"
          type="button"
          aria-label={priceOrder === 'featured' ? t(copy.sortAriaFeatured) : priceOrder === 'ascending' ? t(copy.sortAriaAscending) : t(copy.sortAriaDescending)}
          onClick={() => setPriceOrder((current) => current === 'featured' ? 'ascending' : current === 'ascending' ? 'descending' : 'featured')}
        >
          {priceOrder === 'featured' ? t(copy.sortFeatured) : priceOrder === 'ascending' ? t(copy.sortAscending) : t(copy.sortDescending)}
        </button>
      </div>

      {featuredProduct && (
        <article className="market-feature">
          <button className="market-feature-image" type="button" onClick={() => setSelectedProduct(featuredProduct)} aria-label={t(copy.viewProductAria)(t(featuredProduct.title))}>
            <img src={featuredProduct.image} alt={t(featuredProduct.imageAlt)} />
            <span>{t(copy.featuredBadge)}</span>
            <b>{t(featuredProduct.creator)}</b>
          </button>
          <div className="market-feature-copy">
            <p className="market-eyebrow">{t(featuredProduct.category)}</p>
            <h3>{t(featuredProduct.title)}</h3>
            <p className="market-product-subtitle">{t(featuredProduct.subtitle)}</p>
            <p className="market-product-description">{t(featuredProduct.description)}</p>
            <div className="market-creator-story"><span>{t(featuredProduct.creator)} / {t(copy.creatorNote)}</span><p>{t(featuredProduct.creatorStory)}</p></div>
            <div className="market-feature-bottom"><strong>{t(featuredProduct.priceLabel)}</strong>
              <div><button className="market-secondary-action" type="button" onClick={() => setSelectedProduct(featuredProduct)}>{t(copy.viewPiece)}</button><button className="market-add-action" type="button" onClick={() => addToCart(featuredProduct.id)} aria-label={t(copy.addToBagAria)(t(featuredProduct.title))}><ShoppingBag size={16} /><span>{t(copy.addToBag)}</span></button></div>
            </div>
          </div>
        </article>
      )}

      <section className="market-card-grid" aria-label={t(copy.gridLabel)}>
        {gridProducts.map((product) => (
          <article className="market-card" key={product.id}>
            <button className="market-card-image" type="button" onClick={() => setSelectedProduct(product)} aria-label={t(copy.viewProductAria)(t(product.title))}>
              <img src={product.image} alt={t(product.imageAlt)} />
            </button>
            <div className="market-card-body">
              <p className="market-card-meta">{t(product.category)} / {t(product.creator)}</p>
              <h3>{t(product.title)}</h3>
              <p className="market-card-subtitle">{t(product.subtitle)}</p>
              <p className="market-card-price">{t(product.priceLabel)}</p>
              <button className="market-card-action" type="button" onClick={() => addToCart(product.id)} aria-label={t(copy.addToBagAria)(t(product.title))}>
                <ShoppingBag size={14} aria-hidden="true" />{t(copy.addToCart)}
              </button>
            </div>
          </article>
        ))}
      </section>
      <p className="market-note">{t(shopEdit.note)}</p>
      <p className="market-footer-note">{t(copy.footerNote)}</p>
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