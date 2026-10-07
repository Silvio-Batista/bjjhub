# BJJHub

Aplicativo do aluno da BJJHub Academy. Esta versão é o MVP mobile: da matrícula à faixa, com aulas, check-in simulado, graduação, financeiro e perfil. Os dados são locais. Não há backend.

## Como rodar

```bash
npm install
npm run dev -- --hostname 0.0.0.0 --port 4327
```

Abra [http://127.0.0.1:4327](http://127.0.0.1:4327).

```bash
npm run typecheck
npm run lint
```

## Acesso de demonstração

- E-mail: `aluno.k4n8wq@bjjhub.demo`
- Senha: `tR9mX4pc`

Na tela de entrada também há o atalho “Preencher acesso de demonstração”.

## Rotas

- `/login`
- `/dashboard`
- `/aulas` e `/aulas/[id]`
- `/checkin`
- `/graduacao`
- `/financeiro`
- `/notificacoes`
- `/perfil` e `/perfil/editar`
- `/historico`
- `/configuracoes`

Sessão, perfil editado, notificações, confirmações de aula, check-ins e preferências ficam no `localStorage` deste navegador.

O check-in não usa câmera. O botão simula a leitura do QR e lança a aula do dia que ainda não tem presença. A mensalidade não cobra de verdade.
