# Política de segurança

## Versões suportadas

A versão mais recente da branch `main` recebe correções de segurança. Releases anteriores são mantidas apenas como histórico.

## Como relatar

Não publique credenciais, sessões do WhatsApp, números de telefone ou conteúdo de conversas em uma issue pública.

Para comunicar uma vulnerabilidade, use o recurso **Report a vulnerability** na aba **Security** do GitHub. Inclua uma descrição do impacto, passos mínimos para reprodução e a versão afetada.

## Escopo e dependências

Este projeto depende de `whatsapp-web.js` e do Chromium/Puppeteer. Alertas transitivos sem correção compatível são acompanhados pelo Dependabot e devem ser avaliados antes de cada implantação.

O armazenamento de leads é adequado apenas para demonstração local. Antes de uso comercial, implemente criptografia, autenticação e autorização, retenção e descarte, consentimento e atendimento aos direitos dos titulares conforme a legislação aplicável.
