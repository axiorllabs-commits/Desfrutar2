import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './styles.css';
import './catalogo.css';
import './historia.css';
import SharedLayout from './SharedLayout.jsx';
import Catalogo from './Catalogo.jsx';
import Historia from './Historia.jsx';
import Contato from './Contato.jsx';

const products = ['Polpas de Frutas', 'Queijos Artesanais', 'Derivados Regionais'];

function HomeContent() {
  const navigate = useNavigate();

  return (
    <>
      <div className="df-home-banner">
        <picture>
          <source media="(max-width: 700px)" srcSet="/referencia-mobile.jpg" />
          <img
            className="art"
            src="/referencia.jpg"
            alt="Desfrutar Frutas, desde 2013. Da nossa fazenda para a sua mesa. Polpas naturais e derivados artesanais. Nossa história: A Desfrutar nasceu em 2013, da paixão pela produção no campo e do desejo de levar alimentos naturais e de qualidade para mais pessoas. Desde então, cultivamos com cuidado, respeito à terra e qualidade em cada etapa, do plantio ao produto final. Nossos produtos: polpas de frutas, queijos artesanais e derivados regionais."
          />
        </picture>
        <span className="anchor" id="inicio" />
        <span className="anchor" id="historia" />
        <span className="anchor" id="produtos" />
        <span className="anchor" id="contato" />
        <div className="overlay product-links">
          {products.map(p => (
            <button
              type="button"
              key={p}
              onClick={() =>
                navigate(
                  p.startsWith('Polpas')
                    ? '/produtos/polpas'
                    : p.startsWith('Queijos')
                      ? '/produtos/queijos'
                      : '/produtos/frutas'
                )
              }
              aria-label={'Comprar ' + p}
            />
          ))}
        </div>
        <button
          type="button"
          className="overlay whatsapp"
          onClick={() => navigate('/produtos/frutas')}
          aria-label="Comprar pelo WhatsApp"
        >
          <span className="df-home-wa-content" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.45L3 20.5l1.6-5.2A8.5 8.5 0 1 1 21 11.5Z" />
              <path d="M9.4 8.9c.2-.4.4-.4.6-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3-.1.5.4.8 1.1 1.5 1.9 1.9.2.1.4 0 .5-.1l.6-.5c.2-.1.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.2.6-.5.8-.5.3-1.3.4-2.2.1-1.9-.6-3.9-2.5-4.5-4.5-.3-.9-.2-1.7.1-2.2Z" fill="currentColor" stroke="none" />
            </svg>
            <span>Comprar pelo WhatsApp</span>
          </span>
        </button>
      </div>
      <div className="df-home-mobile-landscape" aria-hidden="true" />
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route element={<SharedLayout />}>
        <Route path="/" element={<HomeContent />} />
        <Route path="/nossa-historia" element={<Historia />} />
        <Route path="/produtos" element={<Catalogo />} />
        <Route path="/produtos/:categoryId" element={<Catalogo />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
