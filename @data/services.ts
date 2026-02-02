export enum ProService {
  YES = 1,
  NO = 0,
}

interface ServiceProps {
  icon: string;
  pro: ProService;
}

export const serviceList: ServiceProps[] = [
  {
    icon: 'BookOpenCheck',
    pro: 0,
  },
  {
    icon: 'PenTool',
    pro: 0,
  },
  {
    icon: 'Bot',
    pro: 0,
  },
];
