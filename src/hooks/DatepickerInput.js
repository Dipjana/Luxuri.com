import React from 'react'
// const DatepickerInput = ({ ...props }) => (
//     <input type="text" {...props} readOnly />
//   );
  const DatepickerInput = React.forwardRef(( props, ref) => (
    <input type="text" {...props} ref={ref} readOnly />
  ));



export default DatepickerInput;