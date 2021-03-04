/**
 * 所有的图片资源都从这里统一管理
 */
// 底部导航栏的图片资源
interface TabIconProps{
  main: string,
  dashboard: string,
  dashboardGrey: string,
}

export const TabIcon: TabIconProps = {
    main: require('./favicon.png'),
    dashboard: require('./dashboard.png'),
    dashboardGrey: require('./dashboard-grey.png'),
  }
  