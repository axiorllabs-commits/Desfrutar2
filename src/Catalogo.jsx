import React, { useEffect, useState } from 'react';
import { categorias, WHATSAPP } from './catalogoDados.js';
import './catalogo.css';
const asset = name => `/catalogo-v3/${name}.${["queijo","cafe","colorau"].includes(name)?"png":"jpg"}`;
const all = categorias.flatMap(c => c.products);
function readCart(){try{return JSON.parse(localStorage.getItem('desfrutar-carrinho-v3')||'{}')||{}}catch{return {}}}
function current(){return categorias.find(c=>c.id===location.pathname.split('/')[2])||categorias[0]}
export default function Catalogo(){
 const [category,setCategory]=useState(current); const [cart,setCart]=useState(readCart); const [open,setOpen]=useState(false); const [notice,setNotice]=useState('');
 useEffect(()=>{localStorage.setItem('desfrutar-carrinho-v3',JSON.stringify(cart))},[cart]);
 useEffect(()=>{const pop=()=>setCategory(current()); window.addEventListener('popstate',pop); return()=>window.removeEventListener('popstate',pop)},[]);
 useEffect(()=>{if(!open)return;const key=e=>{if(e.key==='Escape')setOpen(false)};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[open]);
 const count=all.reduce((n,p)=>n+(cart[p.id]||0),0);
 function change(id,delta){setCart(prev=>{const next={...prev};const n=(next[id]||0)+delta;if(n>0)next[id]=n;else delete next[id];return next})}
 function navigate(e,c){if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();history.pushState({},'',`/produtos/${c.id}`);setCategory(c);}
 function send(){if(!count){setNotice('Adicione pelo menos um produto.');return}if(!/^\d{10,15}$/.test(WHATSAPP)){setNotice('O número comercial ainda precisa ser configurado em catalogoDados.js.');return}const message='Olá! Gostaria de consultar disponibilidade e valores dos seguintes produtos da Desfrutar:\n'+all.filter(p=>cart[p.id]).map(p=>`${cart[p.id]} × ${p.name}`).join('\n');window.open('https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(message),'_blank','noopener,noreferrer')}
 return <main className="df-catalog"><header className="df-head"><a href="/" aria-label="Desfrutar — início"><img src="/logo-oficial.png" alt="Desfrutar Frutas"/></a><nav aria-label="Menu principal"><a href="/#inicio">Início</a><a href="/nossa-historia">Nossa história</a><a className="df-active" href="/produtos/frutas">Produtos</a><a href="/contato">Contato</a></nav><button className="df-buy" onClick={()=>setOpen(true)}>Meu pedido <span>{count}</span></button></header>
 <section className={`df-hero df-hero-${category.id}`}><img src={asset('banner-'+category.id)} alt=""/><div><h1>{category.title}</h1><i className="df-line"/><p>{category.subtitle}</p></div></section>
 <nav className="df-tabs" aria-label="Categorias">{categorias.map(c=><a key={c.id} className={c.id===category.id?'selected':''} aria-current={c.id===category.id?'page':undefined} href={'/produtos/'+c.id} onClick={e=>navigate(e,c)}>{c.label}</a>)}</nav>
 <section className={`df-products df-count-${category.products.length}`} aria-label={category.title}>{category.products.map(p=><article className="df-product" key={p.id}><img src={asset(p.id)} alt={p.name}/><h2>{p.name}</h2><i className="df-line"/><button onClick={()=>change(p.id,1)}>Adicionar <span>+</span>{cart[p.id]?` (${cart[p.id]})`:''}</button></article>)}</section>
 <footer className="df-footer"><div><h2>Monte seu pedido e<br/>finalize pelo WhatsApp</h2><i className="df-line"/></div><button onClick={()=>setOpen(true)}>Comprar pelo WhatsApp</button><img src={asset('fazenda')} alt=""/></footer><div className="df-landscape"/>
 {open&&<div className="df-shade" onClick={()=>setOpen(false)}><section className="df-cart" role="dialog" aria-modal="true" aria-label="Seu pedido" onClick={e=>e.stopPropagation()}><button className="df-close" onClick={()=>setOpen(false)} aria-label="Fechar carrinho">×</button><h2>Seu pedido</h2><p>Consulte os valores e a disponibilidade pelo WhatsApp.</p>{!count&&<p>Seu carrinho está vazio.</p>}{all.filter(p=>cart[p.id]).map(p=><div className="df-cart-row" key={p.id}><strong>{p.name}</strong><button onClick={()=>change(p.id,-1)} aria-label={'Diminuir '+p.name}>−</button><span>{cart[p.id]}</span><button onClick={()=>change(p.id,1)} aria-label={'Aumentar '+p.name}>+</button><button onClick={()=>setCart(old=>{const n={...old};delete n[p.id];return n})}>Remover</button></div>)}<button className="df-finish" onClick={send}>Finalizar pelo WhatsApp</button>{notice&&<p role="status">{notice}</p>}</section></div>}
 </main>
}
