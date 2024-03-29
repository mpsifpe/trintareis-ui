import React  from 'react'
import { Notyf } from 'notyf';

export default React.createContext(
  new Notyf({
    duration: 3000,
    ripple: false,
    position: {
      x: 'right',
      y: 'top',
    },
    types: [
      {
        type: 'info',
        background: 'darkorange',
        icon: false,
        dismissible: true
      },
      {
        type: 'error',
        icon: false,
        dismissible: true
      },
      {
        type: 'success',
        icon: false,
        background: '#007900',
        dismissible: true
      }
    ]
  })
);