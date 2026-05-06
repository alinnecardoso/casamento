import { getPaymentConfirmations } from '@/lib/supabase'

export const revalidate = 0

export default async function AdminPagamentosPage() {
  const confirmations = await getPaymentConfirmations().catch(() => [])

  const total = confirmations.reduce((sum, c) => sum + (c.amount || 0), 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-[#2c2c2c]">Confirmações de Pagamento</h1>
        <p className="text-sm text-[#4a4a4a] mt-1">
          Convidados que clicaram &ldquo;Já paguei&rdquo; após o PIX.
        </p>
      </div>

      {confirmations.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-xs uppercase tracking-widest text-[#4a4a4a] mb-1">Total de confirmações</p>
            <p className="text-3xl font-serif text-[#2c2c2c]">{confirmations.length}</p>
          </div>
          {total > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-xs uppercase tracking-widest text-[#4a4a4a] mb-1">Valor confirmado</p>
              <p className="text-3xl font-serif text-[#c9a96e]">
                R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {confirmations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">💳</p>
            <p className="text-[#4a4a4a]">Nenhuma confirmação ainda.</p>
            <p className="text-sm text-gray-400 mt-1">
              Aparece aqui quando um convidado clicar &ldquo;Já paguei&rdquo; no modal de PIX.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Data', 'Nome', 'Presente', 'Valor', 'Mensagem'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#4a4a4a]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {confirmations.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(c.created_at).toLocaleString('pt-BR', {
                      day: '2-digit', month: '2-digit', year: '2-digit',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#2c2c2c]">{c.guest_name}</td>
                  <td className="px-4 py-3 text-[#4a4a4a]">{c.gift_name || <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3 text-[#c9a96e] font-medium">
                    {c.amount ? `R$ ${c.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-[#4a4a4a] text-xs max-w-xs truncate">
                    {c.message || <span className="text-gray-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
