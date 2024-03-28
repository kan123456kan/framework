export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export const setTheme = (theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme);
};

export const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === Theme.Light ? Theme.Dark : Theme.Light;
  setTheme(newTheme);
};
