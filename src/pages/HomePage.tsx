import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowUpRight, Star, ChevronDown, CheckCircle2 } from "lucide-react";
import { PRODUCTS, ARTICLES, TESTIMONIALS, MEMBERSHIP_TIERS, FAQS, CATEGORIES } from "../data/luxecartData";
import { ParticleCanvas } from "../components/ParticleCanvas";
import { navigateTo } from "../routing";

export const HomePage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const heroRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const featuredProducts = PRODUCTS.slice(0, 4);

  /* ── GSAP hero entrance animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Split LUXECART into individual character spans and animate
      if (wordmarkRef.current) {
        const text = wordmarkRef.current.textContent ?? "";
        wordmarkRef.current.innerHTML = text
          .split("")
          .map((ch) =>
            ch === " "
              ? `<span style="display:inline-block;width:0.3em">&nbsp;</span>`
              : `<span class="hero-char" style="display:inline-block;overflow:hidden"><span style="display:inline-block">${ch}</span></span>`
          )
          .join("");

        const innerSpans = wordmarkRef.current.querySelectorAll<HTMLElement>(".hero-char > span");
        tl.fromTo(
          innerSpans,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.06 },
          0
        );
      }

      // Animate "Elevate Your Style" as one unit — avoids word-collapse / bullet artifact
      if (taglineRef.current) {
        tl.fromTo(
          taglineRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.85, ease: "power2.out" },
          0.55
        );
      }

      // Sidebar text fade-in slide-up
      if (sidebarRef.current) {
        tl.fromTo(
          sidebarRef.current,
          { opacity: 0, x: -16 },
          { opacity: 1, x: 0, duration: 0.8 },
          0.7
        );
      }

      // Button fade-in
      if (btnRef.current) {
        tl.fromTo(
          btnRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7 },
          1.0
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-body">
      {/* 1. HERO SECTION
           Mobile  (≤767 px): min-height capped to 80 vh to avoid awkward
                               portrait-zoom. object-position shifts to
                               "50% 35%" so the bag, perfume bottle, and scarf
                               are all visible — not just the handle.
           Desktop (≥768 px): object-position "50% 40%" keeps the full tabletop
                               composition (bag, perfume, sunglasses, scarf,
                               books, flowers) in frame across 1024–2560 px.
      */}
      <section
        id="hero-wrapper"
        ref={heroRef}
        className="relative flex flex-col items-center overflow-hidden bg-neutral-950"
      >
        {/* Full-bleed background image — art-directed per breakpoint */}
        <div className="absolute inset-0 z-0">
          {/*
            All height + object-position rules live here so one media query
            controls everything — no inline style fighting CSS.

            Mobile  (< 768px): 80vh — composition legible, no tall portrait zoom
            Desktop (≥ 768px): 100vh — full viewport, complete arrangement
          */}
          <style>{`
            #hero-wrapper,
            #hero-content {
              min-height: 80vh;
            }
            #hero-bg-img {
              object-position: center center;
            }
            @media (min-width: 768px) {
              #hero-wrapper,
              #hero-content {
                min-height: 100vh;
              }
              #hero-bg-img {
                object-position: 50% 40%;
              }
            }
          `}</style>
          <picture className="w-full h-full block">
            <source media="(max-width: 767px)" srcSet="/image/luxecart-hero-mobile.png" />
            <img
              id="hero-bg-img"
              src="/image/luxecart-hero.png"
              alt="LuxeCart luxury flat-lay: Chanel perfume, designer handbag, silk scarf, sunglasses, and coffee-table books"
              className="w-full h-full object-cover"
            />
          </picture>
          {/* Overlay: stronger top vignette for nav/wordmark legibility,
              subtle bottom vignette for copyright text */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70" />
        </div>

        {/* Particle dots */}
        <ParticleCanvas />

        {/*
          LEFT SIDEBAR — "Premium Luxury Ecommerce" vertical text.
          `hidden sm:flex` is the intentional CSS rule that hides it on mobile
          (< 640 px) so it doesn't get clipped by overflow or crowd the narrow
          viewport. It reappears at sm (640 px+).
        */}
        <div
          ref={sidebarRef}
          className="absolute left-0 top-0 bottom-0 z-10 hidden sm:flex items-center justify-center"
          style={{ width: "36px" }}
        >
          <span
            className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/50"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              letterSpacing: "0.3em",
              userSelect: "none",
            }}
          >
            Premium Luxury Ecommerce
          </span>
        </div>

        {/* CENTER CONTENT — Wordmark, Tagline, Button
            max-width: 1600px cap prevents the text block from feeling lost
            in empty space on ultrawide (2560 px+) monitors. The background
            image still goes full-bleed. */}
        <div
          id="hero-content"
          className="relative z-10 flex flex-col items-center justify-center flex-1 w-full px-6 sm:px-16 text-center"
          style={{
            maxWidth: "1600px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {/* LUXECART wordmark — character split GSAP target.
              clamp() ensures smooth fluid scaling: ~3.2 rem at 320 px,
              peaks at 7.5 rem around 1440 px, stays there on wider screens. */}
          <h1
            ref={wordmarkRef}
            className="font-heading font-normal text-white leading-none select-none"
            style={{
              fontSize: "clamp(3.2rem, 10vw, 7.5rem)",
              letterSpacing: "0.07em",
              fontWeight: 400,
              textShadow: "0 4px 40px rgba(0,0,0,0.55)",
            }}
          >
            LUXECART
          </h1>

          {/* Elevate Your Style — animated as whole unit by GSAP.
              clamp() keeps the tracking tight and legible at all widths. */}
          <div
            ref={taglineRef as React.RefObject<HTMLDivElement>}
            className="mt-2 sm:mt-4 text-white/88 font-light"
            style={{
              fontSize: "clamp(0.72rem, 1.5vw, 1.05rem)",
              letterSpacing: "0.32em",
              textShadow: "0 2px 12px rgba(0,0,0,0.45)",
              opacity: 0, /* GSAP fades this in */
            }}
          >
            Elevate Your Style
          </div>

          {/* Ghost SHOP NOW button — transparent, white border.
              Width uses clamp via Tailwind's named widths so it scales
              comfortably from 320 px to 2560 px without looking oversized. */}
          <button
            ref={btnRef}
            onClick={() => navigateTo("/collections")}
            className={[
              "cursor-pointer",
              "mt-8 sm:mt-10",
              "opacity-0",           // starts invisible; GSAP fades in
              "min-h-[44px] sm:min-h-[52px]",
              "w-[160px] sm:w-[200px] md:w-[240px]",
              "py-3 sm:py-4",
              "bg-transparent hover:bg-white/10",
              "text-white font-light",
              "text-[10px] sm:text-[12px] md:text-[13px]",
              "uppercase tracking-[0.35em] sm:tracking-[0.45em]",
              "border border-white/90 hover:border-white",
              "transition-all duration-300",
              "flex items-center justify-center gap-2 sm:gap-3",
              "active:scale-95",
            ].join(" ")}
          >
            <span>SHOP NOW</span>
            <span className="text-sm sm:text-base leading-none">→</span>
          </button>
        </div>

        {/* Bottom-right copyright */}
        <div className="relative z-10 w-full px-5 sm:px-8 pb-4 flex justify-end">
          <span className="font-mono text-[10px] sm:text-xs text-white/35">
            © 2026 LuxeCart
          </span>
        </div>
      </section>

      {/* 2. WHITE FEATURED COLLECTIONS SECTION (2x2 Product Grid) */}
      <section className="bg-white text-neutral-950 py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-neutral-400">
                01 // CURATED SELECTION
              </span>
              <h2 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight mt-2 text-neutral-950">
                Featured Collections
              </h2>
              <p className="mt-3 text-neutral-600 text-base sm:text-lg">
                Discover our handpicked selection of luxury essentials.
              </p>
            </div>
            <button
              onClick={() => navigateTo("/collections")}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold text-neutral-950 hover:text-red-600 transition-colors py-2 min-h-[44px] cursor-pointer"
            >
              View All 12 Pieces <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigateTo(`/collections/${product.slug}`)}
                className="group cursor-pointer flex flex-col bg-neutral-50 border border-neutral-200 hover:border-neutral-400 transition-all duration-300"
              >
                <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden bg-neutral-950">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2.5 rounded-full text-white group-hover:bg-red-600 transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <span className="absolute bottom-4 left-4 rounded-none bg-neutral-950/80 backdrop-blur-md px-3.5 py-1 text-xs font-mono text-white border border-neutral-800">
                    {product.category}
                  </span>
                </div>
                <div className="p-6 sm:p-8 flex items-center justify-between bg-white border-t border-neutral-100">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-neutral-950 group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-xs text-neutral-500 font-mono">
                      <Star className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                      <span>{product.rating} ({product.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <span className="font-mono text-lg font-bold text-neutral-950">
                    {product.formattedPrice}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DARK OUR STORY SECTION */}
      <section className="bg-neutral-950 text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative overflow-hidden border border-neutral-800">
            <img
              src="/image/philosophy.png"
              alt="LuxeCart Luxury Curation"
              className="w-full h-auto object-cover max-h-[550px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
          </div>

          <div className="space-y-6">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-red-500">
              02 // OUR PHILOSOPHY
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold leading-tight text-white">
              We curate exceptional pieces that embody timeless elegance, bringing the world's finest craftsmanship directly to you.
            </h2>
            <div className="h-[1.5px] w-20 bg-red-600 my-4" />
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-light">
              Founded in 2018, LuxeCart has grown from a small boutique to a premier destination for luxury enthusiasts worldwide. We partner with renowned designers and artisan craftsmen to offer an exclusive collection of fashion, accessories, and lifestyle products that define sophistication and quality.
            </p>

            <div className="pt-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-neutral-700 shadow-lg shrink-0">
                <img
                  src="/image/founder.jpg"
                  alt="Anushka Shrestha"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold text-white">Anushka Shrestha</h4>
                <p className="text-xs text-neutral-500 font-mono">Founder & Creative Director</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BLACK OUR CATEGORIES SECTION (Numbered Rows) */}
      <section className="bg-neutral-950 text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                03 // DISCOVER DEPARTMENTS
              </span>
              <h2 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight mt-2">
                Our Categories
              </h2>
            </div>
            <button
              onClick={() => navigateTo("/categories")}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold text-neutral-300 hover:text-red-500 transition-colors py-2 min-h-[44px] cursor-pointer"
            >
              Explore All Categories <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-neutral-900 border-t border-b border-neutral-900">
            {CATEGORIES.map((cat, idx) => (
              <div
                key={cat.slug}
                onClick={() => navigateTo(`/categories/${cat.slug}`)}
                className="group cursor-pointer py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:px-4 hover:bg-neutral-900/50"
              >
                <div className="flex items-start sm:items-center gap-6">
                  <span className="font-mono text-lg font-bold text-red-600">
                    [0{idx + 1}]
                  </span>
                  <div>
                    <h3 className="font-heading text-2xl sm:text-4xl font-bold text-white group-hover:text-red-500 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl font-light">
                      {cat.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:self-center">
                  <span className="font-mono text-xs text-neutral-500">
                    {cat.itemCount} Items
                  </span>
                  <div className="w-10 h-10 border border-neutral-800 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIAL CARDS */}
      <section className="bg-neutral-950 text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto text-center">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-red-500">
            04 // CLIENT VOICES
          </span>
          <h2 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight mt-2">
            What Our Clients Say
          </h2>
          <p className="mt-3 text-neutral-400 text-xs font-mono">
            4.9 out of 5, based on 340+ verified reviews
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12 text-left">
            {TESTIMONIALS.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-8 bg-neutral-900 border border-neutral-800 flex flex-col justify-between space-y-6 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-1 text-red-600">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-neutral-300 text-sm leading-relaxed italic font-light">
                  "{item.quote}"
                </p>
                <div className="pt-4 border-t border-neutral-800">
                  <h4 className="font-heading text-sm font-bold text-white">{item.author}</h4>
                  <span className="text-xs font-mono text-red-500">{item.role}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <button
              onClick={() => navigateTo("/reviews")}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold text-white hover:text-red-500 transition-colors min-h-[44px] cursor-pointer"
            >
              Read All Verified Reviews <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. LUXE MEMBERSHIP PRICING SECTION */}
      <section className="bg-neutral-950 text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-red-500">
              05 // EXCLUSIVE PRIVILEGES
            </span>
            <h2 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight mt-2">
              Luxe Membership
            </h2>
            <p className="mt-3 text-neutral-400 text-base sm:text-lg font-light">
              Join our exclusive membership program for privileged access and benefits.
            </p>
          </div>

          {/* 3 Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {MEMBERSHIP_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative p-8 flex flex-col justify-between border transition-all duration-300 ${
                  tier.popular
                    ? "bg-neutral-900 border-red-600 shadow-2xl z-10"
                    : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white font-mono text-[10px] uppercase tracking-widest font-bold px-4 py-1">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white">{tier.name}</h3>
                  <p className="text-xs text-neutral-400 mt-2 min-h-[36px] font-light">{tier.description}</p>
                  <div className="my-6 flex items-baseline gap-1">
                    <span className="font-heading text-3xl sm:text-4xl font-extrabold text-white">{tier.priceFormatted}</span>
                    <span className="font-mono text-xs text-neutral-400">{tier.period}</span>
                  </div>
                  <div className="h-[1px] bg-neutral-800 mb-6" />
                  <ul className="space-y-3">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs text-neutral-300 font-light">
                        <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-800">
                  <button
                    onClick={() => navigateTo("/membership")}
                    className={`w-full py-3.5 font-bold font-mono text-xs uppercase tracking-[0.18em] transition-all duration-300 min-h-[44px] cursor-pointer shadow-lg active:scale-95 ${
                      tier.popular
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-neutral-900 border border-neutral-700 text-white hover:border-red-600 hover:bg-neutral-800"
                    }`}
                  >
                    {tier.ctaText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. THE LUXE JOURNAL ARTICLE PREVIEWS */}
      <section className="bg-neutral-950 text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                06 // EDITORIAL INSIGHTS
              </span>
              <h2 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight mt-2">
                The Luxe Journal
              </h2>
            </div>
            <button
              onClick={() => navigateTo("/journal")}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold text-white hover:text-red-500 transition-colors py-2 min-h-[44px] cursor-pointer"
            >
              Read All Articles <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {ARTICLES.slice(0, 2).map((article) => (
              <div
                key={article.slug}
                onClick={() => navigateTo(`/journal/${article.slug}`)}
                className="group cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-neutral-950">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-4 left-4 bg-neutral-950/90 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-red-500 border border-neutral-800">
                    {article.categoryTag}
                  </span>
                </div>
                <div className="p-6 sm:p-8 space-y-3">
                  <div className="flex items-center gap-3 font-mono text-xs text-neutral-500">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white group-hover:text-red-500 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
                    {article.teaser}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-white font-bold pt-2 group-hover:text-red-500">
                    Read Story <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. BLACK FAQ ACCORDION SECTION */}
      <section className="bg-neutral-950 text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-red-500">
              07 // FREQUENTLY ASKED
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mt-2 text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-neutral-900 border border-neutral-800 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-heading text-base sm:text-lg font-semibold text-white hover:text-red-500 transition-colors min-h-[44px] cursor-pointer"
                  >
                    <span className="text-white">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-red-600 transition-transform duration-300 shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-neutral-300 leading-relaxed border-t border-neutral-800 pt-4 animate-fadeIn font-light">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};
