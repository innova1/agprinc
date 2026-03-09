/**
 * Creates the AgilePrinciples DynamoDB table and seeds it with all agile data.
 *
 * Usage:
 *   AWS_REGION=us-east-1 node infrastructure/seed-dynamodb.js
 *
 * For local DynamoDB:
 *   DYNAMO_ENDPOINT=http://localhost:8000 node infrastructure/seed-dynamodb.js
 */

require('dotenv').config({ path: './backend/.env' });
const { DynamoDBClient, CreateTableCommand, DescribeTableCommand, waitUntilTableExists } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const TABLE_NAME = process.env.DYNAMO_TABLE || 'AgilePrinciples';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  ...(process.env.DYNAMO_ENDPOINT && { endpoint: process.env.DYNAMO_ENDPOINT }),
});

const docClient = DynamoDBDocumentClient.from(client);

async function createTable() {
  try {
    await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    console.log(`Table ${TABLE_NAME} already exists.`);
    return;
  } catch {
    // Table doesn't exist, create it
  }

  await client.send(
    new CreateTableCommand({
      TableName: TABLE_NAME,
      KeySchema: [
        { AttributeName: 'framework', KeyType: 'HASH' },
        { AttributeName: 'typeId', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'framework', AttributeType: 'S' },
        { AttributeName: 'typeId', AttributeType: 'S' },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    })
  );

  console.log(`Creating table ${TABLE_NAME}...`);
  await waitUntilTableExists({ client, maxWaitTime: 60 }, { TableName: TABLE_NAME });
  console.log(`Table ${TABLE_NAME} created.`);
}

function getSeedData() {
  const d = [
    { id: '1',  type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'continuous delivery', text: 'Our highest priority is to satisfy the customer through early and continuous delivery of valuable software.', keywords: ['highest', 'priority', 'customer', 'early', 'continuous', 'delivery', 'valuable', 'software'] },
    { id: '2',  type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'welcome change', text: "Welcome changing requirements, even late in development. Agile processes harness change for the customer's competitive advantage.", keywords: ['changing', 'requirements', 'late', 'development', 'change', 'customer', 'competitive', 'advantage'] },
    { id: '3',  type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'deliver frequently', text: 'Deliver working software frequently, from a couple of weeks to a couple of months, with a preference to the shorter timescale.', keywords: ['deliver', 'working', 'software', 'frequently', 'weeks', 'months', 'shorter', 'timescale'] },
    { id: '4',  type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'daily with business', text: 'Business people and developers must work together daily throughout the project.', keywords: ['business', 'developers', 'together', 'daily', 'project'] },
    { id: '5',  type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'motivated individuals', text: 'Build projects around motivated individuals. Give them the environment and support they need, and trust them to get the job done.', keywords: ['build', 'projects', 'motivated', 'individuals', 'environment', 'support', 'trust'] },
    { id: '6',  type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'face-to-face conversation', text: 'The most efficient and effective method of conveying information to and within a development team is face-to-face conversation.', keywords: ['efficient', 'effective', 'conveying', 'information', 'team', 'face-to-face', 'conversation'] },
    { id: '7',  type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'progress is working software', text: 'Working software is the primary measure of progress.', keywords: ['working', 'software', 'primary', 'measure', 'progress'] },
    { id: '8',  type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'sustainability', text: 'Agile processes promote sustainable development. The sponsors, developers, and users should be able to maintain a constant pace indefinitely.', keywords: ['agile', 'processes', 'sustainable', 'development', 'sponsors', 'developers', 'users', 'pace'] },
    { id: '9',  type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'technical excellence', text: 'Continuous attention to technical excellence and good design enhances agility.', keywords: ['continuous', 'technical', 'excellence', 'design', 'agility'] },
    { id: '10', type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'simplicity', text: 'Simplicity--the art of maximizing the amount of work not done--is essential.', keywords: ['simplicity', 'maximizing', 'work', 'essential'] },
    { id: '11', type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'best design from the teams', text: 'The best architectures, requirements, and designs emerge from self-organizing teams.', keywords: ['architectures', 'requirements', 'designs', 'self-organizing', 'teams'] },
    { id: '12', type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'continuous improvement', text: 'At regular intervals, the team reflects on how to become more effective, then tunes and adjusts its behavior accordingly.', keywords: ['intervals', 'team', 'reflects', 'effective', 'improvement'] },
    { id: '1',  type: 'value', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'individuals and interactions', text: 'Individuals and interactions over processes and tools', keywords: ['individuals', 'interactions', 'processes', 'tools'] },
    { id: '2',  type: 'value', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'working software', text: 'Working software over comprehensive documentation', keywords: ['working', 'software', 'documentation'] },
    { id: '3',  type: 'value', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'collaboration', text: 'Customer collaboration over contract negotiation', keywords: ['customer', 'collaboration', 'contract', 'negotiation'] },
    { id: '4',  type: 'value', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'respond to change', text: 'Responding to change over following a plan', keywords: ['responding', 'change', 'plan'] },
    { id: '1',  type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'economic view', text: 'Take an economic view', keywords: ['economic', 'view'] },
    { id: '2',  type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'systems thinking', text: 'Apply systems thinking', keywords: ['systems', 'thinking'] },
    { id: '3',  type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'variability', text: 'Assume variability; preserve options', keywords: ['variability', 'options'] },
    { id: '4',  type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'incremental learning', text: 'Build incrementally with fast, integrated learning cycles', keywords: ['incremental', 'learning', 'cycles', 'fast'] },
    { id: '5',  type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'working systems', text: 'Base milestones on objective evaluation of working systems', keywords: ['milestones', 'evaluation', 'working', 'systems'] },
    { id: '6',  type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'flow', text: 'Visualize and limit WIP, reduce batch sizes, and manage queue lengths', keywords: ['wip', 'batch', 'flow', 'queue'] },
    { id: '7',  type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'cadence', text: 'Apply cadence, synchronize with cross-domain planning', keywords: ['cadence', 'synchronize', 'planning'] },
    { id: '8',  type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'intrinsic motivation', text: 'Unlock the intrinsic motivation of knowledge workers', keywords: ['motivation', 'knowledge', 'workers'] },
    { id: '9',  type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'decentralize', text: 'Decentralize decision-making', keywords: ['decentralize', 'decision'] },
    { id: '10', type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'value', text: 'Organize around value', keywords: ['organize', 'value'] },
    { id: '1',  type: 'value', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'alignment', text: 'Alignment', keywords: ['alignment'] },
    { id: '2',  type: 'value', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'built-in quality', text: 'Built-in quality', keywords: ['quality'] },
    { id: '3',  type: 'value', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'transparency', text: 'Transparency', keywords: ['transparency'] },
    { id: '4',  type: 'value', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'program execution', text: 'Program execution', keywords: ['execution'] },
    { id: '1',  type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'delight customers', text: 'Delight Customers', keywords: ['delight', 'customers'] },
    { id: '2',  type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'be awesome', text: 'Be awesome', keywords: ['awesome'] },
    { id: '3',  type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'pragmatism', text: 'Pragmatism over purism', keywords: ['pragmatism', 'purism'] },
    { id: '4',  type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'context', text: 'Context counts', keywords: ['context'] },
    { id: '5',  type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'choice', text: 'Choice is good', keywords: ['choice'] },
    { id: '6',  type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'flow', text: 'Optimize flow', keywords: ['optimize', 'flow'] },
    { id: '7',  type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'enterprise', text: 'Enterprise awareness', keywords: ['enterprise', 'awareness'] },
    { id: '1',  type: 'value', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'individuals and interactions', text: 'Individuals and interactions over processes and tools', keywords: ['individuals', 'interactions', 'processes', 'tools'] },
    { id: '2',  type: 'value', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'consumable solutions', text: 'Consumable solutions over comprehensive documentation', keywords: ['consumable', 'solutions', 'documentation'] },
    { id: '3',  type: 'value', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'stakeholder collaboration', text: 'Stakeholder collaboration over contract negotiation', keywords: ['stakeholder', 'collaboration', 'contract'] },
    { id: '4',  type: 'value', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'respond to feedback', text: 'Responding to feedback over following a plan', keywords: ['feedback', 'plan', 'responding'] },
    { id: '5',  type: 'value', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'transparency', text: 'Transparency over (false) predictability', keywords: ['transparency', 'predictability'] },
    { id: '1',  type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'continuous delivery', text: 'Our highest priority is to satisfy the stakeholder through early and continuous delivery of valuable solutions.', keywords: ['stakeholder', 'delivery', 'continuous', 'valuable'] },
    { id: '2',  type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'welcome change', text: "Welcome emerging requirements, even late in the solution delivery lifecycle. Agile processes harness change for the customer's competitive advantage.", keywords: ['requirements', 'change', 'delivery', 'competitive'] },
    { id: '3',  type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'deliver continuously', text: 'Deliver valuable solutions continuously, from many times a day to every few weeks, with the aim to increase the frequency over time.', keywords: ['deliver', 'solutions', 'continuously', 'frequency'] },
    { id: '4',  type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'daily with stakeholders', text: "Stakeholders and developers must actively collaborate to deliver outcomes that will delight our organization's customers.", keywords: ['stakeholders', 'developers', 'collaborate', 'delight'] },
    { id: '5',  type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'motivated individuals', text: 'Build teams around motivated individuals. Give them the environment and support they need, and trust them to get the job done.', keywords: ['motivated', 'individuals', 'environment', 'trust'] },
    { id: '6',  type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'face-to-face conversation', text: 'The most efficient and effective method of conveying information to and within a delivery team is face-to-face conversation, ideally around a whiteboard.', keywords: ['efficient', 'face-to-face', 'team', 'information'] },
    { id: '7',  type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'measure is delivery of value', text: 'Continuous delivery of value is the primary measure of progress.', keywords: ['delivery', 'value', 'measure', 'progress'] },
    { id: '8',  type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'sustainability', text: 'Agile processes promote sustainable delivery. The sponsors, developers, and users should be able to maintain a constant pace indefinitely.', keywords: ['sustainable', 'developers', 'pace', 'sponsors'] },
    { id: '9',  type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'technical excellence', text: 'Continuous attention to technical excellence and good design enhances agility.', keywords: ['technical', 'excellence', 'design', 'agility'] },
    { id: '10', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'simplicity', text: 'Simplicity – the art of maximizing the amount of work not done – is essential.', keywords: ['simplicity', 'maximizing', 'essential'] },
    { id: '11', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'best design from the teams', text: 'The best architectures, requirements, and designs emerge from self-organizing teams enabled by organizational roadmaps and support.', keywords: ['architectures', 'self-organizing', 'teams', 'roadmaps'] },
    { id: '12', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'continuous improvement', text: 'The team continuously reflects on how to become more effective, then experiments, learns, and adjusts its behavior accordingly.', keywords: ['team', 'experiments', 'effective', 'improvement'] },
    { id: '13', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'leverage enterprise assets', text: 'Leverage and evolve the assets within your enterprise, collaborating with the people responsible for those assets to do so.', keywords: ['leverage', 'enterprise', 'assets', 'collaborating'] },
    { id: '14', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'visualize work', text: 'Visualize work to produce a smooth delivery flow and keep work-in-progress (WIP) to a minimum.', keywords: ['visualize', 'wip', 'flow', 'delivery'] },
    { id: '15', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'evolve the entire enterprise', text: 'Evolve the entire enterprise, not just individuals and teams, to support agile, non-agile, and hybrid teams.', keywords: ['evolve', 'enterprise', 'agile', 'hybrid'] },
    { id: '16', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'automated measures', text: 'We measure our work and its outcomes, preferring automated measures over manually gathered ones, to make data-led decisions.', keywords: ['automated', 'measures', 'decisions', 'outcomes'] },
    { id: '17', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'transparency', text: 'We provide complete transparency to our stakeholders in everything we do and produce, to enable open and honest conversations and effective governance of our team.', keywords: ['transparency', 'stakeholders', 'governance', 'team'] },
    { id: '1',  type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'deliver continuously', text: 'Deliver continuously', keywords: ['deliver', 'continuously'] },
    { id: '2',  type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'visualize workflow', text: 'Visualize workflow', keywords: ['visualize', 'workflow'] },
    { id: '3',  type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'whole teams', text: 'Whole teams', keywords: ['teams'] },
    { id: '4',  type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'stable teams', text: 'Stable teams', keywords: ['stable', 'teams'] },
    { id: '5',  type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'trust and respect', text: 'Trust & respect', keywords: ['trust', 'respect'] },
    { id: '6',  type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'mastery', text: 'Master your craft', keywords: ['mastery', 'craft'] },
    { id: '7',  type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'technical excellence', text: 'Technical excellence', keywords: ['technical', 'excellence'] },
    { id: '8',  type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'collaboration', text: 'Collaboration', keywords: ['collaboration'] },
    { id: '9',  type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'measure wisely', text: 'Measure wisely', keywords: ['measure'] },
    { id: '10', type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'transparency', text: 'Transparency', keywords: ['transparency'] },
    { id: '11', type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'learn continuously', text: 'Learn continuously', keywords: ['learn', 'continuously'] },
    { id: '12', type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'purposeful experiments', text: 'Purposeful experiments', keywords: ['purposeful', 'experiments'] },
    { id: '1',  type: 'principle', frameworkdisplay: 'Modern Agile', framework: 'modern', shortdescription: 'make people awesome', text: 'Make people awesome', keywords: ['people', 'awesome'] },
    { id: '2',  type: 'principle', frameworkdisplay: 'Modern Agile', framework: 'modern', shortdescription: 'deliver continuously', text: 'Deliver value continuously', keywords: ['deliver', 'value', 'continuously'] },
    { id: '3',  type: 'principle', frameworkdisplay: 'Modern Agile', framework: 'modern', shortdescription: 'safety', text: 'Make safety a prerequisite', keywords: ['safety', 'prerequisite'] },
    { id: '4',  type: 'principle', frameworkdisplay: 'Modern Agile', framework: 'modern', shortdescription: 'experiment and learn', text: 'Experiment and learn rapidly', keywords: ['experiment', 'learn', 'rapidly'] },
    { id: '1',  type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'eliminate waste', text: 'Eliminate waste', keywords: ['eliminate', 'waste'] },
    { id: '2',  type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'build quality in', text: 'Build quality in', keywords: ['quality'] },
    { id: '3',  type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'create knowledge', text: 'Create knowledge', keywords: ['knowledge'] },
    { id: '4',  type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'defer commitment', text: 'Defer commitment', keywords: ['defer', 'commitment'] },
    { id: '5',  type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'deliver quickly', text: 'Deliver quickly', keywords: ['deliver', 'quickly'] },
    { id: '6',  type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'respect people', text: 'Respect people', keywords: ['respect', 'people'] },
    { id: '7',  type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'optimize the whole', text: 'Optimize the whole', keywords: ['optimize', 'whole'] },
  ];
  return d;
}

async function seed() {
  await createTable();
  const items = getSeedData();
  console.log(`Seeding ${items.length} items into ${TABLE_NAME}...`);
  let count = 0;
  for (const item of items) {
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: { ...item, typeId: `${item.type}#${item.id}` },
      })
    );
    count++;
  }
  console.log(`Done. Seeded ${count} items.`);
}

seed().catch((err) => { console.error(err); process.exit(1); });
