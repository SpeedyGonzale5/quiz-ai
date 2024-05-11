interface QuizResult {
    status: 'completed' | 'processing';
    data?: {
        name: string;
        description: string;
        questions: Array<{
            questionText: string;
            answers: Array<{
                answerText: string;
                isCorrect: boolean;
            }>;
        }>;
    };
}

// This object will act as our in-memory database
export const resultsStore: Record<string, QuizResult> = {};