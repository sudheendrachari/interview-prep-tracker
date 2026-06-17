// ============================================================
// DATA: BLIND 75 & NEETCODE 150 PROBLEMS
// ============================================================
export const CATEGORIES = [
  {
    id: 'arrays-and-hashing',
    name: 'Arrays & Hashing',
    problems: [
      {
        id: 'contains-duplicate', name: 'Contains Duplicate', difficulty: 'easy', blind75: true,
      },
      {
        id: 'valid-anagram', name: 'Valid Anagram', difficulty: 'easy', blind75: true,
      },
      {
        id: 'two-sum', name: 'Two Sum', difficulty: 'easy', blind75: true,
      },
      {
        id: 'group-anagrams', name: 'Group Anagrams', difficulty: 'medium', blind75: true,
      },
      {
        id: 'top-k-frequent-elements', name: 'Top K Frequent Elements', difficulty: 'medium', blind75: true,
      },
      {
        id: 'product-of-array-except-self', name: 'Product of Array Except Self', difficulty: 'medium', blind75: true,
      },
      {
        id: 'encode-and-decode-strings', name: 'Encode and Decode Strings', difficulty: 'medium', blind75: true,
      },
      {
        id: 'longest-consecutive-sequence', name: 'Longest Consecutive Sequence', difficulty: 'medium', blind75: true,
      },
      {
        id: 'valid-sudoku', name: 'Valid Sudoku', difficulty: 'medium', blind75: false,
      },
    ],
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    problems: [
      {
        id: 'valid-palindrome', name: 'Valid Palindrome', difficulty: 'easy', blind75: true,
      },
      {
        id: '3sum', name: '3Sum', difficulty: 'medium', blind75: true,
      },
      {
        id: 'container-with-most-water', name: 'Container With Most Water', difficulty: 'medium', blind75: true,
      },
      {
        id: 'two-sum-ii', name: 'Two Sum II - Input Array Is Sorted', difficulty: 'medium', blind75: false,
      },
      {
        id: 'trapping-rain-water', name: 'Trapping Rain Water', difficulty: 'hard', blind75: false,
      },
    ],
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    problems: [
      {
        id: 'best-time-to-buy-sell-stock', name: 'Best Time to Buy and Sell Stock', difficulty: 'easy', blind75: true,
      },
      {
        id: 'longest-substring-without-repeating', name: 'Longest Substring Without Repeating Characters', difficulty: 'medium', blind75: true,
      },
      {
        id: 'longest-repeating-character-replacement', name: 'Longest Repeating Character Replacement', difficulty: 'medium', blind75: true,
      },
      {
        id: 'minimum-window-substring', name: 'Minimum Window Substring', difficulty: 'hard', blind75: true,
      },
      {
        id: 'permutation-in-string', name: 'Permutation in String', difficulty: 'medium', blind75: false,
      },
      {
        id: 'sliding-window-maximum', name: 'Sliding Window Maximum', difficulty: 'hard', blind75: false,
      },
    ],
  },
  {
    id: 'stack',
    name: 'Stack',
    problems: [
      {
        id: 'valid-parentheses', name: 'Valid Parentheses', difficulty: 'easy', blind75: true,
      },
      {
        id: 'min-stack', name: 'Min Stack', difficulty: 'medium', blind75: false,
      },
      {
        id: 'evaluate-reverse-polish-notation', name: 'Evaluate Reverse Polish Notation', difficulty: 'medium', blind75: false,
      },
      {
        id: 'generate-parentheses', name: 'Generate Parentheses', difficulty: 'medium', blind75: false,
      },
      {
        id: 'daily-temperatures', name: 'Daily Temperatures', difficulty: 'medium', blind75: false,
      },
      {
        id: 'car-fleet', name: 'Car Fleet', difficulty: 'medium', blind75: false,
      },
      {
        id: 'largest-rectangle-in-histogram', name: 'Largest Rectangle in Histogram', difficulty: 'hard', blind75: false,
      },
    ],
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    problems: [
      {
        id: 'find-minimum-in-rotated-sorted-array', name: 'Find Minimum in Rotated Sorted Array', difficulty: 'medium', blind75: true,
      },
      {
        id: 'search-in-rotated-sorted-array', name: 'Search in Rotated Sorted Array', difficulty: 'medium', blind75: true,
      },
      {
        id: 'binary-search', name: 'Binary Search', difficulty: 'easy', blind75: false,
      },
      {
        id: 'search-a-2d-matrix', name: 'Search a 2D Matrix', difficulty: 'medium', blind75: false,
      },
      {
        id: 'koko-eating-bananas', name: 'Koko Eating Bananas', difficulty: 'medium', blind75: false,
      },
      {
        id: 'time-based-key-value-store', name: 'Time Based Key-Value Store', difficulty: 'medium', blind75: false,
      },
      {
        id: 'median-of-two-sorted-arrays', name: 'Median of Two Sorted Arrays', difficulty: 'hard', blind75: false,
      },
    ],
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    problems: [
      {
        id: 'reverse-linked-list', name: 'Reverse Linked List', difficulty: 'easy', blind75: true,
      },
      {
        id: 'merge-two-sorted-lists', name: 'Merge Two Sorted Lists', difficulty: 'easy', blind75: true,
      },
      {
        id: 'reorder-list', name: 'Reorder List', difficulty: 'medium', blind75: true,
      },
      {
        id: 'remove-nth-node-from-end', name: 'Remove Nth Node From End of List', difficulty: 'medium', blind75: true,
      },
      {
        id: 'linked-list-cycle', name: 'Linked List Cycle', difficulty: 'easy', blind75: true,
      },
      {
        id: 'merge-k-sorted-lists', name: 'Merge k Sorted Lists', difficulty: 'hard', blind75: true,
      },
      {
        id: 'copy-list-with-random-pointer', name: 'Copy List With Random Pointer', difficulty: 'medium', blind75: false,
      },
      {
        id: 'add-two-numbers', name: 'Add Two Numbers', difficulty: 'medium', blind75: false,
      },
      {
        id: 'find-the-duplicate-number', name: 'Find the Duplicate Number', difficulty: 'medium', blind75: false,
      },
      {
        id: 'lru-cache', name: 'LRU Cache', difficulty: 'medium', blind75: false,
      },
      {
        id: 'reverse-nodes-in-k-group', name: 'Reverse Nodes in k-Group', difficulty: 'hard', blind75: false,
      },
    ],
  },
  {
    id: 'trees',
    name: 'Trees',
    problems: [
      {
        id: 'invert-binary-tree', name: 'Invert Binary Tree', difficulty: 'easy', blind75: true,
      },
      {
        id: 'maximum-depth-of-binary-tree', name: 'Maximum Depth of Binary Tree', difficulty: 'easy', blind75: true,
      },
      {
        id: 'same-tree', name: 'Same Tree', difficulty: 'easy', blind75: true,
      },
      {
        id: 'subtree-of-another-tree', name: 'Subtree of Another Tree', difficulty: 'easy', blind75: true,
      },
      {
        id: 'lowest-common-ancestor-bst', name: 'Lowest Common Ancestor of a BST', difficulty: 'medium', blind75: true,
      },
      {
        id: 'binary-tree-level-order-traversal', name: 'Binary Tree Level Order Traversal', difficulty: 'medium', blind75: true,
      },
      {
        id: 'validate-binary-search-tree', name: 'Validate Binary Search Tree', difficulty: 'medium', blind75: true,
      },
      {
        id: 'kth-smallest-element-bst', name: 'Kth Smallest Element in a BST', difficulty: 'medium', blind75: true,
      },
      {
        id: 'construct-binary-tree-preorder-inorder', name: 'Construct Binary Tree from Preorder and Inorder Traversal', difficulty: 'medium', blind75: true,
      },
      {
        id: 'binary-tree-maximum-path-sum', name: 'Binary Tree Maximum Path Sum', difficulty: 'hard', blind75: true,
      },
      {
        id: 'serialize-and-deserialize-binary-tree', name: 'Serialize and Deserialize Binary Tree', difficulty: 'hard', blind75: true,
      },
      {
        id: 'diameter-of-binary-tree', name: 'Diameter of Binary Tree', difficulty: 'easy', blind75: false,
      },
      {
        id: 'balanced-binary-tree', name: 'Balanced Binary Tree', difficulty: 'easy', blind75: false,
      },
      {
        id: 'binary-tree-right-side-view', name: 'Binary Tree Right Side View', difficulty: 'medium', blind75: false,
      },
      {
        id: 'count-good-nodes', name: 'Count Good Nodes in Binary Tree', difficulty: 'medium', blind75: false,
      },
    ],
  },
  {
    id: 'tries',
    name: 'Tries',
    problems: [
      {
        id: 'implement-trie', name: 'Implement Trie (Prefix Tree)', difficulty: 'medium', blind75: true,
      },
      {
        id: 'design-add-search-words', name: 'Design Add and Search Words Data Structure', difficulty: 'medium', blind75: true,
      },
      {
        id: 'word-search-ii', name: 'Word Search II', difficulty: 'hard', blind75: true,
      },
    ],
  },
  {
    id: 'heap-priority-queue',
    name: 'Heap / Priority Queue',
    problems: [
      {
        id: 'find-median-from-data-stream', name: 'Find Median from Data Stream', difficulty: 'hard', blind75: true,
      },
      {
        id: 'kth-largest-element-in-stream', name: 'Kth Largest Element in a Stream', difficulty: 'easy', blind75: false,
      },
      {
        id: 'last-stone-weight', name: 'Last Stone Weight', difficulty: 'easy', blind75: false,
      },
      {
        id: 'k-closest-points-to-origin', name: 'K Closest Points to Origin', difficulty: 'medium', blind75: false,
      },
      {
        id: 'kth-largest-element-in-array', name: 'Kth Largest Element in an Array', difficulty: 'medium', blind75: false,
      },
      {
        id: 'task-scheduler', name: 'Task Scheduler', difficulty: 'medium', blind75: false,
      },
      {
        id: 'design-twitter', name: 'Design Twitter', difficulty: 'medium', blind75: false,
      },
    ],
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    problems: [
      {
        id: 'combination-sum', name: 'Combination Sum', difficulty: 'medium', blind75: true,
      },
      {
        id: 'word-search', name: 'Word Search', difficulty: 'medium', blind75: true,
      },
      {
        id: 'subsets', name: 'Subsets', difficulty: 'medium', blind75: false,
      },
      {
        id: 'permutations', name: 'Permutations', difficulty: 'medium', blind75: false,
      },
      {
        id: 'subsets-ii', name: 'Subsets II', difficulty: 'medium', blind75: false,
      },
      {
        id: 'combination-sum-ii', name: 'Combination Sum II', difficulty: 'medium', blind75: false,
      },
      {
        id: 'palindrome-partitioning', name: 'Palindrome Partitioning', difficulty: 'medium', blind75: false,
      },
      {
        id: 'letter-combinations-phone', name: 'Letter Combinations of a Phone Number', difficulty: 'medium', blind75: false,
      },
      {
        id: 'n-queens', name: 'N-Queens', difficulty: 'hard', blind75: false,
      },
    ],
  },
  {
    id: 'graphs',
    name: 'Graphs',
    problems: [
      {
        id: 'number-of-islands', name: 'Number of Islands', difficulty: 'medium', blind75: true,
      },
      {
        id: 'clone-graph', name: 'Clone Graph', difficulty: 'medium', blind75: true,
      },
      {
        id: 'pacific-atlantic-water-flow', name: 'Pacific Atlantic Water Flow', difficulty: 'medium', blind75: true,
      },
      {
        id: 'course-schedule', name: 'Course Schedule', difficulty: 'medium', blind75: true,
      },
      {
        id: 'number-connected-components', name: 'Number of Connected Components in an Undirected Graph', difficulty: 'medium', blind75: true,
      },
      {
        id: 'graph-valid-tree', name: 'Graph Valid Tree', difficulty: 'medium', blind75: true,
      },
      {
        id: 'max-area-of-island', name: 'Max Area of Island', difficulty: 'medium', blind75: false,
      },
      {
        id: 'surrounded-regions', name: 'Surrounded Regions', difficulty: 'medium', blind75: false,
      },
      {
        id: 'rotting-oranges', name: 'Rotting Oranges', difficulty: 'medium', blind75: false,
      },
      {
        id: 'walls-and-gates', name: 'Walls and Gates', difficulty: 'medium', blind75: false,
      },
      {
        id: 'course-schedule-ii', name: 'Course Schedule II', difficulty: 'medium', blind75: false,
      },
      {
        id: 'redundant-connection', name: 'Redundant Connection', difficulty: 'medium', blind75: false,
      },
      {
        id: 'word-ladder', name: 'Word Ladder', difficulty: 'hard', blind75: false,
      },
    ],
  },
  {
    id: 'advanced-graphs',
    name: 'Advanced Graphs',
    problems: [
      {
        id: 'alien-dictionary', name: 'Alien Dictionary', difficulty: 'hard', blind75: true,
      },
      {
        id: 'reconstruct-itinerary', name: 'Reconstruct Itinerary', difficulty: 'hard', blind75: false,
      },
      {
        id: 'min-cost-connect-all-points', name: 'Min Cost to Connect All Points', difficulty: 'medium', blind75: false,
      },
      {
        id: 'network-delay-time', name: 'Network Delay Time', difficulty: 'medium', blind75: false,
      },
      {
        id: 'swim-in-rising-water', name: 'Swim in Rising Water', difficulty: 'hard', blind75: false,
      },
      {
        id: 'cheapest-flights-within-k-stops', name: 'Cheapest Flights Within K Stops', difficulty: 'medium', blind75: false,
      },
    ],
  },
  {
    id: '1d-dynamic-programming',
    name: '1-D Dynamic Programming',
    problems: [
      {
        id: 'climbing-stairs', name: 'Climbing Stairs', difficulty: 'easy', blind75: true,
      },
      {
        id: 'house-robber', name: 'House Robber', difficulty: 'medium', blind75: true,
      },
      {
        id: 'house-robber-ii', name: 'House Robber II', difficulty: 'medium', blind75: true,
      },
      {
        id: 'longest-palindromic-substring', name: 'Longest Palindromic Substring', difficulty: 'medium', blind75: true,
      },
      {
        id: 'palindromic-substrings', name: 'Palindromic Substrings', difficulty: 'medium', blind75: true,
      },
      {
        id: 'decode-ways', name: 'Decode Ways', difficulty: 'medium', blind75: true,
      },
      {
        id: 'coin-change', name: 'Coin Change', difficulty: 'medium', blind75: true,
      },
      {
        id: 'maximum-product-subarray', name: 'Maximum Product Subarray', difficulty: 'medium', blind75: true,
      },
      {
        id: 'word-break', name: 'Word Break', difficulty: 'medium', blind75: true,
      },
      {
        id: 'longest-increasing-subsequence', name: 'Longest Increasing Subsequence', difficulty: 'medium', blind75: true,
      },
      {
        id: 'min-cost-climbing-stairs', name: 'Min Cost Climbing Stairs', difficulty: 'easy', blind75: false,
      },
      {
        id: 'partition-equal-subset-sum', name: 'Partition Equal Subset Sum', difficulty: 'medium', blind75: false,
      },
    ],
  },
  {
    id: '2d-dynamic-programming',
    name: '2-D Dynamic Programming',
    problems: [
      {
        id: 'unique-paths', name: 'Unique Paths', difficulty: 'medium', blind75: true,
      },
      {
        id: 'longest-common-subsequence', name: 'Longest Common Subsequence', difficulty: 'medium', blind75: true,
      },
      {
        id: 'best-time-buy-sell-cooldown', name: 'Best Time to Buy and Sell Stock with Cooldown', difficulty: 'medium', blind75: false,
      },
      {
        id: 'coin-change-ii', name: 'Coin Change II', difficulty: 'medium', blind75: false,
      },
      {
        id: 'target-sum', name: 'Target Sum', difficulty: 'medium', blind75: false,
      },
      {
        id: 'interleaving-string', name: 'Interleaving String', difficulty: 'medium', blind75: false,
      },
      {
        id: 'longest-increasing-path-matrix', name: 'Longest Increasing Path in a Matrix', difficulty: 'hard', blind75: false,
      },
      {
        id: 'distinct-subsequences', name: 'Distinct Subsequences', difficulty: 'hard', blind75: false,
      },
      {
        id: 'edit-distance', name: 'Edit Distance', difficulty: 'medium', blind75: false,
      },
      {
        id: 'burst-balloons', name: 'Burst Balloons', difficulty: 'hard', blind75: false,
      },
      {
        id: 'regular-expression-matching', name: 'Regular Expression Matching', difficulty: 'hard', blind75: false,
      },
    ],
  },
  {
    id: 'greedy',
    name: 'Greedy',
    problems: [
      {
        id: 'maximum-subarray', name: 'Maximum Subarray', difficulty: 'medium', blind75: true,
      },
      {
        id: 'jump-game', name: 'Jump Game', difficulty: 'medium', blind75: true,
      },
      {
        id: 'jump-game-ii', name: 'Jump Game II', difficulty: 'medium', blind75: false,
      },
      {
        id: 'gas-station', name: 'Gas Station', difficulty: 'medium', blind75: false,
      },
      {
        id: 'hand-of-straights', name: 'Hand of Straights', difficulty: 'medium', blind75: false,
      },
      {
        id: 'merge-triplets-target', name: 'Merge Triplets to Form Target Triplet', difficulty: 'medium', blind75: false,
      },
      {
        id: 'partition-labels', name: 'Partition Labels', difficulty: 'medium', blind75: false,
      },
      {
        id: 'valid-parenthesis-string', name: 'Valid Parenthesis String', difficulty: 'medium', blind75: false,
      },
    ],
  },
  {
    id: 'intervals',
    name: 'Intervals',
    problems: [
      {
        id: 'insert-interval', name: 'Insert Interval', difficulty: 'medium', blind75: true,
      },
      {
        id: 'merge-intervals', name: 'Merge Intervals', difficulty: 'medium', blind75: true,
      },
      {
        id: 'non-overlapping-intervals', name: 'Non-overlapping Intervals', difficulty: 'medium', blind75: true,
      },
      {
        id: 'meeting-rooms', name: 'Meeting Rooms', difficulty: 'easy', blind75: true,
      },
      {
        id: 'meeting-rooms-ii', name: 'Meeting Rooms II', difficulty: 'medium', blind75: true,
      },
      {
        id: 'minimum-interval-include-query', name: 'Minimum Interval to Include Each Query', difficulty: 'hard', blind75: false,
      },
    ],
  },
  {
    id: 'math-and-geometry',
    name: 'Math & Geometry',
    problems: [
      {
        id: 'rotate-image', name: 'Rotate Image', difficulty: 'medium', blind75: true,
      },
      {
        id: 'spiral-matrix', name: 'Spiral Matrix', difficulty: 'medium', blind75: true,
      },
      {
        id: 'set-matrix-zeroes', name: 'Set Matrix Zeroes', difficulty: 'medium', blind75: true,
      },
      {
        id: 'happy-number', name: 'Happy Number', difficulty: 'easy', blind75: false,
      },
      {
        id: 'plus-one', name: 'Plus One', difficulty: 'easy', blind75: false,
      },
      {
        id: 'pow-x-n', name: 'Pow(x, n)', difficulty: 'medium', blind75: false,
      },
      {
        id: 'multiply-strings', name: 'Multiply Strings', difficulty: 'medium', blind75: false,
      },
      {
        id: 'detect-squares', name: 'Detect Squares', difficulty: 'medium', blind75: false,
      },
    ],
  },
  {
    id: 'bit-manipulation',
    name: 'Bit Manipulation',
    problems: [
      {
        id: 'number-of-1-bits', name: 'Number of 1 Bits', difficulty: 'easy', blind75: true,
      },
      {
        id: 'counting-bits', name: 'Counting Bits', difficulty: 'easy', blind75: true,
      },
      {
        id: 'reverse-bits', name: 'Reverse Bits', difficulty: 'easy', blind75: true,
      },
      {
        id: 'missing-number', name: 'Missing Number', difficulty: 'easy', blind75: true,
      },
      {
        id: 'sum-of-two-integers', name: 'Sum of Two Integers', difficulty: 'medium', blind75: true,
      },
      {
        id: 'single-number', name: 'Single Number', difficulty: 'easy', blind75: false,
      },
      {
        id: 'reverse-integer', name: 'Reverse Integer', difficulty: 'medium', blind75: false,
      },
    ],
  },
];

// ============================================================
// DATA: SYSTEM DESIGN TOPICS
// ============================================================
export const SYSTEM_DESIGN_TOPICS = [
  {
    group: 'Core Systems',
    topics: [
      { id: 'sd-url-shortener', name: 'Design a URL Shortener (TinyURL)' },
      { id: 'sd-rate-limiter', name: 'Design a Rate Limiter' },
      { id: 'sd-key-value-store', name: 'Design a Key-Value Store' },
      { id: 'sd-unique-id-generator', name: 'Design a Unique ID Generator' },
      { id: 'sd-notification-system', name: 'Design a Notification System' },
      { id: 'sd-news-feed', name: 'Design a News Feed System' },
      { id: 'sd-chat-system', name: 'Design a Chat System (WhatsApp)' },
      { id: 'sd-search-autocomplete', name: 'Design a Search Autocomplete System' },
    ],
  },
  {
    group: 'Large-Scale Applications',
    topics: [
      { id: 'sd-youtube', name: 'Design YouTube / Netflix' },
      { id: 'sd-google-drive', name: 'Design Google Drive / Dropbox' },
      { id: 'sd-twitter', name: 'Design Twitter' },
      { id: 'sd-instagram', name: 'Design Instagram' },
      { id: 'sd-uber', name: 'Design Uber / Lyft' },
      { id: 'sd-ticketing', name: 'Design a Ticketing System (BookMyShow)' },
      { id: 'sd-ecommerce', name: 'Design an E-commerce Store (Amazon)' },
      { id: 'sd-google-maps', name: 'Design Google Maps' },
      { id: 'sd-web-crawler', name: 'Design a Web Crawler' },
      { id: 'sd-payment-system', name: 'Design a Payment System' },
    ],
  },
  {
    group: 'Fundamental Concepts',
    topics: [
      { id: 'sd-scaling', name: 'Scaling Basics (Vertical vs Horizontal)' },
      { id: 'sd-load-balancing', name: 'Load Balancing Strategies' },
      { id: 'sd-caching', name: 'Caching (Redis, Memcached, CDN)' },
      { id: 'sd-database-design', name: 'Database Design (SQL vs NoSQL)' },
      { id: 'sd-sharding', name: 'Database Sharding & Partitioning' },
      { id: 'sd-consistent-hashing', name: 'Consistent Hashing' },
      { id: 'sd-cap-theorem', name: 'CAP Theorem & Trade-offs' },
      { id: 'sd-message-queues', name: 'Message Queues (Kafka, RabbitMQ)' },
      { id: 'sd-microservices', name: 'Microservices vs Monolith' },
      { id: 'sd-api-design', name: 'API Design (REST, GraphQL, gRPC)' },
      { id: 'sd-auth', name: 'Authentication & Authorization (OAuth, JWT)' },
      { id: 'sd-monitoring', name: 'Logging, Monitoring & Alerting' },
    ],
  },
];
