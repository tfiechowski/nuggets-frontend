export interface TreeNode {
  id: number;
  label: string;
  tip?: string | undefined;
  children: TreeNode[];
}

// Define an example tree structure
export const treeData: Array<TreeNode> = [
  {
    id: 1,
    label: 'Discovery: 10 minutes',
    tip: 'Recap the discovery points and confirm with the customer if you got this right.',
    children: [
      { id: 2, label: 'Reiterate the BDR notes and confirm if it’s correct.', children: [] },
      { id: 3, label: 'Anything they would like to add/share on top of this?', children: [] },
      {
        id: 4,
        label: 'Candidate is ready to be hired or still in the recruitment process?',
        children: [],
      },
      { id: 5, label: 'If in the recruitment process, at which stage?', children: [] },
      { id: 6, label: 'When would they like this person to start working for them?', children: [] },
      { id: 7, label: 'Is it their first time hiring remotely?', children: [] },
      { id: 8, label: 'What drove them to start hiring remotely?', children: [] },
      { id: 9, label: 'How familiar are they with the EOR model?', children: [] },
      {
        id: 10,
        label: 'What’s important for them in the solution they’re going to work with? “Criteria”',
        children: [],
      },
      {
        id: 11,
        label: 'Are they looking at any other providers next to Oyster? If yes, which ones.',
        children: [],
      },
    ],
  },
  {
    id: 100,
    label: 'Demo: 15 minutes',
    children: [
      {
        id: 101,
        label: 'Overview: 2 minutes',
        children: [
          { id: 102, label: 'High-level-overview of the EOR model', children: [] },
          {
            id: 103,
            label:
              'Share a customer story / general narrative that their use case is something we come across often.',
            children: [],
          },
        ],
      },
      {
        id: 111,
        label: 'Platform',
        children: [
          {
            id: 120,
            label: 'Cost Calculator: 3 minutes',
            children: [
              {
                id: 121,
                label:
                  'Connect the value of understanding the cost of hiring to the pain of hiring in a new country.',
                children: [],
              },
              { id: 122, label: 'Make sure to mention deposits.', children: [] },
            ],
          },
          {
            id: 130,
            label: 'Country Guides: 2 minutes',
            children: [
              { id: 131, label: 'General guide from the website.', children: [] },
              { id: 132, label: 'ZD Guide dedicated to customers only.', children: [] },
            ],
          },
          {
            id: 140,
            label: 'Hiring Flow: 5 minutes',
            children: [
              { id: 141, label: 'Reiterate the platform’s ease-of use.', children: [] },
              { id: 142, label: 'Highlight Pearl hiring assistant.', children: [] },
              {
                id: 144,
                label: 'Don’t forget to click on the salary to show “Salary Insights”.',
                children: [],
              },
              { id: 145, label: 'Explain benefits.', children: [] },
              {
                id: 146,
                label: 'End with explaining the Onboarding Process and the role of OSMs.',
                children: [],
              },
            ],
          },
          {
            id: 150,
            label: 'Invoicing/payroll: 3 minutes',
            children: [
              {
                id: 151,
                label: 'We pay TMs at the end of the month in local salaries.',
                children: [],
              },
              {
                id: 152,
                label:
                  'We issues 2 invoices: Pre-funding 11th: Estimation (Gross Salary + Taxes + Bonuses + Oyster fee) and Settlement 5th following month: Any difference between estimation and actuals.',
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 160,
    label: 'Next Steps: 10 minutes',
    children: [
      {
        id: 161,
        label: 'Feedback',
        children: [
          {
            id: 162,
            label: 'Ask the customer what do they think about what you shared with them?',
            children: [],
          },
          {
            id: 163,
            label: 'Confirm with the customer if what you shared helps solve their problem.',
            children: [],
          },
        ],
      },
      {
        id: 165,
        label: 'Decision Making Process',
        children: [
          {
            id: 166,
            label: 'What next steps will the customer take in order to make a decision?',
            children: [],
          },
          {
            id: 167,
            label: 'Who else will be involved in making the decision?',
            children: [],
          },
          {
            id: 168,
            label: 'When are they planning to discuss the initiative with them?',
            children: [],
          },
        ],
      },
      {
        id: 170,
        label: 'Follow-up call',
        children: [
          {
            id: 171,
            label:
              'Propose a follow-up meeting that would be post their meeting with the mentioned stakeholder.',
            children: [],
          },
        ],
      },
    ],
  },
];