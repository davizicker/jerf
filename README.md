# Portal SRE Metropolitana A — Divisão de Pessoal

Site que substitui a planilha "DESKTOP WEB" usada como página inicial do
Setor de Pagamento. Mesma função da planilha (um painel com atalhos para os
sistemas do dia a dia, organizados em grupos, como as colunas da planilha
original), com visual moderno, busca rápida, tema claro/escuro — e tudo
**editável diretamente pelo site**: criar/editar/mover sistemas entre grupos,
trocar cores, adicionar mais de um link por sistema, criar novos grupos.

## Estrutura do projeto

```
.
├── index.html        # marcação da página (cabeçalho, busca, modais)
├── css/styles.css     # estilos, cores, tema e responsividade
├── js/data.js          # dados de fábrica (seed): grupos e sistemas originais
├── js/store.js         # camada de dados: localStorage + CRUD + paleta de cores
├── js/app.js            # views, navegação, modais, busca
└── assets/               # logo e favicon
```

## Como visualizar localmente

Não há build nem dependências. Basta servir a pasta com qualquer servidor
estático, por exemplo:

```bash
python3 -m http.server 8000
```

e abrir `http://localhost:8000` no navegador. Abrir o `index.html` direto no
navegador (`file://`) também funciona.

## Como editar pelo site (sem mexer em código)

- **Adicionar sistema**: botão "+ Adicionar novo sistema" no topo da página.
- **Editar um sistema**: passe o mouse sobre o card e clique no lápis (título,
  sigla/cor do selo, grupo, documentos/links).
- **Vários documentos por sistema**: no editor do sistema, clique em
  "+ Adicionar documento" quantas vezes precisar. Se o sistema tiver mais de
  um link, ao clicar no card a pessoa escolhe qual abrir.
- **Mover um sistema para outro grupo**: abra o sistema pelo lápis e troque o
  campo "Grupo".
- **Criar um grupo**: tile tracejado "+ Novo grupo" na tela inicial.
- **Editar um grupo**: lápis ao lado do nome do grupo (dentro do grupo) ou no
  card do grupo na tela inicial — nome e cor. Um grupo só pode ser excluído
  se estiver vazio (mova ou apague os sistemas primeiro).

### ⚠️ Importante: onde essas edições ficam salvas

Este é um site estático, sem servidor nem banco de dados — então tudo que é
criado ou editado pelo site fica salvo no **localStorage do navegador em que
a edição foi feita**. Ou seja:

- Edições feitas no seu computador **não aparecem automaticamente** para um
  colega que abra o portal em outro computador.
- Limpar os dados de navegação do navegador apaga essas edições.
- Cada navegador começa com os mesmos 33 sistemas/8 grupos "de fábrica"
  (definidos em `js/data.js`); a partir daí, cada um edita a sua própria
  cópia local.

Se, no futuro, a equipe precisar que todo mundo veja as mesmas edições em
tempo real (como era na planilha do Google), isso exige um banco de dados
compartilhado (um pequeno backend) — é uma etapa a mais, mas dá pra construir
em cima do que já existe aqui.

## Como publicar (GitHub Pages ou Render)

**GitHub Pages**: em Settings → Pages do repositório, escolha "Deploy from a
branch", selecione `main` e a pasta `/ (root)`.

**Render**: New → Static Site, aponte para este repositório, branch `main`,
sem build command, publish directory `.`.

## Origem dos dados de fábrica

Os 33 sistemas e seus links (`js/data.js`) foram extraídos da planilha
original (`DESKTOP WEB - Visual 1.xlsx`), mantendo os mesmos destinos. Os 8
grupos correspondem às 8 colunas de botões da planilha original — os nomes
dados a cada grupo (ex: "Principais", "Frequência e Pagamentos") são só um
ponto de partida; renomeie como preferir pelo site. Três sistemas não tinham
link cadastrado na planilha original (SISAP WEB, CARGOS APOSENTADOS -
APOSENTADORIA/MIGRACAO e ACOMPANHAMENTO JUDICIAL) e por isso aparecem sem
link ("Sem link") até alguém adicionar um documento a eles.
