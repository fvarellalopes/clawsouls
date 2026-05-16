import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-yellow-400 mb-4 font-display">404</h1>
        <p className="text-muted-foreground font-body mb-8">
          Página não encontrada — esse terminal não reconhece este endereço.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:brightness-110 transition-all uppercase tracking-widest text-sm"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
