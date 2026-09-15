# Changelog

Todas as mudanças relevantes deste projeto são documentadas neste arquivo.

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
