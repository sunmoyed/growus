export type User = {
  displayName: string;
  imgSrc: string;
  username: string;
  updatedTime?;
};

export type Encouragement = {
  id?: string;
  text: string;
  editor;
};
