# Meus Sonhos & Metas — versão 7

Atualização para o seu **mesmo site do GitHub**, com seis áreas: Agenda de hoje, Calendário de hábitos, Meu diário, Caderno bíblico, Mural dos sonhos e Relatórios. Mantém o login, o perfil, o cronômetro de estudos, as metas antigas, a rotina e o planner de leitura bíblica.

## Antes de publicar

1. **Abra o site atual**, entre em sua conta e vá em **Ajustes → Baixar meu backup completo**. Guarde o arquivo JSON no computador e, se possível, em outro lugar seguro. O ZIP não é uma cópia dos seus dados atuais do Firebase.
2. Guarde uma cópia da versão anterior do código (ZIP v6/v5 ou use o histórico de commits do GitHub).
3. Extraia este ZIP. Entre no repositório `jehfiuza4-star/meus-sonhos-e-metas` e escolha **Adicionar arquivo → Carregar arquivos**. Selecione os arquivos **DENTRO** da pasta extraída e confirme as alterações na ramificação `main` (principal). Não publique o ZIP fechado.
4. Aguarde o GitHub Pages publicar, abra `https://jehfiuza4-star.github.io/meus-sonhos-e-metas/` e use Ctrl+Shift+R para atualizar.
5. Entre com **a sua conta Firebase atual**, sem criar outro projeto. Teste um hábito, uma anotação e uma atividade na agenda. Saia e entre para verificar a persistência.
6. Vá em **Ajustes → Baixar meu backup completo**. A nova exportação tem `version: 7` e inclui `extras` com os novos dados. Baixe um JSON após testar, abra o arquivo e confira se contém `extras`.

## Privacidade e custos

Os registros continuam dentro de `/users/{uid}/data/{docId}` e seguem as regras privadas que você já publicou para esse caminho. Os dados pessoais, fotos e anotações **não** devem ser enviados aos arquivos públicos do GitHub. O aplicativo usa a mesma conta do Firebase; não exige um novo projeto ou assinatura adicional sob os limites gratuitos.

## Backups: limites importantes

O banco de dados **não substitui** uma cópia independente. A opção de backup automático no Chrome/Edge só grava em arquivo externo enquanto o site estiver aberto e com permissão. No iPhone, baixe arquivos JSON manualmente. As cópias do navegador podem desaparecer ao limpar os dados do Safari. Use também `LEITOR-DE-BACKUP-OFFLINE.html` para consultar os dados do backup sem acessar o site. Os backups JSON não são criptografados: guarde-os em local privado e não compartilhe. Os registros de diário, caderno e agenda são divididos em documentos por mês; o mural é separado por ano, para reduzir o risco de atingir o limite por documento do Firestore.

### Comportamento das novas páginas

- **Agenda:** compromissos adicionados manualmente e atividades programadas das metas, da rotina e do planner bíblico. Marque os itens diretamente no dia escolhido.
- **Hábitos:** escolha dias pares, ímpares, dias da semana, todos os dias ou quantidade semanal. Clique no dia desejado para registrar. A frequência semanal funciona como uma meta de quantidade, não como bloqueio de outros dias.
- **Diário:** textos e uma fotografia opcional por registro. A imagem é reduzida e salva na conta; uma imagem não aparece no código público.
- **Caderno bíblico:** notas, referências de versículos e reflexões próprias. O texto integral da Bíblia não foi incluído nesta versão por pendência de confirmação de licença de edição digital.
- **Mural:** fotografia opcional para um sonho, com categorias e ano.
- **Relatórios:** calculados a partir de metas, registros de estudo, hábitos, rotinas e leituras; não são conteúdo público.

Se usar dois dispositivos ao mesmo tempo, aguarde terminar a sincronização antes de editar o mesmo item no outro aparelho. Para um backup realmente independente, baixe o JSON completo periodicamente e teste a restauração numa cópia separada.
