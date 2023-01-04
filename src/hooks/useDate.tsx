import { useState, useEffect } from "react";

export interface cateProps {
  _id: string;
  name: string;
  isPlus: boolean;
  color: string;
  icon: string;
  total: number;
  data: Date;
}


export const useData = <T extends unknown>(url: string) => {
  const [data, setData] = useState<T>();

  useEffect(() => {
    const dataFetch = async () => {
      const data = await (await fetch(url)).json();
      setData(data);
    };

    dataFetch();
  }, [url]);

  return data;
};

