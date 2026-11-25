import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { categorias } from './catalogoDados.js';
import './catalogo.css';

const asset = name => `/catalogo-v3/${name}.${['queijo', 'cafe', 'colorau'].includes(name) ? 'png' : 'jpg'}`;
const all = categorias.flatMap(c =>
  c.products.map(p => ({ ...p, categoryId: c.id }))
);

function resolveCategoryId(id) {
  return categorias.some(c => c.id === id) ? id : categorias[0].id;
}

export default function Catalogo() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { cart, changeQty } = useOutletContext();
  const [selectedCategory, setSelectedCategory] = useState(() => resolveCategoryId(categoryId));

  useEffect(() => {
    setSelectedCategory(resolveCategoryId(categoryId));
  }, [categoryId]);

  const activeCategory = categorias.find(c => c.id === selectedCategory) || categorias[0];
  const filteredProducts = all.filter(p => p.categoryId === selectedCategory);

  function selectCategory(e, c) {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setSelectedCategory(c.id);
    navigate('/produtos/' + c.id);
  }

  return (
    <>
      <section className="df-hero df-hero-frutas">
        <div>
          <h1>Nossos produtos</h1>
          <i className="df-line" />
          <p>Sabores da nossa fazenda para o seu dia a dia.</p>
        </div>
      </section>
      <nav className="df-tabs" aria-label="Categorias">
        {categorias.map(c => (
          <Link
            key={c.id}
            className={c.id === selectedCategory ? 'selected' : ''}
            aria-current={c.id === selectedCategory ? 'page' : undefined}
            to={'/produtos/' + c.id}
            onClick={e => selectCategory(e, c)}
          >
            {c.label}
          </Link>
        ))}
      </nav>
      <section
        className={filteredProducts.length === 1 ? 'df-products df-products-single' : 'df-products'}
        aria-label={activeCategory.title}
      >
        {filteredProducts.map(p => {
          const qty = cart[p.id] || 0;
          return (
            <article className="df-product" key={p.id}>
              <img src={asset(p.id)} alt={p.name} />
              <h2>{p.name}</h2>
              <i className="df-line" />
              {qty > 0 ? (
                <div className="df-qty-control" role="group" aria-label={`Quantidade de ${p.name}`}>
                  <button
                    type="button"
                    className="df-qty-btn"
                    onClick={() => changeQty(p.id, -1)}
                    aria-label={`Diminuir quantidade de ${p.name}`}
                  >
                    −
                  </button>
                  <span className="df-qty-value" aria-live="polite">
                    {qty}
                  </span>
                  <button
                    type="button"
                    className="df-qty-btn"
                    onClick={() => changeQty(p.id, 1)}
                    aria-label={`Aumentar quantidade de ${p.name}`}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button type="button" className="df-add-btn" onClick={() => changeQty(p.id, 1)}>
                  Adicionar <span>+</span>
                </button>
              )}
            </article>
          );
        })}
      </section>
    </>
  );
}
