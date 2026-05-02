import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 max-w-lg w-full">
        <Result
          status="404"
          title={<span className="text-4xl font-black text-gray-900 font-inter tracking-tight">404</span>}
          subTitle={<span className="text-lg text-gray-500 font-inter">Sorry, the page you visited does not exist.</span>}
          extra={
            <Button 
              type="primary" 
              onClick={() => navigate('/')}
              className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 border-none rounded-xl font-semibold text-base shadow-sm"
            >
              Back Home
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default NotFound;
