# Meus Sonhos & Metas — versão 4, conectada ao Firebase

Esta versão já tem **as configurações do seu projeto Firebase Web** preenchidas no arquivo `firebase-config.js`.
Não é necessário copiar/colar o código de configuração novamente. Não compartilhe senhas pessoais.

## Importante antes de enviar

1. **Backup:** abra o site antigo e, se você já cadastrou alguma meta, use `Ajustes > Exportar` para guardar o arquivo de backup em local privado. Se nunca cadastrou metas, pule.
2. **Login:** você já ativou `E-mail/senha` no Firebase Authentication. O link de login sem senha não precisa ser ativado.
3. **Firestore:** as regras publicadas precisam ser iguais às contidas no `firestore.rules` (restringem as coleções `users/{uid}/data` e `users/{uid}/reading` à pessoa conectada com o mesmo UID). Não habilite modo de teste ou regras abertas.
4. **Site:** publique os arquivos extraídos **dentro do mesmo repositório GitHub** `meus-sonhos-e-metas`. **Não publique o ZIP diretamente e não crie outro repositório.**
5. Se o GitHub perguntar se quer substituir `index.html`, `icon-192.png` etc., confirme. Envie também todos os arquivos novos (`firebase-config.js`, `firebase-auth.js`, `plano-biblico.js`, `firestore.rules`, etc.). O `index.html` e os arquivos JS precisam estar na raiz do repositório, não dentro de outra pasta.
6. Espere a nova versão do site aparecer (o mesmo endereço `https://jehfiuza4-star.github.io/meus-sonhos-e-metas/`). Atualize o Safari se necessário.
7. Na tela inicial do app, escolha **Criar conta**, crie seu login com seu próprio e-mail e uma senha forte. Em seguida crie uma meta e marque uma leitura do plano bíblico. Espere aparecer **Salvo na nuvem ✓** e confira que os dados aparecem ao entrar novamente.
8. Teste a privacidade com outra conta de e-mail: ela não deve enxergar as metas nem as marcações da primeira.
9. Se o login retornar erro de domínio não autorizado, abra `Firebase > Authentication > Configurações > Domínios autorizados` e inclua **`jehfiuza4-star.github.io`** (somente o domínio, sem `https://` nem o caminho).
10. Se existiam metas no aplicativo antigo, faça login na conta nova e, em **Ajustes**, use **Importar** com o backup guardado. **Nunca** envie o backup JSON ao GitHub público.

## O que já está disponível
- Tela de acesso para cada conta, com recuperação de senha por e-mail.
- Metas por categoria e ano, com edição, progresso, conclusão, painéis e conquistas.
- Planner bíblico com 52 semanas × 7 leituras do arquivo fornecido, marcação diária e anotações, com dias extras de revisão para completar o ano civil.
- Salvamento das metas e leituras no Cloud Firestore por usuário (após login e regras aplicadas).
- Ícones e manifest para adicionar o aplicativo à tela inicial do celular.

## Avisos de segurança

- O **site e seus arquivos continuam públicos no GitHub Pages**. Somente os dados do Firestore ficam protegidos por autenticação e pelas regras.
- Os valores de `firebase-config.js` são identificadores destinados ao aplicativo web, e não credenciais administrativas ou senhas. Não publique chaves privadas nem dados pessoais.
- As regras **não fazem backup por si só**. Mantenha cópias pessoais e seguras de informações importantes.
- O sistema não foi testado com uma conta real no seu Firebase nesta conversa: faça o teste de dois usuários antes de cadastrar dados importantes.
- O plano Firebase Spark tem cotas. Não mude para o plano Blaze sem avaliar custos.
- Este plano bíblico segue as referências do PDF enviado; algumas podem conter erros no original.
