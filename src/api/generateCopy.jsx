export default async function generateMarketingCopy(
  productName,
  productDescription,
  tone = "professional",
  language = "French"
) {
  // Validate inputs
  if (!productName) throw new Error("Product name is required");

  // Construct the prompt for ChatGPT
  const prompt = `
   Generate a complete marketing copy for a product landing page in ${language}, with the following sections:

1. **MAIN HEADER**: "[Language equivalent of: Discover our [Product Name]]" (properly adapt this phrase into ${language} with the actual product name from the product link)

2. **DEMO SECTION**: Short, engaging description of product functionality (1 sentence)

3. **FEATURES**: 4 key features with titles and 1-sentence descriptions

4. **HIGHLIGHTS**: 3 highlight sections with titles and subtitles

5. **DIMENSIONS**: Short note about product dimensions

Use the information from the following product page link to extract the necessary details (product name, description, features, dimensions, etc.):

**Product name**: ${productName}

**Product description**: ${productDescription}

**Tone**: ${tone}

**Language**: ${language}

1. Icon Format:
- Use the exact export names from these sets:
  * Font Awesome 5: "Fa[IconName]" (e.g., "FaCamera")
  * Material Design: "Md[IconName]" (e.g., "MdSettings")
  * Heroicons: "Hi[IconName]" (e.g., "HiOutlineMail")
  * Feather: "Fi[IconName]" (e.g., "FiUser")
- Provide me with main icon and a fallback icon

**Important Instructions:**

- Always write naturally and correctly in the target ${language}.
- Translate any extracted content appropriately if the source page is in a different language.
- Format the response as JSON exactly like this:

\`\`\`json
{
  "mainHeader": "[Language equivalent of: Discover our [Product Name]]",
  "demoDescription": "...",
  "features": [
    {"title": "...", "description": "...", icon:"...", fallbackIcon: "..."},
    {"title": "...", "description": "...", icon:"...", fallbackIcon: "..."},
    {"title": "...", "description": "...", icon:"...", fallbackIcon: "..."},
    {"title": "...", "description": "...", icon:"...", fallbackIcon: "..."}
  ],
  "highlights": [
    {"title": "...", "subtitle": "..."},
    {"title": "...", "subtitle": "..."},
    {"title": "...", "subtitle": "..."}
  ],
  "dimensionsNote": "..."
}
`;

  try {
    // Call ChatGPT API
    //   const response = await fetch(
    //     "https://api.openai.com/v1/chat/completions",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${OPENAI_API_KEY}`, // Replace with your API key
    //       },
    //       body: JSON.stringify({
    //         model: "gpt-3.5-turbo",
    //         messages: [
    //           {
    //             role: "system",
    //             content:
    //               "You are a professional marketing copywriter specializing in product landing pages.",
    //           },
    //           {
    //             role: "user",
    //             content: prompt,
    //           },
    //         ],
    //         temperature: 0.7,
    //         max_tokens: 1000,
    //         response_format: { type: "json_object" },
    //       }),
    //     }
    //   );
    // openRouter api
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          //   "HTTP-Referer": "your-app-name",
          //   "X-Title": "your-app-name",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a professional marketing copywriter specializing in product landing pages.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 1000,
          response_format: { type: "json_object" }, // correct
        }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`API Error: ${data.error?.message || "Unknown error"}`);
    }
    //   Parse and return the generated content
    const generatedContent = JSON.parse(data?.choices[0]?.message?.content);
    // console.log(data?.choices[0]?.message?.content);
    console.log("generatedContent", generatedContent);
    return {
      mainHeader: generatedContent.mainHeader,
      demoDescription: generatedContent.demoDescription,
      features: generatedContent.features || [],
      highlights: generatedContent.highlights || [],
    };
  } catch (error) {
    console.error("Error generating marketing copy:", error);
    throw error;
  }

  //   return {
  //     mainHeader: "Découvrez notre Séchoir à Linge Portable",
  //     demoDescription:
  //       "Séchoir compact idéal pour les petits espaces tels que les appartements, les VR et les voyages.",
  //     features: [
  //       {
  //         title: "Design Portable",
  //         description: "Facile à ranger grâce à sa conception pliable.",
  //       },
  //       {
  //         title: "Commande à Distance",
  //         description:
  //           "Démarrez, arrêtez et ajustez les réglages facilement avec la télécommande.",
  //       },
  //       {
  //         title: "Capacité Spacieuse",
  //         description:
  //           "Grand tambour malgré sa taille compacte, pouvant contenir une grande quantité de vêtements.",
  //       },
  //       {
  //         title: "Construction Durable",
  //         description:
  //           "Fabriqué en plastique de haute qualité ou en alliage d'acier, conçu pour durer dans un usage régulier.",
  //       },
  //       "highlights",
  //     ],
  //     highlights: [
  //       {
  //         title: "Séchage Efficace",
  //         subtitle: "Obtenez des vêtements secs rapidement et facilement.",
  //       },
  //       {
  //         title: "Pratique en Voyage",
  //         subtitle: "Parfait pour rester frais en déplacement.",
  //       },
  //       {
  //         title: "Utilisation Simplifiée",
  //         subtitle: "Facile à utiliser pour un séchage sans tracas.",
  //       },
  //       "dimensionsNote",
  //     ],
  //     dimensionsNote:
  //       "Dimensions compactes pour s'adapter à n'importe quel espace.",
  //   };
}
