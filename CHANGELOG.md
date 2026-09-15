# Changelog

Todas as mudanças relevantes deste projeto são documentadas neste arquivo.

## [1.2.0] - 2026-09-15

### Adicionado

- Motor declarativo de conversas configurado por JSON.
- Case fictício de pousada com demonstração em GIF, PNG e vídeo.
- Captura de leads em memória ou arquivo NDJSON.
- Pausa do bot para transferência ao atendimento humano.
- Endpoints `/health` e `/ready` e reconexão com espera progressiva.
- Docker Compose com Redis e volumes persistentes.
- Relatório de cobertura com limites mínimos na CI.

### Alterado

- O fluxo padrão passou a usar o mesmo motor configurável do case.
- O simulador aceita a seleção de um arquivo de fluxo.
- A documentação separa claramente a versão de portfólio do roadmap comercial.

## [1.1.0] - 2026-09-15

### Adicionado

- Fila por usuário para preservar a ordem das mensagens.
- Anonimização dos identificadores nos logs.
- Validação estrita das variáveis de ambiente.
- Testes de fila, filtros, privacidade e configuração.
- Dependabot e verificação do Docker na CI.
- Arquivos de licença e política de segurança.

### Alterado

- Docker executado como usuário sem privilégios e sem instalar dependências de desenvolvimento.
- Dependências diretas atualizadas para versões compatíveis mais recentes.
- Documentação reposicionada como boilerplate, com limitações explícitas.

### Removido

- Cache gerado pelo WhatsApp Web que havia sido versionado por engano.
