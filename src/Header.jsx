import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function SiteHeader({ cartCount = 0, onOpenCart }) {
  const { pathname } = useLocation();
  const isProdutos = pathname.startsWith('/produtos');

  return (
    <header className="df-shared-header">
      <Link className="df-logo" to="/" aria-label="Desfrutar — início">
        <img src="/logo-oficial.png" alt="Desfrutar Frutas" />
      </Link>

      <nav className="df-nav" aria-label="Menu principal">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? 'df-nav-link active' : 'df-nav-link')}
        >
          Início
        </NavLink>
        <NavLink
          to="/produtos/frutas"
          className={() => (isProdutos ? 'df-nav-link active' : 'df-nav-link')}
        >
          Produtos
        </NavLink>
        <NavLink
          to="/nossa-historia"
          className={({ isActive }) => (isActive ? 'df-nav-link active' : 'df-nav-link')}
        >
          Nossa História
        </NavLink>
      </nav>

      <button
        type="button"
        className="df-order-btn"
        onClick={onOpenCart}
        aria-label={`Meu pedido (${cartCount} ${cartCount === 1 ? 'item' : 'itens'})`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
          <path d="M2.5 4h2.8l2.2 10.6a1.4 1.4 0 0 0 1.37 1.12h8.6a1.4 1.4 0 0 0 1.36-1.06L20.5 7.5H6.2" />
        </svg>
        <span>Meu pedido</span>
        <span className="df-order-count">{cartCount}</span>
      </button>
    </header>
  );
}
