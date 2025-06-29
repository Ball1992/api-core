import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Starting to clean sample data...");

  try {
    // Delete sample contents first (due to foreign key constraints)
    const deletedContents = await prisma.mod_content.deleteMany({
      where: {
        id: {
          in: ["content-001", "content-002", "content-003", "content-004", "content-005"]
        }
      }
    });
    console.log(`✅ Deleted ${deletedContents.count} sample contents`);

    // Delete sample categories
    const deletedCategories = await prisma.mod_category.deleteMany({
      where: {
        id: {
          in: ["cat-news-001", "cat-product-001", "cat-knowledge-001", "cat-company-news-001", "cat-industry-news-001"]
        }
      }
    });
    console.log(`✅ Deleted ${deletedCategories.count} sample categories`);

    console.log("🎉 Sample data cleaned successfully!");
  } catch (error) {
    console.error("❌ Error cleaning sample data:", error);
  }
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
