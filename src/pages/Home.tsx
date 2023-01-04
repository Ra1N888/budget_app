import Cardboard from '../components/Cardboard/Cardboard'
import { cateProps } from '../hooks/useDate';
import { useState, useEffect, useRef } from 'react';
import { LedgerContext } from '../context';

const Home = () => {

  const [data, setData] = useState();
  const [selected, setSelected] = useState<number>(0);

  //这里以后肯定要改掉，不可以随便用useRef！
  const myRef = useRef<string>('nothing'); 

  var ledger_id: string = ''

  //默认把账本数组的0个元素作为初始显示的账本
  useEffect(() => {
    const dataFetch = async () => {
      const all_ledgers = await (await fetch('http://localhost:3001/api/home/ledgers')).json();
      ledger_id = all_ledgers[selected].id.toString();
      myRef.current = ledger_id
      const data = await (await fetch('http://localhost:3001/api/home/' + ledger_id)).json();
      setData(data);
    };

    dataFetch();
  }, [selected]);

  console.log(myRef.current)

  if (!data) return <div>loading</div>;

  return (
    <div>
      <LedgerContext.Provider value={myRef.current}>
        <Cardboard
          data={data}
        />
      </LedgerContext.Provider>
    </div>
  )
}

export default Home