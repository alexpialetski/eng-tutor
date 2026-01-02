import { Navigate, Route, Routes } from 'react-router-dom';

import { BookSelectionPage } from '../pages/book-selection';
import { QuizPage } from '../pages/quiz';
import { ResultsPage } from '../pages/results';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/books" replace />} />
      <Route path="/books" element={<BookSelectionPage />} />
      <Route path="/books/:bookId" element={<QuizPage />} />
      <Route path="/books/:bookId/results" element={<ResultsPage />} />
      <Route path="*" element={<Navigate to="/books" replace />} />
    </Routes>
  );
}

export default App;
