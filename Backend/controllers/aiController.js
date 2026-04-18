const { info, review, MODEL_NAME } = require('../config/ai');

// Helper to clean AI response (still needed if Groq returns markdown fences)
const extractJSON = (text) => {
    // Strip markdown code fences if present
    let cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();

    // Remove any actual newlines/tabs inside JSON string values
    cleaned = cleaned.replace(/"(?:[^"\\]|\\.)*"/g, (match) => {
        return match
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t');
    });

    return cleaned;
};


const generateInfo = async (req, res) => {
    try {

        console.log("reached ai");

        const rawData = req.body.data; // send your API response here
        console.log(rawData);
        const systemPrompt = `
You are a product information extraction engine for a shopping app.

Extract only the content a consumer should see while shopping.

Return ONLY valid JSON.
Return an array of objects in this format:
[
  {
    "info_column": "<clean display label>",
    "information": <string | array | number | object>
  }
]

Keep only shopper-visible fields from the product data:
- product_name
- code
- categories
- quantity / product_quantity
- ingredients_text
- allergens_tags
- nutrient_levels
- nutriments
- nutrition_data
- nutrition_data_per
- nova_group
- nutrition_grades
- image_url

Rules:
1. Ignore all technical/API metadata such as status, status_verbose, headers, config, request, statusText, content-length, content-type, baseURL, url, method, and wrapper keys like data if they do not contain product data.
2. Use only meaningful product information.
3. Do not invent or guess anything.
4. For allergens_tags, return a cleaned array of allergen names.
5. For ingredients_text, return the full readable ingredient text.
6. For nutriments and nutrient_levels, keep useful nutrition info only.
7. Do not include raw response objects or backend details.
8. Do not explain anything. Do not add markdown. Output only JSON.
`;

        const userPrompt = `
Extract shopper-visible product info from this JSON:
${JSON.stringify(rawData)}
`;

        const messages = [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: userPrompt,
            },
        ];

        const completion = await info.chat.completions.create({
            model: MODEL_NAME,
            messages,
            temperature: 0.2,
            max_tokens: 3000,
        });

        const responseText = completion.choices[0].message.content;
        const cleaned = extractJSON(responseText);
        const parsed = JSON.parse(cleaned);

        console.log("done ai");
        console.log(parsed);
        res.json(parsed);
    } catch (error) {
        console.error("Groq Question Gen Error:", error);
        res.status(500).json({ error: "Failed to generate question" });
    }
};
const x = async (req, res) => {
    try {
        const { question, constraint, code, explanation } = req.body;

        const messages = [
            {
                role: 'system',
                content: ``
            },
            {
                role: 'user',
                content: ``
            }
        ];

        const completion = await review.chat.completions.create({
            model: MODEL_NAME,
            messages: messages,
            temperature: 0.3,
            max_tokens: 3000,
        });

        const responseText = completion.choices[0].message.content;
        const cleaned = extractJSON(responseText);
        const parsed = JSON.parse(cleaned);

        res.json(parsed);
    } catch (error) {
        console.error('Groq Evaluation Error:', error);
        res.status(500).json({ error: 'Evaluation failed' });
    }
};

module.exports = { generateInfo, x };