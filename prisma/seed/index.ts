import { CompanyType, PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";
import seedCompanies from "./companies.json";

const prisma = new PrismaClient();

async function main() {
  try {
    const seedingPromises = seedCompanies.map((company) =>
      prisma.company.create({
        data: {
          id: randomUUID(),
          name: company.name,
          type: company.type as CompanyType,
          subscriptionDate: company.subscriptionDate,
        },
      })
    );

    await Promise.allSettled(seedingPromises);
  } catch (error) {
    console.error(error);
  }
}

main()
  .then(async () => {
    console.log("Database seeded");
  })
  .catch(async (e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit();
  });
