import Error from './pages/Error'
import { Routes, Route } from "react-router-dom";
import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import { Layout } from 'antd';
import './App.css';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Records from './pages/Records';
import Setting from './pages/Setting';

const { Content } = Layout;

const App = () => {
  return (
    <div className="app">
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout className="site-layout">
          <Topbar />
          <Content >
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/analysis' element={<Analysis />} />
              <Route path='/records' element={<Records />} />
              <Route path='/setting' element={<Setting />} />
              <Route path='*' element={<Error />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </div>

  )
}

export default App