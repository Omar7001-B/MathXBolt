export const generateQuestions = (settings: GameSettings) => {
  const questions = [];
  for (let i = 0; i < settings.questionsCount; i++) {
    const num1 = Math.floor(Math.random() * (settings.maxNumber - settings.minNumber + 1)) + settings.minNumber;
    const num2 = Math.floor(Math.random() * (settings.maxNumber - settings.minNumber + 1)) + settings.minNumber;
    questions.push({
      num1,
      num2,
      answer: num1 + num2
    });
  }
  return questions;
};

export const createGame = (hostUsername: string, settings: GameSettings): Game => ({
  id: Math.random().toString(36).substring(7),
  players: [{ username: hostUsername, points: 0, currentQuestion: 0 }],
  settings,
  questions: generateQuestions(settings),
  status: 'waiting'
});