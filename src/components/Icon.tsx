import React from 'react'

function Icon({
  name,
  ...rest
}: {
  name: string
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}) {
  return (
    <i className="material-icons" {...rest}>
      {name}
    </i>
  )
}

export default Icon
