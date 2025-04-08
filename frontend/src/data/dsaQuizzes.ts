import { QuizTopic } from '../types/quiz';

export const DSA_QUIZZES: QuizTopic[] = [
  {
    name: "Arrays",
    questions: [
      {
        id: 1,
        question: "What is the time complexity of accessing an element in an array?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        topic: "Arrays"
      },
      {
        id: 2,
        question: "Which sorting algorithm has the best average-case time complexity?",
        options: ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"],
        correctAnswer: 1,
        topic: "Arrays"
      },
      {
        id: 3,
        question: "What is the worst-case time complexity of Bubble Sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
        correctAnswer: 2,
        topic: "Arrays"
      }
    ]
  },
  {
    name: "Linked Lists",
    questions: [
      {
        id: 4,
        question: "What is the time complexity of inserting a node at the beginning of a singly linked list?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        topic: "Linked Lists"
      },
      {
        id: 5,
        question: "Which of the following is NOT a type of linked list?",
        options: ["Singly Linked List", "Doubly Linked List", "Circular Linked List", "Binary Linked List"],
        correctAnswer: 3,
        topic: "Linked Lists"
      }
    ]
  },
  {
    name: "Stacks & Queues",
    questions: [
      {
        id: 6,
        question: "Which data structure follows the LIFO (Last In First Out) principle?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        correctAnswer: 1,
        topic: "Stacks & Queues"
      },
      {
        id: 7,
        question: "What is the time complexity of enqueue operation in a queue?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        topic: "Stacks & Queues"
      }
    ]
  },
  {
    name: "Trees",
    questions: [
      {
        id: 8,
        question: "What is the maximum number of nodes in a binary tree of height h?",
        options: ["2^h - 1", "2^h", "h^2", "2^(h+1) - 1"],
        correctAnswer: 3,
        topic: "Trees"
      },
      {
        id: 9,
        question: "Which traversal visits the root node first?",
        options: ["In-order", "Pre-order", "Post-order", "Level-order"],
        correctAnswer: 1,
        topic: "Trees"
      }
    ]
  },
  {
    name: "Graphs",
    questions: [
      {
        id: 10,
        question: "Which algorithm is used to find the shortest path in a weighted graph?",
        options: ["BFS", "DFS", "Dijkstra's", "Prim's"],
        correctAnswer: 2,
        topic: "Graphs"
      },
      {
        id: 11,
        question: "What is the time complexity of BFS in a graph with V vertices and E edges?",
        options: ["O(V)", "O(E)", "O(V + E)", "O(V * E)"],
        correctAnswer: 2,
        topic: "Graphs"
      }
    ]
  },
  {
    name: "Hash Tables",
    questions: [
      {
        id: 12,
        question: "What is the average-case time complexity of search in a hash table?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        topic: "Hash Tables"
      },
      {
        id: 13,
        question: "Which of the following is NOT a collision resolution technique?",
        options: ["Chaining", "Open Addressing", "Linear Probing", "Binary Search"],
        correctAnswer: 3,
        topic: "Hash Tables"
      }
    ]
  },
  {
    name: "Dynamic Programming",
    questions: [
      {
        id: 14,
        question: "What is the time complexity of the Fibonacci sequence using dynamic programming?",
        options: ["O(1)", "O(n)", "O(2^n)", "O(n²)"],
        correctAnswer: 1,
        topic: "Dynamic Programming"
      },
      {
        id: 15,
        question: "Which of the following problems can be solved using dynamic programming?",
        options: ["0/1 Knapsack", "Tower of Hanoi", "N-Queens", "All of the above"],
        correctAnswer: 3,
        topic: "Dynamic Programming"
      }
    ]
  }
]; 