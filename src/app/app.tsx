import { Route, Routes, Navigate } from 'react-router-dom';
import { useUser } from '../features/progress/model/useProgress';
import { WelcomePage } from '../pages/welcome/WelcomePage';
import { BookSelectionPage } from '../pages/book-selection/BookSelectionPage';
import { QuizPage } from '../pages/quiz/QuizPage';
import { ResultsPage } from '../pages/results/ResultsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route
        path="/books"
        element={
          <ProtectedRoute>
            <BookSelectionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/books/:bookId"
        element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/books/:bookId/results"
        element={
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
