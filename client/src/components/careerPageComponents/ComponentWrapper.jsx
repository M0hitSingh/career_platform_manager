import React from 'react';

/**
 * Base wrapper component that applies branding colors to career page components
 * @param {Object} props
 * @param {string} props.primaryColor - Primary brand color (hex)
 * @param {string} props.secondaryColor - Secondary brand color (hex)
 * @param {string} props.textColor - Text color (hex)
 * @param {string} props.buttonColor - Button color (hex)
 * @param {string} props.backgroundColor - Background color (hex)
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 */
const ComponentWrapper = ({
  primaryColor,
  secondaryColor,
  textColor,
  buttonColor,
  backgroundColor,
  children,
  className = ''
}) => {
  // Create CSS custom properties for branding colors
  const style = {
    '--primary-color': primaryColor,
    '--secondary-color': secondaryColor,
    '--text-color': textColor,
    '--button-color': buttonColor,
    '--background-color': backgroundColor,
    padding: 0,
    margin: 0
  };

  return (
    <div className={`component-wrapper ${className}`} style={style}>
      {children}
    </div>
  );
};

export default ComponentWrapper;
