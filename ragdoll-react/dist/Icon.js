const Icon = ({
  src,
  size = 20
}) => /*#__PURE__*/React.createElement("img", {
  src: src,
  alt: `icon-${src.slice(src.lastIndexOf('/') + 1, src.lastIndexOf('.'))}`,
  width: `${size}px`,
  height: `${size}px`
});
export default Icon;