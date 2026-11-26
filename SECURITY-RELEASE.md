# Vitoralia — critérios de segurança antes da publicação

Não publicar esta versão até validar todos os critérios.

- Firebase: exigir email_verified e UID do proprietário em todas as regras aplicáveis; preservar regras existentes até revisão. Testar leitura, gravação e exclusão com duas contas de teste e sem autenticação.
- Supabase: verificar políticas de SELECT, INSERT, UPDATE e DELETE do bucket privado; exigir identidade validada e pasta do próprio UID, além de e-mail verificado. Não expor chaves administrativas.
- Turnstile: cadastrar domínio e validar token no servidor, com segredo exclusivamente no servidor. Não tratar validação visual como proteção; impedir bypass direto do cadastro e aplicar limites de frequência.
- Sessão: testar bloqueio após 15 minutos, inclusive em abas em segundo plano, e garantir que alterações pendentes não sejam perdidas e que dados locais de outra conta não sejam expostos.
- Diário: projetar criptografia autenticada com chave individual e recuperação explícita; testar migração, sincronização e backup antes de alterar registros existentes. Não prometer criptografia de ponta a ponta antes de validar.
- Privacidade: informar finalidade, dados coletados, operadores, retenção, direitos LGPD, canal de contato, exclusão e eventuais transferências internacionais. Estudos religiosos e diário podem conter dados sensíveis. Não publicar política com afirmações não verificadas.
- Testar confirmação de e-mail, reenvio, recuperação de senha, contas antigas, revogação, isolamento, exclusão e sincronização de mídias.
- Manter produção intacta até aprovação técnica. Nenhuma contratação paga autorizada.
