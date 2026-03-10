import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import { StudyPage, QuizPage, StatsPage } from '../pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true,            element: <Navigate to="/study" replace /> },
      { path: 'study',          element: <StudyPage /> },
      { path: 'study/:script',  element: <StudyPage /> },
      { path: 'quiz',           element: <QuizPage /> },
      { path: 'quiz/:script',   element: <QuizPage /> },
      { path: 'stats',          element: <StatsPage /> },
      { path: '*',              element: <Navigate to="/study" replace /> },
    ],
  },
]);
