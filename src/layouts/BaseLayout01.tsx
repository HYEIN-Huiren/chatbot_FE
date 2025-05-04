import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer.tsx';
import '../style/MainLayout.css';

function BaseLayout01(): React.ReactElement {
  return (
    <>
      <div className="wrapper">
        <div className="Mainbody">
          <main>
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default BaseLayout01;
