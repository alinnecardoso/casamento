export default function AdminPagamentosPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-[#2c2c2c]">Confirmações de Pagamento</h1>
        <p className="text-sm text-[#4a4a4a] mt-1">
          Rastreamento de PIX não está disponível nesta versão.
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg text-center py-16">
        <p className="text-3xl mb-3">💳</p>
        <p className="text-[#4a4a4a]">Não disponível.</p>
        <p className="text-sm text-gray-400 mt-1">
          Para rastrear pagamentos, verifique diretamente no app do banco.
        </p>
      </div>
    </div>
  )
}
