import { Icon } from '@iconify/vue'

const aliases = {
  collapse: 'tabler-chevron-up',
  complete: 'tabler-check',
  cancel: 'tabler-x',
  close: 'tabler-x',
  delete: 'tabler-x',
  clear: 'tabler-x',
  success: 'tabler-circle-check',
  info: 'tabler-info-circle',
  warning: 'tabler-alert-circle',
  error: 'tabler-x',
  prev: 'tabler-chevron-left',
  next: 'tabler-chevron-right',
  /* checkboxOn: 'tabler-refresh',
  checkboxOff: 'tabler-refresh',
  checkboxIndeterminate: 'tabler-refresh', */
  delimiter: 'tabler-circle',
  sort: 'tabler-arrow-up',
  expand: 'tabler-chevron-down',
  menu: 'tabler-menu-2',
  subgroup: 'tabler-caret-down',
  dropdown: 'tabler-chevron-down',
  // radioOn: 'custom-checked-radio',
  // radioOff: 'custom-unchecked-radio',
  edit: 'tabler-pencil',
  // ratingEmpty: 'custom-star-empty',
  // ratingFull: 'custom-star-fill',
  // ratingHalf: 'custom-star-half',
  loading: 'tabler-refresh',
  first: 'tabler-player-skip-back',
  last: 'tabler-player-skip-forward',
  unfold: 'tabler-arrows-move-vertical',
  file: 'tabler-paperclip',
  plus: 'tabler-plus',
  minus: 'tabler-minus',
  sortAsc: 'tabler-arrow-up',
  sortDesc: 'tabler-arrow-down',
}

const iconify = {
  component: props => h(Icon, props),
}

const icons = {
  defaultSet: 'iconify',
  aliases,
  sets: {
    iconify,
  },
}

export default icons
