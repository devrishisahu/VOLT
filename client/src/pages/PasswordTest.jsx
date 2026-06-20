import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../features/auth/authSlice';
import { toast } from 'react-toastify';

export default function PasswordTest() {
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth,
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [lastEvent, setLastEvent] = useState("none");

  const { email, password } = formData;

  const handleChange = (e) => {
    setLastEvent(`onChange fired: name=${e.target.name} value=${e.target.value}`);
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div style={{ padding: 40, background: '#0a0a0a', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ marginBottom: 5 }}>Password Debug</h1>
      <p style={{ color: '#00f5ff', marginBottom: 20 }}>Last event: {lastEvent}</p>
      <p style={{ color: '#f72585', marginBottom: 20 }}>email: "{email}" | password: "{password}" (len:{password.length})</p>

      <h2 style={{ color: '#f72585', marginBottom: 10 }}>TEST A: Inside &lt;form&gt; (your current setup)</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          value={email}
          onChange={handleChange}
          type="email"
          placeholder="email"
          style={{ padding: 12, background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: 8, width: 300, display: 'block', marginBottom: 10 }}
        />
        <input
          name="password"
          value={password}
          onChange={handleChange}
          type="password"
          placeholder="password (inside form)"
          style={{ padding: 12, background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: 8, width: 300, display: 'block', marginBottom: 10 }}
        />
      </form>

      <hr style={{ borderColor: '#333', margin: '30px 0' }} />

      <h2 style={{ color: '#00f5ff', marginBottom: 10 }}>TEST B: NO &lt;form&gt; wrapper</h2>
      <div>
        <input
          name="email"
          value={email}
          onChange={handleChange}
          type="email"
          placeholder="email"
          style={{ padding: 12, background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: 8, width: 300, display: 'block', marginBottom: 10 }}
        />
        <input
          name="password"
          value={password}
          onChange={handleChange}
          type="password"
          placeholder="password (NO form)"
          style={{ padding: 12, background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: 8, width: 300, display: 'block', marginBottom: 10 }}
        />
      </div>

      <hr style={{ borderColor: '#333', margin: '30px 0' }} />

      <h2 style={{ color: 'yellow', marginBottom: 10 }}>TEST C: Inside &lt;form autoComplete="off"&gt;</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          name="email"
          value={email}
          onChange={handleChange}
          type="email"
          placeholder="email"
          style={{ padding: 12, background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: 8, width: 300, display: 'block', marginBottom: 10 }}
        />
        <input
          name="pass"
          value={password}
          onChange={(e) => {
            setLastEvent(`onChange(pass): value=${e.target.value}`);
            setFormData(prev => ({ ...prev, password: e.target.value }));
          }}
          type="password"
          placeholder="password (form autocomplete=off, name=pass)"
          autoComplete="off"
          style={{ padding: 12, background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: 8, width: 400, display: 'block', marginBottom: 10 }}
        />
      </form>
    </div>
  );
}
