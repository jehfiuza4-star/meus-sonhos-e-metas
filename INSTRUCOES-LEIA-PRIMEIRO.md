# Meus Sonhos & Metas — versão 8

Atualização corretiva para o MESMO site GitHub Pages e a MESMA conta Firebase.

## Corrigido

- O cartão inteiro de uma meta agora é clicável e tem o botão **Abrir minha meta →**.
- Ao abrir, a meta ganha uma **página própria** com cronômetro, registro manual de minutos, histórico, calendário e edição.
- A tela inicial tem atalhos bem visíveis **Minha foto e meu perfil** e **Ler a Bíblia completa**.
- Em **Meu perfil**, você pode escolher a fotografia no seletor visível; a imagem é reduzida e salva no documento privado do seu usuário no Firestore.
- O **Leitor bíblico** permite escolher os 66 livros e os capítulos e ler diretamente no aplicativo, usando traduções livres retornadas pela Midvash API.

## Limitação importante da Bíblia

A edição **Almeida 1911 com ortografia modernizada**, que foi discutida anteriormente, **ainda não está embutida**, pois não foi possível obter e verificar os arquivos reutilizáveis dessa edição. Este leitor oferece:

1. **Almeida de 1911 original**, domínio público, texto tradicional (sem modernização ortográfica).
2. **Bíblia Livre**, alternativa de leitura livre, diferente da Almeida de 1911.

Os capítulos são consultados em `https://api.midvash.com/v1/` (documentação: https://api.midvash.com/docs), com indicação de autoria/licença fornecida pela API. **É necessário ter internet para abrir um capítulo novo.** Capítulos já abertos podem permanecer temporariamente disponíveis no navegador. A conexão real com a API deve ser verificada no site publicado; os testes locais usaram respostas simuladas.

## Para instalar sem perder seus dados

1. Entre no site atual, em sua conta, e **baixe um backup completo em Ajustes**. Guarde o arquivo JSON fora do navegador.
2. **Baixe este ZIP e extraia** no computador.
3. Acesse o repositório existente em `https://github.com/jehfiuza4-star/meus-sonhos-e-metas`.
4. Use **Adicionar arquivo → Carregar arquivos** e selecione **todos os 15 arquivos desta pasta**, não o ZIP nem a pasta inteira.
5. Confirme as alterações na ramificação `main`.
6. Abra `https://jehfiuza4-star.github.io/meus-sonhos-e-metas/` e atualize com **Ctrl+Shift+R** no computador.
7. Teste abrir uma meta antiga, a foto do perfil e a leitura de um capítulo como João 3.
8. Teste sair e entrar novamente; confira se sua meta, seus minutos e sua foto permanecem.

Não substitua o código de regras do Firestore, não crie um projeto Firebase novo e não compartilhe seus dados de login. O código do app continua usando os mesmos documentos `users/{uid}`, `users/{uid}/data/app`, `users/{uid}/data/...` e `users/{uid}/reading/{ano}`. O ZIP contém apenas arquivos públicos do aplicativo; não contém os dados pessoais da sua conta.

## Testes executados

- Abertura de meta a partir de cartão e botão específico
- Registro de 30 minutos
- Acesso e atualização da foto de perfil
- Leitor bíblico com simulação de resposta de capítulos
- Preservação de dados em arquivo de backup v8
- Separação de dados entre duas contas em ambiente simulado

Observação: testes locais não substituem testes no Firebase real nem confirmam disponibilidade futura da API bíblica.
