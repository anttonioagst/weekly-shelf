import { Polar } from "@polar-sh/sdk";
import { HONEST_SKU, isPolarRefusal, polarServer } from "../lib/polar";

async function main() {
  const accessToken = process.env.POLAR_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("Set POLAR_ACCESS_TOKEN (sandbox organization token).");
    process.exit(1);
  }

  const server = polarServer();
  if (server === "production" && process.env.POLAR_ALLOW_LIVE !== "true") {
    console.error("Refusing production setup. Debug on sandbox first.");
    process.exit(1);
  }

  const polar = new Polar({ accessToken, server });

  try {
    const pages = await polar.products.list({
      query: HONEST_SKU.name,
      isArchived: false,
      limit: 20,
    });
    const found = pages.result.items.find(
      (product) => product.name === HONEST_SKU.name && !product.isArchived,
    );
    if (found) {
      console.log("SKU already exists.");
      console.log(`POLAR_PRODUCT_ID=${found.id}`);
      return;
    }

    const created = await polar.products.create({
      name: HONEST_SKU.name,
      description: HONEST_SKU.description,
      recurringInterval: null,
      prices: [
        {
          amountType: "fixed",
          priceAmount: 100,
          priceCurrency: "usd",
        },
      ],
    });
    console.log("Created honest SKU: Weekly #1 shelf listing");
    console.log(`POLAR_PRODUCT_ID=${created.id}`);
  } catch (error) {
    if (isPolarRefusal(error)) {
      console.error("STOP: Polar refused or flagged this SKU.");
      console.error("Do not invent a second PSP. Report and wait.");
      console.error(error);
      process.exit(2);
    }
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
