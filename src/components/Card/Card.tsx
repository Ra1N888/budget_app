import { Card as SingleCard, Modal, Radio, Button, Avatar, Form, Input, InputNumber, Tag, Select, Divider } from 'antd';
import { CirclePicker } from 'react-color';
import { Icon, IconPicker } from '../Icons'
import { AiOutlineMenu } from 'react-icons/ai';
import { IoMdAdd } from 'react-icons/io';
import { useState, useContext, useRef, useEffect } from "react";
import { cateProps } from '../../type'
import { LedgerContext } from '../../context';
import type { RadioChangeEvent, InputRef } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { UserOutlined } from '@ant-design/icons';
import { create_cate, create_record, update_cate, delete_subcate } from '../../services/home'
import { hover } from '@testing-library/user-event/dist/hover';
import { PlusOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';
import './style.css';
import { DatePicker } from 'antd';
import type { DatePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';


interface Props {
  _id: string;
  isPlus: boolean;
  name: string;
  color: string;
  icon: string;
  amount: number;
  children: string[];
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
}

interface Props_blank {
  type: string;
  categories: cateProps[]
  setcategories: React.Dispatch<React.SetStateAction<cateProps[]>>
}

interface send_cateProps {
  name: string;
  isPlus: boolean;
  color: string;
  icon: string;
  subcates: string[];
}

interface send_record {
  ledger: string;
  category: string;
  amount: number;
  note: string;
  date: Date;
}

interface receive_subcateProps {
  name: string;
  id: string;
}


//卡片 -【功能】添加新纪录 + 修改分类信息
const Card = ({ _id, isPlus, name, color, icon, amount, children, total, setTotal }: Props) => {

  const [cardname, setName] = useState<string>(name)
  const [cardcolor, setColor] = useState<string>(color)
  const [cardicon, setIcon] = useState<string>(icon)
  const [cardAmount, setAmount] = useState<number>(amount)

  const [subcates, setSubcates] = useState<receive_subcateProps[]>([]) //存储fetch得到的数据{id: xxx, name: xxx},作用是查询子类的ID号

  const [open, setOpen] = useState(false); // 控制界面‘添加纪录’
  const [open1, setOpen1] = useState(false); // 控制界面‘修改分类卡片’
  const [open2, setOpen2] = useState(false); // icon picker
  const [open3, setOpen3] = useState(false); // color picker

  console.log('children: ' + children)

  //增删子类需要用到的state
  const [tags, setTags] = useState<string[]>(children); //大类的children属性
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);

  const [form] = Form.useForm(); //antd第三方hook: 提交添加纪录的表单
  const [form1] = Form.useForm(); //antd第三方hook: 提交修改卡片信息的表单

  const ledger_id = useContext(LedgerContext);
  const iconRef = useRef(cardicon)
  const colorRef = useRef(cardcolor)

  //存储选中的subcate的name
  const [selected, setSelected] = useState<string>("");

  // console.log('card tags: ' + tags)
  // 发送-new record表单
  const handleSubmit_add = (value: any) => {
    console.log('Success:', value);
    setOpen(false)

    const sub_id = subcates.find((item) => {
      if (item.name === selected) return true
    })?.id
    //填写是大类还是小类id

    const obj: send_record = {
      ledger: ledger_id,
      category: (sub_id) ? sub_id : _id, //没选子类，就发送大类的id，选了子类，发送子类的id
      amount: value.amount,
      note: value.note,
      date: value.date,
    }

    // console.log('send: ' + Object.prototype.toString.call(obj.category))
    // console.log('send: ' + obj)

    console.log('cardAmount:' + cardAmount)

    //update singleboard's total amount
    setTotal(total + value.amount)
    setAmount(cardAmount + value.amount)

    setSelected("")

    //发起POST请求
    create_record(obj)
      .then((res) => {
        console.log('record_res: ' + res)
      })
  }

  const handleCancel = () => {
    setOpen1(false);
  }

  const handleSave = () => {
    form1.submit() //提交成功后处理handleSubmit_edit
    setOpen1(false)
    console.log('trigger Save')
  }

  //发送-edit表单
  const handleSubmit_edit = (value: any) => {

    console.log(value)
    console.log('handleSubmit_edit')

    // setOpen1(false)

    const obj = {
      id: _id,
      isPlus: isPlus,
      name: value.name, //为什么name是undefined？？？
      color: colorRef.current,
      icon: iconRef.current,
      children: tags,
    }

    console.log('Success&Send:', obj);

    //发起 PUT 更新请求
    update_cate(obj)
      .then((res) => {
        console.log('record_res: ' + res)
      })
      .then(() => fetch('http://localhost:3001/api/home/' + ledger_id))
      .then((res) => res.json())
      .then((data) => {

        console.log('ledger_cates_info_data: ' + data)

        let cates: cateProps[];
        let new_total: number = 0;
        let new_amount: number = 0;

        //根据大类的支出收入决定获取的是支出的大类集合还是收入的大类集合
        if (!isPlus) cates = data[0]
        else cates = data[1]

        //计算更新后的total
        cates.forEach((cate) => {
          new_total += cate.total
        })

        //计算更新后的该大类的amount
        const found = cates.find(cate=> cate._id === _id)
        if(found) new_amount = found.total

        console.log('new_total&new_amount: '+ new_total + ' ' + new_amount)

        //更新state
        setTotal(new_total)
        setName(obj.name)
        setIcon(obj.icon)
        setColor(obj.color)
        setAmount(new_amount)

      })
      .catch((err) => console.log(err))


  }

  //获取子类信息
  useEffect(() => {
    const dataFetch = async () => {
      const data = await (await fetch('http://localhost:3001/api/home/subcates/' + _id)).json();
      // console.log(data)
      setSubcates(data)

      // let default_tags: string[] = []
      // data.forEach((element: receive_subcateProps) => {
      //   default_tags.push(element.name)
      // });
      // setTags(default_tags)

      // console.log(default_tags)
      // console.log('card mount')
    };
    dataFetch();
  }, []);

  useEffect(() => { //tag变成input后，保持input是focus的状态，就是光标闪烁的状态
    console.log("again");
    if (inputVisible) {
      inputRef.current?.focus()
    }
  }, [inputVisible]);

  return (
    <>
      <SingleCard
        hoverable={true}
        title={cardname}
        extra={
          <div className='icon_block'
            onClick={(e) => {

              //阻止冒泡
              if (e.defaultPrevented) return
              e.preventDefault()

              //打开前设置默认的category默认的icon和color

              iconRef.current = cardicon
              colorRef.current = cardcolor
              form1.resetFields();
              setOpen1(true)
            }}
          >
            <AiOutlineMenu />
          </div>
        }
        style={{ width: 170 }}
        onClick={(e) => {

          //阻止冒泡
          if (e.defaultPrevented) return
          e.preventDefault()

          // console.log('card')
          // setFieldsValue({date: new Date()})
          form.resetFields();
          setOpen(true)
        }}
      >
        <div className='circle' style={{ backgroundColor: cardcolor }}>
          <Icon iconName={cardicon} size={25} />
        </div>
        <p className='money_area'>¥{cardAmount}</p>
      </SingleCard>

      {/* add new record */}
      <Modal
        title={cardname}
        centered

        open={open}
        onOk={() => {
          form.submit()
        }}
        okText='save'
        onCancel={() => {
          setOpen(false);
          // form.resetFields(); //清空输入框
          setSelected("")
        }}
        width={400}
      >

        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{
            amount: 0,
            note: "",
            date: new Date(),
            remember: true
          }}
          onFinish={handleSubmit_add} //onFinish 是 ‘successfully submit’ 后才会触发
          autoComplete="off"
        >
          <Form.Item
            name="amount"
          >
            <InputNumber prefix="￥" bordered={false} controls={false} />
          </Form.Item>

          {<Subcates selected={selected} setSelected={setSelected} tags={tags} />}

          <Form.Item
            label="note"
            name="note"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="date"
            name="date"
          >
            <Datepicker setFieldsValue={form.setFieldsValue} />
          </Form.Item>

        </Form>
      </Modal>

      {/* update card's props */}
      <Modal
        title="Update card"
        centered
        open={open1}
        // onOk={handleSave}
        // okText='save'
        onCancel={handleCancel}
        width={400}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary">
            Delete
          </Button>,
          <Button key="link" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
      >
        <Form
          form={form1}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={handleSubmit_edit} //onFinish 是 ‘successfully submit’ 后才会触发
          onFinishFailed={handleSubmit_edit}
          autoComplete="off"
        >
          <Form.Item
            label="name"
            name="name"
            rules={[{ required: true, message: 'Please input category name!' }]}
            initialValue={cardname}
          >
            <Input defaultValue={cardname} />
          </Form.Item>

          <Form.Item
            label="icon"
          >
            <Avatar size="large" icon={<Icon iconName={iconRef.current} size={25} />} onClick={() => setOpen2(true)} style={{ cursor: 'pointer' }} />
          </Form.Item>

          <Form.Item
            label="color"
          >
            <Avatar size="large" style={{ backgroundColor: colorRef.current, cursor: 'pointer' }} onClick={() => setOpen3(true)} />
          </Form.Item>

          <Form.Item
            label="subcates"
          >
            <SubcateDisplay_cate id={_id} tags={tags} setTags={setTags} inputVisible={inputVisible} setInputVisible={setInputVisible} inputValue={inputValue} setInputValue={setInputValue} inputRef={inputRef} />
          </Form.Item>


        </Form>
      </Modal>

      {/* icon picker */}
      <Modal
        title=' '
        centered
        open={open2}
        onCancel={() => {
          setOpen2(false)
        }}
        width={200}
        footer={null}
      >
        <div className='icon_container'>
          <IconPicker size={28} myref={iconRef} />
        </div>
      </Modal>

      {/* color picker */}
      <Modal
        title=' '
        centered
        open={open3}
        onCancel={() => {
          setOpen3(false)
        }}
        width={200}
        footer={null}
      >
        <div className='color_container'>
          <CirclePicker
            onChange={(color) => {
              // console.log(color)
              colorRef.current = color.hex;
            }}
          />
        </div>
      </Modal>
    </>
  )
}

interface props2 {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>
  tags: string[]
}

const Subcates = ({ selected, setSelected, tags }: props2) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("change: " + event.target.value);
    setSelected(event.target.value);
  };

  return (
    <>

      <p>sub category</p>
      {
        tags.map((item) =>
          <label key={item}>
            <input
              className="radiobutton_2"
              type="radio"
              value={item}
              checked={selected === item}
              onChange={handleChange}
              onClick={(e) => {
                console.log("click! now selected= " + selected);
                const element = e.target as HTMLInputElement
                console.log(element.value)
                if (element.value === selected) setSelected("");
              }}
            />
            <span className='radio_span' style={{ cursor: 'pointer' }}>
              {item}
            </span>
          </label>
        )
      }
      <span className='radio_span add_button' style={{ cursor: 'pointer' }} onClick={() => setSelected("")}>
        {'+'}
      </span>
    </>
  )
}

interface prop3 {
  setFieldsValue: (values: any) => void
}
const Datepicker = ({ setFieldsValue }: prop3) => {

  const onChange = (value: DatePickerProps['value']) => {
    setFieldsValue({ date: value?.toDate() })
    // console.log('Date type: ', value?.toDate());
    console.log('ISOstring: ', value?.toISOString());
  };

  return (
    <>
      <DatePicker
        defaultValue={dayjs()}
        format="YYYY-MM-DD HH:mm" //输入框中展示的时间格式
        showTime={{
          format: "HH:mm" //选择器中的时间格式
        }}
        onChange={onChange}
      />
    </>
  )
}


















//空白卡片 -【功能】添加新分类
const Blankcard = ({ type, categories, setcategories }: Props_blank) => {

  const [open, setOpen] = useState(false); // 控制界面‘添加卡片’
  const [open1, setOpen1] = useState(false); // icon picker
  const [open2, setOpen2] = useState(false); // color picker

  //增删子类需要用到的state
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);

  const [form] = Form.useForm(); //antd第三方hook
  const { getFieldValue, setFieldsValue } = form;

  const iconRef = useRef('VscError')
  const colorRef = useRef('#BFBFBF')


  const ledger_id = useContext(LedgerContext);

  // console.log('level: '+level)

  //发送表单
  const handleSubmit = (value: any) => {
    console.log('Success:', value);
    setOpen(false)

    const obj: send_cateProps = {
      name: value.name,
      isPlus: value.type,
      color: colorRef.current,
      icon: iconRef.current,
      subcates: tags,
    }

    // console.log('send: ' + obj.subcates)
    console.log(obj)


    //发起POST请求
    create_cate({ newCate: obj, ledger_id: ledger_id })
      .then((old) => {

        const new_: cateProps = {
          _id: old.id,
          name: old.name,
          isPlus: old.isPlus,
          color: old.color,
          icon: old.icon,
          total: 0,
          children: old.children
        }

        setcategories([...categories, new_])
      })

  }

  useEffect(() => { //tag变成input后，保持input是focus的状态，就是光标闪烁的状态
    console.log("again");
    if (inputVisible) {
      inputRef.current?.focus()
    }
  }, [inputVisible]);

  return (
    <>
      <SingleCard id='hhh' hoverable={true} style={{ width: 170 }} onClick={() => {
        setOpen(true)
        iconRef.current = 'VscError';
        colorRef.current = '#BFBFBF';
        setTags([])
        form.resetFields();
      }}>
        <div className='blank_single_card'>
          <IoMdAdd className='blank_icon' size={50} />
        </div>
      </SingleCard>

      <Modal
        title="Add new card"
        centered

        open={open}
        onOk={() => {
          form.submit()
        }}
        okText='save'
        onCancel={() => {
          setOpen(false);
          // form.resetFields(); //清空输入框
        }}
        width={400}
      >
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{
            type: false,
            remember: true
          }}
          onFinish={handleSubmit} //onFinish 是 ‘successfully submit’ 后才会触发
          autoComplete="off"
        // layout='vertical'
        >
          <Form.Item
            label="name"
            name="name"
            rules={[{ required: true, message: 'Please input category name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="icon"
          // name="icon"
          // initialValue="VscError"
          >
            <Avatar size="large" icon={<Icon iconName={iconRef.current} size={25} />} onClick={() => setOpen1(true)} style={{ cursor: 'pointer' }} />
          </Form.Item>

          <Form.Item
            label="color"
          // name="color"
          // initialValue="#BFBFBF"
          >
            <Avatar size="large" style={{ backgroundColor: colorRef.current, cursor: 'pointer' }} onClick={() => setOpen2(true)} />
          </Form.Item>

          <Form.Item
            label="type"
            name="type"
          >
            <Tag color="cyan">{type}</Tag>
          </Form.Item>

          <Form.Item
            label="subcates"
          >
            <SubcateDisplay_blank id='blankcard_no_id' tags={tags} setTags={setTags} inputVisible={inputVisible} setInputVisible={setInputVisible} inputValue={inputValue} setInputValue={setInputValue} inputRef={inputRef} />
          </Form.Item>

        </Form>
      </Modal>

      {/* icon picker */}
      <Modal
        title=' '
        centered
        open={open1}
        onCancel={() => {
          setOpen1(false)
        }}
        width={200}
        footer={null}
      >
        <div className='icon_container'>
          <IconPicker size={28} myref={iconRef} />
        </div>
      </Modal>

      {/* color picker */}
      <Modal
        title=' '
        centered
        open={open2}
        onCancel={() => {
          setOpen2(false)
        }}
        width={200}
        footer={null}
      >
        <div className='color_container'>
          <CirclePicker
            onChange={(color) => {
              // console.log(color)
              colorRef.current = color.hex;
            }}
          />
        </div>
      </Modal>

    </>
  )
}

interface prop4 {
  id?: string;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  inputVisible: boolean;
  setInputVisible: React.Dispatch<React.SetStateAction<boolean>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<InputRef>;
}

const SubcateDisplay_cate = ({ id, tags, setTags, inputVisible, setInputVisible, inputValue, setInputValue, inputRef }: prop4) => {

  const [open, setOpen] = useState<boolean>(false)
  const removedTagRef = useRef<string>()
  const [check, setCheck] = useState<boolean>(false)

  console.log('SubcateDisplay: ' + tags)
  console.log('check: ' + check)

  const handleClose = (removedTag: string) => { //点击删除tag触发的事件
    removedTagRef.current = removedTag
    console.log('removed_tag: ' + removedTagRef.current)

    setCheck(false)
    setOpen(true)
    // console.log(newTags);
    // setTags(newTags);
  };
  const showInput = () => {
    setInputVisible(true);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };
  const forMap = (tag: string) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: "inline-block" }}>
        {tagElem}
      </span>
    );
  };
  const tagChild = tags.map(forMap);

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <TweenOneGroup
          enter={{
            scale: 0.8,
            opacity: 0,
            type: "from",
            duration: 100
          }}
          onEnd={(e) => {
            if (e.type === "appear" || e.type === "enter") {
              (e.target as any).style = "display: inline-block";
            }
          }}
          leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
          appear={false}
        >
          {tagChild}
        </TweenOneGroup>
      </div>

      {
        inputVisible && (
          <Input
            ref={inputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        )
      }

      {
        !inputVisible && (
          <Tag onClick={showInput} className="site-tag-plus">
            <PlusOutlined /> New Tag
          </Tag>
        )
      }

      <Modal
        title='Sure you want to delete?'
        centered
        open={open}
        onCancel={() => {
          setOpen(false)
        }}
        width={350}
        onOk={() => {//处理删除操作

          setOpen(false)

          //更新tags（删除指定tag后的tags）
          const newTags = tags.filter((tag) => tag !== removedTagRef.current);
          console.log(newTags);
          setTags(newTags);

          //如果勾选了“删除相关记录”，继续深度删除
          if (check && id && removedTagRef.current) { //删tag并且相关的记录 - 改 children & 删子类 & 删记录
            delete_subcate(id, removedTagRef.current).then(() => console.log('successfully delete this subcate'))
          }
        }}
        okText='delete'
      >
        <label>
          <input type="checkbox" checked={check} onChange={() => setCheck(!check)} />
          <label>Delete all records under this subcate at the same time.</label>
        </label>
      </Modal>

    </>
  )
}



const SubcateDisplay_blank = ({ tags, setTags, inputVisible, setInputVisible, inputValue, setInputValue, inputRef }: prop4) => {

  const handleClose = (removedTag: string) => { //点击删除tag触发的事件
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };
  const showInput = () => {
    setInputVisible(true);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };
  const forMap = (tag: string) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: "inline-block" }}>
        {tagElem}
      </span>
    );
  };
  const tagChild = tags.map(forMap);

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <TweenOneGroup
          enter={{
            scale: 0.8,
            opacity: 0,
            type: "from",
            duration: 100
          }}
          onEnd={(e) => {
            if (e.type === "appear" || e.type === "enter") {
              (e.target as any).style = "display: inline-block";
            }
          }}
          leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
          appear={false}
        >
          {tagChild}
        </TweenOneGroup>
      </div>

      {
        inputVisible && (
          <Input
            ref={inputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        )
      }

      {
        !inputVisible && (
          <Tag onClick={showInput} className="site-tag-plus">
            <PlusOutlined /> New Tag
          </Tag>
        )
      }

    </>
  )
}

export { Card, Blankcard }