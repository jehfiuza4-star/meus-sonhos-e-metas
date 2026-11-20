# Meus Sonhos & Metas — versão 5

Atualização do **mesmo site** já publicado no GitHub Pages, com novas funcionalidades:

- Metas com agenda: todos os dias, dias pares, ímpares, dias da semana ou quantidade semanal; marcação por data no calendário.
- Rotina diária: criar atividades recorrentes e marcar as tarefas concluídas de cada dia.
- Plano bíblico e login privado preservados.
- Cópias automáticas no navegador (histórico das últimas oito alterações), backup completo manual em JSON e **backup automático em arquivo local opcional**, depois de você escolher e autorizar o arquivo no Chrome ou Edge do computador.
- Leitor `LEITOR-DE-BACKUP-OFFLINE.html` para consultar seus dados sem depender do site. Guarde este leitor junto com os backups JSON no seu computador.

## Antes de publicar

1. Entre na versão atual e baixe um backup da(s) meta(s) que já registrou em **Ajustes → Exportar**. Esse backup antigo guarda só metas, mas pode ser importado pela nova versão.
2. Guarde uma cópia deste ZIP em um lugar seguro.
3. Entre no repositório GitHub já existente `meus-sonhos-e-metas`, selecione **Adicionar arquivo → Carregar arquivos**, e envie os arquivos desta pasta já extraída (não o ZIP). Envie os arquivos diretamente na raiz, sem criar subpasta. Confirme a alteração na ramificação `main` ("principal").
4. O GitHub Pages continuará usando o mesmo endereço `https://jehfiuza4-star.github.io/meus-sonhos-e-metas/`. Aguarde a publicação e atualize a página com Ctrl+Shift+R.
5. Entre com sua **conta atual** do Firebase. Não crie outra conta se já tem uma.
6. Teste com uma meta de exemplo, marcando uma data no calendário, e uma atividade na rotina. Confira se continuam salvas ao sair e entrar novamente.
7. Vá em **Ajustes → Baixar meu backup completo** para gerar seu primeiro JSON completo. Guarde em outra pasta e, se possível, em outra unidade/serviço. Para automatizar em arquivo no **Chrome ou Edge para computador**, clique em **Ativar** ao lado de Backup automático em arquivo e escolha um JSON em pasta privada. O arquivo será atualizado quando houver mudanças e o site estiver aberto, enquanto a permissão estiver ativa. O Safari do iPhone não oferece esse recurso de gravação automática em arquivo, então faça downloads manuais periódicos.
8. Para ver os dados mesmo sem acesso ao site, abra o arquivo `LEITOR-DE-BACKUP-OFFLINE.html` diretamente no computador e selecione seu arquivo de backup JSON.

## Cuidados importantes

- O Firebase e o GitHub são serviços distintos. A nuvem salva os dados da conta, mas não é um backup totalmente independente de serviços externos.
- Os backups automáticos **dentro do navegador** não são recuperáveis se o site/origem desaparece ou se os dados do navegador forem apagados. Somente o JSON exportado ou o arquivo automático **fora do navegador** continua independente do site.
- O JSON não tem senha/criptografia. **Proteja o arquivo** usando pasta privada, disco criptografado ou arquivo criptografado.
- O botão "Ativar" de backup automático no computador depende de navegador compatível. Pode ser necessário autorizar novamente após reiniciar.
- A cópia automática em arquivo não acontece com o site fechado. Não é um serviço de backup programado 24 horas por dia.
- No Firebase Firestore, continuam valendo as regras já publicadas para `/users/{uid}/data/{docId}` e `/users/{uid}/reading/{year}`. As rotinas ficam em `/users/{uid}/data/routines`, não precisa alterar suas regras.
- O site hospedado no GitHub continua público no nível dos arquivos HTML/JS, mas dados autenticados ficam separados pelo UID em Firestore.
- Não publique senhas, tokens privados ou arquivos de backup contendo informações pessoais no repositório.
- Se usar o app em dois dispositivos ao mesmo tempo, espere cada alteração sincronizar antes de editar no outro.

## Estrutura essencial

`index.html`, `firebase-auth.js`, `firebase-config.js`, `backup-manager.js`, `plano-biblico.js`, `icon-192.png`, `icon-512.png`, `manifest.webmanifest`, `sw.js`, `firestore.rules`, `LEITOR-DE-BACKUP-OFFLINE.html`, `INSTRUCOES-LEIA-PRIMEIRO.md`.
