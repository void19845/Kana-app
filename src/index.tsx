
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import { StudyPage, QuizPage, StatsPage } from '../pages';

export const router = createBrowserRouter([
    {
        // App est le layout racine (header + <Outlet />)
        path: '/',
        element: <App />,
        children: [
            // Redirect racine vers /study
            { index: true, element: <Navigate to="/study" replace /> },

            // Routes principales
            { path: 'study',            element: <StudyPage /> },
            { path: 'study/:script',    element: <StudyPage /> },
            { path: 'quiz',             element: <QuizPage /> },
            { path: 'quiz/:script',     element: <QuizPage /> },
            { path: 'stats',            element: <StatsPage /> },

            // Fallback
            { path: '*',                element: <Navigate to="/study" replace /> },
        ],
    },
]);