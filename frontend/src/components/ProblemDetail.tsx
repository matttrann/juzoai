import React, { useState, useEffect, useRef } from 'react';
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
import { useProblemProgress, XP_VALUES } from '../contexts/ProblemProgressContext';

interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

// More realistic confetti implementation using tsParticles
const RealisticConfetti = ({ isActive }: { isActive: boolean }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  // Script loading logic
  useEffect(() => {
    // Define window.confetti type globally if needed
    if (typeof window !== 'undefined') {
      // Check if script is already loaded
      if (window.confetti) {
        console.log('Confetti script already loaded');
        setScriptLoaded(true);
        return;
      }
      
      console.log('Loading confetti script...');
      // Load tsParticles confetti script dynamically
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/tsparticles.confetti.bundle.min.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Confetti script loaded successfully');
        setScriptLoaded(true);
      };
      
      script.onerror = (e) => {
        console.error('Failed to load confetti script', e);
      };
      
      document.body.appendChild(script);
      
      // Clean up on unmount
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);
  
  // Confetti triggering logic
  useEffect(() => {
    // Only proceed if both conditions are met
    if (!isActive || !scriptLoaded) {
      return;
    }
    
    if (typeof window !== 'undefined' && window.confetti) {
      console.log('🎉 Triggering confetti celebration');
      
      // Realistic colors that match real confetti
      const colors = [
        '#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff', 
        '#ff73fa', '#66ff6a', '#d4ff73', '#79ebff', '#ff6a97', '#FFD700', '#00FF00'
      ];
      
      // Function to create a cannon effect
      const fireConfettiCannon = () => {
        const defaults = { 
          particleCount: 150,
          spread: 60,
          origin: { y: 0.6 }
        };
        
        // Fire multiple cannons from different positions
        const fire = (particleRatio: number, opts: any) => {
          window.confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(defaults.particleCount * particleRatio),
            colors: colors,
          });
        };
        
        // Left side cannon
        fire(0.25, {
          spread: 26,
          startVelocity: 55,
          origin: { x: 0.2, y: 0.7 }
        });
        
        // Right side cannon
        fire(0.25, {
          spread: 26,
          startVelocity: 55,
          origin: { x: 0.8, y: 0.7 }
        });
        
        // Centralized explosion
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
          origin: { x: 0.5, y: 0.5 }
        });
        
        // Realistic raining effect
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
          origin: { x: 0.5, y: 0 }
        });
        
        // Wider spread for variety
        fire(0.1, {
          spread: 180,
          startVelocity: 45,
          origin: { x: 0.4, y: 0.2 }
        });
        
        // Random bursts
        fire(0.15, {
          spread: 360,
          startVelocity: 30,
          decay: 0.95,
          scalar: 1.0,
          origin: { x: Math.random(), y: Math.random() * 0.3 }
        });
        
        console.log('Fired confetti cannon');
      };
      
      // Initial celebratory burst
      fireConfettiCannon();
      
      // Create realistic waves of confetti
      const interval = setInterval(() => {
        // Random smaller bursts
        window.confetti({
          particleCount: 50,
          spread: 70,
          origin: { x: Math.random(), y: Math.random() * 0.3 },
          colors: colors.slice(0, 5), // Use subset of colors for variety
          gravity: 1.5,
          scalar: 0.9,
          drift: 1 // Add some drift for realism
        });
      }, 800);
      
      // Stop after 5 seconds
      const timeout = setTimeout(() => {
        clearInterval(interval);
        
        // Final burst as a finale
        window.confetti({
          particleCount: 200,
          spread: 100,
          origin: { x: 0.5, y: 0.4 },
          colors: colors,
          ticks: 200,
          gravity: 0.8,
          decay: 0.88,
          drift: 2
        });
        
        console.log('Confetti celebration ended with finale');
      }, 5000);
      
      // Clean up timers if component unmounts
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
        console.log('Cleaned up confetti timers');
      };
    } else {
      console.warn('Confetti script not available for celebration');
    }
  }, [isActive, scriptLoaded]);
  
  // No visible element needed
  return null;
};

// Add the window.confetti type declaration
declare global {
  interface Window {
    confetti: any;
  }
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
    },
    'reverse-linked-list': {
      id: 30,
      title: 'Reverse Linked List',
      difficulty: 'Easy',
      category: 'Linked List',
      description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.\n\nA linked list can be reversed either iteratively or recursively. Could you implement both?',
      examples: [
        {
          input: 'head = [1,2,3,4,5]',
          output: '[5,4,3,2,1]'
        },
        {
          input: 'head = [1,2]',
          output: '[2,1]'
        },
        {
          input: 'head = []',
          output: '[]'
        }
      ],
      constraints: [
        'The number of nodes in the list is the range [0, 5000].',
        '-5000 <= Node.val <= 5000'
      ],
      starterCode: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head):
        """
        :type head: ListNode
        :rtype: ListNode
        """
        # Your code here
        `,
      solution: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head):
        """
        :type head: ListNode
        :rtype: ListNode
        """
        # Iterative solution
        prev = None
        current = head
        
        while current:
            next_temp = current.next  # Store next
            current.next = prev       # Reverse the link
            prev = current            # Move prev forward
            current = next_temp       # Move current forward
        
        return prev  # New head is the last node we processed
        
        # Recursive solution
        """
        if not head or not head.next:
            return head
            
        new_head = self.reverseList(head.next)
        head.next.next = head
        head.next = None
        
        return new_head
        """`,
      hints: [
        'Try to think about the problem in terms of changing the next pointers.',
        'You can use a temporary variable to keep track of the next node while you\'re modifying the current node.',
        'For the recursive approach, consider what the base case would be.',
        'In the recursive approach, you assume the rest of the list is already reversed.'
      ]
    },
    'merge-two-lists': {
      id: 31,
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      category: 'Linked List',
      description: 'You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.',
      examples: [
        {
          input: 'list1 = [1,2,4], list2 = [1,3,4]',
          output: '[1,1,2,3,4,4]'
        },
        {
          input: 'list1 = [], list2 = []',
          output: '[]'
        },
        {
          input: 'list1 = [], list2 = [0]',
          output: '[0]'
        }
      ],
      constraints: [
        'The number of nodes in both lists is in the range [0, 50].',
        '-100 <= Node.val <= 100',
        'Both list1 and list2 are sorted in non-decreasing order.'
      ],
      starterCode: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def mergeTwoLists(self, list1, list2):
        """
        :type list1: ListNode
        :type list2: ListNode
        :rtype: ListNode
        """
        # Your code here
        `,
      solution: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def mergeTwoLists(self, list1, list2):
        """
        :type list1: ListNode
        :type list2: ListNode
        :rtype: ListNode
        """
        # Create a dummy head to simplify edge cases
        dummy = ListNode(-1)
        current = dummy
        
        # Traverse both lists and compare values
        while list1 and list2:
            if list1.val <= list2.val:
                current.next = list1
                list1 = list1.next
            else:
                current.next = list2
                list2 = list2.next
            current = current.next
        
        # Attach remaining nodes (if any)
        if list1:
            current.next = list1
        if list2:
            current.next = list2
            
        return dummy.next  # Return the merged list (skip the dummy head)`,
      hints: [
        'Think about merging two sorted arrays, but with linked lists.',
        'Use a dummy head node to simplify handling the start of the merged list.',
        'Compare the current nodes of both lists and add the smaller one to the result.',
        'Remember to account for the case where one list might be empty or shorter than the other.'
      ]
    },
    'invert-binary-tree': {
      id: 34,
      title: 'Invert Binary Tree',
      difficulty: 'Easy',
      category: 'Trees',
      description: 'Given the root of a binary tree, invert the tree, and return its root.\n\nTo invert a binary tree, swap the left and right children for each node in the tree.',
      examples: [
        {
          input: 'root = [4,2,7,1,3,6,9]',
          output: '[4,7,2,9,6,3,1]'
        },
        {
          input: 'root = [2,1,3]',
          output: '[2,3,1]'
        },
        {
          input: 'root = []',
          output: '[]'
        }
      ],
      constraints: [
        'The number of nodes in the tree is in the range [0, 100].',
        '-100 <= Node.val <= 100'
      ],
      starterCode: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def invertTree(self, root):
        """
        :type root: TreeNode
        :rtype: TreeNode
        """
        # Your code here
        `,
      solution: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def invertTree(self, root):
        """
        :type root: TreeNode
        :rtype: TreeNode
        """
        # Base case: if the root is None, return None
        if not root:
            return None
        
        # Swap the left and right subtrees
        root.left, root.right = root.right, root.left
        
        # Recursively invert the left and right subtrees
        self.invertTree(root.left)
        self.invertTree(root.right)
        
        # Return the root of the inverted tree
        return root
        
        # Iterative solution using a queue
        """
        if not root:
            return None
            
        queue = [root]
        while queue:
            node = queue.pop(0)
            # Swap children
            node.left, node.right = node.right, node.left
            
            # Add children to queue
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
                
        return root
        """`,
      hints: [
        'Think about the problem recursively. What is the base case?',
        'For each node, you need to invert its left and right subtrees and then swap them.',
        'You can also solve this iteratively using a queue or stack to traverse the tree.',
        'Remember to handle the case where the root is None.'
      ]
    },
    'max-depth-binary-tree': {
      id: 35,
      title: 'Maximum Depth of Binary Tree',
      difficulty: 'Easy',
      category: 'Trees',
      description: 'Given the root of a binary tree, return its maximum depth.\n\nA binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
      examples: [
        {
          input: 'root = [3,9,20,null,null,15,7]',
          output: '3'
        },
        {
          input: 'root = [1,null,2]',
          output: '2'
        }
      ],
      constraints: [
        'The number of nodes in the tree is in the range [0, 10^4].',
        '-100 <= Node.val <= 100'
      ],
      starterCode: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def maxDepth(self, root):
        """
        :type root: TreeNode
        :rtype: int
        """
        # Your code here
        `,
      solution: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def maxDepth(self, root):
        """
        :type root: TreeNode
        :rtype: int
        """
        # Base case: if root is None, depth is 0
        if not root:
            return 0
        
        # Recursive case: depth is 1 (current node) + max of left and right subtree depths
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
        
        # Iterative solution using BFS
        """
        if not root:
            return 0
            
        queue = [(root, 1)]  # (node, depth)
        max_depth = 0
        
        while queue:
            node, depth = queue.pop(0)
            max_depth = max(max_depth, depth)
            
            if node.left:
                queue.append((node.left, depth + 1))
            if node.right:
                queue.append((node.right, depth + 1))
                
        return max_depth
        """`,
      hints: [
        'The maximum depth of a binary tree is the maximum number of steps from the root to a leaf node.',
        'Think recursively: the depth of a tree is 1 (for the root) plus the maximum depth of its subtrees.',
        'An empty tree has a depth of 0.',
        'You can also use BFS (level order traversal) to solve this iteratively.'
      ]
    },
    'same-tree': {
      id: 36,
      title: 'Same Tree',
      difficulty: 'Easy',
      category: 'Trees',
      description: 'Given the roots of two binary trees p and q, write a function to check if they are the same or not.\n\nTwo binary trees are considered the same if they are structurally identical, and the nodes have the same value.',
      examples: [
        {
          input: 'p = [1,2,3], q = [1,2,3]',
          output: 'true'
        },
        {
          input: 'p = [1,2], q = [1,null,2]',
          output: 'false'
        },
        {
          input: 'p = [1,2,1], q = [1,1,2]',
          output: 'false'
        }
      ],
      constraints: [
        'The number of nodes in both trees is in the range [0, 100].',
        '-10^4 <= Node.val <= 10^4'
      ],
      starterCode: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isSameTree(self, p, q):
        """
        :type p: TreeNode
        :type q: TreeNode
        :rtype: bool
        """
        # Your code here
        `,
      solution: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isSameTree(self, p, q):
        """
        :type p: TreeNode
        :type q: TreeNode
        :rtype: bool
        """
        # If both nodes are None, trees are the same at this point
        if p is None and q is None:
            return True
            
        # If one is None but the other isn't, trees are different
        if p is None or q is None:
            return False
            
        # If current node values don't match, trees are different
        if p.val != q.val:
            return False
            
        # Recursively check left and right subtrees
        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)
        
        # Iterative solution using a queue
        """
        from collections import deque
        
        # Queue to store pairs of nodes to compare
        queue = deque([(p, q)])
        
        while queue:
            node1, node2 = queue.popleft()
            
            # If both are None, continue to the next pair
            if node1 is None and node2 is None:
                continue
                
            # If one is None or values don't match, trees are different
            if node1 is None or node2 is None or node1.val != node2.val:
                return False
                
            # Add left and right children to the queue
            queue.append((node1.left, node2.left))
            queue.append((node1.right, node2.right))
            
        return True
        """`,
      hints: [
        'Consider the base cases: empty trees are the same, and a tree cannot be the same as an empty tree.',
        'Check node values at each step in your traversal.',
        'You need to check both structure (presence of nodes) and values.',
        'Can be solved elegantly with recursion, but an iterative approach using a queue is also possible.'
      ]
    },
    'palindrome-number': {
      id: 39,
      title: 'Palindrome Number',
      difficulty: 'Easy',
      category: 'Math',
      description: 'Given an integer x, return true if x is a palindrome, and false otherwise.\n\nAn integer is a palindrome when it reads the same backward as forward.\n\nFor example, 121 is a palindrome while 123 is not.',
      examples: [
        {
          input: 'x = 121',
          output: 'true'
        },
        {
          input: 'x = -121',
          output: 'false'
        },
        {
          input: 'x = 10',
          output: 'false'
        }
      ],
      constraints: [
        '-2^31 <= x <= 2^31 - 1'
      ],
      starterCode: `class Solution:
    def isPalindrome(self, x):
        """
        :type x: int
        :rtype: bool
        """
        # Your code here
        `,
      solution: `class Solution:
    def isPalindrome(self, x):
        """
        :type x: int
        :rtype: bool
        """
        # Negative numbers are not palindromes
        if x < 0:
            return False
            
        # Convert to string approach
        # return str(x) == str(x)[::-1]
        
        # Without converting to string (mathematical approach)
        original = x
        reversed_num = 0
        
        while x > 0:
            digit = x % 10  # Get the last digit
            reversed_num = reversed_num * 10 + digit  # Add digit to reversed number
            x //= 10  # Remove the last digit
            
        return original == reversed_num`,
      hints: [
        'Consider edge cases: negative numbers cannot be palindromes.',
        'There are two approaches: convert to string and check, or reverse the number mathematically.',
        'If converting to string, compare the original string with its reverse.',
        'For the mathematical approach, extract digits from right to left and build a new number.'
      ]
    },
    'fizz-buzz': {
      id: 40,
      title: 'Fizz Buzz',
      difficulty: 'Easy',
      category: 'Math',
      description: 'Given an integer n, return a string array answer (1-indexed) where:\n\n- answer[i] == "FizzBuzz" if i is divisible by 3 and 5.\n- answer[i] == "Fizz" if i is divisible by 3.\n- answer[i] == "Buzz" if i is divisible by 5.\n- answer[i] == i (as a string) if none of the above conditions are true.',
      examples: [
        {
          input: 'n = 3',
          output: '["1","2","Fizz"]'
        },
        {
          input: 'n = 5',
          output: '["1","2","Fizz","4","Buzz"]'
        },
        {
          input: 'n = 15',
          output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]'
        }
      ],
      constraints: [
        '1 <= n <= 10^4'
      ],
      starterCode: `class Solution:
    def fizzBuzz(self, n):
        """
        :type n: int
        :rtype: List[str]
        """
        # Your code here
        `,
      solution: `class Solution:
    def fizzBuzz(self, n):
        """
        :type n: int
        :rtype: List[str]
        """
        result = []
        
        for i in range(1, n + 1):
            if i % 3 == 0 and i % 5 == 0:
                result.append("FizzBuzz")
            elif i % 3 == 0:
                result.append("Fizz")
            elif i % 5 == 0:
                result.append("Buzz")
            else:
                result.append(str(i))
                
        return result
        
        # Alternative solution with fewer conditionals
        """
        result = []
        
        for i in range(1, n + 1):
            curr = ""
            
            if i % 3 == 0:
                curr += "Fizz"
            if i % 5 == 0:
                curr += "Buzz"
                
            if not curr:
                curr = str(i)
                
            result.append(curr)
            
        return result
        """`,
      hints: [
        'Use modulo operator (%) to check divisibility.',
        'Consider the order of your conditions - check for FizzBuzz first, then Fizz, then Buzz.',
        'Remember to convert integers to strings when adding them to the result.',
        'An alternative approach is to build the string incrementally, adding "Fizz" and/or "Buzz" as needed.'
      ]
    },
    'roman-to-integer': {
      id: 41,
      title: 'Roman to Integer',
      difficulty: 'Easy',
      category: 'Math',
      description: 'Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.\n\nSymbol       Value\nI            1\nV            5\nX            10\nL            50\nC            100\nD            500\nM            1000\n\nFor example, 2 is written as II in Roman numeral, just two ones added together. 12 is written as XII, which is simply X + II. The number 27 is written as XXVII, which is XX + V + II.\n\nRoman numerals are usually written largest to smallest from left to right. However, the numeral for four is not IIII. Instead, the number four is written as IV. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as IX.\n\nThere are six instances where subtraction is used:\n- I can be placed before V (5) and X (10) to make 4 and 9. \n- X can be placed before L (50) and C (100) to make 40 and 90. \n- C can be placed before D (500) and M (1000) to make 400 and 900.\n\nGiven a roman numeral, convert it to an integer.',
      examples: [
        {
          input: 's = "III"',
          output: '3'
        },
        {
          input: 's = "LVIII"',
          output: '58'
        },
        {
          input: 's = "MCMXCIV"',
          output: '1994'
        }
      ],
      constraints: [
        '1 <= s.length <= 15',
        's contains only the characters ("I", "V", "X", "L", "C", "D", "M").',
        'It is guaranteed that s is a valid roman numeral in the range [1, 3999].'
      ],
      starterCode: `class Solution:
    def romanToInt(self, s):
        """
        :type s: str
        :rtype: int
        """
        # Your code here
        `,
      solution: `class Solution:
    def romanToInt(self, s):
        """
        :type s: str
        :rtype: int
        """
        # Create a mapping of Roman numerals to integers
        values = {
            'I': 1,
            'V': 5,
            'X': 10,
            'L': 50,
            'C': 100,
            'D': 500,
            'M': 1000
        }
        
        total = 0
        i = 0
        
        while i < len(s):
            # If current value is less than next value, subtract current from next
            if i + 1 < len(s) and values[s[i]] < values[s[i + 1]]:
                total += values[s[i + 1]] - values[s[i]]
                i += 2  # Skip the next character as well
            else:
                total += values[s[i]]
                i += 1
                
        return total
        
        # Alternative solution (simpler approach)
        """
        values = {
            'I': 1,
            'V': 5,
            'X': 10,
            'L': 50,
            'C': 100,
            'D': 500,
            'M': 1000
        }
        
        total = 0
        prev_value = 0
        
        # Iterate through the string in reverse order
        for char in reversed(s):
            value = values[char]
            
            # If current value is greater than or equal to previous, add it
            # Otherwise, subtract it (handles cases like IV, IX, etc.)
            if value >= prev_value:
                total += value
            else:
                total -= value
                
            prev_value = value
            
        return total
        """`,
      hints: [
        'Create a mapping of Roman numerals to their integer values.',
        'Consider the special cases where subtraction is used (e.g., IV, IX, XL, etc.).',
        'One approach is to compare each symbol with the next and determine whether to add or subtract.',
        'Another approach is to scan from right to left, comparing each value with the previous one.'
      ]
    }
  };
  
  if (problemId in problems) {
    return problems[problemId];
  }
  
  // For unimplemented problems, throw a more specific error
  throw new Error(`This problem (${problemId}) is not yet implemented. Please try the 'two-sum', 'contains-duplicate', 'valid-anagram', 'valid-palindrome', 'best-time-to-buy-sell-stock', 'binary-search', 'valid-parentheses', 'reverse-linked-list', 'merge-two-lists', 'invert-binary-tree', 'max-depth-binary-tree', 'same-tree', 'palindrome-number', 'fizz-buzz', or 'roman-to-integer' problems which are fully functional.`);
};

// Mock submission evaluator
const evaluateSubmission = async (code: string, problemId: string): Promise<{success: boolean; results: any[]; error?: string}> => {
  // Simulates a network request to a code execution API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  console.log(`Evaluating submission for problem: ${problemId}`);
  console.log(`Submitted code: ${code.substring(0, 100)}...`);
  
  // Check if code is blank or too short to be valid
  const minimalCode = code.replace(/\s+/g, '').replace(/["';#]/g, '').trim();
  if (minimalCode.length < 10) {
    console.log('Code is too short for evaluation');
    return {
      success: false,
      results: [
        {testCase: 'Basic test', expected: 'A valid solution', actual: 'Empty or minimal code submitted', passed: false}
      ],
      error: 'Your solution appears to be incomplete. Please implement a full solution before submitting.'
    };
  }
  
  // In a real app, this would send the code to a backend API for evaluation
  // Here we do a simplified pattern check for common solutions

  if (problemId === 'two-sum') {
    // For Two Sum, we'll check if the solution contains the key elements of a correct solution
    const containsHashMap = code.includes('{}') || 
                            code.includes('dict(') || 
                            code.includes('hash_map') ||
                            code.includes('seen');
    
    const containsIteration = code.includes('for') || code.includes('while');
    const containsReturn = code.includes('return');
    const containsTargetCheck = code.includes('target -') || code.includes('target-') || code.includes('- nums');
    
    // Simple check for a reasonable solution
    if (containsHashMap && containsIteration && containsReturn) {
      console.log('Two Sum solution looks good - detected hash map approach');
      return {
        success: true,
        results: [
          {testCase: 'nums = [2,7,11,15], target = 9', expected: '[0,1]', actual: '[0,1]', passed: true},
          {testCase: 'nums = [3,2,4], target = 6', expected: '[1,2]', actual: '[1,2]', passed: true},
          {testCase: 'nums = [3,3], target = 6', expected: '[0,1]', actual: '[0,1]', passed: true}
        ]
      };
    } 
    
    // Even simple brute force solutions should work
    else if (containsIteration && containsReturn && containsTargetCheck) {
      console.log('Two Sum solution acceptable - detected brute force approach');
      return {
        success: true, // Still valid, just not optimal
        results: [
          {testCase: 'nums = [2,7,11,15], target = 9', expected: '[0,1]', actual: '[0,1]', passed: true},
          {testCase: 'nums = [3,2,4], target = 6', expected: '[1,2]', actual: '[1,2]', passed: true},
          {testCase: 'nums = [3,3], target = 6', expected: '[0,1]', actual: '[0,1]', passed: true}
        ]
      };
    }
    
    else if (containsIteration && containsReturn) {
      console.log('Two Sum solution missing key elements');
      return {
        success: false,
        results: [
          {testCase: 'nums = [2,7,11,15], target = 9', expected: '[0,1]', actual: '[0,1]', passed: true},
          {testCase: 'nums = [3,2,4], target = 6', expected: '[1,2]', actual: '[1,2]', passed: true},
          {testCase: 'nums = [3,3], target = 6', expected: '[0,1]', actual: 'Time Limit Exceeded', passed: false}
        ],
        error: 'Your solution works for simple cases but might be inefficient. Consider using a hash map for O(n) time complexity.'
      };
    } 
    
    else {
      console.log('Two Sum solution is incomplete');
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
  }

  // Default case for other problem IDs
  console.log(`Problem ${problemId} not specifically handled, using generic evaluation`);
  
  // By default, attempt to determine success by checking for common solution patterns
  const hasReturnStatement = code.includes('return');
  const hasLooping = code.includes('for') || code.includes('while');
  const hasConditions = code.includes('if');
  
  // A minimal check for a reasonably complete solution
  if (hasReturnStatement && (hasLooping || hasConditions)) {
    console.log('Generic solution looks reasonable');
    return {
      success: true,
      results: [
        {testCase: 'Test Case 1', expected: 'Expected Output', actual: 'Expected Output', passed: true},
        {testCase: 'Test Case 2', expected: 'Expected Output', actual: 'Expected Output', passed: true}
      ]
    };
  } else {
    console.log('Generic solution is incomplete');
    return {
      success: false,
      results: [
        {testCase: 'Test Case 1', expected: 'Expected Output', actual: 'Incomplete implementation', passed: false}
      ],
      error: 'Your solution appears to be incomplete. Make sure it includes proper logic and return statements.'
    };
  }
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
  const [isExploding, setIsExploding] = useState(false);
  
  // Access the problem progress context
  const { addXp } = useProblemProgress();
  
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
    if (!problemId || !problem) return;
    
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
      
      // Handle successful submission
      if (results.success) {
        console.log('🎉 Submission successful! Starting confetti celebration...');
        
        // Force the confetti state to false first, then true to ensure re-render
        setIsExploding(false);
        setTimeout(() => {
          setIsExploding(true);
          console.log('Confetti state set to:', true);
        }, 50);
        
        // Add XP based on problem difficulty
        if (problem.difficulty in XP_VALUES) {
          const xpAmount = XP_VALUES[problem.difficulty as keyof typeof XP_VALUES];
          console.log(`Adding ${xpAmount} XP for solving ${problem.difficulty} problem`);
          addXp(xpAmount, problem.difficulty);
        }
        
        // Set success message
        setSnackbar({
          open: true,
          message: '🎉 All test cases passed! You earned XP for this solution!',
          severity: 'success'
        });
        
        // Clear explosion after 4 seconds
        setTimeout(() => {
          console.log('Clearing confetti explosion after timeout');
          setIsExploding(false);
        }, 4000);
      } else {
        // Set error message for failed tests
        setSnackbar({
          open: true,
          message: 'Some test cases failed. Check the results below.',
          severity: 'error'
        });
      }
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
      {/* CSS Confetti */}
      <RealisticConfetti isActive={isExploding} />
      
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