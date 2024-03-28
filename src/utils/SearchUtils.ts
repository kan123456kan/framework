import { IPaintingsResponse } from './api';

export const filterPaintings = (
  paintings: IPaintingsResponse[] | undefined,
  searchValue: string
): IPaintingsResponse[] | undefined => {
  if (!searchValue) {
    return paintings;
  } else {
    return paintings?.filter((painting) =>
    painting.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  }
};
