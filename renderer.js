const e = React.createElement;
const { useState, useEffect } = React;

function Setup({ onSetup }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  return e('div', { className: 'glass' },
    e('h2', { className: 'neon' }, 'Ustaw konto SIVI'),
    e('input', { placeholder: 'Login', value: user, onChange: ev=>setUser(ev.target.value) }),
    e('input', { placeholder: 'Hasło', type: 'password', value: pass, onChange: ev=>setPass(ev.target.value) }),
    e('button', { onClick: () => onSetup(user, pass) }, 'Zapisz')
  );
}

function Login({ onLogin, error }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  return e('div', { className: 'glass' },
    e('h2', { className: 'neon' }, 'Logowanie'),
    error ? e('div', { style: {color: 'red'} }, error) : null,
    e('input', { placeholder: 'Login', value: user, onChange: ev=>setUser(ev.target.value) }),
    e('input', { placeholder: 'Hasło', type: 'password', value: pass, onChange: ev=>setPass(ev.target.value) }),
    e('button', { onClick: () => onLogin(user, pass) }, 'Zaloguj')
  );
}

function Browser() {
  const [url, setUrl] = useState('https://example.com');
  const [src, setSrc] = useState(url);
  return e('div', { id: 'browser' },
    e('div', { id: 'address-bar', className: 'glass' },
      e('input', { style:{flex:1}, value: url, onChange: ev=>setUrl(ev.target.value) }),
      e('button', { onClick: () => setSrc(url) }, 'Go')
    ),
    e('webview', { id: 'view', src, style:{flex:1} })
  );
}

function App() {
  const [setup, setSetup] = useState(false);
  const [logged, setLogged] = useState(false);
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    const h = localStorage.getItem('siviHash');
    if (h) {
      setHash(h);
      setSetup(true);
    }
  }, []);
  function onSetup(user, pass) {
    const h = bcrypt.hashSync(pass, 8);
    localStorage.setItem('siviHash', h);
    setHash(h);
    setLogged(true);
  }
  function onLogin(user, pass) {
    if (bcrypt.compareSync(pass, hash)) {
      setLogged(true);
    } else {
      setError('Błędne hasło');
    }
  }
  return e('div', null,
    e('div', {id:'beta'}, 'Beta'),
    !setup ? e(Setup, { onSetup }) :
    !logged ? e(Login, { onLogin, error }) :
    e(Browser)
  );
}

ReactDOM.render(e(App), document.getElementById('app'));

