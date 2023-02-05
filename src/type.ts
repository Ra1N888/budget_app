
//存储所有的 分类的 type
export interface cateProps {
  _id: string;
  name: string;
  isPlus: boolean;
  color: string;
  icon: string;
  total: number;
  children: string[];
  deleted: boolean,
}
