import { CompanyType, PrismaClient } from "@prisma/client";
import { Decimal } from '@prisma/client/runtime/library';
import { randomUUID } from "node:crypto";
import seedCompanies from "./companies.json";
import seedTransfers from "./transfers.json"

const prisma = new PrismaClient();

async function main() {
  try {
    await Promise.allSettled(
      [
        prisma.company.createMany({
          data: seedCompanies.map((company) => ({
            id: company.id,
            name: company.name,
            type: company.type as CompanyType,
            subscriptionDate: company.subscriptionDate,
          }))
        }),
        prisma.transfer.createMany({
          data: seedTransfers.map((transfer) => ({
            id: randomUUID(),
            sentDate: transfer.sentDate,
            amount: new Decimal(transfer.amount),
            senderId: transfer.senderId,
            recipientId: transfer.recipientId,
          }))
        })
      ]
    );
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
