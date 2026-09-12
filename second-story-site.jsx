import React, { useState, useMemo } from "react";
import {
  Shirt, Watch, BookOpen, Lamp, Camera, Gem, Glasses, Disc3,
  Armchair, Briefcase, Umbrella, ShoppingBag, X, Plus, Minus,
  MapPin, Clock, Mail, Send, ChevronRight, Check, Infinity, Recycle, Sparkles
} from "lucide-react";

/* ---------------------------------------------------------
   SECOND STORY — a thrift shop website
   Palette: matched to the brand mark — warm charcoal grey,
   near-black, and cream paper. No color accent, high-contrast
   Didone serif for the wordmark, per the supplied logo card.
--------------------------------------------------------- */

const C = {
  paper: "#F0EAE0",
  card: "#F7F3EB",
  ink: "#19170F",
  inkSoft: "#5C564C",
  charcoal: "#89837A",
  charcoalDeep: "#221F1B",
  line: "#D9D1C1",
  hair: "#C9C0AC",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;0,6..96,700&family=Libre+Franklin:wght@400;500;600&display=swap');
`;

/* Grainy paper texture overlay, matching the cardstock look of the brand mockup */
const GRAIN_URI =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>";

function Grain({ opacity = 0.05 }) {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: `url("${GRAIN_URI}")`,
        opacity,
        mixBlendMode: "multiply",
        pointerEvents: "none",
        zIndex: 30,
      }}
    />
  );
}

/* The hanger-through-the-O glyph, sized in em so it drops into running text */
function HangerO({ capHeight = "1em", color = "currentColor" }) {
  return (
    <svg
      viewBox="0 0 100 116"
      style={{
        height: `calc(${capHeight} * 116 / 60)`,
        width: `calc(${capHeight} * 100 / 60)`,
        display: "inline-block",
        verticalAlign: `calc(${capHeight} * -10 / 60)`,
      }}
    >
      <circle cx="50" cy="76" r="30" fill="none" stroke={color} strokeWidth="13" />
      <circle cx="58" cy="19" r="7" fill="none" stroke={color} strokeWidth="6" />
      <path d="M52,25 L50,40" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M50,40 L20,57 M50,40 L80,57" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* The circular monogram badge — black circle, "SS" monogram, hanger mark above */
function LogoMark({ size = 40 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", border: `1px solid ${C.line}`, padding: 2 }}>
      <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%" }}>
        <circle cx="60" cy="60" r="58" fill={C.charcoalDeep} />
        <circle cx="66" cy="30" r="4.5" fill="none" stroke={C.paper} strokeWidth="3.2" />
        <path d="M62,34 L60,44" stroke={C.paper} strokeWidth="3.2" strokeLinecap="round" fill="none" />
        <path d="M60,44 L38,55 M60,44 L82,55" stroke={C.paper} strokeWidth="3.2" strokeLinecap="round" fill="none" />
        <text x="60" y="92" textAnchor="middle" fontFamily="Bodoni Moda" fontStyle="italic" fontWeight="600"
          fontSize="46" fill={C.paper}>SS</text>
      </svg>
    </div>
  );
}

const ITEMS = [
  { id: 1, name: "Chelsea Corduroy Jacket", price: 42, category: "Clothing", Icon: Shirt,
    story: "Bought for a job interview in '98. Worn to exactly one job interview." },
  { id: 2, name: "Seiko Wind-Up Watch", price: 68, category: "Accessories", Icon: Watch,
    story: "Kept perfect time through three moves and one flood. Still does." },
  { id: 3, name: "Water-Stained Poetry Anthology", price: 9, category: "Books", Icon: BookOpen,
    story: "Someone's margin notes stop halfway through. We left them in." },
  { id: 4, name: "Amber Glass Table Lamp", price: 34, category: "Home", Icon: Lamp,
    story: "Lit a reading corner for twenty years before the corner moved away." },
  { id: 5, name: "Half-Frame Film Camera", price: 55, category: "Curios", Icon: Camera,
    story: "There's a roll of undeveloped film still inside. It's yours now." },
  { id: 6, name: "Brass Signet Ring, no initial", price: 22, category: "Accessories", Icon: Gem,
    story: "Never engraved. Somebody changed their mind, or their name." },
  { id: 7, name: "Round Tortoiseshell Glasses", price: 18, category: "Accessories", Icon: Glasses,
    story: "Prescription's too strong for most. Perfect if you just like how they sit." },
  { id: 8, name: "Vinyl: Live at the Fillmore", price: 15, category: "Curios", Icon: Disc3,
    story: "Skips once, right on the good part. We consider it a feature." },
  { id: 9, name: "Oak Armchair, left arm worn", price: 95, category: "Home", Icon: Armchair,
    story: "One arm is paler than the other from a window that faced west." },
  { id: 10, name: "Leather Satchel, initials J.M.", price: 48, category: "Accessories", Icon: Briefcase,
    story: "We never found out who J.M. was. The leather remembers them anyway." },
  { id: 11, name: "Black Folding Umbrella", price: 8, category: "Home", Icon: Umbrella,
    story: "Never once turned inside out. A genuinely rare umbrella." },
  { id: 12, name: "Cable-Knit Wool Cardigan", price: 29, category: "Clothing", Icon: Shirt,
    story: "Elbow patches added by hand, and added well. Somebody loved this sweater." },
];

const EVENTS = [
  { date: "Sat, Sep 26", title: "Fall Clothing Swap", desc: "Bring three items, leave with three. No cash, just trades." },
  { date: "Sat, Oct 10", title: "New Arrivals: Estate Collection", desc: "A full house clearance hits the floor — furniture, books, and jewelry." },
  { date: "Fri, Oct 23", title: "Repair Night", desc: "Free mending and button-fixing, 6–8pm. Bring your own or ours." },
  { date: "Sat, Nov 14", title: "Holiday Pop-Up Upstairs", desc: "The second story opens for one weekend of gifts under $30." },
];

function Nav({ page, setPage, cartCount, openCart }) {
  const links = ["Home", "Shop", "About", "Events", "Contact"];
  return (
    <nav style={{ background: C.charcoalDeep, borderBottom: `1px solid ${C.ink}33` }}
      className="sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <button onClick={() => setPage("Home")} className="flex items-center gap-3">
          <LogoMark size={34} />
          <span style={{ fontFamily: "Bodoni Moda", color: C.paper }} className="text-xl tracking-wide">
            SECOND STORY
          </span>
        </button>
        <div className="hidden md:flex items-center gap-8" style={{ fontFamily: "Libre Franklin" }}>
          {links.map((l) => (
            <button key={l} onClick={() => setPage(l)}
              style={{ color: page === l ? C.ink : C.paper, opacity: page === l ? 1 : 0.8 }}
              className="text-sm">
              {l}
            </button>
          ))}
        </div>
        <button onClick={openCart} className="relative flex items-center gap-2 px-3 py-2 rounded"
          style={{ border: `1px solid ${C.ink}55`, color: C.paper }}>
          <ShoppingBag size={16} />
          <span className="text-sm">{cartCount}</span>
        </button>
      </div>
      <div className="flex md:hidden gap-4 px-6 pb-3 overflow-x-auto" style={{ fontFamily: "Libre Franklin" }}>
        {links.map((l) => (
          <button key={l} onClick={() => setPage(l)} style={{ color: page === l ? C.ink : C.paper }} className="text-xs whitespace-nowrap">
            {l}
          </button>
        ))}
      </div>
    </nav>
  );
}

function Hero({ setPage }) {
  return (
    <div style={{ background: C.charcoal }} className="relative overflow-hidden">
      <Grain opacity={0.07} />
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center flex flex-col items-center relative">
        <h1 style={{ fontFamily: "Bodoni Moda", color: C.charcoalDeep, lineHeight: 1.02 }}
          className="text-6xl md:text-8xl font-semibold tracking-tight">
          SEC<HangerO capHeight="0.72em" color={C.charcoalDeep} />ND<br />STORY
        </h1>
        <p style={{ color: C.charcoalDeep, fontFamily: "Libre Franklin", letterSpacing: "0.25em" }}
          className="text-xs md:text-sm mt-6 uppercase">
          Thrift &nbsp;·&nbsp; Vintage &nbsp;·&nbsp; Rewear
        </p>
        <p style={{ fontFamily: "Bodoni Moda", color: C.paper }} className="text-2xl md:text-3xl mt-10">
          Pre-loved fits. New stories.
        </p>
        <p style={{ color: C.paper, fontFamily: "Libre Franklin", opacity: 0.85 }} className="mt-4 text-base max-w-md">
          Quality thrift &amp; vintage pieces for everyday style — because
          good clothes deserve a second story.
        </p>
        <div className="mt-8 flex gap-4">
          <button onClick={() => setPage("Shop")}
            style={{ background: C.paper, color: C.charcoalDeep, fontFamily: "Libre Franklin" }}
            className="px-6 py-3 rounded text-sm font-medium">
            Browse the shop
          </button>
          <button onClick={() => setPage("Contact")}
            style={{ border: `1px solid ${C.paper}77`, color: C.paper, fontFamily: "Libre Franklin" }}
            className="px-6 py-3 rounded text-sm">
            DM to inquire
          </button>
        </div>
      </div>
      <div style={{ background: C.paper, borderTop: `1px solid ${C.hair}` }} className="max-w-6xl mx-auto flex flex-wrap justify-center gap-10 md:gap-16 px-6 py-6">
        {[
          { Icon: Shirt, label: "Thrift" },
          { Icon: Infinity, label: "Vintage" },
          { Icon: Recycle, label: "Sustainable" },
          { Icon: Sparkles, label: "Unique finds" },
        ].map(({ Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <Icon size={20} color={C.ink} strokeWidth={1.5} />
            <span style={{ fontFamily: "Libre Franklin", color: C.inkSoft, letterSpacing: "0.15em" }} className="text-[10px] uppercase">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Tag({ item, onAdd }) {
  const { Icon } = item;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded p-5 flex flex-col">
      <div className="flex items-start justify-between">
        <div style={{ background: C.charcoal }} className="w-11 h-11 rounded flex items-center justify-center">
          <Icon size={20} color={C.ink} />
        </div>
        <span style={{ fontFamily: "Bodoni Moda", color: C.ink }} className="text-xl">${item.price}</span>
      </div>
      <h3 style={{ fontFamily: "Bodoni Moda", color: C.ink }} className="mt-4 text-lg leading-snug">{item.name}</h3>
      <p style={{ color: C.inkSoft, fontFamily: "Libre Franklin" }} className="mt-2 text-sm flex-1">{item.story}</p>
      <div className="mt-4 flex items-center justify-between">
        <span style={{ color: C.inkSoft, fontFamily: "Libre Franklin", borderColor: C.line }}
          className="text-xs border rounded-full px-2 py-1">{item.category}</span>
        <button onClick={() => onAdd(item)} style={{ background: C.charcoal, color: C.paper, fontFamily: "Libre Franklin" }}
          className="text-xs px-3 py-2 rounded flex items-center gap-1">
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  );
}

function ShopPage({ onAdd }) {
  const [filter, setFilter] = useState("All");
  const cats = ["All", ...Array.from(new Set(ITEMS.map((i) => i.category)))];
  const shown = filter === "All" ? ITEMS : ITEMS.filter((i) => i.category === filter);
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h2 style={{ fontFamily: "Bodoni Moda", color: C.ink }} className="text-3xl mb-2">The shop floor</h2>
      <p style={{ color: C.inkSoft, fontFamily: "Libre Franklin" }} className="mb-8">Every item is one of one. Once it's gone, that story's over.</p>
      <div className="flex gap-2 mb-8 flex-wrap">
        {cats.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            style={{
              background: filter === c ? C.charcoal : "transparent",
              color: filter === c ? C.paper : C.inkSoft,
              border: `1px solid ${filter === c ? C.charcoal : C.line}`,
              fontFamily: "Libre Franklin",
            }}
            className="text-xs px-3 py-2 rounded-full">
            {c}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {shown.map((item) => <Tag key={item.id} item={item} onAdd={onAdd} />)}
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h2 style={{ fontFamily: "Bodoni Moda", color: C.ink }} className="text-3xl mb-6">About the shop</h2>
      <p style={{ color: C.inkSoft, fontFamily: "Libre Franklin", lineHeight: 1.8 }} className="text-base mb-5">
        Second Story opened in 2016 in the room above what used to be a
        hardware store, and is now a bakery. We kept the name of the building
        — everyone already called it "the second story" — and it turned out
        to suit what we sell.
      </p>
      <p style={{ color: C.inkSoft, fontFamily: "Libre Franklin", lineHeight: 1.8 }} className="text-base mb-5">
        We take consignment from estate sales, closet clear-outs, and people
        just passing through town. Nothing is mass-produced, nothing is new,
        and almost everything comes with a note about where it's been. We
        write the notes ourselves, from what people tell us when they drop
        things off.
      </p>
      <p style={{ color: C.inkSoft, fontFamily: "Libre Franklin", lineHeight: 1.8 }} className="text-base">
        If you're cleaning out a closet, an attic, or an estate, we'd like to
        talk to you before you call a dumpster. Reach out through the contact
        page.
      </p>
    </div>
  );
}

function EventsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h2 style={{ fontFamily: "Bodoni Moda", color: C.ink }} className="text-3xl mb-2">Upcoming</h2>
      <p style={{ color: C.inkSoft, fontFamily: "Libre Franklin" }} className="mb-10">In the order they're happening.</p>
      <div className="space-y-0">
        {EVENTS.map((e, i) => (
          <div key={i} style={{ borderTop: i === 0 ? `1px solid ${C.line}` : "none", borderBottom: `1px solid ${C.line}` }}
            className="py-6 flex gap-6">
            <span style={{ fontFamily: "Bodoni Moda", color: C.ink, minWidth: "110px" }} className="text-sm pt-1">{e.date}</span>
            <div>
              <h3 style={{ fontFamily: "Bodoni Moda", color: C.ink }} className="text-lg">{e.title}</h3>
              <p style={{ color: C.inkSoft, fontFamily: "Libre Franklin" }} className="text-sm mt-1">{e.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
      <div>
        <h2 style={{ fontFamily: "Bodoni Moda", color: C.ink }} className="text-3xl mb-6">Find us</h2>
        <div style={{ fontFamily: "Libre Franklin", color: C.inkSoft }} className="space-y-4 text-sm">
          <div className="flex gap-3"><MapPin size={18} color={C.ink} /> Pakistan</div>
          <div className="flex gap-3"><Clock size={18} color={C.ink} /> Tue–Sun, 11am–7pm. Closed Mondays.</div>
          <div className="flex gap-3"><Send size={18} color={C.ink} /> DM to buy or inquire — @secondstory.pk</div>
          <div className="flex gap-3"><Mail size={18} color={C.ink} /> hello@secondstory.pk</div>
        </div>
      </div>
      <div>
        {sent ? (
          <div style={{ background: C.card, border: `1px solid ${C.line}` }} className="rounded p-6">
            <Check size={20} color={C.charcoal} />
            <p style={{ fontFamily: "Bodoni Moda", color: C.ink }} className="text-lg mt-2">Message sent.</p>
            <p style={{ color: C.inkSoft, fontFamily: "Libre Franklin" }} className="text-sm mt-1">We'll get back to you within a day or two.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-3">
            <input required placeholder="Your name" style={{ fontFamily: "Libre Franklin", borderColor: C.line, background: C.card }}
              className="w-full border rounded px-3 py-2 text-sm" />
            <input required type="email" placeholder="Email" style={{ fontFamily: "Libre Franklin", borderColor: C.line, background: C.card }}
              className="w-full border rounded px-3 py-2 text-sm" />
            <textarea required placeholder="What's on your mind?" rows={4} style={{ fontFamily: "Libre Franklin", borderColor: C.line, background: C.card }}
              className="w-full border rounded px-3 py-2 text-sm" />
            <button style={{ background: C.charcoal, color: C.paper, fontFamily: "Libre Franklin" }} className="px-5 py-3 rounded text-sm">
              Send message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function CartDrawer({ cart, setCart, close, checkoutState, setCheckoutState }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const updateQty = (id, delta) => {
    setCart((c) => c.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };
  const remove = (id) => setCart((c) => c.filter((i) => i.id !== id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div onClick={close} className="absolute inset-0" style={{ background: "#00000055" }} />
      <div style={{ background: C.paper, borderLeft: `1px solid ${C.line}` }} className="relative w-full max-w-sm h-full overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 style={{ fontFamily: "Bodoni Moda", color: C.ink }} className="text-xl">
            {checkoutState === "confirmed" ? "Order placed" : checkoutState === "checkout" ? "Checkout" : "Your bag"}
          </h3>
          <button onClick={close}><X size={20} color={C.ink} /></button>
        </div>

        {checkoutState === "confirmed" ? (
          <div>
            <Check size={24} color={C.charcoal} />
            <p style={{ fontFamily: "Libre Franklin", color: C.inkSoft }} className="mt-3 text-sm">
              Thanks — your order is reserved and will be ready for pickup at
              214 Elm Street within 2 days. A confirmation email is on its way.
            </p>
            <button onClick={close} style={{ background: C.charcoal, color: C.paper, fontFamily: "Libre Franklin" }}
              className="mt-6 px-5 py-3 rounded text-sm w-full">Done</button>
          </div>
        ) : checkoutState === "checkout" ? (
          <form onSubmit={(e) => { e.preventDefault(); setCheckoutState("confirmed"); setCart([]); }} className="space-y-3">
            <input required placeholder="Full name" style={{ fontFamily: "Libre Franklin", borderColor: C.line, background: C.card }}
              className="w-full border rounded px-3 py-2 text-sm" />
            <input required type="email" placeholder="Email" style={{ fontFamily: "Libre Franklin", borderColor: C.line, background: C.card }}
              className="w-full border rounded px-3 py-2 text-sm" />
            <input required placeholder="Card number" style={{ fontFamily: "Libre Franklin", borderColor: C.line, background: C.card }}
              className="w-full border rounded px-3 py-2 text-sm" />
            <div className="flex gap-3">
              <input required placeholder="MM/YY" style={{ fontFamily: "Libre Franklin", borderColor: C.line, background: C.card }}
                className="w-1/2 border rounded px-3 py-2 text-sm" />
              <input required placeholder="CVC" style={{ fontFamily: "Libre Franklin", borderColor: C.line, background: C.card }}
                className="w-1/2 border rounded px-3 py-2 text-sm" />
            </div>
            <p style={{ color: C.inkSoft, fontFamily: "Libre Franklin" }} className="text-xs pt-1">
              This is a demo checkout — no card details are processed or stored.
            </p>
            <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
              <span style={{ fontFamily: "Libre Franklin", color: C.inkSoft }} className="text-sm">Total</span>
              <span style={{ fontFamily: "Bodoni Moda", color: C.ink }} className="text-lg">${total}</span>
            </div>
            <button style={{ background: C.charcoal, color: C.paper, fontFamily: "Libre Franklin" }} className="w-full py-3 rounded text-sm">
              Place order
            </button>
          </form>
        ) : (
          <>
            {cart.length === 0 ? (
              <p style={{ color: C.inkSoft, fontFamily: "Libre Franklin" }} className="text-sm">Nothing in your bag yet.</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 items-start">
                    <div style={{ background: C.charcoal }} className="w-10 h-10 rounded flex items-center justify-center shrink-0">
                      <item.Icon size={16} color={C.ink} />
                    </div>
                    <div className="flex-1">
                      <p style={{ fontFamily: "Bodoni Moda", color: C.ink }} className="text-sm leading-tight">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => updateQty(item.id, -1)}><Minus size={12} color={C.inkSoft} /></button>
                        <span style={{ fontFamily: "Libre Franklin", color: C.inkSoft }} className="text-xs">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)}><Plus size={12} color={C.inkSoft} /></button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p style={{ fontFamily: "Bodoni Moda", color: C.ink }} className="text-sm">${item.price * item.qty}</p>
                      <button onClick={() => remove(item.id)} style={{ color: C.inkSoft, fontFamily: "Libre Franklin" }} className="text-xs underline mt-1">remove</button>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${C.line}` }}>
                  <span style={{ fontFamily: "Libre Franklin", color: C.inkSoft }} className="text-sm">Total</span>
                  <span style={{ fontFamily: "Bodoni Moda", color: C.ink }} className="text-lg">${total}</span>
                </div>
                <button onClick={() => setCheckoutState("checkout")} style={{ background: C.charcoal, color: C.paper, fontFamily: "Libre Franklin" }}
                  className="w-full py-3 rounded text-sm flex items-center justify-center gap-1">
                  Checkout <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function SecondStorySite() {
  const [page, setPage] = useState("Home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutState, setCheckoutState] = useState("cart");

  const addToCart = (item) => {
    setCart((c) => {
      const existing = c.find((i) => i.id === item.id);
      if (existing) return c.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { ...item, qty: 1 }];
    });
    setCartOpen(true);
    setCheckoutState("cart");
  };

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  return (
    <div style={{ background: C.paper, minHeight: "100%" }} className="relative">
      <style>{FONTS}</style>
      <Grain opacity={0.035} />
      <Nav page={page} setPage={setPage} cartCount={cartCount} openCart={() => { setCartOpen(true); setCheckoutState("cart"); }} />
      {page === "Home" && <Hero setPage={setPage} />}
      {page === "Home" && (
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 style={{ fontFamily: "Bodoni Moda", color: C.ink }} className="text-2xl mb-6">Recently arrived</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ITEMS.slice(0, 4).map((item) => <Tag key={item.id} item={item} onAdd={addToCart} />)}
          </div>
        </div>
      )}
      {page === "Shop" && <ShopPage onAdd={addToCart} />}
      {page === "About" && <AboutPage />}
      {page === "Events" && <EventsPage />}
      {page === "Contact" && <ContactPage />}

      <footer style={{ background: C.charcoalDeep, color: C.paper }} className="mt-8 relative overflow-hidden">
        <Grain opacity={0.06} />
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-4 relative">
          <div className="flex items-center gap-3">
            <LogoMark size={30} />
            <span style={{ fontFamily: "Bodoni Moda" }} className="text-lg">SECOND STORY</span>
          </div>
          <span style={{ fontFamily: "Libre Franklin", color: C.paper, opacity: 0.7 }} className="text-xs">
            secondstory.pk · Pakistan · Tue–Sun 11–7
          </span>
        </div>
      </footer>

      {cartOpen && (
        <CartDrawer
          cart={cart}
          setCart={setCart}
          close={() => setCartOpen(false)}
          checkoutState={checkoutState}
          setCheckoutState={setCheckoutState}
        />
      )}
    </div>
  );
}
