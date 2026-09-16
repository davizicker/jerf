// Dados de referencia (seed) do portal, extraidos da planilha original
// (DESKTOP WEB - Visual 1.xlsx). Usados apenas na PRIMEIRA visita de cada
// navegador para preencher o localStorage — depois disso, quem manda e o
// store (js/store.js). Editar este arquivo nao muda o site ja em uso;
// serve so como o "estado de fabrica" para navegadores novos.

const DEFAULT_GROUPS = [
  { id: "grp-principais", name: "Principais", color: "blue", order: 0 },
  { id: "grp-frequencia-e-pagamentos", name: "Frequência e Pagamentos", color: "teal", order: 1 },
  { id: "grp-controles-e-processos", name: "Controles e Processos", color: "indigo", order: 2 },
  { id: "grp-processos-e-saude", name: "Processos e Saúde", color: "green", order: 3 },
  { id: "grp-relatorios-e-aposentadoria", name: "Relatórios e Aposentadoria", color: "amber", order: 4 },
  { id: "grp-folgas-e-gestao", name: "Folgas e Gestão", color: "violet", order: 5 },
  { id: "grp-anulacao-de-aposentadoria", name: "Anulação de Aposentadoria", color: "slate", order: 6 },
  { id: "grp-cessao-e-servidores", name: "Cessão e Servidores", color: "pink", order: 7 },
];

const DEFAULT_SYSTEMS = [
  { id: "sys-biblioteca", name: "BIBLIOTECA", tag: "BI", color: "blue", groupId: "grp-principais", documents: [{ id: "sys-biblioteca-doc1", label: "Acessar", url: "https://drive.google.com/drive/folders/1N8ocNm5iPlabYN-x-P86Od0xubNSL4W-" }] },
  { id: "sys-ponto-digital", name: "PONTO DIGITAL", tag: "PD", color: "blue", groupId: "grp-principais", documents: [{ id: "sys-ponto-digital-doc1", label: "Acessar", url: "https://www.pontodigital.mg.gov.br/Publica" }] },
  { id: "sys-sei", name: "SEI", tag: "SEI", color: "blue", groupId: "grp-principais", documents: [{ id: "sys-sei-doc1", label: "Acessar", url: "https://www.sei.mg.gov.br/sip/login.php?sigla_orgao_sistema=GOVMG&sigla_sistema=SEI" }] },
  { id: "sys-conecta-rh", name: "CONECTA RH", tag: "RH", color: "blue", groupId: "grp-principais", documents: [{ id: "sys-conecta-rh-doc1", label: "Acessar", url: "https://www.conectarh.mg.gov.br/" }] },
  { id: "sys-calculo-de-provento-media", name: "CÁLCULO DE PROVENTO/MÉDIA", tag: "CP", color: "blue", groupId: "grp-principais", documents: [{ id: "sys-calculo-de-provento-media-doc1", label: "Acessar", url: "https://wwws.seplag.mg.gov.br/index.php" }] },
  { id: "sys-sisap-web-fipa", name: "SISAP WEB FIPA", tag: "SF", color: "blue", groupId: "grp-principais", documents: [{ id: "sys-sisap-web-fipa-doc1", label: "Acessar", url: "http://www.sisapweb.mg.gov.br/fipa/telaacesso.htm" }] },
  { id: "sys-guias-de-ocorrencia", name: "GUIAS DE OCORRÊNCIA", tag: "GO", color: "teal", groupId: "grp-frequencia-e-pagamentos", documents: [{ id: "sys-guias-de-ocorrencia-doc1", label: "Acessar", url: "https://drive.google.com/drive/folders/1-y5s41bdxTTlMkIcZud68rMjKy_gpkks" }] },
  { id: "sys-contagem-de-tempo", name: "CONTAGEM DE TEMPO", tag: "CT", color: "teal", groupId: "grp-frequencia-e-pagamentos", documents: [{ id: "sys-contagem-de-tempo-doc1", label: "Acessar", url: "https://drive.google.com/drive/folders/1x8goAn9bE9U1HpC4p8aOhEn4FhT74Kk3" }] },
  { id: "sys-liberacao-falta-tipo-2", name: "LIBERAÇÃO FALTA - TIPO 2", tag: "LF", color: "teal", groupId: "grp-frequencia-e-pagamentos", documents: [{ id: "sys-liberacao-falta-tipo-2-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1yAZFJiAa0PWL1Bp6EL1-vGCLqeMfgR3ILrYsAi_Lbz0/edit?gid=794802376" }] },
  { id: "sys-vencimentos-deixados", name: "VENCIMENTOS DEIXADOS", tag: "VD", color: "teal", groupId: "grp-frequencia-e-pagamentos", documents: [{ id: "sys-vencimentos-deixados-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1yjXFn_R6RTmeBLhHj3_H-KfrOhnSPAYEpDAehSf51gA/edit?gid=509616479" }] },
  { id: "sys-diario-de-pagamento", name: "DIÁRIO DE PAGAMENTO", tag: "DP", color: "teal", groupId: "grp-frequencia-e-pagamentos", documents: [{ id: "sys-diario-de-pagamento-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1zF6K74HtCtxiZXFgcmG1uJ0NIHXG8pxo_lXu6BiUrAA/edit?gid=1739041770" }] },
  { id: "sys-acerto-11-36", name: "ACERTO 11,36%", tag: "AC", color: "teal", groupId: "grp-frequencia-e-pagamentos", documents: [{ id: "sys-acerto-11-36-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1o4m5qEGUsQe76U_F-_h-MPzEEMpz99E0t3TLbaez-xE/edit?gid=438498586" }] },
  { id: "sys-controle-interno-de-ia", name: "CONTROLE INTERNO DE IA", tag: "IA", color: "indigo", groupId: "grp-controles-e-processos", documents: [{ id: "sys-controle-interno-de-ia-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1pGCqPQxYQO2oGxA7gFjJGEGK4sbx6fj_U6H4G1eHSFo/edit?gid=489829030" }] },
  { id: "sys-correcao-i-a-s", name: "CORREÇÃO I.A.s", tag: "CO", color: "indigo", groupId: "grp-controles-e-processos", documents: [{ id: "sys-correcao-i-a-s-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1uzBGJsOzBvRVEO25B4rkufXGB_LqEXtj/edit?pli=1&gid=797829345" }] },
  { id: "sys-informativo-de-alteracao-dipe", name: "INFORMATIVO DE ALTERAÇÃO - DIPE", tag: "IA", color: "indigo", groupId: "grp-controles-e-processos", documents: [{ id: "sys-informativo-de-alteracao-dipe-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1TGKZsvx9c1T01PKZXw8gLtRpjuWH6JEiC1pA_lg_Y8U/edit?gid=685574746" }] },
  { id: "sys-arquivo-consolidado", name: "ARQUIVO CONSOLIDADO", tag: "AC", color: "indigo", groupId: "grp-controles-e-processos", documents: [{ id: "sys-arquivo-consolidado-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/17k-YxtkMcH-spkk7UCvfrPEwl4Pv5304ayx8VO3c5-w/edit?gid=894487392" }] },
  { id: "sys-planilha-52-490", name: "PLANILHA 52-490", tag: "PL", color: "indigo", groupId: "grp-controles-e-processos", documents: [{ id: "sys-planilha-52-490-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1DtaE6--J2SM7yCI3XoncNhONuearMEqAnzLUEEqR_II/edit?gid=50123981" }] },
  { id: "sys-processos-sei", name: "PROCESSOS SEI", tag: "SEI", color: "green", groupId: "grp-processos-e-saude", documents: [{ id: "sys-processos-sei-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1ZEyldRZyVqgfzI01g-IBsmRkVoLzJ5Y246pFKCJyXwM/edit?gid=229512721" }] },
  { id: "sys-e-social", name: "E - SOCIAL", tag: "ES", color: "green", groupId: "grp-processos-e-saude", documents: [{ id: "sys-e-social-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1ddK22DVM65rBHW-nnjvxOXOwhrkNzpKr/edit?pli=1&gid=1107740878" }] },
  { id: "sys-saude", name: "SAÚDE", tag: "SA", color: "green", groupId: "grp-processos-e-saude", documents: [{ id: "sys-saude-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/19Ffq4yqFIac7rFp9roLQIR_uu78mEYIhgUl1PygXh34/edit?gid=1219913832" }] },
  { id: "sys-isencao-tributaria", name: "ISENÇÃO TRIBUTÁRIA", tag: "IT", color: "green", groupId: "grp-processos-e-saude", documents: [{ id: "sys-isencao-tributaria-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1zQyNtFwmTNAAFEoac8d-5iBtFBUDf94R/edit?gid=1556910683" }] },
  { id: "sys-relatorio-acerto-manual-03-04-24", name: "RELATÓRIO - Acerto Manual - 03/04/24", tag: "RA", color: "amber", groupId: "grp-relatorios-e-aposentadoria", documents: [{ id: "sys-relatorio-acerto-manual-03-04-24-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1SuK803uGdt5vCVInrkFKijcck7MVdzckUMRuEooTZuk/edit?gid=923097412" }] },
  { id: "sys-relatorio-acerto-13", name: "RELATÓRIO - Acerto 13º", tag: "RA", color: "amber", groupId: "grp-relatorios-e-aposentadoria", documents: [{ id: "sys-relatorio-acerto-13-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1jZU6M7BWrDQkr1pU9bimrpAYI6qJUllr8DgSFlKUvt8/edit?gid=1384655041" }] },
  { id: "sys-cargos-aposentados-aposentadoria-migracao", name: "CARGOS APOSENTADOS - APOSENTADORIA/MIGRACAO", tag: "CA", color: "amber", groupId: "grp-relatorios-e-aposentadoria", documents: [] },
  { id: "sys-folga-compensatoria", name: "FOLGA COMPENSATÓRIA", tag: "FC", color: "violet", groupId: "grp-folgas-e-gestao", documents: [{ id: "sys-folga-compensatoria-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1WiVnmko5PA4amlUADRqhOG04BRRcSvqe2NOpEpesneo/edit?gid=1142259615" }] },
  { id: "sys-sisap-web", name: "SISAP WEB", tag: "SW", color: "violet", groupId: "grp-folgas-e-gestao", documents: [] },
  { id: "sys-relacao-escolas-taxadores", name: "RELAÇÃO ESCOLAS-TAXADORES", tag: "RE", color: "violet", groupId: "grp-folgas-e-gestao", documents: [{ id: "sys-relacao-escolas-taxadores-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1b9hA5_y9xGNwwNsrQiu9Y6FCP467XE_373r5zOmmJJc/edit?gid=1216202471" }] },
  { id: "sys-gestao", name: "GESTÃO", tag: "GE", color: "violet", groupId: "grp-folgas-e-gestao", documents: [{ id: "sys-gestao-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1AedSH8xF-BWVOUR1-G438SZltnurBfEkeUoCsPP5udk/edit?gid=654263000" }] },
  { id: "sys-anul-apos-ec103-19", name: "ANUL.APOS. EC103/19", tag: "EC", color: "slate", groupId: "grp-anulacao-de-aposentadoria", documents: [{ id: "sys-anul-apos-ec103-19-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1T-QW6m78HqlmSRCmi4pZ6KW0xpa7hYPg9I3_x1mfiWc/edit?gid=1045359958" }] },
  { id: "sys-cessao", name: "CESSÃO", tag: "CE", color: "pink", groupId: "grp-cessao-e-servidores", documents: [{ id: "sys-cessao-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1RRJIiptPxUScQpbWtNXN53d8GbwvZAmNUDySy5SbPPQ/edit?gid=1649548333" }] },
  { id: "sys-servidores-cedidos", name: "SERVIDORES CEDIDOS", tag: "SC", color: "pink", groupId: "grp-cessao-e-servidores", documents: [{ id: "sys-servidores-cedidos-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1m9axJiayx7K6FXHj1gfvl9J5Wjdi2a7Y3QLchVWPTzE/edit?gid=1740967758" }] },
  { id: "sys-acompanhamento-judicial", name: "ACOMPANHAMENTO JUDICIAL", tag: "AJ", color: "pink", groupId: "grp-cessao-e-servidores", documents: [] },
  { id: "sys-controle-de-dae", name: "CONTROLE DE DAE", tag: "DAE", color: "pink", groupId: "grp-cessao-e-servidores", documents: [{ id: "sys-controle-de-dae-doc1", label: "Acessar", url: "https://docs.google.com/spreadsheets/d/1XAL2T_pGkoFq_YRmAb0UDcnTH5Rf_jl-FHI97oaulwc/edit?gid=1852532253" }] },
];

