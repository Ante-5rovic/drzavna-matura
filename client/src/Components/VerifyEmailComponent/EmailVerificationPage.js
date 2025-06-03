import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

const EmailVerificationPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [message, setMessage] = useState('Verificiram vaš račun...');
    const [error, setError] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        if (token && !isVerified) {
            const verifyToken = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/register/verify-email?token=${token}`, {
                        method: 'GET',
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Verifikacija neuspješna.');
                    }
                    
                    setMessage(data.message || 'Račun uspješno verificiran!');
                    setError('');
                    setIsVerified(true);

                } catch (err) {
                    setError(err.message || 'Došlo je do greške prilikom verifikacije.');
                    setMessage('');
                    setIsVerified(false);
                }
            };
            verifyToken();
        } else if (!token) {
            setError('Token za verifikaciju nije pronađen.');
            setMessage('');
            setIsVerified(false);
        }
    }, [token, isVerified]);

    useEffect(() => {
        if (isVerified) {
            if (countdown === 0) {
                navigate('/login?verified=true');
                return;
            }

            setMessage(`Račun uspješno verificiran! Preusmjeravam na prijavu za ${countdown} sekund${countdown === 1 ? 'u' : countdown > 1 && countdown < 5 ? 'e' : 'i'}...`);


            const timerId = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);

            return () => clearInterval(timerId);
        }
    }, [isVerified, countdown, navigate]);


    return (
        <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
            <h2>Verifikacija računa</h2>
            
            {!isVerified && message && !error && <p style={{ color: '#333' }}>{message}</p>}
            
            {isVerified && message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}

            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>Greška: {error}</p>}
            
            {!token && !message && !error && (
                <p style={{color: 'orange'}}>Nema tokena za verifikaciju u URL-u.</p>
            )}

            {(error || (isVerified && countdown > 0)) && (
                <p style={{marginTop: '20px'}}>
                    <Link to="/login" style={{textDecoration: 'none', color: '#007bff', fontWeight: 'bold'}}>
                        Idi na stranicu za prijavu
                    </Link>
                </p>
            )}
        </div>
    );
};

export default EmailVerificationPage;