import axios from 'axios';
import Context from '../contexts/Context';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT } from '../config/constans';

const Profile = () => {
  const navigate = useNavigate();
  const { getDeveloper, setDeveloper } = useContext(Context);

  const getDeveloperData = async () => {
    const token = window.sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const { data } = await axios.get(ENDPOINT.users, { headers: { Authorization: `Bearer ${token}` } });
      setDeveloper(data);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      window.sessionStorage.removeItem('token');
      setDeveloper(null);
      navigate('/');
    }
  };

  useEffect(() => {
    getDeveloperData();
  }, []);

  return (
    <div className='py-5'>
      <h1>
        Bienvenido <span className='fw-bold'>{getDeveloper?.email}</span>
      </h1>
      <h3>
        {getDeveloper?.rol} en {getDeveloper?.lenguage}
      </h3>
    </div>
  );
};

export default Profile;

