import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('card_tb')
export class CardEntity {
  @PrimaryGeneratedColumn()
  id: string; // 标记为主列，值自动生成
  // 文章标题
  @Column({ length: 50 })
  productID: string;

  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  productName: string;

  @Column({ type: 'mediumtext', default: null })
  remark: string;

  // 摘要，自动生成
  @Column({ type: 'text', default: null })
  rule: string;

  // 摘要，自动生成
  @Column({ type: 'text', default: null })
  littlepicture: string;

  // 摘要，自动生成
  @Column({ type: 'text', default: null })
  userID: string;
  // 摘要，自动生成
  @Column({ type: 'text', default: null })
  mainPic: string;
  // 摘要，自动生成
  @Column({ type: 'text', default: null })
  areaRead: string;
  updateTime: Date;
  @Column({ type: 'text', default: null })
  count: number;

  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  disableArea: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  area: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  photoType: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  positionform: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  parentProductID: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  operator: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  sPriceRead: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  sPrice: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  commissionType: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  zhutui: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  age1: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  age2: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  backMoneyType: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  numberSel: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  firstLevelMoney: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  phoneRepeat: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  idCardRepeat: string;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  acquireModel: string;
}
