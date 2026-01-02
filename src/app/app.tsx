import { Navigate, Route, Routes } from 'react-router-dom';

import { BookSelectionPage } from '~/pages/book-selection';
import { QuizPage } from '~/pages/quiz';
import { ResultsPage } from '~/pages/results';

export function App() {
  return (
    <div className="min-h-screen bg-bg text-text font-serif bg-[radial-gradient(#e6e1d3_1px,transparent_1px)] bg-[length:20px_20px]">
      <Routes>
        <Route path="/" element={<Navigate to="/books" replace />} />
        <Route path="/books" element={<BookSelectionPage />} />
        <Route path="/books/:bookId" element={<QuizPage />} />
        <Route path="/books/:bookId/results" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/books" replace />} />
      </Routes>
    </div>
  );
}

export default App;
