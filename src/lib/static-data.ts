export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface Snippet {
  _id: string;
  title: string;
  description: string;
  code: string;
  programmingLanguage: string;
  topics: string[];
  authorId: string;
  createdAt: string;
  updatedAt: string;
  complexity?: string;
  isPublic?: boolean;
}
export const users: User[] = [
  {
    id: "1",
    name: "Alex Chen",
    username: "alexchen",
    email: "alex@example.com",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    username: "sarahj",
    email: "sarah@example.com",
  },
  {
    id: "3",
    name: "Miguel Rodriguez",
    username: "miguelr",
    email: "miguel@example.com",
  },
];

export const snippets: Snippet[] = [
  {
    _id: "1",
    title: "Binary Search Implementation",
    description: "Classic binary search algorithm with TypeScript",
    code: `function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
    programmingLanguage: "TypeScript",
    topics: ["algorithms", "search", "arrays"],
    authorId: "1",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-15T10:30:00Z",
    complexity: "O(log n)",
  },
  {
    _id: "2",
    title: "React Custom Hook - useLocalStorage",
    description:
      "A custom React hook for managing localStorage with TypeScript",
    code: `import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}`,
    programmingLanguage: "TypeScript",
    topics: ["react", "hooks", "localStorage"],
    authorId: "2",
    createdAt: "2025-01-20T14:20:00Z",
    updatedAt: "2025-01-20T14:20:00Z",
    complexity: "O(1)",
  },
  {
    _id: "3",
    title: "QuickSort Algorithm",
    description: "Efficient sorting algorithm using divide and conquer",
    code: `function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}`,
    programmingLanguage: "TypeScript",
    topics: ["algorithms", "sorting", "recursion"],
    authorId: "1",
    createdAt: "2025-01-18T09:15:00Z",
    updatedAt: "2025-01-18T09:15:00Z",
    complexity: "O(n log n)",
  },
  {
    _id: "4",
    title: "Debounce Function",
    description: "Generic debounce utility for optimizing performance",
    code: `function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`,
    programmingLanguage: "TypeScript",
    topics: ["utilities", "performance", "javascript"],
    authorId: "3",
    createdAt: "2025-01-22T16:45:00Z",
    updatedAt: "2025-01-22T16:45:00Z",
    complexity: "O(1)",
  },
  {
    _id: "5",
    title: "API Fetch with Retry",
    description: "Fetch wrapper with automatic retry logic",
    code: `async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}`,
    programmingLanguage: "TypeScript",
    topics: ["api", "utilities", "async"],
    authorId: "2",
    createdAt: "2025-01-25T11:00:00Z",
    updatedAt: "2025-01-25T11:00:00Z",
    complexity: "O(n)",
  },
];

export const languages = [
  "all",
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Rust",
  "Java",
];
export const allTags = [
  "all",
  "algorithms",
  "search",
  "arrays",
  "react",
  "hooks",
  "localStorage",
  "sorting",
  "recursion",
  "utilities",
  "performance",
  "javascript",
  "api",
  "async",
];
