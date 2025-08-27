import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });

const TABLE_NAME = process.env.COMPANIES_TABLE_NAME || 'Companies';

type StorableCompanyRecord = {
  id: string;
  name: string;
  type: string;
  subscriptionDate: string;
};

export async function storeCompanyRecord(
  record: StorableCompanyRecord,
): Promise<void> {
  const dynamoRecord = {
    id: { S: record.id },
    name: { S: record.name },
    type: { S: record.type },
    subscriptionDate: { S: record.subscriptionDate },
  };

  await dynamoClient.send(
    new PutItemCommand({
      TableName: TABLE_NAME,
      Item: dynamoRecord,
      ConditionExpression: 'attribute_not_exists(id)',
    }),
  );
}
