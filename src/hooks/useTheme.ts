import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { toggleTheme } from '@/redux/reducer/themeReducer';

export const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentTheme = useSelector((state: RootState) => state.theme.mode);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return {
    mode: currentTheme,
    toggleTheme: handleToggleTheme,
  };
};

export const usePalette = () => {
  const palette = useSelector((state: RootState) => state.theme.palette);
  return palette;
};
