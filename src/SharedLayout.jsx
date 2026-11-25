import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SiteHeader from './Header.jsx';
import SiteFooter from './Footer.jsx';
import { categorias, WHATSAPP } from './catalogoDados.js';
import { getNextRequestNumber } from './firebase.js';

const allProducts = categorias.flatMap(c => c.products.map(p => ({ ...p, categoryId: c.id })));

const PRELOAD_ASSETS = [
  '/referencia.jpg',
  '/referencia-mobile.jpg',
  '/logo-oficial.png',
  '/catalogo-v3/banner-frutas.png',
  '/catalogo-v3/banner-frutas-topo.png',
  '/catalogo-v3/folhas-topo.png',
  '/catalogo-v3/fundo-inicio.jpg',
  '/catalogo-v3/historia-desenho.png',
  '/catalogo-v3/fazenda.png',
  '/catalogo-v3/faixa.png',
  '/catalogo-v3/faixa-mobile.png',
  '/catalogo-v3/historia-raizes.jpg',
  '/catalogo-v3/historia-marca.jpg',
  '/catalogo-v3/historia-producao.jpg',
  '/catalogo-v3/historia-entregas.jpg',
];

function readCart() {
  try {
    return JSON.parse(localStorage.getItem('desfrutar-carrinho-v3') || '{}') || {};
  } catch {
    return {};
  }
}

function getSectionGroup(pathname) {
  if (pathname.startsWith('/produtos')) return 'produtos';
  if (pathname.startsWith('/nossa-historia')) return 'historia';
  if (pathname.startsWith('/contato')) return 'contato';
  return 'home';
}

export default function SharedLayout() {
  const { pathname } = useLocation();
  const [cart, setCart] = useState(readCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [sending, setSending] = useState(false);
  const prevGroupRef = useRef(getSectionGroup(pathname));

  const sectionGroup = getSectionGroup(pathname);
  const isHome = sectionGroup === 'home';
  const isProdutos = sectionGroup === 'produtos';
  const isHistoria = sectionGroup === 'historia';
  const count = allProducts.reduce((n, p) => n + (cart[p.id] || 0), 0);

  useEffect(() => {
    PRELOAD_ASSETS.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('desfrutar-carrinho-v3', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const nextGroup = getSectionGroup(pathname);
    if (nextGroup !== prevGroupRef.current) {
      prevGroupRef.current = nextGroup;
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = e => {
      if (e.key === 'Escape') setCartOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cartOpen]);

  function changeQty(id, delta) {
    setCart(prev => {
      const next = { ...prev };
      const n = (next[id] || 0) + delta;
      if (n > 0) next[id] = n;
      else delete next[id];
      return next;
    });
    setNotice('');
  }

  function removeItem(id) {
    setCart(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  async function sendWhatsApp() {
    if (sending) return;

    const selectedItems = allProducts
      .filter(p => Number(cart[p.id]) > 0)
      .map(p => `- ${p.name} - ${cart[p.id]} ${cart[p.id] === 1 ? 'unidade' : 'unidades'}`);

    if (!selectedItems.length) {
      setNotice('Adicione pelo menos um produto.');
      return;
    }

    setSending(true);
    setNotice('');

    try {
      const requestNumber = await getNextRequestNumber();
      const message = [
        '*DESFRUTAR | CONSULTA DE DISPONIBILIDADE*',
        '',
        `*Solicitação nº ${requestNumber}*`,
        '',
        'Olá! Gostaria de consultar a disponibilidade dos produtos selecionados abaixo:',
        '',
        '*Produtos selecionados:*',
        selectedItems.join('\n'),
        '',
        'Poderiam confirmar a disponibilidade, os valores e as condições de entrega?',
        '',
        'Aguardo o retorno!',
      ].join('\n');

      const url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(message);
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setNotice('Não foi possível gerar o número da solicitação agora. Tente novamente.');
    } finally {
      setSending(false);
    }
  }

  const showFloatBar = isProdutos && count > 0;
  const shellClass = [
    'page',
    'df-shell',
    isHome && 'df-is-home',
    isProdutos && 'df-is-produtos',
    isHistoria && 'df-is-historia',
    showFloatBar && 'df-has-float-bar',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={shellClass}>
      <SiteHeader cartCount={count} onOpenCart={() => setCartOpen(true)} />
      <main className="df-main">
        <Outlet context={{ cart, changeQty, openCart: () => setCartOpen(true) }} />
      </main>
      <SiteFooter show={!isHome} onBuy={() => setCartOpen(true)} />

      {showFloatBar && !cartOpen && (
        <button
          type="button"
          className="df-float-bar"
          onClick={() => setCartOpen(true)}
          aria-label={`Meu pedido (${count} ${count === 1 ? 'produto selecionado' : 'produtos selecionados'})`}
        >
          <span className="df-float-bar-left">
            <svg
              className="df-float-basket"
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 10h14l-1.35 8.1a2 2 0 0 1-1.97 1.65H8.32a2 2 0 0 1-1.97-1.65L5 10Z" />
              <path d="M3 10h18" />
              <path d="M8.5 10 11 4.5" />
              <path d="M15.5 10 13 4.5" />
            </svg>
            <span>Meu pedido</span>
          </span>
          <span className="df-float-bar-right">
            <span className="df-float-count">{count}</span>
            <svg
              className="df-float-arrow"
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </span>
        </button>
      )}

      {cartOpen && (
        <div className="df-shade" onClick={() => setCartOpen(false)}>
          <section
            className="df-cart"
            role="dialog"
            aria-modal="true"
            aria-label="Meu pedido"
            onClick={e => e.stopPropagation()}
          >
            <button type="button" className="df-close" onClick={() => setCartOpen(false)} aria-label="Fechar pedido">
              ×
            </button>
            <h2>Meu pedido</h2>
            <p>Consulte a disponibilidade, os valores e as condições de entrega pelo WhatsApp. Esta solicitação não representa uma compra confirmada.</p>
            {!count && <p>Nenhum produto selecionado no seu pedido.</p>}
            {allProducts
              .filter(p => cart[p.id])
              .map(p => (
                <div className="df-cart-row" key={p.id}>
                  <strong>{p.name}</strong>
                  <button type="button" onClick={() => changeQty(p.id, -1)} aria-label={'Diminuir ' + p.name}>
                    −
                  </button>
                  <span>{cart[p.id]}</span>
                  <button type="button" onClick={() => changeQty(p.id, 1)} aria-label={'Aumentar ' + p.name}>
                    +
                  </button>
                  <button type="button" onClick={() => removeItem(p.id)}>Remover</button>
                </div>
              ))}
            <button type="button" className="df-finish" onClick={sendWhatsApp} aria-busy={sending}>
              Consultar disponibilidade pelo WhatsApp
            </button>
            {notice && <p role="status">{notice}</p>}
          </section>
        </div>
      )}
    </div>
  );
}
