export const categories = [
  {
    id: 'earth',
    name: 'Earth & Weather',
    description: 'Clouds, rainbows, rocks, and our changing planet.',
    topics: [
      {
        id: 'rocks',
        name: 'Why are rocks different?',
        summary: 'Explore textures, colors, and how rocks form.'
      },
      {
        id: 'weather',
        name: 'What makes weather change?',
        summary: 'Learn about wind, clouds, and temperature.'
      }
    ]
  },
  {
    id: 'life',
    name: 'Living Things',
    description: 'Plants, animals, and the tiny life around us.',
    topics: [
      {
        id: 'plants',
        name: 'How do plants drink water?',
        summary: 'Watch plants move water from roots to leaves.'
      },
      {
        id: 'bugs',
        name: 'What do insects do all day?',
        summary: 'Observe habits and body parts of insects.'
      }
    ]
  },
  {
    id: 'forces',
    name: 'Forces & Motion',
    description: 'Pushes, pulls, magnets, and movement.',
    topics: [
      {
        id: 'magnets',
        name: 'Why do magnets stick?',
        summary: 'Discover how magnets attract and repel.'
      },
      {
        id: 'ramps',
        name: 'How do ramps change speed?',
        summary: 'Test speed with different slopes.'
      }
    ]
  }
];

export const pacingOptions = [
  { id: 'mini', label: 'Mini lesson', description: '1 day · Quick curiosity spark' },
  { id: 'week', label: '1 week unit', description: '4 days · Gentle pacing' },
  { id: 'two-week', label: '2 week unit', description: '8 days · Deep exploration' }
];

export const sampleChildren = [
  { id: 'child-1', name: 'Ava', age: 6 },
  { id: 'child-2', name: 'Miles', age: 5 }
];

export const unitOverview = {
  title: 'Why do magnets stick?',
  description:
    'A 4-day unit that explores magnetism with videos, a worksheet, and hands-on experiments.'
};

export const unitDays = [
  {
    day: 1,
    summary: 'Meet magnets and test what they attract.',
    videos: [
      { title: 'Magnets for curious kids', duration: '6 min' }
    ],
    worksheetPrompt: 'Circle the objects a magnet can pick up.',
    experiments: [
      {
        name: 'Magnet scavenger hunt',
        supplies: 'bar magnet, paper clips, spoon, coin'
      }
    ],
    parentNotes: 'Keep magnets away from electronics and small children.'
  },
  {
    day: 2,
    summary: 'Compare strong and weak magnets.',
    videos: [
      { title: 'Strong vs weak magnets', duration: '5 min' }
    ],
    worksheetPrompt: 'Draw two magnets and label north/south.',
    experiments: [
      {
        name: 'Paper clip chain test',
        supplies: 'magnets, paper clips'
      }
    ],
    parentNotes: 'Count clips carefully to avoid choking hazards.'
  },
  {
    day: 3,
    summary: 'Learn where magnets show up in daily life.',
    videos: [
      { title: 'Magnets in everyday life', duration: '4 min' }
    ],
    worksheetPrompt: 'Match magnet items to places you find them.',
    experiments: [
      {
        name: 'Magnet maze',
        supplies: 'shoebox lid, magnet, paper clip, paper'
      }
    ],
    parentNotes: 'Tape the maze so kids can focus on moving the clip.'
  },
  {
    day: 4,
    summary: 'Reflect on discoveries and do a magnet show-and-tell.',
    videos: [
      { title: 'Magnet wrap-up', duration: '3 min' }
    ],
    worksheetPrompt: 'Tell me one thing you learned about magnets.',
    experiments: [
      {
        name: 'Magnet show-and-tell',
        supplies: 'favorite magnetic object'
      }
    ],
    parentNotes: 'Encourage kids to share what surprised them.'
  }
];

export const historyItems = [
  {
    id: 'history-1',
    topic: 'How do plants drink water?',
    status: 'Completed',
    lastRun: 'July 10, 2024'
  },
  {
    id: 'history-2',
    topic: 'Why do magnets stick?',
    status: 'In progress',
    lastRun: 'July 13, 2024'
  }
];
