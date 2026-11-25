import React from 'react';
import { Link } from 'react-router-dom';
import './catalogo.css';
import './historia.css';
import { WHATSAPP } from './catalogoDados.js';

export default function Contato() {
  return (
    <>
      <section className="df-hero df-history-hero">
        <img src="/catalogo-v3/historia-desenho.png" alt="" />
        <div>
          <h1>Contato</h1>
          <i className="df-line" />
          <p>Da nossa fazenda para a sua mesa.</p>
        </div>
      </section>
      <section className="df-history-end">
        <h2>Fale com a Desfrutar</h2>
        <p>Consulte produtos, disponibilidade e entregas em Minas Gerais.</p>
        {WHATSAPP ? (
          <a className="df-buy" href={'https://wa.me/' + WHATSAPP} target="_blank" rel="noreferrer">
            Falar pelo WhatsApp
          </a>
        ) : (
          <p>Canal comercial em configuração.</p>
        )}
        <p>
          <Link to="/produtos/frutas">Conhecer os produtos</Link>
        </p>
      </section>
    </>
  );
}
