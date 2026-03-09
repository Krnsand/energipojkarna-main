import { useAppSelector } from '@/lib/redux/hooks'

export const useWindowSize = () => {
  return {
    isLoaded: useAppSelector(state => state.window.isLoaded),
    width: useAppSelector(state => state.window.width),
    height: useAppSelector(state => state.window.height),
    isMobile: useAppSelector(state => state.window.isMobile),
    isTablet: useAppSelector(state => state.window.isTablet),
    isDesktop: useAppSelector(state => state.window.isDesktop),
    gutter: useAppSelector(state => state.window.gutter),
  }
}
