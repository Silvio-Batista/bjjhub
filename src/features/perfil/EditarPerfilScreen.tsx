"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { PageBody } from "@/components/layout/PageContainer";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Campo } from "@/components/ui/Campo";
import { useAluno } from "@/contexts/aluno-context";
import { useToast } from "@/contexts/toast-context";
import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

interface Formulario {
  nome: string;
  telefone: string;
  nascimento: string;
  profissao: string;
  foto: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

function doPerfil(perfil: ReturnType<typeof useAluno>["perfil"]): Formulario {
  return {
    nome: perfil.nome,
    telefone: perfil.telefone,
    nascimento: perfil.nascimento,
    profissao: perfil.profissao,
    foto: perfil.foto,
    cep: perfil.endereco.cep,
    logradouro: perfil.endereco.logradouro,
    numero: perfil.endereco.numero,
    complemento: perfil.endereco.complemento,
    bairro: perfil.endereco.bairro,
    cidade: perfil.endereco.cidade,
    estado: perfil.endereco.estado,
  };
}

export function EditarPerfilScreen() {
  const { perfil, atualizarPerfil } = useAluno();
  const { mostrar } = useToast();
  const router = useRouter();
  const arquivo = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<Formulario>(() => doPerfil(perfil));
  const [erro, setErro] = useState<string | null>(null);

  function definir<K extends keyof Formulario>(chave: K, valor: Formulario[K]) {
    setForm((atual) => ({ ...atual, [chave]: valor }));
  }

  function aoEscolherFoto(lista: FileList | null) {
    const foto = lista?.[0];
    if (!foto) return;
    if (!foto.type.startsWith("image/")) {
      setErro("Escolha um arquivo de imagem.");
      return;
    }
    if (foto.size > 2_000_000) {
      setErro("A imagem precisa ter até 2 MB.");
      return;
    }
    const leitor = new FileReader();
    leitor.onload = () => {
      if (typeof leitor.result === "string") {
        definir("foto", leitor.result);
        setErro(null);
      }
    };
    leitor.readAsDataURL(foto);
  }

  function salvar(evento: React.FormEvent) {
    evento.preventDefault();
    if (form.nome.trim().length < 3) {
      setErro("Informe seu nome completo.");
      return;
    }
    if (form.telefone.trim().length < 8) {
      setErro("Informe um telefone válido.");
      return;
    }
    const ok = atualizarPerfil({
      nome: form.nome,
      telefone: form.telefone,
      nascimento: form.nascimento,
      profissao: form.profissao,
      foto: form.foto,
      endereco: {
        cep: form.cep,
        logradouro: form.logradouro,
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado.toUpperCase().slice(0, 2),
      },
    });
    if (!ok) {
      setErro("Não foi possível salvar neste aparelho. A foto pode estar grande demais.");
      return;
    }
    mostrar("Perfil atualizado com sucesso.");
    router.push("/perfil");
  }

  return (
    <div>
      <AppHeader titulo="Editar perfil" voltar />
      <PageBody>
        <form onSubmit={salvar} className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-3">
            <Avatar src={form.foto} nome={form.nome} tamanho={96} />
            <input
              ref={arquivo}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(evento) => aoEscolherFoto(evento.target.files)}
            />
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 text-sm font-medium"
              onClick={() => arquivo.current?.click()}
            >
              <Camera size={16} />
              Alterar foto
            </button>
          </div>

          <Campo label="Nome" value={form.nome} onChange={(e) => definir("nome", e.target.value)} />
          <Campo
            label="E-mail"
            value={perfil.email}
            disabled
            dica="O e-mail é definido pela academia."
          />
          <Campo
            label="Telefone"
            inputMode="tel"
            value={form.telefone}
            onChange={(e) => definir("telefone", e.target.value)}
          />
          <Campo
            label="Nascimento"
            type="date"
            value={form.nascimento}
            onChange={(e) => definir("nascimento", e.target.value)}
          />
          <Campo
            label="Profissão"
            value={form.profissao}
            onChange={(e) => definir("profissao", e.target.value)}
          />
          <Campo
            label="CEP"
            inputMode="numeric"
            value={form.cep}
            onChange={(e) => definir("cep", e.target.value)}
          />
          <Campo
            label="Endereço"
            value={form.logradouro}
            onChange={(e) => definir("logradouro", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Número" value={form.numero} onChange={(e) => definir("numero", e.target.value)} />
            <Campo
              label="Complemento"
              value={form.complemento}
              onChange={(e) => definir("complemento", e.target.value)}
            />
          </div>
          <Campo label="Bairro" value={form.bairro} onChange={(e) => definir("bairro", e.target.value)} />
          <Campo label="Cidade" value={form.cidade} onChange={(e) => definir("cidade", e.target.value)} />
          <Campo
            label="Estado"
            maxLength={2}
            value={form.estado}
            onChange={(e) => definir("estado", e.target.value.toUpperCase())}
          />
          {erro ? (
            <p className="text-sm text-primary" role="alert">
              {erro}
            </p>
          ) : null}
          <Button type="submit" disabled={form.nome.trim().length === 0}>
            Salvar
          </Button>
        </form>
      </PageBody>
    </div>
  );
}
