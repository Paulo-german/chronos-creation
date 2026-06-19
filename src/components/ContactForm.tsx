import { useState } from 'react'
import type { FormEvent } from 'react'

export default function ContactForm() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  const inputCls = "w-full rounded-xl bg-ink border border-line px-4 py-3 text-sm focus:border-cyan outline-none transition"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-mut mb-2">Nome</label>
        <input type="text" required className={inputCls} placeholder="Seu nome" />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-mut mb-2">Email</label>
        <input type="email" required className={inputCls} placeholder="voce@email.com" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-mut mb-2">Tipo de projeto</label>
          <select className={`${inputCls} text-mut`}>
            <option>Selecione...</option>
            <option>Audiovisual</option>
            <option>Redes Sociais</option>
            <option>Marketing</option>
            <option>Branding</option>
            <option>Website</option>
            <option>Fotografia</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-mut mb-2">Orçamento</label>
          <select className={`${inputCls} text-mut`}>
            <option>Selecione...</option>
            <option>Até R$ 5k</option>
            <option>R$ 5k – 15k</option>
            <option>R$ 15k+</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-cyan hover:bg-cyan-bright text-ink font-bold py-3.5 text-sm uppercase tracking-wide transition"
      >
        {sent ? 'Mensagem enviada ✓' : 'Enviar mensagem'}
      </button>
    </form>
  )
}
