import { useState } from 'react'
import { Card, Blankcard } from '../Card/Card';
import './style.css'
import { cateProps } from '../../type'

interface Props {
  title: string;
  cates: cateProps[]
  cates_amount: number;
}

const Singleboard = ({ title, cates, cates_amount }: Props) => {

  const [categories, setcategories] = useState<cateProps[]>(cates)
  const [total, setTotal] = useState<number>(cates_amount)

  return (
    <div className='cardboard'>
      <div className='sum_text'>{title}: ¥{total}</div>
      <ul className='card_container'>
        {categories.map(cate =>
          <div key={cate._id} className='single_card'>
            <Card
              _id={cate._id}
              isPlus={cate.isPlus}
              name={cate.name}
              color={cate.color}
              icon={cate.icon}
              amount={cate.total}
              children={cate.children}
              total={total}
              setTotal={setTotal}
            ></Card>
          </div>
        )}
        <Blankcard type={title} categories={categories} setcategories={setcategories} />
      </ul>
    </div>
  )
}

export default Singleboard