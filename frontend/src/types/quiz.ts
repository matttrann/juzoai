export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
}

export interface QuizTopic {
  name: string;
  questions: QuizQuestion[];
} 