import Singleboard from './Singleboard';
import './style.css'
import {cateProps} from '../../type'


interface Props {
  data: cateProps[][];
  // startTime: number[]; //存储三个数字，年/月/日
  // finishTime: number[]; 
}



const Cardboard: React.FC<Props> = ({ data }) => {

  const cates_expense:cateProps[] = data[0]
  const cates_income:cateProps[] = data[1]

  let expense:number = 0
  let income:number = 0

  cates_expense.forEach(item => {
    expense += item.total
  });

  cates_income.forEach(item => {
    income += item.total
  });

  console.log(expense,income)


  return (
    <>
    <Singleboard title='expense' cates={cates_expense} cates_amount={expense}/>
    <Singleboard title='income' cates={cates_income} cates_amount={income}/>
    </>
  )
}

export default Cardboard