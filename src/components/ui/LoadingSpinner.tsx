interface LoadingSpinnerProps {
  size?: number;
}

export default function LoadingSpinner({ size = 20 }: LoadingSpinnerProps) {
  return (
    <span
      className="animate-spin inline-block rounded-full border-2 border-white/20 border-t-white"
      style={{ width: size, height: size }}
      aria-label="로딩 중"
    />
  );
}
