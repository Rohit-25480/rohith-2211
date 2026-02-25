import { useState } from 'react';
import { QuizStart } from './components/QuizStart';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { quizData } from './data/quizData';
import { UserAnswer } from './types/quiz';

type QuizState = 'start' | 'quiz' | 'results';

export default function App() {
  const [quizState, setQuizState] = useState<QuizState>('start');
  const [userName, setUserName] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  const handleStart = (name: string) => {
    setUserName(name);
    setQuizState('quiz');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
  };

  const handleAnswer = (selectedAnswer: number) => {
    const currentQuestion = quizData.questions[currentQuestionIndex];
    
    // Save the answer
    setUserAnswers([
      ...userAnswers,
      {
        questionId: currentQuestion.id,
        selectedAnswer
      }
    ]);

    // Move to next question or show results
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizState('results');
    }
  };

  const handleRestart = () => {
    setQuizState('start');
    setUserName('');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
  };

  const calculateScore = () => {
    let score = 0;
    userAnswers.forEach((answer) => {
      const question = quizData.questions.find((q) => q.id === answer.questionId);
      if (question && question.correctAnswer === answer.selectedAnswer) {
        score++;
      }
    });
    return score;
  };

  return (
    <>
      {quizState === 'start' && (
        <QuizStart
          quizTitle={quizData.title}
          quizDescription={quizData.description}
          totalQuestions={quizData.questions.length}
          onStart={handleStart}
        />
      )}

      {quizState === 'quiz' && (
        <QuizQuestion
          question={quizData.questions[currentQuestionIndex]}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={quizData.questions.length}
          onAnswer={handleAnswer}
          selectedAnswer={null}
        />
      )}

      {quizState === 'results' && (
        <QuizResults
          userName={userName}
          score={calculateScore()}
          totalQuestions={quizData.questions.length}
          questions={quizData.questions}
          userAnswers={userAnswers}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}