export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "vu-portfolio-theme";
export const DEFAULT_THEME: Theme = "dark";

// Runs in the document head before content paints, including static exports.
export const themeInitScript = `(()=>{let t;try{t=localStorage.getItem("${THEME_STORAGE_KEY}")}catch{}if(t!=="light"&&t!=="dark")t="${DEFAULT_THEME}";document.documentElement.dataset.theme=t})()`;
