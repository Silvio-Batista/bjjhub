"use client";

import { LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Campo } from "@/components/ui/Campo";
import { MobileModal } from "@/components/ui/MobileModal";
import { Splash } from "@/components/ui/Splash";
import { APP, CREDENCIAIS_DEMO } from "@/constants/app";
import { useAuth } from "@/contexts/auth-context";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LoginScreen() {
  const { entrar, sessao, pronto } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [recuperar, setRecuperar] = useState(false);

  useEffect(() => {
    if (pronto && sessao) router.replace("/dashboard");
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
    router.replace("/dashboard");
  }

  return (
    <div
      className="h-full overflow-y-auto bg-bg pt-[env(safe-area-inset-top)]"
      style={{
        backgroundImage: "url(/assets/backgrounds/login-dark.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex min-h-full flex-col px-5 pt-16 pb-10">
        <div className="mb-10 flex flex-col items-center text-center">
          <LogoMark size={72} />
          <h1 className="mt-4 text-[28px] font-semibold tracking-tight">{APP.nome}</h1>
          <p className="mt-1 text-sm text-muted">{APP.tagline}</p>
        </div>

        <form onSubmit={aoEntrar} className="rounded-2xl bg-bg-secondary p-4" noValidate>
          <div className="flex flex-col gap-4">
            <Campo
              label="E-mail"
              type="email"
              autoComplete="username"
              inputMode="email"
              value={email}
              onChange={(evento) => {
                setEmail(evento.target.value);
                setErro(null);
              }}
              placeholder="seu@email.com"
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
            <button
              type="button"
              className="self-start text-sm text-muted"
              onClick={() => setRecuperar(true)}
            >
              Esqueci minha senha
            </button>
            <Button type="submit" disabled={enviando}>
              {enviando ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        </form>

        <button
          type="button"
          className="mt-6 text-center text-sm text-muted"
          onClick={() => {
            setEmail(CREDENCIAIS_DEMO.email);
            setSenha(CREDENCIAIS_DEMO.senha);
            setErro(null);
          }}
        >
          Preencher acesso de demonstração
        </button>
      </div>

      <MobileModal
        aberto={recuperar}
        titulo="Recuperar senha"
        onFechar={() => setRecuperar(false)}
      >
        <p className="text-sm leading-6 text-muted">
          Se este e-mail estiver cadastrado, a academia envia as instruções de
          recuperação. Nesta demonstração, use o acesso fornecido pela secretaria.
        </p>
        <Button className="mt-5" onClick={() => setRecuperar(false)}>
          Entendi
        </Button>
      </MobileModal>
    </div>
  );
}
