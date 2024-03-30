import Image from 'next/image';

const Icon = ({ src, size = 20 }) => (
  <Image
    src={src}
    alt={
      `icon-${src.slice(src.lastIndexOf('/') + 1, src.lastIndexOf('.'))}`
    }
    width={size}
    height={size}
    priority
  />
);

export default Icon;
