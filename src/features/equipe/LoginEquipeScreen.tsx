"use client";

import { LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Campo } from "@/components/ui/Campo";
import { Splash } from "@/components/ui/Splash";
import { CREDENCIAIS_EQUIPE } from "@/constants/app";
import { useEquipeAuth } from "@/contexts/equipe-auth-context";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LoginEquipeScreen() {
  const { entrar, sessao, pronto } = useEquipeAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (pronto && sessao) router.replace("/equipe");
  }, [pronto, sessao, router]);

  if (!pronto || sessao) return <Splash />;

  function aoEntrar(evento: React.FormEvent) {
    evento.preventDefault();
    setEnviando(true);
    const resultado = entrar(email, senha);
    setEnviando(false);
    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }
    router.replace("/equipe");
  }

  return (
    <div className="flex h-dvh items-center justify-center overflow-y-auto bg-bg px-4 py-10">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark size={64} />
          <h1 className="mt-4 text-[26px] font-semibold tracking-tight">Área da equipe</h1>
          <p className="mt-1 text-sm text-muted">Secretaria e senseis da BJJHub Academy</p>
        </div>

        <form onSubmit={aoEntrar} className="rounded-2xl bg-bg-secondary p-5" noValidate>
          <div className="flex flex-col gap-4">
            <Campo
              label="E-mail"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(evento) => {
                setEmail(evento.target.value);
                setErro(null);
              }}
              placeholder="sensei@bjjhub.demo"
            />
            <div className="relative">
              <Campo
                label="Senha"
                type={mostrarSenha ? "text" : "password"}
                autoComplete="current-password"
                value={senha}
                onChange={(evento) => {
                  setSenha(evento.target.value);
                  setErro(null);
                }}
              />
              <button
                type="button"
                className="absolute top-9 right-2 flex h-10 w-10 items-center justify-center text-muted"
                onClick={() => setMostrarSenha((atual) => !atual)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {erro ? (
              <p className="text-sm text-primary" role="alert">
                {erro}
              </p>
            ) : null}
            <Button type="submit" disabled={enviando}>
              {enviando ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        </form>

        <p className="mt-5 text-center text-xs leading-5 text-muted">
          Demonstração: {CREDENCIAIS_EQUIPE.email}
          <span className="mx-1.5 text-line">·</span>
          {CREDENCIAIS_EQUIPE.senha}
        </p>
        <button
          type="button"
          className="mt-2 w-full text-center text-sm text-muted"
          onClick={() => {
            setEmail(CREDENCIAIS_EQUIPE.email);
            setSenha(CREDENCIAIS_EQUIPE.senha);
            setErro(null);
          }}
        >
          Preencher acesso de demonstração
        </button>
        <p className="mt-8 text-center">
          <Link href="/login" className="text-xs text-muted/80">
            Acesso do aluno
          </Link>
        </p>
      </div>
    </div>
  );
}
