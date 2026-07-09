const deepl = require("deepl-node");

const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

// Traduz um texto para português brasileiro
async function translateToPtBr(text) {
  if (!text) return null;

  try {
    const result = await translator.translateText(text, null, "pt-BR");
    return result.text;
  } catch (error) {
    console.error("Erro ao traduzir com DeepL:", error.message);
    return text; // retorna o original se falhar
  }
}

module.exports = { translateToPtBr };