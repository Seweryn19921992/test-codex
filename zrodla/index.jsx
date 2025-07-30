if (typeof require !== 'undefined') {
  var React = require('react');
  var ReactDOM = require('react-dom');
  var bcrypt = require('bcryptjs');
}

function FormularzRejestracji({ onRegister }) {
  const [login, setLogin] = React.useState('');
  const [haslo, setHaslo] = React.useState('');

  return (
    <div className="formularz">
      <h2>Rejestracja</h2>
      <input
        type="text"
        placeholder="Login"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <input
        type="password"
        placeholder="Hasło"
        value={haslo}
        onChange={(e) => setHaslo(e.target.value)}
      />
      <button onClick={() => onRegister(login, haslo)}>Zarejestruj</button>
    </div>
  );
}

function FormularzLogowania({ onLogin, blad }) {
  const [login, setLogin] = React.useState('');
  const [haslo, setHaslo] = React.useState('');

  return (
    <div className="formularz">
      <h2>Logowanie</h2>
      <input
        type="text"
        placeholder="Login"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <input
        type="password"
        placeholder="Hasło"
        value={haslo}
        onChange={(e) => setHaslo(e.target.value)}
      />
      {blad && <div className="blad">{blad}</div>}
      <button onClick={() => onLogin(login, haslo)}>Zaloguj</button>
    </div>
  );
}

function Branding() {
  return (
    <div className="branding">
      <div className="logo-stale">SIVI</div>
      <div className="beta">BETA</div>
    </div>
  );
}

const koloryZakladek = ['#39ff14', '#ff0057', '#00e5ff', '#ff00ff', '#f5c211'];

function Przegladarka() {
  const [zakladki, setZakladki] = React.useState([
    { url: 'https://example.com', kolor: koloryZakladek[0] }
  ]);
  const [aktywna, setAktywna] = React.useState(0);
  const [adres, setAdres] = React.useState(zakladki[0].url);

  function dodajZakladke() {
    const nowa = {
      url: 'https://example.com',
      kolor: koloryZakladek[zakladki.length % koloryZakladek.length]
    };
    setZakladki([...zakladki, nowa]);
    setAktywna(zakladki.length);
    setAdres(nowa.url);
  }

  function idz() {
    const nowe = [...zakladki];
    let url = adres;
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url;
    }
    nowe[aktywna].url = url;
    setZakladki(nowe);
  }

  React.useEffect(() => {
    setAdres(zakladki[aktywna].url);
  }, [aktywna]);

  return (
    <div className="przegladarka">
      <div className="zakladki">
        {zakladki.map((z, i) => (
          <div
            key={i}
            className={
              'zakladka' + (i === aktywna ? ' aktywna' : '')
            }
            style={{ background: z.kolor }}
            onClick={() => setAktywna(i)}
          >
            {`Karta ${i + 1}`}
          </div>
        ))}
        <div className="zakladka" style={{ background: '#444', color: '#39ff14' }} onClick={dodajZakladke}>+</div>
      </div>
      <div className="pasek-adresu">
        <input
          type="text"
          value={adres}
          onChange={(e) => setAdres(e.target.value)}
          placeholder="Wpisz adres URL"
        />
        <button onClick={idz}>Idź</button>
      </div>
      <webview className="przegladarka-webview" src={zakladki[aktywna].url}></webview>
    </div>
  );
}

function Aplikacja() {
  const [zarejestrowany, setZarejestrowany] = React.useState(() => {
    return localStorage.getItem('login') && localStorage.getItem('hash');
  });
  const [zalogowany, setZalogowany] = React.useState(false);
  const [blad, setBlad] = React.useState('');

  function handleRegister(login, haslo) {
    const hash = bcrypt.hashSync(haslo, 10);
    localStorage.setItem('login', login);
    localStorage.setItem('hash', hash);
    setZarejestrowany(true);
  }

  function handleLogin(login, haslo) {
    const savedLogin = localStorage.getItem('login');
    const savedHash = localStorage.getItem('hash');
    if (login === savedLogin && bcrypt.compareSync(haslo, savedHash)) {
      setZalogowany(true);
      setBlad('');
    } else {
      setBlad('Błędne hasło!');
    }
  }

  if (!zalogowany) {
    return (
      <>
        <Branding />
        <div className="ekran-startowy">
          <div>
            {!zarejestrowany ? (
              <FormularzRejestracji onRegister={handleRegister} />
            ) : (
              <FormularzLogowania onLogin={handleLogin} blad={blad} />
            )}
          </div>
          <div className="logo">SIVI</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Branding />
      <Przegladarka />
    </>
  );
}

if (typeof document !== 'undefined' && document.getElementById('korzen')) {
  ReactDOM.createRoot(document.getElementById('korzen')).render(<Aplikacja />);
}

if (typeof module !== 'undefined') {
  module.exports = { Aplikacja, Przegladarka };
}
