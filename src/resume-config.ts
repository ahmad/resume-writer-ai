import { ResumeData } from './types';

// Default resume configuration matching the sample PDF
export const defaultResumeData: ResumeData = {
  changeSummary: "Provide a summary of the changes made to the resume.",
  name: 'Ahmad Amin',
  title: 'Senior Full Stack Engineer',
  location: 'New York, NY',
  email: 'info@ahmadamin.com',
  phone: '+1 (347) 527-8553',
  linkedin: 'in/ahmadamin',
  website: 'ahmadamin.com',
  summary: 'Accomplished Full Stack Engineer with 14 years of experience, including a decade in a leadership role as Partner/CTO at Global Data Capture. A hands-on technical leader adept at orchestrating technology strategy, scaling secure architectures, and managing development teams. Expertise in modern full-stack technologies including TypeScript, Next.js, and AWS.',
  skills: {
    "Languages": [
      "TypeScript",
      "JavaScript",
      "PHP",
      "Node.js",
      "Swift",
      "C#",
      "SQL",
      "HTML",
      "CSS"
    ],
    "Frameworks": [
      "React",
      "Next.js",
      "React Native/Expo",
      "Unity/C#",
      "Express",
      "Laravel",
      "Zend Framework",
    ],
    "Databases": [
      "MySQL",
      "PostgreSQL",
      "Firebase",
      "MongoDB",
      "Supabase",
    ],
    "DevOps &Tools": [
      "Git",
      "Docker",
      "Linux",
      "AWS"
    ]
  },
  projects: [
    {
      title: 'MyTennis.Team',
      description: 'Team management platform that empowers tennis captains with advanced player analytics, match scheduling, and performance tracking capabilities.',
      link: {
        label: 'mytennis.team',
        href: 'https://mytennis.team'
      }
    },
    {
      title: 'SimplyReg',
      description: 'Mobile event registration and badge printing solution that streamlines attendee check-in, manages event credentials, and enables on-site badge printing for conferences and large-scale events.',
      link: {
        label: 'ahmadamin.com',
        href: 'https://ahmadamin.com'
      }
    }
  ],
  experience: [
    {
      title: 'Full Stack Engineer, Partner/CTO',
      company: 'Global Data Capture',
      period: 'April 2012 - Present',
      location: 'New York, NY',
      bullets: [
        'Led the development of cutting-edge products, leveraging emerging tech for competitive advantage.',
        'Designed scalable, secure tech architectures, ensuring quality and performance.',
        'Implemented robust risk and compliance frameworks, ensuring regulatory adherence.',
        'Collaborated with customers to translate insights into valuable product features.',
        'Orchestrated technology strategy aligned with business goals, driving innovation and growth.'
            ]
    },
    {
      title: 'Lead Developer',
      company: 'enter:marketing',
      period: 'February 2012 - March 2013',
      location: 'New York, NY',
      bullets: [
        'Managed a distributed team of remote developers, ensuring meticulous adherence to project scope and requirements.',
        'Simultaneously managed multiple projects, maintaining focus and organization to meet project deadlines and deliverables efficiently.',
        'Implemented best practices for coding standards and quality assurance, improving overall efficiency.',
        'Collaborated with stakeholders to gather requirements and prioritize feature development for products.'
      ]
    },
    {
      title: 'Software Engineer',
      company: 'BlueWorld, Inc.',
      period: 'April 2011 - February 2012',
      location: 'New York, NY',
      bullets: [
        'Developed and maintained web applications using PHP, MySQL, JavaScript/jQuery, and Zend Framework.',
        'Troubleshot and resolved complex technical issues to ensure system performance.',
        'Collaborated with product and design teams to create user-friendly features and enhancements.',
        'Developed and maintained backend systems for e-commerce platforms.',
        'Implemented best practices for code quality and performance optimization.'
      ]
    }
  ],
  education: [
    {
      degree: 'Computer Science',
      school: 'CUNY City College',
      location: 'New York, NY',
      year: '2010 - 2012'
    }
  ]
}; 