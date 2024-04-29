"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progressBar";
import { ChevronLeft, X } from "lucide-react";
import ResultCard from "./ResultCard";
import QuizzSubmission from "./QuizzSubmission";
import { InferSelectModel } from "drizzle-orm";
import { questionAnswers, questions as DbQuestions, quizzes } from "@/db/schema";
import { saveSubmission } from "@/actions/saveSubmissions";
import { useRouter } from "next/navigation";
import { FlashcardArray } from "react-quizlet-flashcard";

type Answer = InferSelectModel<typeof questionAnswers>;
type Question = InferSelectModel<typeof DbQuestions> & { answers: Answer[] };
type Quizz = InferSelectModel<typeof quizzes> & { questions: Question[] };

type Props = {
  quizz: Quizz
}

export default function QuizzQuestions(props: Props) {
  const { questions } = props.quizz;
  const [started, setStarted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ questionId: number, answerId: number }[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const router = useRouter();

  // Sets Flashcard Questions and Answers Component
  const allCards = questions.map(question => ({
    id: question.id,
    frontHTML: (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {question.questionText}
      </div>
    ),
    backHTML: (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {question.answers.find(answer => answer.isCorrect)?.answerText || 'Correct answer not found'}
      </div>
    ),
    frontCardStyle: {
      backgroundColor: '#f0f0f0', // Light grey background for the front
      padding: '20px',
      borderRadius: '10px'
    },
    backCardStyle: {
      backgroundColor: '#f0f0f0', // Light blue background for the back
      padding: '20px',
      borderRadius: '10px'
    },
    frontContentStyle: {
      fontSize: '1.2rem',
      textAlign: 'center' as const, // Explicitly typing as a valid CSS textAlign value
      color: '#333',
      fontWeight: 'bold'
    },
    backContentStyle: {
      fontSize: '1.2rem',
      textAlign: 'center' as const, // Explicitly typing as a valid CSS textAlign value
      color: '#333',
      fontWeight: 'bold'
    }
  }));


  const currentCard = [
    {
      id: questions[currentQuestion].id,
      frontHTML: <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{questions[currentQuestion].questionText}</div>,
      backHTML: <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{questions[currentQuestion].answers.find(answer => answer.isCorrect)?.answerText || 'Correct answer not found'}</div>,
      frontCardStyle: {
        backgroundColor: '#f0f0f0', // Light grey background for the front
        padding: '20px',
        borderRadius: '10px'
      },
      backCardStyle: {
        backgroundColor: '#f0f0f0', // Light blue background for the back
        padding: '20px',
        borderRadius: '10px'
      },
      frontContentStyle: {
        fontSize: '1.2rem',
        textAlign: 'center' as const, // Explicitly typing as a valid CSS textAlign value
        color: '#333',
        fontWeight: 'bold'
      },
      backContentStyle: {
        fontSize: '1.2rem',
        textAlign: 'center' as const, // Explicitly typing as a valid CSS textAlign value
        color: '#333',
        fontWeight: 'bold'
      }
    }
  ];

  const handleNext = () => {
    if (!started) {
      setStarted(true);
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setSubmitted(true);
      return;
    }
  }

  const handleAnswer = (answer: Answer, questionId: number) => {
    const newUserAnswersArr = [...userAnswers, {
      questionId,
      answerId: answer.id,
    }];
    setUserAnswers(newUserAnswersArr);
    const isCurrentCorrect = answer.isCorrect;
    if (isCurrentCorrect) {
      setScore(score + 1);
    }
  }

  const handleSubmit = async () => {
    try {
      const subId = await saveSubmission({ score }, props.quizz.id);
    } catch (e) {
      console.log(e);
    }

    setSubmitted(true);
  }

  const handlePressPrev = () => {
    if (currentQuestion !== 0) {
      setCurrentQuestion(prevCurrentQuestion => prevCurrentQuestion - 1);
    }
  }

  const handleExit = () => {
    router.push('/dashboard');
  }

  const scorePercentage: number = Math.round((score / questions.length) * 100);
  const selectedAnswer: number | null | undefined = userAnswers.find((item) => item.questionId === questions[currentQuestion].id)?.answerId;
  const isCorrect: boolean | null | undefined = questions[currentQuestion].answers.findIndex((answer) => answer.id === selectedAnswer) !== -1 ? questions[currentQuestion].answers.find((answer) => answer.id === selectedAnswer)?.isCorrect : null;

  if (submitted) {
    return (
      <QuizzSubmission
        score={score}
        scorePercentage={scorePercentage}
        totalQuestions={questions.length}
      />
    )
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Header Component with ProgressBar */}
      <div className="position-sticky top-0 z-10 shadow-md py-4 w-full">
        <header className="grid grid-cols-[auto,1fr,auto] grid-flow-col items-center justify-between py-2 gap-2">
          <Button size="icon" variant="outline" onClick={handlePressPrev}><ChevronLeft /></Button>
          <ProgressBar value={(currentQuestion / questions.length) * 100} />
          <Button size="icon" variant="outline" onClick={handleExit}>
            <X />
          </Button>
        </header>
      </div>
      <main className="flex justify-center flex-1">
        {!started ? <h1 className="text-3xl font-bold">Welcome to the quizz page👋</h1> : (
          <div>
            {/* Div for for the displayed first question */}
            {/* <h2 className="text-3xl font-bold">{questions[currentQuestion].questionText}</h2> */}
            {/* Div For Answer Choices Generate */}
            <div className="grid grid-cols-1 gap-6 mt-6">
              {/* {
                questions[currentQuestion].answers.map(answer => {
                  const variant = selectedAnswer === answer.id ? (answer.isCorrect ? "neoSuccess" : "neoDanger") : "neoOutline";
                  return (
                    <Button key={answer.id} disabled={!!selectedAnswer} variant={variant} size="xl" onClick={() => handleAnswer(answer, questions[currentQuestion].id)} className="disabled:opacity-100"><p className="whitespace-normal">{answer.answerText}</p></Button>
                  )
                })
              } */}
               <div>
              </div>
            </div>
             <FlashcardArray cards={allCards} />
          </div>
        )}
      </main>
      <footer className="footer pb-9 px-6 relative mb-0">
        <ResultCard isCorrect={isCorrect} correctAnswer={questions[currentQuestion].answers.find(answer => answer.isCorrect === true)?.answerText || ""} />
        <Button variant="neo" size="lg" onClick={handleExit}>Submit</Button>
        {
          (currentQuestion === questions.length - 1) ? <Button variant="neo" size="lg" onClick={handleSubmit}>Submit</Button> :
            <Button variant="neo" size="lg" onClick={handleNext}>{!started ? 'Start' : 'Next'}</Button>
            
        }
      </footer>
    </div>
  )
}
