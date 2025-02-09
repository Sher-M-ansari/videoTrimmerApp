import React from 'react';

export const navigationRef: any = React.createRef();

export const navigate = (name: string, params?: any) => {
  navigationRef.current?.navigate(name, params);
};
export const GoBack = () => {
  navigationRef.current?.goBack()
};
export const getRouteName = () => {
  let x = navigationRef?.current?.getCurrentRoute()
  return x?.name
};
