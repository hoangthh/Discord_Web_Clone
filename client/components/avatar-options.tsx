import { axiosInstance } from "@/api-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { Profile } from "@/models";

export const AvatarOptions = ({ profile }: { profile?: Profile }) => {
  const onLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      location.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full">
          <UserAvatar src={profile?.imageUrl} className="cursor-pointer" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
