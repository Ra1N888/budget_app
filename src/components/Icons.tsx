import { BiDish } from 'react-icons/bi';
import { FiShoppingBag } from 'react-icons/fi';
import { GrGamepad } from 'react-icons/gr';
import { GiReceiveMoney } from 'react-icons/gi';
import { FiPhoneCall } from 'react-icons/fi';
import { RiWaterFlashLine } from 'react-icons/ri';
import { FaBus } from 'react-icons/fa';
import { MdOutlineMedicalServices } from 'react-icons/md';
import { AiFillRedEnvelope } from 'react-icons/ai';
import { RiPencilRuler2Line } from 'react-icons/ri';
import { VscError } from 'react-icons/vsc';

import { Avatar } from 'antd';
import '../components/Card/style.css'


function pick(name: string, size: number) {

  switch (name) {

    case 'BiDish':
      return <BiDish size={size} />
      break;
    case 'FiShoppingBag':
      return <FiShoppingBag size={size} />
      break;
    case 'GrGamepad':
      return <GrGamepad size={size} />
      break;
    case 'GiReceiveMoney':
      return <GiReceiveMoney size={size} />
      break;
    case 'FiPhoneCall':
      return <FiPhoneCall size={size} />
      break;
    case 'RiWaterFlashLine':
      return <RiWaterFlashLine size={size} />
      break;
    case 'FaBus':
      return <FaBus size={size} />
      break;
    case 'MdOutlineMedicalServices':
      return <MdOutlineMedicalServices size={size} />
      break;
    case 'AiFillRedEnvelope':
      return <AiFillRedEnvelope size={size} />
      break;
    case 'RiPencilRuler2Line':
      return <RiPencilRuler2Line size={size} />
      break;
    default:
      return <VscError size={size} />
  }

}

interface Props {
  iconName: string;
  size: number;
}

const Icon = ({ iconName, size }: Props) => {
  return (
    <div>
      {pick(iconName, size)}
    </div>
  )
}

interface Props1 {
  size: number;
  // fun: (values: any) => any
  myref:React.MutableRefObject<string>
}

const IconPicker = ({size,myref}:Props1) => {

  const icon_array: JSX.Element[] = [
    <BiDish size={size} name='BiDish'/>,
    <FiShoppingBag size={size} name='FiShoppingBag'/>,
    <GrGamepad size={size} name='GrGamepad'/>,
    <FiPhoneCall size={size} name='FiPhoneCall'/>,
    <RiWaterFlashLine size={size} name='RiWaterFlashLine'/>,
    <FaBus size={size} name='FaBus'/>,
    <MdOutlineMedicalServices size={size} name='MdOutlineMedicalServices'/>,
    <AiFillRedEnvelope size={size} name='AiFillRedEnvelope'/>,
    <RiPencilRuler2Line size={size} name='RiPencilRuler2Line'/>,
    <VscError size={size} name='VscError'/>,
  ]

  return (
    <>
      {
        icon_array.map((icon,index) =>
          <label className='icon_item' key={index}>
            <input type="radio" className='radiobutton_1' value="super-happy" />
            <Avatar size="large" icon={icon} style={{ cursor: 'pointer' ,backgroundColor: '#11111' }} onClick={()=>myref.current=icon.props.name}  />
          </label> 
        )
      }
    </>
  )
}

export { Icon, IconPicker } 
