
import React, { useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Appcontext } from '../context/Appcontext';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const{token,loadCreditdsData}= useContext(Appcontext)

  useEffect(() => {
    const verifyPayment = async () => {
      const success = searchParams.get('success');
      const orderId = searchParams.get('session_id'); // Stripe session_id is used as orderId

      try {
        if (!orderId || !success) {
          toast.error("Invalid payment details");
          navigate('/buy');
          return;
        }

        const response = await axios.post(
          'http://localhost:4000/api/user/verify',
          { orderId, success },
          {
            headers: {token},
          }
        );

        if (response.data.success) {
          toast.success("Payment verified! Credits updated.");
          loadCreditdsData();
          navigate('/');
        } else {
          toast.error(response.data.message || "Payment verification failed");
          navigate('/buy');
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast.error("An error occurred during verification.");
        navigate('/buy');
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div>
      <h2>Verifying Payment...</h2>
    </div>
  );
};

export default Verify;
