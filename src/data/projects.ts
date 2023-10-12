export type Project = {
  title: string;
  techs: string[];
  link: string;
  isComingSoon?: boolean;
};

const projects: Project[] = [
  {
    title: "Conventional Commits CLI",
    techs: ["Golang", "Brew", "Github-actions"],
    link: "https://github.com/muandane/goji",
  },
  {
    title: "Chart-version CLI+Helm Plugin",
    techs: ["Helm", "Golang", "Shell", "Kuberentes"],
    link: "https://github.com/muandane/chart-version",
  },
  {
    title: "AzurePrice CLI for checking prices of Azure services",
    techs: ["Cloud", "Golang", "Azure", "Zsh", "LipGloss"],
    link: "https://github.com/muandane/azureprice",
  },
  {
    title: "Pisq, postgreql database backup into Azure storage",
    techs: ["PostgresQL", "Golang", "Azure"],
    link: "https://github.com/muandane/pisq",
    isComingSoon: true,
  },
];

export default projects;
