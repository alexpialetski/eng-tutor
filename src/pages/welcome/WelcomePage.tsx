import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../features/progress/model/useProgress';
import { Card } from '../../shared/ui/Card/Card';
import { Button } from '../../shared/ui/Button/Button';
import './WelcomePage.css';

export const WelcomePage: React.FC = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, loading: userLoading, createUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading && user) {
      navigate('/books');
    }
  }, [user, userLoading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await createUser(name.trim());
      navigate('/books');
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="welcome-container">
      <Card>
        <h1>Безмятежный Лотос</h1>
        <div className="subtitle">Добро пожаловать в мир изучения английского</div>
        <form onSubmit={handleSubmit} className="welcome-form">
          <label htmlFor="name-input">Как тебя зовут?</label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введи свое имя"
            autoFocus
            disabled={loading}
          />
          <Button type="submit" disabled={!name.trim() || loading}>
            Начать обучение
          </Button>
        </form>
      </Card>
    </div>
  );
};

