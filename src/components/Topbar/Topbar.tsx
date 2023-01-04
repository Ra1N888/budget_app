import { Layout } from 'antd';
import './style.css';

const { Header } = Layout;

const Topbar = () => {
  return (
    <Header className="site-layout-background" style={{ padding: 0 }} >top header</Header>
  )
}

export default Topbar