import React from 'react';

export default function SiteFooter({ show = true, onBuy }) {
  if (!show) return null;

  return (
    <footer className="df-site-footer">
      <div className="df-footer">
        <div>
          <h2>
            Monte seu pedido e
            <br />
            finalize pelo WhatsApp
          </h2>
          <i className="df-line" />
        </div>
        <button type="button" className="df-whatsapp-btn" onClick={onBuy}>
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.45L3 20.5l1.6-5.2A8.5 8.5 0 1 1 21 11.5Z" />
            <path d="M9.4 8.9c.2-.4.4-.4.6-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3-.1.5.4.8 1.1 1.5 1.9 1.9.2.1.4 0 .5-.1l.6-.5c.2-.1.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.2.6-.5.8-.5.3-1.3.4-2.2.1-1.9-.6-3.9-2.5-4.5-4.5-.3-.9-.2-1.7.1-2.2Z" fill="currentColor" stroke="none" />
          </svg>
          <span>Comprar pelo WhatsApp</span>
        </button>
        <img src="/catalogo-v3/fazenda.png" alt="" />
      </div>
      <div className="df-landscape" />
    </footer>
  );
}
