import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    fontSize: 16,
    borderRadius: 10,
    colorPrimary: '#5A54F9',
  },
  components: {
    Layout: {
      headerBg: 'white'
    },
    Statistic: {
      contentFontSize: 22
    }
  }
};


export default theme;
