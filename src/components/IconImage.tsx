import Image from 'next/image';

export default function IconImage() {
  return (
    <Image
      src="/images/icon.png"
      alt="icon"
      width={25}
      height={25}
    />
  );
}
