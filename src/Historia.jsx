import React from 'react';
import './catalogo.css';
import './historia.css';

const stories = [
  ['raizes', 'As nossas raízes', <>Toda boa história tem suas raízes. E a nossa começou em <strong>1984</strong>, em uma fazenda familiar localizada em Itaipé, Minas Gerais.</>],
  ['marca', 'O nascimento da marca', <>Foi nesse lugar, construído com trabalho, dedicação e amor pela terra, que nasceu a história da Desfrutar. Em <strong>2013</strong>, surgiu a marca, levando para ainda mais pessoas o sabor e a qualidade dos produtos feitos na fazenda.</>],
  ['producao', 'O que produzimos', <>Hoje, reunimos uma variedade de produtos, como polpas de frutas naturais, queijos e outras delícias produzidas com cuidado e tradição, valorizando a origem e o sabor de Minas Gerais.</>],
  ['entregas', 'Da fazenda até você', <>Mais do que produtos, levamos um pedacinho da nossa história até você, com entregas para diversas regiões de Minas.</>],
];

export default function Historia() {
  return (
    <div className="df-history">
      <section className="df-hero df-history-hero">
        <div>
          <h1>Nossa História</h1>
          <i className="df-line" />
          <p>Uma trajetória de família, trabalho e amor pela terra.</p>
        </div>
      </section>
      <section className="df-story-list">
        {stories.map(([id, title, body], i) => {
          const hasImage = id !== 'raizes';
          return (
            <article
              className={['df-story', i % 2 && 'reverse', !hasImage && 'no-image'].filter(Boolean).join(' ')}
              key={id}
            >
              {hasImage && (
                <img src={'/catalogo-v3/historia-' + id + '.jpg'} alt={title + ' — imagem ilustrativa'} />
              )}
              <div>
                <h2>{title}</h2>
                <p>{body}</p>
                <i className="df-line" />
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
