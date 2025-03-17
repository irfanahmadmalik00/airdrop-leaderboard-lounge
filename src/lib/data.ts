
// Cryptocurrency market data
export interface CryptoMarketData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  image: string;
}

export const marketData: CryptoMarketData[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 61245.32,
    change24h: 2.5,
    marketCap: 1192484990823,
    volume24h: 32986542198,
    image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=022'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3020.18,
    change24h: 3.2,
    marketCap: 363546789032,
    volume24h: 18754309876,
    image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=022'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    price: 142.65,
    change24h: 7.8,
    marketCap: 57846301987,
    volume24h: 6482541097,
    image: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=022'
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.59,
    change24h: -1.2,
    marketCap: 21345678901,
    volume24h: 1523678901,
    image: 'https://cryptologos.cc/logos/cardano-ada-logo.png?v=022'
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    price: 7.32,
    change24h: 1.5,
    marketCap: 9285674301,
    volume24h: 814567321,
    image: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png?v=022'
  }
];

// Airdrop data
export interface Airdrop {
  id: string;
  name: string;
  tokenSymbol: string;
  logo: string;
  description: string;
  fundingAmount: number;
  listingDate: string;
  telegramLink: string;
  twitterLink: string;
  website: string;
  category: string;
  requirements: string[];
  estimatedValue: string;
  status: 'upcoming' | 'active' | 'ended';
  popularity: number; // 1-100 score for ranking
}

export const airdrops: Airdrop[] = [
  {
    id: 'avalanche-blizzard',
    name: 'Avalanche Blizzard',
    tokenSymbol: 'BLZD',
    logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=022',
    description: 'Participate in the Avalanche ecosystem airdrop and earn BLZD tokens.',
    fundingAmount: 5000000,
    listingDate: '2023-08-15',
    telegramLink: 'https://t.me/avalancheblizzard',
    twitterLink: 'https://twitter.com/avalancheavax',
    website: 'https://avalabs.org',
    category: 'DeFi',
    requirements: ['Hold AVAX tokens', 'Interact with Avalanche dApps', 'Bridge assets to Avalanche'],
    estimatedValue: '$500-$5,000',
    status: 'active',
    popularity: 92
  },
  {
    id: 'arbitrum-odyssey',
    name: 'Arbitrum Odyssey',
    tokenSymbol: 'ARB',
    logo: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=022',
    description: 'Join the Arbitrum Odyssey campaign and earn ARB tokens through various tasks.',
    fundingAmount: 12000000,
    listingDate: '2023-06-20',
    telegramLink: 'https://t.me/arbitrumofficial',
    twitterLink: 'https://twitter.com/arbitrum',
    website: 'https://arbitrum.io',
    category: 'Layer 2',
    requirements: ['Use Arbitrum network', 'Interact with protocols on Arbitrum', 'Bridge assets to Arbitrum'],
    estimatedValue: '$200-$2,000',
    status: 'upcoming',
    popularity: 88
  },
  {
    id: 'celestia-cosmos',
    name: 'Celestia Cosmos',
    tokenSymbol: 'TIA',
    logo: 'https://cryptologos.cc/logos/cosmos-atom-logo.png?v=022',
    description: 'Participate in the Celestia network testnet and earn TIA tokens.',
    fundingAmount: 8000000,
    listingDate: '2023-09-10',
    telegramLink: 'https://t.me/celestiaorg',
    twitterLink: 'https://twitter.com/celestiaorg',
    website: 'https://celestia.org',
    category: 'Modular Blockchain',
    requirements: ['Run a Celestia node', 'Participate in testnet challenges', 'Create data availability samples'],
    estimatedValue: '$300-$3,000',
    status: 'active',
    popularity: 85
  },
  {
    id: 'sui-surge',
    name: 'Sui Surge',
    tokenSymbol: 'SUI',
    logo: 'https://cryptologos.cc/logos/sui-sui-logo.png?v=022',
    description: 'Join the Sui network campaign and earn SUI tokens by completing tasks.',
    fundingAmount: 10000000,
    listingDate: '2023-07-05',
    telegramLink: 'https://t.me/suinetwork',
    twitterLink: 'https://twitter.com/suinetwork',
    website: 'https://sui.io',
    category: 'Smart Contract Platform',
    requirements: ['Create Sui wallet', 'Interact with Sui dApps', 'Complete Sui Quests'],
    estimatedValue: '$400-$4,000',
    status: 'active',
    popularity: 82
  },
  {
    id: 'starknet-voyage',
    name: 'StarkNet Voyage',
    tokenSymbol: 'STRK',
    logo: 'https://cryptologos.cc/logos/starknet-strk-logo.png?v=022',
    description: 'Embark on a journey through StarkNet ecosystem to earn STRK tokens.',
    fundingAmount: 7500000,
    listingDate: '2023-08-30',
    telegramLink: 'https://t.me/starknet',
    twitterLink: 'https://twitter.com/starkneteco',
    website: 'https://starknet.io',
    category: 'ZK Rollup',
    requirements: ['Use StarkNet', 'Deploy a contract on StarkNet', 'Bridge assets to StarkNet'],
    estimatedValue: '$250-$2,500',
    status: 'upcoming',
    popularity: 79
  },
  {
    id: 'zksync-era',
    name: 'zkSync Era',
    tokenSymbol: 'ZKS',
    logo: 'https://cryptologos.cc/logos/zksync-logo.png?v=022',
    description: 'Participate in zkSync Era airdrop by engaging with the ecosystem.',
    fundingAmount: 9000000,
    listingDate: '2023-06-15',
    telegramLink: 'https://t.me/zksync',
    twitterLink: 'https://twitter.com/zksync',
    website: 'https://zksync.io',
    category: 'ZK Rollup',
    requirements: ['Bridge to zkSync', 'Swap on zkSync DEXs', 'Use zkSync dApps'],
    estimatedValue: '$350-$3,500',
    status: 'ended',
    popularity: 76
  },
  {
    id: 'aptos-accelerator',
    name: 'Aptos Accelerator',
    tokenSymbol: 'APT',
    logo: 'https://cryptologos.cc/logos/aptos-apt-logo.png?v=022',
    description: 'Join the Aptos ecosystem airdrop campaign and earn APT tokens.',
    fundingAmount: 6000000,
    listingDate: '2023-07-20',
    telegramLink: 'https://t.me/aptosnetwork',
    twitterLink: 'https://twitter.com/aptoslabs',
    website: 'https://aptoslabs.com',
    category: 'Layer 1',
    requirements: ['Create Aptos wallet', 'Interact with Aptos dApps', 'Stake APT tokens'],
    estimatedValue: '$200-$2,000',
    status: 'active',
    popularity: 73
  },
  {
    id: 'near-horizon',
    name: 'NEAR Horizon',
    tokenSymbol: 'NEAR',
    logo: 'https://cryptologos.cc/logos/near-protocol-near-logo.png?v=022',
    description: 'Explore the NEAR Protocol ecosystem and earn NEAR tokens.',
    fundingAmount: 5500000,
    listingDate: '2023-09-05',
    telegramLink: 'https://t.me/nearprotocol',
    twitterLink: 'https://twitter.com/nearprotocol',
    website: 'https://near.org',
    category: 'Layer 1',
    requirements: ['Create NEAR account', 'Use NEAR dApps', 'Stake NEAR tokens'],
    estimatedValue: '$150-$1,500',
    status: 'upcoming',
    popularity: 71
  }
];

// Videos for admin to manage
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  dateAdded: string;
  views: number;
  category: string;
}

export const videos: Video[] = [
  {
    id: 'v1',
    title: 'How to Participate in Arbitrum Airdrop',
    description: 'Complete guide to join the Arbitrum airdrop and maximize your rewards',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    dateAdded: '2023-06-01',
    views: 15420,
    category: 'Tutorial'
  },
  {
    id: 'v2',
    title: 'Top 5 Airdrops Coming in August 2023',
    description: 'Don\'t miss these upcoming airdrops that could be worth thousands',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    dateAdded: '2023-07-15',
    views: 24680,
    category: 'Analysis'
  },
  {
    id: 'v3',
    title: 'Avalanche Blizzard Airdrop Requirements Explained',
    description: 'Step-by-step guide to meet all requirements for the Avalanche Blizzard airdrop',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    dateAdded: '2023-07-22',
    views: 18340,
    category: 'Tutorial'
  }
];

// Charts data
export const btcPriceHistory = [
  { date: '2023-01', price: 16500 },
  { date: '2023-02', price: 21000 },
  { date: '2023-03', price: 28000 },
  { date: '2023-04', price: 29500 },
  { date: '2023-05', price: 27000 },
  { date: '2023-06', price: 30500 },
  { date: '2023-07', price: 31000 },
  { date: '2023-08', price: 36000 },
  { date: '2023-09', price: 32000 },
  { date: '2023-10', price: 34000 },
  { date: '2023-11', price: 37000 },
  { date: '2023-12', price: 42000 },
  { date: '2024-01', price: 48000 },
  { date: '2024-02', price: 52000 },
  { date: '2024-03', price: 58000 },
  { date: '2024-04', price: 61000 },
];

export const marketDominance = [
  { name: 'Bitcoin', value: 45 },
  { name: 'Ethereum', value: 18 },
  { name: 'Solana', value: 6 },
  { name: 'BNB', value: 4 },
  { name: 'Others', value: 27 },
];
