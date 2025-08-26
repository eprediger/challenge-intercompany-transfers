import { CompanyType, PrismaClient } from "@prisma/client";
import { Decimal } from '@prisma/client/runtime/library';
import { randomUUID } from "node:crypto";
import seedCompanies from "./companies.json";
import seedTransfers from "./transfers.json"


async function main() {
  const prisma = new PrismaClient();
  try {

    await prisma.transfer.deleteMany({});
    await prisma.company.deleteMany({});

    const results = await Promise.allSettled([
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
      }),
    ]);

    const failed = results.filter(result => result.status === 'rejected');
    if (failed.length > 0) {
      failed.forEach((result, idx) => {
        console.error(`Promise ${idx} failed:`, (result as PromiseRejectedResult).reason);
      });
      throw new Error(`${failed.length} promise(s) failed during seeding.`);
    }

    console.log("Database seeded");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
    process.exit();
  }
}

main()
