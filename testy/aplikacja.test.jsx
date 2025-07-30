import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Aplikacja, Przegladarka } from '../zrodla/index.jsx';

describe('logowanie', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('poprawne logowanie', () => {
    render(<Aplikacja />);

    fireEvent.change(screen.getByPlaceholderText('Login'), {
      target: { value: 'uzytkownik' }
    });
    fireEvent.change(screen.getByPlaceholderText('Hasło'), {
      target: { value: 'tajne' }
    });
    fireEvent.click(screen.getByText('Zarejestruj'));

    fireEvent.change(screen.getByPlaceholderText('Login'), {
      target: { value: 'uzytkownik' }
    });
    fireEvent.change(screen.getByPlaceholderText('Hasło'), {
      target: { value: 'tajne' }
    });
    fireEvent.click(screen.getByText('Zaloguj'));

    expect(screen.queryByText('Błędne hasło!')).toBeNull();
    expect(screen.getByText('Idź')).toBeInTheDocument();
  });
});

describe('przejscie do przeglądarki', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('po zalogowaniu pojawia się webview', () => {
    render(<Aplikacja />);

    fireEvent.change(screen.getByPlaceholderText('Login'), {
      target: { value: 'uzytkownik' }
    });
    fireEvent.change(screen.getByPlaceholderText('Hasło'), {
      target: { value: 'tajne' }
    });
    fireEvent.click(screen.getByText('Zarejestruj'));

    fireEvent.change(screen.getByPlaceholderText('Login'), {
      target: { value: 'uzytkownik' }
    });
    fireEvent.change(screen.getByPlaceholderText('Hasło'), {
      target: { value: 'tajne' }
    });
    fireEvent.click(screen.getByText('Zaloguj'));

    expect(document.querySelector('webview')).toBeInTheDocument();
  });
});

describe('zakładki', () => {
  test('dodawanie nowych kart', () => {
    const { container } = render(<Przegladarka />);

    // początkowo jedna karta i przycisk dodawania
    expect(container.querySelectorAll('.zakladka').length).toBe(2);
    fireEvent.click(screen.getByText('+'));
    expect(container.querySelectorAll('.zakladka').length).toBe(3);
    fireEvent.click(screen.getByText('+'));
    expect(container.querySelectorAll('.zakladka').length).toBe(4);
  });
});
