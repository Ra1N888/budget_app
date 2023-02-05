import { valueType } from 'antd/es/statistic/utils'
import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/home'
// import {cateProps} from '../type'

const getAll = (ledger_id:String) => {
  const request = axios.get(baseUrl+'/'+ledger_id)

  return request.then(response => response.data)
}

interface cateProps{
  name: string;
  isPlus: boolean;
  color: string;
  icon: string;
  subcates: string[];
  deleted: boolean;
}

interface Props_1{
  newCate:cateProps;
  ledger_id:string;
}

interface send_record {
  ledger: string;
  category: string;
  amount: number;
  note: string;
  date: Date;
}

interface edited_cate {
  id: string;
  isPlus: boolean;
  name: string;
  color: string;
  icon: string;
  children: string[];
  deleted: boolean;
}

const create_cate = ({newCate,ledger_id}:Props_1) => {
  const request = axios.post(baseUrl+'/'+ledger_id+'/add_cate', newCate)
  return request.then(response => response.data)
}

const create_record = (newRecord:send_record) => {
  const request = axios.post(baseUrl+'/'+newRecord.ledger+'/add_record', newRecord)
  return request.then(response => response.data)
}

const update_cate = (newCate:edited_cate) => {
  const request = axios.put(baseUrl+'/'+newCate.id+'/edit_cate', newCate)
  return request.then(response => response.data)
}

const delete_subcate = (cate_id:string, name: string, tag: string) => {
  const request = axios.delete(baseUrl+'/'+cate_id+'/'+name+'/'+tag)
  return request.then(response => response.data)
}

const add_subcates = (parent_cate:edited_cate) => {
  const request = axios.post(baseUrl+'/add_subcates', parent_cate)
  return request.then(response => response.data)
}

const update_children = (cate_id:string, new_children:string[]) => {
  const request = axios.put(baseUrl+'/'+cate_id+'/update_children', new_children)
  return request.then(response => response.data)
}


export { getAll, create_cate, create_record, update_cate, delete_subcate, add_subcates, update_children}


