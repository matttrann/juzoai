import React, { useState, useEffect, Suspense } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  Divider,
  CircularProgress,
  useTheme,
  Alert,
  Snackbar,
  Grid,
  AlertTitle,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import CodeIcon from '@mui/icons-material/Code';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';

interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

interface ProblemData {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: TestCase[];
  constraints: string[];
  starterCode: string;
  solution: string;
  hints: string[];
}

// Mock API call - In real app, this would call an actual backend
const fetchProblem = async (problemId: string): Promise<ProblemData> => {
  // This simulates a network request
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return the problem based on ID
  const problems: Record<string, ProblemData> = {
    'two-sum': {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      category: 'Arrays',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
        },
        {
          input: 'nums = [3,2,4], target = 6',
          output: '[1,2]'
        },
        {
          input: 'nums = [3,3], target = 6',
          output: '[0,1]'
        }
      ],
      constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
        'Only one valid answer exists.'
      ],
      starterCode: `def twoSum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Your code here
    `,
      solution: `def twoSum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    hash_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hash_map:
            return [hash_map[complement], i]
        hash_map[num] = i
    return []`,
      hints: [
        'A brute force approach would be to check every possible pair of numbers in the array.',
        'To optimize, consider using a hash table. What would you store in it?',
        'While iterating through the array, check if the complement (target - current number) exists in your hash table.'
      ]
    },
    'contains-duplicate': {
      id: 2,
      title: 'Contains Duplicate',
      difficulty: 'Easy',
      category: 'Arrays',
      description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
      examples: [
        {
          input: 'nums = [1,2,3,1]',
          output: 'true'
        },
        {
          input: 'nums = [1,2,3,4]',
          output: 'false'
        },
        {
          input: 'nums = [1,1,1,3,3,4,3,2,4,2]',
          output: 'true'
        }
      ],
      constraints: [
        '1 <= nums.length <= 10^5',
        '-10^9 <= nums[i] <= 10^9'
      ],
      starterCode: `def containsDuplicate(nums):
    """
    :type nums: List[int]
    :rtype: bool
    """
    # Your code here
    `,
      solution: `def containsDuplicate(nums):
    """
    :type nums: List[int]
    :rtype: bool
    """
    return len(nums) != len(set(nums))`,
      hints: [
        'Consider using a data structure that can help check for duplicates efficiently.',
        'Sets in Python only contain unique elements. How could you use this property?',
        'Compare the length of the original array with the length of a set containing the same elements.'
      ]
    },
    'valid-anagram': {
      id: 3,
      title: 'Valid Anagram',
      difficulty: 'Easy',
      category: 'Arrays & Hashing',
      description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
      examples: [
        {
          input: 's = "anagram", t = "nagaram"',
          output: 'true'
        },
        {
          input: 's = "rat", t = "car"',
          output: 'false'
        }
      ],
      constraints: [
        '1 <= s.length, t.length <= 5 * 10^4',
        's and t consist of lowercase English letters.'
      ],
      starterCode: `def isAnagram(s, t):
    """
    :type s: str
    :type t: str
    :rtype: bool
    """
    # Your code here
    `,
      solution: `def isAnagram(s, t):
    """
    :type s: str
    :type t: str
    :rtype: bool
    """
    if len(s) != len(t):
        return False
    
    # Solution 1: Using Counter
    from collections import Counter
    return Counter(s) == Counter(t)
    
    # Solution 2: Using sorting
    # return sorted(s) == sorted(t)
    
    # Solution 3: Using dictionary
    # char_count = {}
    # for char in s:
    #     char_count[char] = char_count.get(char, 0) + 1
    # for char in t:
    #     if char not in char_count or char_count[char] == 0:
    #         return False
    #     char_count[char] -= 1
    # return True`,
      hints: [
        'Could you solve it by sorting both strings?',
        'Consider using a hash table to count the frequency of each character.',
        'Two strings are anagrams if they have the same characters with the same frequencies.'
      ]
    },
    'valid-palindrome': {
      id: 10,
      title: 'Valid Palindrome',
      difficulty: 'Easy',
      category: 'Two Pointers',
      description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string s, return true if it is a palindrome, or false otherwise.',
      examples: [
        {
          input: 's = "A man, a plan, a canal: Panama"',
          output: 'true',
          explanation: '"amanaplanacanalpanama" is a palindrome.'
        },
        {
          input: 's = "race a car"',
          output: 'false',
          explanation: '"raceacar" is not a palindrome.'
        },
        {
          input: 's = " "',
          output: 'true',
          explanation: 's is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.'
        }
      ],
      constraints: [
        '1 <= s.length <= 2 * 10^5',
        's consists only of printable ASCII characters.'
      ],
      starterCode: `def isPalindrome(s):
    """
    :type s: str
    :rtype: bool
    """
    # Your code here
    `,
      solution: `def isPalindrome(s):
    """
    :type s: str
    :rtype: bool
    """
    # Clean the string by converting to lowercase and removing non-alphanumeric characters
    s = ''.join(c for c in s.lower() if c.isalnum())
    
    # Check if the cleaned string is a palindrome
    # Solution 1: Using two pointers
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True
    
    # Solution 2: Using string reversal
    # return s == s[::-1]`,
      hints: [
        'Start by cleaning the string - converting to lowercase and removing non-alphanumeric characters.',
        'Consider using two pointers: one starting from the beginning and one from the end.',
        'Another approach is to check if the cleaned string is equal to its reverse.'
      ]
    },
    'best-time-to-buy-sell-stock': {
      id: 15,
      title: 'Best Time to Buy and Sell Stock',
      difficulty: 'Easy',
      category: 'Sliding Window',
      description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
      examples: [
        {
          input: 'prices = [7,1,5,3,6,4]',
          output: '5',
          explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5. Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.'
        },
        {
          input: 'prices = [7,6,4,3,1]',
          output: '0',
          explanation: 'In this case, no transactions are done and the max profit = 0.'
        }
      ],
      constraints: [
        '1 <= prices.length <= 10^5',
        '0 <= prices[i] <= 10^4'
      ],
      starterCode: `def maxProfit(prices):
    """
    :type prices: List[int]
    :rtype: int
    """
    # Your code here
    `,
      solution: `def maxProfit(prices):
    """
    :type prices: List[int]
    :rtype: int
    """
    if not prices:
        return 0
    
    max_profit = 0
    min_price = float('inf')
    
    for price in prices:
        if price < min_price:
            min_price = price
        else:
            current_profit = price - min_price
            max_profit = max(max_profit, current_profit)
    
    return max_profit`,
      hints: [
        'The points of interest are the peaks and valleys in the given array.',
        'Try to find the smallest valley followed by the highest peak.',
        'You need to track the minimum price seen so far and the maximum profit that can be achieved.'
      ]
    },
    'binary-search': {
      id: 26,
      title: 'Binary Search',
      difficulty: 'Easy',
      category: 'Binary Search',
      description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.',
      examples: [
        {
          input: 'nums = [-1,0,3,5,9,12], target = 9',
          output: '4',
          explanation: '9 exists in nums and its index is 4'
        },
        {
          input: 'nums = [-1,0,3,5,9,12], target = 2',
          output: '-1',
          explanation: '2 does not exist in nums so return -1'
        }
      ],
      constraints: [
        '1 <= nums.length <= 10^4',
        '-10^4 < nums[i], target < 10^4',
        'All the integers in nums are unique.',
        'nums is sorted in ascending order.'
      ],
      starterCode: `def search(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: int
    """
    # Your code here
    `,
      solution: `def search(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: int
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        # Check if target is present at mid
        if nums[mid] == target:
            return mid
            
        # If target is greater, ignore left half
        elif nums[mid] < target:
            left = mid + 1
            
        # If target is smaller, ignore right half
        else:
            right = mid - 1
            
    # Element is not present
    return -1`,
      hints: [
        'Use a binary search approach since the array is sorted.',
        'Keep track of the left and right boundaries of the search space.',
        'Compare the middle element with the target value and adjust the search space accordingly.'
      ]
    },
    'valid-parentheses': {
      id: 19,
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      category: 'Stack',
      description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\n\nAn input string is valid if:\n\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
      examples: [
        {
          input: 's = "()"',
          output: 'true'
        },
        {
          input: 's = "()[]{}"',
          output: 'true'
        },
        {
          input: 's = "(]"',
          output: 'false'
        },
        {
          input: 's = "([)]"',
          output: 'false'
        },
        {
          input: 's = "{[]}"',
          output: 'true'
        }
      ],
      constraints: [
        '1 <= s.length <= 10^4',
        's consists of parentheses only \'()[]{}\''
      ],
      starterCode: `def isValid(s):
    """
    :type s: str
    :rtype: bool
    """
    # Your code here
    `,
      solution: `def isValid(s):
    """
    :type s: str
    :rtype: bool
    """
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    
    for char in s:
        # If the character is a closing bracket
        if char in mapping:
            # Pop the topmost element from the stack if it's not empty
            # Otherwise use a dummy value that won't match
            top_element = stack.pop() if stack else '#'
            
            # Check if this bracket matches the top element of the stack
            if mapping[char] != top_element:
                return False
        else:
            # If it's an opening bracket, push it onto the stack
            stack.append(char)
    
    # If the stack is empty, all brackets are matched
    return len(stack) == 0`,
      hints: [
        'Consider using a stack data structure.',
        'When you encounter an opening bracket, push it onto the stack.',
        'When you encounter a closing bracket, check if it matches the top element on the stack.',
        'The string is valid if all brackets are matched and the stack is empty at the end.'
      ]
    }
  };
  
  if (problemId in problems) {
    return problems[problemId];
  }
  
  // For unimplemented problems, throw a more specific error
  throw new Error(`This problem (${problemId}) is not yet implemented. Please try the 'two-sum', 'contains-duplicate', 'valid-anagram', 'valid-palindrome', 'best-time-to-buy-sell-stock', 'binary-search', or 'valid-parentheses' problems which are fully functional.`);
};

// Mock submission evaluator
const evaluateSubmission = async (code: string, problemId: string): Promise<{success: boolean; results: any[]; error?: string}> => {
  // Simulates a network request to a code execution API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Check if code is blank or too short to be valid
  const minimalCode = code.replace(/\s+/g, '').replace(/["';#]/g, '').trim();
  if (minimalCode.length < 10) {
    return {
      success: false,
      results: [
        {testCase: 'Basic test', expected: 'A valid solution', actual: 'Empty or minimal code submitted', passed: false}
      ],
      error: 'Your solution appears to be incomplete. Please implement a full solution before submitting.'
    };
  }
  
  // In a real app, this would send the code to a backend API for evaluation
  // Here we do a more thorough check against expected patterns and logic
  
  if (problemId === 'two-sum') {
    const hasLoop = code.includes('for') || code.includes('while');
    const hasReturn = code.includes('return');
    const hasHashMap = code.includes('hash_map') || code.includes('dict(') || code.includes('{}');
    
    if (hasLoop && hasReturn && hasHashMap) {
      return {
        success: true,
        results: [
          {testCase: 'nums = [2,7,11,15], target = 9', expected: '[0,1]', actual: '[0,1]', passed: true},
          {testCase: 'nums = [3,2,4], target = 6', expected: '[1,2]', actual: '[1,2]', passed: true},
          {testCase: 'nums = [3,3], target = 6', expected: '[0,1]', actual: '[0,1]', passed: true}
        ]
      };
    } else if (hasLoop && hasReturn) {
      return {
        success: false,
        results: [
          {testCase: 'nums = [2,7,11,15], target = 9', expected: '[0,1]', actual: '[0,1]', passed: true},
          {testCase: 'nums = [3,2,4], target = 6', expected: '[1,2]', actual: '[1,2]', passed: true},
          {testCase: 'nums = [3,3], target = 6', expected: '[0,1]', actual: 'TypeError: function took too long', passed: false}
        ],
        error: 'Your solution works for small inputs but might be inefficient for larger arrays. Consider using a hash map for O(n) time complexity.'
      };
    } else {
      return {
        success: false,
        results: [
          {testCase: 'nums = [2,7,11,15], target = 9', expected: '[0,1]', actual: 'Runtime Error: Missing return statement or improper implementation', passed: false},
          {testCase: 'nums = [3,2,4], target = 6', expected: '[1,2]', actual: 'Not executed due to previous error', passed: false},
          {testCase: 'nums = [3,3], target = 6', expected: '[0,1]', actual: 'Not executed due to previous error', passed: false}
        ],
        error: 'Your solution appears to be missing essential logic. Make sure you have proper iteration and return the correct result.'
      };
    }
  } else if (problemId === 'contains-duplicate') {
    const hasSets = code.includes('set(');
    const hasReturn = code.includes('return');
    const hasLoop = code.includes('for') || code.includes('while');
    
    if (hasReturn && (hasSets || hasLoop)) {
      if (hasSets) {
        return {
          success: true,
          results: [
            {testCase: 'nums = [1,2,3,1]', expected: 'true', actual: 'true', passed: true},
            {testCase: 'nums = [1,2,3,4]', expected: 'false', actual: 'false', passed: true},
            {testCase: 'nums = [1,1,1,3,3,4,3,2,4,2]', expected: 'true', actual: 'true', passed: true}
          ]
        };
      } else {
        return {
          success: false,
          results: [
            {testCase: 'nums = [1,2,3,1]', expected: 'true', actual: 'true', passed: true},
            {testCase: 'nums = [1,2,3,4]', expected: 'false', actual: 'false', passed: true},
            {testCase: 'nums = [1,1,1,3,3,4,3,2,4,2]', expected: 'true', actual: 'Runtime Error: Maximum recursion depth exceeded', passed: false}
          ],
          error: 'Your solution works for small inputs but might be inefficient for larger arrays. Consider using a set for O(n) time complexity.'
        };
      }
    } else {
      return {
        success: false,
        results: [
          {testCase: 'nums = [1,2,3,1]', expected: 'true', actual: 'Runtime Error: Missing return statement or improper comparison', passed: false},
          {testCase: 'nums = [1,2,3,4]', expected: 'false', actual: 'Not executed due to previous error', passed: false},
          {testCase: 'nums = [1,1,1,3,3,4,3,2,4,2]', expected: 'true', actual: 'Not executed due to previous error', passed: false}
        ],
        error: 'Your solution is missing essential logic. Ensure you are checking for duplicates and returning the correct boolean result.'
      };
    }
  } else if (problemId === 'valid-anagram') {
    const hasCounter = code.includes('Counter');
    const hasSorted = code.includes('sorted');
    const hasDict = code.includes('dict(') || code.includes('{}');
    const hasReturn = code.includes('return');
    const hasLoop = code.includes('for') || code.includes('while');
    
    if (hasReturn && (hasCounter || hasSorted || (hasDict && hasLoop))) {
      return {
        success: true,
        results: [
          {testCase: 's = "anagram", t = "nagaram"', expected: 'true', actual: 'true', passed: true},
          {testCase: 's = "rat", t = "car"', expected: 'false', actual: 'false', passed: true},
          {testCase: 's = "aacc", t = "ccac"', expected: 'false', actual: 'false', passed: true}
        ]
      };
    } else if (hasReturn && hasLoop) {
      return {
        success: false,
        results: [
          {testCase: 's = "anagram", t = "nagaram"', expected: 'true', actual: 'true', passed: true},
          {testCase: 's = "rat", t = "car"', expected: 'false', actual: 'false', passed: true},
          {testCase: 's = "aacc", t = "ccac"', expected: 'false', actual: 'RuntimeError: Time limit exceeded', passed: false}
        ],
        error: 'Your solution works for simple cases but might be inefficient. Consider using a Counter, sorting, or a dictionary to track character frequencies.'
      };
    } else {
      return {
        success: false,
        results: [
          {testCase: 's = "anagram", t = "nagaram"', expected: 'true', actual: 'Runtime Error: Incomplete implementation', passed: false},
          {testCase: 's = "rat", t = "car"', expected: 'false', actual: 'Not executed due to previous error', passed: false},
          {testCase: 's = "aacc", t = "ccac"', expected: 'false', actual: 'Not executed due to previous error', passed: false}
        ],
        error: 'Your solution is missing essential logic for comparing anagrams. Make sure you have proper character frequency comparison.'
      };
    }
  } else if (problemId === 'valid-palindrome') {
    const hasCleanup = code.includes('isalnum()') || (code.includes('lower()') && (code.includes('for') || code.includes('while')));
    const hasComparison = code.includes('==') || code.includes('!=') || code.includes('[::-1]') || (code.includes('while') && code.includes('left') && code.includes('right'));
    const hasReturn = code.includes('return');
    
    if (hasCleanup && hasComparison && hasReturn) {
      return {
        success: true,
        results: [
          {testCase: 's = "A man, a plan, a canal: Panama"', expected: 'true', actual: 'true', passed: true},
          {testCase: 's = "race a car"', expected: 'false', actual: 'false', passed: true},
          {testCase: 's = " "', expected: 'true', actual: 'true', passed: true}
        ]
      };
    } else if (hasReturn && (hasCleanup || hasComparison)) {
      return {
        success: false,
        results: [
          {testCase: 's = "A man, a plan, a canal: Panama"', expected: 'true', actual: 'true', passed: true},
          {testCase: 's = "race a car"', expected: 'false', actual: 'false', passed: true},
          {testCase: 's = "0P"', expected: 'false', actual: 'true', passed: false}
        ],
        error: 'Your solution may have issues with special cases. Make sure to properly handle non-alphanumeric characters and use proper comparison techniques.'
      };
    } else {
      return {
        success: false,
        results: [
          {testCase: 's = "A man, a plan, a canal: Panama"', expected: 'true', actual: 'Runtime Error: Incomplete implementation', passed: false},
          {testCase: 's = "race a car"', expected: 'false', actual: 'Not executed due to previous error', passed: false},
          {testCase: 's = " "', expected: 'true', actual: 'Not executed due to previous error', passed: false}
        ],
        error: 'Your solution is missing essential steps for checking palindromes. Make sure to clean the string and check if it reads the same forward and backward.'
      };
    }
  } else if (problemId === 'best-time-to-buy-sell-stock') {
    const hasTracking = code.includes('min_price') || (code.includes('min') && code.includes('price'));
    const hasProfit = code.includes('max_profit') || (code.includes('max') && code.includes('profit'));
    const hasLoop = code.includes('for') || code.includes('while');
    const hasReturn = code.includes('return');
    
    if (hasTracking && hasProfit && hasLoop && hasReturn) {
      return {
        success: true,
        results: [
          {testCase: 'prices = [7,1,5,3,6,4]', expected: '5', actual: '5', passed: true},
          {testCase: 'prices = [7,6,4,3,1]', expected: '0', actual: '0', passed: true},
          {testCase: 'prices = [2,4,1]', expected: '2', actual: '2', passed: true}
        ]
      };
    } else if (hasLoop && hasReturn) {
      return {
        success: false,
        results: [
          {testCase: 'prices = [7,1,5,3,6,4]', expected: '5', actual: '5', passed: true},
          {testCase: 'prices = [7,6,4,3,1]', expected: '0', actual: '0', passed: true},
          {testCase: 'prices = [2,4,1,3]', expected: '2', actual: '1', passed: false}
        ],
        error: 'Your solution works for some cases but may not be optimal. Consider tracking both the minimum price seen so far and the maximum profit.'
      };
    } else {
      return {
        success: false,
        results: [
          {testCase: 'prices = [7,1,5,3,6,4]', expected: '5', actual: 'Runtime Error: Incomplete implementation', passed: false},
          {testCase: 'prices = [7,6,4,3,1]', expected: '0', actual: 'Not executed due to previous error', passed: false},
          {testCase: 'prices = [2,4,1]', expected: '2', actual: 'Not executed due to previous error', passed: false}
        ],
        error: 'Your solution is missing essential logic for tracking stock prices and profit. Make sure to properly track the minimum price and calculate maximum profit.'
      };
    }
  } else if (problemId === 'binary-search') {
    const hasBounds = (code.includes('left') && code.includes('right')) || (code.includes('low') && code.includes('high'));
    const hasMid = code.includes('mid');
    const hasLoop = code.includes('while');
    const hasReturn = code.includes('return');
    
    if (hasBounds && hasMid && hasLoop && hasReturn) {
      return {
        success: true,
        results: [
          {testCase: 'nums = [-1,0,3,5,9,12], target = 9', expected: '4', actual: '4', passed: true},
          {testCase: 'nums = [-1,0,3,5,9,12], target = 2', expected: '-1', actual: '-1', passed: true},
          {testCase: 'nums = [5], target = 5', expected: '0', actual: '0', passed: true}
        ]
      };
    } else if (hasLoop && hasReturn) {
      return {
        success: false,
        results: [
          {testCase: 'nums = [-1,0,3,5,9,12], target = 9', expected: '4', actual: '4', passed: true},
          {testCase: 'nums = [-1,0,3,5,9,12], target = 2', expected: '-1', actual: '-1', passed: true},
          {testCase: 'nums = [1,2,3,4,5,6,7,8,9,10], target = 10', expected: '9', actual: 'Time Limit Exceeded', passed: false}
        ],
        error: 'Your solution has O(n) time complexity. For large arrays, binary search with O(log n) complexity is required.'
      };
    } else {
      return {
        success: false,
        results: [
          {testCase: 'nums = [-1,0,3,5,9,12], target = 9', expected: '4', actual: 'Runtime Error: Incomplete implementation', passed: false},
          {testCase: 'nums = [-1,0,3,5,9,12], target = 2', expected: '-1', actual: 'Not executed due to previous error', passed: false},
          {testCase: 'nums = [5], target = 5', expected: '0', actual: 'Not executed due to previous error', passed: false}
        ],
        error: 'Your solution is missing essential components of binary search. Make sure to have proper left/right bounds, midpoint calculation, and comparison logic.'
      };
    }
  } else if (problemId === 'valid-parentheses') {
    const hasStack = code.includes('stack') || code.includes('[]') || code.includes('list()');
    const hasBracketChecking = code.includes('(') && code.includes(')') && code.includes('[') && code.includes(']') && code.includes('{') && code.includes('}');
    const hasLoop = code.includes('for') || code.includes('while');
    const hasReturn = code.includes('return');
    
    if (hasStack && hasBracketChecking && hasLoop && hasReturn) {
      return {
        success: true,
        results: [
          {testCase: 's = "()"', expected: 'true', actual: 'true', passed: true},
          {testCase: 's = "()[]{}"', expected: 'true', actual: 'true', passed: true},
          {testCase: 's = "(]"', expected: 'false', actual: 'false', passed: true},
          {testCase: 's = "([)]"', expected: 'false', actual: 'false', passed: true},
          {testCase: 's = "{[]}"', expected: 'true', actual: 'true', passed: true}
        ]
      };
    } else if (hasLoop && hasReturn) {
      return {
        success: false,
        results: [
          {testCase: 's = "()"', expected: 'true', actual: 'true', passed: true},
          {testCase: 's = "()[]{}"', expected: 'true', actual: 'true', passed: true},
          {testCase: 's = "(]"', expected: 'false', actual: 'false', passed: true},
          {testCase: 's = "([)]"', expected: 'false', actual: 'true', passed: false},
          {testCase: 's = "{[]}"', expected: 'true', actual: 'true', passed: true}
        ],
        error: 'Your solution may not correctly handle all cases. Consider using a stack data structure to track opening brackets and match them with closing brackets.'
      };
    } else {
      return {
        success: false,
        results: [
          {testCase: 's = "()"', expected: 'true', actual: 'Runtime Error: Incomplete implementation', passed: false},
          {testCase: 's = "()[]{}"', expected: 'true', actual: 'Not executed due to previous error', passed: false},
          {testCase: 's = "(]"', expected: 'false', actual: 'Not executed due to previous error', passed: false},
          {testCase: 's = "([)]"', expected: 'false', actual: 'Not executed due to previous error', passed: false},
          {testCase: 's = "{[]}"', expected: 'true', actual: 'Not executed due to previous error', passed: false}
        ],
        error: 'Your solution is missing essential components for checking valid parentheses. Make sure to use a stack to track opening brackets and match them with closing brackets.'
      };
    }
  }
  
  return {
    success: false,
    results: [],
    error: 'Failed to evaluate submission'
  };
};

// Declare the CodeEditor component type
let CodeEditor: any = null;

const ProblemDetail: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [submissionResults, setSubmissionResults] = useState<any | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [codeIsValid, setCodeIsValid] = useState(false);
  const [showInfoBox, setShowInfoBox] = useState(true);
  
  // Load the code editor component
  useEffect(() => {
    const loadEditor = async () => {
      try {
        // Dynamic import
        const editor = await import('@uiw/react-textarea-code-editor');
        CodeEditor = editor.default;
        setEditorLoaded(true);
      } catch (error) {
        console.error('Failed to load code editor:', error);
      }
    };
    
    loadEditor();
  }, []);
  
  useEffect(() => {
    const loadProblem = async () => {
      try {
        if (!problemId) {
          setError('Problem ID is required');
          setLoading(false);
          return;
        }
        
        const problemData = await fetchProblem(problemId);
        setProblem(problemData);
        setCode(problemData.starterCode);
        setLoading(false);
      } catch (err) {
        console.error('Error loading problem:', err);
        setError('Failed to load problem details');
        setLoading(false);
      }
    };
    
    loadProblem();
  }, [problemId]);
  
  // Validate code whenever it changes
  useEffect(() => {
    const minimalCode = code.replace(/\s+/g, '').replace(/["';#]/g, '').trim();
    setCodeIsValid(minimalCode.length >= 10);
  }, [code]);
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };
  
  const handleSubmit = async () => {
    if (!problemId) return;
    
    // Additional validation check before submission
    const minimalCode = code.replace(/\s+/g, '').replace(/["';#]/g, '').trim();
    if (minimalCode.length < 10) {
      setSnackbar({
        open: true,
        message: 'Your solution appears to be incomplete. Please write more code before submitting.',
        severity: 'warning'
      });
      return;
    }
    
    setSubmitting(true);
    setSubmissionResults(null);
    
    try {
      const results = await evaluateSubmission(code, problemId);
      setSubmissionResults(results);
      
      setSnackbar({
        open: true,
        message: results.success 
          ? 'All test cases passed! Great job!' 
          : 'Some test cases failed. Check the results below.',
        severity: results.success ? 'success' : 'error'
      });
    } catch (err) {
      console.error('Error submitting solution:', err);
      setSnackbar({
        open: true,
        message: 'Failed to evaluate solution',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  const handleResetCode = () => {
    if (problem) {
      setCode(problem.starterCode);
      setSnackbar({
        open: true,
        message: 'Code reset to starter template',
        severity: 'info'
      });
    }
  };
  
  const handleCloseInfoBox = () => {
    setShowInfoBox(false);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (error || !problem) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" color="error" gutterBottom>
            {error || 'Problem not found'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Please try one of our implemented problems instead.
          </Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/problems')}
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Back to Problems
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/problems')}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        Back to Problems
      </Button>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {problem.title}
        </Typography>
        <Chip 
          label={problem.difficulty} 
          size="medium"
          sx={{ 
            ml: 2,
            bgcolor: problem.difficulty === 'Easy' 
              ? '#00b8a3' 
              : problem.difficulty === 'Medium' 
                ? '#ffc01e' 
                : '#ff375f',
            color: 'white',
            fontWeight: 'bold'
          }}
        />
        <Chip 
          label={problem.category}
          variant="outlined"
          size="small"
          sx={{ ml: 1 }}
        />
      </Box>
      
      <Grid component="div" container spacing={2}>
        <Grid component="div" sx={{ gridColumn: {xs: 'span 12', md: 'span 6'} }}>
          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Problem Description
            </Typography>
            <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
              {problem.description}
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Examples:
            </Typography>
            {problem.examples.map((example, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, bgcolor: theme.palette.action.hover, borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
                  <strong>Input:</strong> {example.input}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: example.explanation ? 1 : 0 }}>
                  <strong>Output:</strong> {example.output}
                </Typography>
                {example.explanation && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                    <strong>Explanation:</strong> {example.explanation}
                  </Typography>
                )}
              </Box>
            ))}
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Constraints:
            </Typography>
            <ul style={{ paddingLeft: '20px', marginTop: 0 }}>
              {problem.constraints.map((constraint, index) => (
                <li key={index}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {constraint}
                  </Typography>
                </li>
              ))}
            </ul>
            
            {problem.hints.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Button 
                  variant="text" 
                  color="primary"
                  startIcon={<InfoIcon />}
                  onClick={() => setShowHints(!showHints)}
                >
                  {showHints ? 'Hide Hints' : 'Show Hints'}
                </Button>
                
                {showHints && (
                  <Box sx={{ mt: 1, p: 2, bgcolor: theme.palette.background.default, borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Hints:
                    </Typography>
                    <ol style={{ paddingLeft: '20px', marginTop: 0 }}>
                      {problem.hints.map((hint, index) => (
                        <li key={index}>
                          <Typography variant="body2">
                            {hint}
                          </Typography>
                        </li>
                      ))}
                    </ol>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
          
          {submissionResults && (
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Test Results:
              </Typography>
              
              {submissionResults.results.map((result: any, index: number) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    bgcolor: result.passed ? 'rgba(76, 175, 80, 0.08)' : 'rgba(244, 67, 54, 0.08)', 
                    borderRadius: 1,
                    border: `1px solid ${result.passed ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {result.passed ? (
                      <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                    ) : (
                      <ErrorIcon color="error" fontSize="small" sx={{ mr: 1 }} />
                    )}
                    <Typography variant="subtitle2">
                      Test Case {index + 1}: {result.passed ? 'Passed' : 'Failed'}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 1 }}>
                    <strong>Input:</strong> {result.testCase}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    <strong>Expected:</strong> {result.expected}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    <strong>Actual:</strong> {result.actual}
                  </Typography>
                </Box>
              ))}
              
              {submissionResults.error && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  {submissionResults.error}
                </Alert>
              )}
            </Paper>
          )}
        </Grid>
        
        <Grid component="div" sx={{ gridColumn: {xs: 'span 12', md: 'span 6'} }}>
          <Paper elevation={1} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6">
                <CodeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Python Solution
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Write your solution in Python 3
              </Typography>
              {showInfoBox && (
                <Alert 
                  severity="info" 
                  variant="outlined" 
                  sx={{ mt: 1, fontSize: '0.75rem' }}
                  onClose={handleCloseInfoBox}
                >
                  <strong>How evaluation works:</strong> Your code will be checked for core algorithmic components and problem-specific logic. Empty or minimal solutions will not pass tests.
                </Alert>
              )}
            </Box>
            
            <Box sx={{ flexGrow: 1, p: 0, position: 'relative' }}>
              {editorLoaded && CodeEditor ? (
                <CodeEditor
                  value={code}
                  language="python"
                  placeholder="Write your Python solution here..."
                  onChange={handleCodeChange}
                  padding={15}
                  style={{
                    fontSize: 14,
                    fontFamily: 'monospace',
                    minHeight: '400px',
                    height: '100%',
                    backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                  }}
                  data-testid="code-editor"
                />
              ) : (
                <textarea
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="Write your Python solution here..."
                  style={{
                    width: '100%',
                    minHeight: '400px',
                    height: '100%',
                    fontSize: 14,
                    fontFamily: 'monospace',
                    backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    color: theme.palette.text.primary,
                    padding: '15px',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              )}
              
              {!codeIsValid && code.trim() !== '' && (
                <Typography 
                  variant="caption" 
                  color="warning.main" 
                  sx={{ 
                    display: 'block',
                    p: 1,
                    bgcolor: 'warning.light',
                    color: 'warning.dark',
                    opacity: 0.9,
                    borderBottomLeftRadius: 4,
                    borderBottomRightRadius: 4
                  }}
                >
                  Your solution appears to be incomplete. Please write a complete solution before submitting.
                </Typography>
              )}
            </Box>
            
            <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={handleResetCode}
                disabled={submitting}
              >
                Reset Code
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
                onClick={handleSubmit}
                disabled={submitting || !codeIsValid}
                title={!codeIsValid ? "Please write a valid solution before submitting" : ""}
              >
                {submitting ? 'Running...' : 'Submit Solution'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProblemDetail; 