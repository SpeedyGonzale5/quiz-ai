import {resultsStore} from './memoryStores';

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

export async function getResult(jobId: string): Promise<QuizResult | null> {
    const result = resultsStore[jobId];

    // If there is no entry for the given jobId, return null
    if (!result) {
        return null;
    }

    // Return the result which could be 'processing' or 'completed'
    return result;
}