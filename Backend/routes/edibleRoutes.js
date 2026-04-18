const express = require("express");
const router = express.Router();

router.get("/:barcode", async (req, res) => {
    try {
        const { barcode } = req.params;


        try {
            const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${barcode}?fields=product_name,brands,quantity,categories,ingredients_text,allergens_tags,nutriments,nutrient_levels,nova_group,nutrition_grades,nutriscore_data,image_url`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            console.log(barcode);
            const data = await response.json();

            res.status(200).json({
                data: data
            })
        }
        catch (error) {
            console.log(error);
            res.status(401).json({
                message: "failed to fetch",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "API fetch failed" });
    }
});



router.get("/recommend/:category", async (req, res) => {
  try {
    const { category } = req.params;

    // sanitize category (IMPORTANT)
    const formattedCategory = category.toLowerCase().replace(/ /g, "-");

    // ── Fetch Grade A products ──
    const resA = await fetch(
      `https://world.openfoodfacts.net/api/v2/search?categories_tags_en=${formattedCategory}&nutrition_grades_tags=a&page_size=2&fields=product_name,nutrition_grades,image_url`
    );
    const dataA = await resA.json();

    // ── Fetch Grade B products ──
    const resB = await fetch(
      `https://world.openfoodfacts.net/api/v2/search?categories_tags_en=${formattedCategory}&nutrition_grades_tags=b&page_size=2&fields=product_name,nutrition_grades,image_url`
    );
    const dataB = await resB.json();

    return res.json({
      category: category,
      recommendations: {
        A: dataA.products || [],
        B: dataB.products || [],
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});



module.exports = router;