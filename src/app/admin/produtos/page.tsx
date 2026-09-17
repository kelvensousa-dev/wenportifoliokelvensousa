'use client';

import { Archive, Edit3, Eye, PackagePlus, Search, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import AdminShell from '@/components/AdminShell';

type AdminProduct = { id: number; name: string; segment: string; price: string; status: string; sales: number };

const initialProducts: AdminProduct[] = [
  { id: 1, name: 'Orbit CRM Pro', segment: 'Vendas', price: 'US$ 129', status: 'Ativo', sales: 184 },
  { id: 2, name: 'Atlas ERP Cloud', segment: 'Sistemas ERP', price: 'US$ 299', status: 'Ativo', sales: 96 },
  { id: 3, name: 'Signal Engine', segment: 'Marketing', price: 'US$ 149', status: 'Ativo', sales: 72 },
  { id: 4, name: 'Flow Bot', segment: 'WhatsApp', price: 'US$ 179', status: 'Rascunho', sales: 48 }
];

export default function ProductsAdminPage() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [created, setCreated] = useState(false);

  function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreated(true);
    setFormOpen(false);
  }

  return <AdminShell><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">Catálogo</p><h1 className="mt-2 font-display text-4xl font-bold tracking-[-.05em]">Produtos ativos.</h1><p className="mt-3 text-sm text-[#718096]">Cadastre, publique, edite e arquive produtos do portfólio.</p></div><button onClick={() => setFormOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1A202C] px-5 py-3 text-sm font-bold text-white"><PackagePlus size={17} /> Novo produto</button></div>{created && <p className="mt-5 rounded-xl bg-[#E6FFFA] p-4 text-sm font-bold text-[#277C73]">Produto salvo como rascunho e pronto para revisão.</p>}<div className="mt-8 rounded-3xl border border-black/5 bg-white p-6 shadow-sm"><label className="relative block max-w-sm"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar produtos..." className="h-11 w-full rounded-full border border-black/10 pl-11 pr-4 text-sm outline-none focus:border-[#36B7C9]" /></label><div className="mt-7 grid gap-3">{products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase())).map((product) => <article key={product.id} className="flex flex-col justify-between gap-5 rounded-2xl border border-black/5 p-5 md:flex-row md:items-center"><div className="flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFFFFF] text-[#1597A8]"><Archive size={19} /></span><div><h2 className="font-bold">{product.name}</h2><p className="mt-1 text-xs text-[#718096]">{product.segment} · {product.price} · {product.sales} vendas</p></div></div><div className="flex items-center gap-2"><span className={`rounded-full px-3 py-1 text-xs font-bold ${product.status === 'Ativo' ? 'bg-[#E6FFFA] text-[#277C73]' : 'bg-[#FFFAF0] text-[#C05621]'}`}>{product.status}</span><button aria-label={`Visualizar ${product.name}`} className="rounded-full border border-black/10 p-2 text-[#718096]"><Eye size={16} /></button><button aria-label={`Editar ${product.name}`} className="rounded-full border border-black/10 p-2 text-[#718096]"><Edit3 size={16} /></button><button aria-label={`Excluir ${product.name}`} onClick={() => setProducts((items) => items.filter((item) => item.id !== product.id))} className="rounded-full border border-red-100 p-2 text-red-400"><Trash2 size={16} /></button></div></article>)}</div></div>{formOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-[#1A202C]/60 px-6"><form onSubmit={createProduct} className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#36A5B4]">Novo registro</p><h2 className="mt-2 font-display text-2xl font-bold">Cadastrar produto</h2></div><button type="button" onClick={() => setFormOpen(false)} className="text-sm font-bold text-[#718096]">Fechar</button></div><div className="mt-7 grid gap-4"><input required placeholder="Nome do produto" className="h-12 rounded-xl border border-black/10 px-4 text-sm" /><input required placeholder="Slug público" className="h-12 rounded-xl border border-black/10 px-4 text-sm" /><select required defaultValue="" className="h-12 rounded-xl border border-black/10 bg-white px-4 text-sm"><option value="" disabled>Segmento</option><option>Vendas</option><option>Marketing</option><option>Sistemas ERP</option><option>Apps</option><option>WhatsApp</option><option>Landing Pages</option></select><input required placeholder="Preço em USD" className="h-12 rounded-xl border border-black/10 px-4 text-sm" /><textarea required placeholder="Descrição" className="min-h-28 rounded-xl border border-black/10 p-4 text-sm" /><button className="h-12 rounded-xl bg-[#1A202C] text-sm font-bold text-white">Salvar rascunho</button></div></form></div>}</div></AdminShell>;
}
