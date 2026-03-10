const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  ScanCommand,
  QueryCommand,
  UpdateCommand,
  PutCommand,
  GetCommand,
} = require('@aws-sdk/lib-dynamodb');

const TABLE_NAME = process.env.DYNAMO_TABLE || 'AgilePrinciples';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-2',
  ...(process.env.DYNAMO_ENDPOINT && { endpoint: process.env.DYNAMO_ENDPOINT }),
});

const docClient = DynamoDBDocumentClient.from(client);

// PK: framework  SK: type#id (e.g. "principle#1", "value#2")

function makeSK(type, id) {
  return `${type}#${id}`;
}

async function getAllItems() {
  const result = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
  return sortItems(result.Items || []);
}

async function getItemsByFramework(framework) {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'framework = :fw',
      ExpressionAttributeValues: { ':fw': framework },
    })
  );
  return sortItems(result.Items || []);
}

async function getItemByKey(framework, type, id) {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { framework, typeId: makeSK(type, id) },
    })
  );
  return result.Item || null;
}

async function searchByKeywords(keywords, matchType = 'ANY') {
  // Scan all items and filter in application code (small dataset ~130 items)
  const all = await getAllItems();
  const lowerKeywords = keywords.map((k) => k.toLowerCase());

  return all.filter((item) => {
    if (!item.keywords || item.keywords.length === 0) return false;
    const itemKwds = item.keywords.map((k) => k.toLowerCase());
    if (matchType === 'ALL') {
      return lowerKeywords.every((k) => itemKwds.includes(k));
    }
    return lowerKeywords.some((k) => itemKwds.includes(k));
  });
}

async function getSuggestions(partial) {
  const all = await getAllItems();
  const lower = partial.toLowerCase();
  const kwdSet = new Set();
  for (const item of all) {
    if (item.keywords) {
      for (const kwd of item.keywords) {
        if (kwd.toLowerCase().startsWith(lower)) kwdSet.add(kwd.toLowerCase());
      }
    }
  }
  return Array.from(kwdSet).slice(0, 20);
}

async function getFrameworks() {
  const all = await getAllItems();
  const seen = new Set();
  const frameworks = [];
  for (const item of all) {
    if (!seen.has(item.framework)) {
      seen.add(item.framework);
      frameworks.push({ framework: item.framework, frameworkdisplay: item.frameworkdisplay });
    }
  }
  return frameworks;
}

async function getKeywordsMap() {
  const all = await getAllItems();
  const map = {};
  for (const item of all) {
    if (!item.keywords) continue;
    for (const kwd of item.keywords) {
      const key = kwd.toLowerCase();
      if (!map[key]) map[key] = { keyword: key, itemFinders: [] };
      map[key].itemFinders.push({
        framework: item.framework,
        type: item.type,
        ordinal: item.id,
        key: `${item.framework}|${item.type}|${item.id}`,
      });
    }
  }
  return map;
}

async function updateKeywords(framework, type, id, keywordsString) {
  const keywords = keywordsString.split(',').map((k) => k.trim()).filter(Boolean);
  await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { framework, typeId: makeSK(type, id) },
      UpdateExpression: 'SET keywords = :kw',
      ExpressionAttributeValues: { ':kw': keywords },
    })
  );
  return { framework, type, id, keywords };
}

async function putItem(item) {
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: { ...item, typeId: makeSK(item.type, item.id) },
    })
  );
}

function sortItems(items) {
  return items.sort((a, b) => {
    if (a.frameworkdisplay < b.frameworkdisplay) return -1;
    if (a.frameworkdisplay > b.frameworkdisplay) return 1;
    // values before principles (descending type)
    if (a.type > b.type) return -1;
    if (a.type < b.type) return 1;
    return parseInt(a.id) - parseInt(b.id);
  });
}

module.exports = {
  getAllItems,
  getItemsByFramework,
  getItemByKey,
  searchByKeywords,
  getSuggestions,
  getFrameworks,
  getKeywordsMap,
  updateKeywords,
  putItem,
};
