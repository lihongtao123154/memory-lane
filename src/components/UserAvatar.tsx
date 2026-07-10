interface UserAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

function UserAvatar({ name, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-12 h-12 text-xl',
    lg: 'w-14 h-14 text-2xl',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-warm flex items-center justify-center flex-shrink-0`}>
      <span className="font-serif text-night-900">{name.charAt(0)}</span>
    </div>
  );
}

export default UserAvatar;