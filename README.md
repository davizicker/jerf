# Portal SRE Metropolitana A — Divisão de Pessoal

Site estático que substitui a planilha "DESKTOP WEB" usada como página inicial
do Setor de Pagamento. Mesma função da planilha (um painel com atalhos para os
sistemas e planilhas do dia a dia), com um visual mais limpo e moderno, busca
rápida e tema claro/escuro.

## Estrutura do projeto

```
.
├── index.html          # marcação da página (cabeçalho, busca, grade, recados)
├── css/styles.css       # estilos, cores e responsividade
├── js/data.js            # lista de sistemas e recados — é aqui que se edita o conteúdo
├── js/app.js             # renderização da grade, busca, tema e relógio
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

## Como publicar (GitHub Pages)

1. Em **Settings → Pages** do repositório, em "Build and deployment" escolha
   **Deploy from a branch**.
2. Selecione a branch (ex.: `main`) e a pasta `/ (root)`.
3. Salve. O site fica disponível em `https://<usuário>.github.io/<repositório>/`.

## Como adicionar, editar ou remover um sistema

Toda a lista de botões vem de `js/data.js`, no array `TOOLS`. Cada item é:

```js
{ name: "NOME DO SISTEMA", url: "https://...", tag: "NS" }
```

- `name`: texto exibido no card.
- `url`: link do sistema/planilha. Use `null` quando ainda não houver link —
  o card aparece desativado com o selo "Em breve".
- `tag`: sigla de 2–3 letras mostrada no selo colorido do card.

Para adicionar um sistema novo, copie uma linha existente, cole no final do
array e ajuste os três campos. Para remover, apague a linha correspondente.

## Como publicar um recado no Painel de Recados

No mesmo arquivo `js/data.js`, edite o array `NOTICES`:

```js
const NOTICES = [
  { date: "16/09/2026", text: "Exemplo de recado para a equipe." },
];
```

Com o array vazio (`[]`), o painel mostra "Nenhum recado no momento."

## Origem dos dados

Os 33 atalhos e seus links foram extraídos da planilha original
(`DESKTOP WEB - Visual 1.xlsx`), mantendo os mesmos destinos. Três itens não
tinham link cadastrado na planilha original (SISAP WEB, CARGOS APOSENTADOS -
APOSENTADORIA/MIGRACAO e ACOMPANHAMENTO JUDICIAL) e por isso aparecem como
"Em breve" — basta preencher o campo `url` em `js/data.js` quando o link
existir.
