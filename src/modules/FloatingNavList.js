export default {
  styleType: {
    title: '布局',
    default: '1',
    options: [
      {
        title: '一排一',
        value: '1',
      },
      {
        title: '一排二',
        value: '2',
      },
      {
        title: '一排三',
        value: '3',
      },
    ],
  },
  childList: {
    type: Array,
    hiddenInEdit: true,
    default() {
      return []
    },
  },
}
