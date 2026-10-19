import { Cable } from "lucide-react";

const icons: Record<string, string> = {
  react: "react",
  "react.js": "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  vue: "vuejs",
  "vue.js": "vuejs",
  "vue 2": "vuejs",
  "vue 3": "vuejs",
  "vue 2 / 3": "vuejs",
  "vue 2/3": "vuejs",
  "vue 2 & 3": "vuejs",
  vuex: "vuejs",
  js: "javascript",
  javascript: "javascript",
  typescript: "typescript",
  php: "php",
  laravel: "laravel",
  mysql: "mysql",
  scss: "sass",
  sass: "sass",
  bootstrap: "bootstrap",
  redux: "redux",
  "redux toolkit": "redux",
  "redux / redux toolkit": "redux",
  git: "git",
  docker: "docker",
  postman: "postman",
  figma: "figma",
};

type TechIconProps = {
  name: string;
  size?: number;
  className?: string;
};

export default function TechIcon({ name, size = 18, className }: TechIconProps) {
  const key = name.trim().replace(/\s+/g, " ").toLowerCase();
  const iconClassName = ["tech-icon", className].filter(Boolean).join(" ");

  if (key === "websocket" || key === "websockets") {
    return <Cable size={size} className={iconClassName} aria-hidden="true" focusable="false" />;
  }

  const icon = Object.prototype.hasOwnProperty.call(icons, key) ? icons[key] : undefined;
  if (!icon) return null;

  return (
    <img
      className={iconClassName}
      src={`/icons/tech/${icon}-original.svg`}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      loading="eager"
      decoding="async"
    />
  );
}

type TechLabelProps = {
  name: string;
  className?: string;
  iconSize?: number;
};

export function TechLabel({ name, className, iconSize = 18 }: TechLabelProps) {
  return (
    <span className={["tech-label", className].filter(Boolean).join(" ")}>
      <TechIcon name={name} size={iconSize} />
      {name}
    </span>
  );
}
