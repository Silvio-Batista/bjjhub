# BJJHub

Aplicativo da BJJHub Academy. O aluno usa o app mobile: da matrícula à faixa, com aulas, check-in simulado, graduação, financeiro e perfil. A equipe usa a mesa em tablet ou desktop: alunos, pagamentos e presenças. Os dados são locais. Não há backend.

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

## Acesso da equipe

- E-mail: `sensei.q8n4wk@bjjhub.demo`
- Senha: `vL6pR2xm`

A tela de login do aluno tem o link “Área da equipe”. A da equipe mostra o acesso e o link de volta para o aluno.

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
- `/equipe/login`
- `/equipe`
- `/equipe/alunos` e `/equipe/alunos/[id]`
- `/equipe/pagamentos`
- `/equipe/presencas`

A sessão do aluno e a sessão da equipe ficam em chaves separadas do `localStorage`. Perfil editado, notificações, confirmações de aula, check-ins e preferências também ficam neste navegador.

O check-in não usa câmera. O botão simula a leitura do QR e lança a aula do dia que ainda não tem presença. A mensalidade não cobra de verdade.
