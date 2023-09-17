type Social = {
  label: string;
  link: string;
};

type Presentation = {
  mail: string;
  title: string;
  description: string;
  socials: Social[];
  profile?: string;
};

const presentation: Presentation = {
  mail: "zineelabidinemoualhi@gmail.com",
  title: "Hi, I’m Zine El Abidine 👋",
  profile: "/portfolio/profile.jpg",
  description:
    "Bonjour, i'm an *Algerian SRE* with experience in *Azure Cloud Services, Kuberentes, Terraform, Golang*. I am currently working at *IT-Challenge part of Simplifi-ED* on projects that involve *Kubernetes, Gitlab CICD & GitOps, Terraform & Ansible IaC*. Outside of work I read mangas and learn about GoLang.",
  socials: [
    {
      label: "𝕏",
      link: "https://twitter.com/fatnorth",
    },
    // {
    //   label: "Bento",
    //   link: "https://bento.me/m-wolff",
    // },
    {
      label: "Github",
      link: "https://github.com/muandane",
    },
  ],
};

export default presentation;
