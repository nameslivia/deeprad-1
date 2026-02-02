export enum ProService {
  YES = 1,
  NO = 0,
}

interface ServiceProps {
  title: string;
  icon: string;
  pro: ProService;
  description: string;
}

export const serviceList: ServiceProps[] = [
  {
    title: 'Manuscript Peer Review',
    icon: 'BookOpenCheck',
    description:
      'Transform your review comments with intelligent contextual analysis and tone refinement, delivering clarity and professionalism without altering your original verdict.',
    pro: 0,
  },
  {
    title: 'Project Peer Review',
    icon: 'PenTool',
    description:
      'Enhance project evaluation with AI-powered reasoning that sharpens your insights, strengthens constructive impact, and safeguards your core judgment.',
    pro: 0,
  },
  {
    title: 'Manuscript Copilot',
    icon: 'Bot',
    description:
      'Draft scholarly manuscripts faster with deep search and context engineering, ensuring clear structure, strong logic, and academic-level rigor from start to finish.',
    pro: 0,
  },
];
