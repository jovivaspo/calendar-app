export const getVariables = () => {
  import.meta.env;

  return {
    ...import.meta.env,
  };
};
