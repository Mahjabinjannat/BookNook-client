
"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  className?: string;
}

export default function UserAvatar({
  name,
  image,
  className,
}: UserAvatarProps) {
  const initial = name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <Avatar className={className ?? "size-9"}>
      {image?.trim() && (
        <AvatarImage
          src={image}
          alt={name ? `${name}'s profile photo` : "Profile photo"}
          className="object-cover"
        />
      )}

      <AvatarFallback className="bg-[#1d513b] font-semibold text-white">
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}
