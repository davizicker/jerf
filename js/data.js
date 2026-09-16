// Lista de sistemas extraida da planilha original (DESKTOP WEB - Visual 1.xlsx).
// Para adicionar/editar um sistema, edite um objeto abaixo: name, url (ou null se ainda nao houver link), tag (sigla do selo).
const TOOLS = [
  { name: "BIBLIOTECA", url: "https://drive.google.com/drive/folders/1N8ocNm5iPlabYN-x-P86Od0xubNSL4W-", tag: "BI" },
  { name: "GUIAS DE OCORRÊNCIA", url: "https://drive.google.com/drive/folders/1-y5s41bdxTTlMkIcZud68rMjKy_gpkks", tag: "GO" },
  { name: "CONTROLE INTERNO DE IA", url: "https://docs.google.com/spreadsheets/d/1pGCqPQxYQO2oGxA7gFjJGEGK4sbx6fj_U6H4G1eHSFo/edit?gid=489829030", tag: "IA" },
  { name: "PROCESSOS SEI", url: "https://docs.google.com/spreadsheets/d/1ZEyldRZyVqgfzI01g-IBsmRkVoLzJ5Y246pFKCJyXwM/edit?gid=229512721", tag: "SEI" },
  { name: "RELATÓRIO - Acerto Manual - 03/04/24", url: "https://docs.google.com/spreadsheets/d/1SuK803uGdt5vCVInrkFKijcck7MVdzckUMRuEooTZuk/edit?gid=923097412", tag: "RA" },
  { name: "FOLGA COMPENSATÓRIA", url: "https://docs.google.com/spreadsheets/d/1WiVnmko5PA4amlUADRqhOG04BRRcSvqe2NOpEpesneo/edit?gid=1142259615", tag: "FC" },
  { name: "ANUL.APOS. EC103/19", url: "https://docs.google.com/spreadsheets/d/1T-QW6m78HqlmSRCmi4pZ6KW0xpa7hYPg9I3_x1mfiWc/edit?gid=1045359958", tag: "EC" },
  { name: "CESSÃO", url: "https://docs.google.com/spreadsheets/d/1RRJIiptPxUScQpbWtNXN53d8GbwvZAmNUDySy5SbPPQ/edit?gid=1649548333", tag: "CE" },
  { name: "PONTO DIGITAL", url: "https://www.pontodigital.mg.gov.br/Publica", tag: "PD" },
  { name: "CONTAGEM DE TEMPO", url: "https://drive.google.com/drive/folders/1x8goAn9bE9U1HpC4p8aOhEn4FhT74Kk3", tag: "CT" },
  { name: "CORREÇÃO I.A.s", url: "https://docs.google.com/spreadsheets/d/1uzBGJsOzBvRVEO25B4rkufXGB_LqEXtj/edit?pli=1&gid=797829345", tag: "CO" },
  { name: "E - SOCIAL", url: "https://docs.google.com/spreadsheets/d/1ddK22DVM65rBHW-nnjvxOXOwhrkNzpKr/edit?pli=1&gid=1107740878", tag: "ES" },
  { name: "RELATÓRIO - Acerto 13º", url: "https://docs.google.com/spreadsheets/d/1jZU6M7BWrDQkr1pU9bimrpAYI6qJUllr8DgSFlKUvt8/edit?gid=1384655041", tag: "RA" },
  { name: "SISAP WEB", url: null, tag: "SW" },
  { name: "SERVIDORES CEDIDOS", url: "https://docs.google.com/spreadsheets/d/1m9axJiayx7K6FXHj1gfvl9J5Wjdi2a7Y3QLchVWPTzE/edit?gid=1740967758", tag: "SC" },
  { name: "SEI", url: "https://www.sei.mg.gov.br/sip/login.php?sigla_orgao_sistema=GOVMG&sigla_sistema=SEI", tag: "SEI" },
  { name: "LIBERAÇÃO FALTA - TIPO 2", url: "https://docs.google.com/spreadsheets/d/1yAZFJiAa0PWL1Bp6EL1-vGCLqeMfgR3ILrYsAi_Lbz0/edit?gid=794802376", tag: "LF" },
  { name: "INFORMATIVO DE ALTERAÇÃO - DIPE", url: "https://docs.google.com/spreadsheets/d/1TGKZsvx9c1T01PKZXw8gLtRpjuWH6JEiC1pA_lg_Y8U/edit?gid=685574746", tag: "IA" },
  { name: "SAÚDE", url: "https://docs.google.com/spreadsheets/d/19Ffq4yqFIac7rFp9roLQIR_uu78mEYIhgUl1PygXh34/edit?gid=1219913832", tag: "SA" },
  { name: "CARGOS APOSENTADOS - APOSENTADORIA/MIGRACAO", url: null, tag: "CA" },
  { name: "RELAÇÃO ESCOLAS-TAXADORES", url: "https://docs.google.com/spreadsheets/d/1b9hA5_y9xGNwwNsrQiu9Y6FCP467XE_373r5zOmmJJc/edit?gid=1216202471", tag: "RE" },
  { name: "ACOMPANHAMENTO JUDICIAL", url: null, tag: "AJ" },
  { name: "CONECTA RH", url: "https://www.conectarh.mg.gov.br/", tag: "RH" },
  { name: "VENCIMENTOS DEIXADOS", url: "https://docs.google.com/spreadsheets/d/1yjXFn_R6RTmeBLhHj3_H-KfrOhnSPAYEpDAehSf51gA/edit?gid=509616479", tag: "VD" },
  { name: "ARQUIVO CONSOLIDADO", url: "https://docs.google.com/spreadsheets/d/17k-YxtkMcH-spkk7UCvfrPEwl4Pv5304ayx8VO3c5-w/edit?gid=894487392", tag: "AC" },
  { name: "ISENÇÃO TRIBUTÁRIA", url: "https://docs.google.com/spreadsheets/d/1zQyNtFwmTNAAFEoac8d-5iBtFBUDf94R/edit?gid=1556910683", tag: "IT" },
  { name: "GESTÃO", url: "https://docs.google.com/spreadsheets/d/1AedSH8xF-BWVOUR1-G438SZltnurBfEkeUoCsPP5udk/edit?gid=654263000", tag: "GE" },
  { name: "CONTROLE DE DAE", url: "https://docs.google.com/spreadsheets/d/1XAL2T_pGkoFq_YRmAb0UDcnTH5Rf_jl-FHI97oaulwc/edit?gid=1852532253", tag: "DAE" },
  { name: "CÁLCULO DE PROVENTO/MÉDIA", url: "https://wwws.seplag.mg.gov.br/index.php", tag: "CP" },
  { name: "DIÁRIO DE PAGAMENTO", url: "https://docs.google.com/spreadsheets/d/1zF6K74HtCtxiZXFgcmG1uJ0NIHXG8pxo_lXu6BiUrAA/edit?gid=1739041770", tag: "DP" },
  { name: "PLANILHA 52-490", url: "https://docs.google.com/spreadsheets/d/1DtaE6--J2SM7yCI3XoncNhONuearMEqAnzLUEEqR_II/edit?gid=50123981", tag: "PL" },
  { name: "SISAP WEB FIPA", url: "http://www.sisapweb.mg.gov.br/fipa/telaacesso.htm", tag: "SF" },
  { name: "ACERTO 11,36%", url: "https://docs.google.com/spreadsheets/d/1o4m5qEGUsQe76U_F-_h-MPzEEMpz99E0t3TLbaez-xE/edit?gid=438498586", tag: "AC" },
];

// Recados exibidos no Painel de Recados. Adicione objetos { date: "dd/mm/aaaa", text: "..." }.
const NOTICES = [];

if (typeof module !== "undefined") { module.exports = { TOOLS, NOTICES }; }
